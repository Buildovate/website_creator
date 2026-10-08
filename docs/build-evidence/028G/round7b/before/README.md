# G-5 — Game copy cleanup (stopped, uncommitted)

HEAD: db0f8ef22d019adadcefc25108b7c1326d342ec4. Branch launch/028G-game; port 5183.

## Scope

Joe’s current instruction is copy-only: correct unclear board/form labels and helper text, with no new features. This supersedes the older G-5 Fix my writing tool specification for this round. No writing service, new controls, handlers, fields or persistence were added. Game remains the only view. G-6 not started.

The draft changes only text in four Game-owned presentation files: view.js, autofill.js, experience.js and index.js. Quest headings name the task; XP copy explains when points count; autofill distinguishes Confirm, Save and Publish; tour and error messages use plain language. Shared form copy, styles, tokens and legacy-workspace.js were not edited.

AGENTS.md references docs/product/CONVERSION_DESIGN_PRINCIPLES.md, which is absent in this worktree. Reviewed the available CONVERSION-PLAYBOOK.md copy guidance plus UX-RULES.md; current user scope and truthful-copy rules govern.

## First failure — no retry

G-5 browser check 6 failed at tests/game-copy-browser.mjs:80. The selector .platform-action-dock button filtered by Save questionnaire returned 0; the assertion expected 1. The cause has not been diagnosed. The first five browser checks passed. The phone form screenshot was saved immediately before this assertion; the sixth check is not marked passing.

Stopped immediately: no assertion/app fix, browser retry, remaining browser checks, G-1 reruns, guards, staging or commit. A shell-quoting issue while writing the new test was corrected before any verification began; it did not run any checks or alter assertions.

## Checks — one run

| Check | Result |
| --- | --- |
| game-copy.mjs | 7/7; exact copy-only source delta, nine quests, fresh/complete progress unchanged |
| Isolated build | PASS; .data/028G only |
| game-copy-browser.mjs | 5 passed; check 6 failed; later checks not run |
| Desktop nine-quest and phone board contrast/opacity | Passed within browser checks; unchanged styles |
| G-1 reruns and header/platform guards | Not run after first failure |
| Protected diff | Empty |
| legacy-workspace.js / components.css / tokens.css | Unchanged from BASE |
| Four existing shared additions | Each +1/-0 from BASE; no new shared edits |

Zero provider calls or credits. No push, deploy, merge or full Suite-102.

## Screenshots

- [g5-desktop-tour.png](../screenshots/g5-desktop-tour.png)
- [g5-desktop-board.png](../screenshots/g5-desktop-board.png)
- [g5-desktop-form.png](../screenshots/g5-desktop-form.png)
- [g5-desktop-suggestions.png](../screenshots/g5-desktop-suggestions.png)
- [g5-phone-board.png](../screenshots/g5-phone-board.png)
- [g5-phone-form.png](../screenshots/g5-phone-form.png)

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

Next: resolve the stopped phone Save-dock assertion only after Joe authorizes continuation. G-6 not started.
