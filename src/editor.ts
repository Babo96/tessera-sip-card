import { LitElement, css, html, type TemplateResult } from "lit";
import type { RawCardConfig } from "./config/types";
import type { HassLike } from "./ha/types";

const SCHEMA: Array<Record<string, unknown>> = [
  { name: "name", selector: { text: {} } },
  { name: "icon", selector: { icon: {} } },
  { name: "call_target", selector: { text: {} } },
  { name: "call_label", selector: { text: {} } },
  { name: "camera", selector: { entity: { domain: "camera" } } },
  { name: "use_sip_core", selector: { boolean: {} } },
  {
    name: "wss_url",
    selector: { text: {} },
    helper: "Only needed when SIP Core has no custom WSS URL.",
  },
  { name: "extension", selector: { text: {} } },
  { name: "pbx_server", selector: { text: {} } },
  { name: "password", selector: { text: { type: "password" } } },
  { name: "auto_answer", selector: { boolean: {} } },
  { name: "auto_answer_delay", selector: { number: { min: 0, max: 30, step: 1, mode: "box" } } },
  {
    name: "state_entity",
    selector: { entity: { domain: ["input_text", "input_select"] } },
    helper: "The card writes its phase here for Tessera and automations.",
  },
  {
    name: "peer_entity",
    selector: { entity: { domain: ["input_text", "input_select"] } },
  },
  {
    name: "event_entity",
    selector: { entity: { domain: ["input_text"] } },
    helper: "One line per transition, for a non-admin kiosk. Events need an admin user.",
  },
  {
    name: "command_entity",
    selector: { entity: { domain: ["input_text", "input_select"] } },
    helper: "Write answer / decline / hangup / call:555 / dtmf:1 here to control the card.",
  },
  { name: "clear_command", selector: { boolean: {} } },
  { name: "answer_script", selector: { entity: { domain: "script" } } },
  { name: "end_script", selector: { entity: { domain: "script" } } },
  { name: "debug", selector: { boolean: {} } },
];

export class TesseraSipCardEditor extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    ha-form {
      display: block;
    }
    details {
      margin-top: 12px;
    }
    textarea {
      width: 100%;
      min-height: 160px;
      box-sizing: border-box;
      font-family: var(--code-font-family, monospace);
      font-size: 12px;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #111);
    }
  `;

  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass?: HassLike;
  private _config: RawCardConfig = {};

  setConfig(config: RawCardConfig): void {
    this._config = { ...config };
  }

  private onFormChanged(event: CustomEvent<{ value: RawCardConfig }>): void {
    const value = { ...this._config, ...event.detail.value };
    this._config = value;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onJsonChanged(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    try {
      const parsed = JSON.parse(textarea.value) as RawCardConfig;
      this._config = parsed;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: parsed },
          bubbles: true,
          composed: true,
        }),
      );
    } catch {
      // Keep typing; the current config stays valid.
    }
  }

  protected override render(): TemplateResult {
    const hasForm = Boolean(customElements.get("ha-form"));
    return html`
      ${hasForm
        ? html`<ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${SCHEMA}
            .computeLabel=${(schema: { name: string }) => labelOf(schema.name)}
            @value-changed=${this.onFormChanged}
          ></ha-form>`
        : html`<p>Home Assistant's form components are not available here. Edit the YAML below.</p>`}
      <details>
        <summary>Advanced (all options, including buttons)</summary>
        <textarea .value=${JSON.stringify(this._config, null, 2)} @change=${this.onJsonChanged}></textarea>
      </details>
    `;
  }
}

const LABELS: Record<string, string> = {
  name: "Name",
  icon: "Icon",
  call_target: "Call target",
  call_label: "Call button",
  camera: "Camera",
  use_sip_core: "Use the SIP Core account",
  wss_url: "WebSocket URL",
  extension: "Extension",
  pbx_server: "PBX server",
  password: "SIP password",
  auto_answer: "Answer automatically",
  auto_answer_delay: "Answer after (seconds)",
  state_entity: "State helper",
  peer_entity: "Caller helper",
  event_entity: "Event helper",
  command_entity: "Command helper",
  clear_command: "Clear the command after it runs",
  answer_script: "On answer",
  end_script: "On hang up",
  debug: "Debug logging",
};

function labelOf(name: string): string {
  return LABELS[name] ?? name;
}

if (!customElements.get("tessera-sip-card-editor")) {
  customElements.define("tessera-sip-card-editor", TesseraSipCardEditor);
}
