# #028G round 2b — G-1 verification complete with known BASE exception

Worktree: C:\Users\joe\wc-game
Branch: launch/028G-game
BASE: b2446730d551656067f2aaa15a9c27497dceb8f7
G-0 reference parent: b5e91a45a069fc375a7681454808c1800a1ba5c0; G-1 local commit follows this verification.
Port: 5183 used by the isolated header-nav-fit browser suite; no persistent server was started.

## Relabel and scope

The previous reference-only commit b5e91a45 is **G-0 reference setup**, despite its historical commit subject saying G-1. The real G-1 is this round's progress engine, rules, 100-point arithmetic, milestones, preview helper, dependency adapters and real-record reader. G-2 Desktop Game view is next, NOT STARTED. No UI or shared-file edits.

## G-1 implementation

Pure step rules, all-or-nothing quest XP, three levels, four stamps, eight badges, detached finished-house Preview, owner-contract adapters, and tenant-scoped saved-record reads. No persisted completion flags or parallel forms/storage. Existing route-level identity/membership checks are reused by the future progressForRequest boundary, but no route is mounted.

Tests were written before implementation and then executed once after implementation, honoring the stop-on-first-failure instruction: game-progress 40/40, game-milestones 16/16. Both use fictional local fixtures; no provider/network calls.

## Round 2 historical stop — resolved in round 2b

The first required guard invocation failed BEFORE the loader or header-logo test executed:

`node --import C:\Users\joe\wc-game\tests\game-guard-loader.mjs C:\Users\joe\wc-game\tests\header-logo.mjs`

Node ERR_UNSUPPORTED_ESM_URL_SCHEME: on Windows an absolute --import path must be a valid file:// URL; it received protocol c:. This is our invocation error, NOT the known platform BASE exception. No retry or corrective edit after failure. header-nav-fit, platform-mobile, platform-look and the isolated runtime prerequisite build did not run. No commit or staging was performed.

Joe authorized continuation in round 2b with a command-only file-URL correction. The existing loader and isolated build now ran successfully; no tests or app code were edited.

Round 2b re-observed exactly the approved platform-mobile.mjs BASE exception: “Complete the review packet before approval.” (#057A-T2). No fix or retry. platform.mjs was not run. No Suite-102.

## Sources not yet available

- Reviews: saved profiles/IDs/confirmation exist; successful live display is not persisted. Quest: Not connected, 0 XP, reason shown.
- Estimator: no homeowner-field/consent record or contractor minimum-item price-book contract. Quest: Not available yet, 0 XP. No minimum is guessed from the separate Roofing CTA price book.
- Promotion explicit No offer right now: no persisted choice yet; empty offers remain Needs you, 0 XP. An actual saved offer can satisfy the quest.
- Financing connections: existing lender adapter is Not connected; saved links never qualify. Explicit saved None does qualify.
- Leads: verified SMS alert configuration exists and qualifies; verified email alerts and real CRM connector do not yet exist. Neither is inferred from contact details.
- Plan/domain owner modules are absent in BASE: Not connected, 0 launch XP even with a published snapshot. Adapters load owner contracts after merge; no owner file is created here.
- Marketing/social: connected channels, explicit None and real social published-post records absent. Quest: Not available yet, 0 XP; First post unearned. Website blog publication is not social-post evidence.
- New-review activity events absent: null count plus explanation. Real inquiries are counted only within the tenant.

G-0 reference bundle and platform guide remain unchanged. G-2 must use the guide's final Blueprint layer: light platform chrome, Barlow/Barlow Condensed, IBM Plex Mono only on canvas labels/title block; dark canvas #0f2c4d and approved tints Done #86d7a9, Needs you/Waiting #f2c27d, accent #eab97f, Not connected #b4c0cc. Existing older bright blueprint tints must not silently substitute. UI remains unbuilt.

0 credits; no provider calls, main-checkout/Dropbox writes, push, merge, deployment or protected-file changes.

## Round 2b final result

- header-logo: PASS, 340 headers + 6 edge cases.
- header-nav-fit: PASS, 16,422 checks / 1,632 states / 8 widths.
- platform-mobile: known BASE failure #057A-T2 during publish setup, expressly allowed to continue; not a passing mobile audit.
- platform-look: PASS, 315 selectors / 7 font faces.
- game-progress and game-milestones rerun once: 40/40 and 16/16 PASS.
- Protected diffs versus BASE: empty, including after explicit staging.
- No unexpected round 2b failures. No app/test edits in round 2b. No provider calls, credits, full suite, push, merge or deployment.

Exact commands, source-rule table and evidence locations are in NOTES.md. The missing production sources listed above remain honestly unavailable; positive fixtures do not imply those integrations exist. G-1 is ready for the authorized local commit. G-2 Desktop Game view remains next, NOT STARTED.
