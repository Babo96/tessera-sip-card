# Tessera SIP — visual states

Screenshots of the demo page (`npm run dev`), captured at 2× pixel density. Every
image is a 1×2 tile inside a phone frame unless noted; no test-bench chrome is
included.

| File | State | URL query |
| --- | --- | --- |
| `idle.png` | Registered, tap to talk (1 × 2) | `/?only=tile&theme=light&sim=registered` |
| `ringing.png` | Incoming doorbell (1 × 2) | `/?only=tile&theme=light&sim=incoming` |
| `connected.png` | Call up, timer, mute + door keys (2 × 2) | `/?only=square&theme=light&sim=incoming,connected` |
| `error.png` | Registration failed, retry (1 × 2) | `/?only=tile&theme=light&sim=error` |
| `dark.png` | Incoming call, dark theme (2 × 2) | `/?only=square&theme=dark&sim=incoming` |
| `wide.png` | Connected call, full width (two-column) | `/?only=wide&theme=light&sim=incoming,connected` |
| `panel.png` | Incoming call in a 480 × 800 wall panel | `/?only=panel&theme=dark&sim=incoming` |
| `camera.png` | Incoming call with the demo camera still | `/?only=square&theme=light&camera=1&sim=incoming` |
| `camera-wide.png` | Full-bleed camera still, full width | `/?only=wide&theme=light&camera=1&sim=incoming` |
| `camera-connected.png` | Connected call with the camera still, dark | `/?only=wide&theme=dark&camera=1&sim=incoming,connected` at 740 px wide |
| `connected-tile.png` | Connected call in a 1 × 2 tile | `/?only=tile&theme=light&sim=incoming,connected` |
| `muted.png` | Muted call, with the unmute key (2 × 2) | `/?only=square&theme=light&sim=incoming,connected,muted` |
| `outgoing.png` | Dialling the door | `/?only=tile&theme=light&sim=outgoing` |
| `audio.png` | Ringing with autoplay blocked | `/?only=tile&theme=light&sim=incoming,audio-blocked` |
| `booting.png` | Registering, spinner | `/?only=tile&theme=light&sim=unregistered,registering` |
| `unregistered.png` | Line offline | `/?only=tile&theme=light&sim=unregistered` |
| `fault.png` | Resolve/config fault panel | `/?only=tile&theme=light&fault=1` |
| `german.png` | German copy (2 × 2) | `/?only=square&theme=light&lang=de&sim=incoming` |
| `edge-620.png` | Two-column layout starts at 620 px | `/?only=wide&theme=light&sim=incoming` at 726 px wide |
| `narrow-breakpoint.png` | 562 px card, stacked layout | `/?only=wide&theme=light&sim=incoming` at 668 px wide |
| `tablet.png` | 694 px dark connected call | `/?only=wide&theme=dark&sim=incoming,connected` at 800 px wide |
| `focus.png` | Keyboard focus ring on Decline | same as ringing, focused with Tab |
| `reduced-motion.png` | Registering with reduced motion | same as booting, emulated `prefers-reduced-motion: reduce` |
| `overview.png` / `overview-dark.png` | Whole demo bench | `/?theme=light&sim=incoming`, `/?theme=dark&sim=connected` |
| `mobile-demo.png` | Demo bench at 420 px | `/?theme=light&sim=incoming` |

The demo accepts `?only=tile|square|wide|panel`, `?theme=light|dark`, `?sim=a,b`
(comma-separated events, applied after the fake client boots), `?camera=1`,
`?lang=de` and `?fault=1` (forces a SIP Core resolve error).
