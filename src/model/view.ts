import type { NormalizedConfig } from "../config/types";
import { formatDuration } from "./format";
import { translate, type Language } from "./i18n";
import type { Phase, SipModel } from "./state";

export type Tone = "neutral" | "accent" | "ring" | "live" | "danger";

export type ActionId =
  | "call"
  | "answer"
  | "decline"
  | "hangup"
  | "mute"
  | "unmute"
  | "retry"
  | "dtmf"
  | "enable_audio";

export interface CardAction {
  id: ActionId;
  label: string;
  icon: string;
  kind: "primary" | "secondary" | "danger" | "ghost";
  /** Set for a DTMF key. */
  digit?: string;
}

export interface CardView {
  phase: Phase;
  tone: Tone;
  icon: string;
  title: string;
  subtitle: string;
  hint?: string;
  primary?: CardAction;
  secondary?: CardAction;
  /** Extra keys under the main pair: mute, door, DTMF. */
  controls: CardAction[];
  /** Ringing or dialling: the card breathes. */
  pulse: boolean;
  /** Show a spinner: connecting, registering, dialling. */
  busy: boolean;
  showCamera: boolean;
  duration?: string;
  registered: boolean;
  muted: boolean;
}

const TONES: Record<Phase, Tone> = {
  booting: "neutral",
  unregistered: "danger",
  idle: "accent",
  ringing: "ring",
  dialing: "accent",
  connected: "live",
  error: "danger",
};

const ICONS: Record<Phase, string> = {
  booting: "doorbell",
  unregistered: "phone-off",
  idle: "doorbell",
  ringing: "phone-incoming",
  dialing: "phone-outgoing",
  connected: "phone",
  error: "alert",
};

function peerTitle(
  model: SipModel,
  cfg: NormalizedConfig,
  fallback: string,
): string {
  const peer = model.peerName ?? model.peer;
  if (!peer || /^anonymous$/i.test(peer)) return cfg.name || fallback;
  return peer;
}

export function deriveView(
  model: SipModel,
  cfg: NormalizedConfig,
  lang: Language,
  now = Date.now(),
): CardView {
  const text = (key: Parameters<typeof translate>[1], vars?: Record<string, string | number>) =>
    cfg.labels[key] ?? translate(lang, key, vars);

  const view: CardView = {
    phase: model.phase,
    tone: TONES[model.phase],
    icon: cfg.icon && model.phase === "idle" ? cfg.icon : ICONS[model.phase],
    title: cfg.name,
    subtitle: cfg.subtitle ?? text("idle_hint"),
    controls: [],
    pulse: model.phase === "ringing",
    busy: model.phase === "booting" || model.phase === "dialing",
    showCamera: Boolean(cfg.camera) && (model.phase === "ringing" || model.phase === "connected"),
    duration:
      model.phase === "connected" && model.callStarted
        ? formatDuration(now - model.callStarted)
        : undefined,
    registered: model.registered,
    muted: model.muted,
  };

  switch (model.phase) {
    case "booting":
      view.subtitle = text("connecting");
      break;

    case "unregistered":
      view.subtitle = text("offline");
      view.hint = model.error ?? text("offline_hint");
      view.primary = {
        id: "retry",
        label: text("retry"),
        icon: "refresh",
        kind: "primary",
      };
      break;

    case "idle":
      view.primary = {
        id: "call",
        label: cfg.callLabel,
        icon: "phone",
        kind: "primary",
      };
      if (model.error) view.hint = model.error;
      break;

    case "ringing":
      view.title = peerTitle(model, cfg, text("ringing"));
      view.subtitle = text("ringing_hint");
      view.primary = {
        id: "answer",
        label: text("answer"),
        icon: "phone",
        kind: "primary",
      };
      view.secondary = {
        id: "decline",
        label: text("decline"),
        icon: "phone-off",
        kind: "secondary",
      };
      break;

    case "dialing":
      view.title = text("calling", { peer: model.peerName ?? model.peer ?? text("unknown") });
      view.subtitle = text("calling_hint");
      view.primary = {
        id: "hangup",
        label: text("cancel"),
        icon: "phone-off",
        kind: "danger",
      };
      break;

    case "connected":
      view.title = peerTitle(model, cfg, text("connected"));
      view.subtitle = view.duration ?? text("connected");
      view.hint = text("connected_hint");
      view.primary = {
        id: "hangup",
        label: text("hangup"),
        icon: "phone-off",
        kind: "danger",
      };
      view.controls.push({
        id: model.muted ? "unmute" : "mute",
        label: model.muted ? text("unmute") : text("mute"),
        icon: model.muted ? "microphone-off" : "microphone",
        kind: "secondary",
      });
      for (const dtmf of cfg.dtmfActions) {
        view.controls.push({
          id: "dtmf",
          label: dtmf.label,
          icon: dtmf.icon ?? "keypad",
          kind: "secondary",
          digit: dtmf.digit,
        });
      }
      if (model.error) view.hint = model.error;
      break;

    case "error":
      view.subtitle = cfg.name;
      view.hint = model.error ?? text("error");
      view.primary = {
        id: "retry",
        label: text("retry"),
        icon: "refresh",
        kind: "primary",
      };
      break;
  }

  if (model.audioBlocked) {
    view.controls.unshift({
      id: "enable_audio",
      label: text("tap_for_sound"),
      icon: "volume",
      kind: "ghost",
    });
  }

  return view;
}

/** Every action the card can run, for the click handler. */
export function actionIds(view: CardView): ActionId[] {
  const ids = [view.primary?.id, view.secondary?.id, ...view.controls.map((c) => c.id)];
  return ids.filter((id): id is ActionId => Boolean(id));
}
