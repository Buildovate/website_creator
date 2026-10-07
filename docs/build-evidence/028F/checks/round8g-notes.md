# #028F Round 8g

## Fixture-only edits

The same non-555 test number used by round 8f, `8054410199`, replaces the public fixture phone in:

- `tests/roofing-cta-browser.mjs`: both CTA fixtures created by `create()`.
- `tests/design-styles.mjs`: the published style-flow fixture.
- `tests/roofing-acceptance.mjs`: the published acceptance fixture.
- `tests/roofing-polish-part2-browser.mjs`: the shared settings for the two published Part 2 fixtures.
- `tests/core-site-pages.mjs`: the non-Roofing published test fixtures; the Robles source is unchanged.
- `tests/uniqueness-api.mjs`: newly inserted API fixtures and the two newly inserted race fixtures. The original baseline rows remain unchanged.

There is no shared fixture-phone helper in these paths. Existing literal phone settings were changed directly; no helper, product code, QA detector, rule, threshold, sampling, allowlist, or assertion was changed.

## Audit boundaries

All test files and nested fixtures were searched for hardcoded 555 phones and the detector's other placeholder markers. Explicit `Sample Fictional` fixtures retain their existing phones. Private CRM contacts, inbound lead payloads, phone-format assertions, intentional negative detector inputs, and draft-only fixtures do not publish those values as non-sample public site contact information and are unchanged. Protected saved Sample packets, source baseline rows, PHONE-LINK proofs, and renderer-only baseline comparisons are unchanged. Audit search hits and publishing context are recorded in `round8g-fixture-audit.json`.

## Preservation and validation

Pre-edit copies and hashes are in `round8g-before/`. Temporary harness inputs `public/planning-films.json` and `tests/roofing-polish-part1.mjs` must be restored byte-identically after the suite, including on failure. The existing suite runner and hang guard remain unchanged. A final PASS followed by an exit hang retains the existing PASS-WITH-WARNING behavior.

Results are recorded in `round8g-results.json`, the standalone log, and `round8g-suite102.log`. The suite stops on its first FAILED row; no failed full run is retried.

## Final results — stopped

- Standalone `roofing-cta-browser`: PASS, exit 0, 88 checks, 24 screenshots, zero browser errors and zero blocking fixture QA.
- Full Suite-102: 90 PASS / 0 PASS-WITH-WARNING / 1 FAILED / 11 incomplete. Roofing CTA browser passed again in the full run. Round 8f's ambient browser, website-pages, and hero-editor browser commands also passed again.
- First failure: `node tests/roofing-polish-part1.mjs`, publication of `/s/part1-logo-check`. The unchanged QA detector found 17 blocking checks: 14 clipped-text findings for the hidden logo-name span across its routes, and 3 missing-alt findings for the uploaded header logo at 390, 768 and 1440. Assertion: `17 !== 0`, at `tests/helpers/review-approval-fixture.mjs:27:9`, called from `tests/roofing-polish-part1.mjs:13:982`.
- The suite process tree was stopped immediately after its FAILED result. No retry, no further test run, and no fix outside the phone scope. The failure log is preserved as `round8g-roofing-polish-part1.log`; completed rows are preserved in `round8g-suite102-results.json`.
- Both temporary harness inputs were verified byte-identical to their pre-run backups. The QA detector, suite runner, and existing hang guard are unchanged. The git index remains empty. No commit.

No commit, staging, push, or deployment. Zero credits and provider calls. The accepted five-Sample snapshot remains 3,425 Pass / 70 Borderline / 0 Fail with `qaGateClear=false`. All 70 Borderlines remain open: 67 phone-header ellipsis and 3 transformation-video items. Joe's rejection is recorded as direction for their future fix ticket, not as a QA decision or reclassification.
