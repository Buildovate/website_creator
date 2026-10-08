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

## Round 3 split decision — recorded before implementation
G-2 exceeds one working day when desktop layout, integration, preference persistence, tour, preview, celebration and all accessibility evidence are combined. This round is G-2a: desktop layout/states, real G-1 progress, saved Tabs/Game choice, default Game entry, keyboard-accessible placeholder quest panels, static stamps and badge grid. G-2b will add tour/How this works, finished preview, seen-badge tracking and skippable celebrations. G-3 remains dedicated phone navigation. No G-2 code existed when this decision was recorded.


## Round 3 — G-2a blocked at the first test (2026-10-08)

G-2 was split before coding into G-2a (desktop layout and real-data states, saved view preference, accessible placeholder quest panel, static stamps/badges) and G-2b (tour, How this works, finished preview, seen badges, stamp landing and celebration). Dedicated phone navigation remains G-3.

G-2a is an UNVERIFIED, UNCOMMITTED draft. The first command failed while parsing tests/game-desktop-api.mjs at line 15: SyntaxError: Unexpected token ';'. The fixture database adapter has an unmatched brace. This is a new test-file mistake, not the known BASE review-packet exception. Zero assertions ran. Per Joe's first-failure rule, no fix, retry, browser run, guard, build, or subsequent game test was performed. No screenshot was captured. No commit was made.

Next authorized action needed: resume G-2a to correct the fixture syntax and perform the first verification pass. G-2b remains the next split sub-ticket after G-2a passes; it is not started. Neither G-3 nor another ticket was started. No provider calls, no credits, no push/deploy/merge.

Protected-file proof after stopping: empty against BASE, excluding only owned files and the four explicitly allowed additive shared lines. The four shared diffs were inspected separately: exactly one added line each in src/api.js, src/client/workspace/index.ts, src/client/workspace/shell.ts and src/client/styles/platform/index.css. No other shared or protected changes.

## Round 3b — syntax corrected; stopped on browser locator failure

Authorized one-brace correction in tests/game-desktop-api.mjs:15 is complete and documented in NOTES.md. API checks passed 16/16, and the isolated prerequisite build passed. The browser suite passed its first check and captured screenshots/g2a-desktop-fresh.png (1440×900), then stopped at tests/game-desktop.mjs:31 because `[data-section=business]` matches two buttons (Business and Review). This is outside the narrow syntax/import/typo allowance, so it was not fixed or retried.

All guards, G-1 reruns, contrast/opacity, reduced motion, keyboard and remaining captures were not reached. Protected diff remains empty; the four approved shared files each have exactly one additive line and zero deletions. No new commit or staging. G-2a awaits a resumed locator correction/verification; G-2b remains next after completion and is not started. Zero provider calls and credits; no push/deploy/merge or Suite-102.

## Round 3d — scoped selector resolves once, but control stays hidden

Applied only the approved selector scope in tests/game-desktop.mjs:31 and renamed the requested done capture at line 46. API 16/16 and isolated build passed. Browser first check passed; second timed out after the unique Website settings → Business button remained invisible following Tabs. Stopped with no retry or behavior change. Remaining tests/guards were not run. Only screenshots/g2a-desktop-fresh.png was recaptured (1440×900); prior screenshot backed up. Prior regenerated round3 JSON restored with matching hashes. Full protected diff empty, legacy-workspace.js unchanged, four allowed shared files each +1/-0. No commit; HEAD still 4dde8d78be560b6410f6abd8c3dc6ca9da3be880. G-2b not started. See NOTES.md and round3d logs.

## Round 3e — test authentication fixed; stopped at contrast gate

Cause of hidden Business control: T, the isolated browser fixture omitted production auth-bridge.js. Preference PUT failed CSRF with 403, leaving the active Game view over the inert/hidden Tabs layout. Browser diagnosis (1440×900, before/immediate/settled computed styles, boxes, attributes and request response) is saved in round3e/diagnosis.json and before/after PNGs. Only tests/game-desktop.mjs was changed: build the unchanged production auth bridge (lines 14–15) and explicitly wait for visible Website settings (line 33). No application/shared/legacy changes.

API 16/16 and isolated build passed. Browser passed 11 checks, including actual Tabs navigation, preserved form/data, remembered preference and keyboard behavior. Check 12 failed: “One clear step at a time.” contrast is 2.22:1. Stopped with no fix/retry. All nine desktop captures are listed in NOTES.md, including fresh, midway, locked and done. G-1 reruns/guards and later browser checks not run. Protected audit empty; legacy unchanged; shared files each +1/-0. No commit; HEAD remains 4dde8d78be560b6410f6abd8c3dc6ca9da3be880. G-2b not started. Zero credits/provider calls; no push/deploy/merge.

