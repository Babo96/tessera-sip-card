/** `0:07`, `4:05`, `1:02:09`. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const seconds = total % 60;
  const minutes = Math.floor(total / 60) % 60;
  const hours = Math.floor(total / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/** "555" from `sip:555@pbx.example` or `"555" <sip:555@pbx.example>;tag=...`. */
export function sipUserOf(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const match = /sip:([^@;>\s]+)/i.exec(value);
  return match?.[1] ?? value;
}
