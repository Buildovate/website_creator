# G-5 — Game copy cleanup

Verified on launch/028G-game, port 5183, from G-4 commit db0f8ef22d019adadcefc25108b7c1326d342ec4.

## What changed

Joe’s current instruction is copy-only. It supersedes the older G-5 writing-tool feature specification for this round. Quest headings now name the task, progress helpers explain how XP is earned, autofill explains Confirm versus Save versus Publish, and tour/error messages use plain language. Only text changed in four Game-owned presentation files. No new features, form behavior, styles, shared code, providers, or writing tool. Game remains the only view; G-6 has not started.

The complete before/after copy inventory is below and in tests/game-copy-fixture.mjs. game-copy.mjs proves each application file equals its G-4 version with exactly those string substitutions, and checks fresh/complete progress and existing actions.

AGENTS.md names CONVERSION_DESIGN_PRINCIPLES.md, which is absent here. The available CONVERSION-PLAYBOOK.md and UX-RULES.md were reviewed; current user instructions govern.

## Save button diagnosis and approved test correction

The button was not moved or renamed. Its original markup is in src/client/workspace/questionnaire.ts:32: #questionnaire-form .save-bar button[type=submit], accessible name Save questionnaire. src/client/workspace/mobile.ts:3,31-48 creates a separate responsive action dock and copies discovered actions on a scheduled refresh. That copy had zero matches at the stopped assertion. It is not the authoritative form submit.

Only tests/game-copy-browser.mjs changed during this resume: lines 78-83 now select form.getByRole(button, {name: Save questionnaire, exact: true}), require exactly one match, wait for visibility, and verify an enabled submit belonging to questionnaire-form. The runtime markup is saved in round7/save-button.json. No form submission behavior or shared file was changed.

The earlier run stopped with five completed checks. On Joe’s approval the browser check reran once and passed all nine. It checks the real original Save action, not the presence or timing of its optional dock copy. The original failed log and six screenshots were backed up under round7b/before before recapture; history remains in NOTES.md.

## Checks

| Check | Result |
| --- | --- |
| game-copy.mjs | 7/7; original successful run, application unchanged on resume |
| Isolated build | PASS; original successful run, application unchanged on resume |
| game-copy-browser.mjs | 9/9 on one approved rerun; 8 screenshots |
| game-progress.mjs | 40/40; one resume run |
| game-milestones.mjs | 16/16; one resume run |
| header-logo.mjs | 340 headers + 6 edge cases; one resume run |
| header-nav-fit.mjs | 16,422 checks; 1,632 states; 8 widths; one resume run |
| platform-look.mjs | PASS; 593 selectors; 7 font faces; one resume run |
| platform-mobile.mjs | Approved BASE exception: HTTP 409, Complete the review packet before approval.; one resume run, not claimed passing |
| Protected diff | Empty |
| Legacy/shared form files, components and tokens | Unchanged from BASE |
| Four existing shared additions | +1/-0 each from BASE; no new shared edits |

Browser coverage includes all nine desktop quest headings, phone board, full-opacity text contrast >=4.5:1, no page overflow, form tap sizes, Confirm/Undo, unchanged saved tenant data/XP, keyboard and reduced motion, honest unpublished preview, and no provider request or uncaught browser error.

Guard command form: GAME_EVIDENCE_ROUND=round7b; node --import file:///C:/Users/joe/wc-game/tests/game-guard-loader.mjs C:\Users\joe\wc-game\tests\<guard>.mjs. Isolated build remains under .data/028G; no protected dist files regenerated. Full Suite-102 not run.

## Screenshots

- [g5-desktop-tour.png](../screenshots/g5-desktop-tour.png)
- [g5-desktop-board.png](../screenshots/g5-desktop-board.png)
- [g5-desktop-form.png](../screenshots/g5-desktop-form.png)
- [g5-desktop-suggestions.png](../screenshots/g5-desktop-suggestions.png)
- [g5-phone-board.png](../screenshots/g5-phone-board.png)
- [g5-phone-form.png](../screenshots/g5-phone-form.png)
- [g5-phone-suggestions.png](../screenshots/g5-phone-suggestions.png)
- [g5-phone-preview-unpublished.png](../screenshots/g5-phone-preview-unpublished.png)

Desktop 1440x900; phone 390x844. Files remain in the existing screenshots folder.

## Exact copy inventory

