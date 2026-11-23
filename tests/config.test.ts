import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../src/config/normalize";
import { ConfigError } from "../src/config/types";

describe("card configuration", () => {
  it("fills DoorPi-friendly defaults", () => {
    const config = normalizeConfig({});
    expect(config.name).toBe("Doorbell");
    expect(config.useSipCore).toBe(true);
    expect(config.callTarget).toBe("555");
    expect(config.callLabel).toBe("Talk to the door");
    expect(config.eventType).toBe("tessera_sip_card");
    expect(config.dtmfActions).toEqual([]);
  });

  it("trims text and keeps booleans", () => {
    const config = normalizeConfig({
      name: "  Haustür ",
      auto_answer: true,
      auto_answer_delay: 2,
      use_sip_core: false,
      wss_url: " wss://doorpi.example:57000/ws ",
      extension: "100",
      password: "secret",
      pbx_server: "doorpi.example",
    });
    expect(config.name).toBe("Haustür");
    expect(config.autoAnswer).toBe(true);
    expect(config.autoAnswerDelay).toBe(2);
    expect(config.wssUrl).toBe("wss://doorpi.example:57000/ws");
  });

  it("needs a manual account when SIP Core is off", () => {
    expect(() =>
      normalizeConfig({ use_sip_core: false, extension: "100", password: "x" }),
    ).toThrow(ConfigError);
  });

  it("accepts a full uri without an extension", () => {
    const config = normalizeConfig({
      use_sip_core: false,
      wss_url: "wss://doorpi.example:57000/ws",
      uri: "sip:100@doorpi.example",
      password: "x",
    });
    expect(config.uri).toBe("sip:100@doorpi.example");
  });

  it("rejects a DTMF key that is not one digit", () => {
    expect(() =>
      normalizeConfig({ dtmf_actions: [{ label: "Door", digit: "12" }] }),
    ).toThrow(/digit/);
  });

  it("normalises DTMF buttons and labels", () => {
    const config = normalizeConfig({
      dtmf_actions: [
        { label: " Open door ", digit: "1" },
        { digit: "#" },
      ],
      labels: { answer: "Here!", empty: "  " },
    });
    expect(config.dtmfActions).toEqual([
      { label: "Open door", digit: "1", icon: undefined },
      { label: "#", digit: "#", icon: undefined },
    ]);
    expect(config.labels).toEqual({ answer: "Here!" });
  });

  it("keeps a negative answer delay at zero", () => {
    const config = normalizeConfig({ auto_answer_delay: -4 });
    expect(config.autoAnswerDelay).toBe(0);
  });
});
