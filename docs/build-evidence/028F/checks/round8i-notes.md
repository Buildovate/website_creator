# #028F Round 8i — financing normalized diff (STOPPED)

## Exact finding

The existing test normalization was applied unchanged: expected = normalizePart2HTML(saved HTML, roofing); actual = normalizePart2HTML(beforePart1(current HTML), roofing). Both render/read paths are the same as roofing-polish-part2. Local SQLite fixtures only; no provider calls.

The entire normalized difference is a single **64-byte insertion** on the financing ambient video:

```diff
-<video data-planning-ambient
+<video poster="/assets/planning/027A-part1/financing-poster-1280.webp" data-planning-ambient
```

The exact unformatted normalized diff is [round8i-financing-diff.txt](round8i-financing-diff.txt); full normalized sides and SHA-256 values are retained in round8i-financing-diagnosis.json and the expected/actual text files.

Expected normalized SHA: 3e7facf27511b3677c08a3d9752931ec2c91e0365a922f2fbf08cd9277ddc37d.
Actual normalized SHA: 4e3e2ce989bd93f2de4be636d69a8b243af420c02866a1a9a52bb5cfbde2ccbc.

Source: src/planning-ambient.js:11 emits the video poster from film.poster. Its pre-existing working-tree delta adds this attribute. The #028F README already lists financing ambient-poster evidence; this round did not change that renderer. There is no logo-alt or hidden-name difference in this page's normalized comparison.

This is static markup, not evidence of timestamps, random IDs, ordering or nondeterministic rendering. Removing an existing poster to force baseline equality is not justified by a determinism defect. Under step 3, stopped and reported instead of changing unrelated product output or widening normalization.

## Results and preservation

- Diagnosis captured HTTP 200 and the exact diff.
- No baseline updated. No wholesale baseline generation or other-page update attempted after the non-header stop.
- Roofing-polish-part2 standalone and header-logo: not run, because step 3 stopped the round.
- Full Suite-102: **not run; 0 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 102 incomplete**. The prior round8h run remains 91 PASS / 1 FAILED / 10 incomplete; no new pass is claimed.
- Original test, both normalizers, shared header source, detector, temporary harness inputs and full-checks.json were verified byte-identical to round8i-before copies.
- No commit/staging/push/deploy. Zero credits/provider calls. All prior uncommitted changes retained.
- All 70 Borderlines remain open (67 phone-header ellipsis, 3 transformation video); qaGateClear=false. Accepted prior Sample totals remain 3425 Pass / 70 Borderline / 0 Fail, not rerun this round.

The new diagnosis helper's first startup used a Windows absolute path as an ESM specifier, which Node rejected before rendering. Only the helper's import URL handling was corrected to pathToFileURL; the initial setup log is preserved. No existing harness/test/assertion was edited.

Changed files are evidence only: new tools/round8i-financing-diagnosis.mjs; checks/round8i-* diff, normalized sides, JSON, logs and these notes; pre-run backups under checks/round8i-before/. See round8i-results.json for the file list and preservation hashes.
