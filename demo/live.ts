import "../src/index";

const card = document.getElementById("card") as HTMLElement & {
  hass: unknown;
  setConfig: (config: unknown) => void;
  _model?: { phase: string; peer?: string; error?: string };
};
const log = document.getElementById("log") as HTMLElement;

function line(text: string): void {
  log.textContent = `${new Date().toLocaleTimeString()}  ${text}\n${log.textContent}`;
}

const hass = {
  states: {},
  user: { id: "live-bench", name: "Live bench" },
  locale: { language: "en" },
};

document.getElementById("form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target as HTMLFormElement);
  const wss = String(data.get("wss") ?? "");
  const uri = String(data.get("uri") ?? "");
  const auth = String(data.get("auth") ?? "").trim();
  const password = String(data.get("password") ?? "");
  const target = String(data.get("target") ?? "555");

  line(`connecting ${uri} via ${wss}`);
  card.hass = hass;
  card.setConfig({
    name: "Live bench",
    use_sip_core: false,
    wss_url: wss,
    uri,
    auth_user: auth || undefined,
    password,
    call_target: target,
    call_label: "Call 555",
    debug: true,
  });
});

setInterval(() => {
  const model = card._model;
  if (!model) return;
  const text = `phase=${model.phase}${model.peer ? ` peer=${model.peer}` : ""}${
    model.error ? ` error=${model.error}` : ""
  }`;
  if (log.dataset.last !== text) {
    log.dataset.last = text;
    line(text);
  }
}, 500);

declare global {
  interface Window {
    __liveCard: typeof card;
  }
}
window.__liveCard = card;
