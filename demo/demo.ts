import { setClientFactory } from "../src/sip/hub";
import { MockClient, mockClients } from "./mock-client";
import type { ClientEvent } from "../src/model/state";
import type { HassEntity, HassLike } from "../src/ha/types";

setClientFactory((config) => {
  const client = new MockClient(config);
  mockClients.push(client);
  return client;
});

await import("../src/index");

const params = new URLSearchParams(location.search);

const CONFIG = params.get("fault") === "1"
  ? {
      name: "Front door",
      icon: "doorbell",
      use_sip_core: true,
    }
  : {
      name: "Front door",
      icon: "doorbell",
      use_sip_core: false,
      wss_url: "wss://doorpi.example:57000/ws",
      uri: "sip:100@doorpi.example",
      password: "demo",
      call_target: "555",
      call_label: "Pick up the doorbell",
      camera: "camera.front_door",
      dtmf_actions: [
        { label: "Open door", digit: "1", icon: "check" },
        { label: "Light", digit: "2", icon: "volume" },
      ],
    };

type DemoCard = HTMLElement & {
  hass?: HassLike;
  setConfig: (config: unknown) => void;
};

const cards = () => Array.from(document.querySelectorAll<DemoCard>("tessera-sip-card"));

const states: Record<string, HassEntity> = {};
const hass: HassLike = {
  states,
  user: { id: "demo", name: "Demo" },
  locale: { language: params.get("lang") === "de" ? "de" : "en" },
};

/** A demo-only still, served from this repo; the card itself ships no images. */
const CAMERA: HassEntity = {
  entity_id: "camera.front_door",
  state: "idle",
  attributes: { entity_picture: "/demo/porch.svg" },
};

if (params.get("camera") === "1") states[CAMERA.entity_id] = CAMERA;

for (const card of cards()) {
  card.hass = hass;
  card.setConfig(CONFIG);
}

/* ── Theme ────────────────────────────────────────────────────────────── */

const root = document.documentElement;

function setTheme(theme: "light" | "dark"): void {
  root.dataset.theme = theme;
  const button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  if (button) {
    button.textContent = theme === "dark" ? "Light" : "Dark";
    button.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
    button.removeAttribute("aria-pressed");
  }
}

setTheme(
  params.get("theme") === "dark" || params.get("theme") === "light"
    ? (params.get("theme") as "light" | "dark")
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
);

/* ── Language ─────────────────────────────────────────────────────────── */

function setLanguage(language: "en" | "de"): void {
  hass.locale = { language };
  for (const card of cards()) card.hass = hass;
  const button = document.querySelector<HTMLButtonElement>("[data-lang-toggle]");
  if (button) {
    button.textContent = language === "de" ? "EN" : "DE";
    button.setAttribute("aria-label", language === "de" ? "Auf Englisch wechseln" : "Switch language to German");
  }
}

setLanguage(hass.locale?.language === "de" ? "de" : "en");

/* ── Camera still ─────────────────────────────────────────────────────── */

function setCamera(on: boolean): void {
  if (on) states[CAMERA.entity_id] = CAMERA;
  else delete states[CAMERA.entity_id];
  for (const card of cards()) card.hass = hass;
  const button = document.querySelector<HTMLButtonElement>("[data-camera-toggle]");
  if (button) button.setAttribute("aria-pressed", on ? "true" : "false");
}

if (params.get("camera") === "1") setCamera(true);

/* ── Simulated SIP ────────────────────────────────────────────────────── */

const log = document.getElementById("log") as HTMLElement;

function line(text: string): void {
  const stamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const rows = `${stamp}  ${text}\n${log.textContent ?? ""}`.split("\n").filter(Boolean);
  log.textContent = rows.slice(0, 7).join("\n");
}

const EVENTS: Record<string, ClientEvent> = {
  registered: { type: "registration", state: "registered" },
  registering: { type: "registration", state: "registering" },
  incoming: { type: "incoming", peer: "8000", peerName: "Front door" },
  outgoing: { type: "outgoing", peer: "555", peerName: "Front door" },
  connected: { type: "connected" },
  muted: { type: "muted", muted: true },
  ended: { type: "ended", reason: "local" },
  declined: { type: "ended", reason: "declined" },
  unregistered: { type: "registration", state: "unregistered" },
  error: { type: "registration", state: "failed", error: "The PBX closed the connection." },
  "audio-blocked": { type: "audio-blocked" },
};

function markActive(action: string): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-sim]")) {
    button.classList.toggle("is-active", button.dataset.sim === action);
  }
}

function sim(action: string): void {
  if (action === "reset") {
    location.reload();
    return;
  }
  const client = mockClients[0];
  if (!client) {
    line(`${action} — the demo client has not started yet`);
    return;
  }
  const event = EVENTS[action];
  if (!event) return;
  // Registering is only meaningful from an unregistered line.
  if (action === "registering") client.simulate(EVENTS.unregistered!);
  client.simulate(event);
  line(action);
  markActive(action);
}

document.getElementById("controls")?.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-sim]");
  if (target?.dataset.sim) sim(target.dataset.sim);
});

document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

document.querySelector("[data-lang-toggle]")?.addEventListener("click", () => {
  setLanguage(hass.locale?.language === "de" ? "en" : "de");
});

document.querySelector("[data-camera-toggle]")?.addEventListener("click", () => {
  setCamera(!states[CAMERA.entity_id]);
});

for (const card of cards()) {
  card.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const action = target.closest<HTMLElement>("[data-action]");
    if (action) line(`card action: ${action.dataset.action}`);
  });
}

/* ── Screenshot helpers: ?only=tile&sim=ringing&theme=dark&camera=1 ───── */

const only = params.get("only");
if (only && ["tile", "square", "wide", "panel"].includes(only)) {
  document.body.dataset.only = only;
  for (const stage of document.querySelectorAll<HTMLElement>(".stage")) {
    stage.hidden = stage.dataset.stage !== only;
  }
}

const autoplay = params.get("sim");
if (autoplay) {
  const steps = autoplay
    .split(",")
    .map((step) => step.trim())
    .filter(Boolean);
  let tries = 0;
  const boot = (): void => {
    if (mockClients.length > 0) {
      steps.forEach((step, index) => window.setTimeout(() => sim(step), 260 + index * 220));
      return;
    }
    if (tries++ < 80) window.setTimeout(boot, 60);
  };
  boot();
}

declare global {
  interface Window {
    __tesseraDemo: {
      simulate: (action: string) => void;
      mock: typeof mockClients;
      theme: (theme: "light" | "dark") => void;
      language: (language: "en" | "de") => void;
      camera: (on: boolean) => void;
    };
  }
}

window.__tesseraDemo = {
  simulate: sim,
  mock: mockClients,
  theme: setTheme,
  language: setLanguage,
  camera: setCamera,
};

line("demo ready");
