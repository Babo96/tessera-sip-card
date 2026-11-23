import { describe, expect, it } from "vitest";
import { applyEvent, initialModel, isInCall } from "../src/model/state";

describe("the call state machine", () => {
  it("starts booting and becomes idle once registered", () => {
    const booting = initialModel(1000);
    expect(booting.phase).toBe("booting");

    const idle = applyEvent(booting, { type: "registration", state: "registered" }, 1100);
    expect(idle.phase).toBe("idle");
    expect(idle.registered).toBe(true);
    expect(idle.since).toBe(1100);
  });

  it("rings, answers and ends back at idle", () => {
    let model = applyEvent(initialModel(0), { type: "registration", state: "registered" }, 10);
    model = applyEvent(model, { type: "incoming", peer: "8000", peerName: "Front door" }, 20);
    expect(model.phase).toBe("ringing");
    expect(model.peer).toBe("8000");
    expect(model.peerName).toBe("Front door");

    model = applyEvent(model, { type: "connected" }, 30);
    expect(model.phase).toBe("connected");
    expect(model.callStarted).toBe(30);
    expect(isInCall(model)).toBe(true);

    model = applyEvent(model, { type: "ended", reason: "local" }, 40);
    expect(model.phase).toBe("idle");
    expect(model.peer).toBeUndefined();
    expect(model.callStarted).toBeUndefined();
    expect(model.lastEnd).toBe("local");
  });

  it("keeps a live call when registration drops", () => {
    let model = applyEvent(initialModel(0), { type: "registration", state: "registered" }, 0);
    model = applyEvent(model, { type: "connected" }, 1);
    model = applyEvent(model, { type: "registration", state: "unregistered" }, 2);
    expect(model.phase).toBe("connected");
    expect(model.registered).toBe(false);
  });

  it("goes to unregistered, not idle, when a call ends offline", () => {
    let model = applyEvent(initialModel(0), { type: "registration", state: "registered" }, 0);
    model = applyEvent(model, { type: "outgoing", peer: "555" }, 1);
    model = applyEvent(model, { type: "registration", state: "unregistered" }, 2);
    model = applyEvent(model, { type: "ended", reason: "remote" }, 3);
    expect(model.phase).toBe("unregistered");
  });

  it("shows a failure as an error and recovers on registration", () => {
    let model = applyEvent(initialModel(0), {
      type: "registration",
      state: "failed",
      error: "WSS refused",
    });
    expect(model.phase).toBe("error");
    expect(model.error).toBe("WSS refused");

    model = applyEvent(model, { type: "registration", state: "registered" });
    expect(model.phase).toBe("idle");
    expect(model.error).toBeUndefined();
  });

  it("clears the caller and mute on end", () => {
    let model = applyEvent(initialModel(0), { type: "registration", state: "registered" }, 0);
    model = applyEvent(model, { type: "connected" }, 1);
    model = applyEvent(model, { type: "muted", muted: true }, 2);
    expect(model.muted).toBe(true);

    model = applyEvent(model, { type: "ended", reason: "remote" }, 3);
    expect(model.muted).toBe(false);
    expect(model.direction).toBeUndefined();
  });

  it("remembers that autoplay was blocked until the user unlocks it", () => {
    let model = applyEvent(initialModel(0), { type: "audio-blocked" }, 1);
    expect(model.audioBlocked).toBe(true);
    model = applyEvent(model, { type: "audio-unlocked" }, 2);
    expect(model.audioBlocked).toBe(false);
  });

  it("boots and retries back to a clean slate", () => {
    let model = applyEvent(initialModel(0), { type: "incoming", peer: "8000" }, 1);
    model = applyEvent(model, { type: "boot" }, 2);
    expect(model.phase).toBe("booting");
    expect(model.peer).toBeUndefined();
  });
});
