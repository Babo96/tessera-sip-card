import type { ClientEvent } from "../src/model/state";
import type { ResolvedSipConfig } from "../src/sip/resolve";
import type { SipClientLike } from "../src/sip/types";

type Listener = (event: ClientEvent) => void;

/**
 * A SIP client that does nothing but remember a state. The demo drives it from
 * buttons; the screenshots and the visual review use the same element/state
 * machine as the real card.
 */
export class MockClient implements SipClientLike {
  readonly key: string;
  private listeners = new Set<Listener>();
  private events: ClientEvent[] = [{ type: "registration", state: "registering" }];
  private started = false;
  private _muted = false;

  constructor(config: ResolvedSipConfig) {
    this.key = config.key;
  }

  get muted(): boolean {
    return this._muted;
  }

  describe(): ClientEvent[] {
    return [...this.events];
  }

  on(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: ClientEvent): void {
    this.events.push(event);
    if (event.type === "muted") this._muted = event.muted;
    for (const listener of this.listeners) listener(event);
  }

  async ensureStarted(): Promise<void> {
    if (this.started) return;
    this.started = true;
    setTimeout(() => this.emit({ type: "registration", state: "registered" }), 120);
  }

  stop(): void {
    this.started = false;
  }

  restart(): void {
    this.events = [];
    this.emit({ type: "registration", state: "registering" });
    setTimeout(() => this.emit({ type: "registration", state: "registered" }), 400);
  }

  async call(): Promise<void> {
    this.emit({ type: "outgoing", peer: "555", peerName: "Front door" });
    setTimeout(() => this.emit({ type: "connected" }), 900);
  }

  async answer(): Promise<void> {
    this.emit({ type: "connected" });
  }

  async decline(): Promise<void> {
    this.emit({ type: "ended", reason: "declined" });
  }

  async hangup(): Promise<void> {
    this.emit({ type: "ended", reason: "local" });
  }

  setMuted(muted: boolean): void {
    this.emit({ type: "muted", muted });
  }

  async sendDtmf(_digit: string): Promise<void> {
    // No-op in the demo.
  }

  async enableAudio(): Promise<void> {
    this.emit({ type: "audio-unlocked" });
  }

  simulate(event: ClientEvent): void {
    this.emit(event);
  }
}

export const mockClients: MockClient[] = [];

export function lastMock(): MockClient | undefined {
  return mockClients[mockClients.length - 1];
}
