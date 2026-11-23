import { svg, type TemplateResult } from "lit";

/**
 * A small, local icon set.
 *
 * Every glyph is one 24×24 path so it inherits `currentColor`, never needs
 * `ha-icon`, and stays crisp on the small discs of a dashboard card. Icons
 * named in YAML (`mdi:door`, `mdi:phone`…) are normalised and, when we do not
 * know them, fall back to a sensible local glyph.
 *
 * The whole icon is built with Lit's `svg` tag: `html` would create the path
 * in the XHTML namespace, which the browser never paints.
 */

const PHONE =
  "M21.6 16.7v2.7a1.9 1.9 0 0 1-2.1 1.9 18.7 18.7 0 0 1-8.2-2.9 18.4 18.4 0 0 1-5.7-5.7A18.7 18.7 0 0 1 2.7 4.5 1.9 1.9 0 0 1 4.6 2.4h2.7a1.9 1.9 0 0 1 1.9 1.7c.1.9.4 1.8.7 2.7a1.9 1.9 0 0 1-.4 2L8.3 10a15.2 15.2 0 0 0 5.7 5.7l1.2-1.2a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.7.7a1.9 1.9 0 0 1 1.7 1.9Z";

const DOT = (cx: number, cy: number, r = 1.08) =>
  `M${cx + r} ${cy}a${r} ${r} 0 1 1-${r * 2} 0 ${r} ${r} 0 0 1${r * 2} 0Z`;

const PATHS: Record<string, string> = {
  doorbell:
    "M18 8.4a6 6 0 1 0-12 0c0 5.6-2.6 7.2-2.6 7.2h17.2S18 14 18 8.4Z" +
    " M13.9 19.2a2.2 2.2 0 0 1-3.8 0" +
    " M2.4 4.2A13 13 0 0 1 5 1.6" +
    " M21.6 4.2A13 13 0 0 0 19 1.6",
  phone: PHONE,
  "phone-off":
    "M10.5 13.4a16 16 0 0 0 3.5 2.4l1.2-1.2a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.7.7a1.9 1.9 0 0 1 1.7 1.9v2.7a1.9 1.9 0 0 1-2.1 1.9 18.7 18.7 0 0 1-8.2-2.9 18 18 0 0 1-3.2-2.6" +
    " M4.7 11.2A18.7 18.7 0 0 1 2.7 4.5 1.9 1.9 0 0 1 4.6 2.4h2.7a1.9 1.9 0 0 1 1.9 1.7c.1.9.4 1.8.7 2.7a1.9 1.9 0 0 1-.4 2L8.3 10a15 15 0 0 0 .8 1.1" +
    " M3 3l18 18",
  "phone-incoming": "M16 2.8v6h6 M22.4 2.4l-6.8 6.8 " + PHONE,
  "phone-outgoing": "M22.4 8.8v-6h-6 M15.6 9.6l6.8-6.8 " + PHONE,
  microphone:
    "M12 2.6a3 3 0 0 0-3 3v6.1a3 3 0 0 0 6 0V5.6a3 3 0 0 0-3-3Z" +
    " M19 10.7v1a7 7 0 0 1-14 0v-1" +
    " M12 18.7v2.7",
  "microphone-off":
    "M15 9.6V5.6a3 3 0 0 0-5.9-.6" +
    " M9 9.5v2.2a3 3 0 0 0 4.6 2.6" +
    " M5 10.7v1a7 7 0 0 0 10.6 6" +
    " M19 10.7v1a7 7 0 0 1-.8 3.3" +
    " M12 18.7v2.7" +
    " M3.6 3.2l16.8 17.6",
  refresh: "M21 12a9 9 0 1 1-3.1-6.8L21 8 M21 3v5h-5",
  keypad:
    DOT(7, 5) + DOT(12, 5) + DOT(17, 5) + DOT(7, 11.5) + DOT(12, 11.5) + DOT(17, 11.5) +
    DOT(7, 18) + DOT(12, 18) + DOT(17, 18),
  volume:
    "M11 5 6.5 9H3v6h3.5L11 19V5Z" +
    " M15.4 8.6a5 5 0 0 1 0 6.8" +
    " M18.4 6a9 9 0 0 1 0 12",
  alert:
    "M10.4 3.9 2.9 16.9a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.6 3.9a1.9 1.9 0 0 0-3.2 0Z" +
    " M12 9.2v4.2" +
    " M12 16.9h.01",
  check: "M4.5 12.8 9.4 17.6 19.5 6.8",
  clock: "M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Z M12 7.2V12l3.1 2",
  x: "M6 6l12 12 M18 6 6 18",
  door:
    "M4.5 21h15" +
    " M6.5 21V5.6a1.6 1.6 0 0 1 1.3-1.6l8-1.5a1.6 1.6 0 0 1 1.9 1.6V21" +
    " M14.4 12h.01",
};

/** Keypad dots read as dots only when filled. */
const FILLED = new Set(["keypad"]);

const ALIASES: Record<string, string> = {
  bell: "doorbell",
  "door-open": "door",
  "door-closed": "door",
  gate: "door",
  call: "phone",
  "phone-classic": "phone",
  "phone-hangup": "phone-off",
  hangup: "phone-off",
  mic: "microphone",
  "mic-off": "microphone-off",
  sound: "volume",
  speaker: "volume",
  warning: "alert",
  error: "alert",
  reload: "refresh",
  digits: "keypad",
};

function resolve(name: string | undefined, fallback: string): string {
  const clean = (name ?? "").trim().replace(/^mdi:/i, "").replace(/_/g, "-").toLowerCase();
  const wanted = PATHS[clean] ? clean : ALIASES[clean] ?? clean;
  return PATHS[wanted] ? wanted : PATHS[fallback] ? fallback : "doorbell";
}

/**
 * @param name   A local name or an `mdi:` name.
 * @param fallback Local glyph to use when the name is unknown.
 */
export function icon(name: string | undefined, fallback = "doorbell"): TemplateResult {
  const key = resolve(name, fallback);
  const filled = FILLED.has(key);

  return svg`<svg
    class="icon-svg"
    viewBox="0 0 24 24"
    fill=${filled ? "currentColor" : "none"}
    stroke=${filled ? "none" : "currentColor"}
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    focusable="false"
    aria-hidden="true"
  >
    <path d=${PATHS[key]}></path>
  </svg>`;
}
