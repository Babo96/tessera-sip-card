import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../src/config/normalize";
import { applyEvent, initialModel, type ClientEvent } from "../src/model/state";
import { deriveView } from "../src/model/view";

const config = normalizeConfig({
  name: "Haustür",
  call_label: "Tür abheben",
  dtmf_actions: [{ label: "Open door", digit: "1" }],
});

function state(...events: ClientEvent[]) {
  let model = initialModel(0);
  let now = 0;
  for (const event of events) model = applyEvent(model, event, (now += 1000));
  return model;
}

describe("what the card shows", () => {
  it("offers the call target while idle", () => {
    const view = deriveView(
      state({ type: "registration", state: "registered" }),
      config,
      "de",
      10_000,
    );
    expect(view.phase).toBe("idle");
    expect(view.title).toBe("Haustür");
    expect(view.primary?.id).toBe("call");
    expect(view.primary?.label).toBe("Tür abheben");
    expect(view.tone).toBe("accent");
  });

  it("offers answer and decline while ringing", () => {
    const view = deriveView(
      state(
        { type: "registration", state: "registered" },
        { type: "incoming", peer: "8000", peerName: "Front door" },
      ),
      config,
      "en",
      10_000,
    );
    expect(view.title).toBe("Front door");
    expect(view.primary?.id).toBe("answer");
    expect(view.secondary?.id).toBe("decline");
    expect(view.pulse).toBe(true);
    expect(view.tone).toBe("ring");
  });

  it("uses the card name for an anonymous caller", () => {
    const view = deriveView(
      state({ type: "registration", state: "registered" }, { type: "incoming", peer: "anonymous" }),
      config,
      "en",
    );
    expect(view.title).toBe("Haustür");
  });

  it("shows the duration and the door key while connected", () => {
    const view = deriveView(
      state(
        { type: "registration", state: "registered" },
        { type: "incoming", peer: "8000" },
        { type: "connected" },
      ),
      config,
      "en",
      70_000,
    );
    expect(view.phase).toBe("connected");
    expect(view.duration).toBe("1:07");
    expect(view.primary?.id).toBe("hangup");
    expect(view.controls.map((c) => c.id)).toEqual(["mute", "dtmf"]);
    expect(view.controls[1]?.digit).toBe("1");
    expect(view.tone).toBe("live");
  });

  it("turns the mute key into unmute", () => {
    const view = deriveView(
      state(
        { type: "registration", state: "registered" },
        { type: "connected" },
        { type: "muted", muted: true },
      ),
      config,
      "en",
      5000,
    );
    expect(view.controls[0]?.id).toBe("unmute");
    expect(view.muted).toBe(true);
  });

  it("shows an error with a retry key", () => {
    const view = deriveView(
      state({ type: "registration", state: "failed", error: "No route to host" }),
      config,
      "de",
      1000,
    );
    expect(view.phase).toBe("error");
    expect(view.primary?.id).toBe("retry");
    expect(view.hint).toBe("No route to host");
  });

  it("translates its own words and lets YAML override them", () => {
    const german = deriveView(state({ type: "registration", state: "registered" }), config, "de");
    expect(german.subtitle).toBe("Tippen zum Sprechen");

    const overridden = normalizeConfig({ labels: { idle_hint: "Los geht's" } });
    const view = deriveView(
      state({ type: "registration", state: "registered" }),
      overridden,
      "de",
    );
    expect(view.subtitle).toBe("Los geht's");
  });

  it("adds the sound key when autoplay was blocked", () => {
    const view = deriveView(
      state({ type: "registration", state: "registered" }, { type: "audio-blocked" }),
      config,
      "en",
    );
    expect(view.controls[0]?.id).toBe("enable_audio");
  });
});
