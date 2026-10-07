# #028F Round 8j — poster check and baseline scan (STOPPED)

## Poster file check

`/assets/planning/027A-part1/financing-poster-1280.webp` exists (30,114 bytes) and serves **HTTP 200**, `image/webp`, with 30,114 served bytes at the local preview origin. SHA-256: a201cc4d558635392f817b74c01d1aee9882fbc8e93e4da2b8889bb34a2eaa97. See round8j-poster-check.json.

## Baseline scan

Used the same worker, authenticated fixtures, saved response records and existing normalizers as roofing-polish-part2. Read all 323 ambient-baseline routes before applying any baseline writes: **321 identical, 1 exact authorized financing-poster addition, 1 other difference**.

- Eligible: roofing-16.html, `/s/ambient-baseline-roofing/financing?preview=1`. Its sole normalized diff is the authorized 64-byte insertion `poster="/assets/planning/027A-part1/financing-poster-1280.webp" `. Full diff: round8j-baseline-diffs/roofing-16.html.diff.txt.
- Stop: roofing-17.html, `/s/ambient-baseline-roofing/promotions?preview=1`. It adds two different poster attributes:

```diff
+poster="/assets/planning/roofing-promotions-ambient-1280.webp"
+poster="/assets/planning/roofing-promotions-scroll-1280.webp"
```

Removing exactly those two inserted attributes from the actual normalized response reproduces the expected response byte-for-byte. There is no other promotions content, ID, ordering or header difference. They are nevertheless different paths/attributes from the exact financing poster authorized for this round. Per step 3, stopped without changing this baseline, without changing any normalizer/assertion or product source, and without widening the authorization.

No baseline was updated: writes were held until the complete read-only scan cleared. Historical baseline files and their manifest remain untouched. No wholesale regeneration.

## Executed results

- Poster exists/HTTP check: PASS.
- Baseline scan: STOP on the promotions diff; detailed results in round8j-baseline-scan.json, exact diffs and normalized sides in round8j-baseline-diffs/.
- roofing-polish-part2 standalone: not run after step 3 stop.
- header-logo.mjs: not run after step 3 stop.
- Suite-102: **not run; 0 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 102 incomplete**. round8j-suite102.log explicitly records not-run status. The prior round8h full-checks.json remains unchanged.

## Preservation

planning-ambient.js, header source, detector, original Part2 test, both normalizers, harness inputs and baseline manifest verified unchanged against round8j-before backups. No temporary harness override needed. All prior dirty work retained; no commit/staging/push/deploy; zero credits/provider calls.

All 70 Borderlines remain open (67 phone-header ellipsis, 3 transformation video), qaGateClear=false. Accepted Sample totals remain 3425 Pass / 70 Borderline / 0 Fail, not rerun this round.

Changed files are evidence only: tools/round8j-baseline-scan.mjs, checks/round8j-* scan, poster check, exact diff/normalized side files, results, logs and notes; backups under checks/round8j-before/. See round8j-results.json for the complete generated file list and preservation hashes.
