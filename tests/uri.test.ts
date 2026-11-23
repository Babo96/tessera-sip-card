import { describe, expect, it } from "vitest";
import {
  buildSipUri,
  domainOf,
  guessDoorPiWss,
  normalizeWss,
  targetUri,
  userOf,
  wssFromIngress,
} from "../src/sip/uri";

describe("SIP addresses", () => {
  it("builds a URI from an extension and a PBX", () => {
    expect(buildSipUri("100", "doorpi.example")).toBe("sip:100@doorpi.example");
    expect(buildSipUri("100@doorpi.example", "ignored")).toBe("sip:100@doorpi.example");
    expect(buildSipUri("sip:100@doorpi.example", "ignored")).toBe("sip:100@doorpi.example");
  });

  it("reads the domain and the user back", () => {
    expect(domainOf("sip:100@doorpi.example")).toBe("doorpi.example");
    expect(domainOf("sip:100@doorpi.example:5060")).toBe("doorpi.example");
    expect(userOf("sip:100@doorpi.example")).toBe("100");
    expect(userOf("100")).toBeUndefined();
  });

  it("dials a bare extension on the same PBX", () => {
    expect(targetUri("555", "doorpi.example")).toBe("sip:555@doorpi.example");
    expect(targetUri("sip:8000@other.example", "doorpi.example")).toBe(
      "sip:8000@other.example",
    );
  });

  it("knows DoorPi's default WebSocket endpoint", () => {
    expect(guessDoorPiWss("doorpi.example")).toBe(
      "wss://doorpi.example:57000/ws",
    );
    expect(guessDoorPiWss("wss://doorpi.example:57000/ws")).toBe(
      "wss://doorpi.example:57000/ws",
    );
  });

  it("adds a scheme to a bare host", () => {
    expect(normalizeWss("doorpi.example:57000/ws")).toBe("wss://doorpi.example:57000/ws");
    expect(normalizeWss("wss://doorpi.example/ws")).toBe("wss://doorpi.example/ws");
  });

  it("turns an ingress entry into a WSS URL", () => {
    expect(wssFromIngress("/api/hassio_ingress/abc", "https://ha.example:8123")).toBe(
      "wss://ha.example:8123/api/hassio_ingress/abc/ws",
    );
  });
});
