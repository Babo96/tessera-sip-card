# SIP doorbell

A native SIP phone for the Tessera panel. The ESP32-P4 registers itself to a PBX, carries the call audio through its
own microphone and speaker, and draws a door tile plus a full-screen call card. Nothing on the panel needs Home
Assistant, a browser, a WebRTC tab or a companion service for the call.

The separate [tessera-sip-card](https://github.com/MaxGramser/tessera-sip-card) browser card remains a separate
Home Assistant dashboard fallback. This plugin does not use it and does not change it.

## What it is

- **Native endpoint**: the vendored `sip_client` component (MIT, eigger, under `components/sip_client/`) does SIP
  registration, INVITE/BYE/CANCEL, Digest auth, RTP and DTMF. It is not a no-registration stack.
- **Audio on the panel**: `ts_microphone` (16 kHz, 16-bit mono, post-AEC from the es8311 path) feeds `sip_client`;
  `ts_speaker` plays the call. Codecs are G.711 PCMU/PCMA at 8 kHz, as configured in `plugin.yaml`.
- **No ringtone in this version.** Incoming ringing is shown on the tile, in the popup and on the card; the speaker
  plays only call audio.
- **No SRTP/DTLS for RTP** and no ICE. Signaling can be UDP, WS or WSS; audio is plain RTP UDP.

## Set up

1. Add this plugin to a panel that has a microphone and speaker. The manifest requires both features and PSRAM.
2. Fill in the SIP inputs for the extension: server, port, user, password, domain, caller name and transport.
   The values are substitutions; the defaults in `plugin.yaml` are placeholders and should be replaced.
3. Put the tile on a page. Set **Door number** (default 555) and **Station number** (default 8000) in its inspector.
4. Optionally turn **Ring popup** or **Auto answer** on under the plugin's settings.

### Password caveat

Tessera does not allow `!secret` in a plugin's `plugin.yaml`, so the SIP password is a normal text input. It is kept
in the plugin record and reaches the screen's generated configuration. Use a dedicated LAN extension with a password
that is not shared with anything else, and do not use a provider or trunk account here.

### DoorPi / Asterisk example

The example that was tested against the native client uses a LAN PBX endpoint:

- PBX SIP transport on UDP **5062** (or 5060 on a standard Asterisk/FreePBX).
- Plain RTP, no SRTP/ICE/WebRTC defaults; codecs **PCMU** and **PCMA** (G.711).
- The extension registers as the configured user and calls the door endpoint at the **Door number**.
- `Open door` sends DTMF **1** to the PBX after the call is connected.
- The panel's local RTP port is **7078**; the PBX/router firewall must allow the return RTP to that port.

For a remote PBX over `wss`, enable the WebSocket transport on the PBX, set `transport: wss`, and keep in mind that
only signaling is protected; RTP remains plain UDP and needs reachable ports or a VPN.

## The tile

- Sizes 1x1 to 2x2.
- Shows the native phase (Offline, Registering, Ready, Ringing, Calling, Connected, Error), the peer, a registered
  dot and the connected timer.
- A tap opens the **SIP call** card. The tile itself no longer dials or answers.

## The call card

The card is wide and shows the same status, peer and timer, with keys that follow the phase:

| Phase | Keys |
|---|---|
| Ready | Call door *target*, Call station *station* |
| Ringing | Answer, Decline |
| Calling | Cancel |
| Connected | Hang up, Mute/Unmute, Open door (DTMF 1), 3x4 DTMF keypad |
| Offline / Error | Retry (fresh REGISTER), Call *target* |
| Registering | status only |

- **Mute** zeroes the PCM in `sip_client`'s microphone callback and keeps sending RTP, so the PBX still receives
  packets while the microphone is silent.
- **Open door** sends `dtmf:1` through `sip_client.send_dtmf()`.
- **Retry** asks the client for a fresh REGISTER after a lost link.
- The DTMF keypad is created only when the card has room for touch-sized keys. The CYD 320x240 keeps the primary
  keys and drops the keypad; the 480x800 panel gets the full card.
- The back key is Tessera's; the card does not replace it.

## Build and verification

The native component was compiled in the real `jc4880p443` package with ESPHome 2026.10.2:

```sh
cd /tmp/opencode/native-prototype-build
uvx --from esphome==2026.10.2 esphome compile native-test-plugin.yaml
```

Result: success, 47.4 % flash and 27.6 % RAM used on the P4 build (`native-test.bin` 0x3ad5c0 bytes, 53 % of the app
partition free). The exact test file points `packages: plugin` at this plugin's `plugin.yaml`.

`tools/check.py` passes with the local Tessera manifest and boards. The host render harness refuses a plugin that
requires microphone and speaker, because the firmware built for a computer has neither, so there are no `.preview`
images for this version. The UI must be checked on the real panel.

## Limits and remaining risks

- **NAT**: only the panel's local RTP port is advertised. A remote PBX behind NAT needs the RTP port reachable or a
  VPN; there is no ICE/TURN.
- **TLS/SRTP**: `wss` protects SIP signaling only. There is no SRTP, so a remote deployment still has plain RTP audio.
- **Echo**: the mic is the post-AEC es8311 path, but speaker placement and gain still matter on a real panel.
- **Registration errors**: the client has no separate "registration failed" state; after a link that was once up, the
  tile shows Error, and Retry asks for a fresh REGISTER. Before the first registration it shows Offline/Registering.
- **No ringtone**: the speaker is not used for ringing in 0.2.0.
- **Password storage**: the password is a plugin text input, not an encrypted secret.
- **Browser card**: the `tessera-sip-card` project is unchanged and is not used by this plugin.
