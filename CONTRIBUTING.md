# Contributing

## Before you start

- The card is a frontend-only Home Assistant module. No custom integration, no
  backend, no storage.
- Keep the pure layers pure: `src/model/`, `src/config/`, `src/sip/uri.ts`,
  `src/sip/resolve.ts` must not touch the DOM or SIP.js.
- The visual seam is `src/ui/contract.ts`. A UI change belongs in `src/ui/`;
  a behaviour change belongs in `src/card.ts` or the model.
- Never commit a real SIP password, TURN secret, API key or HA token. Examples
  use `!secret`.

## Checks

```sh
npm ci
npm run typecheck
npm test
npm run build
```

`dist/` is committed because HACS installs a tag without building. If you
change `src/`, run `npm run build` and commit the bundle too; CI rejects a
stale bundle.

## Tests

- Add a state transition test for every new phase or rule.
- Add a view test for a new key, word or tone.
- For a new config option: a normalize test and, if it reaches SIP, a resolve
  test.
- The demo (`npm run dev`, fake client) is the manual check for visuals and
  interaction. It needs no PBX.

## Style

- TypeScript strict; no `any` in new code unless SIP.js's types force it.
- 2 spaces, double quotes, trailing commas.
- British English in comments and docs ("behaviour", "colour") to match
  Tessera; user-facing strings live in `src/model/i18n.ts`.
- One thing per commit; a behaviour change and its test in the same commit.

## Pull requests

Describe what you tested (unit, demo, real PBX) and what you could not. A SIP
change without a real-call note is treated as unverified.
