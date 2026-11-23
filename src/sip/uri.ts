/** The default WSS endpoint of DoorPi's Asterisk (docs/sip-server.md). */
export const DOORPI_WSS_PORT = 57000;

export function domainOf(uri: string | undefined): string | undefined {
  if (!uri) return undefined;
  const withoutScheme = uri.replace(/^sips?:/i, "").replace(/^<|>$/g, "");
  const at = withoutScheme.lastIndexOf("@");
  if (at < 0) return undefined;
  const host = withoutScheme.slice(at + 1).split(/[;>]/)[0] ?? "";
  return host.replace(/:\d+$/, "") || undefined;
}

export function userOf(uri: string | undefined): string | undefined {
  if (!uri) return undefined;
  const match = /^(?:sips?:)?([^@;>\s]+)@/i.exec(uri.trim());
  return match?.[1];
}

export function buildSipUri(value: string, domain: string): string {
  const trimmed = value.trim();
  if (/^sips?:/i.test(trimmed)) return trimmed;
  if (trimmed.includes("@")) return `sip:${trimmed}`;
  return `sip:${trimmed}@${domain}`;
}

/** Turn "555" into `sip:555@doorpi.example`, keep a full URI as it is. */
export function targetUri(target: string, domain: string): string {
  return buildSipUri(target, domain);
}

export function guessDoorPiWss(pbx: string): string {
  const host = pbx.replace(/^wss?:\/\//i, "").replace(/\/.*$/, "").replace(/:\d+$/, "");
  return `wss://${host}:${DOORPI_WSS_PORT}/ws`;
}

export function normalizeWss(url: string): string {
  const trimmed = url.trim();
  if (/^wss?:\/\//i.test(trimmed)) return trimmed;
  return `wss://${trimmed}`;
}

export function wssFromIngress(ingressEntry: string, origin: string): string {
  const base = origin.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:");
  const path = ingressEntry.startsWith("/") ? ingressEntry : `/${ingressEntry}`;
  return `${base.replace(/\/$/, "")}${path.replace(/\/$/, "")}/ws`;
}
