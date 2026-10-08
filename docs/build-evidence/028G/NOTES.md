# #028G G-1 notes — round 2b verification complete

G-0 = b5e91a45, reference setup only. This round adds src/blueprint/{progress,deps,sources}.js, tests/game-{progress,milestones,fixtures,guard-loader,guard-build}.mjs and docs/modules/game.md, and updates this ticket's evidence only. Round 2b completed guard verification with the explicitly permitted platform-mobile BASE exception. G-2 is not started.

## Step rules and actual source mapping

| Quest / XP | Step rules | Existing source / boundary |
|---|---|---|
| Onboarding / 10 | Saved and confirmed name, valid phone, trade, area (one rule each) | tenants.settings; platform.questionnaire.factsConfirmed conservatively confirms all four. Pure contract rejects found-but-unconfirmed values. |
| Website pages / 15 | All required drafts; contractor approval with reference | tenants.settings.websitePages plus saved home headline/intro; sales.data.ownerApproved and approvalNote. Existing manual owner approval, not staff-only review_approval or payment proof. |
| Reviews / 15 | Google/Yelp matched profile; contractor confirmed; actually showing | settings.reviews supplies setup, but reviews.js does not store successful display. Reader returns Not connected and all steps remain incomplete. |
| Estimator / 20 | Chosen required fields (5), contractor-entered confirmed minimum price-book items (10), consent on (5) | No such saved contract/minimum in BASE. Not available yet. Pure fixture contracts cover all steps; no production records fabricated. |
| Promotions / 5 | Saved substantive offer OR explicit none | settings.platform.promotions.offers. Explicit-none field absent, so reader never treats an empty list as a decision. |
| Financing / 10 | Selected lender actually connected OR explicit None | settings.platform.financing.selection; current lender-adapter.ts is always not_connected. Application links/confirmed terms do not prove a connection. |
| Leads & CRM / 10 | Enabled alerts to verified phone/email OR actual CRM connection | workspace_records chat_config: enabled, smsEnabled, phone, phoneVerified; verified through engagement confirm-phone. Email/CRM alternatives absent, not invented. |
| Domain & publish / 10 | Active paid plan; domain live; published snapshot (three rules) | getPlan, getDomainStatus owner contracts via deps; tenants.status and published. Absent owners return not_connected; DNS ownership alone never qualifies. |
| Marketing/social / 5 | All selected channels connected OR explicit none | No stored connection/none-choice records in BASE; Not available yet. Footer URLs are not connections. |

All nine quest awards total 100. Partial quests award zero, including estimator 5/10/5 parts. Fresh tenant 0; complete fixture 100; all 512 completion subsets checked. Unknown sources give reasons rather than false completion.

Level 1 contains Onboarding/Website pages/Reviews (40); Level 2 Estimator/Promotions/Financing/Leads (45); Level 3 Launch/Marketing (15). First incomplete level is current, with cumulative next thresholds 40/85. SET UP requires all level 1; SELLING requires Estimator + Leads; LIVE requires Launch; GROWING requires LIVE + Marketing. First post requires a real published social record with provider ID/date and not Sample. No streaks, leaderboard or synthetic activity. Preview shows only a finished illustrative house and carries a detached copy of unchanged real progress.

## Round 2 history — superseded by round 2b below

| File | Result |
|---|---|
| tests/game-progress.mjs | PASS: 40 tests; includes per-step states, 512 subsets, dependency and real-source SQLite fixtures |
| tests/game-milestones.mjs | PASS: 16 tests |
| tests/header-logo.mjs | BLOCKED: CLI failed before loader/test execution; 0 header checks |
| tests/header-nav-fit.mjs | NOT RUN after first failure |
| tests/platform-mobile.mjs | NOT RUN after first failure |
| tests/platform-look.mjs | NOT RUN after first failure |
| tests/game-guard-build.mjs | NOT RUN after first failure |
| Suite-102 | NOT RUN, prohibited |

Logs: round2/game-progress.log, round2/game-milestones.log, round2/header-logo.log. The exact unexpected failure is ERR_UNSUPPORTED_ESM_URL_SCHEME, received c: from the --import Windows absolute path. No retry, fix or later guard execution. The known #057A-T2 review-packet exception was not encountered.

The prepared guard adapter intends in-memory substitution only for checkout paths, output paths and ports; no assertion or original file changes. Temporary builds would go to .data/028G and output to this ticket's round2 directory, but the loader failed before running. No test regenerated prior evidence or touched protected dist, so no restoration was needed.

## Round 2 historical protected proof

Executed from C:\Users\joe\wc-game after stopping:

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- src public tests dist docs/modules/design.md docs/build-evidence/028F BUILD-BACKLOG.md BUILD-STATUS.md
```

Output: empty (exit 0). New G-1 code/tests remain untracked, so the inventory was additionally checked; all are owned paths. No original tracked src/public/tests/dist file changed.

Broader proof, allowing only G-0 documentation and G-1 owned paths:

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)src/blueprint/**' ':(exclude)tests/game-*.mjs' ':(exclude)docs/modules/game.md' ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**'
```

Output: empty (exit 0). No staged changes and no new commit. No owner contract files, shared-file edits, dependency changes, credits, provider calls, main-checkout edits, push, merge or deployment.

## Round 2b — corrected invocation and final checks

