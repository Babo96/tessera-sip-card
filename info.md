# Tessera SIP Card

A SIP.js doorbell card for Home Assistant with the rounded, calm look of a
Tessera tile. Answer the door, talk, mute, send DTMF and hang up from the
dashboard.

- Works with DoorPi/Asterisk: pick up the parked call on `555` with one tap.
- Reuses the SIP Core integration's account, WSS URL and ICE servers, or takes
  manual settings.
- Fires events and writes optional helpers, so a Tessera panel can show the
  call and trigger answer/hang up through a companion plugin.
- No backend, no custom integration: one JavaScript module.

See the README for installation, the full option table and the honest
constraint: SIP.js runs in the browser, so a Tessera ESP32 screen is the
annunciator and remote, not the audio endpoint. `docs/TESSERA.md` explains the
add-on bridge that would change that.
