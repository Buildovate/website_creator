# #028F Round 8k — approved poster baselines, then Part2 source-lock stop

## Poster checks

All three paths exist and served HTTP 200 as image/webp:

- /assets/planning/027A-part1/financing-poster-1280.webp — 30,114 bytes.
- /assets/planning/roofing-promotions-ambient-1280.webp — 120,386 bytes.
- /assets/planning/roofing-promotions-scroll-1280.webp — 130,378 bytes.

Local and served lengths agree; paths, status, MIME type and local SHA-256 values are in round8k-poster-checks.json.

## Two targeted baseline updates

The project's saved response contract consists of raw named HTML under docs/build-evidence/027A-part2/before/ plus before-responses.json checksums. Updated that contract directly with the same worker, authenticated fixture and SHA-256 record path used by the response capture harness. The historical bulk capture script's immutable-before safeguard was not edited or bypassed; no wholesale capture/regeneration was used.

The targeted helper checks the entire normalized response against the unchanged normalization functions, requires every change to be an approved poster attribute on a video tag, and preserves every other raw byte. It validates both target updates before writing either, backs up both originals and the manifest, then changes only those HTML files and their two checksum values.

| Baseline | Diff | Bytes added |
| --- | --- | --- |
| roofing-16.html — /s/ambient-baseline-roofing/financing?preview=1 | Add poster=/assets/planning/027A-part1/financing-poster-1280.webp to the financing video | 64 |
| roofing-17.html — /s/ambient-baseline-roofing/promotions?preview=1 | Add poster=/assets/planning/roofing-promotions-ambient-1280.webp and poster=/assets/planning/roofing-promotions-scroll-1280.webp to their respective videos | 125 |

Exact raw diffs: round8k-baseline-diffs/roofing-16.html.diff.txt and roofing-17.html.diff.txt. Full old/new SHAs and changed video tags: round8k-baseline-updates.json. All other **372 baseline files remained byte-identical**. No test assertion or normalization rule was edited.

Re-scan PASS: **323/323 ambient-baseline pages identical**, zero differences. Evidence: round8k-baseline-rescan.json.

## Standalone stop

Ran unchanged `node tests/roofing-polish-part2.mjs` with the existing fixture and evidence-redirect imports. It passed all 374 response comparisons and reached the later historical source-preservation checks, then failed:

```
AssertionError [ERR_ASSERTION]: protected source exact (checkout line endings normalized) src/planning-ambient.js
    at .../tests/roofing-polish-part2.mjs:21:393
actual: false; expected: true
```

Log: round8k-roofing-polish-part2.log. The assertion compares source to historical head cd31c4db0cbb51625ee36458f17e99a052bc4929 from preserve-state.json. An in-memory comparison proves that removing only the already-approved `poster="'+e(film.poster)+'"` addition makes the current source match the historical source (checkout line endings normalized). No source file was edited to obtain that proof. See round8k-source-lock-proof.json.

The round forbids changing planning-ambient.js or test assertions, so there is no permitted repair for this stale source assertion in the present scope. Stopped without retrying or changing the test. header-logo.mjs was not run after this failure. Full Suite-102 was not started: **0 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 102 incomplete**. The standalone failure is separate from those not-run suite totals.

## Preservation

planning-ambient.js, shared header source, detector, Part2 test, both normalizers, existing suite runner/hang guard, temporary harness inputs and prior full-checks.json verified byte-identical to round8k-before backups. No temporary overrides required. All prior dirty work retained. No commit/staging/push/deploy; zero credits/provider calls.

All 70 saved-Sample Borderlines remain open: 67 phone-header ellipsis and 3 transformation video. qaGateClear=false. Accepted prior Sample totals remain 3425 Pass / 70 Borderline / 0 Fail; not rerun in round 8k.

Files changed: the two authorized HTML baselines and their checksum manifest; new tools/round8k-poster-baselines.mjs; round8k evidence JSON, raw diffs, logs and notes under checks/; pre-run backups under checks/round8k-before/. Complete generated file list and preservation hashes: round8k-results.json.