Joe authorized correcting the command only. No test or app file was edited in round 2b. Exact corrected first command (working directory C:\Users\joe\wc-game):

```powershell
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\header-logo.mjs
```

Execution order was header-logo, existing isolated prerequisite build, header-nav-fit, platform-mobile, platform-look, then one additional game-progress and game-milestones run. Every invocation used the same file URL; fixture tests used node --test. The prerequisite build ran the existing tests/game-guard-build.mjs unchanged and wrote only .data/028G/dist. Protected dist/ remained untouched. The existing loader directs screenshots/JSON into round2; round2b contains the new execution logs. Original round2 failure logs are preserved.

| File | Round 2b result |
|---|---|
| header-logo.mjs | PASS: 340 rendered headers, 6 edge cases |
| game-guard-build.mjs | PASS: isolated server/auth/client prerequisites |
| header-nav-fit.mjs | PASS: 16,422 checks, 1,632 trade/Look/name states, 8 evidence widths |
| platform-mobile.mjs | KNOWN BASE EXCEPTION #057A-T2: 409 “Complete the review packet before approval.” during publish bootstrap, before browser capture. Not a pass; no fix or retry. Continued by explicit authorization. |
| platform-look.mjs | PASS: 315 selectors, 7 font faces, 4 stylesheet checks, 0 new dependencies |
| game-progress.mjs | PASS: 40/40; 512 arithmetic subsets included |
| game-milestones.mjs | PASS: 16/16 |

No unexpected failure occurred in round 2b. No other tests or Suite-102 ran. Browser test port: 5183. No provider calls or credits. Main checkout, Dropbox, other branches, QA thresholds/baselines and assertions were untouched.

## Final protected proof (includes staged G-1 additions)

The following covers all source, public assets, tests, protected dist, design module, 028F evidence and ledgers, excluding only this ticket's newly owned code/tests:

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- src public tests dist docs/modules/design.md docs/build-evidence/028F BUILD-BACKLOG.md BUILD-STATUS.md ':(exclude)src/blueprint/**' ':(exclude)tests/game-*.mjs'
```

Output: empty. Exit 0.

The broader command from the historical proof also passed with staged changes, allowing only G-0 docs and G-1 owned paths:

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)src/blueprint/**' ':(exclude)tests/game-*.mjs' ':(exclude)docs/modules/game.md' ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**'
```

Output: empty. Exit 0. Explicit staging includes only the 3 blueprint files, 5 game test/helper files, module documentation and ticket evidence. The local commit uses one-shot Joe <joe@buildovate.com> flags; no config changes, push, merge or deploy. G-2 Desktop Game view is next and not started.

## Round 3 — G-2a desktop draft; stopped on first failure

### Scope and reuse

Split declared in STATUS.md before coding. G-2a drafts the desktop header, three-level quest rail, progressing house SVG, numbered requirements, static stamps, eight badges, and disabled Coming next power-up. It reuses G-1 evaluateProgress/readProgressSources without changing them. The personal Tabs/Game preference uses existing workspace_records, real access(), and an optimistic record version. The Game view retains the existing Tabs DOM and forms. No business form wiring, tour, finished preview, seen-badge state, or celebration was built; these remain G-2b/G-6 as applicable. Dedicated phone interaction is G-3; only basic reflow is drafted.

### Draft inventory (not verified)

- src/blueprint/api.js — tenant/account-scoped view preference and real progress read.
- src/client/workspace/game/index.js — additive navigation and default selection, loading/error/offline states.
- src/client/workspace/game/view.js — desktop rendering, static progress art, keyboard quest selection and native detail dialog.
- src/client/styles/platform/game.css — scoped platform-token layout and narrow reflow.
- public/game-art/house.svg — new progressively shown vector layers.
- tests/game-desktop-api.mjs — new server-side fixture checks; currently cannot parse.
- tests/game-desktop.mjs — prepared actual-workspace and display-fixture browser checks; not run.
- tests/game-guard-loader.mjs — owned host adapter accepts GAME_EVIDENCE_ROUND so round 3 cannot overwrite round 2 outputs; original guard files/assertions unchanged.
- Four additive shared lines: route mount (src/api.js), game import (workspace/index.ts), context bridge for navigation (workspace/shell.ts), stylesheet import (platform/index.css).

The disabled power-up is the user's explicit G-2 requirement; this takes precedence over the general UX-RULES preference for live explanatory buttons. No other intended UX exception.

### First verification command and result

Working directory C:\Users\joe\wc-game:

```powershell
$env:GAME_EVIDENCE_ROUND='round3'
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\game-desktop-api.mjs
```

