import { css } from "lit";

/**
 * Tessera SIP — visual surface.
 *
 * The card is a Tessera tile that becomes a call: one big soft disc, a calm
 * state-coloured wash, very large radii, pill keys and a single quiet line of
 * status. It grows from a 1×2 tile into a two-column console without ever
 * fixing its own height.
 *
 * Rules kept from the project: Home Assistant theme variables with fallbacks,
 * no external fonts/images/scripts, 44 px touch targets, visible focus, and
 * no motion when the visitor asked for less.
 */
export const styles = css`
  :host {
    display: block;
    container-type: inline-size;
    container-name: tsip;

    /* ── Palette ─────────────────────────────────────────────────────────── */
    --tsip-radius: 26px;
    --tsip-accent: var(--primary-color, #2f7fe0);
    --tsip-live: var(--success-color, #2f9e64);
    --tsip-ring: #e2943a;
    --tsip-danger: var(--error-color, #cf3f36);
    --tsip-ink: var(--primary-text-color, #171a1f);
    --tsip-fg: var(--primary-text-color, #171a1f);
    --tsip-muted: var(--secondary-text-color, #5f6875);
    --tsip-surface: var(--ha-card-background, var(--card-background-color, #ffffff));
    --tsip-on-ink: var(--ha-card-background, var(--card-background-color, #ffffff));
    --tsip-line: color-mix(in srgb, var(--tsip-ink) 13%, transparent);
    --tsip-focus: var(--primary-color, #2f7fe0);
    --tsip-danger-fill: color-mix(in srgb, var(--tsip-danger) 70%, #2a0806);
    --tsip-shadow: var(--ha-card-box-shadow, 0 12px 32px rgb(16 22 32 / 12%));

    /* ── Type ────────────────────────────────────────────────────────────── */
    --tsip-font: var(
      --ha-font-family-body,
      ui-rounded,
      "SF Pro Rounded",
      "Avenir Next",
      "Nunito",
      "Quicksand",
      "Varela Round",
      "Segoe UI Variable Display",
      "Ubuntu",
      system-ui,
      sans-serif
    );
    --tsip-ease: cubic-bezier(0.22, 0.78, 0.28, 1);
  }

  @media (prefers-color-scheme: dark) {
    :host {
      --tsip-ring: #f0aa53;
      --tsip-shadow: var(--ha-card-box-shadow, 0 14px 34px rgb(0 0 0 / 48%));
    }
  }

  /* ── The tile ──────────────────────────────────────────────────────────── */
  ha-card {
    position: relative;
    display: flex;
    flex-direction: column;
    isolation: isolate;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    min-height: 178px;
    padding: 16px;
    border-radius: var(--tsip-radius);
    background-color: var(--tsip-surface);
    color: var(--tsip-fg);
    font-family: var(--tsip-font);
    font-size: 15px;
    line-height: 1.25;
    box-shadow: var(--tsip-shadow);
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color 0.3s var(--tsip-ease),
      color 0.3s var(--tsip-ease);
  }

  /* The hairline of the tile; while ringing it becomes a breathing frame. */
  ha-card::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: inherit;
    pointer-events: none;
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 22%),
      inset 0 0 0 1px color-mix(in srgb, var(--tsip-ink) 7%, transparent);
  }

  .tone-accent {
    --tsip-tone: var(--tsip-accent);
    --tsip-tint: 7%;
    --tsip-glow: 17%;
  }
  .tone-neutral {
    --tsip-tone: var(--tsip-muted);
    --tsip-tint: 5%;
    --tsip-glow: 12%;
  }
  .tone-ring {
    --tsip-tone: var(--tsip-ring);
    --tsip-tint: 11%;
    --tsip-glow: 27%;
  }
  .tone-live {
    --tsip-tone: var(--tsip-live);
    --tsip-tint: 8%;
    --tsip-glow: 19%;
  }
  .tone-danger {
    --tsip-tone: var(--tsip-danger);
    --tsip-tint: 7%;
    --tsip-glow: 18%;
  }

  .wash {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-color: color-mix(in srgb, var(--tsip-tone) var(--tsip-tint), transparent);
    background-image: radial-gradient(
      120% 105% at 12% -14%,
      color-mix(in srgb, var(--tsip-tone) var(--tsip-glow), transparent) 0%,
      transparent 64%
    );
  }

  /* ── Camera still ─────────────────────────────────────────────────────── */
  .shot {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: #101214;
  }
  .shot img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.015);
  }
  .shot::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(
        180deg,
        rgb(8 10 13 / 46%) 0%,
        rgb(8 10 13 / 14%) 36%,
        rgb(8 10 13 / 50%) 74%,
        rgb(8 10 13 / 82%) 100%
      ),
      radial-gradient(90% 70% at 8% 100%, color-mix(in srgb, var(--tsip-tone) 24%, transparent), transparent 70%);
  }

  .has-camera {
    --tsip-fg: #ffffff;
    --tsip-muted: rgb(255 255 255 / 78%);
    --tsip-line: rgb(255 255 255 / 26%);
    color: #fff;
  }
  .has-camera .wash {
    display: none;
  }

  /* ── Shell ────────────────────────────────────────────────────────────── */
  .shell {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    min-width: 0;
  }

  .head {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    animation: tsip-rise 0.5s var(--tsip-ease) both;
  }

  /* ── Icon disc ────────────────────────────────────────────────────────── */
  .disc {
    position: relative;
    display: grid;
    flex: none;
    place-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--tsip-tone) 16%, transparent);
    color: color-mix(in srgb, var(--tsip-tone) 62%, var(--tsip-ink));
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--tsip-tone) 14%, transparent),
      inset 0 1px 0 rgb(255 255 255 / 26%);
    transition:
      background-color 0.3s var(--tsip-ease),
      color 0.3s var(--tsip-ease);
  }

  .glyph {
    display: grid;
    place-items: center;
    transition: transform 0.3s var(--tsip-ease);
  }
  .glyph svg {
    width: 24px;
    height: 24px;
  }

  .is-ringing .disc {
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--tsip-tone) 22%, transparent),
      0 0 0 5px color-mix(in srgb, var(--tsip-tone) 15%, transparent),
      0 6px 18px color-mix(in srgb, var(--tsip-tone) 24%, transparent);
  }

  .phase-connected .disc::after {
    --tsip-dot-ring: var(--tsip-surface);
    content: "";
    position: absolute;
    right: 1px;
    bottom: 1px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--tsip-live);
    box-shadow: 0 0 0 3px var(--tsip-dot-ring);
    animation: tsip-blip 2.6s var(--tsip-ease) infinite;
  }

  /* Spinner: a ring around the phase glyph, never a spinning doorbell. */
  .spinner {
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 2px solid color-mix(in srgb, var(--tsip-tone) 20%, transparent);
    border-top-color: color-mix(in srgb, var(--tsip-tone) 78%, var(--tsip-ink));
    border-right-color: color-mix(in srgb, var(--tsip-tone) 52%, transparent);
    animation: tsip-spin 1.15s linear infinite;
  }
  .is-busy .glyph svg {
    width: 17px;
    height: 17px;
    opacity: 0.9;
  }

  /* Ringing halos. */
  .halo {
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid color-mix(in srgb, var(--tsip-tone) 62%, transparent);
    pointer-events: none;
    animation: tsip-halo 2.6s var(--tsip-ease) infinite;
  }
  .halo-late {
    animation-delay: 1.3s;
  }

  /* ── Text ─────────────────────────────────────────────────────────────── */
  .text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 17px;
    margin: 0 0 3px;
    color: var(--tsip-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .state {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 7px 2px 5px;
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--tsip-ink) 7%, transparent);
    white-space: nowrap;
  }
  .state svg {
    width: 12px;
    height: 12px;
    flex: none;
  }
  .state[data-state="on"] svg {
    color: var(--tsip-live);
  }
  .state[data-state="wait"] svg {
    color: var(--tsip-tone);
  }
  .state[data-state="off"] svg {
    color: var(--tsip-danger);
  }

  .rule {
    width: 1px;
    height: 11px;
    background: var(--tsip-line);
  }

  .clock {
    color: var(--tsip-fg);
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: 0.01em;
    font-variant-numeric: tabular-nums;
    text-transform: none;
  }

  .say {
    min-width: 0;
  }

  .title {
    display: -webkit-box;
    overflow: hidden;
    margin: 0;
    color: var(--tsip-fg);
    font-size: 20px;
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.022em;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .subtitle {
    display: -webkit-box;
    overflow: hidden;
    margin: 3px 0 0;
    color: var(--tsip-muted);
    font-size: 13px;
    font-weight: 450;
    line-height: 1.35;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  /* ── Note (a leftover error/notice line) ──────────────────────────────── */
  .note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 0;
    padding: 8px 10px;
    border-radius: 13px;
    background-color: color-mix(in srgb, var(--tsip-danger) 9%, transparent);
    color: var(--tsip-fg);
    font-size: 12.5px;
    line-height: 1.35;
    animation: tsip-rise 0.5s var(--tsip-ease) 0.05s both;
  }
  .note-glyph {
    display: grid;
    flex: none;
    place-items: center;
    margin-top: 1px;
    color: var(--tsip-danger);
  }
  .note-glyph svg {
    width: 15px;
    height: 15px;
  }
  .note-text {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  /* ── Panel: actions + extra keys ──────────────────────────────────────── */
  .panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    animation: tsip-rise 0.5s var(--tsip-ease) 0.06s both;
  }

  .actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .actions.has-pair {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  }

  /* ── Keys ─────────────────────────────────────────────────────────────── */
  .key {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    box-sizing: border-box;
    min-width: 0;
    min-height: 52px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    color: var(--tsip-ink);
    font-family: inherit;
    font-size: 14.5px;
    font-weight: 650;
    line-height: 1.1;
    letter-spacing: -0.005em;
    text-align: center;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-appearance: none;
    appearance: none;
    transition:
      background-color 0.18s var(--tsip-ease),
      border-color 0.18s var(--tsip-ease),
      box-shadow 0.18s var(--tsip-ease),
      transform 0.16s var(--tsip-ease);
  }
  .key:active {
    transform: scale(0.982);
  }
  .key:focus-visible {
    outline: 3px solid var(--tsip-focus);
    outline-offset: 3px;
  }
  .key-glyph {
    display: grid;
    flex: none;
    place-items: center;
  }
  .key-glyph svg {
    width: 22px;
    height: 22px;
  }
  .key-label {
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Primary: an ink pill, like Tessera's one bold answer button. */
  .role-primary {
    background-color: var(--tsip-ink);
    color: var(--tsip-on-ink);
    box-shadow:
      0 8px 20px color-mix(in srgb, var(--tsip-ink) 18%, transparent),
      inset 0 1px 0 rgb(255 255 255 / 12%);
  }
  .role-primary .key-glyph {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--tsip-on-ink) 14%, transparent);
  }
  .role-primary .key-glyph svg {
    width: 18px;
    height: 18px;
  }
  .role-primary .key-label {
    font-size: 15px;
  }

  /* Danger: deep rose so white text stays readable in light and dark. */
  .key.kind-danger {
    background-color: var(--tsip-danger);
    background-color: var(--tsip-danger-fill);
    color: #fff;
    box-shadow:
      0 9px 22px color-mix(in srgb, var(--tsip-danger) 26%, transparent),
      inset 0 1px 0 rgb(255 255 255 / 16%);
  }
  .key.kind-danger .key-glyph {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgb(255 255 255 / 16%);
  }
  .key.kind-danger .key-glyph svg {
    width: 18px;
    height: 18px;
  }

  /* Secondary: the quiet half of a pair (decline). */
  .role-secondary {
    border-color: color-mix(in srgb, var(--tsip-ink) 10%, transparent);
    background-color: color-mix(in srgb, var(--tsip-ink) 6%, transparent);
    color: var(--tsip-ink);
  }
  .role-secondary .key-glyph {
    color: var(--tsip-danger);
  }

  /* Ghost: one-tap "turn on sound", always full width. */
  .keys .key.kind-ghost {
    flex: 1 0 100%;
    flex-direction: row;
    gap: 8px;
    max-width: none;
    min-height: 48px;
    padding: 0 14px;
    border-radius: 999px;
    font-size: 13px;
    background-color: color-mix(in srgb, var(--tsip-tone) 14%, transparent);
    border-color: color-mix(in srgb, var(--tsip-tone) 36%, transparent);
    color: var(--tsip-ink);
  }
  .keys .key.kind-ghost .key-glyph {
    background-color: color-mix(in srgb, var(--tsip-tone) 22%, transparent);
    color: color-mix(in srgb, var(--tsip-tone) 72%, var(--tsip-ink));
  }

  /* Chips: mute and the door's DTMF keys. */
  .keys {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    min-width: 0;
  }
  .role-chip {
    flex: 1 1 74px;
    flex-direction: column;
    gap: 3px;
    max-width: 200px;
    min-height: 50px;
    padding: 6px 6px 7px;
    border-color: color-mix(in srgb, var(--tsip-ink) 8%, transparent);
    border-radius: 16px;
    background-color: color-mix(in srgb, var(--tsip-ink) 6%, transparent);
    font-size: 11.5px;
    font-weight: 600;
    line-height: 1.15;
  }
  .role-chip .key-glyph {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: color-mix(in srgb, var(--tsip-tone) 14%, transparent);
    color: color-mix(in srgb, var(--tsip-tone) 70%, var(--tsip-ink));
  }
  .role-chip .key-glyph svg {
    width: 15px;
    height: 15px;
  }
  .role-chip .key-label {
    display: -webkit-box;
    max-width: 100%;
    overflow: hidden;
    white-space: normal;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .key-digit {
    position: absolute;
    top: 5px;
    right: 7px;
    color: var(--tsip-muted);
    font-size: 9.5px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  /* ── Loading + spinner bars ───────────────────────────────────────────── */
  .progress {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 4;
    height: 3px;
    overflow: hidden;
    background-color: color-mix(in srgb, var(--tsip-tone) 16%, transparent);
  }
  .progress::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 38%;
    border-radius: 3px;
    background: var(--tsip-tone);
    animation: tsip-load 1.35s var(--tsip-ease) infinite;
  }

  /* ── Fault (configuration / resolution error) ─────────────────────────── */
  .is-fault .shell {
    gap: 10px;
  }
  .fault {
    margin: 0;
    color: var(--tsip-muted);
    font-size: 12.5px;
    font-weight: 450;
    line-height: 1.45;
    overflow-wrap: anywhere;
    user-select: text;
    animation: tsip-rise 0.5s var(--tsip-ease) 0.04s both;
  }
  .is-fault .actions {
    max-width: 380px;
    margin-top: 2px;
  }

  /* ── Camera-mode materials ────────────────────────────────────────────── */
  .has-camera .disc {
    background-color: rgb(10 13 16 / 46%);
    color: #fff;
    box-shadow:
      inset 0 0 0 1px rgb(255 255 255 / 24%),
      0 2px 10px rgb(0 0 0 / 20%);
  }
  .has-camera .spinner {
    border-color: rgb(255 255 255 / 22%);
    border-top-color: #fff;
    border-right-color: rgb(255 255 255 / 55%);
  }
  .has-camera .state {
    background-color: rgb(255 255 255 / 16%);
  }
  .has-camera .state[data-state="on"] svg,
  .has-camera .state[data-state="off"] svg {
    color: #fff;
  }
  .has-camera .key.role-secondary,
  .has-camera .key.role-chip {
    border-color: rgb(255 255 255 / 20%);
    background-color: rgb(12 15 18 / 52%);
    color: #fff;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }
  .has-camera .key.role-secondary .key-glyph {
    background: transparent;
    color: #ffc3ba;
  }
  .has-camera .key.role-chip .key-glyph {
    background-color: rgb(255 255 255 / 16%);
    color: #fff;
  }
  .has-camera .key.kind-ghost {
    border-color: rgb(255 255 255 / 40%);
    background-color: rgb(255 255 255 / 18%);
    color: #fff;
  }
  .has-camera .key.kind-ghost .key-glyph {
    background-color: rgb(255 255 255 / 22%);
    color: #fff;
  }
  .has-camera .note {
    background-color: rgb(10 12 15 / 55%);
    color: #fff;
  }
  .has-camera .note-glyph {
    color: #ffb4ac;
  }
  .has-camera.phase-connected .disc::after {
    --tsip-dot-ring: rgb(10 13 16 / 78%);
  }
  .has-camera .progress {
    background-color: rgb(255 255 255 / 18%);
  }
  .has-camera .progress::before {
    background: #fff;
  }

  /* ── Ringing ──────────────────────────────────────────────────────────── */
  .is-ringing::after {
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 25%),
      inset 0 0 0 2px color-mix(in srgb, var(--tsip-ring) 58%, transparent);
    animation: tsip-frame 2.4s ease-in-out infinite;
  }

  /* ── Hover, only where a pointer can hover ────────────────────────────── */
  @media (hover: hover) {
    .role-primary:hover {
      filter: brightness(1.06);
    }
    .key.kind-danger:hover {
      filter: brightness(1.08);
    }
    .role-secondary:hover,
    .role-chip:hover {
      border-color: color-mix(in srgb, var(--tsip-ink) 22%, transparent);
      background-color: color-mix(in srgb, var(--tsip-ink) 9%, transparent);
    }
    .has-camera .key.role-secondary:hover,
    .has-camera .key.role-chip:hover {
      border-color: rgb(255 255 255 / 40%);
      background-color: rgb(12 15 18 / 66%);
    }
  }

  /* ── Size steps: 1×2 tile → 2×2 / wall panel → full width ─────────────── */
  @container tsip (min-width: 360px) {
    ha-card {
      --tsip-radius: 28px;
      min-height: 186px;
      padding: 18px;
    }
    .shell {
      gap: 12px;
    }
    .head {
      gap: 13px;
    }
    .disc {
      width: 54px;
      height: 54px;
    }
    .glyph svg {
      width: 26px;
      height: 26px;
    }
    .title {
      font-size: 22px;
    }
    .subtitle {
      font-size: 13.5px;
    }
    .clock {
      font-size: 16px;
    }
    .key {
      min-height: 54px;
    }
    .role-chip {
      min-height: 52px;
    }
    .key-glyph svg {
      width: 23px;
      height: 23px;
    }
    .panel {
      gap: 9px;
    }
  }

  @container tsip (min-width: 620px) {
    ha-card {
      --tsip-radius: 32px;
      min-height: 190px;
      padding: 20px 22px;
    }
    .shell {
      display: grid;
      grid-template-areas:
        "head panel"
        "note panel";
      grid-template-columns: minmax(200px, 1fr) minmax(280px, min(42%, 420px));
      align-content: center;
      align-items: center;
      column-gap: 28px;
      row-gap: 10px;
    }
    .head {
      grid-area: head;
      gap: 15px;
    }
    .note {
      grid-area: note;
    }
    .panel {
      grid-area: panel;
      gap: 9px;
    }
    .disc {
      width: 60px;
      height: 60px;
    }
    .glyph svg {
      width: 28px;
      height: 28px;
    }
    .title {
      font-size: 27px;
      letter-spacing: -0.028em;
    }
    .subtitle {
      max-width: 46ch;
      font-size: 14.5px;
    }
    .clock {
      font-size: 18px;
    }
    .key {
      min-height: 56px;
      font-size: 15.5px;
    }
    .role-primary .key-label {
      font-size: 16px;
    }
    .role-chip {
      min-height: 56px;
      font-size: 12px;
    }
    .role-chip .key-glyph {
      width: 28px;
      height: 28px;
    }
    .role-chip .key-glyph svg {
      width: 16px;
      height: 16px;
    }
    .key-glyph svg {
      width: 24px;
      height: 24px;
    }
    .role-primary .key-glyph svg,
    .key.kind-danger .key-glyph svg {
      width: 19px;
      height: 19px;
    }
    .is-fault .shell {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .is-fault .fault {
      max-width: 62ch;
    }
  }

  @container tsip (min-width: 760px) {
    .title {
      font-size: 30px;
    }
    .subtitle {
      font-size: 15px;
    }
    .shell {
      column-gap: 40px;
    }
  }

  /* ── Motion ───────────────────────────────────────────────────────────── */
  @keyframes tsip-rise {
    from {
      opacity: 0;
      transform: translateY(7px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes tsip-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes tsip-halo {
    0% {
      opacity: 0.65;
      transform: scale(0.82);
    }
    70%,
    100% {
      opacity: 0;
      transform: scale(1.42);
    }
  }

  @keyframes tsip-frame {
    0%,
    100% {
      opacity: 0.45;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes tsip-blip {
    0%,
    100% {
      box-shadow: 0 0 0 3px var(--tsip-dot-ring);
    }
    50% {
      box-shadow:
        0 0 0 3px var(--tsip-dot-ring),
        0 0 0 6px color-mix(in srgb, var(--tsip-live) 22%, transparent);
    }
  }

  @keyframes tsip-load {
    from {
      transform: translateX(-110%);
    }
    to {
      transform: translateX(280%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .head,
    .panel,
    .note,
    .fault,
    .progress::before,
    .halo,
    .spinner,
    .state[data-state="wait"] svg,
    .phase-connected .disc::after,
    .is-ringing::after {
      animation: none;
    }
    .halo {
      display: none;
    }
    .is-ringing::after {
      opacity: 1;
    }
    .progress::before {
      width: 100%;
      opacity: 0.55;
    }
    .key {
      transition: none;
    }
    .key:active {
      transform: none;
    }
  }
`;
