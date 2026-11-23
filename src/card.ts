import { LitElement, type TemplateResult } from "lit";
import "./editor";
import { ConfigError, type NormalizedConfig, type RawCardConfig } from "./config/types";
import { normalizeConfig } from "./config/normalize";
import { commandFromEvent, parseCommand, type Command } from "./ha/command";
import { callScript, fireCardEvent, type CardEventPayload } from "./ha/events";
import { cameraImageUrl, writeHelper } from "./ha/entity";
import type { HassEntity, HassLike } from "./ha/types";
import { languageOf } from "./model/i18n";
import { applyEvent, initialModel, type ClientEvent, type SipModel } from "./model/state";
import { deriveView, type CardAction, type CardView } from "./model/view";
import { acquireClient, releaseClient } from "./sip/hub";
import { resolveSipConfig, type ResolvedSipConfig } from "./sip/resolve";
import type { SipClientLike } from "./sip/types";
import { targetUri } from "./sip/uri";
import { renderCard } from "./ui/render";
import { styles } from "./ui/styles";
import type { UiModel } from "./ui/contract";

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

const ERROR_VIEW: CardView = {
  phase: "error",
  tone: "danger",
  icon: "alert",
  title: "Tessera SIP",
  subtitle: "Configuration",
  controls: [],
  pulse: false,
  busy: false,
  showCamera: false,
  registered: false,
  muted: false,
};

export class TesseraSipCard extends LitElement {
  static override styles = styles;

