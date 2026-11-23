import type { HassLike } from "../ha/types";

/**
 * A subset of SIP Core's `/api/sip-core/config` answer
 * (TECH7Fox/sipcore-hass-integration). Only the fields this card reads.
 */
export interface SipCoreUser {
  ha_username?: string;
  display_name?: string;
  extension: string;
  password: string;
  overrides?: Record<string, unknown>;
}

export interface SipCoreIceConfig extends RTCConfiguration {
  iceGatheringTimeout?: number;
}

export interface SipCoreConfig {
  ice_config?: SipCoreIceConfig;
  users?: SipCoreUser[];
  backup_user?: SipCoreUser;
  custom_wss_url?: string;
  pbx_server?: string;
  sip_video?: boolean;
  auto_answer?: boolean;
  incomingRingtoneUrl?: string;
  outgoingRingtoneUrl?: string;
}

export interface SipCoreHassUser {
  id?: string;
  name?: string;
}

export async function fetchSipCoreConfig(hass: HassLike): Promise<SipCoreConfig | null> {
  if (!hass.fetchWithAuth) return null;
  try {
    const response = await hass.fetchWithAuth(`/api/sip-core/config?t=${Date.now()}`);
    if (!response.ok) return null;
    return (await response.json()) as SipCoreConfig;
  } catch {
    return null;
  }
}

/** SIP Core's ingress URL for its bundled Asterisk, if this HA runs the add-on. */
export async function fetchSipCoreIngress(hass: HassLike): Promise<string | null> {
  if (!hass.fetchWithAuth) return null;
  try {
    const response = await hass.fetchWithAuth("/api/sip-core/asterisk-ingress");
    if (!response.ok) return null;
    const data = (await response.json()) as { ingress_entry?: string };
    return data.ingress_entry ?? null;
  } catch {
    return null;
  }
}

/**
 * SIP Core picks the account by the Home Assistant user's id, then name, and
 * falls back to its shared backup account. Mirrored here so both cards agree
 * on who is calling.
 */
export function pickSipCoreUser(
  config: SipCoreConfig,
  user: SipCoreHassUser | undefined,
): SipCoreUser | undefined {
  const users = config.users ?? [];
  if (user?.id) {
    const byId = users.find((u) => u.ha_username === user.id);
    if (byId) return byId;
  }
  if (user?.name) {
    const byName = users.find((u) => u.ha_username === user.name);
    if (byName) return byName;
  }
  return config.backup_user;
}
