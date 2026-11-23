export type CommandAction =
  | "answer"
  | "decline"
  | "hangup"
  | "call"
  | "retry"
  | "mute"
  | "unmute"
  | "dtmf"
  | "enable_audio";

export interface Command {
  action: CommandAction;
  value?: string;
}

const ACTIONS = new Set<CommandAction>([
  "answer",
  "decline",
  "hangup",
  "call",
  "retry",
  "mute",
  "unmute",
  "dtmf",
  "enable_audio",
]);

/**
 * A command arrives as `answer`, `call:555`, `dtmf:1` from an `input_text`,
 * or as `{action: "call", target: "555"}` in an event.
 */
export function parseCommand(value: string | null | undefined): Command | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("{")) {
    try {
      return commandFromEvent(JSON.parse(trimmed) as Record<string, unknown>);
    } catch {
      return null;
    }
  }

  // A helper can only trigger on a value it has not held before, so scripts
  // append `|<timestamp>`. It is not part of the command.
  const base = trimmed.split("|")[0]?.trim() ?? "";
  const [rawAction, ...rest] = base.split(":");
  const action = rawAction?.trim().toLowerCase() as CommandAction | undefined;
  if (!action || !ACTIONS.has(action)) return null;
  const valuePart = rest.join(":").trim();
  return valuePart ? { action, value: valuePart } : { action };
}

export function commandFromEvent(data: Record<string, unknown> | undefined): Command | null {
  if (!data) return null;
  const raw = (data.action ?? data.command) as unknown;
  if (typeof raw !== "string") return null;
  const action = raw.trim().toLowerCase() as CommandAction;
  if (!ACTIONS.has(action)) return null;
  const value =
    (typeof data.target === "string" && data.target) ||
    (typeof data.digit === "string" && data.digit) ||
    (typeof data.value === "string" && data.value) ||
    undefined;
  return value ? { action, value } : { action };
}
