export type Phase =
  | "booting"
  | "unregistered"
  | "idle"
  | "ringing"
  | "dialing"
  | "connected"
  | "error";

export type EndReason = "local" | "remote" | "declined" | "missed" | "failed" | "canceled";

/** Everything the SIP client tells the card. */
export type ClientEvent =
  | { type: "registration"; state: "registering" | "registered" | "unregistered" | "failed"; error?: string }
  | { type: "incoming"; peer: string; peerName?: string }
  | { type: "outgoing"; peer: string; peerName?: string }
  | { type: "progress" }
  | { type: "connected" }
  | { type: "ended"; reason: EndReason; error?: string }
  | { type: "muted"; muted: boolean }
  | { type: "error"; message: string }
  | { type: "audio-blocked" }
  | { type: "audio-unlocked" };

export type ModelEvent = ClientEvent | { type: "boot" } | { type: "retry" };

export interface SipModel {
  phase: Phase;
  registered: boolean;
  direction?: "incoming" | "outgoing";
  peer?: string;
  peerName?: string;
  /** Epoch ms at which the phase began. */
  since: number;
  /** Epoch ms at which the call was answered. */
  callStarted?: number;
  muted: boolean;
  error?: string;
  audioBlocked: boolean;
  lastEnd?: EndReason;
}

export function initialModel(now = Date.now()): SipModel {
  return {
    phase: "booting",
    registered: false,
    since: now,
    muted: false,
    audioBlocked: false,
  };
}

function inCall(phase: Phase): boolean {
  return phase === "ringing" || phase === "dialing" || phase === "connected";
}

/**
 * The card's one state machine. It is pure so every transition can be tested
 * without a PBX, a browser or Home Assistant.
 */
export function applyEvent(model: SipModel, event: ModelEvent, now = Date.now()): SipModel {
  switch (event.type) {
    case "boot":
    case "retry":
      return {
        ...initialModel(now),
        audioBlocked: model.audioBlocked,
        registered: false,
      };

    case "registration":
      switch (event.state) {
        case "registering":
          return model.registered
            ? model
            : {
                ...model,
                registered: false,
                phase: inCall(model.phase) ? model.phase : "booting",
                error: undefined,
                since: inCall(model.phase) ? model.since : now,
              };
        case "registered":
          return {
            ...model,
            registered: true,
            phase: inCall(model.phase) ? model.phase : "idle",
            error: undefined,
            since: inCall(model.phase) ? model.since : now,
          };
        case "unregistered":
          return {
            ...model,
            registered: false,
            phase: inCall(model.phase) ? model.phase : "unregistered",
            error: event.error ?? model.error,
            since: inCall(model.phase) ? model.since : now,
          };
        case "failed":
          return {
            ...model,
            registered: false,
            phase: inCall(model.phase) ? model.phase : "error",
            error: event.error ?? "Registration failed",
            since: inCall(model.phase) ? model.since : now,
          };
      }
      break;

    case "incoming":
      return {
        ...model,
        phase: "ringing",
        direction: "incoming",
        peer: event.peer,
        peerName: event.peerName,
        since: now,
        callStarted: undefined,
        muted: false,
        error: undefined,
      };

    case "outgoing":
      return {
        ...model,
        phase: "dialing",
        direction: "outgoing",
        peer: event.peer,
        peerName: event.peerName,
        since: now,
        callStarted: undefined,
        muted: false,
        error: undefined,
      };

    case "progress":
      return model.phase === "dialing" ? model : model;

    case "connected":
      return {
        ...model,
        phase: "connected",
        since: now,
        callStarted: now,
        muted: false,
        error: undefined,
      };

    case "ended":
      return {
        ...model,
        phase: model.registered ? "idle" : "unregistered",
        direction: undefined,
        peer: undefined,
        peerName: undefined,
        since: now,
        callStarted: undefined,
        muted: false,
        lastEnd: event.reason,
        error: event.reason === "failed" ? (event.error ?? "Call failed") : undefined,
      };

    case "muted":
      return { ...model, muted: event.muted };

    case "error":
      return {
        ...model,
        phase: inCall(model.phase) ? model.phase : model.registered ? "idle" : "error",
        error: event.message,
        since: inCall(model.phase) ? model.since : now,
      };

    case "audio-blocked":
      return { ...model, audioBlocked: true };

    case "audio-unlocked":
      return { ...model, audioBlocked: false };
  }

  return model;
}

export function isInCall(model: SipModel): boolean {
  return inCall(model.phase);
}