| Game file | Before | After |
| --- | --- | --- |
| src/client/workspace/game/view.js | A few details. A clear starting point. | Confirm your business details. |
| src/client/workspace/game/view.js | Make each page feel like your business. | Review the pages homeowners will see. |
| src/client/workspace/game/view.js | Save the pages you need, then review the preview. | Save each required page, then approve your website preview. |
| src/client/workspace/game/view.js | Let real feedback speak for you. | Connect your customer reviews. |
| src/client/workspace/game/view.js | Match and confirm a source before showing its reviews. | Find your business profile and confirm it belongs to you before showing reviews. |
| src/client/workspace/game/view.js | Give the first conversation a head start. | Set up your estimate request. |
| src/client/workspace/game/view.js | Choose the details you need and enter your own prices. | Choose what homeowners need to tell you, enter your prices, and require consent. |
| src/client/workspace/game/view.js | An offer that works for your business. | Choose whether to offer a promotion. |
| src/client/workspace/game/view.js | More ways for customers to plan. | Choose your financing options. |
| src/client/workspace/game/view.js | Connect the lenders you use, or explicitly choose None. | Connect a lender you use, or choose None if you do not offer financing. |
| src/client/workspace/game/view.js | Be ready when someone gets in touch. | Choose where new inquiries reach you. |
| src/client/workspace/game/view.js | Verify where alerts go, or connect your CRM. | Verify your phone or email for lead alerts, or connect your customer management system (CRM). |
| src/client/workspace/game/view.js | Put your website within reach. | Get your website ready to publish. |
| src/client/workspace/game/view.js | Your paid plan, live domain and published site work together. | This quest needs an active paid plan, a working secure web address, and a published website. |
| src/client/workspace/game/view.js | Keep your next step intentional. | Choose your marketing channels. |
| src/client/workspace/game/view.js | Each quest earns XP when every step is complete. | XP measures setup progress. Complete every step in a quest to earn its points. |
| src/client/workspace/game/view.js | Confirmed in your saved records. | This step is complete based on your saved information. |
| src/client/workspace/game/view.js | Reuse details you already saved. Your prices and choices stay yours. | Review saved business details for empty form fields. Autofill keeps answers you have already typed. |
| src/client/workspace/game/view.js | FINISHING THIS UNLOCKS | WHEN THIS QUEST IS COMPLETE |
| src/client/workspace/game/view.js | Your next advantage | What this means for your business |
| src/client/workspace/game/view.js | Progress worth keeping | Your badges |
| src/client/workspace/game/view.js | Saved-detail forms are not available for your account. | Your account does not have access to Business details or the Business questionnaire. |
| src/client/workspace/game/autofill.js | Use what you’ve already told us | Reuse your saved business details |
| src/client/workspace/game/autofill.js | Review saved details for empty fields. Your typed answers, prices and choices stay yours. | Check suggested details before adding them to empty fields. Answers you have typed will stay unchanged. |
| src/client/workspace/game/autofill.js | Nothing changes until you confirm a detail. | Confirm adds a detail to this form. Save stores your changes; it does not publish them. |
| src/client/workspace/game/autofill.js | Review the form, then use its existing Save button. | Review the form, then choose Save to store your changes. |
| src/client/workspace/game/autofill.js | No confirmed saved value. This field stays empty. | No saved detail is available to reuse. Enter this answer in the form. |
| src/client/workspace/game/autofill.js | Other sources · Not connected | Online sources · Not connected |
| src/client/workspace/game/experience.js | Your site strength comes from saved work and confirmed connections. Nothing earns points just because you open a form. | Your site strength is your setup progress out of 100. Complete every step in a quest to earn its points; opening a form earns none. |
| src/client/workspace/game/experience.js | Badges mark confirmed milestones. Unfinished and disconnected steps stay honest about what still needs you. | Badges show completed milestones. A step marked Not connected or Not available yet earns no points. |
| src/client/workspace/game/experience.js | Your tour choice could not sync. Your saved work is unchanged. | We could not save your tour preference. Your website changes are unaffected. |
| src/client/workspace/game/experience.js | The published version. Unpublished edits are not shown. | This is your published website. Changes saved as drafts will appear after you publish. |
| src/client/workspace/game/experience.js | The published site could not load. Your board is unchanged. Close this preview and try again when your connection is ready. | Your published website could not load. Choose Back to board, check your connection, and try Preview site again. |
| src/client/workspace/game/index.js | Your next step, all in one place. | Opening your setup board |
| src/client/workspace/game/index.js | Saved progress loaded. Tour and milestone receipts could not sync. Refresh when your connection is ready. | Your progress is loaded, but we could not save your tour and milestone updates. Try Refresh progress when your connection is ready. |

## Protected proof (read-only)

```powershell
git -C C:\Users\joe\wc-game diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- . ':(exclude)src/blueprint/**' ':(exclude)src/client/workspace/game/**' ':(exclude)src/client/styles/platform/game.css' ':(exclude)public/game-art/**' ':(exclude)tests/game-*.mjs' ':(exclude)docs/modules/game.md' ':(exclude)docs/design-reference/platform-2026-09-27/PLATFORM-DESIGN-GUIDE.md' ':(exclude)docs/product/design-reference/blueprint-v6/**' ':(exclude)docs/build-evidence/028G/**' ':(exclude)src/api.js' ':(exclude)src/client/workspace/index.ts' ':(exclude)src/client/workspace/shell.ts' ':(exclude)src/client/styles/platform/index.css'
```
Output: empty.

Separate BASE diff for legacy-workspace.js, components.css and tokens.css: empty. Shared numstat: src/api.js, styles/platform/index.css, workspace/index.ts, workspace/shell.ts each 1 0.



## Remaining boundaries

Zero credits and provider calls. No push, deploy, merge or G-6. The platform-mobile fixture exception remains known, not fixed here. No new shared-file changes. Local commit uses one-shot Joe author flags only.
