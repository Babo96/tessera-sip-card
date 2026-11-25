# DoorPi: the card and the panel

There are two independent ways to answer DoorPi:

1. **Native panel plugin** (`tessera-plugin/`): the ESP32-P4 registers to
   Asterisk as its own extension and carries the audio. This is the main path.
2. **Browser card** (`tessera-sip-card`): SIP.js in a dashboard, for a phone or
   tablet. The rest of this page describes it.

## Native panel endpoint on DoorPi

DoorPi's `transport-udp` is loopback-only for the door station. Add a LAN
transport and endpoint for the panel, for example on port 5062:

```ini
; ansible/roles/sipserver/templates/pjsip.conf.j2
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
password={{ doorpi_sip_panel_password }}
[1003]
type=aor
max_contacts=1
remove_existing=yes
```

- Add `doorpi_sip_panel_password` to the Ansible Vault and open
  `5062/udp` from the LAN in UFW; the existing RTP range is already LAN-only.
- On the panel, set plugin inputs: server = the Pi's LAN name/IP, port `5062`,
  user `1003`, domain, password, transport `udp`.
- Tile **Call target** `555` picks up the parked call; **Station** `8000` rings
  the door station.
- The native plugin uses PCMU/PCMA, no SRTP/ICE. Keep it on the LAN/VPN.

With that, the panel's own speaker and microphone carry the call. No Home
Assistant SIP card or browser is involved.

---

# DoorPi: the exact settings

This is the card side of the flow in `doorpi/docs/ha-sip-core.md`.

## What DoorPi does on a ring

1. Visitor presses the button.
2. `baresip` (extension `8000`) dials `444`.
3. Asterisk parks the call in the `default` lot. The visitor hears music.
4. You call `555`; Asterisk runs `ParkedCall(default)` and connects the voice.
5. Parking times out after 180 s and hangs up.

The card's default `call_target` is therefore `555`.

```yaml
type: custom:tessera-sip-card
name: Haustür
call_target: "555"
call_label: Tür abheben
camera: camera.doorpi
```

## Reusing SIP Core — but not its extension

DoorPi's guide configures SIP Core v5 with:

| SIP Core setting | DoorPi value |
|---|---|
| Custom WSS URL | `wss://doorpi.example:57000/ws` |
| PBX server | `doorpi.example` |
| SIP user | `100` |
| SIP password | Ansible Vault `doorpi_sip_ha_password` |
| ICE servers | coturn on `doorpi.example` (3478, 5349) |
| `sip_video` | `false` |

The card can read that config from `/api/sip-core/config` and reuse the **WSS
URL and ICE servers**. It should **not** reuse extension `100`:

- SIP Core's frontend module is a Lovelace resource. It initialises on every
  dashboard load and registers extension `100` in that browser, even when no
  SIP Core card is on the page.
- DoorPi's `pjsip.conf.j2` gives extension `100` an AOR with
  `remove_existing=yes`. A second registration on `100` (this card) replaces
  SIP Core's contact; the next SIP Core reload replaces the card's. Calls fork
  unpredictably or stop ringing.

So: **one extension per user agent.** Keep `use_sip_core: true` for the
connection details, and set `extension` + `password` to a dedicated account:

```yaml
type: custom:tessera-sip-card
name: Haustür
use_sip_core: true
extension: "103"
password: !secret doorpi_sip_card_password
call_target: "555"
camera: camera.doorpi
```

### Add extension 103 to DoorPi

In `doorpi/ansible/group_vars/doorpi/main.yml`:

```yaml
doorpi_sip_card_ext: "103"
```

In the Ansible Vault (`ansible/group_vars/doorpi/vault.yml`), add
`doorpi_sip_card_password` with a long random value.

In `ansible/roles/sipserver/templates/pjsip.conf.j2`, beside the existing
`{{ doorpi_sip_ha_ext }}` block:

```jinja
; ── Tessera SIP card (WebRTC, one browser tab) ──────────────────────────
[{{ doorpi_sip_card_ext }}](webrtc-endpoint)
auth=auth-{{ doorpi_sip_card_ext }}
aors={{ doorpi_sip_card_ext }}
callerid="Tessera Card" <{{ doorpi_sip_card_ext }}>

[auth-{{ doorpi_sip_card_ext }}]
type=auth
auth_type=userpass
username={{ doorpi_sip_card_ext }}
password={{ doorpi_sip_card_password }}

[{{ doorpi_sip_card_ext }}]
type=aor
max_contacts=1
remove_existing=yes
```

Deploy with `./scripts/deploy.sh` or
`ansible-playbook -i ansible/inventory.ini ansible/site.yml --tags sipserver`
(the vault password is required). Verify:

```sh
asterisk -rx "pjsip show endpoint 103"
asterisk -rx "pjsip show contacts"
```

`max_contacts=1` on purpose: one tab per extension. Opening the card in two
tabs makes the second replace the first; the first reconnects and replaces the
second. Use one kiosk tab, or give each tab its own extension.

## Incoming calls vs. picking up a parked call

- **Parked pickup (`555`)** is an **outgoing** call from the card. `auto_answer`
  has no effect: there is nothing to answer. The visitor is already waiting.
- **Direct call to the card's extension (`103`)** is an **incoming** call.
  `auto_answer: true` works here. To make a hands-free doorbell, add a dialplan
  rule on the Pi that calls `103` when the button is pressed (or a HA automation
  that uses SIP Core to call `103`), instead of parking. Then the card answers
  itself after `auto_answer_delay` seconds.

Do not set both flows without a reason: a ring that parks and a ring that calls
the card produce two different experiences.

## DTMF

DoorPi's Asterisk does not ship a "door open" DTMF handler by default. If your
dialplan listens for a digit (for example `1` to `DoorPi`), configure it on the
card:

```yaml
dtmf_actions:
  - label: Tür öffnen
    digit: "1"
    icon: door
```

Otherwise the keys are still useful for IVRs and for testing the audio path.

## TURN and the LAN

DoorPi's notes say hairpin NAT works from the LAN, so the public name can be
used in the browser. Keep coturn in the ICE list anyway: Chrome obfuscates host
candidates with mDNS, and Asterisk does not resolve `.local` names.

If the browser is on the LAN and the public path fails, add a split-horizon
DNS override for `doorpi.example` → `192.168.1.10`.

## Checklist for the first real call

Do this once, from a laptop on the LAN, with the browser console open:

- [ ] `https://<ha>/` (not HTTP), microphone permission granted.
- [ ] Card shows **SIP** (registered) within a few seconds.
- [ ] Press the doorbell; the card shows **ringing** if the extension is called
      directly, or the SIP Core card shows the parked call.
- [ ] Tap the card: it dials `555`; two-way audio works; the timer runs.
- [ ] Say something at the door; the visitor hears it.
- [ ] Tap a DTMF key; the Asterisk log shows the digit (if the dialplan handles
      it).
- [ ] Hang up; the card returns to idle and the visitor's call is gone.
- [ ] Repeat while the tab is backgrounded; the card should still ring and
      answer when you return (visibility recovery).
- [ ] Check the browser console for SIP.js errors; set `debug: true` for one
      run if needed, then turn it off (SIP debug logs can contain credentials).

## What I could not verify from here

I did not have the SIP password, a browser on your LAN, or permission to touch
the Tessera app or the panel. The card is tested against a fake client and
unit tests; the first live call is yours.
