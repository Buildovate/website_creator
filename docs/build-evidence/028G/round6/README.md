# G-4 — Autofill from saved contractor details

Verified locally on launch/028G-game, port 5183, from G-3 commit 7651c754b11cd0cfdfad837bc6097f47b9bf9e2b.

## What changed

Game's existing power-up opens the existing Questionnaire (or permitted Business form). Autofill offers only previously confirmed contractor settings, copied verbatim. It lists the source, lets the contractor confirm one or all available answers, or focus the original field to edit it. Nothing is applied before confirmation. Typed answers and intentional clears are kept. Undo restores the previous values and preserves later edits.

The original form, role checks, Save, optimistic version and draft/publish flow are reused. Autofill's GET endpoint cannot write anything. Confirming a suggestion changes only the local form; it does not confirm consent, publish, or award XP. The existing form confirmation remains required. Viewer access is read-only, and tenant access is enforced on the server.

No fields or sections were invented. No Tabs, Billing, G-5 work or external integrations were added. Google Places, Yelp, old-website lookup and AI writing honestly show **Not connected**. This round follows Joe's narrower instruction to use data the contractor already entered; there are zero generated sections, provider requests or credits.

## Source and destination rules

All sources require `platform.questionnaire.factsConfirmed === true`. Missing, invalid and unconfirmed values are unavailable.

| Existing destination | Saved source | Forms |
| --- | --- | --- |
| Business name, owner, phone, email, address, hours | Matching settings key | Business / Questionnaire, only when the control exists |
| Homepage headline and business introduction | hero / intro | Business / Questionnaire, only when the control exists |
| Reference experience headline | hero, verbatim | Questionnaire |
| Reference experience introduction | intro, verbatim | Questionnaire |
| Prices, warranty, license, experience, service area, financing, owner photos, consent | Never autofilled | Needs the contractor's decision |

Nonempty or previously edited destinations are kept. Missing controls are ignored; no new input is created.

## Verification — one run each

| Check | Result |
| --- | --- |
| game-autofill.mjs | 21/21 |
| Isolated build | PASS |
| game-autofill-browser.mjs | 12/12 |
| game-progress.mjs | 40/40 |
| game-milestones.mjs | 16/16 |
| header-logo.mjs | 340 headers + 6 edge cases |
| header-nav-fit.mjs | 16,422 checks; 1,632 states; 8 widths |
| platform-look.mjs | PASS; 593 selectors; 7 font faces; 5 stylesheets |
| platform-mobile.mjs | Approved BASE exception: HTTP 409, “Complete the review packet before approval.” Browser checks not reached; not claimed passing |
| Protected diff / legacy / components / tokens | Empty |
| Four existing shared files | Each +1/-0 against BASE; no new edits |

Browser coverage includes confirmation, typed-value preservation, exact Undo, edits after autofill, offline, error, loading, empty, read-only, keyboard, reduced motion, phone overflow/tap targets, full-opacity text contrast >=4.5:1, existing draft Save, unchanged published snapshot, unchanged XP until actual rules are met, no uncaught error and no provider request. Fixtures are local and labeled QA.

Logs and structured results are in this folder. Guards used:
```powershell
$env:GAME_EVIDENCE_ROUND='round6'
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\header-logo.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\header-nav-fit.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\platform-mobile.mjs
node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\platform-look.mjs
```

The loader isolates builds under .data/028G, guard output under round6, and requests on loopback. Earlier evidence is preserved; the previous root results.json is backed up here as g3-results-before-g4.json. Full Suite-102 was not run.

## Screenshots

Desktop 1440x900 and phone 390x844 viewport captures, saved in ../screenshots/:

- [g4-desktop-ready.png](../screenshots/g4-desktop-ready.png)
- [g4-desktop-review.png](../screenshots/g4-desktop-review.png)
- [g4-desktop-confirmed.png](../screenshots/g4-desktop-confirmed.png)
- [g4-desktop-undo.png](../screenshots/g4-desktop-undo.png)
- [g4-phone-offline.png](../screenshots/g4-phone-offline.png)
- [g4-phone-error.png](../screenshots/g4-phone-error.png)
- [g4-phone-loading.png](../screenshots/g4-phone-loading.png)
- [g4-phone-empty.png](../screenshots/g4-phone-empty.png)
- [g4-phone-reduced-motion.png](../screenshots/g4-phone-reduced-motion.png)
- [g4-phone-readonly.png](../screenshots/g4-phone-readonly.png)

## Protected-diff proof

```powershell
git -C C:\Users\joe\wc-game diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)src/blueprint/**' ':(exclude)src/client/workspace/game/**' ':(exclude)src/client/styles/platform/game.css' ':(exclude)public/game-art/**' ':(exclude)tests/game-*.mjs' ':(exclude)docs/modules/game.md' ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**' ':(exclude)src/api.js' ':(exclude)src/client/workspace/index.ts' ':(exclude)src/client/workspace/shell.ts' ':(exclude)src/client/styles/platform/index.css'
```

Output: empty.

Separate BASE diff for legacy-workspace.js, components.css and tokens.css: empty. Existing shared additions remain exactly one line each in src/api.js, workspace/index.ts, workspace/shell.ts and styles/platform/index.css.

## Boundaries and remaining work

External adapters are not connected and no credentials were read. G-5 has not started. Billing remains deferred. Zero credits; no push, deploy, merge or provider calls. The known BASE mobile fixture block is the only incomplete guard.
