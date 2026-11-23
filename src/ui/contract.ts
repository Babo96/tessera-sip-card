import type { TemplateResult } from "lit";
import type { NormalizedConfig } from "../config/types";
import type { CardAction, CardView } from "../model/view";

/** Everything the card knows, handed to the view in one object. */
export interface UiModel {
  view: CardView;
  /** Absent while the YAML itself is invalid. */
  config?: NormalizedConfig;
  /** A camera snapshot for ringing and connected states, when configured. */
  cameraUrl?: string;
  /** A configuration or resolution problem, shown instead of the tile. */
  error?: string;
  /** The SIP account is still being resolved. */
  loading: boolean;
  /** Autoplay was refused: one tap enables the remote audio. */
  audioBlocked: boolean;
  now: number;
}

export interface UiHandlers {
  action(action: CardAction): void;
  enableAudio(): void;
}

/**
 * The visual seam. `src/ui/render.ts` owns everything below this line: no SIP,
 * no Home Assistant, just the state it is handed.
 */
export type CardRenderer = (ui: UiModel, handlers: UiHandlers) => TemplateResult;
