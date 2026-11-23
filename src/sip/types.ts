import type { ClientEvent } from "../model/state";

/**
 * The seam between the card and SIP.js. The demo page and the tests use a
 * fake implementation of this, so the UI can be exercised without a PBX.
 */
export interface SipClientLike {
  readonly key: string;
  readonly muted: boolean;
  /** Replay the current registration and call, for a card created mid-call. */
  describe(): ClientEvent[];
  ensureStarted(): Promise<void>;
  stop(): void;
  restart(): void;
  call(target?: string): Promise<void>;
  answer(): Promise<void>;
  decline(): Promise<void>;
  hangup(): Promise<void>;
  setMuted(muted: boolean): void;
  sendDtmf(digit: string): Promise<void>;
  enableAudio(): Promise<void>;
  on(listener: (event: ClientEvent) => void): () => void;
}
