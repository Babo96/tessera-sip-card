# Live tests

## Native panel SIP (ESP32-P4 rev3)

Date: 2026-11-25. Device: Guition **JC4880P443**, Tessera firmware built
locally with ESPHome 2026.10.2 / ESP-IDF 5.5.6. PBX: the local Asterisk 20
fixture below, UDP transport on port 5062, extension `1003`, PCMU.

The panel firmware included the vendored `sip_client` and the Tessera audio
graph (`ts_microphone` post-AEC, `ts_speaker`). Results:

- `REGISTER` accepted; contact `1003@192.168.2.93` visible in Asterisk.
- Incoming call: `channel originate PJSIP/1003 application Echo` rang and was
  answered (auto-answer in the test build, then the plugin's Answer action).
- Outgoing: `555` and `8000` connected.
- Actions: mute, open-door DTMF (`1`), hang up.
- RTP (Asterisk `pjsip show channelstats`): `ulaw`, 502 received / 502 sent,
  0 lost; a second call 200 / 200, 0 lost.
- Firmware: 47.5% flash (3,860,036 / 8,126,464, 52% free), 24.4% internal RAM.

Not measured: acoustic quality, echo in the final enclosure, a real external
PBX, SRTP/TURN, and a visual tap-through of the card. The card and tile compile
and are installed; the Tessera host preview cannot build a microphone/speaker
plugin.

The PBX fixture is in `tools/asterisk/`; the panel used `192.168.2.45:5062`.

## Browser card against a local Asterisk

Date: 2026-11-23. Browser: Chromium through Playwright, on this machine.
Card: the worktree at `main` (before the final UI polish).

This proves the SIP.js adapter, not DoorPi: a local Asterisk 20.21 in Docker
with a WebSocket transport, no TLS, no TURN, and `Echo()` instead of a door
station. The fixture is in [`tools/asterisk/`](../tools/asterisk/).

## Setup

```sh
cd tools/asterisk
docker compose up -d
cd ../..
npm run dev
# http://127.0.0.1:5173/demo/live.html
```

| Field | Value |
|---|---|
| WSS URL | `ws://127.0.0.1:8088/ws` |
| URI | `sip:100@127.0.0.1` |
| Auth user | `100` |
| Password | `test` |
| Call target | `555` |

Microphone permission was granted to the test origin, so `getUserMedia` could
return a track.

## What happened

1. **Registration**: `REGISTER` → `SIP/2.0 200 OK`; card phase `booting` →
   `idle`; Asterisk logged `Added contact ... to AOR '100'` and
   `Endpoint 100 is now Reachable`.
2. **Outgoing call**: tap **Call 555** → phase `dialing`, then `connected`;
   Asterisk logged:
   ```
   Executing [555@from-internal:1] Answer("PJSIP/100-00000000", "")
   Executing [555@from-internal:2] Echo("PJSIP/100-00000000", "")
   ```
   The card showed the timer (`0:00`, then `0:03`), **Mute** → **Unmute**,
   and **Hang up** returned it to `idle`.
3. **Incoming call**: from the host,
   `docker exec asterisk-asterisk-1 asterisk -rx 'channel originate PJSIP/100 application Echo'`
   → card phase `ringing` with **Answer** / **Decline**; **Answer** →
   `connected`; **Hang up** → `idle`.
4. **Audio element**: `play()` succeeded (no "Tap for sound" key) with the
   test browser's media device. The RTP path is between the browser and
   Asterisk on loopback.
5. **Reconnect**: `docker restart asterisk-asterisk-1` while idle; the card
   showed `unregistered`, then `idle`/registered again within about two seconds;
   a call afterwards connected and hung up normally.

## Two bugs this found

- The first reconnect attempt never started a new user agent: `restart()` set
  `stopped = false` before `ensureStarted()`, whose guard returns unless
  `stopped` is true. Fixed, and the restart path is now exercised by hand.
- Registration events from the *old* registerer arrived after the new one had
  started, scheduling another restart every second. The client now ignores
  events from a replaced registerer/UA (a generation check), and a restart
  ends any stale call in the UI instead of leaving it `connected`.

## What this does not prove

- **TLS/WSS**: the fixture uses `ws://` on localhost, which is a secure
  context. DoorPi uses `wss://` with a real certificate.
- **NAT/ICE/TURN**: no coturn, no remote browser, no hairpin NAT.
- **Real audio content**: `Echo()` returns the browser's own audio; nobody
  listened. The media path is up but not judged for quality.
- **DoorPi**: no parked call, no `baresip`, no door station, no Asterisk 22
  with PJSIP/parking config.
- **Long calls, network loss, kiosk sleep**: the reconnect and visibility
  paths are implemented and unit-tested at the state level, but not yet
  exercised against a killed PBX.

The live DoorPi checklist is in [DOORPI.md](DOORPI.md).
