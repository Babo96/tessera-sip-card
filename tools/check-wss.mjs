#!/usr/bin/env node
// Ask a PBX whether its SIP WebSocket is reachable. No credentials are sent:
// this only proves TLS, DNS, the port and the `sip` subprotocol.
//
//   node tools/check-wss.mjs wss://doorpi.example:57000/ws
//
// Exit codes: 0 open, 1 error/refused, 2 timeout.

const url = process.argv[2];
if (!url) {
  console.error("usage: node tools/check-wss.mjs wss://pbx.example:57000/ws");
  process.exit(2);
}

if (typeof WebSocket === "undefined") {
  console.error("This script needs Node 22 or newer (global WebSocket).");
  process.exit(2);
}

console.log(`opening ${url} with subprotocol "sip"...`);
const socket = new WebSocket(url, ["sip"]);
const timer = setTimeout(() => {
  console.error("timeout: no answer within 10 s (firewall, port forward, TLS or DNS)");
  try {
    socket.close();
  } catch {
    // ignore
  }
  process.exit(2);
}, 10_000);

socket.addEventListener("open", () => {
  clearTimeout(timer);
  console.log(`open: subprotocol=${socket.protocol || "(none)"}`);
  socket.close();
  process.exit(0);
});

socket.addEventListener("error", (event) => {
  clearTimeout(timer);
  console.error(`error: ${event.message || event.type}`);
  process.exit(1);
});
