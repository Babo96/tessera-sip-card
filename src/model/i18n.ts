export type Language = "en" | "de";

type Vars = Record<string, string | number>;

const en = {
  connecting: "Connecting to the door…",
  offline: "The door line is offline",
  offline_hint: "Check the card settings, then retry.",
  idle_hint: "Tap to talk",
  ringing: "Someone is at the door",
  ringing_hint: "Incoming call",
  calling: "Calling {peer}…",
  calling_hint: "Ringing the door…",
  connected: "Connected",
  connected_hint: "Speak now — the door hears you.",
  error: "Call problem",
  answer: "Answer",
  decline: "Decline",
  cancel: "Cancel",
  hangup: "Hang up",
  mute: "Mute",
  unmute: "Unmute",
  retry: "Try again",
  keypad: "Keypad",
  door: "Door",
  tap_for_sound: "Turn on sound",
  sound_blocked: "Your browser needs one tap for sound.",
  call_failed: "Call failed",
  call_ended: "Call ended",
  busy: "Busy",
  unknown: "Unknown",
  register: "Register",
} satisfies Record<string, string>;

const de: typeof en = {
  connecting: "Verbinde mit der Tür…",
  offline: "Die Türleitung ist offline",
  offline_hint: "Prüfe die Karteneinstellungen und versuche es erneut.",
  idle_hint: "Tippen zum Sprechen",
  ringing: "Jemand an der Tür",
  ringing_hint: "Eingehender Anruf",
  calling: "Rufe {peer} an…",
  calling_hint: "Die Tür klingelt…",
  connected: "Verbunden",
  connected_hint: "Sprich jetzt – die Tür hört dich.",
  error: "Anruffehler",
  answer: "Annehmen",
  decline: "Ablehnen",
  cancel: "Abbrechen",
  hangup: "Auflegen",
  mute: "Stumm",
  unmute: "Ton an",
  retry: "Erneut versuchen",
  keypad: "Tasten",
  door: "Tür",
  tap_for_sound: "Ton einschalten",
  sound_blocked: "Ein Tipp schaltet den Ton ein.",
  call_failed: "Anruf fehlgeschlagen",
  call_ended: "Anruf beendet",
  busy: "Besetzt",
  unknown: "Unbekannt",
  register: "Registrieren",
};

const dictionaries: Record<Language, typeof en> = { en, de };

export function languageOf(value: string | undefined): Language {
  return value?.toLowerCase().startsWith("de") ? "de" : "en";
}

export function translate(lang: Language, key: keyof typeof en, vars?: Vars): string {
  let text: string = dictionaries[lang][key] ?? en[key] ?? String(key);
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}
