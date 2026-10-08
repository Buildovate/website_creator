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
