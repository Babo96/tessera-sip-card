/**
 * The small slice of Home Assistant's frontend API this card uses.
 *
 * It is declared by hand instead of depending on `custom-card-helpers`, so the
 * bundle stays current and a missing optional field can never break a card in
 * an older Home Assistant.
 */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export interface HassConnection {
  connected?: boolean;
  subscribeEvents?: (
    callback: (event: { event_type: string; data: Record<string, unknown> }) => void,
    eventType?: string,
  ) => Promise<() => void>;
}

export interface HassLike {
  states: Record<string, HassEntity>;
  user?: { id?: string; name?: string };
  locale?: { language?: string };
  connection?: HassConnection;
  callWS?: <T = unknown>(message: Record<string, unknown>) => Promise<T>;
  callService?: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ) => Promise<unknown>;
  fetchWithAuth?: (path: string, init?: RequestInit) => Promise<Response>;
  hassUrl?: (path?: string) => string;
}
