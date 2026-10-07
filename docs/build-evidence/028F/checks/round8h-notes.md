# #028F Round 8h — uploaded header logo

## Product fix

`src/site-polish.js` previously emitted uploaded brand images with empty `alt`, and used a clipped one-pixel business-name span when `logoContainsName` was checked. These are renderer defects, not fixture-phone or detector defects.

The shared `websiteBrand()` renderer now gives every uploaded logo the escaped business name as its alt. A missing/blank name falls back to `Business logo`, never an asset filename. Uploaded brand images remain accessible, including the former decorative-logo callers.

When an uploaded logo is marked as containing the business name, its duplicate span has `hidden` and `display:none!important`. It has no rendered rectangle and is removed from the accessibility tree; the image alt supplies the link's accessible name. The existing setting still controls whether the duplicate name hides. Unmarked logos keep visible name text, and no-logo headers keep their existing markup. This invariant is in shared markup, so all header variants and Looks use the same approach without depending on a stylesheet override.

The shared renderer is used by legacy headers, showcase headers, conversion headers, core-page headers, service headers, and the legacy FAQ/About headers. The legacy cinematic template's initial brand fragment is replaced by the shared header before output. No public CSS, detector, rule, threshold, sampling, allowlist, historical baseline, or Part 1 assertion was changed.

## Tests and evidence

- Existing Part 1 regression command: `checks/round8h-roofing-polish-part1.log`.
- New `tests/header-logo.mjs`: all 17 kits, four Looks and five template variants, plus escaping/fallback/unmarked/no-logo/caller cases. Results: `checks/round8h-header-logo-regression.json`.
- Uploaded-logo browser evidence: `tools/round8h-headers.mjs`; eight states per stage (Current/Bold/Fresh/Classic at 1440x900 and 390x844). Each state includes a viewport screenshot and a header crop. Both stages use the same authorized draft-preview and upload/settings flow; the unchanged Part 1 test separately proves real publication.
- Before results and screenshots: `checks/round8h-headers/before/`.
- After results and screenshots: `checks/round8h-headers/after/`.
- The screenshot helper's first upload attempt used PNG, which the existing photo endpoint rejected with `Use a valid JPEG photo.` The fixture was encoded as JPEG for the successful before capture; no upload rule or product code was changed. The initial log is retained as `checks/round8h-headers-before-upload-attempt.log`.

## Preservation

Pre-edit copies and regenerated evidence were backed up under `checks/round8h-before/`. The standalone test uses only the existing repo-local FFmpeg binary-path override, then restores `tests/roofing-polish-part1.mjs` byte-identically. Full-suite temporary inputs `public/planning-films.json` and that test file are also restored on completion or failure. All original Part 1 assertions remain intact. The existing suite runner and hang guard remain unchanged.

No commit, staging, push or deploy. Zero credits/provider calls. All 70 saved-Sample Borderlines remain open (67 phone-header ellipsis, three transformation-video); no Accept, waiver or reclassification is recorded on them. `qaGateClear=false`. The accepted snapshot remains 3,425 Pass / 70 Borderline / 0 Fail.

## Results

See `round8h-results.json`, `round8h-suite102.log` and the standalone/header logs for executed results. The full suite will stop on its first FAILED result without retrying.

### Standalone results

- Build PASS: 810 referenced assets, 17 kits.
- Unchanged roofing-polish-part1 assertions PASS: 660 checks, 158 additional rendered variants; zero blocking QA findings; temporary binary path restored byte-identically.
- Header renderer regression PASS: 340 headers across 17 kits, four Looks, five templates; six edge cases.
- Before/after browser evidence PASS: eight states and 16 screenshots per stage; zero page errors. Before: empty logo alt, one clipped name rectangle. After: business-name alt, display:none and zero name rectangles. Desktop and phone header crops visually inspected.
- The new regression's initial fixture setup omitted required brand color/default settings. Corrected only its fixture setup; no assertions weakened. Initial log retained as round8h-header-logo-fixture-attempt.log.
- Detector, existing runner/guard, public stylesheet, generated critical CSS and temporary inputs verified byte-identical to their round8h backups before suite launch.

### Full Suite-102 — STOPPED

One full run completed 92 commands: **91 PASS / 0 PASS-WITH-WARNING / 1 FAILED / 10 incomplete**. `roofing-polish-part1` passed again (660 checks, 158 rendered variants, zero blocking findings).

Exact stop: `node C:/Users/joe/website_creator/tests/roofing-polish-part2.mjs`. Log: `checks/roofing-polish-part2.log`.

```
AssertionError [ERR_ASSERTION]: /s/ambient-baseline-roofing/financing?preview=1 byte-identical after precise authorized normalization
    at check (.../tests/roofing-polish-part2.mjs:3:136)
    at .../tests/roofing-polish-part2.mjs:11:334
actual: false; expected: true
```

The first-failure supervisor stopped its suite process tree. No retry, baseline edit or change to that assertion was attempted. No listed suite runner/active browser child remains. Temporary `planning-films.json` and Part 1 harness source were restored byte-identically. The detector, existing runner/guard, public stylesheet and generated critical CSS still match their pre-round hashes.

All 70 saved-Sample Borderlines remain open; the accepted snapshot remains **3,425 Pass / 70 Borderline / 0 Fail**, `qaGateClear=false`. These Sample totals were not rerun in round 8h and are not represented as a fresh result. No commit or staging, no push/deploy, zero credits/provider calls.

### Header screenshots (before / after)

| Look | Desktop 1440x900 | Phone 390x844 |
| --- | --- | --- |
| Current | [Before](round8h-headers/before/current-desktop.png) / [After](round8h-headers/after/current-desktop.png) | [Before](round8h-headers/before/current-phone.png) / [After](round8h-headers/after/current-phone.png) |
| Bold | [Before](round8h-headers/before/bold-desktop.png) / [After](round8h-headers/after/bold-desktop.png) | [Before](round8h-headers/before/bold-phone.png) / [After](round8h-headers/after/bold-phone.png) |
| Fresh | [Before](round8h-headers/before/fresh-desktop.png) / [After](round8h-headers/after/fresh-desktop.png) | [Before](round8h-headers/before/fresh-phone.png) / [After](round8h-headers/after/fresh-phone.png) |
| Classic | [Before](round8h-headers/before/classic-desktop.png) / [After](round8h-headers/after/classic-desktop.png) | [Before](round8h-headers/before/classic-phone.png) / [After](round8h-headers/after/classic-phone.png) |

Each screenshot also has a `-header.png` crop. Product/test files intentionally changed this round: `src/site-polish.js`, new `tests/header-logo.mjs`. Added evidence helper: `tools/round8h-headers.mjs`; run supervisor, logs/results and screenshots are inside this ticket's evidence directory. Prior unrelated and previous-round changes remain in place.
