# #028F Round 8f

## Narrow fixes

- `tests/planning-ambient-browser.mjs`: the two non-sample ambient fixtures use `8054410199` rather than a forbidden 555 placeholder. The published-copy detector is unchanged.
- `src/website-pages.js`: the legacy FAQ's existing CTA is marked `data-primary`; its house still has meaningful alternative text; its footer art is constrained to the available width. Its header scrolls normally instead of covering CTAs.
- `src/about-page.js`: the legacy About's existing CTA is marked `data-primary`, its footer art is constrained, and its existing hidden fact labels use the standard `sr-only` class. Its header scrolls normally instead of covering the portrait and CTAs.
- `src/site-polish.js`: an opt-in decorative-logo flag lets the legacy FAQ/About mark the logo redundant to the adjacent business name. The default markup for other pages is unchanged.
- `tests/website-pages.mjs`: capture the workspace-record IDs immediately after publication, then apply the unchanged contact-flow kind assertion to new records. Staff QA decisions are publication records, not contact outbox entries. Marketing opt-in assertions still cover all records; approval assertions still cover all staff approvals. The confirmed-trust fixture's published-work example uses fictional project descriptions without the `Test-only` demo marker, which intentionally makes project media private. Its site remains named `Sample Fictional …`; a new assertion requires the published tile's image to return 200. Public media authorization and the demo filter are unchanged.
- `tests/hero-editor-browser.mjs`: wait for the UI publish request to complete successfully, including real QA, before reloading and asserting the saved public headline. The existing UI handler already awaits the publish API before its success message; no product publish bypass or copy change was required.

## Preservation

Pre-edit files and regenerated targeted evidence were copied to `checks/round8f-before/`; that backup is excluded from the commit. No QA detector, threshold, sampling, allowlist, saved Sample packet, protected phone-link response, or existing CSS asset was edited. No decisions are made on the five Samples' 70 open Borderlines. No provider calls or credits.

## Results

The three targeted standalone commands passed: ambient 97 checks, website-pages 30/30 with no remaining assertions, and hero editor 47 checks. Blocking QA on the touched fixtures was zero.

The existing full 102-command harness was run once. It stopped at the first new failure outside the authorized commands: `node tests/roofing-cta-browser.mjs`. Its log reports published-copy placeholder findings for `Call (805) 555-0100` with `sample=false`, at `tests/helpers/review-approval-fixture.mjs:27:9` (actual 45 blocking findings, expected 0). The suite process tree was stopped without retrying or changing that test.

Final suite totals: 82 PASS / 0 PASS-WITH-WARNING / 1 FAILED / 19 incomplete. Ambient and hero passed again in the full run; website-pages was incomplete when the run stopped. The preservation and quality suffix was not run. No commit and no staging. The accepted Samples snapshot remains 3,425 Pass / 70 Borderline / 0 Fail, `qaGateClear=false`; all 70 Borderlines remain open.

See `round8f-results.json`, `round8f-suite102-results.json`, the three targeted `round8f-*.log` logs, `round8f-suite102.log`, and `roofing-cta-browser.log` for the exact evidence.
