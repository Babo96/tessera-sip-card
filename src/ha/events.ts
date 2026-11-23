import type { HassLike } from "./types";

export interface CardEventPayload {
  card: string;
  event: "registered" | "unregistered" | "ringing" | "dialing" | "answered" | "ended" | "error";
  phase: string;
  peer?: string;
  direction?: string;
  duration?: number;
  error?: string;
  timestamp: string;
}

/**
 * Fire one Home Assistant event. Automations, Tessera and scripts can listen
 * for `event_type` without the card needing to write an entity.
 */
export async function fireCardEvent(
  hass: HassLike,
  eventType: string,
  payload: CardEventPayload,
): Promise<void> {
  if (!hass.callWS) return;
  try {
    await hass.callWS({
      type: "fire_event",
      event_type: eventType,
      event_data: payload,
    });
  } catch (error) {
    console.warn("tessera-sip-card: could not fire event", error);
  }
}

export async function callScript(hass: HassLike, entityId: string): Promise<void> {
  if (!hass.callService) return;
  const [domain, ...rest] = entityId.split(".");
  const name = rest.join(".");
  if (!domain || !name) return;
  try {
    if (domain === "script") {
      await hass.callService("script", name, {});
    } else if (domain === "automation") {
      await hass.callService("automation", "trigger", { entity_id: entityId });
    } else {
      await hass.callService(domain, name, {});
    }
  } catch (error) {
    console.warn(`tessera-sip-card: could not call ${entityId}`, error);
  }
}
