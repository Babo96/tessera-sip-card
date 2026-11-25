# Tessera SIP

A **native SIP phone for Tessera panels** — the screen registers to a SIP PBX
itself, carries the audio on its own microphone and speaker, and draws a door
tile plus a full-screen call card. No browser, no Home Assistant helper, no
bridge process.

The repository also keeps the earlier **SIP.js card for Home Assistant
dashboards** as a fallback for phones and tablets. It is documented separately
in [docs/BROWSER_CARD.md](docs/BROWSER_CARD.md).

- **Native Tessera plugin:** [`tessera-plugin/`](tessera-plugin/) — ESP32-P4,
  SIP registration, RTP, G.711/G.722, mic/speaker, tile + card, DTMF, mute,
  auto-answer, ring popup. Configurable server/account and tile targets.
- **Browser card:** [`tessera-sip-card`](docs/BROWSER_CARD.md) — SIP.js,
  Home Assistant dashboard, for a hallway tablet or phone.

> **Status**
> The native plugin registers, calls, answers, mutes, sends DTMF and hangs up
> on a real **Guition JC4880P443 (ESP32-P4 rev3)** with Tessera's
> echo-cancelled audio path. It is registered to the owner's DoorPi as **8001**
> and was exercised against a local Asterisk account (`1003`) with 0 lost RTP
> packets. The card is installed on the panel; the final call into the door
> station depends on baresip/8000 being up. The browser card is separately
> live-tested as described in [docs/LIVE_TEST.md](docs/LIVE_TEST.md).

---

## Native on-device SIP

```text
  DoorPi / PBX ── SIP/UDP or SIP over WSS ── ESP32-P4 ── I2S/AEC ── mic + speaker
                          RTP over UDP                 Tessera tile / call card
```

The plugin vendors the MIT [`sip_client`](tessera-plugin/components/sip_client/)
ESPHome component (thanks to eigger/espcomponents) and binds it to Tessera's
standard audio features:

- `ts_microphone` — 16 kHz, 16-bit mono, post-AEC on the Guition boards;
- `ts_speaker` — the screen's resampler speaker.

One `sip_client` runs per screen, registers as a normal PBX extension, and the
plugin draws the call UI.

### What the panel does

- **Tile** (`door`), 1×1 to 2×2:
  - tap the tile body → **call the configured target** (`555` by default);
  - while ringing → **answer**;
  - while dialing/connected → **cancel / hang up**;
  - the bottom **Open** key opens the full call card.
  - `station` is the second number (`8000` by default), used by the card.
- **Call card** (`call`, wide):
  - phase, caller, connected timer, registration dot;
  - Call door / Call station, Answer, Decline, Cancel, Hang up;
  - Mute/Unmute (PCM silenced while RTP continues);
  - Open door (DTMF `1`) and a 3×4 DTMF keypad on screens with room;
  - Retry registration.
- **Ring popup** with Answer/Decline, switchable.
- **Auto answer** switch.
- Home Assistant buttons for call door, call station, answer, hang up, mute and
  open door — useful for automations and testing.

### Requirements

