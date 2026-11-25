# Changelog

## Plugin 0.2.1 — 2026-11-25

- The tile body calls, answers, cancels or hangs up at once; the bottom key
  opens the full card. Idle tiles say "Tap to call · Open for keys".
- Home Assistant buttons for call door/station, answer, hang up, mute and
  open-door DTMF.
- Verified on a Guition JC4880P443 (ESP32-P4 rev3): registration, incoming and
  outgoing calls, answer, mute, DTMF, hang up, 0 lost RTP packets.

## Plugin 0.2.0 — 2026-11-25

- Native SIP endpoint on the panel: vendored `sip_client`, registration, RTP,
  PCMU/PCMA, `ts_microphone` (AEC) and `ts_speaker`.
- Door tile, full call card, ring popup, auto-answer, mute, DTMF, target/station
  options, configurable account inputs.
- No browser or Home Assistant helper in the panel path.

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
