import { describe, expect, it } from "vitest";
import { formatDuration, sipUserOf } from "../src/model/format";

describe("formatting", () => {
  it("formats a call timer", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(7_000)).toBe("0:07");
    expect(formatDuration(65_000)).toBe("1:05");
    expect(formatDuration(3_600_000)).toBe("1:00:00");
    expect(formatDuration(3_661_000)).toBe("1:01:01");
    expect(formatDuration(-500)).toBe("0:00");
  });

  it("finds the user in a SIP identity", () => {
    expect(sipUserOf("sip:555@doorpi.example")).toBe("555");
    expect(sipUserOf('"Front door" <sip:8000@doorpi.example>;tag=1')).toBe("8000");
    expect(sipUserOf("555")).toBe("555");
    expect(sipUserOf(undefined)).toBeUndefined();
  });
});
