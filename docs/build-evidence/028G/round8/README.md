# G-6 — Real form Save and Publish wiring

Verified locally on launch/028G-game, port 5183, from G-5 commit fa4b0089ebcb6e47b0c1a43ee7c3e1dc1ca4364c.

## What was reused

Game already moves the original shared form nodes into its section frame. Business and Questionnaire submit through the existing tenant PUT API, with CSRF/session identity, authorization, optimistic versions and private draft persistence. The original Publish changes action confirms with the owner, POSTs the saved version to the existing publish endpoint, and retains the staff review gate and backup flow. No copied forms, new endpoints, alternative saves, publication bypass or storage path were needed.

The current request is narrowly save/publish wiring with no new features. No new Next workflow, Tabs, Billing, domain wizard, or other ticket was added. Existing Back navigation and all 26 section IDs remain intact.

## What changed

- The Publish your website step now opens Business details, where the original Publish changes button exists. Previously it opened Publish readiness, which has no Publish action. Game focuses the existing button; if the current role has no such action, it states that publication requires owner access.
- Game observes changes to the real tenant version in the existing workspace state. After a successful tenant Save or Publish updates that version, it reloads server-computed progress while keeping the form open. Typing or a failed request cannot award XP.
- Only Game's index.js and sections.js changed in application code. Styles, shared form handlers, API authorization, QA rules, role definitions, progress arithmetic and stored data contracts are unchanged.

## Checks — one run each

| Check | Result |
| --- | --- |
| game-forms.mjs | 4/4; real publish destination, existing domain/plan targets, all 26 section IDs, permitted target filtering and anchors |
| Isolated build | PASS; output in .data/028G, protected dist untouched |
| game-forms-browser.mjs | 8/8; seven screenshots |
| game-progress.mjs | 40/40 |
| game-milestones.mjs | 16/16 |
| header-logo.mjs | 340 rendered headers + 6 edge cases |
| header-nav-fit.mjs | 16,422 checks; 1,632 states; 8 widths |
| platform-look.mjs | PASS; 593 selectors, 7 font faces, 5 stylesheets |
| platform-mobile.mjs | Approved BASE exception: HTTP 409, “Complete the review packet before approval.” Browser checks not reached; not claimed passing |
| Protected diff | Empty |
| Shared files | Four existing +1/-0 additions against BASE; no new shared edits |

The browser used the real local auth bridge and APIs. It saved Business details and Questionnaire answers, observed real onboarding progress after confirmed facts were saved, checked private draft state, reopened phone edits, retained input after offline and stale-version errors, and verified a viewer receives 403 for both Save and Publish. No provider requests or uncaught browser errors. The test did not claim that a successful save itself publishes or completes a quest.

The Publish click reached the actual owner-gated server route and correctly received 409 because the fictional tenant had no completed staff review packet. Its published snapshot stayed null. **Successful publication was not exercised**, and no approval or QA result was fabricated. This is a tested blocked-publication path, not a successful launch claim.

All prior evidence is preserved. G-5's root results.json is backed up as g5-results-before-g6.json. G-6 guard output is isolated to round8. No full Suite-102.

## Existing dependencies that remain unavailable

The separate #057A domain-wizard.ts / mountDomainFlow implementation is absent from this worktree. Existing Domain settings remain the destination, with truthful Not connected hosting/SSL status; Game does not create the owner's files. Paid-plan/domain verification continues through the existing dependency adapters. This round does not establish a live domain or paid plan.

## Screenshots

Desktop 1440x900; phone 390x844. Files remain in ../screenshots/.

- [g6-desktop-business-saved.png](../screenshots/g6-desktop-business-saved.png)
- [g6-desktop-questionnaire-saved.png](../screenshots/g6-desktop-questionnaire-saved.png)
- [g6-desktop-publish-gated.png](../screenshots/g6-desktop-publish-gated.png)
- [g6-phone-business-saved.png](../screenshots/g6-phone-business-saved.png)
- [g6-phone-offline.png](../screenshots/g6-phone-offline.png)
- [g6-phone-conflict.png](../screenshots/g6-phone-conflict.png)
- [g6-phone-readonly.png](../screenshots/g6-phone-readonly.png)

## Protected proof

```powershell
git -C C:\Users\joe\wc-game diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)src/blueprint/**' ':(exclude)src/client/workspace/game/**' ':(exclude)src/client/styles/platform/game.css' ':(exclude)public/game-art/**' ':(exclude)tests/game-*.mjs' ':(exclude)docs/modules/game.md' ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**' ':(exclude)src/api.js' ':(exclude)src/client/workspace/index.ts' ':(exclude)src/client/workspace/shell.ts' ':(exclude)src/client/styles/platform/index.css'
```

Output: empty.

A separate BASE diff for legacy-workspace.js, questionnaire.ts, mobile.ts, components.css and tokens.css was also empty. Existing src/api.js, workspace/index.ts, workspace/shell.ts and styles/platform/index.css additions remain +1/-0 each.

Guards use `node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\<guard>.mjs` with GAME_EVIDENCE_ROUND=round8.

Zero provider calls and credits. No push, deployment, merge or another ticket. Local commit uses one-shot Joe author flags; no config changes.
