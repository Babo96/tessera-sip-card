import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../src/config/normalize";
import type { HassLike } from "../src/ha/types";
import { resolveSipConfig } from "../src/sip/resolve";
import type { SipCoreConfig } from "../src/sip/sip-core";

const hass: HassLike = {
  states: {},
  user: { id: "user-1", name: "Babo" },
};

const core: SipCoreConfig = {
  pbx_server: "doorpi.example",
  custom_wss_url: "wss://doorpi.example:57000/ws",
  users: [
    { ha_username: "user-1", extension: "100", password: "secret", display_name: "Hallway" },
    { ha_username: "other", extension: "102", password: "other" },
  ],
  backup_user: { ha_username: "backup", extension: "199", password: "backup" },
  ice_config: {
    iceServers: [{ urls: ["stun:stun.example:3478"] }],
    iceTransportPolicy: "all",
    iceGatheringTimeout: 1500,
  },
  incomingRingtoneUrl: "/sip_core_files/ring-tone.mp3",
};

describe("resolving an account", () => {
  it("prefers the SIP Core account of the logged-in user", async () => {
    const cfg = normalizeConfig({});
    const resolved = await resolveSipConfig(cfg, hass, { fetchCore: async () => core });

    expect(resolved.uri).toBe("sip:100@doorpi.example");
    expect(resolved.authUser).toBe("100");
    expect(resolved.password).toBe("secret");
    expect(resolved.displayName).toBe("Hallway");
    expect(resolved.wssUrl).toBe("wss://doorpi.example:57000/ws");
    expect(resolved.callTargetUri).toBe("sip:555@doorpi.example");
    expect(resolved.iceServers).toEqual([{ urls: ["stun:stun.example:3478"] }]);
    expect(resolved.iceGatheringTimeout).toBe(1500);
    expect(resolved.ringtone).toBe("/sip_core_files/ring-tone.mp3");
    expect(resolved.source).toBe("sip_core");
  });

  it("falls back to SIP Core's backup account", async () => {
    const stranger: HassLike = { ...hass, user: { id: "nobody", name: "Nobody" } };
    const resolved = await resolveSipConfig(normalizeConfig({}), stranger, {
      fetchCore: async () => core,
    });
    expect(resolved.uri).toBe("sip:199@doorpi.example");
    expect(resolved.password).toBe("backup");
  });

  it("uses the card's own account when SIP Core is absent", async () => {
    const cfg = normalizeConfig({
      use_sip_core: true,
      wss_url: "wss://doorpi.example:57000/ws",
      extension: "100",
      pbx_server: "doorpi.example",
      password: "manual",
    });
    const resolved = await resolveSipConfig(cfg, hass, { fetchCore: async () => null });
    expect(resolved.uri).toBe("sip:100@doorpi.example");
    expect(resolved.password).toBe("manual");
    expect(resolved.source).toBe("manual");
    expect(resolved.warnings[0]).toMatch(/SIP Core is not available/);
  });

  it("lets the card override the SIP Core account", async () => {
    const cfg = normalizeConfig({
      extension: "777",
      password: "override",
      call_target: "8000",
    });
    const resolved = await resolveSipConfig(cfg, hass, { fetchCore: async () => core });
    expect(resolved.uri).toBe("sip:777@doorpi.example");
    expect(resolved.authUser).toBe("777");
    expect(resolved.password).toBe("override");
    expect(resolved.callTargetUri).toBe("sip:8000@doorpi.example");
  });

  it("builds the WebSocket URL from the Asterisk ingress", async () => {
    const { custom_wss_url: _ignored, ...withoutWss } = core;
    const cfg = normalizeConfig({});
    const resolved = await resolveSipConfig(cfg, hass, {
      fetchCore: async () => withoutWss,
      fetchIngress: async () => "/api/hassio_ingress/abc",
      origin: "https://ha.example:8123",
    });
    expect(resolved.wssUrl).toBe(
      "wss://ha.example:8123/api/hassio_ingress/abc/ws",
    );
  });

  it("guesses DoorPi's WSS port when nothing says otherwise", async () => {
    const { custom_wss_url: _ignored, ...withoutWss } = core;
    const resolved = await resolveSipConfig(normalizeConfig({}), hass, {
      fetchCore: async () => withoutWss,
      fetchIngress: async () => null,
    });
    expect(resolved.wssUrl).toBe("wss://doorpi.example:57000/ws");
    expect(resolved.warnings.some((w) => w.includes("57000"))).toBe(true);
  });

  it("refuses a different extension without its own password", async () => {
    const cfg = normalizeConfig({ extension: "103" });
    await expect(resolveSipConfig(cfg, hass, { fetchCore: async () => core })).rejects.toThrow(
      /dedicated extension/,
    );
  });

  it("refuses an account without a password", async () => {
    const cfg = normalizeConfig({
      use_sip_core: false,
      wss_url: "wss://doorpi.example/ws",
      extension: "100",
      pbx_server: "doorpi.example",
      password: "present",
    });
    cfg.password = undefined;
    await expect(resolveSipConfig(cfg, hass)).rejects.toThrow(/password/i);
  });

  it("refuses when there is no WSS URL at all", async () => {
    const cfg = normalizeConfig({
      use_sip_core: false,
      wss_url: "wss://doorpi.example/ws",
      extension: "100",
      pbx_server: "doorpi.example",
      password: "x",
    });
    cfg.wssUrl = undefined;
    cfg.pbxServer = undefined;
    cfg.uri = undefined;
    await expect(resolveSipConfig(cfg, hass)).rejects.toThrow(/WebSocket/);
  });
});
