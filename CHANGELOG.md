# Changelog

## 0.1.0 — 2026-11-23

First card.

- SIP.js WebRTC user agent with WSS registration, reconnection and kiosk
  visibility recovery.
- Incoming/outgoing calls, answer/decline/cancel/hang up, mute, DTMF.
- Optional auto-answer, camera snapshot, ringtone, per-state words (en/de) and
  YAML label overrides.
- Reads SIP Core's `/api/sip-core/config` for the WSS URL and ICE servers; the
  account can be SIP Core's or a dedicated extension. Manual configuration
  works without SIP Core.
- Home Assistant events (`tessera_sip_card`), state/peer helpers, command
  helper and `${event_type}_command` events.
- One shared user agent per account per page; state replay for cards created
  mid-call.
- Reconnection after a PBX restart, with stale registerer/UA events ignored and
  a restart ending a stale call in the UI (found by live testing).
- Pure state machine, view model, config and resolver with tests.
- Demo with a fake SIP client.
- Experimental Tessera companion plugin (`tessera-plugin/`): status tile and
  remote control for the browser card.
