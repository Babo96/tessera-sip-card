# Security notes

## Native panel plugin

- The SIP password is a **text plugin input** in Tessera; `!secret` inside a
  plugin is rejected by Tessera's checker. It is stored in the plugin record,
  not in the layout or logs, but it is not a vault. Use a dedicated extension,
  a LAN/VPN PBX, and rotate it if the app data is exposed.
- SIP signalling can use WSS, but **RTP is plain UDP** (no SRTP/DTLS/ICE/TURN).
  Anyone on the path can listen. Keep the panel on a trusted LAN/VPN, or add a
  secure media gateway deliberately.
- Open only the panel's SIP port (e.g. 5062/udp) and the RTP range to the LAN.
  Do not expose plain SIP/RTP to the WAN.
- The vendored `sip_client` opens UDP sockets from the screen. This is a
  deliberate exception to Tessera's usual "data through the add-on" rule.
- The panel has no ringtone yet; no audio is recorded by the plugin.

## Browser card

## The password is in the browser

SIP.js authenticates from the browser, so the SIP account's password must reach
the browser. WSS encrypts it in transit and SRTP/DTLS encrypts the media, but a
person with access to the browser profile, devtools or a compromised dashboard
can read it. This is true of SIP Core's cards as well; it is not specific to
this card.

Practical mitigations:

- **Dedicated extension** for the card, not the SIP Core account.
- **Long random password**, stored in HA `secrets.yaml` if you use manual mode.
- **No admin dashboards on kiosk browsers.** Use a non-admin HA user with only
  the dashboard and helper permissions it needs.
- **Rotate** the password if a tablet is lost.
- **TURN credentials** are also exposed; scope them to coturn and rotate them.
- Prefer `ice_transport_policy: relay` on networks you do not trust.

## SIP Core hand-off

`GET /api/sip-core/config` is registered with `requires_auth = True` by the SIP
Core integration, and this card calls it with `fetchWithAuth`. The response
contains the selected user's SIP password (SIP Core is designed that way). The
card does not log the response and does not write the password to helpers,
events or storage.

## The card's own YAML

`password` is part of the card config, and Home Assistant sends the resolved
value to the browser so SIP.js can register. The visual editor's "Advanced"
JSON also shows it. If that matters:

- use a dedicated extension with a password you can rotate;
- keep the dashboard behind a non-admin user;
- do not export/share the dashboard YAML with the password in it;
- prefer SIP Core + a dedicated extension, so the card's YAML holds only the
  extension's own secret.

## Events and admin rights

Home Assistant's `fire_event` WebSocket command requires an **admin** user.
A non-admin kiosk still writes `state_entity`, `peer_entity` and
`event_entity`; automations should trigger on the event helper there. No
credential is written to any helper.

## What the card writes

- `input_text`/`input_select` helpers you name in `state_entity` and
  `peer_entity`: phase and caller only.
- One Home Assistant event per transition: no credentials.
- Commands are read, never written, unless `clear_command: true` clears the
  command helper you named.

## Debug logging

`debug: true` turns on SIP.js's protocol log. SIP messages can include
`Authorization` headers (digests, not the plaintext password) and caller
details. Do not leave debug on in a shared dashboard, and do not paste a debug
log into a public issue without reading it first.

## Dashboard trust

A Lovelace card runs with the logged-in user's permissions. A malicious card
can call services and read states. Install cards from sources you trust, pin
releases, and review updates. This card's only network calls are:

- `/api/sip-core/config` and `/api/sip-core/asterisk-ingress` (same origin, HA
  auth),
- the SIP WSS URL you configure,
- STUN/TURN servers from SIP Core or your config.

No analytics, no CDN, no fonts.

## Transport checks

- HA over HTTPS: required for `getUserMedia` and mixed-content rules.
- WSS with a valid certificate: `wss://doorpi.example:57000/ws`.
- Asterisk's WSS port and coturn ports are the only WAN-facing ports; SIP
  `5060` stays on loopback, AMI disabled, as DoorPi configures.
- fail2ban on the WSS/SIP ports on the Pi.

## Reporting

Open a private security advisory on GitHub rather than a public issue for a
credential leak or a way to make the card send media somewhere unexpected.
