import { describe, expect, it } from "vitest";
import { commandFromEvent, parseCommand } from "../src/ha/command";

describe("panel and automation commands", () => {
  it("parses the plain actions", () => {
    expect(parseCommand("answer")).toEqual({ action: "answer" });
    expect(parseCommand("  HANGUP ")).toEqual({ action: "hangup" });
    expect(parseCommand("mute")).toEqual({ action: "mute" });
  });

  it("parses a target and a digit", () => {
    expect(parseCommand("call:555")).toEqual({ action: "call", value: "555" });
    expect(parseCommand("dtmf:1")).toEqual({ action: "dtmf", value: "1" });
    expect(parseCommand("call:sip:8000@doorpi.example")).toEqual({
      action: "call",
      value: "sip:8000@doorpi.example",
    });
  });

  it("ignores the unique suffix scripts append", () => {
    expect(parseCommand("answer|1790000000")).toEqual({ action: "answer" });
    expect(parseCommand("call:555|1790000000")).toEqual({ action: "call", value: "555" });
    expect(parseCommand("dtmf:1|1790000000")).toEqual({ action: "dtmf", value: "1" });
  });

  it("accepts JSON from an event payload", () => {
    expect(
      parseCommand('{"action":"call","target":"555"}'),
    ).toEqual({ action: "call", value: "555" });
    expect(
      parseCommand('{"command":"dtmf","digit":"9"}'),
    ).toEqual({ action: "dtmf", value: "9" });
  });

  it("hides its own state value", () => {
    expect(parseCommand("")).toBeNull();
    expect(parseCommand("idle")).toBeNull();
    expect(parseCommand("something:else")).toBeNull();
    expect(parseCommand("{not json")).toBeNull();
  });

  it("reads an event's data", () => {
    expect(commandFromEvent({ action: "answer" })).toEqual({ action: "answer" });
    expect(commandFromEvent({ action: "call", target: "555" })).toEqual({
      action: "call",
      value: "555",
    });
    expect(commandFromEvent({ action: "nope" })).toBeNull();
    expect(commandFromEvent(undefined)).toBeNull();
  });
});