## Round 3f — shared foreground source triggers explicit stop

Read-only pixel scan at 1440×900 completed for fresh (131 text elements), midway (126), locked (127) and done (127). Only “One clear step at a time.” fails in each: actual foreground #4b5967 on actual solid background #0b2240, 2.220056:1; 14px/400; all opacity 1, filters none. The foreground is set by shared platform/components.css:8 (`--bv-ink-2`), while Game's paragraph rule sets its dark background but no text override. Joe's explicit “if the failing color comes from a shared or legacy file … STOP” applies. No style/test fix or verification run was made. Diagnostic JSON and four PNGs are in round3f; existing viewport evidence is unchanged. Protected diff empty, legacy/shared color sources unchanged, four allowed shared files remain +1/-0. No commit; HEAD still 4dde8d78be560b6410f6abd8c3dc6ca9da3be880. G-2b not started. See NOTES.md for exact source lines and measurements.

## Round 3g — caption now 14.47:1; stopped on loading-state visibility

Approved Game-only paragraph color added at game.css:48: --bv-bp-ink on unchanged --bv-bp-deep. Actual saved PNG pixels verify 14.469555:1 (was 2.220056:1). API 16/16 and isolated build passed. Browser passed 16 checks including contrast/opacity, keyboard, reduced motion, stable layout and 390px reflow. Check 17 (loading/error fixture) timed out because the Game view button stayed hidden. Stopped with no retry or other fix. G-1 reruns and guards not run. Twelve screenshots recaptured; list and logs in NOTES.md/round3g. Protected diff empty, components/legacy/tokens unchanged, four allowed shared files +1/-0. No commit; HEAD still 4dde8d78be560b6410f6abd8c3dc6ca9da3be880. G-2b not started. Zero credits/provider calls; no push/deploy/merge.

## Round 3h — G-2a verified, Game is the only site workspace

Supersedes the previous two-view design. All 26 original section IDs are mapped to Game quests; actual legacy navigation preserves permissions (25 for the owner fixture, Sales restricted to permitted admins). Original forms, nodes, save handlers and server rules are reused. Start opens inside Game; Back/Escape returns to the board with unsaved same-form input preserved. Promotions/Financing open their questionnaire anchors. No duplicate storage or provider integration.

API 16/16; isolated build PASS; browser 21/21 with 13 captures; progress 40/40; milestones 16/16; header-logo 340 + 6; header-nav-fit 16,422; platform-look 467 selectors/7 font faces. Platform-mobile encountered only the approved BASE review-packet exception and is not claimed passing. Protected diff empty; legacy/components/tokens unchanged; shared files exactly +1/-0 each. Contrast passes all four states; caption remains 14.47:1. Notes/logs in NOTES.md and round3h.

G-2a verified for its approved local commit. G-2b tour/preview/celebration remains next, not started. Zero provider calls/credits; no push/deploy/merge/Suite-102. G-1 missing-source limitations remain unchanged.

## Round 4 — G-2b stopped, uncommitted

Tour, published-only preview and non-blocking level confirmation are drafted in Game-owned modules. Existing API 16/16, new API/state checks 18/18, isolated build PASS. A missing brace in the new test adapter was corrected under standing syntax approval without changing assertions.

Browser passed three checks (tour first run, Skip, persistence after reload), then stopped at tests/game-experience-browser.mjs:51: an unscoped dialog selector matches the existing shared dialog and Game's preview dialog. No selector fix/retry, no later browser checks, G-1 reruns or guards. Protected read-only audit is empty; legacy unchanged; four shared files still +1/-0. Two desktop screenshots saved, shown in the report. See NOTES.md and round4 logs.

No G-2b commit; HEAD stays 802daa1b5cb9feaff634630b9ec1a48770ee3e72. G-3 not started. Zero credits/provider calls; no push/deploy/merge.

## Round 4 selector resume — G-2b verified

The approved test-only scope uses dialog.bv-game-preview. A read-only real-workspace preflight confirmed exactly one match; the shared closed dialog remains unchanged. Browser rerun once: 12/12, 11 screenshots, 7 contrast states/37 text instances at 4.5:1 or above, reduced motion and keyboard checks pass, no external requests. The initial API 16/16, new API/state 18/18 and isolated build pass remain valid with unchanged application code. G-1 reruns 40/40 and 16/16; header-logo 340 + 6; header-nav-fit 16,422; platform-look 489 selectors/7 font faces. Platform-mobile encounters only the permitted BASE review-packet exception and is not claimed passing. Protected diff empty, legacy/components/tokens unchanged, no new shared edits.

G-2b tour, published-only preview and non-blocking level confirmation are verified for the approved local commit. G-3 next, not started. No push/deploy/provider calls; zero credits. See NOTES.md and round4/results.json.
