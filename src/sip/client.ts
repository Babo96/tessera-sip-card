import {
  Invitation,
  Inviter,
  Registerer,
  RegistererState,
  Session,
  SessionState,
  UserAgent,
  Web,
} from "sip.js";
import type { ClientEvent, EndReason } from "../model/state";
import type { ResolvedSipConfig } from "./resolve";
import type { SipClientLike } from "./types";

/**
 * One SIP.js user agent for one account, shared by every card on the page.
 *
 * It owns registration, incoming and outgoing calls, the remote audio element
 * and reconnection. Everything it wants the UI to know is a `ClientEvent`.
 */
export class SipJsClient implements SipClientLike {
  readonly key: string;

  private readonly config: ResolvedSipConfig;
  private readonly listeners = new Set<(event: ClientEvent) => void>();

  private ua?: UserAgent;
  private registerer?: Registerer;
  private session?: Session;
  private pending?: Invitation;
  private starting?: Promise<void>;
  private stopped = true;

  private audio?: HTMLAudioElement;
  private ringtone?: HTMLAudioElement;

  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private reconnectAttempt = 0;
  private autoAnswerTimer?: ReturnType<typeof setTimeout>;
  private endReason: EndReason = "remote";
  private sessionDirection?: "incoming" | "outgoing";
  private _muted = false;
  private visibilityHandler?: () => void;
  private generation = 0;
  private hasRegistered = false;

  constructor(config: ResolvedSipConfig) {
    this.config = config;
    this.key = config.key;
  }

  get muted(): boolean {
    return this._muted;
  }

  private get registered(): boolean {
    return this.registerer?.state === RegistererState.Registered;
  }

  describe(): ClientEvent[] {
    const events: ClientEvent[] = [];
    if (this.registerer?.state === RegistererState.Registered) {
      events.push({ type: "registration", state: "registered" });
    }

    const session = this.pending ?? this.session;
    if (session) {
      const peer =
        session.remoteIdentity.uri.user || session.remoteIdentity.uri.toString();
      const direction = this.sessionDirection ?? "incoming";
      events.push({
        type: direction,
        peer,
        peerName: session.remoteIdentity.displayName || undefined,
      });
      if (session.state === SessionState.Established) {
        events.push({ type: "connected" });
      }
    }

    if (this._muted) events.push({ type: "muted", muted: true });
    return events;
  }

  on(listener: (event: ClientEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: ClientEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (error) {
        console.error("tessera-sip-card: listener failed", error);
      }
    }
  }

  private debug(...args: unknown[]): void {
    if (this.config.debug) console.debug("[tessera-sip]", ...args);
  }

  async ensureStarted(): Promise<void> {
    if (this.starting) return this.starting;
    if (!this.stopped) return;
    this.stopped = false;
    const run = this.start();
    this.starting = run;
    try {
      await run;
    } finally {
      if (this.starting === run) this.starting = undefined;
    }
  }

