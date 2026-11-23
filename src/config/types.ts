/** A DTMF key shown while a call is up: "open the door" is usually a digit. */
export interface DtmfAction {
  label: string;
  digit: string;
  icon?: string;
}

/**
 * The card configuration exactly as Home Assistant hands it to `setConfig`.
 * Every value is optional because a card may lean entirely on SIP Core's
 * integration settings.
 */
export interface RawCardConfig {
  type?: string;
  name?: string;
  subtitle?: string;
  icon?: string;

  /** Reuse the SIP account from the SIP Core integration (TECH7Fox). Default: true. */
  use_sip_core?: boolean;

  /** Manual connection. Only needed when SIP Core is absent or not configured. */
  wss_url?: string;
  uri?: string;
  extension?: string;
  pbx_server?: string;
  auth_user?: string;
  password?: string;
  display_name?: string;

  /** What a tap dials while idle. DoorPi's parked-call pickup is "555". */
  call_target?: string;
  call_label?: string;

  auto_answer?: boolean;
  /** Seconds to wait before an incoming call is answered. */
  auto_answer_delay?: number;
  video?: boolean;
  dtmf_actions?: Array<Partial<DtmfAction> & { digit?: string }>;

  camera?: string;
  ringtone?: string;

  /** Stable id for events when several cards live on one dashboard. */
  id?: string;
  event_type?: string;

  /** Bridge to Home Assistant helpers and (optionally) a Tessera screen. */
  state_entity?: string;
  peer_entity?: string;
  /** An input_text that gets one line per transition, for non-admin dashboards. */
  event_entity?: string;
  command_entity?: string;
  clear_command?: boolean;
  answer_script?: string;
  end_script?: string;

  ice_servers?: RTCIceServer[];
  ice_transport_policy?: RTCIceTransportPolicy;

  /** Force a UI language; otherwise Home Assistant's language is used. */
  language?: string;

  /** Per-string overrides, keyed like `idle_subtitle`, `answer`, ... */
  labels?: Record<string, string>;

  /** Log SIP.js traffic and card decisions to the browser console. */
  debug?: boolean;
}

export interface NormalizedConfig {
  id: string;
  name: string;
  subtitle?: string;
  icon: string;

  useSipCore: boolean;
  wssUrl?: string;
  uri?: string;
  extension?: string;
  pbxServer?: string;
  authUser?: string;
  password?: string;
  displayName?: string;

  callTarget: string;
  callLabel: string;

  autoAnswer: boolean;
  autoAnswerDelay: number;
  video: boolean;
  dtmfActions: DtmfAction[];

  camera?: string;
  ringtone?: string;

  eventType: string;
  stateEntity?: string;
  peerEntity?: string;
  eventEntity?: string;
  commandEntity?: string;
  clearCommand: boolean;
  answerScript?: string;
  endScript?: string;

  iceServers?: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;

  language?: string;
  labels: Record<string, string>;
  debug: boolean;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}
