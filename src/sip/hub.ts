import type { ResolvedSipConfig } from "./resolve";
import { SipJsClient } from "./client";
import type { SipClientLike } from "./types";

export type ClientFactory = (config: ResolvedSipConfig) => SipClientLike;

let factory: ClientFactory = (config) => new SipJsClient(config);
const clients = new Map<string, SipClientLike>();

/**
 * One user agent per SIP account per page. Moving between dashboards destroys
 * the cards but must not tear down a live call, so clients are kept for the
 * page's lifetime.
 */
export function acquireClient(config: ResolvedSipConfig): SipClientLike {
  let client = clients.get(config.key);
  if (!client) {
    client = factory(config);
    clients.set(config.key, client);
  }
  return client;
}

export function releaseClient(_key: string): void {
  // Deliberately kept alive: an active call outlives the card element.
}

/** The demo page swaps in a fake client; tests can too. */
export function setClientFactory(next: ClientFactory): void {
  factory = next;
  clients.clear();
}

export function stopAllClients(): void {
  for (const client of clients.values()) client.stop();
  clients.clear();
}