FAILED before execution: tests/game-desktop-api.mjs:15, SyntaxError: Unexpected token ';' (unmatched brace in the test's database adapter). Exit 1. No retry or correction. This is my implementation mistake in the new test, not a pre-existing failure.

| File/check | This round |
|---|---|
| game-desktop-api.mjs | Parse failure; 0 assertions executed |
| game-desktop.mjs | Not run |
| isolated prerequisite build | Not run |
| header-logo.mjs | Not run |
| header-nav-fit.mjs | Not run |
| platform-mobile.mjs | Not run; known BASE exception not encountered |
| platform-look.mjs | Not run |
| game-progress.mjs | Not rerun; previous round's 40 passes are not this round's verification |
| game-milestones.mjs | Not rerun; previous round's 16 passes are not this round's verification |
| Suite-102 | Not run, prohibited |
| Screenshots | None captured |

Log: round3/game-desktop-api.log. No old test evidence was regenerated. The previous results.json is preserved verbatim as round3/previous-results.json before recording this round. The draft's intended tests cover real Tabs preservation, fixture states, keyboard, rendered-background pixels/AA contrast, opacity, reduced motion and static geometry, but no claim is made that they pass.

### Protected proof after stopping

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)src/blueprint/**' ':(exclude)src/client/workspace/game/**' ':(exclude)src/client/styles/platform/game.css' ':(exclude)public/game-art/**' ':(exclude)tests/game-*.mjs' ':(exclude)docs/modules/game.md' ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**' ':(exclude)src/api.js' ':(exclude)src/client/workspace/index.ts' ':(exclude)src/client/workspace/shell.ts' ':(exclude)src/client/styles/platform/index.css'
```

Output:

```text
```

Empty; exit 0. This is broader than the protected list. The four allowed shared files were checked separately with:

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- src/api.js src/client/workspace/index.ts src/client/workspace/shell.ts src/client/styles/platform/index.css
```

Exactly one additive line in each; no deletions or other changes. Untracked inventory is confined to the owned Game directories/tests/evidence. The initial sandboxed read falsely reported source directories missing; a direct read confirmed the directories and protected files intact. No restoration or deletion was attempted.

HEAD stays 4dde8d78be560b6410f6abd8c3dc6ca9da3be880 (G-1). Nothing staged or committed in round 3. G-2a needs a resumed correction/verification pass; G-2b is next after that and has not started.

## Round 3b — authorized syntax correction and verification

Corrections (no assertion weakened or removed):
- tests/game-desktop-api.mjs:15 — database adapter ending `changes)}}}}}};` → `changes)}}}}}}};`. Added the missing closing brace for the outer environment object. This corrects the parse error from round 3.

Commands use `node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs` from C:\Users\joe\wc-game with `GAME_EVIDENCE_ROUND=round3b`. The previous round3 failure log is preserved. New guard output is isolated to round3b.
- Evidence addition requested for round 3b: tests/game-desktop.mjs:31–32 now captures `g2a-desktop-tabs-view.png` after reaching the real Tabs form and `g2a-desktop-game-after-toggle.png` after returning to Game. Existing assertions are unchanged. The earned-stamp capture remains static in approved G-2a; animated landing remains G-2b.

### Round 3b outcome — stopped on browser selector ambiguity

The authorized brace correction succeeded. `game-desktop-api.mjs` passed 16/16 sequential checks. The isolated prerequisite build passed and wrote only `.data/028G/dist`. Then `game-desktop.mjs` passed its first check (real contractor workspace default Game view, real tenant name, zero XP, nine quests) and captured the fresh state.

The second browser check failed at tests/game-desktop.mjs:31: `[data-section=business]` matches both the Business navigation button and the launchpad Review button. Playwright refused the ambiguous click (strict mode violation). This is a test locator error, not a syntax/import/typo correction within the narrow approval. No assertion was weakened or removed, no selector was changed, and no retry or later verification was run. The failure needs a resumed round to select the intended Business navigation control unambiguously.

| Check | Round 3b result |
|---|---|
| game-desktop-api.mjs | PASS, 16/16 |
| game-guard-build.mjs | PASS, isolated prerequisites |
| game-desktop.mjs | 1 completed check; second check stopped on selector ambiguity |
| header-logo.mjs | Not run after stop |
| header-nav-fit.mjs | Not run after stop |
| platform-mobile.mjs | Not run; known BASE exception not encountered |
| platform-look.mjs | Not run after stop |
| game-progress.mjs | Not rerun |
| game-milestones.mjs | Not rerun |
| Rendered-pixel contrast/opacity, keyboard, reduced motion | Not reached |
| Suite-102 | Not run, prohibited |

Captured: `screenshots/g2a-desktop-fresh.png` (1440×900). Midway, static earned stamps, badge grid, not-connected, and toggle captures were not reached. Animated stamp landing remains deferred to G-2b under the approved split.

Logs: `round3b/game-desktop-api.log`, `round3b/prerequisite-build.log`, `round3b/game-desktop.log`. The existing new test scripts write their JSON to `round3/game-desktop-api.json` and `round3/game-desktop-failure.json`; neither existed before this run. Prior round3 failure logs and round2 guard evidence are unchanged. Prior root results.json is preserved as `round3b/previous-results.json`.

Final protected command (same exclusions as the preflight):

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)src/blueprint/**' ':(exclude)src/client/workspace/game/**' ':(exclude)src/client/styles/platform/game.css' ':(exclude)public/game-art/**' ':(exclude)tests/game-*.mjs' ':(exclude)docs/modules/game.md' ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**' ':(exclude)src/api.js' ':(exclude)src/client/workspace/index.ts' ':(exclude)src/client/workspace/shell.ts' ':(exclude)src/client/styles/platform/index.css'
```

Output:

```text
```

Empty, exit 0. The allowed shared-file check:

```powershell
git diff --numstat b2446730d551656067f2aaa15a9c27497dceb8f7 -- src/api.js src/client/workspace/index.ts src/client/workspace/shell.ts src/client/styles/platform/index.css
```

```text
1  0  src/api.js
1  0  src/client/styles/platform/index.css
1  0  src/client/workspace/index.ts
1  0  src/client/workspace/shell.ts
```

No new shared edits in this round. No commit: HEAD remains 4dde8d78be560b6410f6abd8c3dc6ca9da3be880. No staging, push, deploy, merge, vendor calls, or credits. G-2a remains incomplete. G-2b is next after G-2a passes and has not started.

## Round 3d — approved selector scope; stopped on hidden control

Classification remains (a): two intended routes to Business details. `src/client/workspace/legacy-workspace.js:33` renders the Business button in `nav[aria-label="Website settings"]`; line 70 renders Review in the Launchpad Business profile row. Neither renderer was changed. G-2a does not create these controls.

Authorized test-only edits:
- `tests/game-desktop.mjs:31`: `page.locator('[data-section=business]')` → `page.locator('nav[aria-label="Website settings"] [data-section="business"]')`. This was the only data-section selector in the test. No assertion was removed or weakened.
- `tests/game-desktop.mjs:46`: capture name `g2a-desktop-stamps-earned` → `g2a-desktop-done`, matching Joe's requested evidence name. This capture was not reached.

No application files, shared lines, visible copy, layout, or behavior were changed in round 3d.

### Ordered results

| Step | Result |
|---|---|
| 1. game-desktop-api.mjs | PASS 16/16 |
| 2. Isolated game-guard-build.mjs | PASS; only .data/028G/dist written |
| 3. game-desktop.mjs | First check passed; second check stopped after 30-second visibility timeout |
| 4. game-progress / game-milestones | Not run after stop |
| 5. header-logo / header-nav-fit / platform-mobile / platform-look | Not run after stop; known BASE exception not encountered |
| 6. Protected diff (read-only stop audit) | Empty; legacy-workspace.js unchanged; four shared files each +1/-0 |

The scoped locator resolved to exactly ONE Business button. Its click could not proceed because Playwright reported `element is not visible` after clicking the Game view's Tabs control. This is a visibility/state failure, not a syntax or typo error. No fix, force-click, selector substitution, suite retry, or later test was attempted. Playwright's normal actionability waiting occurred within that single click call; no second test invocation occurred. Why the control remained hidden has not been diagnosed in this round. Earlier source-only desktop visibility observations do not establish visibility in the failed runtime state.

All node runs used the file URL `--import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs`, with `GAME_EVIDENCE_ROUND=round3d`, from C:\Users\joe\wc-game. Browser bound to 127.0.0.1:5183. No provider calls or credits.

### Evidence and preservation

- `screenshots/g2a-desktop-fresh.png` — new 1440×900 capture, overwritten as explicitly requested.
- Midway, locked, done, and remaining states were not reached this round.
- `round3d/game-desktop-api.log` and `.json`, `round3d/prerequisite-build.log`, `round3d/game-desktop.log`, `round3d/game-desktop-failure.json` record this run.
- Prior round3 directory, fresh screenshot, and root results.json were backed up in `round3d/prior-evidence/` before execution.
- Both JSON files regenerated under round3 were copied to round3d, then restored from the backup. SHA-256 pairs matched: API JSON `87DF6B8142003F84C15EC8FE07E7A8D55EFEC443843D3CE845ADE099B5223467`; failure JSON `057BD6898AE6FDB8C8502DF85E6387BFF649E8E253AE103805B402EF5091807F`.

### Protected proof

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)src/blueprint/**' ':(exclude)src/client/workspace/game/**' ':(exclude)src/client/styles/platform/game.css' ':(exclude)public/game-art/**' ':(exclude)tests/game-*.mjs' ':(exclude)docs/modules/game.md' ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**' ':(exclude)src/api.js' ':(exclude)src/client/workspace/index.ts' ':(exclude)src/client/workspace/shell.ts' ':(exclude)src/client/styles/platform/index.css'
```

Output:

```text
```

Empty, exit 0. Includes QA gate, page action, video, automatic QA tests, detector rules, thresholds, baselines/checksums and legacy-workspace.js. Separate `git diff BASE -- src/client/workspace/legacy-workspace.js` was also empty. `git diff --numstat BASE -- src/api.js src/client/workspace/index.ts src/client/workspace/shell.ts src/client/styles/platform/index.css` returned 1 addition, 0 deletions for each.

No foreign edits observed. No staging or commit. HEAD remains 4dde8d78be560b6410f6abd8c3dc6ca9da3be880. No push, deploy, merge, Suite-102 or provider use. G-2a remains unfinished; G-2b not started.

## Round 3e — diagnosis and narrow test-only correction

Cause: **T (test fixture)**. The isolated browser fixture did not build/serve the existing production auth bridge. Production build.mjs:11 builds src/client/auth/bridge.ts as an IIFE with globalName BuildovateAuth; the G-1 isolated build only built the server auth module and regular client entries. The missing /auth-bridge.js meant workspace-api.ts:5 selected the hosting-identity transport instead of the session/CSRF transport. Clicking Tabs sent PUT /api/game/:tenant and received 403, “Refresh your session before saving. Your form has not been cleared.” This is fixture setup, not a legacy navigation rule or a defective Game CSS hide/show rule.

Read-only diagnostic at 1440×900: `round3e/diagnosis.json`, `before-tabs.png`, `after-tabs.png`, `diagnosis.log`. No app/test source changed during diagnosis. A disposable .data/028G/diagnose-tabs.mjs reused the local fixture setup and clicked Tabs once; it did not run/retry the browser suite.

| Element | Before | Immediately after click | After request settled |
|---|---|---|---|
| Website settings nav | Exists; display flex; visibility visible; opacity 1; box x0 y0 w0 h0; hidden/aria-hidden absent | Same | Same |
| Business button | Exists; display flex; visibility visible; opacity 1; box x0 y0 w0 h0; hidden/aria-hidden absent | Same | Same |
| Hiding ancestor `.app-layout` | display none; visibility visible; opacity 1; box 0,0,0,0; hidden/aria-hidden absent; inert true | Same | Same |
| Body | `bv-platform bv-game-open` | Same | Same |
| Game message | Progress comes from saved work | Saving your view… | Your view couldn’t save… |

Hiding rule: src/client/styles/platform/game.css:2, `body.bv-platform.bv-game-open .app-layout { display:none }` (combined with the action-dock selector). The children have no independent hidden/aria-hidden attributes; their zero boxes come from this ancestor. `show()` in src/client/workspace/game/index.js:9 sets host.hidden, toggles body.bv-game-open and sets app.inert. `choose()` at line 12 starts an asynchronous preference PUT, changes the status message, and calls show(false) only after success. Its catch handler explains a failed save and keeps the current view. No opacity transition or requestAnimationFrame controls this click. The separate navigation sync at lines 18–19 is scheduled by requestAnimationFrame when existing content changes.

Approved T correction (no app, shared or legacy edits):
- tests/game-desktop.mjs:14–15: add the production-equivalent auth bridge build into the private .data/028G/dist/client/auth-bridge.js before creating the fixture runtime. Uses the existing source unchanged; no CSRF bypass, credentials, or fake authentication global.
- tests/game-desktop.mjs:33: after clicking Tabs, explicitly wait for the real Website settings navigation to be visible before clicking the uniquely scoped Business button. No force-click or skipped assertion.

The earlier clash remains (a): Business in legacy-workspace.js:33 (Website settings tab strip) and Review in line 70 (Launchpad Business profile row) are intentional controls. Both remain untouched.

### Round 3e verification outcome — first real contrast assertion failed

| Ordered step | Result |
|---|---|
| 1. game-desktop-api.mjs | PASS 16/16 |
| 2. game-guard-build.mjs | PASS; isolated build |
| 3. game-desktop.mjs | 11 checks passed; check 12 failed: caption contrast 2.22:1 |
| 4. game-progress (40) / game-milestones (16) | Not run after failure |
| 5. header-logo / header-nav-fit / platform-mobile / platform-look | Not run after failure; BASE exception not encountered |
| 6. Read-only protected audit after stop | Empty; legacy unchanged; four shared files each +1/-0 |

The corrected fixture now passes the real Tabs navigation, unsaved form preservation, saved-data preservation, view-choice reload, not-connected, locked, keyboard/focus trap/return, server write rejection, midway, earned stamps/badges and prototype-content checks. The subsequent contrast/opacity check failed at tests/game-desktop.mjs:65 with `contrast 2.22 One clear step at a time.` This caption requires at least 4.5:1. No CSS fix, assertion weakening, or retry was made. Reduced motion, stable-layout, phone reflow, read-only, loading/error/offline and final browser-error checks were not reached.

All nine captured screenshots are 1440×900 under `docs/build-evidence/028G/screenshots/`:
- g2a-desktop-fresh.png
- g2a-desktop-tabs-view.png
- g2a-desktop-game-after-toggle.png
- g2a-desktop-not-connected.png
- g2a-desktop-locked.png
- g2a-desktop-quest-panel.png
- g2a-desktop-midway.png
- g2a-desktop-done.png
- g2a-desktop-badge-grid.png

Logs/results: round3e/game-desktop-api.log and .json, prerequisite-build.log, game-desktop.log and game-desktop-failure.json. Regenerated round3 API/failure JSON was copied to round3e then restored from round3e/prior-evidence/round3. The prior fresh screenshot and root results are also preserved in prior-evidence; the fresh screenshot is overwritten as authorized.

The same broad protected command printed in Round 3d was rerun after stopping (BASE b2446730d551656067f2aaa15a9c27497dceb8f7, excluding only owned paths, G-0 references and the four permitted shared files): output empty, exit 0. The separate legacy-workspace.js diff was empty. Shared numstat:

```text
1  0  src/api.js
1  0  src/client/styles/platform/index.css
1  0  src/client/workspace/index.ts
1  0  src/client/workspace/shell.ts
```

No application edits in this round. No foreign edits observed, no staging or commit. HEAD remains 4dde8d78be560b6410f6abd8c3dc6ca9da3be880. No provider calls, credits, full suite, push, deploy or merge. G-2b not started. G-2a now needs the caption contrast corrected under a subsequent authorization, followed by verification.

## Round 3f — read-only contrast scan; stopped at shared-color condition

No source or test change was made. The inherited round 3e fixture fix remains in tests/game-desktop.mjs:14–15 (build the existing production auth bridge) and :33 (wait for the real visible navigation). It was not rerun or altered this round.

### Caption diagnosis

Element: `.bv-game-house-caption p`, rendered in src/client/workspace/game/view.js:25, text “One clear step at a time.”

- Actual foreground pixels and computed color: RGB(75,89,103), #4b5967, `--bv-ink-2`.
- Winning foreground declaration: **shared** src/client/styles/platform/components.css:8, `body.bv-platform :is(p,li,dd,dt,label){color:var(--bv-ink-2)}`. Token definition is in shared platform/tokens.css:5. The built platform.css reproduces the declaration at lines 207–208.
- Actual background pixels and computed background: RGB(11,34,64), #0b2240, `--bv-bp-deep`. Game's own platform/game.css:48 sets this opaque paragraph background, and :43 sets the same house background.
- Font size: 14px from game.css:48. Font weight: 400 inherited from platform typography (components.css:2). Normal-text threshold 4.5:1.
- Caption and every ancestor through html: opacity 1 and filter none. These are the default values; no opacity/filter override or animation contributes to the failure.
- Paragraph background-image: none; all ancestors also have no background image. The SVG house is a separate sibling; the paragraph has an opaque backing. The sampled background is therefore the real solid backing, not a guessed image/gradient average.
- Measured foreground/background ratio: **2.220056:1**, consistently in all four states.

The parent house has `color:var(--bv-bp-ink)` (game.css:43), but the shared direct paragraph declaration overrides that inherited light color. Game's paragraph rule omits an explicit text color. The appropriate Game-local pair would be `--bv-bp-ink` on `--bv-bp-deep` (design guide lines 83–85), without changing shared CSS or tokens. It has NOT been applied, because Joe explicitly required: “If the failing color comes from a shared or legacy file, or from a design token used outside G-2a, STOP and report.” The observed foreground comes from that shared paragraph rule.

### All-text scan at 1440×900

A disposable inline diagnostic served the unchanged Game renderer and existing built platform.css on 127.0.0.1:5183, using only local fixtures and assets. It waited for fonts, took PNGs, sampled foreground and background pixels in each direct-text range, and applied 4.5:1 normal / 3:1 large thresholds. This was a read-only diagnosis, not a rerun of the blocked browser suite. Full-page diagnostic PNGs preserve text below the fold while retaining a 1440×900 viewport.

| State | Text elements scanned | Below threshold |
|---|---:|---|
| Fresh | 131 | Caption only, 2.220056:1 |
| Midway | 126 | Caption only, 2.220056:1 |
| Locked | 127 | Caption only, 2.220056:1 |
| Done | 127 | Caption only, 2.220056:1 |

No other scanned text was under its threshold. There is no “after” ratio because no fix was permitted after identifying the shared source. The diagnostic's CSSOM matching-rules list is empty; rule attribution above is established separately by reading the source and generated CSS, not claimed as CSSOM output.

Evidence: round3f/contrast-diagnosis.json; round3f/diagnosis-fresh.png, diagnosis-midway.png, diagnosis-locked.png, diagnosis-done.png. Existing requested viewport screenshots in screenshots/ were not overwritten by this diagnostic.

### Verification and stop

API, isolated build, browser suite, G-1 reruns and all guards: **not run this round**. Prior round 3e results remain historical, not current verification. No fixes, no assertion changes, no retries, no commit.

Read-only protected audit repeated the broad BASE diff command documented in Round 3d: output empty, exit 0. Separate diff of legacy-workspace.js, platform/components.css and platform/tokens.css was empty. Four approved shared files remain exactly +1/-0 each. No foreign edit observed. Only this ticket's evidence changed this round. Prior root results preserved as round3f/previous-results.json.

HEAD remains 4dde8d78be560b6410f6abd8c3dc6ca9da3be880 on launch/028G-game. No staging, push, deploy, merge, provider calls, credits or Suite-102. G-2b not started.

## Round 3g — approved caption token fixed; stopped at loading-state test

Only source edit this round: src/client/styles/platform/game.css:48, `.bv-game-house-caption p` now explicitly sets `color:var(--bv-bp-ink)`. Background remains `var(--bv-bp-deep)`. No other element, shared component, token or application behavior changed. The round 3e test auth-bridge fix remains unchanged.

### Rendered contrast

Caption before: #4b5967 on #0b2240, **2.220056:1**. Caption after: locked `--bv-bp-ink` (#e8f6ff) on the same #0b2240, **14.469555:1**, above 4.5:1. Opacity remains 1. Read-only analysis of the saved fresh screenshot found exact foreground RGB(232,246,255) pixels (including x358,y248) and exact background RGB(11,34,64) pixels (including x340,y239) within the caption. Details: round3g/caption-pixel-ratio.json. This analysis did not rerun the app or suite after the stop.

The browser contrast/opacity check passed: 117 text elements, no reported problems, with rendered backing pixels recorded in round3g/contrast-pixels.json. The prior four-state diagnosis remains in round3f; no contrast threshold or assertion changed.

### Ordered results

| Step | Result |
|---|---|
| 1. game-desktop-api.mjs | PASS 16/16 |
| 2. game-guard-build.mjs | PASS, private .data/028G/dist only |
| 3. game-desktop.mjs | 16 checks passed; check 17 stopped on a 30-second visibility timeout |
| 4. game-progress / game-milestones | Not rerun after stop |
| 5. header-logo / header-nav-fit / platform-mobile / platform-look | Not run; known BASE exception not encountered |
| 6. Protected audit (read-only after stop) | Empty; shared color sources and legacy unchanged; four approved shared files +1/-0 each |

Passing browser checks include actual Tabs navigation, saved/unsaved data preservation, saved view reload, not-connected reasons, locked requirements, keyboard selection and panel focus, rejected point writes, midway/complete states, prototype exclusion, contrast/opacity, reduced motion, static layout stability, 390px reflow, and read-only labeling.

Failure: tests/game-desktop.mjs:74, loading/error-state check. The unique `[data-game-entry]` Game view button stayed invisible, so its click timed out. The failure is separate from the fixed contrast. No force-click, test correction, behavior change, rerun or later suite was attempted. The underlying cause has not been diagnosed this round. Loading, error, offline and final browser-error checks were not completed.

### Captures saved this round

Under docs/build-evidence/028G/screenshots/ (1440×900 unless noted):
- g2a-desktop-fresh.png
- g2a-desktop-tabs-view.png
- g2a-desktop-game-after-toggle.png
- g2a-desktop-not-connected.png
- g2a-desktop-locked.png
- g2a-desktop-quest-panel.png
- g2a-desktop-midway.png
- g2a-desktop-done.png
- g2a-desktop-badge-grid.png
- g2a-desktop-reduced-motion.png
- g2a-phone-reflow.png (390×844)
- g2a-desktop-read-only.png

Prior round3 directory, screenshots and root results were backed up under round3g/prior-evidence before testing. New API/failure JSON, contrast pixels and layout results were copied into round3g. Existing round3 API/failure JSON were restored from the backup; the newly created contrast/layout JSON have no older version. Captures were overwritten as requested. Logs: round3g/game-desktop-api.log, prerequisite-build.log, game-desktop.log.

### Protected proof and commit state

The broad protected BASE diff command documented in Round 3d was rerun after the stop: empty output, exit 0. A separate BASE diff for legacy-workspace.js, platform/components.css and platform/tokens.css was empty. Shared numstat remains:

```text
1  0  src/api.js
1  0  src/client/styles/platform/index.css
1  0  src/client/workspace/index.ts
1  0  src/client/workspace/shell.ts
```

No foreign edit observed. No staging or commit. HEAD remains 4dde8d78be560b6410f6abd8c3dc6ca9da3be880 on launch/028G-game. No provider calls, credits, push, deploy, merge or Suite-102. G-2b not started. G-2a needs the new loading-state visibility failure addressed in a subsequent round.

## Round 3h — one Game workspace, all existing sections retained

Joe's Round 3h supersedes the original two-view requirement. Game is now the only site workspace; there is no Tabs/Game switch or personal view preference write. Existing obsolete preferences are left untouched and ignored. G-2b is not started. This round explicitly brings forward the existing-section entry points; it does not create new forms or integrations.

### Section inventory and entry points

The inventory is the existing sections array in src/client/workspace/legacy-workspace.js:33: 21 base entries, Follow-up for owner/admin, Team access/Domain settings/Backups for owner/admin, and Sales for platform admins outside support mode. Total 26 unique IDs. Game filters its links against the actual permitted legacy navigation, keeping those role gates and all server authorization. The browser owner fixture exposes 25 entries. No section is dropped.

Every Start/Open/View action opens an existing section inside Game with Back to board. Additional sections for the same quest are listed under Settings for this quest. The original #content and #status nodes move into the section frame; no duplicate form, API, save handler or storage path is created. Existing intra-form links continue to work. Back to board preserves the existing unsaved form; re-opening the same section retains input. Escape returns to the originating control, after any open native dialog closes. Switching to a different form retains the existing legacy navigation behavior.

| Game quest | Existing sections opened inside Game | Start action |
|---|---|---|
| Onboarding | Business details (business), Business questionnaire (questionnaire), Owner photo (ownerphoto), Team access (access) | Business details |
| Website pages | Website pages (pages), Hero editor (hero), Website editor (editor), Design and generation settings (templates), Services (services), Project stories (projects), Backups (backups) | Page drafts → pages; approval → website editor |
| Reviews | Review profiles (reviews) | Reviews |
| Virtual estimator | Pricing and estimate requests (pricing), Forms and submissions (forms) | Price book → pricing; homeowner fields/consent → forms; missing estimator evidence still earns 0 XP |
| Promotions | Existing Business questionnaire | Opens q-promotions |
| Financing | Existing Business questionnaire | Opens q-financing |
| Leads & CRM | Inquiry inbox (inquiries), Contacts (contacts), Calendar (calendar), Live chat and alerts (chat), Follow-up (followups) | Live chat and alerts |
| Domain & publish | Setup checklist (launchpad), Domain settings (domains), Publish readiness (readiness), Plan and features (plan), Sales and approval (sales) | Plan → plan; domain → domains; publication → readiness |
| Marketing & social | Blog (blog), Search visibility (visibility) | Search visibility |

Plan and features is the existing access/settings form, not a new billing implementation. Missing owner-branch plan/domain adapters remain honest in the progress engine.

Billing joins Game at the Pay merge.

### Loading, errors, typography and test setup

Initial loading and initial errors have visible recovery buttons. After a successful load, a failed/offline refresh keeps the last board available with an honest status; saved business data is not rewritten. The GET-only Game endpoint reuses tenant read access. It cannot accept progress or view-choice writes.

The round 3e production auth-bridge fixture correction remains in tests/game-desktop.mjs. The approved caption color remains --bv-bp-ink (#e8f6ff) against --bv-bp-deep (#0b2240): 14.469555:1, previously 2.220056:1. No shared token/component changed. Round 3h repeats the unchanged contrast thresholds for fresh/midway/locked/done, verifies all text opacity is 1, and samples actual PNG backing pixels. Details: round3h/contrast-pixels.json. No syntax/typo corrections were needed after verification started.

### Evidence preservation

Previous root notes/status/results and screenshots were backed up to round3h/prior-evidence before testing. Each suite writes new outputs directly to round3h, so earlier suite evidence is untouched. Canonical screenshots were recaptured as requested. Older Tabs/panel screenshots remain historical only; the current capture list is round3h/game-desktop.json.

### Legacy diff

No change to src/client/workspace/legacy-workspace.js; no switch removal in a shared file was needed. The existing one-line state bridge is in src/client/workspace/shell.ts, not legacy-workspace.js. The switch existed solely in Game-owned files and was removed there.

### Current screenshots

- screenshots/g2a-desktop-fresh.png (1440×900)
- screenshots/g2a-desktop-business.png (1440×900)
- screenshots/g2a-desktop-not-connected.png (1440×900)
- screenshots/g2a-desktop-locked.png (1440×900)
- screenshots/g2a-desktop-midway.png (1440×900)
- screenshots/g2a-desktop-done.png (1440×900)
- screenshots/g2a-desktop-badge-grid.png (1440×900)
- screenshots/g2a-desktop-reduced-motion.png (1440×900)
- screenshots/g2a-phone-reflow.png (390×844)
- screenshots/g2a-desktop-read-only.png (1440×900)
- screenshots/g2a-desktop-loading.png (1440×900)
- screenshots/g2a-desktop-error.png (1440×900)
- screenshots/g2a-desktop-offline.png (1440×900)

### Ordered verification — one run each, no test retries

| Step | Result |
|---|---|
| 1. game-desktop-api.mjs | PASS 16/16 |
| 2. game-guard-build.mjs | PASS; private .data/028G/dist only |
| 3. game-desktop.mjs | PASS 21/21; 13 screenshots, zero external requests or uncaught errors |
| 4. game-progress.mjs | PASS 40/40, unchanged |
| 4. game-milestones.mjs | PASS 16/16, unchanged |
| 5. header-logo.mjs | PASS 340 rendered headers + 6 edge cases |
| 5. header-nav-fit.mjs | PASS 16,422 checks; 1,632 states; 8 widths |
| 5. platform-mobile.mjs | Known BASE exception: HTTP 409 Complete the review packet before approval. at fixture setup line 17; browser assertions not reached, not claimed passing |
| 5. platform-look.mjs | PASS 467 scoped selectors, 7 font faces, 5 stylesheet checks, 0 new dependencies |
| 6. Protected audit | PASS empty; legacy/components/tokens unchanged; four shared files +1/-0 |

Contrast counts: fresh 137, midway 130, locked 131, done 120. No contrast or opacity failures. Static layout CLS 0; identical before/after geometry. No horizontal scroll at 390px. G-3 not started.

Commands use workdir C:\Users\joe\wc-game and GAME_EVIDENCE_ROUND=round3h. API: node C:\Users\joe\wc-game\tests\game-desktop-api.mjs. Remaining exact commands:

~~~powershell
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\game-guard-build.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\game-desktop.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs --test C:\Users\joe\wc-game\tests\game-progress.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs --test C:\Users\joe\wc-game\tests\game-milestones.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\header-logo.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\header-nav-fit.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\platform-mobile.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\platform-look.mjs
~~~

### Protected BASE proof

~~~powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)src/blueprint/**' ':(exclude)src/client/workspace/game/**' ':(exclude)src/client/styles/platform/game.css' ':(exclude)public/game-art/**' ':(exclude)tests/game-*.mjs' ':(exclude)docs/modules/game.md' ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**' ':(exclude)src/api.js' ':(exclude)src/client/workspace/index.ts' ':(exclude)src/client/workspace/shell.ts' ':(exclude)src/client/styles/platform/index.css'
~~~

Output (empty, exit 0):

~~~text
~~~

Separate git diff BASE -- src/client/workspace/legacy-workspace.js src/client/styles/platform/components.css src/client/styles/platform/tokens.css also returned empty output (exit 0). Shared numstat:

~~~text
1  0  src/api.js
1  0  src/client/styles/platform/index.css
1  0  src/client/workspace/index.ts
1  0  src/client/workspace/shell.ts
~~~

No extra shared switch-removal lines. All untracked paths are recognized Game code/evidence; no foreign edit observed. No provider calls, credits, push, deploy, merge or full Suite-102. G-2b next, not started.

Documentation-only command correction: an inline Node command used Markdown backtick fences inside a template string and failed to parse before any file write. Replaced the documentation construction with an array of strings and tilde fences. No app/test code changed and no verification check was rerun.
