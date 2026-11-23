import { html, nothing, type TemplateResult } from "lit";
import type { CardAction } from "../model/view";
import type { CardRenderer, UiHandlers, UiModel } from "./contract";
import { icon } from "./icon";

/** A failed camera still should leave the scrim, not a broken-image glyph. */
function cameraFailed(event: Event): void {
  const image = event.currentTarget as HTMLImageElement | null;
  if (image) image.style.visibility = "hidden";
}

function cameraLoaded(event: Event): void {
  const image = event.currentTarget as HTMLImageElement | null;
  if (image) image.style.visibility = "visible";
}

/**
 * The card's whole visual surface.
 *
 * Structure, from the back: an optional camera still, a state-coloured wash,
 * then one shell that reads top-to-bottom on narrow tiles and becomes two
 * columns (identity + keys) as the card grows. Everything below is display
 * only; actions still leave through `handlers.action` with the same ids.
 */
export const renderCard: CardRenderer = (ui: UiModel, handlers: UiHandlers): TemplateResult => {
  const { view } = ui;
  const paired = Boolean(view.primary && view.secondary);
  const hasCamera = view.showCamera && Boolean(ui.cameraUrl);
  const connected = view.phase === "connected";

  /** The subtitle is the live line. While connected the hint ("Speak now…") reads better. */
  const subtitle = connected ? view.hint : view.subtitle;
  const showSubtitle = Boolean(subtitle) && subtitle !== view.title;
  /** Anything extra we could not use as the subtitle becomes a quiet inline note. */
  const note = view.hint && view.hint !== subtitle ? view.hint : undefined;

  const connection = view.registered ? "on" : view.busy ? "wait" : "off";

  const key = (action: CardAction, role: "primary" | "secondary" | "chip") => html`
    <button
      type="button"
      class="key role-${role} kind-${action.kind}"
      data-action=${action.id}
      data-digit=${action.digit ?? nothing}
      aria-label=${action.digit ? `${action.label} (${action.digit})` : nothing}
      @click=${() => handlers.action(action)}
    >
      <span class="key-glyph" aria-hidden="true">
        ${icon(action.icon, action.id === "dtmf" ? "keypad" : "phone")}
      </span>
      <span class="key-label">${action.label}</span>
      ${action.digit ? html`<span class="key-digit" aria-hidden="true">${action.digit}</span>` : nothing}
    </button>
  `;

  const cardClass = [
    "tsip",
    `phase-${view.phase}`,
    `tone-${view.tone}`,
    view.pulse ? "is-ringing" : "",
    view.busy ? "is-busy" : "",
    ui.loading ? "is-loading" : "",
    hasCamera ? "has-camera" : "",
    ui.error ? "is-fault" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const stateChip = (mark: string) => html`
    <span class="state" data-state=${mark}>
      ${icon(mark === "on" ? "check" : mark === "wait" ? "clock" : "alert", "alert")}
      <span class="state-text">SIP</span>
    </span>
  `;

  /* ---------------------------------------------------------------- fault --
   * A configuration or connection-resolution problem replaces the call
   * surface: the message is the point, with a retry key when one is offered.
   */
  if (ui.error) {
    return html`
      <ha-card class=${cardClass} data-phase="fault" aria-busy="false">
        <div class="wash" aria-hidden="true"></div>
        <div class="shell">
          <header class="head">
            <div class="disc">
              <span class="glyph" aria-hidden="true">${icon("alert")}</span>
            </div>
            <div class="text">
              <p class="eyebrow"><span class="state" data-state="off">${icon("alert")} SIP</span></p>
              <h2 class="title" title=${view.title}>${view.title}</h2>
              ${view.subtitle && view.subtitle !== view.title
                ? html`<p class="subtitle">${view.subtitle}</p>`
                : nothing}
            </div>
          </header>

          <p class="fault" role="status">${ui.error}</p>

          ${view.primary
            ? html`<div class="actions solo">${key(view.primary, "primary")}</div>`
            : nothing}
        </div>
      </ha-card>
    `;
  }

  return html`
    <ha-card
      class=${cardClass}
      data-phase=${view.phase}
      data-tone=${view.tone}
      aria-busy=${view.busy || ui.loading ? "true" : "false"}
    >
      ${hasCamera
        ? html`<div class="shot" aria-hidden="true">
            <img
              src=${ui.cameraUrl!}
              alt=""
              draggable="false"
              decoding="async"
              @error=${cameraFailed}
              @load=${cameraLoaded}
            />
          </div>`
        : nothing}
      <div class="wash" aria-hidden="true"></div>
      ${ui.loading ? html`<span class="progress" aria-hidden="true"></span>` : nothing}

      <div class="shell">
        <header class="head">
          <div class="disc">
            ${view.busy ? html`<span class="spinner" aria-hidden="true"></span>` : nothing}
            <span class="glyph" aria-hidden="true">${icon(view.icon)}</span>
            ${view.pulse
              ? html`<span class="halo" aria-hidden="true"></span>
                  <span class="halo halo-late" aria-hidden="true"></span>`
              : nothing}
          </div>

          <div class="text">
            <div class="eyebrow">
              ${stateChip(connection)}
              ${view.duration
                ? html`<span class="rule" aria-hidden="true"></span>
                    <span class="clock" role="timer" aria-live="off">${view.duration}</span>`
                : nothing}
            </div>
            <div class="say" aria-live="polite" aria-atomic="true">
              <h2 class="title" title=${view.title}>${view.title}</h2>
              ${showSubtitle ? html`<p class="subtitle">${subtitle}</p>` : nothing}
            </div>
          </div>
        </header>

        ${note
          ? html`<p class="note">
              <span class="note-glyph" aria-hidden="true">${icon("alert")}</span>
              <span class="note-text">${note}</span>
            </p>`
          : nothing}

        ${view.primary || view.secondary || view.controls.length > 0
          ? html`<div class="panel">
              ${view.primary || view.secondary
                ? html`<div class="actions ${paired ? "has-pair" : "solo"}">
                    ${view.primary ? key(view.primary, "primary") : nothing}
                    ${view.secondary ? key(view.secondary, "secondary") : nothing}
                  </div>`
                : nothing}
              ${view.controls.length > 0
                ? html`<div class="keys">${view.controls.map((action) => key(action, "chip"))}</div>`
                : nothing}
            </div>`
          : nothing}
      </div>
    </ha-card>
  `;
};
