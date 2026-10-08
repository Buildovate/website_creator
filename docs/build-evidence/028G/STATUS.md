# #028G round 1b — references complete

Worktree: C:\Users\joe\wc-game
Branch: launch/028G-game
BASE: b2446730d551656067f2aaa15a9c27497dceb8f7
Reserved port: 5183; no server started and no .data used.

## Scope and status

The owner explicitly narrowed this round to references only: no app code yet. This supersedes the original external ticket's G-1 progress-engine/adapters implementation for this round. This commit completes the authorized reference setup, not the original engine acceptance tests. Engine rules, 100-point arithmetic, dependency adapters and all production Game UI remain unbuilt. No live sources or connections are claimed.

Round 1 stopped for the missing design guide and screenshot folder. Both owner-provided inputs now pass. The guide SHA-256 is exactly 0BC09CC5E29547A9099F15BA9D8B8C48CEA75899ADB4BA6ED6B3613A5A179ED1. The folder has exactly the requested 11 filenames. All copied PNGs match their originals. No foreign changes were found; the extra NOTES.md and results.json were our own round-1 evidence files.

Saved the approved root prototype with curl: HTTP 200, 214,608 bytes. The HTML labels itself Game view v6; the owner identifies the root as v6.1. No explicit v6.1 marker is present, and the source was not relabeled or altered. No /v52.html request was made.

Reference assets and per-file SHA-256 values: ../../product/design-reference/blueprint-v6/README.md and manifest.json.

## G-2 colors and fonts

Follow the guide's final “Blueprint layer (Joe, 2026-09-29)” section rather than its superseded bright blueprint palette. The prototype is visual reference only; sample data and controls do not ship.

- Light header, panels, forms, sheets, overlays, tour and How this works: existing --bv-bg (#f5f3ee), --bv-card (#ffffff), --bv-ink (#15212b), --bv-ink-2 (#4b5967), corrected --bv-ink-3 (#5d6873), --bv-navy (#10304d), --bv-sand (#eab97f), --bv-line-strong (#8a8375), and --bv-blue focus ring. Light status families: --bv-ok, --bv-warn, and neutral gray, always with text labels.
- Dark canvas only: existing --bv-bp (#0f2c4d), --bv-bp-deep (#0b2240), --bv-bp-lift (#133a63), --bv-bp-ink (#e8f6ff), and --bv-bp-line (#bfe6ff). G-2 will expose the later approved status tints through scoped bv-blueprint-* / bv-game-* tokens: Done #86d7a9; Needs you / Waiting #f2c27d; accent #eab97f; Not connected #b4c0cc. Existing --bv-bp-done/need/off use older colors; do not silently reuse those values or edit shared tokens in this reference round. Check contrast on every actual surface before UI acceptance.
- --bv-sans: local Barlow for UI/body; --bv-cond: local Barlow Condensed for headings. --bv-mono: IBM Plex Mono only for canvas labels/numbers/title block, never header, buttons, forms, panels or tour.
- Existing 720px breakpoint, 44px minimum targets, 16px inputs, visible keyboard focus, opaque text throughout. Use --bv-t (120ms); UX-RULES' below-150ms limit overrides older 200/220ms guide examples. Reduced motion is static.

## Verification and boundaries

Only reference checks ran: input hash/inventory, branch/BASE/change allowlist, HTTP result, PNG identity, recorded asset hashes, unchanged guide and protected diff. No regression/browser suite, platform suite or Suite-102 ran. Prior npm ci succeeded in round 1; no reinstall or dependency edits were needed.

Known pre-existing BASE exceptions remain recorded, not rerun or fixed: platform.mjs and platform-mobile.mjs — “Complete the review packet before approval.” No check failures occurred this round.

0 provider calls; 0 credits. No main-checkout or Dropbox writes. No app code, public templates, protected files, ledgers, database, deployment, push or merge changes.

Next sub-ticket per Joe's round 1b instruction: G-2 Desktop Game view. Not started. The original G-1 engine remains unbuilt under the reference-only override above; do not imply otherwise when integrating later work.
