# Changelog

## 0.2.1
- The tile now calls, answers, cancels or hangs up on a tap; its bottom key opens the full card.
- Home Assistant buttons for door/station call, answer, hang up, mute and open-door DTMF.
- A "Tap to call · Open for keys" hint on idle tiles.

## 0.2.0
- Native SIP phone on the panel: the plugin registers to the PBX with the vendored `sip_client`, uses the board's
  microphone and speaker, and no longer reads a Home Assistant helper or a browser command entity.
- The door tile shows the native phase, peer and call timer; a tap opens the call card.
- The call card calls the door and station targets, answers, declines, cancels, hangs up, mutes, sends DTMF and opens
  the door. The CYD keeps the primary keys without the keypad.
- Ring popup and auto-answer settings. No ringtone in this version.

## 0.1.0
- First version: a status and remote-control tile for the browser SIP card.
