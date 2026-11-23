import {
  ConfigError,
  type DtmfAction,
  type NormalizedConfig,
  type RawCardConfig,
} from "./types";

const DTMF_DIGITS = /^[0-9*#]$/;

function text(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function num(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function dtmfActions(value: unknown): DtmfAction[] {
  if (!Array.isArray(value)) return [];
  const out: DtmfAction[] = [];
  for (const [index, raw] of value.entries()) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Record<string, unknown>;
    const digit = text(item.digit);
    if (!digit || !DTMF_DIGITS.test(digit)) {
      throw new ConfigError(
        `dtmf_actions[${index}].digit must be one of 0-9, * or # (got ${JSON.stringify(item.digit)}).`,
      );
    }
    out.push({
      digit,
      label: text(item.label) ?? digit,
      icon: text(item.icon),
    });
  }
  return out;
}

function labels(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const t = text(raw);
    if (t) out[key] = t;
  }
  return out;
}

/**
 * Turn Home Assistant's loose YAML into one predictable object.
 *
 * This throws only for values that cannot work at all (a bad DTMF digit, a
 * missing manual connection while SIP Core use is off). Whether SIP Core can
 * actually be read is decided later, when the card has `hass`.
 */
export function normalizeConfig(raw: RawCardConfig | undefined): NormalizedConfig {
  if (!raw || typeof raw !== "object") {
    throw new ConfigError("The card needs a configuration object.");
  }

  const useSipCore = bool(raw.use_sip_core, true);
  const normalized: NormalizedConfig = {
    id: text(raw.id) ?? "tessera-sip",
    name: text(raw.name) ?? "Doorbell",
    subtitle: text(raw.subtitle),
    icon: text(raw.icon) ?? "doorbell",

    useSipCore,
    wssUrl: text(raw.wss_url),
    uri: text(raw.uri),
    extension: text(raw.extension),
    pbxServer: text(raw.pbx_server),
    authUser: text(raw.auth_user),
    password: text(raw.password),
    displayName: text(raw.display_name),

    callTarget: text(raw.call_target) ?? "555",
    callLabel: text(raw.call_label) ?? "Talk to the door",

    autoAnswer: bool(raw.auto_answer, false),
    autoAnswerDelay: Math.max(0, num(raw.auto_answer_delay, 0)),
    video: bool(raw.video, false),
    dtmfActions: dtmfActions(raw.dtmf_actions),

    camera: text(raw.camera),
    ringtone: text(raw.ringtone),

    eventType: text(raw.event_type) ?? "tessera_sip_card",
    stateEntity: text(raw.state_entity),
    peerEntity: text(raw.peer_entity),
    eventEntity: text(raw.event_entity),
    commandEntity: text(raw.command_entity),
    clearCommand: bool(raw.clear_command, false),
    answerScript: text(raw.answer_script),
    endScript: text(raw.end_script),

    iceServers: Array.isArray(raw.ice_servers) ? raw.ice_servers : undefined,
    iceTransportPolicy: raw.ice_transport_policy,

    language: text(raw.language),
    labels: labels(raw.labels),
    debug: bool(raw.debug, false),
  };

  if (!useSipCore) {
    const missing: string[] = [];
    if (!normalized.wssUrl) missing.push("wss_url");
    if (!normalized.uri && !normalized.extension) missing.push("uri (or extension)");
    if (!normalized.password) missing.push("password");
    if (missing.length > 0) {
      throw new ConfigError(
        `use_sip_core is false, so the card needs ${missing.join(", ")}.`,
      );
    }
  }

  if (!normalized.uri && !normalized.extension) {
    // Allowed: SIP Core supplies the extension for the logged-in HA user.
    if (!useSipCore) {
      throw new ConfigError("Set `uri` (sip:100@pbx.example) or `extension`.");
    }
  }

  return normalized;
}