  static getStubConfig(): RawCardConfig {
    return {
      name: "Front door",
      call_target: "555",
      call_label: "Pick up the doorbell",
      camera: "camera.front_door",
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("tessera-sip-card-editor");
  }

  getCardSize(): number {
    return 3;
  }

  getGridOptions(): Record<string, unknown> {
    return {
      columns: 6,
      rows: 3,
      min_columns: 3,
      min_rows: 2,
    };
  }

  private _raw?: RawCardConfig;
  private _config?: NormalizedConfig;
  private _configError?: string;
  private _error?: string;
  private _hass?: HassLike;
  private _model: SipModel = initialModel();
  private _client?: SipClientLike;
  private _resolved?: ResolvedSipConfig;
  private _loading = false;
  private _booted = false;
  private _bootToken = 0;
  private _now = Date.now();
  private _cameraUrl?: string;
  private _unsubClient?: () => void;
  private _unsubState?: () => void;
  private _unsubEvent?: () => void;
  private _ticker?: ReturnType<typeof setInterval>;
  private _tickCount = 0;
  private _lastStateValue?: string;
  private _lastPeerValue?: string;
  private _lastCommand?: string;
  private _lastFire?: { key: string; at: number };

  override connectedCallback(): void {
    super.connectedCallback();
    void this.bootstrap();
  }

  override disconnectedCallback(): void {
    this.stopTicker();
    this.unsubscribeAll();
    if (this._client) releaseClient(this._client.key);
    super.disconnectedCallback();
  }

  set hass(hass: HassLike) {
    const first = !this._hass;
    this._hass = hass;
    this._now = Date.now();
    this.refreshCamera();
    if (first || !this._booted) {
      void this.bootstrap();
    } else {
      this.requestUpdate();
    }
  }

  get hass(): HassLike | undefined {
    return this._hass;
  }

  setConfig(raw: RawCardConfig): void {
    if (!raw || typeof raw !== "object") {
      throw new ConfigError("The card needs a configuration object.");
    }
    this._raw = raw;
    this._bootToken += 1;
    this.unsubscribeAll();
    this.stopTicker();
    this._booted = false;
    this._client = undefined;
    this._resolved = undefined;
    this._model = initialModel();
    this._lastStateValue = undefined;
    this._lastPeerValue = undefined;
    this._lastCommand = undefined;

    try {
      this._config = normalizeConfig(raw);
      this._configError = undefined;
    } catch (error) {
      this._config = undefined;
      this._configError = error instanceof Error ? error.message : String(error);
    }
    this.requestUpdate();
    void this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    if (!this._raw || !this._hass) return;
    if (this._configError || !this._config) return;

    const token = ++this._bootToken;
    this.unsubscribeAll();
    const hass = this._hass;
    const config = this._config;

    this._loading = true;
    this._error = undefined;
    this.requestUpdate();

    let resolved: ResolvedSipConfig;
    try {
      resolved = await resolveSipConfig(config, hass);
    } catch (error) {
      if (token !== this._bootToken) return;
      this._loading = false;
      this._error = error instanceof Error ? error.message : String(error);
      this._model = applyEvent(initialModel(), { type: "error", message: this._error });
      this.requestUpdate();
      return;
    }

    if (token !== this._bootToken) return;

    this._resolved = resolved;
    if (resolved.warnings.length > 0) {
      console.info("tessera-sip-card:", resolved.warnings.join(" "));
    }
    if (
      resolved.source === "sip_core" &&
      typeof customElements !== "undefined" &&
      customElements.get("sip-call-button")
    ) {
      console.warn(
        "tessera-sip-card: SIP Core is loaded on this page and registers the same extension. " +
          "Use a dedicated extension (set `extension` and `password`) or the two user agents will " +
          "replace each other's registration.",
      );
    }

    const client = acquireClient(resolved);
    this._client = client;
    this._unsubClient = client.on((event) => this.onClientEvent(event));
    this._loading = false;
    this._booted = true;

    for (const event of client.describe()) {
      this.onClientEvent(event, true);
    }

    void client.ensureStarted().catch((error) => this.onActionError(error));
    await this.subscribeCommands(token);
    this.publishState();
    this.requestUpdate();
  }

  private unsubscribeAll(): void {
    this._unsubClient?.();
    this._unsubClient = undefined;
    this._unsubState?.();
    this._unsubState = undefined;
    this._unsubEvent?.();
    this._unsubEvent = undefined;
  }

  private async subscribeCommands(token: number): Promise<void> {
    const hass = this._hass;
    const config = this._config;
    const connection = hass?.connection;
    if (!hass || !config || !connection?.subscribeEvents) return;

    try {
      if (config.commandEntity) {
        const entityId = config.commandEntity;
        this._unsubState = await connection.subscribeEvents((event) => {
          const data = event.data as {
            entity_id?: string;
            new_state?: HassEntity | null;
          };
          if (data.entity_id !== entityId) return;
          const value = data.new_state?.state;
          if (!value || value === this._lastCommand) return;
          this._lastCommand = value;
          const command = parseCommand(value);
          if (command) void this.runCommand(command);
          if (config.clearCommand) void writeHelper(hass, entityId, "");
        }, "state_changed");
      }

      if (token !== this._bootToken) return;

      this._unsubEvent = await connection.subscribeEvents((event) => {
        const command = commandFromEvent(event.data);
        if (command) void this.runCommand(command);
      }, `${config.eventType}_command`);
    } catch (error) {
      console.warn("tessera-sip-card: could not subscribe to commands", error);
    }
  }

  private onClientEvent(event: ClientEvent, replay = false): void {
    const before = this._model;
    const after = applyEvent(before, event, Date.now());
    this._model = after;
    if (!replay) this.afterTransition(before, after, event);
    this.refreshCamera();
    this.updateTicker();
    this.requestUpdate();
  }

  private afterTransition(before: SipModel, after: SipModel, event: ClientEvent): void {
    switch (event.type) {
      case "registration":
        if (event.state === "registered") {
          this.fire("registered", after);
        } else if (event.state === "unregistered") {
          this.fire("unregistered", after, event.error);
        } else if (event.state === "failed") {
          this.fire("error", after, event.error);
        }
        break;
      case "incoming":
        this.fire("ringing", after);
        break;
      case "outgoing":
        this.fire("dialing", after);
        break;
      case "connected":
        this.fire("answered", after);
        if (this._config?.answerScript) void callScript(this._hass!, this._config.answerScript);
        break;
      case "ended": {
        const duration =
          before.callStarted !== undefined
            ? Math.max(0, Math.round((Date.now() - before.callStarted) / 1000))
            : undefined;
        this.fire("ended", after, event.error, duration);
        if (this._config?.endScript) void callScript(this._hass!, this._config.endScript);
        break;
      }
      case "error":
        this.fire("error", after, event.message);
        break;
      default:
        break;
    }
    this.publishState();
  }

  private fire(
    event: CardEventPayload["event"],
    model: SipModel,
    error?: string,
    duration?: number,
  ): void {
    const config = this._config;
    const hass = this._hass;
    if (!config || !hass) return;

    const key = `${event}|${model.phase}|${model.peer ?? ""}|${error ?? ""}`;
    const now = Date.now();
    if (this._lastFire && this._lastFire.key === key && now - this._lastFire.at < 800) return;
    this._lastFire = { key, at: now };

    if (config.eventEntity) {
      const line = [event, model.phase, model.peerName ?? model.peer ?? "", duration ?? "", error ?? "", now]
        .join("|")
        .slice(0, 255);
      void writeHelper(hass, config.eventEntity, line);
    }

    void fireCardEvent(hass, config.eventType, {
      card: config.id,
      event,
      phase: model.phase,
      peer: model.peerName ?? model.peer,
      direction: model.direction,
      duration,
      error,
      timestamp: new Date(now).toISOString(),
    });
  }

  private publishState(): void {
    const config = this._config;
    const hass = this._hass;
    if (!config || !hass) return;

    const state = this._model.phase;
    if (config.stateEntity && state !== this._lastStateValue) {
      this._lastStateValue = state;
      void writeHelper(hass, config.stateEntity, state);
    }

    const peer = this._model.peerName ?? this._model.peer ?? "";
    if (config.peerEntity && peer !== this._lastPeerValue) {
      this._lastPeerValue = peer;
      void writeHelper(hass, config.peerEntity, peer);
    }
  }

  /** A setup problem: the whole tile becomes a readable error. */
  private onFailure(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this._error = message;
    this._model = applyEvent(this._model, { type: "error", message });
    this.fire("error", this._model, message);
    this.requestUpdate();
  }

  /** A key failed while the card is usable: keep the tile, show the reason. */
  private onActionError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this._model = applyEvent(this._model, { type: "error", message });
    this.fire("error", this._model, message);
    this.requestUpdate();
  }

