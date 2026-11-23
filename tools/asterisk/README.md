# A local PBX for the card

Asterisk 20 with a WebSocket transport and one WebRTC endpoint, enough to prove
registration, an outgoing call, an incoming call, mute and hang up without
touching a real doorbell.

```sh
docker compose up -d
npm run dev
# open http://127.0.0.1:5173/demo/live.html and press Connect
```

Defaults in `demo/live.html`:

| Field | Value |
|---|---|
| WSS URL | `ws://127.0.0.1:8088/ws` |
| URI | `sip:100@127.0.0.1` |
| Auth user | `100` |
| Password | `test` |
| Call target | `555` |

`555` and `100` both answer with `Echo()`, so you can talk to yourself.
Asterisk runs with `network_mode: host` because WebRTC host candidates and
RTP do not survive a bridge NAT here. `ws://` is fine on `127.0.0.1` (a secure
context); production always uses `wss://`.

This is a test fixture, not a deployment: the password is public, there is no
TLS, no TURN, and the image is pinned only by major version. Never expose it.

Incoming call, from the host:

```sh
docker exec asterisk-asterisk-1 asterisk -rx 'channel originate PJSIP/100 application Echo'
```

Reset everything: `docker compose down` and `docker compose up -d`.
