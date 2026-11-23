import "./card";
import { stopAllClients } from "./sip/hub";

export { TesseraSipCard } from "./card";
export { TesseraSipCardEditor } from "./editor";
export { setClientFactory, acquireClient, stopAllClients } from "./sip/hub";
export { normalizeConfig } from "./config/normalize";
export { deriveView } from "./model/view";
export { applyEvent, initialModel } from "./model/state";
export type { NormalizedConfig, RawCardConfig, DtmfAction } from "./config/types";
export type { CardAction, CardView } from "./model/view";
export type { ClientEvent, Phase, SipModel } from "./model/state";
export type { SipClientLike } from "./sip/types";

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => stopAllClients());
}
