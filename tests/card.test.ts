// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setClientFactory } from "../src/sip/hub";
import "../src/card";
import type { TesseraSipCard } from "../src/card";
import type { ClientEvent } from "../src/model/state";
import type { SipClientLike } from "../src/sip/types";

class FakeClient implements SipClientLike {
  readonly key = "fake";
  muted = false;
  private listeners = new Set<(event: ClientEvent) => void>();
  calls: string[] = [];

  describe(): ClientEvent[] {
    return [{ type: "registration", state: "registered" }];
  }
  on(listener: (event: ClientEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  emit(event: ClientEvent): void {
    for (const listener of this.listeners) listener(event);
  }
  ensureStarted(): Promise<void> {
    return Promise.resolve();
  }
  stop(): void {}
  restart(): void {}
  call(target?: string): Promise<void> {
    this.calls.push(`call:${target ?? "default"}`);
    return Promise.resolve();
  }
  answer(): Promise<void> {
    this.calls.push("answer");
    return Promise.resolve();
  }
  decline(): Promise<void> {
    this.calls.push("decline");
    return Promise.resolve();
  }
  hangup(): Promise<void> {
    this.calls.push("hangup");
    return Promise.resolve();
  }
  setMuted(muted: boolean): void {
    this.muted = muted;
  }
  sendDtmf(digit: string): Promise<void> {
    this.calls.push(`dtmf:${digit}`);
    return Promise.resolve();
  }
  enableAudio(): Promise<void> {
    this.calls.push("enable_audio");
    return Promise.resolve();
  }
}

interface Subscription {
  type: string;
  callback: (event: { event_type: string; data: Record<string, unknown> }) => void;
}

let client: FakeClient;
let subscriptions: Subscription[];
let callWS: ReturnType<typeof vi.fn>;
let callService: ReturnType<typeof vi.fn>;

function makeHass() {
  return {
    states: {},
    user: { id: "u1", name: "Babo" },
    locale: { language: "en" },
    callWS,
    callService,
    connection: {
      subscribeEvents: async (
        callback: Subscription["callback"],
        type = "state_changed",
      ) => {
        subscriptions.push({ type, callback });
        return () => {};
      },
    },
  };
}

const config = {
  name: "Front door",
  use_sip_core: false,
  wss_url: "wss://doorpi.example:57000/ws",
  uri: "sip:103@doorpi.example",
  password: "secret",
  call_target: "555",
  state_entity: "input_text.sip_state",
  peer_entity: "input_text.sip_peer",
  event_entity: "input_text.sip_event",
  command_entity: "input_text.sip_command",
  clear_command: true,
};

async function settle(): Promise<void> {
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await Promise.resolve();
}

beforeEach(() => {
  subscriptions = [];
  callWS = vi.fn().mockResolvedValue(undefined);
  callService = vi.fn().mockResolvedValue(undefined);
  client = new FakeClient();
  setClientFactory(() => client);
  document.body.innerHTML = "";
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("the card element", () => {
  it("renders the idle tile once the account is resolved", async () => {
    const card = document.createElement("tessera-sip-card") as TesseraSipCard;
    card.hass = makeHass() as never;
    card.setConfig(config);
    document.body.appendChild(card);
    await settle();

    expect(card.shadowRoot?.textContent).toContain("Front door");
    expect(card.shadowRoot?.textContent).toContain("Tap to talk");
  });

  it("turns a ring into state, an event and a helper", async () => {
    const card = document.createElement("tessera-sip-card") as TesseraSipCard;
    card.hass = makeHass() as never;
    card.setConfig(config);
    document.body.appendChild(card);
    await settle();

    client.emit({ type: "incoming", peer: "8000", peerName: "Front door" });
    await settle();

    expect(card.shadowRoot?.textContent).toContain("Incoming call");
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "fire_event",
        event_type: "tessera_sip_card",
        event_data: expect.objectContaining({ event: "ringing", peer: "Front door" }),
      }),
    );
    expect(callService).toHaveBeenCalledWith("input_text", "set_value", {
      entity_id: "input_text.sip_state",
      value: "ringing",
    });
    expect(callService).toHaveBeenCalledWith("input_text", "set_value", {
      entity_id: "input_text.sip_peer",
      value: "Front door",
    });
    expect(callService).toHaveBeenCalledWith("input_text", "set_value", {
      entity_id: "input_text.sip_event",
      value: expect.stringMatching(/^ringing\|ringing\|Front door\|/),
    });
  });

  it("runs a command written to the helper", async () => {
    const card = document.createElement("tessera-sip-card") as TesseraSipCard;
    card.hass = makeHass() as never;
    card.setConfig(config);
    document.body.appendChild(card);
    await settle();

    client.emit({ type: "incoming", peer: "8000" });
    await settle();

    const stateSub = subscriptions.find((s) => s.type === "state_changed");
    expect(stateSub).toBeDefined();
    stateSub!.callback({
      event_type: "state_changed",
      data: {
        entity_id: "input_text.sip_command",
        new_state: { entity_id: "input_text.sip_command", state: "answer|1790000000" },
      },
    });
    await settle();

    expect(client.calls).toContain("answer");
    expect(callService).toHaveBeenCalledWith("input_text", "set_value", {
      entity_id: "input_text.sip_command",
      value: "",
    });

    // A command can name another target on the same PBX.
    client.emit({ type: "ended", reason: "local" });
    stateSub!.callback({
      event_type: "state_changed",
      data: {
        entity_id: "input_text.sip_command",
        new_state: { entity_id: "input_text.sip_command", state: "call:8000|1790000001" },
      },
    });
    await settle();
    expect(client.calls).toContain("call:sip:8000@doorpi.example");
  });

  it("dials when the call key is pressed", async () => {
    const card = document.createElement("tessera-sip-card") as TesseraSipCard;
    card.hass = makeHass() as never;
    card.setConfig(config);
    document.body.appendChild(card);
    await settle();

    const button = card.shadowRoot?.querySelector<HTMLElement>(
      '[data-action="call"]',
    );
    expect(button).not.toBeNull();
    button!.click();
    await settle();

    expect(client.calls).toContain("call:default");
  });
});
