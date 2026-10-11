# #028F Round 8l — source-lock proof and lookup limitation

## Exact diff proof

The locked copy is `git show cd31c4db0cbb51625ee36458f17e99a052bc4929:src/planning-ambient.js`. The current source differs only by the approved video attribute `poster="'+e(film.poster)+'" `. Removing exactly that insertion in memory reproduces the entire old source. No source/normalizer was edited.

Saved exact source diff: round8l-source-lock-diff.txt. Locked/current copies and raw/normalized SHA-256 values: round8l-source-lock-expected.js, round8l-source-lock-current.js and round8l-source-lock-proof.json.

Old SHA-256: 4a77e08f32bf95fa850928f5fc63d9184149d97731c5c5082e4053c6d67f971f.
Current SHA-256: 4eca1d6f91e1bcb2ac85864acfb715ead221cc58edfa2c30105eca59376ded4b.

## Existing lock mechanism

`tests/roofing-polish-part2.mjs:20` reads only the single `head` field in `docs/build-evidence/027A-part2/preserve-state.json`, then fetches every locked file with `git show <head>:<path>`. Line 21 compares current and locked source exactly after existing checkout line-ending normalization. The same lookup also protects the scroll controller and the backlog in later lines. There is no per-file snapshot/hash consumed by this test.

The current source Git blob is 3576e5365333d0480c6aacd1b608a55e37849b14; it does not appear in reachable repository history. There is therefore no existing recorded Git revision that can supply this new file without creating a new snapshot. No commit, Git replacement, synthetic snapshot or shared-reference update was attempted.

The narrow durable option is a one-file exact snapshot lookup for src/planning-ambient.js, pinned to the verified new SHA, while preserving the current equality assertion and every other historical lookup. This requires changing the lookup, beyond the present snapshot/hash-only instruction. Explicit authorization was requested; the lookup is not implemented. The proposed snapshot bytes are already reviewable in round8l-source-lock-current.js.

## Results and preservation

- Poster-only source diff proof: PASS.
- Lock entries changed: none.
- Part2/header regression: not run pending lookup authorization.
- Suite-102: not run; 0 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 102 incomplete.
- Source, assertion file, both normalizers, detector, historical lock manifest, prior full-checks.json and temporary harness inputs verified byte-identical to round8l-before copies.
- Prior round8k authorized response baseline updates remain intact.
- No commit/staging/push/deploy; zero credits/provider calls.
- All 70 Borderlines remain open (67 phone-header ellipsis, 3 transformation video). qaGateClear=false. Accepted prior Sample totals remain 3425 Pass / 70 Borderline / 0 Fail; not rerun this round.

Changed files are the new source-lock diagnosis helper and round8l evidence copies/diff/proof/log/results/notes; backups under checks/round8l-before/. No app code, test assertion or active lock was changed.

## Approved continuation — supersedes the pending state above

Joe explicitly approved the one-file snapshot lookup with the original assertion and all other Git lookups preserved. Reverified the poster-only source diff before copying the snapshot. New immutable snapshot: docs/build-evidence/028F/source-locks/planning-ambient.js. Its SHA-256 is 4eca1d6f91e1bcb2ac85864acfb715ead221cc58edfa2c30105eca59376ded4b and its bytes exactly equal the current src/planning-ambient.js.

Only the git lookup in tests/roofing-polish-part2.mjs changed: this one path reads the snapshot and requires the pinned exact SHA-256, then returns its bytes to the unchanged equality assertion. Every other path retains the original git-show lookup. The shared preserve-state.head remains unchanged. Node syntax PASS; reversing just the lookup edit reproduces the original test (existing checkout line endings normalized). Diff: round8l-test-lookup-diff.txt.

Ran Part2 once. It failed before reaching the source-lock checks:

```
AssertionError [ERR_ASSERTION]: /design-preview/roofing/immersive byte-identical after precise authorized normalization
    at .../tests/roofing-polish-part2.mjs:11:334
actual: false; expected: true
```

Log: round8l-roofing-polish-part2.log. No response baseline was changed, no assertion/normalization was weakened, and no retry/workaround attempted. The source-lock assertion is not claimed as executed or passed in this run.

Stopped at this standalone failure. Header-logo and full Suite-102 were not run: 0 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 102 incomplete for the not-started full suite. Standalone Part2 itself FAILED. The existing source, normalizers, detector, historical shared reference, prior full-checks.json and temporary inputs remain unchanged byte-identically.

Current changed files for this approved continuation: tests/roofing-polish-part2.mjs (lookup only), the single new source snapshot, and round8l evidence helper/proof/diff/results/notes/logs. No commit/staging/push/deploy. Zero credits/provider calls. All 70 Borderlines remain open and qaGateClear=false; accepted prior Sample snapshot 3425 Pass / 70 Borderline / 0 Fail, not rerun.