  private async start(): Promise<void> {
    const generation = ++this.generation;
    this.hasRegistered = false;
    this.emit({ type: "registration", state: "registering" });
    this.ensureAudioElement();

    const uri = UserAgent.makeURI(this.config.uri);
    if (!uri) throw new Error(`Invalid SIP URI: ${this.config.uri}`);

    const ua = new UserAgent({
      uri,
      transportOptions: { server: this.config.wssUrl },
      authorizationUsername: this.config.authUser,
      authorizationPassword: this.config.password,
      displayName: this.config.displayName,
      logLevel: this.config.debug ? "debug" : "error",
      sessionDescriptionHandlerFactoryOptions: {
        iceGatheringTimeout: this.config.iceGatheringTimeout,
        peerConnectionConfiguration: {
          iceServers: this.config.iceServers,
          iceTransportPolicy: this.config.iceTransportPolicy,
        },
      },
      delegate: {
        onInvite: (invitation) => {
          if (this.ua !== ua) return;
          this.handleInvite(invitation);
        },
        onDisconnect: (error) => {
          if (this.ua !== ua) return;
          this.handleTransportClosed(error);
        },
        onConnect: () => this.debug("transport connected"),
      },
    });

    try {
      await ua.start();
    } catch (error) {
      if (generation !== this.generation) return;
      this.stopped = true;
      this.emit({
        type: "registration",
        state: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }

    if (generation !== this.generation) {
      // A newer restart replaced this attempt while the transport was opening.
      try {
        void ua.stop();
      } catch {
        // Nothing left to stop.
      }
      return;
    }

    this.ua = ua;
    const registerer = new Registerer(ua);
    this.registerer = registerer;
    registerer.stateChange.addListener((state) => {
      if (this.registerer !== registerer) return;
      this.handleRegistration(state);
    });

    try {
      await registerer.register();
    } catch (error) {
      this.emit({
        type: "registration",
        state: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // A hidden tab's timers are suspended; on return the UA can be silently
    // dead. Give it a few seconds, then restart once if nothing is up.
    if (typeof document !== "undefined" && !this.visibilityHandler) {
      this.visibilityHandler = () => {
        if (document.visibilityState !== "visible") return;
        setTimeout(() => {
          if (this.stopped || this.registered || this.session || this.pending || this.starting) return;
          this.debug("still unregistered after becoming visible; restarting");
          this.restart();
        }, 4_000);
      };
      document.addEventListener("visibilitychange", this.visibilityHandler);
    }
  }

  private handleRegistration(state: RegistererState): void {
    this.debug("registration", state);
    switch (state) {
      case RegistererState.Registered:
        this.hasRegistered = true;
        this.reconnectAttempt = 0;
        this.emit({ type: "registration", state: "registered" });
        break;
      case RegistererState.Unregistered:
        if (!this.stopped) {
          this.emit({ type: "registration", state: "unregistered" });
          if (this.hasRegistered && !this.session && !this.pending) this.scheduleReconnect();
          this.hasRegistered = false;
        }
        break;
      case RegistererState.Terminated:
        if (!this.stopped) {
          this.emit({ type: "registration", state: "unregistered" });
          if (this.hasRegistered) this.scheduleReconnect();
          this.hasRegistered = false;
        }
        break;
      default:
        break;
    }
  }

  private handleTransportClosed(error?: Error): void {
    this.debug("transport closed", error);
    if (this.stopped) return;
    this.emit({
      type: "registration",
      state: "unregistered",
      error: error?.message,
    });
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.stopped || this.reconnectTimer) return;
    const delay = Math.min(30_000, 1_000 * 2 ** this.reconnectAttempt);
    this.reconnectAttempt += 1;
    this.debug(`reconnect in ${delay} ms`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      if (this.stopped) return;
      this.restart();
    }, delay);
  }

  private handleInvite(invitation: Invitation): void {
    this.debug("incoming call", invitation.remoteIdentity.uri.toString());
    this.pending = invitation;
    this.endReason = "remote";
    this.sessionDirection = "incoming";
    this.wireSession(invitation);

    const peer = invitation.remoteIdentity.uri.user || invitation.remoteIdentity.uri.toString();
    this.emit({
      type: "incoming",
      peer,
      peerName: invitation.remoteIdentity.displayName || undefined,
    });

    this.playRingtone();

    if (this.config.autoAnswer) {
      const delay = Math.max(0, this.config.autoAnswerDelay) * 1000;
      this.autoAnswerTimer = setTimeout(() => {
        this.answer().catch((error) => this.debug("auto answer failed", error));
      }, delay);
    }
  }

  private wireSession(session: Session): void {
    session.stateChange.addListener((state) => {
      this.debug("session", state);
      switch (state) {
        case SessionState.Established:
          this.session = session;
          this.pending = undefined;
          this.clearAutoAnswer();
          this.stopRingtone();
          this.attachRemoteAudio(session);
          this.emit({ type: "connected" });
          break;
        case SessionState.Terminated:
          this.handleTerminated(session);
          break;
        default:
          break;
      }
    });
  }

  private handleTerminated(session: Session): void {
    if (this.session !== session && this.pending !== session) return;
    this.session = undefined;
    this.pending = undefined;
    this.clearAutoAnswer();
    this.stopRingtone();
    this.detachAudio();
    this._muted = false;
    const reason = this.endReason;
    this.endReason = "remote";
    this.emit({ type: "ended", reason });
  }

  private sessionDescriptionHandlerOptions() {
    return {
      constraints: {
        audio: true,
        video: this.config.video,
      },
    };
  }

  async call(target?: string): Promise<void> {
    await this.ensureStarted();
    if (!this.ua) throw new Error("SIP is not started.");
    if (this.session || this.pending) throw new Error("There is already a call.");

    const targetUri = target ?? this.config.callTargetUri;
    const uri = UserAgent.makeURI(targetUri);
    if (!uri) throw new Error(`Invalid call target: ${targetUri}`);

    const inviter = new Inviter(this.ua, uri, {
      sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions(),
    });

    this.session = inviter;
    this.endReason = "remote";
    this.sessionDirection = "outgoing";
    this.wireSession(inviter);
    this.emit({
      type: "outgoing",
      peer: uri.user || uri.toString(),
    });

    try {
      await inviter.invite();
    } catch (error) {
      this.endReason = "failed";
      this.session = undefined;
      this.emit({
        type: "ended",
        reason: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async answer(): Promise<void> {
    const invitation = this.pending;
    if (!invitation) return;
    this.clearAutoAnswer();
    await invitation.accept({
      sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions(),
    });
  }

  async decline(): Promise<void> {
    const invitation = this.pending;
    if (!invitation) return;
    this.endReason = "declined";
    this.clearAutoAnswer();
    this.stopRingtone();
    await invitation.reject();
  }

  async hangup(): Promise<void> {
    if (this.pending) {
      await this.decline();
      return;
    }
    const session = this.session;
    if (!session) return;
    this.stopRingtone();
    switch (session.state) {
      case SessionState.Initial:
        return;
      case SessionState.Establishing:
        this.endReason = "canceled";
        await (session as Inviter).cancel();
        return;
      case SessionState.Established:
        this.endReason = "local";
        await session.bye();
        return;
      default:
        return;
    }
  }

  setMuted(muted: boolean): void {
    this._muted = muted;
    const pc = this.peerConnection();
    if (pc) {
      for (const sender of pc.getSenders()) {
        if (sender.track?.kind === "audio") sender.track.enabled = !muted;
      }
    }
    this.emit({ type: "muted", muted });
  }

  async sendDtmf(digit: string): Promise<void> {
    const pc = this.peerConnection();
    const sender = pc?.getSenders().find((s) => s.track?.kind === "audio" && s.dtmf);
    if (sender?.dtmf) {
      sender.dtmf.insertDTMF(digit);
      return;
    }
    if (!this.session) return;
    await this.session.info({
      requestOptions: {
        body: {
          contentDisposition: "render",
          contentType: "application/dtmf-relay",
          content: `Signal=${digit}\r\nDuration=160`,
        },
      },
    });
  }

  async enableAudio(): Promise<void> {
    this.ensureAudioElement();
    let unlocked = true;
    try {
      await this.audio?.play();
    } catch {
      unlocked = false;
    }
    if (this.ringtone) {
      try {
        await this.ringtone.play();
      } catch {
        unlocked = false;
      }
    }
    this.emit({ type: unlocked ? "audio-unlocked" : "audio-blocked" });
  }

  restart(): void {
    if (this.session || this.pending) {
      this.emit({ type: "ended", reason: "failed", error: "The connection restarted." });
    }
    this.stop();
    this.starting = undefined;
    void this.ensureStarted().catch((error) => this.debug("restart failed", error));
  }

  stop(): void {
    this.stopped = true;
    this.generation += 1;
    this.clearAutoAnswer();
    this.stopRingtone();
    if (this.visibilityHandler && typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
      this.visibilityHandler = undefined;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    try {
      this.registerer?.unregister();
    } catch {
      // The UA may already be gone.
    }
    try {
      void this.ua?.stop();
    } catch {
      // Nothing left to stop.
    }
    this.registerer = undefined;
    this.ua = undefined;
    this.session = undefined;
    this.pending = undefined;
    this.detachAudio();
    this.audio?.remove();
    this.audio = undefined;
  }

  private ensureAudioElement(): void {
    if (this.audio) return;
    if (typeof document === "undefined") return;
    const audio = document.createElement("audio");
    audio.id = `tessera-sip-audio-${Math.random().toString(36).slice(2, 8)}`;
    audio.autoplay = true;
    audio.setAttribute("playsinline", "");
    audio.style.display = "none";
    document.body.appendChild(audio);
    this.audio = audio;
  }

  private playRingtone(): void {
    if (!this.config.ringtone || typeof Audio === "undefined") return;
    this.stopRingtone();
    const ringtone = new Audio(this.config.ringtone);
    ringtone.loop = true;
    this.ringtone = ringtone;
    ringtone.play().catch(() => {
      // Autoplay was refused. The card offers its "tap for sound" key.
      this.emit({ type: "audio-blocked" });
    });
  }

  private stopRingtone(): void {
    if (!this.ringtone) return;
    try {
      this.ringtone.pause();
      this.ringtone.src = "";
    } catch {
      // Ignore a media element that is already gone.
    }
    this.ringtone = undefined;
  }

  private clearAutoAnswer(): void {
    if (!this.autoAnswerTimer) return;
    clearTimeout(this.autoAnswerTimer);
    this.autoAnswerTimer = undefined;
  }

  private peerConnection(): RTCPeerConnection | undefined {
    const handler = this.session?.sessionDescriptionHandler as
      | Web.SessionDescriptionHandler
      | undefined;
    return handler?.peerConnection;
  }

  private attachRemoteAudio(session: Session): void {
    this.ensureAudioElement();
    const handler = session.sessionDescriptionHandler as
      | Web.SessionDescriptionHandler
      | undefined;
    const pc = handler?.peerConnection;
    if (!pc || !this.audio) return;

    const stream = new MediaStream();
    for (const receiver of pc.getReceivers()) {
      if (receiver.track) stream.addTrack(receiver.track);
    }
    this.audio.srcObject = stream;
    void this.audio.play().catch(() => this.emit({ type: "audio-blocked" }));

    pc.addEventListener("track", () => {
      if (!this.audio) return;
      const updated = new MediaStream();
      for (const receiver of pc.getReceivers()) {
        if (receiver.track) updated.addTrack(receiver.track);
      }
      this.audio.srcObject = updated;
    });
  }

  private detachAudio(): void {
    if (!this.audio) return;
    this.audio.srcObject = null;
  }
}
