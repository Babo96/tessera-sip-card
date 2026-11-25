# Tessera and SIP

## The short version

A Tessera screen is ESP32 firmware with LVGL. **SIP.js cannot run there**, but a
Tessera plugin can compile a native SIP stack into the firmware. That is what
`tessera-plugin/` now does: the panel registers to the PBX itself, carries RTP
audio on `ts_microphone`/`ts_speaker`, and draws the call UI. No browser and no
add-on bridge are involved.

The browser card (`tessera-sip-card`) remains a separate fallback for Home
Assistant dashboards, phones and kiosks. It is not the panel path.

```text
                    ┌────────────── ESP32-P4 panel ──────────────┐
  PBX / DoorPi ◄────┤ sip_client: REGISTER, INVITE, RTP, G.711  │
    SIP/UDP or WSS  │ ts_microphone (AEC) + ts_speaker           │
                    │ plugin: tile, call card, popup, DTMF       │
                    └────────────────────────────────────────────┘

                    ┌─────────── browser fallback ───────────────┐
  PBX / DoorPi ◄────┤ SIP.js + tessera-sip-card in a dashboard  │
                    └────────────────────────────────────────────┘
```

## Native plugin: how it fits Tessera

The plugin vendors the MIT
[`sip_client`](https://github.com/eigger/espcomponents) ESPHome component under
`tessera-plugin/components/sip_client/` and binds it to the board's audio:

- `ts_microphone`: 16 kHz / 16-bit / mono, post-AEC on the Guition es8311 path;
- `ts_speaker`: the screen's resampler speaker, mono;
- PBX account: SIP server, port, transport (`udp`/`ws`/`wss`), user, password,
  domain, caller id, PCMU/PCMA, RTP port 7078, keepalive 10 s;
- plugin UI: `door` tile, `call` card, ring popup, auto-answer, mute, DTMF.

The component opens UDP sockets for SIP and RTP. Tessera's plugin guidance
normally keeps network access in the add-on (`docs/PLUGINS.md`), but this is a
deliberate exception for a native SIP endpoint; the plugin still passes
`tools/check.py`, and the sockets live inside a vendored component rather than
in the YAML.

### What a plugin cannot magically do

- SIP.js is still a browser library; a plugin cannot load it.
- Plain RTP has no SRTP/DTLS/ICE/TURN here. WSS protects signalling only.
- There is no ringtone yet; the ring is visual.
- One `sip_client` per screen, one account per build.

## DoorPi account

DoorPi's existing PJSIP `transport-udp` listens on loopback only. A panel needs
a LAN transport and a plain endpoint, for example:

```ini
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
password=<secret>
[1003]
type=aor
max_contacts=1
remove_existing=yes
```

Open `5062/udp` from the LAN and keep the RTP range (`10000-20000/udp`)
LAN-reachable. From the panel:

- `555` picks up the parked door call;
- `8000` rings the door station.

For a remote PBX, WSS signalling is possible, but RTP remains plain UDP. Use a
LAN/VPN or an explicit firewall policy.

## What was verified on the real panel

Guition **JC4880P443**, ESP32-P4 rev3, Tessera firmware built locally with
ESPHome 2026.10.2 / ESP-IDF 5.5.6:

- firmware: 47.5% flash, 24.4% internal RAM;
- registered as `1003` to Asterisk on the LAN;
- incoming call answered automatically in the test build and by the plugin's
  Answer action;
- outgoing `555` and `8000` calls connected;
- mute, open-door DTMF and hang-up executed;
- RTP `ulaw`: 502/502 packets, 0 lost; another call 200/200, 0 lost.

The plugin check passes. The Tessera host preview refuses a plugin that needs a
microphone and speaker, so the final card visual/tap test is on the physical
panel.

## Browser fallback

The browser card still has its own value: a phone or a hallway tablet can
answer without touching the panel. See
[docs/BROWSER_CARD.md](BROWSER_CARD.md).

## Decision record

| Date | Decision | Why |
|---|---|---|
| 2026-11-23 | Browser card first | A working fallback while the panel path was unknown. |
| 2026-11-23 | Reject a SIP bridge in the add-on | The panel can do it natively; an add-on bridge adds another audio path and code. |
| 2026-11-25 | Native SIP plugin | `sip_client` compiles on the P4 with Tessera audio; the panel carries the call itself. |
| 2026-11-25 | Keep browser card | Useful for phones/tablets and as a test bench; it no longer drives the panel. |
