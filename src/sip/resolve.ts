import { ConfigError, type NormalizedConfig } from "../config/types";
import type { HassLike } from "../ha/types";
import {
  fetchSipCoreConfig,
  fetchSipCoreIngress,
  pickSipCoreUser,
  type SipCoreConfig,
} from "./sip-core";
import {
  buildSipUri,
  domainOf,
  guessDoorPiWss,
  normalizeWss,
  targetUri,
  userOf,
  wssFromIngress,
} from "./uri";

export interface ResolvedSipConfig {
  key: string;
  uri: string;
  /** The PBX host, used to build a URI for an ad-hoc call target. */
  domain: string;
  authUser: string;
  password: string;
  displayName: string;
  wssUrl: string;
  iceServers: RTCIceServer[];
  iceTransportPolicy: RTCIceTransportPolicy;
  iceGatheringTimeout: number;
  video: boolean;
  autoAnswer: boolean;
  autoAnswerDelay: number;
  /** Full `sip:` URI a tap dials. */
  callTargetUri: string;
  ringtone?: string;
  source: "sip_core" | "manual";
  warnings: string[];
  debug: boolean;
}

export interface ResolveDeps {
  fetchCore?: (hass: HassLike) => Promise<SipCoreConfig | null>;
  fetchIngress?: (hass: HassLike) => Promise<string | null>;
  /** Used to build SIP Core's ingress URL outside a browser (tests). */
  origin?: string;
}

/** A non-reversible fingerprint so a rotated password gets a new user agent. */
function fingerprint(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 33) ^ value.charCodeAt(i);
  return (hash >>> 0).toString(36);
}

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function hostOfUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value).hostname || undefined;
  } catch {
    return undefined;
  }
}

function currentOrigin(deps: ResolveDeps): string {
  if (deps.origin) return deps.origin;
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "https://homeassistant.local";
}

/**
 * Work out one complete SIP account, preferring the SIP Core integration so a
 * user does not have to copy credentials into the card at all.
 */
export async function resolveSipConfig(
  cfg: NormalizedConfig,
  hass: HassLike,
  deps: ResolveDeps = {},
): Promise<ResolvedSipConfig> {
  const warnings: string[] = [];

  let core: SipCoreConfig | null = null;
  if (cfg.useSipCore) {
    try {
      core = await (deps.fetchCore ?? fetchSipCoreConfig)(hass);
    } catch {
      core = null;
    }
    if (!core) warnings.push("SIP Core is not available; using the card's own settings.");
  }

  const coreUser = core ? pickSipCoreUser(core, hass.user) : undefined;
  if (core && !coreUser) warnings.push("No SIP Core account matches this Home Assistant user.");

  let wssUrl: string | undefined = cfg.wssUrl ?? clean(core?.custom_wss_url);
  let wssIsIngress = false;

  if (!wssUrl && core) {
    const ingress = await (deps.fetchIngress ?? fetchSipCoreIngress)(hass).catch(() => null);
    if (ingress) {
      wssUrl = wssFromIngress(ingress, currentOrigin(deps));
      wssIsIngress = true;
    }
  }

  const pbx =
    cfg.pbxServer ??
    clean(core?.pbx_server) ??
    domainOf(cfg.uri) ??
    (wssIsIngress ? undefined : hostOfUrl(wssUrl));

  if (!wssUrl && pbx) {
    wssUrl = guessDoorPiWss(pbx);
    warnings.push(
      `No WSS URL configured; using DoorPi's default ${wssUrl}. Set wss_url if your PBX listens elsewhere.`,
    );
  }

  if (!wssUrl) {
    throw new ConfigError(
      "No WebSocket URL. Set `wss_url` (or configure SIP Core with a custom WSS URL).",
    );
  }

  const account = cfg.uri ?? cfg.extension ?? clean(coreUser?.extension);
  if (!account) {
    throw new ConfigError(
      "No SIP account. Set `extension` (and `pbx_server`) or `uri`, or configure SIP Core.",
    );
  }

  const domain = pbx ?? domainOf(cfg.uri);
  if (!domain) {
    throw new ConfigError(
      "No SIP domain. Set `pbx_server`, or use a full `uri` such as sip:100@doorpi.example.",
    );
  }

  const uri = buildSipUri(account, domain);
  const authUser = cfg.authUser ?? userOf(uri);
  if (!authUser) throw new ConfigError(`Could not find a user in ${uri}.`);

  if (
    !cfg.password &&
    coreUser &&
    clean(coreUser.extension) &&
    userOf(uri) !== clean(coreUser.extension)
  ) {
    throw new ConfigError(
      `The card registers ${userOf(uri)} but SIP Core's account is ${coreUser.extension}. ` +
        "Set the dedicated extension's `password`, or use the same extension (not recommended).",
    );
  }

  const password = cfg.password ?? clean(coreUser?.password);
  if (!password) {
    throw new ConfigError(
      "No SIP password. Configure SIP Core, or set `password` on the card (ideally from a secret).",
    );
  }

  const source: ResolvedSipConfig["source"] = coreUser && !cfg.password && !cfg.uri
    ? "sip_core"
    : "manual";

  const normalizedWss = normalizeWss(wssUrl);
  if (
    typeof window !== "undefined" &&
    window.location?.protocol === "https:" &&
    normalizedWss.startsWith("ws://")
  ) {
    warnings.push("A ws:// URL is blocked on an HTTPS page. Use wss:// (or test on localhost).");
  }

  const resolved: ResolvedSipConfig = {
    key: `${uri}|${normalizeWss(wssUrl)}|${authUser}|${fingerprint(password)}`,
    uri,
    domain,
    authUser,
    password,
    displayName: cfg.displayName ?? clean(coreUser?.display_name) ?? cfg.name,
    wssUrl: normalizedWss,
    iceServers: cfg.iceServers ?? core?.ice_config?.iceServers ?? [],
    iceTransportPolicy: cfg.iceTransportPolicy ?? core?.ice_config?.iceTransportPolicy ?? "all",
    iceGatheringTimeout: core?.ice_config?.iceGatheringTimeout ?? 2000,
    video: cfg.video,
    autoAnswer: cfg.autoAnswer,
    autoAnswerDelay: cfg.autoAnswerDelay,
    callTargetUri: targetUri(cfg.callTarget, domain),
    ringtone: cfg.ringtone ?? core?.incomingRingtoneUrl,
    source,
    warnings,
    debug: cfg.debug,
  };

  return resolved;
}
