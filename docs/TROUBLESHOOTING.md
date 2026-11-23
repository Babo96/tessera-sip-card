# Troubleshooting

Set `debug: true` on the card for one run, open the browser console, and read
the `[tessera-sip]` lines. Turn it off afterwards.

## The card is not in the picker

- Resource not loaded: Settings → Dashboards → Resources. The URL must be a
  **JavaScript module** and must return `200` (open it directly).
- HACS path is usually `/hacsfiles/tessera-sip-card/tessera-sip-card.js`; a
  manual install is `/local/tessera-sip-card.js`.
- Hard-reload after installing (the module is cached aggressively).
- A YAML syntax error in the card config also hides it from the picker; check
  the browser console for the thrown message.

## "No WebSocket URL" / "No SIP account"

The card tried SIP Core, could not read a usable config, and has no manual
settings. Either:

- configure SIP Core (Settings → Devices & Services → SIP Core → Configure), or
- set `use_sip_core: false` plus `wss_url`, `pbx_server`, `extension`,
  `password`.

If SIP Core is installed but shows its default `jordy / 100 / 1234` user, it is
not configured yet.

## Registration fails

| Symptom | Likely cause |
|---|---|
| `401`/`403` in the console | Wrong password or auth user; the Asterisk endpoint's password differs from SIP Core's. |
| `404` | Wrong WSS path. DoorPi uses `/ws`; the URL is `wss://host:57000/ws`, not `wss://host:57000`. |
| WebSocket never opens | Certificate, port forward, hairpin NAT, or the Asterisk HTTP server is not listening on WSS. |
| Works on the laptop, not on the tablet | Tablet on a guest VLAN or a different DNS; TURN/STUN blocked. |
| `SIP offline` after a while | Kiosk tab slept; give the browser a wake lock, or the card reconnects when visible. Check the console for backoff lines. |

First prove the WebSocket itself, without credentials:

```sh
node tools/check-wss.mjs wss://doorpi.example:57000/ws
# open: subprotocol=sip
```

This checks DNS, TLS, the port and the `sip` subprotocol. If it fails, no SIP
password will help.

Asterisk side (`doorpi`):

```sh
asterisk -rx "pjsip show endpoints"
asterisk -rx "pjsip show endpoint 100"
asterisk -rx "pjsip show registrations"
```

## No audio

1. **Secure context:** the page must be `https://`. `http://192.168.x.x:8123`
   cannot get the microphone.
2. **Autoplay:** the card shows **Tap for sound** when the browser refuses to
   play the remote stream. One tap fixes it; kiosks should start with a user
   gesture (a tap on the dashboard).
3. **Microphone permission:** check the browser's site settings.
4. **ICE/TURN:** open `chrome://webrtc-internals` during a call. If the
   candidate pair is not connected, add coturn or set
   `ice_transport_policy: relay`.
5. **One-way audio** is almost always NAT or a codec mismatch. DoorPi's
   endpoint allows `ulaw,alaw`; SIP.js offers Opus first, but Asterisk
   transcodes if `allow` includes a codec both can use. Check
   `pjsip show endpoint 100` and the Asterisk log.
6. **Speaker muted:** the card's mute key toggles the sender track only; the
   remote `<audio>` element is always unmuted. Check the OS output device.

## It rings but tapping answer does nothing

- If the call is **parked**, you cannot answer it; you have to dial `555`. Set
  `call_target: "555"`. `auto_answer` does not pick up a parked call.
- If a call is **incoming**, `answer()` calls `Invitation.accept()`. A rejected
  accept (488/500) usually means SDP/ICE trouble; the console shows it.
- If the card shows ringing but a second card (SIP Core's) is also registered on
  the same extension, the other UA may have answered it. Use a dedicated
  extension.

## The panel tile is wrong

- It reads `sensor.tessera_sip`, which is a template over
  `input_text.tessera_sip_state`. Check Developer Tools → States.
- The card only writes the helper if `state_entity` is set **and** the card is
  loaded. If no browser has the dashboard open, there is nothing to write.
- If the tile is missing on the panel, the plugin is not built into that
  screen's firmware. Check Tessera → the screen → Plugins.
- If the tile is stale after a browser closes mid-call, the last phase stays
  `connected`. Reload the card once, or add an automation that resets the
  helper when the browser/tab is gone (a `browser_mod` or ping sensor can do
  it).

## The camera snapshot is blank

- The camera entity's `entity_picture` may be missing until its first frame.
- HA rotates the camera proxy token every five minutes; the card re-reads the
  state on each `hass` update. A tab that never receives updates (sleeping) can
  show a stale token; a touch or a state change fixes it.
- The card only shows the snapshot while ringing/connected.

## Debugging the SIP handshake

With `debug: true`, the console includes SIP.js logs. Look for:

- `transport connected` — WSS is up.
- `registration Registered` — the account is accepted.
- `session InviteSent` / `Established` — the call reached media.
- `session Terminated` — who ended it and why.

For a packet-level view, use `chrome://webrtc-internals` and the Asterisk
`pjsip set logger on` output on the Pi.

## Still stuck

Open an issue with: HA version, browser/OS, card version, SIP.js console lines
(redact passwords and IPs), whether SIP Core is used, and whether the tab was
foregrounded.
