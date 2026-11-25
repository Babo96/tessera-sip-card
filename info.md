# Tessera SIP

A native SIP phone for Tessera panels plus an optional SIP.js card for Home
Assistant dashboards.

**Native panel plugin** (`tessera-plugin/`): the ESP32-P4 registers to your PBX
itself, carries the call on its own microphone and speaker, and draws a
doorbell tile and a full call card — Answer/Decline/Hang up, mute, open-door
DTMF, keypad, auto-answer and a ring popup. Configurable server, account and
tile targets; 1×1 to 2×2 tiles.

No browser or Home Assistant helper is needed for the panel path. Tested on a
Guition JC4880P443 (P4 rev3) with a local Asterisk: registration, incoming and
outgoing calls, 0 lost RTP packets.

**Browser card** (`tessera-sip-card`): SIP.js in a dashboard for phones and
tablets; full details in `docs/BROWSER_CARD.md`.

Plain RTP (no SRTP/ICE/TURN); use a trusted LAN/VPN. The SIP password is a text
plugin input, not a vault secret.