  private refreshCamera(): void {
    this._cameraUrl = cameraImageUrl(this._hass, this._config?.camera);
  }

  private updateTicker(): void {
    const wanted = this._model.phase === "connected";
    if (wanted && !this._ticker) {
      this._ticker = setInterval(() => {
        this._now = Date.now();
        this._tickCount += 1;
        if (this._tickCount % 10 === 0) this.refreshCamera();
        this.requestUpdate();
      }, 1000);
    } else if (!wanted && this._ticker) {
      this.stopTicker();
    }
  }

  private stopTicker(): void {
    if (!this._ticker) return;
    clearInterval(this._ticker);
    this._ticker = undefined;
  }

  private handleAction(action: CardAction): void {
    const client = this._client;
    switch (action.id) {
      case "call":
        void client?.call().catch((error) => this.onActionError(error));
        break;
      case "answer":
        void client?.answer().catch((error) => this.onActionError(error));
        break;
      case "decline":
        void client?.decline().catch((error) => this.onActionError(error));
        break;
      case "hangup":
        void client?.hangup().catch((error) => this.onActionError(error));
        break;
      case "mute":
        client?.setMuted(true);
        break;
      case "unmute":
        client?.setMuted(false);
        break;
      case "dtmf":
        if (action.digit) void client?.sendDtmf(action.digit).catch((error) => this.onActionError(error));
        break;
      case "enable_audio":
        void this.enableAudio();
        break;
      case "retry":
        this.retry();
        break;
      default:
        break;
    }
  }

  private async enableAudio(): Promise<void> {
    try {
      await this._client?.enableAudio();
      this._model = applyEvent(this._model, { type: "audio-unlocked" });
    } catch (error) {
      this._model = applyEvent(this._model, { type: "audio-blocked" });
      this.onActionError(error);
    }
    this.requestUpdate();
  }

  private retry(): void {
    this._error = undefined;
    this._model = applyEvent(this._model, { type: "retry" });
    if (!this._client || !this._resolved) {
      this._booted = false;
      void this.bootstrap();
    } else {
      this._client.restart();
    }
    this.requestUpdate();
  }

  private async runCommand(command: Command): Promise<void> {
    const client = this._client;
    if (!client) return;
    try {
      switch (command.action) {
        case "answer":
          await client.answer();
          break;
        case "decline":
          await client.decline();
          break;
        case "hangup":
          await client.hangup();
          break;
        case "retry":
          this.retry();
          break;
        case "mute":
          client.setMuted(true);
          break;
        case "unmute":
          client.setMuted(false);
          break;
        case "enable_audio":
          await this.enableAudio();
          break;
        case "call":
          await client.call(
            command.value && this._resolved
              ? targetUri(command.value, this._resolved.domain)
              : undefined,
          );
          break;
        case "dtmf":
          if (command.value) {
            for (const digit of command.value) {
              if (/[0-9*#]/.test(digit)) await client.sendDtmf(digit);
            }
          }
          break;
      }
    } catch (error) {
      this.onActionError(error);
    }
  }

  private uiModel(): UiModel {
    const config = this._config;
    const language = languageOf(config?.language ?? this._hass?.locale?.language);
    const view = config
      ? deriveView(this._model, config, language, this._now)
      : { ...ERROR_VIEW, hint: this._configError };

    return {
      view,
      config,
      cameraUrl: this._cameraUrl,
      error: this._configError ?? this._error,
      loading: this._loading,
      audioBlocked: this._model.audioBlocked,
      now: this._now,
    };
  }

  protected override render(): TemplateResult {
    return renderCard(this.uiModel(), {
      action: (action) => this.handleAction(action),
      enableAudio: () => void this.enableAudio(),
    });
  }
}

if (!customElements.get("tessera-sip-card")) {
  customElements.define("tessera-sip-card", TesseraSipCard);
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "tessera-sip-card")) {
  window.customCards.push({
    type: "tessera-sip-card",
    name: "Tessera SIP",
    description: "Answer a SIP doorbell and talk, with the look of a Tessera tile.",
    preview: true,
    documentationURL: "https://github.com/Babo96/tessera-sip-card",
  });
}
