import type { HassLike } from "./types";

/**
 * Write a helper without knowing whether the user picked an `input_text` or
 * an `input_select`. Other domains are left alone (a card may not fake a
 * sensor's state).
 */
export async function writeHelper(
  hass: HassLike,
  entityId: string | undefined,
  value: string,
): Promise<void> {
  if (!entityId || !hass.callService) return;
  const domain = entityId.split(".")[0];
  try {
    if (domain === "input_text") {
      await hass.callService("input_text", "set_value", { entity_id: entityId, value });
    } else if (domain === "input_select") {
      await hass.callService("input_select", "select_option", { entity_id: entityId, option: value });
    }
  } catch (error) {
    console.warn(`tessera-sip-card: could not write ${entityId}`, error);
  }
}

export function entityState(hass: HassLike | undefined, entityId: string | undefined): string | undefined {
  if (!hass || !entityId) return undefined;
  return hass.states[entityId]?.state;
}

/** The camera proxy URL of a `camera.*` entity, with the current token. */
export function cameraImageUrl(
  hass: HassLike | undefined,
  entityId: string | undefined,
): string | undefined {
  if (!hass || !entityId) return undefined;
  const picture = hass.states[entityId]?.attributes.entity_picture;
  if (typeof picture !== "string" || picture.length === 0) return undefined;
  if (/^https?:\/\//i.test(picture)) return picture;
  const base = hass.hassUrl ? hass.hassUrl("/") : "/";
  return `${base.replace(/\/$/, "")}/${picture.replace(/^\//, "")}`;
}