- A Tessera screen with **microphone, speaker and PSRAM**: the Guition
  **JC4880P443** (4.3", 480×800) is the reference, and the plugin declares
  `requires.features: [microphone, speaker]` and `requires.psram: true`.
- A SIP account on a PBX reachable from the panel:
  - UDP SIP (`5060`, or a LAN port such as `5062`) and plain RTP, or
  - SIP over WSS for signalling; **RTP stays plain UDP**.
- The PBX must allow the panel's codecs: `ulaw`, `alaw` (PCMU/PCMA). G.722 is
  available in the component, not offered by this plugin by default.
- Firmware build with **ESPHome ≥ 2026.9.1** for P4 rev3. The owner's panel
  needs the local `esp32: engineering_sample: false` override; do not build the
  rev3 panel with an older ESPHome.

### Install the plugin

The plugin is in this repository under `tessera-plugin/` (0.2.1).

1. In Tessera → **Plugins**, add a link to
   `https://github.com/Babo96/tessera-sip-card/tree/main/tessera-plugin`
   (or copy the folder to `<ESPHome config>/tessera-plugins/sip_doorbell/`).
2. Choose the screen and fill the inputs:
   `sip_server`, `sip_port`, `sip_user`, `sip_password`, `sip_domain`,
   `sip_caller`, `sip_transport` (`udp`, `ws` or `wss`).
3. Add the **SIP doorbell** tile from the Plugins group; choose a size from
   1×1 to 2×2, set **Call target** and **Station** in the inspector.
4. Build the screen. The build adds the SIP component and the UI to the
   firmware; later layout changes do not rebuild it.
5. On the screen's **Plugins** page (or in Home Assistant), set **Auto answer**
   and **Ring popup** as wanted.

> **Password:** Tessera forbids `!secret` inside a plugin (`tools/check.py`
> rejects it), so the SIP password is a **text input**, stored in the plugin
> record like other plugin values. Use a dedicated extension and a LAN/VPN
> PBX; rotate it if the app data is exposed.

### PBX example (DoorPi / Asterisk)

DoorPi's existing `transport-udp` is loopback-only for the door station. Add a
plain SIP transport for panels, without WebRTC/ICE/SRTP:

```ini
; pjsip.conf — a LAN-only panel transport
[transport-udp-panel]
type=transport
protocol=udp
bind=0.0.0.0:5062

[1003]
type=endpoint
transport=transport-udp-panel
context=from-internal
disallow=all
allow=ulaw,alaw
direct_media=no
rtp_symmetric=yes
force_rport=yes
rewrite_contact=yes
auth=1003
aors=1003
callerid="Gang" <1003>

[1003]
type=auth
auth_type=userpass
username=1003
password=!secret
[1003]
type=aor
max_contacts=1
remove_existing=yes
```

- Open **5062/udp** from the LAN only, and keep the RTP range
  (`10000-20000/udp`) LAN-reachable.
- The panel calls `555` to pick up DoorPi's parked call, or `8000` to ring the
  door station.
- For an external PBX, use its host/port/account in the plugin inputs. WSS
  protects signalling only; RTP is still plain UDP, so use a LAN, VPN or a
  firewall policy you trust. There is no SRTP/DTLS/ICE/TURN.

### Build and verify

The plugin was compiled into the real `jc4880p443` firmware with ESPHome
2026.10.2 / ESP-IDF 5.5.6:

```text
Flash: 47.5% (3,860,036 bytes of 8,126,464; 52% free)
RAM:   24.4% (160,182 bytes of 655,360)
```

On the panel:

- registered as `1003` to Asterisk on `<pbx-host>:5062`;
- an incoming call was answered automatically (test firmware) and by the
  plugin's **Answer** action;
- outgoing `555` and `8000` calls connected;
- mute, open-door DTMF and hang-up actions executed;
- RTP with `ulaw`: **502 received / 502 sent, 0 lost** in one call, and
  **200 / 200, 0 lost** in another.

The Tessera plugin check passes; the host preview refuses the plugin because
the bench has no microphone/speaker, so the final visual tap-through is on the
real panel rather than in the render harness.

---

## Browser card (fallback)

The original card is still here and unchanged for Home Assistant dashboards,
phones and kiosks. It uses SIP.js in a browser and needs no panel audio.

- HACS → **Dashboard** → custom repository
  `https://github.com/Babo96/tessera-sip-card`, install **Tessera SIP Card**.
- Or copy `dist/tessera-sip-card.js` to `/config/www/` and add it as a
  JavaScript module.
- It reuses SIP Core's connection details (WSS/ICE) but should use a dedicated
  extension, not SIP Core's `100`.
- Full options, DoorPi flow, events and helpers:
  [docs/BROWSER_CARD.md](docs/BROWSER_CARD.md).

The browser card and the native plugin can coexist: the panel no longer needs
the browser card, but a phone or hallway tablet can still answer through it.

---

## Limitations and next work

- **No ringtone** on the panel yet; the ring is visual (tile/popup).
- **No SRTP, DTLS, ICE or TURN.** SIP over WSS encrypts signalling only; RTP is
  plain UDP. Use a trusted LAN/VPN, or add a secure media path deliberately.
- **Password is a text plugin input**, not a secret (see above).
- **One SIP account per screen.** `sip_client` is one instance; changing the
  account is a build.
- **No video**; this is an audio doorbell.
- **Echo/gain** depends on the board's AEC/speaker; the Guition path uses the
  es8311 feedback AEC. Test the actual enclosure.
- **Tessera app build server:** the owner's app builds with ESPHome 2026.9.0
  for P4 and may produce a pre-rev3 image. Use a local ESPHome ≥2026.9.1 build
  for this panel until the app build server is upgraded.
- **Visual card audit** on the panel is still open; the tile and card compile,
  but the render harness cannot draw a microphone/speaker plugin.

## Open questions

1. Which external SIP server, extension and password should be the final
   values? The current panel carries a test account (`1003` on the local LAN).
2. Should the tile body call `555`, `8000`, or be configurable per size? It is
   already an option; what should the default be?
3. Add a ringtone, and if so which sound?
4. Should the panel expose more Home Assistant entities (call state, caller)
   or keep the UI local?
5. Should the plugin be submitted to the Tessera plugin index (and the browser
   card to HACS)?
6. Is plain RTP on the LAN acceptable, or is a secure-media path required?

Tracked in [issue #1](https://github.com/Babo96/tessera-sip-card/issues/1).

## Credits

- [Tessera / ESP Screens](https://github.com/MaxGramser/homeassistant_espscreen)
  by Max Gramser — the UI, plugin API and audio graph.
- [eigger/espcomponents `sip_client`](https://github.com/eigger/espcomponents) —
  the MIT SIP stack vendored for the native panel endpoint.
- [SIP.js](https://sip.js.net/) — the browser fallback card.
- DoorPi — the SIP doorbell this was built for.

MIT licensed; the vendored SIP component keeps its own MIT/G.722 notices in
`tessera-plugin/components/sip_client/`.
