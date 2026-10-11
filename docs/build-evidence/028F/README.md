# #028F — Round 6 approved source lock and exact raster registry (2026-10-02)

The historical [frame-initialization baseline](frame-initialization/before/baseline.json) remains byte-identical. Its `src/aws/qa-browser.js` SHA-256 is `1cc4fd6c8ccbbe812af901650dd15a695ed02019b92e2c46153880bb14287bf9`. The current file is `cc1029c2c26d6622c66ac3e10aad9bae435631c2b108b399f279a637d886ff24`. Reversing exactly the seven later registered recognition entries (`craft-final-count`, `craft-final-primary-list`, `craft-final-exact-declaration`, `redundant-service-footer-logo`, `thousand-oaks-exact-consent`, `redundant-uploaded-logo-check`, `redundant-uploaded-logo-exact-pages`) from the current source reproduces the historical hash. The [approved later source change](frame-initialization/approved-later-source-changes.json) is chained to a freshly run [recognition lock](checks/recognition-lock.json), which restores the round-4 hash and confirms unchanged generic detector, 2px threshold and 60ms sampling. All other source locks remain strict. [Negative cases](../../../tests/automatic-qa-frame-source-lock.mjs) pass.

The Copper Kite Services exact-SHA registry accepts only these two proven image variants. The saved and alternate values below are copied in full from the [registry summary](alternate-registry/summary.json); the earlier bounded-rerun account below is historical.

| Capture | Saved SHA-256 | Alternate SHA-256 |
|---|---|---|
| `page-013-768.png` | `01928202109a809e3eff7323ab590065d99022dffe8c7f7569bf602c84979d22` | `09117e05a89f9024d7b2a4869a0735a8d3852e186732811801b03e658545cc32` |
| `page-013-1440.png` | `b238097182794ac701711a66c4ea4634e6e0478b454b1eecdafa4e3a89608dad` | `2da42f6cf9987b7658b111ec693d912b12f2d5e8c71ea57247ce994be1a2a4b1` |

Final validation results for this round are recorded below when the required sequence completes.

---

# #028F — Stopped: bounded raster rerun did not converge (2026-10-01)

## Round 6 final attempt — no commit

The isolated single-raster-thread experiment matched the saved PNG bytes in **100/100 captures at each of 768, 390 and 1440**. It failed the required extra-paint stress path: **19/20** at 768 matched, while one reproduced the original alternate SHA `09117e05…45cc32`. The flag was discarded and was **never added to the production capture launcher**. [Experiment summary](single-raster-experiment/summary.json) · [per-capture records](single-raster-experiment/records.json) · [stress results](single-raster-experiment/stress-results.json) · [alternate PNG](single-raster-experiment/stress-alternate-768.png).

Fallback B was added **only to the replay harness**. It checks every differing pixel against the exact `img` rectangles using pixel centers, requires matching source, natural and rendered dimensions, decode state, DPR and viewport, preserves the pair and diff crop, and permits one screenshot rerun. The strict saved-byte comparison remains. [Negative tests](../../../tests/replay-raster-gate.mjs) pass: a text-glyph change and a non-image background change both fail with **zero reruns**. A rehearsal replay passed **143/143** with zero reruns.

In the final run, the five Samples capture completed at **3,425 Pass / 70 Borderline / 0 Fail**, with `qaGateClear=false`. Main replays **1 and 2 passed 143/143**. Main replay 3 stopped at `screenshots/page-013-1440.png` on Copper Kite Services. The first screenshot had **157,965 differing pixels, all within `img` rectangles**, and unchanged required readiness fields. The one authorized rerun produced the **same mismatching bytes**, so the gate stopped on a second consecutive mismatch. The third replay did not complete, and no later validation ran.

### Raster reruns

| Page | Width | Differing pixels / outside images | Saved SHA-256 | First / one rerun SHA-256 | Outcome | Evidence |
|---|---:|---:|---|---|---|---|
| Copper Kite Services | 1440 | 157,965 / 0 | `b238097182794ac701711a66c4ea4634e6e0478b454b1eecdafa4e3a89608dad` | `2da42f6cf9987b7658b111ec693d912b12f2d5e8c71ea57247ce994be1a2a4b1` / same | **Stopped** after one attempted rerun; 0 successful raster reruns | [pair, crops, readiness and rerun](replay-determinism/final-main-3/pairs/screenshots/page-013-1440/) |

| Final gate | Result |
|---|---|
| Single-raster A | Discarded: stress 19/20; one alternate |
| Replay-only B | Negative tests pass; final replay 3 fails on second consecutive mismatch |
| Five Samples | 3,425 Pass / 70 open Borderline / 0 Fail; `qaGateClear=false` |
| Three main replays | 143/143, 143/143, third incomplete/failed |
| Saved-version 604 PNG / 231 full-page / 165 frame proof | Prior proof remains recorded as pass; not rerun after this stop |
| 102-command suite, broad AA/console, remaining clearance and browser gates, protected 279 + platform.css and archived 374 checks | **Not run after the required stop; no pass claimed** |
| Unrelated working-tree preservation | 20,791 pre-existing dirty files compared to the pre-run backup; **0 changed, 0 new dirty files** |
| Credits / provider calls / commit / push | **0 / 0 / none / none** |

The earlier stopped diagnosis and results below are historical. No product, detector, threshold, sampling, console allowlist, baseline or dependency change was made in this attempt. The extra [Later backlog note](../../../BUILD-BACKLOG.md) is outside the protected Domain and #033I/#033V/#033T/#028G blocks. The stopped validation did not proceed to a commit.

---

## Earlier stopped diagnosis (historical)

## Round 6 bounded diagnosis — still stopped

Joe's requested [20-run image/raster diagnosis](round6-services-diagnosis/diagnosis.md) captured Copper Kite Services at 1440, 390 and 768 with the unchanged capture settings. All 20 PNGs at each width matched the saved packet byte for byte; full [per-image decode, size, CSS, DPR, rasterizer and frame-count records](round6-services-diagnosis/records.json) are retained. No new differing pair occurred in those 60 runs. The original [differing pair and diff crops](replay-determinism/final-main-2/pairs/screenshots/page-013-768/) remain saved.

| Cause | Evidence | Before variance | After variance |
|---|---|---:|---:|
| **Not proven.** The alternate pixels are confined to two downscaled card photos after successful decode; Chrome reports software rasterization, but a specific raster or paint cause is not established. | [60-run summary](round6-services-diagnosis/summary.json), [original pair](replay-determinism/final-main-2/pairs/screenshots/page-013-768/pixel-diff.json), [prior extra-paint experiment](checks/services-paint-readiness.json) | Actual main replay: 1 differing 768 page in replay 2; prior extra-paint probe: 1/20 alternate at 768 | **Not applicable — no fix made.** Isolated diagnostic: 0/20 at each width |

The earlier alternate appeared even after an initial screenshot and two more animation frames. A readiness-only remedy has not been proven, so no capture, detector, tolerance, product or baseline change was made. The failed replay was not retried as a pass. The 102-command suite and remaining final validation are still incomplete; no commit or staging was made for #028F.

**No commit or staging.** Joe's required stop applies: the second main replay changed Copper Kite's Services screenshot at 768px. The original images and readiness records were saved before the assertion. The third replay and remaining validation were stopped. No retry, capture-setting change, tolerance, normalization or allowlist change was made.

| Latest result | Outcome |
|---|---|
| Approved runtime-backed saved-version correction | PASS: 604/604 saved PNGs, 165/165 frames, 231/231 full-page PNGs; stored IDs/digests/manifests preserved; forced reviews 404 rejected before comparison |
| Five Samples recaptured | **3,425 Pass / 70 Borderline / 0 Fail**, all 70 decisions open; qaGateClear=false |
| Main replay 1 | **143/143 exact** |
| Main replay 2 | **140/143 exact**; one PNG and its QA report/summary differ |
| Main replay 3 | Not run after required stop |
| Latest 102-command attempt | **7 passed / 1 failed / 2 interrupted / 92 not started**; not a suite pass |
| Protected check before the final Craft follow-up | 279/279 + platform.css and 374/374 archived responses passed; 56 existing CSS files unchanged |
| Brand / Thousand Oaks / Craft recognition boundaries | 420 / 84 / 52 cases pass; removing registered entries restores the frozen detector SHA-256 |
| Final broad AA/console, remaining browser matrices and rebuilt protected checks | Incomplete; not claimed as passed |
| Credits / real provider calls | **0 / 0** |

## Preserved mismatch and diagnosis

Page: `/s/sample-fictional-copper-kite-ventura/services`; file: `screenshots/page-013-768.png`; version: `97700d3528e864ee8cca74e09403d80d852acc6430ffe0a8dd7b382e1cb4234f`.

Both PNGs are **768 × 3290**. Exactly **134,619 pixels** differ: 65,884 in the roof-installation card and 68,735 in the roof-repair card. **0 changed pixels outside those two image rectangles**; the hero image, text and layout are byte-identical in the raster. Maximum channel difference: 78.

- Before SHA-256: `01928202109a809e3eff7323ab590065d99022dffe8c7f7569bf602c84979d22`.
- After SHA-256: `09117e05a89f9024d7b2a4869a0735a8d3852e186732811801b03e658545cc32`.
- [Original before](replay-determinism/final-main-2/pairs/screenshots/page-013-768/before.png) · [original after](replay-determinism/final-main-2/pairs/screenshots/page-013-768/after.png) · [readiness pair](replay-determinism/final-main-2/pairs/screenshots/page-013-768/readiness.json) · [pixel measurements](replay-determinism/final-main-2/pairs/screenshots/page-013-768/pixel-diff.json) · [stop report](checks/replay-stop-2026-10-01.json).

| Before crop | After crop | Difference crop |
|---|---|---|
| ![Before](replay-determinism/final-main-2/pairs/screenshots/page-013-768/before-crop.png) | ![After](replay-determinism/final-main-2/pairs/screenshots/page-013-768/after-crop.png) | ![Difference](replay-determinism/final-main-2/pairs/screenshots/page-013-768/diff-crop.png) |

The difference crop uses 8× intensity solely to make the diagnostic visible; original PNGs and equality are unchanged. Both readiness records show identical currentSrc, no srcset/sizes, natural sizes, rendered rectangles, successful decode, eager loading, opacity 1, no transforms/filters/hover, no running animations, loaded fonts and DPR 1. Network records show no cached responses. Existing software-rasterization flags were already active. **Responsive-image candidate selection is ruled out. Rasterization/resampling variance is a supported hypothesis, but the underlying cause is not established.** Further capture investigation requires Joe's decision under the frozen-settings stop rule.

The saved-version replay correction itself is complete and previously passed. The main coordinator's first attempt in this turn had separately stopped before comparison because an interrupted recapture left a partial expected-Samples report. Supplying its existing BV_EXPECTED_SAMPLES parameter with the complete preserved baseline fixed that setup issue without changing capture. The mismatch above occurred on the subsequent exact replay and was not retried.

## Work completed before the stop

The standing-rule changes in this turn are exact redundant-logo recognition (recorded asset plus adjacent visible business name, on enumerated page types), exact Thousand Oaks consent recognition, fixture-only Sample Fictional names, the corresponding exact SEO-title expectation, and exact Craft final-submit recognition. All positive/negative tests and frozen-detector proofs are included. Reference-proof, roofing-cities, roofing-cta, roofing-story and service-motion now passed real captures. The later Craft Call-link secondary styling is written in the isolated polish stylesheet but **has not been rebuilt or given its required after-capture/protection rerun** because of this stop. It is not claimed complete. The corrected service-page suite needs another complete run after that follow-up. Its failed results remain failed.

Protected backlog blocks remain unchanged and unstaged. Validation processes were stopped; no unrelated app was operated. No dependencies, generation, provider calls, push or deployment.

## Earlier evidence and approved-change history

The material below is historical and must not be read as a final pass. The current status and counts above take precedence.

# #028F — Automatic QA gate: final validation in progress

The approved saved-version replay correction passes: **604/604 saved PNGs**, **165/165 video-frame hashes**, **231/231 full-page screenshots**, stored manifest/version identities unchanged, 0 request-guard failures. The deliberate reviews 404 is rejected before any screenshot comparison. No production code changed in this correction. [Replay proof](frame-initialization/same-version-samples.json) · [Frame proof](frame-initialization/hash-comparison.json) · [Negative guard](checks/replay-request-guard-negative.json).

The prior final run stopped at 55 passing commands and 6 blocked commands (3 interrupted; 38 not started). The blockers were exact recognition and fictional fixture designations covered by Joe’s standing approvals. Brand recognition passed 360 boundaries and Thousand Oaks consent passed 84; the frozen detector restoration proof passes. The full final validation is restarting on this revision. No staging or commit. All 70 Sample Borderlines remain open. The earlier stopped attempt and its preserved evidence below are history, not the current result.

# #028F — Automatic QA gate

**Stopped, uncommitted: the new saved-version proof harness caused a Reviews-page screenshot mismatch.** No retry, staging or commit. Final validation was not started on this revision. Base remains `fdcd459`.

## Latest approved initialization and results

Only the 960×540 extraction page's initial document changed: a minimal same-origin blank document is temporarily supplied through the existing capture-document map and unchanged request handler. Normal page capture code, video source/element/size/DPR/seeks/decode/timing, detector and console allowlist are unchanged. [Exact initialization delta](frame-initialization/initialization-change.json).

| Latest check | Result | Evidence |
|---|---|---|
| Hero-editor before / after | 50/50 each; 90/90 extracted frames identical | [Before](checks/frame-init-hero-before.log), [after](checks/frame-init-hero-after.log) |
| Fresh five-Sample recapture | 3,425 Pass / 70 Borderline / 0 Fail; qaGateClear=false | [Results](checks/qa-packets.json), [log](checks/frame-init-samples-after.log) |
| All observed video frames | **165/165 identical**: 90 hero-editor + 75 Sample frames | [Full hash table](frame-initialization/HASHES.md), [JSON](frame-initialization/observed-hash-evidence.json) |
| Fresh Sample page screenshots | 231/231 match saved bytes; regenerated manifest metadata differs | [Observed comparison](frame-initialization/observed-hash-evidence.json) |
| Hero-editor after console | 0 records / 0 non-allowlisted diagnostics | [Console](checks/frame-init-hero-after-console.json) |
| Normal-page unused-preload negative | Pass: real Chrome warning at 1440 remains non-allowlisted; negative console gate fails | [Report](checks/unused-preload-negative.json) |
| Detector and console classifier | Both source SHA-256 hashes unchanged | [Locks](frame-initialization/observed-hash-evidence.json) |
| Initial version-identity proof | **Failed setup assertion**: fresh Sample manifests have new IDs/timestamps/digests | [Log](checks/frame-initialization-proof.log) |
| Saved-version replay proof | **FAIL / stopped**: new test omitted runtime-backed reviews endpoint | [Log](checks/frame-init-saved-samples.log), [diagnosis](frame-initialization/BLOCKER.json) |
| Full final suite, broad AA/console, main replays and protected/archive recapture | **Not run on this revision** after the required stop | Historical results below are not final passes |

Hero-editor creates random site IDs per run, so separate runs can choose different Looks. Its frame comparison covers every actual extraction by capture/clip/time. Fresh Sample manifests also receive new IDs, timestamps and digests; all their observed frame/page PNGs matched, but the first proof correctly refused to claim identical version hashes. Neither failed proof is counted as passed.

## Exact screenshot stop: test-harness cause

The new `tests/automatic-qa-frame-sample-replay.mjs` incorrectly passed `createAssets().fetch` as the entire resource binding instead of reusing the existing runtime-backed replay path. **This was my test-harness error.** Its local request `/api/public/sample-fictional-copper-kite-ventura/reviews` returned **404**. Existing `public/reviews.js` displayed “Reviews are temporarily unavailable. Read them at the source links.” instead of “Read customer feedback directly on the linked profiles.” This is visible in the pair and recorded in the saved network evidence. The extraction-initialization block had not executed yet; the evidence does not indicate a raster issue.

The failed file is `screenshots/page-012-1440.png` on `/s/sample-fictional-copper-kite-ventura/reviews`: **1440×2118 before, 1440×2102 after**, **190,686 differing pixels**, exact bounding box `[0,1009,1440,2118]`.

- Before SHA-256: `bd8f6bc78cb8c833b81c8e37fbd4368bd5347b13d2148d573a966aad919e5b96`.
- Failed-proof SHA-256: `cb327d336fcca94e29e369ccee6b0fb8df7a17abda655b76c12feea0ce0dcd80`.
- [Before image](frame-initialization/blocked-pair/screenshots/page-012-1440/before.png) · [after image](frame-initialization/blocked-pair/screenshots/page-012-1440/after.png) · [readiness pair](frame-initialization/blocked-pair/screenshots/page-012-1440/readiness.json) · [pixel measurements](frame-initialization/blocked-pair/screenshots/page-012-1440/pixel-diff.json).

| Before status | Failed-proof status | Exact diff crop |
|---|---|---|
| ![Before](frame-initialization/blocked-pair/screenshots/page-012-1440/before-status-crop.png) | ![After](frame-initialization/blocked-pair/screenshots/page-012-1440/after-status-crop.png) | ![Diff](frame-initialization/blocked-pair/screenshots/page-012-1440/status-diff-crop.png) |

The failed capture was not retried. The pending correction is test-only: replay the stored versions using the already-existing runtime-backed replay path, retaining strict equality and all capture settings. No production, detector, allowlist, timing, hash or pixel-tolerance change is proposed. No automatic approval review rejected an action in this attempt.

All 70 Sample Borderlines stay open. Protected backlog blocks stay byte-identical and unstaged. **0 credits, 0 real provider calls, no dependencies, no push.**

## Complete observed video-frame hashes

| Fixture / capture | Frame | Before SHA-256 | After SHA-256 | Result |
|---|---|---|---|---|
| hero-edit-qa / 1 | frames/1a43c781232f927c-0.png | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | PASS |
| hero-edit-qa / 1 | frames/1a43c781232f927c-25.png | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | PASS |
| hero-edit-qa / 1 | frames/1a43c781232f927c-50.png | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | PASS |
| hero-edit-qa / 1 | frames/1a43c781232f927c-75.png | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | PASS |
| hero-edit-qa / 1 | frames/1a43c781232f927c-100.png | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | PASS |
| hero-edit-qa / 1 | frames/8572f04697665d66-0.png | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | PASS |
| hero-edit-qa / 1 | frames/8572f04697665d66-25.png | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | PASS |
| hero-edit-qa / 1 | frames/8572f04697665d66-50.png | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | PASS |
| hero-edit-qa / 1 | frames/8572f04697665d66-75.png | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | PASS |
| hero-edit-qa / 1 | frames/8572f04697665d66-100.png | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | PASS |
| hero-edit-qa / 2 | frames/1a43c781232f927c-0.png | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | PASS |
| hero-edit-qa / 2 | frames/1a43c781232f927c-25.png | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | PASS |
| hero-edit-qa / 2 | frames/1a43c781232f927c-50.png | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | PASS |
| hero-edit-qa / 2 | frames/1a43c781232f927c-75.png | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | PASS |
| hero-edit-qa / 2 | frames/1a43c781232f927c-100.png | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | PASS |
| hero-edit-qa / 2 | frames/8572f04697665d66-0.png | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | PASS |
| hero-edit-qa / 2 | frames/8572f04697665d66-25.png | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | PASS |
| hero-edit-qa / 2 | frames/8572f04697665d66-50.png | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | PASS |
| hero-edit-qa / 2 | frames/8572f04697665d66-75.png | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | PASS |
| hero-edit-qa / 2 | frames/8572f04697665d66-100.png | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | PASS |
| hero-edit-qa / 3 | frames/1a43c781232f927c-0.png | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | PASS |
| hero-edit-qa / 3 | frames/1a43c781232f927c-25.png | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | PASS |
| hero-edit-qa / 3 | frames/1a43c781232f927c-50.png | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | PASS |
| hero-edit-qa / 3 | frames/1a43c781232f927c-75.png | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | PASS |
| hero-edit-qa / 3 | frames/1a43c781232f927c-100.png | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | PASS |
| hero-edit-qa / 3 | frames/8572f04697665d66-0.png | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | PASS |
| hero-edit-qa / 3 | frames/8572f04697665d66-25.png | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | PASS |
| hero-edit-qa / 3 | frames/8572f04697665d66-50.png | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | PASS |
| hero-edit-qa / 3 | frames/8572f04697665d66-75.png | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | PASS |
| hero-edit-qa / 3 | frames/8572f04697665d66-100.png | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | PASS |
| durable-hero / 4 | frames/1a43c781232f927c-0.png | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | PASS |
| durable-hero / 4 | frames/1a43c781232f927c-25.png | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | PASS |
| durable-hero / 4 | frames/1a43c781232f927c-50.png | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | PASS |
| durable-hero / 5 | frames/1a43c781232f927c-0.png | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | PASS |
| durable-hero / 6 | frames/1a43c781232f927c-0.png | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | 9847b846f7c4718b7081a66c65946cab2358092d0dac6a459660d5c4aba112ad | PASS |
| durable-hero / 4 | frames/1a43c781232f927c-75.png | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | PASS |
| durable-hero / 5 | frames/1a43c781232f927c-25.png | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | PASS |
| durable-hero / 5 | frames/1a43c781232f927c-50.png | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | PASS |
| durable-hero / 4 | frames/1a43c781232f927c-100.png | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | PASS |
| durable-hero / 6 | frames/1a43c781232f927c-25.png | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | e0e123022a435b6b993a89aec8025a9f006d9e2cc603f2882989ce562f372d2f | PASS |
| durable-hero / 6 | frames/1a43c781232f927c-50.png | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | da3d33f6e510d2a8d832f8b44ae1574c6ac3e333631168880a47292039b57c08 | PASS |
| durable-hero / 5 | frames/1a43c781232f927c-75.png | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | PASS |
| durable-hero / 6 | frames/1a43c781232f927c-75.png | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | ace8fd830893b28ef61e08a569a6254ddccc90c2d27032f0eb99186f4c37e5b4 | PASS |
| durable-hero / 5 | frames/1a43c781232f927c-100.png | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | PASS |
| durable-hero / 6 | frames/1a43c781232f927c-100.png | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | 349d24e378d840ddbeedb84931a8214ae8fc05516030f8c5aa419ab22b64578d | PASS |
| durable-hero / 4 | frames/97e6c3c93e2bf03a-0.png | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | PASS |
| durable-hero / 4 | frames/97e6c3c93e2bf03a-25.png | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | PASS |
| durable-hero / 5 | frames/97e6c3c93e2bf03a-0.png | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | PASS |
| durable-hero / 4 | frames/97e6c3c93e2bf03a-50.png | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | PASS |
| durable-hero / 6 | frames/97e6c3c93e2bf03a-0.png | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | PASS |
| durable-hero / 5 | frames/97e6c3c93e2bf03a-25.png | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | PASS |
| durable-hero / 6 | frames/97e6c3c93e2bf03a-25.png | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | PASS |
| durable-hero / 4 | frames/97e6c3c93e2bf03a-75.png | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | PASS |
| durable-hero / 5 | frames/97e6c3c93e2bf03a-50.png | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | PASS |
| durable-hero / 4 | frames/97e6c3c93e2bf03a-100.png | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | PASS |
| durable-hero / 6 | frames/97e6c3c93e2bf03a-50.png | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | PASS |
| durable-hero / 5 | frames/97e6c3c93e2bf03a-75.png | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | PASS |
| durable-hero / 5 | frames/97e6c3c93e2bf03a-100.png | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | PASS |
| durable-hero / 6 | frames/97e6c3c93e2bf03a-75.png | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | PASS |
| durable-hero / 6 | frames/97e6c3c93e2bf03a-100.png | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | PASS |
| durable-hero / 4 | frames/3639d9130ea7b8aa-0.png | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | PASS |
| durable-hero / 4 | frames/3639d9130ea7b8aa-25.png | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | PASS |
| durable-hero / 4 | frames/3639d9130ea7b8aa-50.png | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | PASS |
| durable-hero / 5 | frames/3639d9130ea7b8aa-0.png | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | PASS |
| durable-hero / 4 | frames/3639d9130ea7b8aa-75.png | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | PASS |
| durable-hero / 5 | frames/3639d9130ea7b8aa-25.png | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | PASS |
| durable-hero / 6 | frames/3639d9130ea7b8aa-0.png | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | PASS |
| durable-hero / 4 | frames/3639d9130ea7b8aa-100.png | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | PASS |
| durable-hero / 5 | frames/3639d9130ea7b8aa-50.png | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | PASS |
| durable-hero / 6 | frames/3639d9130ea7b8aa-25.png | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | PASS |
| durable-hero / 5 | frames/3639d9130ea7b8aa-75.png | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | PASS |
| durable-hero / 6 | frames/3639d9130ea7b8aa-50.png | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | PASS |
| durable-hero / 6 | frames/3639d9130ea7b8aa-75.png | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | PASS |
| durable-hero / 5 | frames/3639d9130ea7b8aa-100.png | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | PASS |
| durable-hero / 6 | frames/3639d9130ea7b8aa-100.png | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | PASS |
| durable-hero / 4 | frames/8572f04697665d66-0.png | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | PASS |
| durable-hero / 4 | frames/8572f04697665d66-25.png | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | PASS |
| durable-hero / 4 | frames/8572f04697665d66-50.png | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | PASS |
| durable-hero / 5 | frames/8572f04697665d66-0.png | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | PASS |
| durable-hero / 4 | frames/8572f04697665d66-75.png | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | PASS |
| durable-hero / 6 | frames/8572f04697665d66-0.png | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | PASS |
| durable-hero / 5 | frames/8572f04697665d66-25.png | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | PASS |
| durable-hero / 4 | frames/8572f04697665d66-100.png | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | PASS |
| durable-hero / 6 | frames/8572f04697665d66-25.png | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | PASS |
| durable-hero / 5 | frames/8572f04697665d66-50.png | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | PASS |
| durable-hero / 6 | frames/8572f04697665d66-50.png | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | PASS |
| durable-hero / 5 | frames/8572f04697665d66-75.png | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | PASS |
| durable-hero / 6 | frames/8572f04697665d66-75.png | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | PASS |
| durable-hero / 5 | frames/8572f04697665d66-100.png | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | PASS |
| durable-hero / 6 | frames/8572f04697665d66-100.png | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | PASS |
| sample-fictional-copper-kite-ventura | frames/97e6c3c93e2bf03a-0.png | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | PASS |
| sample-fictional-copper-kite-ventura | frames/97e6c3c93e2bf03a-25.png | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | PASS |
| sample-fictional-copper-kite-ventura | frames/97e6c3c93e2bf03a-50.png | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | PASS |
| sample-fictional-copper-kite-ventura | frames/97e6c3c93e2bf03a-75.png | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | PASS |
| sample-fictional-copper-kite-ventura | frames/97e6c3c93e2bf03a-100.png | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | PASS |
| sample-fictional-copper-kite-ventura | frames/3639d9130ea7b8aa-0.png | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | PASS |
| sample-fictional-copper-kite-ventura | frames/3639d9130ea7b8aa-25.png | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | PASS |
| sample-fictional-copper-kite-ventura | frames/3639d9130ea7b8aa-50.png | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | PASS |
| sample-fictional-copper-kite-ventura | frames/3639d9130ea7b8aa-75.png | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | PASS |
| sample-fictional-copper-kite-ventura | frames/3639d9130ea7b8aa-100.png | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | PASS |
| sample-fictional-copper-kite-ventura | frames/8572f04697665d66-0.png | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | PASS |
| sample-fictional-copper-kite-ventura | frames/8572f04697665d66-25.png | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | PASS |
| sample-fictional-copper-kite-ventura | frames/8572f04697665d66-50.png | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | PASS |
| sample-fictional-copper-kite-ventura | frames/8572f04697665d66-75.png | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | PASS |
| sample-fictional-copper-kite-ventura | frames/8572f04697665d66-100.png | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | PASS |
| sample-fictional-blue-orchard-pasadena | frames/97e6c3c93e2bf03a-0.png | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | PASS |
| sample-fictional-blue-orchard-pasadena | frames/97e6c3c93e2bf03a-25.png | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | PASS |
| sample-fictional-blue-orchard-pasadena | frames/97e6c3c93e2bf03a-50.png | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | PASS |
| sample-fictional-blue-orchard-pasadena | frames/97e6c3c93e2bf03a-75.png | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | PASS |
| sample-fictional-blue-orchard-pasadena | frames/97e6c3c93e2bf03a-100.png | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | PASS |
| sample-fictional-blue-orchard-pasadena | frames/3639d9130ea7b8aa-0.png | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | PASS |
| sample-fictional-blue-orchard-pasadena | frames/3639d9130ea7b8aa-25.png | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | PASS |
| sample-fictional-blue-orchard-pasadena | frames/3639d9130ea7b8aa-50.png | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | PASS |
| sample-fictional-blue-orchard-pasadena | frames/3639d9130ea7b8aa-75.png | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | PASS |
| sample-fictional-blue-orchard-pasadena | frames/3639d9130ea7b8aa-100.png | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | PASS |
| sample-fictional-blue-orchard-pasadena | frames/8572f04697665d66-0.png | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | PASS |
| sample-fictional-blue-orchard-pasadena | frames/8572f04697665d66-25.png | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | PASS |
| sample-fictional-blue-orchard-pasadena | frames/8572f04697665d66-50.png | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | PASS |
| sample-fictional-blue-orchard-pasadena | frames/8572f04697665d66-75.png | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | PASS |
| sample-fictional-blue-orchard-pasadena | frames/8572f04697665d66-100.png | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | PASS |
| sample-fictional-paper-lantern-temecula | frames/97e6c3c93e2bf03a-0.png | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | 8fb71e45b942fc691f9607f1dedb214fe5e6b7f988556cf0e42a4c55a9ffee44 | PASS |
| sample-fictional-paper-lantern-temecula | frames/97e6c3c93e2bf03a-25.png | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | 923de726dc8858cd22feb0c22a70bc81f4dbc85487e9ad2b5c6e505fea869681 | PASS |
| sample-fictional-paper-lantern-temecula | frames/97e6c3c93e2bf03a-50.png | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | 2edcf5a25faf180eda5cce55a4bdfa83628d9efa57a7dfb233e0f3c2ca94b267 | PASS |
| sample-fictional-paper-lantern-temecula | frames/97e6c3c93e2bf03a-75.png | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | d48a21e77d299cc7cd3e7ec9e34c706fc558bf0eef20b5ce0c36da80253bbbab | PASS |
| sample-fictional-paper-lantern-temecula | frames/97e6c3c93e2bf03a-100.png | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | 5eba785136a4736f7babd6d2cc6fa4682d3e855444e8df17f8e5be0b567df6ff | PASS |
| sample-fictional-paper-lantern-temecula | frames/3639d9130ea7b8aa-0.png | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | e702b0c780802c36f2a35013c7ee56c5d22c3faec922cb2462af3f11bfe9f795 | PASS |
| sample-fictional-paper-lantern-temecula | frames/3639d9130ea7b8aa-25.png | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | 2002b1f55e01bf59eb870ab46f1867fe5f939faa7993bec9661a1b8c40bdb499 | PASS |
| sample-fictional-paper-lantern-temecula | frames/3639d9130ea7b8aa-50.png | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | 596b36d5f4e8cbefbc0676c1700764ace9e6de3180b49624d0d5cd64c34e188f | PASS |
| sample-fictional-paper-lantern-temecula | frames/3639d9130ea7b8aa-75.png | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | 446c2c7d85fef94f5906b473e459e8b3971826ca060340f3ce6cb0cec901ef6f | PASS |
| sample-fictional-paper-lantern-temecula | frames/3639d9130ea7b8aa-100.png | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | e571f21d177f950a30b9756dd0062c4171fa03dbe96a9fa1bb3c42b357750228 | PASS |
| sample-fictional-paper-lantern-temecula | frames/8572f04697665d66-0.png | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | d86ee2c461fc510e2d6d39764b09abba92daf040e9bebd61e849dac19de8be51 | PASS |
| sample-fictional-paper-lantern-temecula | frames/8572f04697665d66-25.png | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | cfe5cf06f0e067c2f0894a8ed67156874746ba97c61f430fbae714dc7727f54b | PASS |
| sample-fictional-paper-lantern-temecula | frames/8572f04697665d66-50.png | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | 9d7d4fcbda8c0d87b8a1169c4c69772489c1e1d55dbae93a86588e2e74cb9a2c | PASS |
| sample-fictional-paper-lantern-temecula | frames/8572f04697665d66-75.png | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | 47b70bedb2c62517aca2571bb2bb3221651b20abeb825c6d6c2d0123fc42bdc1 | PASS |
| sample-fictional-paper-lantern-temecula | frames/8572f04697665d66-100.png | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | 9ede463d79268c37395b893a4b335a2e2319a28a4a4d68ca6308ba21ef01f5fa | PASS |
| sample-fictional-cobalt-heron-irvine | frames/243d8b03b4aae515-0.png | 7406be1be4956e9fc069b36b29d484793e4cb56c343d4eb1843ede34ac93e1b0 | 7406be1be4956e9fc069b36b29d484793e4cb56c343d4eb1843ede34ac93e1b0 | PASS |
| sample-fictional-cobalt-heron-irvine | frames/243d8b03b4aae515-25.png | 244bb31886272bd6287ed73a2076decffc6d0bd09c60cc4fe7113b37bc5075ee | 244bb31886272bd6287ed73a2076decffc6d0bd09c60cc4fe7113b37bc5075ee | PASS |
| sample-fictional-cobalt-heron-irvine | frames/243d8b03b4aae515-50.png | 7737472dd9014e43908e2eea00a11ae938088bbefb2dded7a8a408ae458962dc | 7737472dd9014e43908e2eea00a11ae938088bbefb2dded7a8a408ae458962dc | PASS |
| sample-fictional-cobalt-heron-irvine | frames/243d8b03b4aae515-75.png | 9dd3c5fc5360e94ea921737796b5916ea7751bdf605783f0881d922fe31ac912 | 9dd3c5fc5360e94ea921737796b5916ea7751bdf605783f0881d922fe31ac912 | PASS |
| sample-fictional-cobalt-heron-irvine | frames/243d8b03b4aae515-100.png | cc9c525f48548b2ee46abc3a6d5aea2ebc1f6b6c8e8a173b454a10b2dbbc2342 | cc9c525f48548b2ee46abc3a6d5aea2ebc1f6b6c8e8a173b454a10b2dbbc2342 | PASS |
| sample-fictional-cobalt-heron-irvine | frames/b1b11d11d77a1662-0.png | b643ffabc9782acb25c6b2f7bdbdcfef31fbe225191da0cb2669aa037aa06d97 | b643ffabc9782acb25c6b2f7bdbdcfef31fbe225191da0cb2669aa037aa06d97 | PASS |
| sample-fictional-cobalt-heron-irvine | frames/b1b11d11d77a1662-25.png | 6b2d2b19e2148b548737d91c060f5d9165ec1bb3e2ed687ed8633303d69cbcca | 6b2d2b19e2148b548737d91c060f5d9165ec1bb3e2ed687ed8633303d69cbcca | PASS |
| sample-fictional-cobalt-heron-irvine | frames/b1b11d11d77a1662-50.png | e8944b5f4d45ff2cc9431b4d546d2b16739ca64a6a609c574499c1b8669813c6 | e8944b5f4d45ff2cc9431b4d546d2b16739ca64a6a609c574499c1b8669813c6 | PASS |
| sample-fictional-cobalt-heron-irvine | frames/b1b11d11d77a1662-75.png | 1636dfeefb7c03d8c1701f3530aa25c23b71630b45eef113ee241166277a39c5 | 1636dfeefb7c03d8c1701f3530aa25c23b71630b45eef113ee241166277a39c5 | PASS |
| sample-fictional-cobalt-heron-irvine | frames/b1b11d11d77a1662-100.png | b04c306684dea8022502f70a017094db141a17141ae56d43ef196a8ed944840c | b04c306684dea8022502f70a017094db141a17141ae56d43ef196a8ed944840c | PASS |
| sample-fictional-cobalt-heron-irvine | frames/d83d1f4205d80f06-0.png | b29ff9eb7a194e319d94c6a6bb0fe15a800db0081dc307c04b8a95d94541fb41 | b29ff9eb7a194e319d94c6a6bb0fe15a800db0081dc307c04b8a95d94541fb41 | PASS |
| sample-fictional-cobalt-heron-irvine | frames/d83d1f4205d80f06-25.png | e24a55e438d8fc77c2db36bc5cc5c71ffab655734c1327158d3594c5fb5f4e9a | e24a55e438d8fc77c2db36bc5cc5c71ffab655734c1327158d3594c5fb5f4e9a | PASS |
| sample-fictional-cobalt-heron-irvine | frames/d83d1f4205d80f06-50.png | 8913daaddf1daeb4affc7f0bdeda6307e2298b52d60833dd0a355f4f99e5b8e8 | 8913daaddf1daeb4affc7f0bdeda6307e2298b52d60833dd0a355f4f99e5b8e8 | PASS |
| sample-fictional-cobalt-heron-irvine | frames/d83d1f4205d80f06-75.png | bb4d44feb88b099e0b952aea2f0bfdd3fd63de92a39302a310ef60b0c02eafbd | bb4d44feb88b099e0b952aea2f0bfdd3fd63de92a39302a310ef60b0c02eafbd | PASS |
| sample-fictional-cobalt-heron-irvine | frames/d83d1f4205d80f06-100.png | f47d8d2461cfd10781c9b803a6781e05b352f701e4e2ca97e6fb7609a66a8193 | f47d8d2461cfd10781c9b803a6781e05b352f701e4e2ca97e6fb7609a66a8193 | PASS |
| sample-fictional-ochre-willow-riverside | frames/243d8b03b4aae515-0.png | 7406be1be4956e9fc069b36b29d484793e4cb56c343d4eb1843ede34ac93e1b0 | 7406be1be4956e9fc069b36b29d484793e4cb56c343d4eb1843ede34ac93e1b0 | PASS |
| sample-fictional-ochre-willow-riverside | frames/243d8b03b4aae515-25.png | 244bb31886272bd6287ed73a2076decffc6d0bd09c60cc4fe7113b37bc5075ee | 244bb31886272bd6287ed73a2076decffc6d0bd09c60cc4fe7113b37bc5075ee | PASS |
| sample-fictional-ochre-willow-riverside | frames/243d8b03b4aae515-50.png | 7737472dd9014e43908e2eea00a11ae938088bbefb2dded7a8a408ae458962dc | 7737472dd9014e43908e2eea00a11ae938088bbefb2dded7a8a408ae458962dc | PASS |
| sample-fictional-ochre-willow-riverside | frames/243d8b03b4aae515-75.png | 9dd3c5fc5360e94ea921737796b5916ea7751bdf605783f0881d922fe31ac912 | 9dd3c5fc5360e94ea921737796b5916ea7751bdf605783f0881d922fe31ac912 | PASS |
| sample-fictional-ochre-willow-riverside | frames/243d8b03b4aae515-100.png | cc9c525f48548b2ee46abc3a6d5aea2ebc1f6b6c8e8a173b454a10b2dbbc2342 | cc9c525f48548b2ee46abc3a6d5aea2ebc1f6b6c8e8a173b454a10b2dbbc2342 | PASS |
| sample-fictional-ochre-willow-riverside | frames/b1b11d11d77a1662-0.png | b643ffabc9782acb25c6b2f7bdbdcfef31fbe225191da0cb2669aa037aa06d97 | b643ffabc9782acb25c6b2f7bdbdcfef31fbe225191da0cb2669aa037aa06d97 | PASS |
| sample-fictional-ochre-willow-riverside | frames/b1b11d11d77a1662-25.png | 6b2d2b19e2148b548737d91c060f5d9165ec1bb3e2ed687ed8633303d69cbcca | 6b2d2b19e2148b548737d91c060f5d9165ec1bb3e2ed687ed8633303d69cbcca | PASS |
| sample-fictional-ochre-willow-riverside | frames/b1b11d11d77a1662-50.png | e8944b5f4d45ff2cc9431b4d546d2b16739ca64a6a609c574499c1b8669813c6 | e8944b5f4d45ff2cc9431b4d546d2b16739ca64a6a609c574499c1b8669813c6 | PASS |
| sample-fictional-ochre-willow-riverside | frames/b1b11d11d77a1662-75.png | 1636dfeefb7c03d8c1701f3530aa25c23b71630b45eef113ee241166277a39c5 | 1636dfeefb7c03d8c1701f3530aa25c23b71630b45eef113ee241166277a39c5 | PASS |
| sample-fictional-ochre-willow-riverside | frames/b1b11d11d77a1662-100.png | b04c306684dea8022502f70a017094db141a17141ae56d43ef196a8ed944840c | b04c306684dea8022502f70a017094db141a17141ae56d43ef196a8ed944840c | PASS |
| sample-fictional-ochre-willow-riverside | frames/d83d1f4205d80f06-0.png | b29ff9eb7a194e319d94c6a6bb0fe15a800db0081dc307c04b8a95d94541fb41 | b29ff9eb7a194e319d94c6a6bb0fe15a800db0081dc307c04b8a95d94541fb41 | PASS |
| sample-fictional-ochre-willow-riverside | frames/d83d1f4205d80f06-25.png | e24a55e438d8fc77c2db36bc5cc5c71ffab655734c1327158d3594c5fb5f4e9a | e24a55e438d8fc77c2db36bc5cc5c71ffab655734c1327158d3594c5fb5f4e9a | PASS |
| sample-fictional-ochre-willow-riverside | frames/d83d1f4205d80f06-50.png | 8913daaddf1daeb4affc7f0bdeda6307e2298b52d60833dd0a355f4f99e5b8e8 | 8913daaddf1daeb4affc7f0bdeda6307e2298b52d60833dd0a355f4f99e5b8e8 | PASS |
| sample-fictional-ochre-willow-riverside | frames/d83d1f4205d80f06-75.png | bb4d44feb88b099e0b952aea2f0bfdd3fd63de92a39302a310ef60b0c02eafbd | bb4d44feb88b099e0b952aea2f0bfdd3fd63de92a39302a310ef60b0c02eafbd | PASS |
| sample-fictional-ochre-willow-riverside | frames/d83d1f4205d80f06-100.png | f47d8d2461cfd10781c9b803a6781e05b352f701e4e2ca97e6fb7609a66a8193 | f47d8d2461cfd10781c9b803a6781e05b352f701e4e2ca97e6fb7609a66a8193 | PASS |


## Prior-attempt history (not final validation for this revision)


**Stopped, uncommitted: two non-allowlisted hero-preload warnings block the broad console audit.** The approved populated-project and credentials-clearance fixes pass. Final full validation is incomplete; no commit or staging. Base `fdcd459`, branch `feature/local-environment-setup`. All 70 Sample Borderlines remain open.

## Current stop: video-frame preload warnings

The current broad audit reports **2 non-allowlisted warnings**, both from `tests/hero-editor.mjs` captures at **960×540** on `http://review.local/s/hero-edit-qa`: Chrome says `/assets/roofing-fast/hero-1440.avif` was preloaded but not used within a few seconds. There are **0 text AA failures and 0 border AA failures** in the 177 measured platform/staff captures (17,167 text and 20,953 border measurements). This is not a screenshot mismatch.

The records identify the video-frame extraction context. `src/aws/review-capture.js` first navigates that context to the homepage, then replaces its document with the selected video; the homepage hero preload is no longer used. No exception was added, and no capture setup, detector, timing, tolerance, product markup or protected response was changed for this warning. Joe’s capture freeze and narrow console exceptions require a decision before correcting this initialization. [Exact diagnostics and source evidence](checks/preload-warning-blocker.json) · [Failed broad audit](checks/credentials-interim-quality.log).

| Current final-revision gate | Result | Evidence |
|---|---|---|
| Full 102-command run | **Incomplete: 29 Pass / 3 interrupted / 70 not run** | [Each command](checks/credentials-command-results.md), [summary](checks/credentials-validation-summary.json) |
| Broad AA / console | 0 text/border AA failures; **2 non-allowlisted warnings — Fail** | [Measured report](checks/quality-summary.json) |
| Five Samples | 3,425 Pass / 70 open Borderline / 0 Fail; `qaGateClear=false` | [Report](checks/qa-packets.json) |
| Three strict main replays | 143/143 each, no differences | [Reports](checks/three-exact-replays.json) |
| Platform / staff | 162 + 15 states pass, 0 audit failures | [Platform](platform-matrix/after-platform.json), [staff](checks/qa-staff-browser.json) |
| Clearance | 32 JS-on + 16 no-JS + 24 legacy states; 0 intersections | [JS](checks/qa-polish-browser.json), [no-JS](checks/qa-polish-no-js.json), [legacy](checks/legacy-clearance.json) |
| Credentials fix | 24 after states pass; both original 768px overlaps reproduced | [Before/after measurements](checks/credentials-clearance.json), [real publication regression](checks/credentials-premium-service.log) |
| Additional suites | 14/14 pass, including 216 variant and 544 all-process states | [Commands](additional-checks.json) |
| Focused / populated-project checks | 12/12; 52 project recognition cases; exact map routing and lightbox pass | [Focused](round6-focused-checks.json), [project](checks/project-recognition.json), [media](checks/project-map-routing.json) |
| Real legacy captures | Robles published-copy 1,086 Pass / 2 Borderline / 0 Fail; Constitution and Conversion 0 Fail | [Robles](checks/legacy-real-qa-after.json), [legacy](checks/legacy-round6-after.json) |
| Protected / archived preflight | 279 + platform.css match, 56 existing CSS unchanged; 374/374 archived match approved manifests | [Protected](checks/accepted-protected-final.json), [archive](checks/sites-unchanged.log) |
| Remaining uniqueness/style and #028E browser regressions | Interrupted / not reached; no final pass claimed | [Stopped process record](checks/preload-warning-stopped-processes.json) |

Only verified ticket validation trees were stopped. The final fixture-catalog substitution and rebuild were not reached. Domain flow and #033I/#033V/#033T/#028G remain byte-identical and unstaged. **0 credits, 0 real provider calls, no new dependencies, no push.** The approved-change table and before/after evidence follow; older attempts below are retained history.


## Resolved populated-project findings — prior stopped run

`tests/platform.mjs` reached real browser QA and stopped before approval with **10 Fail**. The actual report, HTML and crops were preserved before the unchanged assertion. This is not a screenshot mismatch: all three main replays passed exact equality.

| Finding | Measurement and cause | Evidence |
|---|---|---|
| Map resources | **3 failed checks**: 13 OpenStreetMap tile requests blocked at 1440, 5 at 390, 3 at 768 (**21 requests**). The unchanged capture allows only same-origin GET/HEAD and aborts these external URLs before network access. | [Home crop](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/qa-crops/page-001-1440-2.png) |
| Closed lightbox image | **3 failed checks**. The closed `article.project-story > dialog#story-lightbox` contains `<figure><img alt="">` with no source. Capture currently decodes every `document.images` entry. The error URL is empty. The uploaded photos themselves use the existing valid `public/assets/roofing.jpg`. | [Saved HTML](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/pages/page-012.html), [decode crop](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/qa-crops/page-012-1440-4.png) |
| Existing project submit | **3 failed checks**. `section.story-contact#contact > form#lead-form > button.story-cta:not([type])` already says “Submit project inquiry” but is not recognized. The page has 0 recognized primaries at 390/768; at 1440 the header supplies 1 but the final section has 0. | [390 crop](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/qa-crops/page-012-390-2.png) |
| Chat over project metadata | **1 failed check** at 1440: metadata `dd` text overlaps the chat button by **70.59 × 7.98 px**, exceeding the unchanged 2px threshold. | [Actual intersection crop](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/qa-crops/page-012-1440-2.png) |

[Exact failure measurements](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/failures.json) · [QA report](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/qa-report.json) · [Platform command log](checks/platform.log).

The map and closed-lightbox cases require a decision beyond the earlier poster, wrap, secondary-action and visible-control recognition approvals. No new exception, fixture workaround, provider call, product change, detector change, capture-setting change or tolerance change was made. The existing submit may use the standing recognition process once the uncovered capture scopes are resolved; no button was added or removed. The real Fail results still block approval and publication.

Stopped only this ticket's verified launchers and their descendants. The full suite ended at **37 passed / 2 failed / 3 interrupted / 60 not run**. Financing comparison separately passed its unchanged recheck; the first failed execution remains recorded. Design-style validation was interrupted, later #028E packet/staff regressions were not reached, and final broad AA aggregation is incomplete. Failed or incomplete commands are never counted as passed.

[All 102 commands](checks/accepted-command-results.md) · [Validation summary](checks/accepted-validation-summary.json) · [Failed attempts and reruns](checks/accepted-attempt-history.md) · [Stopped processes](checks/accepted-scope-stop-processes.json).

**0 Higgsfield credits, 0 real provider calls, no new dependencies, no staging/commit/push.** The 70 Sample Borderlines remain open. The Domain flow and #033I/#033V/#033T/#028G blocks remain byte-identical and unstaged.

## Accepted replay diagnosis

The approved diagnostic preservation is implemented in the capture observer and shared test helper. Three full #028E contract runs each pass **48/48 checks with exact packet-file equality**. The Services images have identical sources, natural/rendered sizes, decode state, DPR and viewport; no responsive candidates or cache hits were observed. Existing request routing already disables HTTP cache, and Chrome reports SwiftShader. The prior mismatch did not reproduce, so its cause is **not established**. No capture settings were changed.

Joe accepted all three diagnostic runs and approved the final full-suite/replay/broad-audit reruns, which ran until the new populated-project scope blocker above. The earlier cause is still unconfirmed; no capture-setting change is claimed. The three results and paired readiness records are linked in [the diagnosis README](replay-determinism/README.md). No new failure image pairs or pixel-diff crops exist because all three exact comparisons matched. The earlier failed pair was not exported by the old test. The new helper will preserve both actual images before any future screenshot equality assertion fails. **No commit; all 70 Sample Borderlines remain open.**

## Approved change summary

| Approved scope | Change made in #028F |
|---|---|
| Frame-extraction initialization | Only the 960×540 extraction page starts on a minimal same-origin document through the existing request handler. Video settings, normal page captures, detector and console allowlist unchanged. 165/165 observed frame hashes match; unused-preload negative stays strict. Additional saved-version proof stopped on the test-harness error above. |
| Saved-version replay guard | Test-only runtime-backed replay preserves stored IDs, digests and manifests. Every same-origin non-2xx or unhandled request fails before screenshot comparison; deliberate reviews 404 has a negative fixture. No production or capture-setting change. |
| QA map fixture | Exact project OpenStreetMap tile URLs use one checked-in neutral PNG. Every other external request stays blocked; each capture records local tile use and hash. |
| Project lightbox | Closed dialog contains no source-free image. Opening uses the selected existing photo source/alt; close removes it. Focus, Escape and no-JS photos are retained. |
| Project inquiry recognition | Exact existing project-story Submit project inquiry action; 4 positive and 48 negative boundaries plus frozen-detector lock. No control or wording change. |
| Readable body-text clearance | Existing visibility-only clearance protects project metadata and the measured service-credentials spans/links. Two 768px credentials overlaps reproduced; 24 after states and real premium-service publication pass. |
| Test execution corrections | Expenses export test requests its seeded month explicitly; platform audit opens the existing phone Menu and uses actionable clicks. Original behavior/AA assertions remain, and incomplete attempts are preserved. |
| Automatic gate | Reused #028E capture/version/approval storage; added measured Pass/Borderline/Fail reports, evidence hashes, staff-only decisions and exact-version publication prerequisites. AI review and custom video remain off. |
| Staff screen | Added light `bv-` QA summary, blocking crops, required-reason Borderline decisions, collapsed passes and disabled approval explanations. |
| Section film and hero detail | Reserved the installed film's frame, kept chapter labels clear, used cover for video/poster and separated the expertise-link arrow. |
| Meaningful and decorative media | Factual #028D library alt descriptions; explicit presentation metadata for genuinely decorative material thumbnails. No ownership claims. |
| JS clearance | Visibility-only tucking for approved chat/project actions, headers, chapter/story rails, mobile dock/call and conversion actions. Focus, dimensions, links, 2px threshold and 60ms assertions retained; approved 64px lookahead used where needed. |
| No-JS clearance | Approved floating actions and navigation rails use normal flow at every width; JS behavior retained. |
| Material, gallery and comparison rows | Fit the material section and wrap gallery/financing cards where needed, preserving all content/order. Hide only an untrue swipe hint. |
| Guide pages | Reused shared header clearance and allowed the full business label to wrap inside the cover. Consent wording/behavior unchanged. |
| Existing page actions | Added the approved existing CTA to Blog/Legal/Privacy/Terms; token-paired colors retain AA. No-JS rail colors use their Look's paired tokens. |
| Primary peers | Form submits remain primary; existing telephone/financing peer actions become secondary without removing controls or changing wording. |
| Installed posters | Conversion hero uses its installed still; Financing ambient and both Promotions clips receive installed posters. Exactly two archived preview responses change by poster attributes only. |
| Existing policy routes | Conversion footer gains Privacy/Terms links to its existing routes, without new policy copy. |
| Exact recognition | Page-scoped guide consent/submit, workspace Call/inquiry, Constitution submit, article Call, screen-reader statuses, Camarillo permission and existing Legal disclosures. Positive/negative boundaries and frozen-detector lock proof remain required. See the recognition-entry table below. |
| Telephone hrefs | Workspace/blog correct US ten-digit `tel:+` links to `+1`; display text is unchanged. Only the approved workspace protected response changes. Local-format links are untouched. |
| Fictional fixtures | Existing fictional 555 fixtures receive the Sample designation. Real Robles remains checked under published-copy rules. |
| Legacy approval tests | Real browser QA and real staff-decision API supply prerequisites. Documented fallback tests assert missing-QA publication blocking and seed only test baselines, never passing QA or approval records. |
| Test compatibility | Preserve behavior checks while accounting for fictional business labels and waiting for actual publication completion instead of a fixed delay. |
| Capture readiness | Approved uniform wait for visible finite animations/transitions and two animation frames after image decoding. No product CSS, thresholds or image/hash tolerance change. |
| Equality-failure evidence | Retain both actual failed screenshots and per-image readiness/cache/context records before strict assertions; diagnostics do not change capture settings. Three diagnostic contract runs were accepted at 48/48 each. |

## Previous validation blocker — retained history

The approved financing wrap, exact status recognition and uniform readiness wait are implemented. The requested three main replays **each match 143/143 files**. A separate final run of `tests/review-packet-contract.mjs` still fails exact same-version file equality on the Services screenshot `screenshots/page-014-1440.png`, at `/s/sample-fictional-copper-kite-ventura-contract/services`. Its real QA captures reached **0 Fail**, but screenshot equality is an independent requirement and remains failed. The report/summary hashes also change because they include that screenshot hash.

| Capture | Bytes | SHA-256 |
|---|---:|---|
| First | 1,087,550 | `b238097182794ac701711a66c4ea4634e6e0478b454b1eecdafa4e3a89608dad` |
| Replay | 1,079,637 | `2da42f6cf9987b7658b111ec693d912b12f2d5e8c71ea57247ce994be1a2a4b1` |

The cause of this pair is **not established**. The preceding Services inspection found eager/decoded images, no hover, reduced motion, no transform and zero active CSS animations; those measurements do not prove that raster timing caused this new mismatch. The failed contract kept its two images in memory and did not export them before its equality assertion, so no pixel-diff claim is made for this pair. Further diagnosis needs both failed capture images and their readiness measurements preserved. No capture mode, normalization, hash/image tolerance, generic detector, 2px threshold, 60ms sample or per-state assertion has been changed.

Per Joe’s stop instruction, the remaining repository test processes were stopped. The final 102-command attempt has **3 passed, 3 interrupted, 96 not run**. The interrupted commands are Constitution, footer-policy and generation. The additional run has **11 passed, 1 interrupted, 2 not run**. Design-style rerun was interrupted; the later #028E packet/staff regressions were not reached after the contract failure. Prior passing runs are historical evidence, not substitutes for the missing final results.

[Exact failure and hashes](checks/final-contract-replay-failure.json) · [Failed command log](checks/final-review-contract.log) · [All three main replays](checks/three-exact-replays.json) · [Every final suite command and result](checks/final-command-results.md) · [Final validation summary](checks/final-validation-summary.json) · [Stopped repository processes](checks/final-validation-stop-processes.json). Earlier failed/interrupted attempts remain in [the earlier stop record](checks/suite-stop-state.json) and [pre-final attempt record](checks/attempts/round6-pre-final/state.json). No failed or incomplete command counts as passed.

## Latest approved follow-up

- Added the existing installed poster attributes to the Financing ambient and both Promotions clips. The exact byte proof restores the saved response by removing only those attributes: **0 protected HTML changes, exactly 2 approved archived preview changes**. Prior manifests were not overwritten; this ticket's archive manifest records the two approved hashes.
- Form submit remains primary. Financing's existing Get Financing Options summary and the contact section's existing telephone action now use secondary presentation. The preview comparison update is also secondary. Controls, wording, consent and behavior are retained. CSS also covers no-JS presentation.
- Confirmed the existing 1px, clipped, absolute spans are exposed `role=status` messages, with explicit or implicit polite semantics and no hidden ancestor. Exact page/selector/text/geometry recognition applies only to `Still image shown.`. All **104 boundary cases (16 positive, 88 negative)** and **16 secondary-action/AA states** pass; other clipped text still fails.
- The configured Constitution financing/promotions capture formerly had 21 failures; it now has **718 Pass / 16 Borderline / 0 Fail**. A later independent fixture, `promotions-display-015`, used the same fictional 555 data without its Sample designation. Only that test-local clone was marked `Sample Fictional QA Roofing Promotions`, under Joe's standing approval. Its failed run is retained. The full-suite rerun was interrupted at a later, separate financing-comparison scope blocker. No placeholder rule or publication assertion was weakened.

[Poster-only byte proof](checks/poster-approval-byte-proof.json) · [Approved archive manifest](approved-archived-responses.json) · [Original SR-status verification](checks/screen-reader-status-before.json) · [Status and secondary-action boundaries](checks/status-recognition.json) · [Fictional fixture record](checks/promotions-fixture-designation.json).

| Archived preview URL | Prior normalized SHA-256 | Approved new normalized SHA-256 |
|---|---|---|
| `/s/ambient-baseline-roofing/financing?preview=1` | `efe7d26a5403cb51b15562fa163d4058724d9e544e72ae8997af369d839022e3` | `58ab10dc27a708d528c9aae3c53bc2a07a039446e7ec3718e19ad1cf3b422e17` |
| `/s/ambient-baseline-roofing/promotions?preview=1` | `eb338f60d545eb039d0ee0c78975ed518f32ddbfa17682fa4406bf65a9f96dec` | `56d6d5a3ecc82fc1415506c1c31275833c037132e74e762a1dbd67f6eecc1dc4` |

### Latest before / after captures

These are actual 1440×900 and 390×844 viewport captures at 60ms after scrolling. Before uses the exact saved pre-fix HTML and pre-fix secondary presentation; after uses current output. [Capture record](checks/approved-followup-captures.json).

| Spot | 1440 before / after | 390 before / after |
|---|---|---|
| financing calculator | [Before](before/approved-financing-calculator-1440.png) / [After](after/approved-financing-calculator-1440.png) | [Before](before/approved-financing-calculator-390.png) / [After](after/approved-financing-calculator-390.png) |
| financing contact | [Before](before/approved-financing-contact-1440.png) / [After](after/approved-financing-contact-1440.png) | [Before](before/approved-financing-contact-390.png) / [After](after/approved-financing-contact-390.png) |
| promotions contact | [Before](before/approved-promotions-contact-1440.png) / [After](after/approved-promotions-contact-1440.png) | [Before](before/approved-promotions-contact-390.png) / [After](after/approved-promotions-contact-390.png) |
| financing ambient-poster | [Before](before/approved-financing-ambient-poster-1440.png) / [After](after/approved-financing-ambient-poster-1440.png) | [Before](before/approved-financing-ambient-poster-390.png) / [After](after/approved-financing-ambient-poster-390.png) |
| promotions ambient-poster | [Before](before/approved-promotions-ambient-poster-1440.png) / [After](after/approved-promotions-ambient-poster-1440.png) | [Before](before/approved-promotions-ambient-poster-390.png) / [After](after/approved-promotions-ambient-poster-390.png) |
| promotions scroll-poster | [Before](before/approved-promotions-scroll-poster-1440.png) / [After](after/approved-promotions-scroll-poster-1440.png) | [Before](before/approved-promotions-scroll-poster-390.png) / [After](after/approved-promotions-scroll-poster-390.png) |

## Prior-run gate results (historical; final rerun is in progress)

| Gate | Result | Evidence |
|---|---|---|
| Full 102-command run | Incomplete: 37 Pass / 2 Fail / 3 interrupted / 60 not run | [Every command](checks/accepted-command-results.md) |
| Financing-comparison recheck | Passed unchanged; initial failure retained | [Log](checks/accepted-financing-comparison-recheck.log) |
| Five Samples | 3,425 Pass / 70 open Borderline / 0 Fail; gate stays false | [Report](checks/qa-packets.json) |
| Three main replays | 143/143 exact files each | [Reports](checks/three-exact-replays.json) |
| Accepted #028E diagnostic contracts | 3 × 48/48 with exact equality | [Diagnosis](replay-determinism/README.md) |
| Platform / staff matrix | 162 + 15 states; 0 AA, keyboard, overflow and non-allowlisted console failures | [Platform](platform-matrix/after-platform.json), [staff](checks/qa-staff-browser.json) |
| Clearance | 32 JS-on + 16 no-JS + 24 additional legacy states; 0 intersections | [JS](checks/qa-polish-browser.json), [no-JS](checks/qa-polish-no-js.json), [legacy](checks/legacy-clearance.json) |
| Focused commands | 12/12 pass | [Results](round6-focused-checks.json) |
| Additional commands | 14/14 pass | [Results](additional-checks.json) |
| Uniqueness | 417 browser states pass; 0 contrast / overflow / page errors | [Log](checks/accepted-uniqueness-browser.log) |
| Robles / Constitution / Conversion real captures | All 0 Fail; Robles remains under published-copy rules | [Robles](checks/legacy-real-qa-after.json), [legacy](checks/legacy-round6-after.json) |
| Protected outputs | 279/279 + platform.css; 56 existing CSS files unchanged | [Proof](checks/accepted-protected-final.json) |
| Archived responses | 374/374 match approved manifests; only the approved href/poster deltas | [Proof](checks/sites-unchanged.log) |
| Design styles / final broad AA / later #028E regressions | Incomplete after the scope stop; no final pass claimed | [Stop summary](checks/accepted-validation-summary.json) |

The protected checks ran before the stopped suite reached its final rebuild. No product code was changed afterward. No fixture catalog substitution or final rebuild was started.

## Approved changes and reuse

The original Part 1 changes reserve the installed film's 16:9 frame, use cover without removing the house, reserve space for the desktop chapter rail, and separate the expertise-link arrow. Joe subsequently approved meaningful library alt descriptions, phone floating-action clearance, then clearance at every width, header tucking while protected content overlaps, and one existing `Get my price` action on Blog, Legal, Privacy and Terms pages. No clip or still was regenerated.

Reused: #028E packet capture, version/manifest hashes, private packet storage, dated live-review snapshot, approval records, staff screen and publication guard; #028B review filtering/full-source aggregates; #028D catalog/rights metadata; existing browser and regression matrices. `/platform.css` and all existing CSS files remain byte-identical. New platform rules are in token-only, `body.bv-platform`-scoped `/review-qa.css`; trade fixes are isolated in `/review-qa-polish.css`.

Library descriptions use catalog facts, with no contractor ownership or invented project claim. Explicit decorative media retains empty alt and presentation metadata. Floating actions/header use visibility without changing layout dimensions; the existing phone no-JS actions remain in normal flow. Form labels are included in clearance. Header/action tucking is Joe's explicit decision, not a gate exception.

[Every changed protected and archived output, with reasons](checks/protected-output-deltas.md) · [Before/after SHA-256 values](checks/protected-output-deltas.json). The normalizer removes only exact approved markup. CTA normalization derives the destination from the existing page home link and removes one exact action; it does not ignore arbitrary actions, copy, targets or attributes. [Boundary tests](checks/normalizer-boundaries.json).

## Automatic checks and binding

Capture runs every required page at 390, 768 and 1440. Every result stores page, width, selector/frame, measured value, threshold and actual screenshot evidence. The server requires all 15 page check keys at every width, plus both checks for every used clip. Reports and summaries include evidence hashes and are bound to content version, generation manifest and QA revision.

Any Fail blocks approval and publication. Every Borderline needs a staff decision with identity, UTC timestamp, version, manifest/report hashes, Accept/Reject and a required reason. A contractor owner cannot clear their own result, even if that account also has staff access. Publication still requires the separate #028E approval. Controlled edits invalidate both; live reviews remain outside the hash. The packet's dated review snapshot remains evidence only and does not freeze the feed. The UI says **AI review not connected.**

Existing financing rules remain unchanged: a calculator may link to the captured Legal disclosure. Service-detail footers retain their existing Legal hub link. No new legal obligation is invented. Additional legal-rule proposals: none.

Text-overlap measurements use actual painted glyph extents from DOM Range and Canvas font metrics, rather than unused font ascender/descender space. The 2px threshold is unchanged; a new truly overlapping-text negative confirms detection. An offscreen skip link is clipped to the viewport for intersection measurement. No CSS or timing tolerance is loosened.

## Five Sample packet results

| Sample | Pass | Borderline | Fail |
|---|---:|---:|---:|
| sample-fictional-copper-kite-ventura | 711 | 15 | 0 |
| sample-fictional-blue-orchard-pasadena | 711 | 15 | 0 |
| sample-fictional-paper-lantern-temecula | 667 | 14 | 0 |
| sample-fictional-cobalt-heron-irvine | 668 | 13 | 0 |
| sample-fictional-ochre-willow-riverside | 668 | 13 | 0 |

Accessible company-name ellipsis accounts for 67 Borderlines; three Roofing transformation clips cross the histogram uncertainty band. These require human review, remain open and block approval.

## Deterministic video calibration

The same browser capture and detector assess 14 approved hero clips and 3 section clips. All **17/17 Pass**. The synthetic morph uses two existing house stills and FFmpeg; it **Fails** and is never published. The earlier rejected takes were not established morphing negatives, so they are not used as such.

| Signal | Threshold |
|---|---|
| Horizontal overflow | More than 1px fails |
| Text/floating overlap | More than 2px; text also intersects >30% of a painted line |
| Letterboxing | More than 2% unused frame area fails |
| SSIM, central 80%, 96×64 grayscale, 8×8 windows | Pass ≥−0.05; Borderline −0.15 to −0.05; Fail <−0.15 |
| RGB 4×4×4 histogram total variation | Pass ≤0.65; Borderline 0.65–0.80; Fail >0.80 |
| Temporal interpolation residual | If endpoint SSIM <0.5 and histogram distance >0.1: residual <0.12 fails; 0.12–0.20 is Borderline |

Pairwise similarity alone missed the cross-dissolve, so the detector also tests whether all three intermediate frames match a pixelwise interpolation of different endpoints. Approved residuals range from 0.394893 upward; the synthetic morph is 0.028026. These are deterministic change signals, not an AI semantic guarantee. Five samples cannot prove every intervening frame; uncertainty goes to human review. [All calibration measurements and frames](checks/video-calibration-browser.json).

## Negative and workflow proof

[QA enforcement](checks/qa-contract.json): 76 assertions using actual browser reports; all 12 negative fixtures block approval/publication, stay HTTP 404 publicly and cannot be accepted as Borderline. Changes invalidate QA; live-review updates do not. Contractor/staff-owner decisions and report tampering are denied. [Browser negatives](checks/negative-browser.json): 37 positive/negative measurements, including real letterboxing. The synthetic morph is covered by calibration. All provider responses used in tests are local mocks.

### Registered exact recognition entries

| Entry / page type | Exact selector | Positive crop | Negative boundaries |
|---|---|---|---|
| Guide-download consent; `.ebook-page` and exact guide path | `#ebook-request input[type=checkbox][name=consent]` with required, unticked, visible, enabled control and unchanged exact wording | [Consent](recognition/guide-consent-390.png) | 32 expected Fail measurements across four widths |
| Guide-download primary; same exact page type | `#ebook-request button.eg-button[type=submit]`, enabled/visible, exact “Save request & open the PDF” label | [Submit](recognition/guide-primary-390.png) | 24 expected Fail measurements across four widths |
| Public workspace page; `/s/:slug/pages/:pageSlug` with `body > main.standalone.public-document` | `main.public-document > a.primary[href^="tel:"]`, visible/in viewport, nonzero size, valid phone href, existing Call label | [390](recognition/workspace-call-390.png) · [1440](recognition/workspace-call-1440.png) | **60 expected Fail measurements**, including missing, HTML/CSS hidden, zero-size, offscreen, missing/empty/invalid href, duplicate action, nested link and wrong page type |
| Public workspace inquiry form; `/s/:slug/forms/:formId` with `body > main.standalone.public-document > form[data-public-form]` | `main.public-document > form[data-public-form] > button.primary:not([type])`, real default submit type, visible/in viewport, nonzero, enabled, exact “Send inquiry” label | [390](recognition/workspace-form-submit-390.png) · [1440](recognition/workspace-form-submit-1440.png) | [4 positives and 64 negative boundaries](checks/workspace-form-recognition.json): missing, hidden/hidden ancestor, zero-size, offscreen, disabled, not submit, outside form, duplicate/second generic primary, wrong page/main/form type and nested impostor. All **4 positive / 64 negative** cases pass. |
| Constitution home, `/s/:slug`, `.theme-clean` with its existing final contact section | `main > section.public-contact#contact > form#lead-form > button.public-button:not([type])`; visible, enabled default submit, exact Send request label | [390](recognition/constitution-final-positive-390.png) | [4 positive / 48 negative](checks/legacy-recognition.json): missing, hidden, zero/offscreen, disabled, wrong type/parent/label/page and a second primary |
| Blog article, `/s/:slug/blog/:article` with `body > main > article.blog-article` | `body > main > article.blog-article > aside.blog-cta > a[href^="tel:"]`; visible nonzero valid phone link, exact Call the team label | [390](recognition/article-call-positive-390.png) | [4 positive / 56 negative](checks/legacy-recognition.json): corresponding action boundaries plus missing/empty href |
| Conversion home, `/s/:slug`, `body.conversion-site` | `body.conversion-site > footer.studio-footer[data-footer-settings="1"]`; existing Privacy/Terms destinations required | [390](recognition/conversion-footer-positive-390.png) | [4 positive / 32 negative](checks/legacy-recognition.json): missing footer/link, wrong policy destination, page type, marker and nesting |


The Call link is on a public **document page**, whose main section has no inquiry form. Send inquiry is on a separate public **form page**, whose main section has no Call primary. Actual-render fixtures assert this separation at four widths and one primary on each page. No button, label, form field, consent wording, behavior or layout was changed. Joe approved one complete retry for this existing form button; this change includes the entry, fixtures, lock proof and this row together. [Form test log](checks/workspace-form-recognition.log).

[Workspace recognition results](checks/workspace-recognition.json) · [Guide results](checks/guide-page-browser.json) · [Lock proof](checks/recognition-lock.json). Four workspace positives pass. Removing only registered entries restores the round-4 detector SHA-256 `8e8d6666c77767a07fd1b1156403ea5b11cdf04c762084264063cbdb36732ee8`. Generic checks, floating detector, 2px threshold, 60ms sample and per-state assertion remain unchanged.

## Approved follow-up: posters, secondary peers and screen-reader status

Joe approved all three scopes. The browser pre-check confirms the exact two status spans have role=status, 1px width/height, absolute positioning, overflow:hidden and clip-path:inset(50%), with no aria-hidden. [Proof](checks/screen-reader-status-before.json). Only those exact Roofing financing/promotions selectors and page types, exact Still image shown. text, semantics and CSS qualify. Wrong page/trade/role/hook/class/text/geometry/clip/position/live setting/parent remain negative fixtures. Removing only registered entries restores the round-4 detector hash.

| Page type | Exact status selector | Evidence |
|---|---|---|
| Roofing financing, /s/:slug/financing | #roofing-planning.financing-chapter > .planning-composition > figure.planning-photo[data-ambient-frame] > span.planning-sr[data-ambient-status][role="status"][aria-live="polite"] | [Cases and crops](checks/status-recognition.json) |
| Roofing promotions, /s/:slug/promotions | #roofing-home-planning.promo-ambient > figure.promo-ambient-photo[data-ambient-frame] > span.promo-media-sr[data-ambient-status][role="status"] (implicit polite live status) | [Cases and crops](checks/status-recognition.json) |

Existing peer actions get transparent, underlined secondary styling via the isolated polish stylesheet in JS and no-JS modes. The client applies the existing secondary presentation class; the generic primary detector is unchanged. Calculate my payment and each contact-form submit remain primary. The preview-only Update comparisons peer gets the same secondary treatment. No action, wording, consent, form field, route or layout size changes. Archive HTML therefore changes only by the approved poster attributes.

## Round 6 phone decision — both phone fixes and recognition implemented

Joe approved the one protected workspace response change on 2026-09-29. `src/workspace.js` now prefixes US 10-digit phone targets with country code 1, preserving already-qualified numbers and displayed labels. Five actual-generator unit cases pass: plain 10 digits, punctuation, +1, 11 digits beginning 1, and an existing international country code. [Unit results](checks/workspace-phone-links.json) · [Log](checks/workspace-phone-links.log).

**Byte proof was completed before updating the expected protected manifest.** The response `/s/platform-look-baseline-roofing-current/pages/look-baseline` changed from 653 to 654 bytes: only ASCII `1` was inserted at byte offset 547. Its href changed from `tel:+8055550140` to `tel:+18055550140`; every other byte and all displayed text are identical. **Joe approved 2026-09-29.**

- Old SHA-256: `1ffa41cae0d5cd99a2c0e8713567337c7e98a82cce1d8d2bd61038f984d673e0`
- New SHA-256: `6f18942e6e19ec3e58e3d0dbcac1fdb047ac42d0d172a30f81b483425079dd06`
- Reason: correct the US country code in the existing public workspace Call target.

[Exact byte proof](checks/workspace-phone-byte-proof.json) · [Ticket-local approved manifest](approved-protected-sites.json). Previous ticket baselines remain untouched. The first comparison against the old manifest failed on exactly this one authorized response; that run is not counted as a pass. [Pre-update log](checks/round6-before-rebaseline.log). The protected checker still checks 279 hashes plus platform.css separately; no other expected hash was altered.

### Latest approved legacy validation

Both real captures now have **0 Fail**: Constitution 624 Pass / 14 Borderline; Conversion 622 Pass / 12 Borderline. Existing Robles remains non-Sample: 1,086 Pass / 2 Borderline / 0 Fail, including every published-copy check ([proof](checks/robles-published-copy-proof.json)). These are separate fixtures, not decisions on the five Sample packets.

The exact recognition suite passes **12 positive and 136 negative cases**. The original **32 JS-on and 16 no-JS states** pass with 0 intersections, and **24 additional legacy states** (four widths, normal/reduced/no-JS) also pass at the unchanged 60ms sample and 2px threshold. The extra conversion phone action bar was tucked under the pre-approved rule after a real 67px media overlap; no size, position, link or text changed. [Legacy clearance](checks/legacy-clearance.json).

| Approved legacy fix | Before | After |
|---|---|---|
| Constitution mobile Call | [390 overlap](legacy-round6-before/constitution/qa-crops/page-001-390-floating.png) | [390 at 687](after/round6-constitution-reduced-390-15.png); all sample positions in clearance JSON |
| Conversion header and phone action | [1440](legacy-round6-before/conversion/qa-crops/page-001-1440-floating.png) / [390](legacy-round6-before/conversion/qa-crops/page-001-390-floating.png) | Every after capture listed in [clearance JSON](checks/legacy-clearance.json) |
| Conversion installed hero poster | [Before page](legacy-round6-before/conversion/pages/page-001.html) | [After page](legacy-round6-after/conversion/pages/page-001.html), installed /assets/build-films/roofing-opening.webp |
| Existing final/article actions and policy links | Original packet HTML and article-before captures in recognition/ | [148 boundary measurements and crops](checks/legacy-recognition.json) |

Full-suite and packet contract reruns are in progress; this is not yet a completed ticket. 0 credits, 0 real provider calls.

## Approved rail and transient chat fixes — verified

The chapter rail now uses visibility-only clearance, retaining every link, label, position and layout dimension. It remains visible while a link has keyboard focus; hidden links cannot receive Tab focus. The same **2px** threshold remains. The clearance code checks entering content before it becomes opaque, updates immediately on scroll and tracks transition frames. Floating actions use a 64px proactive lookahead while scrolling, as Joe allowed; the actual intersection threshold and **60ms sampling point are unchanged**. Settled diagnostics are never passes.

**32/32 states pass** (Current/Bold/Fresh/Classic × 1440/1280/768/390 × normal/reduced motion), covering **480 scroll positions with 0 intersections** and **16 successful rail focus checks**. [Report](checks/qa-polish-browser.json) · [Log](checks/qa-polish-browser.log).

| Fix | Before | After |
|---|---|---|
| Rail over craft/detail image | [Before](before/rail-detail-1280.png) | [After](after/rail-detail-1280.png) |
| Rail over following still | [Before](before/rail-still-1280.png) | [After](after/rail-still-1280.png) |
| Chat over form | [Before](before/chat-form-1280.png) | [After](after/chat-form-1280.png) |

Rail before captures are from the actual prior failing run. The chat before capture is a clearly labeled separate reproduction using the accepted `fdcd459` clearance script against the same isolated fixture; the after uses current code. Both are sampled at 60ms. [Capture record](checks/clearance-captures.json). The earlier transient measurement was 166.47 × 59px; the final 60ms matrix has zero intersections.

## Review-rating-filter decision — implemented

Used Joe's **missing-QA assertion fallback**, not synthetic QA. The test's old import performed unrelated website/project publication during bootstrap. A dedicated fixture now asserts that publication is blocked without QA, then seeds a previously published baseline strictly as test data for draft/public review isolation. It creates no approval record or QA report. Every rating-filter, unrated exclusion, zero-after-filter, absent-default and full-source aggregate assertion is unchanged: **62/62 pass**, with 15 locally mocked provider responses and **0 actual provider calls**. The five-packet regression and 76 enforcement assertions retain the real approve/publish path. [Result](variants/checks/review-rating-filter.json).

## Round 4 approved fixes — verified

Joe approved the gallery wrap and no-JS navigation flow. `#gallery .gallery-feed` now wraps at the existing phone breakpoint, retaining every image, caption and order. Images use their natural aspect ratio, with no cropping or truncation. Wider layouts are unchanged. With JS disabled, chapter/story navigation is a normal-flow link group at every width. The existing synchronous `site-nav-js` marker prevents this fallback from flashing during JS startup; no new script or route is needed.

**32/32 JS-on normal/reduced states and 16/16 no-JS states pass**, across four Looks and 1440/1280/768/390. Every state retains its immediate zero-intersection assertion. **480 JS-on and 240 no-JS scroll samples have 0 intersections**, with 16 successful JS-on rail-focus checks. [JS report](checks/qa-polish-browser.json) · [No-JS report](checks/qa-polish-no-js.json). The detector file's SHA-256 and original per-state assertion are unchanged; **2px and 60ms are unchanged**. Neither rejected change was retried. [Frozen-gate proof](checks/round4-gate-unchanged.json).

The ancillary film/rail geometry assertion still checks the same horizontal gap for fixed JS-on rails. For the approved no-JS layout it additionally asserts `position: static`, while the unchanged clearance detector checks actual intersections at every sampled position. No failed state is deferred, skipped or counted as passed.

The real unchanged Robles fixture capture is now **0 Fail / 2 Borderline / 1,086 Pass**. Both video Borderlines remain unresolved in this proof packet. [Real capture](checks/legacy-real-qa-after.json) · [Log](checks/legacy-real-qa-after.log). The material section fits all four widths with 0px overflow, all five adjacent-label thumbnails remain explicitly decorative, and the story rail/mobile dock clear protected content.

### The reported material screenshot was a real overlap

`after/round3-material-390.png` was sampled at 60ms and did show a defect. The generic clearance detector excludes explicitly decorative thumbnails, so it did not catch a dock over the fifth material button. It also did not compare two floating actions. The reproduced measurements were **167.5×70.1875px dock/card**, **222.0625×51px dock/chat**, and **36.0625×51px chat/card**. The existing detector was not changed.

The product clearance now protects each material button as a whole. When closed chat intersects a visible dock, chat tucks away with visibility only. The dock also tucks away when it intersects a material card. A separate regression supplements the unchanged gate with action/action and action/material-button checks using the same **2px / 60ms** rules. Every after position has **0 intersections**. [Measurements](checks/round4-legacy-captures.json) · [Log](checks/round4-legacy-captures.log).

| Round 4 spot | Before | After |
|---|---|---|
| Material card / dock / chat, 390 | [Before](before/round4-material-390.png) | [After](after/round4-material-390.png) |
| Gallery, 390 | [Before](before/round4-gallery-390.png) | [After](after/round4-gallery-390.png) |
| No-JS rail over media, 1280 | [Before](before/round4-no-js-1280.png) | [After](after/round4-no-js-1280.png) |
| No-JS rail over media, 1440 | [Before](before/round4-no-js-1440.png) | [After](after/round4-no-js-1440.png) |
| No-JS navigation at top, 1280 | [Before](before/round4-no-js-top-1280.png) | [After](after/round4-no-js-top-1280.png) |
| No-JS navigation at top, 1440 | [Before](before/round4-no-js-top-1440.png) | [After](after/round4-no-js-top-1440.png) |

Before captures reproduce the saved round-3 packet with its exact pre-round-4 polish files; prior evidence is untouched. After captures use the current files. [No-JS before/after assertions](checks/round4-no-js-captures.json). Saved source backups under `round4-baseline/` are excluded from any future commit.

Round 3 material, thumbnail and navigation captures remain in [their measurement record](checks/round3-legacy-captures.json), covering the original seven measurements at all four widths. Existing CSS files remain byte-identical; only the isolated polish stylesheet/script implement these changes.

## Round 5 — approved guide fixes verified

The enabled guide response now reuses `homeownerPolish()` and the existing shared visibility-only header clearance. The isolated stylesheet lets the cover grow around its complete caption while retaining its original minimum proportions. No existing CSS, consent wording, request behavior, routes or data changed.

Exact recognition applies only to `body.ebook-page` at `/s/:slug/resources/before-you-decide-on-your-roof`, and only to `#ebook-request`. Its existing consent must be visible, required, initially unticked, enabled and use the exact current guide wording. Its existing submit must be visible, enabled and say “Save request & open the PDF.” The estimator/contact permission regex and generic primary selector remain byte-identical. There is no new marketing, SMS or email requirement.

**4 widths pass** (1440, 1280, 768, 390), with **32 clearance samples at 60ms and 0 intersections**, including scrollY 818 at 1440 and 998 at 390. The longest Sample name, “Sample Fictional Paper Lantern Roofing,” is complete at every width with **0px clipping**. All **56 negative checks** (14 cases × 4 widths) Fail as required: missing/pre-ticked/non-required/hidden/disabled/wrong-wording/non-guide consent; missing/hidden/disabled/wrong-wording submit; a second primary. Hidden controls are checked both through HTML and CSS. [Measurements](checks/guide-page-browser.json) · [Log](checks/guide-page-browser.log).

| Guide fix | Before | After |
|---|---|---|
| Header/media, 1440 at scrollY 818 | [Before](before/round5-guide-header-1440.png) | [After](after/round5-guide-header-1440.png) |
| Header/media, 390 at scrollY 998 | [Before](before/round5-guide-header-390.png) | [After](after/round5-guide-header-390.png) |
| Full cover business label, 768 | [Before](before/round5-guide-cover-768.png) | [After](after/round5-guide-cover-768.png) |

The before HTML is preserved separately at [round5-guide.html](before/round5-guide.html), with its original capture/version data. The longest Sample name is applied identically in before/after cover tests. The real contract capture confirms **0 Fail on the guide**: 44 Pass and one existing accessible company-name ellipsis Borderline in the shared phone header (not the cover). [Actual guide results](checks/round5-contract-blocker.json).

[Detector lock proof](checks/round5-gate-lock.json): removing only the exact approved guide-recognition additions restores the round-4 detector SHA-256 `8e8d6666c77767a07fd1b1156403ea5b11cdf04c762084264063cbdb36732ee8`. Generic checks, floating detector, 2px threshold, 60ms sample and per-state assertion are unchanged. [Exact guide output comparison](checks/round5-guide-output-delta.json) passes using the existing exact normalizer, with no normalization expansion.

## Additional approved before / after

| Spot | Before | After | Measurements |
|---|---|---|---|
| Meaningful library hero alt | [Before](before/blocker-empty-hero-alt-390.png) | [After](after/blocker-empty-hero-alt-390.png) | [Record](checks/confirmed-blockers.json) |
| Phone service-image clearance | [Before](before/blocker-floating-actions-cover-service-image-390.png) | [After](after/blocker-floating-actions-cover-service-image-390.png) | Same record; 0 final intersections |
| Desktop chat/media | [Before](before/remaining-desktop-chat-media.png) | [After](after/remaining-desktop-chat-media.png) | [Hit tests](checks/remaining-findings.json) |
| Tablet chat/media | [Before](before/remaining-tablet-chat-media.png) | [After](after/remaining-tablet-chat-media.png) | Same record |
| Phone header/media | [Before](before/remaining-phone-sticky-header-media.png) | [After](after/remaining-phone-sticky-header-media.png) | Same record |
| Blog primary | [Before](before/remaining-blog-primary.png) | [After](after/remaining-blog-primary.png) | 1 primary |
| Legal primary | [Before](before/remaining-legal-primary.png) | [After](after/remaining-legal-primary.png) | 1 primary |
| Privacy primary | [Before](before/remaining-privacy-primary.png) | [After](after/remaining-privacy-primary.png) | 1 primary |
| Terms primary | [Before](before/remaining-terms-primary.png) | [After](after/remaining-terms-primary.png) | 1 primary |

The additional before captures are a separate reproduction of accepted #028E evidence with its original floating-action script; old evidence is untouched.

## Part 1 before / after

Before captures were taken before product edits. Five existing fictional fixtures were captured at 1440 and 390 (10 states before and 10 after). After captures also include the reduced-motion poster. The installed clips are unchanged.

| Fixture | Width | Hero / arrow | Section film / rail | Reduced motion |
|---|---:|---|---|---|
| sample-fictional-copper-kite-ventura | 1440 | [Before](before/sample-fictional-copper-kite-ventura-1440-hero.png) / [After](after/sample-fictional-copper-kite-ventura-1440-hero.png) | [Before](before/sample-fictional-copper-kite-ventura-1440-section-video.png) / [After](after/sample-fictional-copper-kite-ventura-1440-section-video.png) | [Poster](after/sample-fictional-copper-kite-ventura-1440-section-video-reduced.png) |
| sample-fictional-copper-kite-ventura | 390 | [Before](before/sample-fictional-copper-kite-ventura-390-hero.png) / [After](after/sample-fictional-copper-kite-ventura-390-hero.png) | [Before](before/sample-fictional-copper-kite-ventura-390-section-video.png) / [After](after/sample-fictional-copper-kite-ventura-390-section-video.png) | [Poster](after/sample-fictional-copper-kite-ventura-390-section-video-reduced.png) |
| sample-fictional-blue-orchard-pasadena | 1440 | [Before](before/sample-fictional-blue-orchard-pasadena-1440-hero.png) / [After](after/sample-fictional-blue-orchard-pasadena-1440-hero.png) | [Before](before/sample-fictional-blue-orchard-pasadena-1440-section-video.png) / [After](after/sample-fictional-blue-orchard-pasadena-1440-section-video.png) | [Poster](after/sample-fictional-blue-orchard-pasadena-1440-section-video-reduced.png) |
| sample-fictional-blue-orchard-pasadena | 390 | [Before](before/sample-fictional-blue-orchard-pasadena-390-hero.png) / [After](after/sample-fictional-blue-orchard-pasadena-390-hero.png) | [Before](before/sample-fictional-blue-orchard-pasadena-390-section-video.png) / [After](after/sample-fictional-blue-orchard-pasadena-390-section-video.png) | [Poster](after/sample-fictional-blue-orchard-pasadena-390-section-video-reduced.png) |
| sample-fictional-paper-lantern-temecula | 1440 | [Before](before/sample-fictional-paper-lantern-temecula-1440-hero.png) / [After](after/sample-fictional-paper-lantern-temecula-1440-hero.png) | [Before](before/sample-fictional-paper-lantern-temecula-1440-section-video.png) / [After](after/sample-fictional-paper-lantern-temecula-1440-section-video.png) | [Poster](after/sample-fictional-paper-lantern-temecula-1440-section-video-reduced.png) |
| sample-fictional-paper-lantern-temecula | 390 | [Before](before/sample-fictional-paper-lantern-temecula-390-hero.png) / [After](after/sample-fictional-paper-lantern-temecula-390-hero.png) | [Before](before/sample-fictional-paper-lantern-temecula-390-section-video.png) / [After](after/sample-fictional-paper-lantern-temecula-390-section-video.png) | [Poster](after/sample-fictional-paper-lantern-temecula-390-section-video-reduced.png) |
| sample-fictional-cobalt-heron-irvine | 1440 | [Before](before/sample-fictional-cobalt-heron-irvine-1440-hero.png) / [After](after/sample-fictional-cobalt-heron-irvine-1440-hero.png) | [Before](before/sample-fictional-cobalt-heron-irvine-1440-section-video.png) / [After](after/sample-fictional-cobalt-heron-irvine-1440-section-video.png) | [Poster](after/sample-fictional-cobalt-heron-irvine-1440-section-video-reduced.png) |
| sample-fictional-cobalt-heron-irvine | 390 | [Before](before/sample-fictional-cobalt-heron-irvine-390-hero.png) / [After](after/sample-fictional-cobalt-heron-irvine-390-hero.png) | [Before](before/sample-fictional-cobalt-heron-irvine-390-section-video.png) / [After](after/sample-fictional-cobalt-heron-irvine-390-section-video.png) | [Poster](after/sample-fictional-cobalt-heron-irvine-390-section-video-reduced.png) |
| sample-fictional-ochre-willow-riverside | 1440 | [Before](before/sample-fictional-ochre-willow-riverside-1440-hero.png) / [After](after/sample-fictional-ochre-willow-riverside-1440-hero.png) | [Before](before/sample-fictional-ochre-willow-riverside-1440-section-video.png) / [After](after/sample-fictional-ochre-willow-riverside-1440-section-video.png) | [Poster](after/sample-fictional-ochre-willow-riverside-1440-section-video-reduced.png) |
| sample-fictional-ochre-willow-riverside | 390 | [Before](before/sample-fictional-ochre-willow-riverside-390-hero.png) / [After](after/sample-fictional-ochre-willow-riverside-390-hero.png) | [Before](before/sample-fictional-ochre-willow-riverside-390-section-video.png) / [After](after/sample-fictional-ochre-willow-riverside-390-section-video.png) | [Poster](after/sample-fictional-ochre-willow-riverside-390-section-video-reduced.png) |

## Legacy helper migration and preservation

The shared helper obtains an actual browser packet, requires 0 Fail, records fictional test Borderline decisions through the real staff API, and then obtains real staff approval. No synthetic passing QA is created. Module bootstrap uses the approved missing-QA assertion followed by test-data seeding only, with no QA/approval record. [Every affected test and reason](checks/legacy-fallback-tests.json). Successful publication behavior still goes through real QA. Robles remains non-Sample and is audited under the real published-copy rule.

Evidence writes from old suites are redirected into this ticket. Builds are deferred while capture jobs need the current assets; every deferred build still must run and succeed before the 102-command suite can pass. An initial platform audit reached all 162 states but failed writing a missing report directory; that run was not counted. The harness now creates its output directory, and the complete rerun passed unchanged assertions.

[Every approved protected/archive delta](checks/protected-output-deltas.md) · [Exact normalizer boundaries](checks/normalizer-boundaries.json). The only protected expected hash update is the approved workspace phone href recorded above; the only archived expected hash updates are the two poster responses. Generic normalization, CSS/timing tolerances and frozen detector rules were not loosened.

The Domain flow block and #033I/#033V/#033T/#028G remain untouched. `.preserve/`, `round4-baseline/`, other baseline backups, downloaded executables, old packet versions and unrelated dirty evidence remain outside the commit. No OneDrive or unrelated app operation was performed.

## Command results

The live full-suite record is [full-checks.json](full-checks.json), additional variant/media commands are [additional-checks.json](additional-checks.json), and the focused gates are [focused-checks.json](focused-checks.json). Final command-by-command results will replace this pending state after every required command finishes. No failed or incomplete attempt is counted as passed.


## Exact Camarillo permission recognition

The existing Camarillo form is visible, required and initially unticked at all four widths. Its unchanged wording is “Please respond to this Camarillo roofing inquiry using my details.” Joe's standing exact-recognition approval applies; no form, copy, consent behavior, layout or generic check changes. The initial bundle encountered a local UTF-8 README decoding error after saving the entry, fixtures and lock metadata; this documentation repair completes that same bundle before validation. No automatic-review rejection occurred.

| Page type | Exact selector and conditions | Before / after crop | Negative boundaries |
|---|---|---|---|
| Roofing Camarillo city page only: `/s/:slug/areas/camarillo`, `body.core-page.rc-page[data-core-page="areas"][data-trade="Roofing"]` | `main#main > section.rc-inquiry#city-inquiry > form#lead-form[data-city="Camarillo"] > label.core-consent > input[name=consent][type=checkbox]`; exact existing wording; required, unticked/default-unticked, enabled, visible, nonzero, in normal document bounds | [Before](before/camarillo-consent-390.png) / [After](after/camarillo-consent-positive-390.png) | [4 positive / 80 negative cases](checks/camarillo-consent-recognition.json): missing, checked/default-checked, not required, hidden control/label, aria-hidden, zero-size, offscreen, disabled, wrong name/type/wording/parent/form/page/trade/city/body/marker. Must all pass their expected result. |

[Existing-control verification](checks/camarillo-consent-before.json) · [Frozen source lock](checks/recognition-lock.json). Removing only registered exact entries restores round-4 SHA-256 `8e8d6666c77767a07fd1b1156403ea5b11cdf04c762084264063cbdb36732ee8`; 2px, 60ms and per-state assertions remain unchanged.

### Fictional-name test compatibility

The ebook and financing-state regressions formerly rejected the word `Sample` anywhere in a published response, including the newly required fictional business name. Each assertion now excludes only its exact fixture name before performing the unchanged Sample/unsupported-claim scan. Sample badges, example-payment controls, other Sample text and unsupported approval claims still fail. No product output or placeholder detector changed. The initial ebook failure is retained; it is not counted as a pass.

### Final clearance timing verification

The unchanged 60ms sampling found transient legacy header/chat overlap because a requestAnimationFrame callback could arrive late. The existing visibility-only update now also schedules a 16ms timer during the same activity window. The detector, 2px threshold, 64px lookahead, sampling and focus rules are unchanged. Current source passes 24 legacy states, 32 JS-on states and 16 no-JS states with 0 intersections. [24-state log](checks/final-legacy-clearance.log), [32-state log](checks/final-polish-js.log), [16-state log](checks/final-polish-no-js.log).

### Protected output comparison

After documenting the blocker, the protected-output checks pass again: **279/279 protected hashes plus platform.css, 56/56 existing CSS files, and 374/374 archived responses**, against only the explicitly approved exact changes. The Domain flow, #033I, #033V, #033T and #028G blocks remain byte-identical; the index is empty. [Protected/archive log](checks/stop-state-sites.log), [preservation log](checks/stop-state-preservation.log), [detector lock](checks/stop-state-detector-lock.log).

## Joe-approved financing follow-up — focused verification passed

The service-page financing cards use a wrapping grid in the isolated polish stylesheet. A fitting 1440px row retains its geometry; phone uses one column and larger containers use as many 250px-minimum columns as fit. All card text, values, lender names, links and order remain. Only the now-untrue swipe hint is visibility-hidden when rows wrap. No carousel arrows exist in this markup; scroll snapping is removed. The original CSS files are untouched. Before/after and exact card/keyboard-order checks: `tests/automatic-qa-finance-cards.mjs`.

| Recognition entry | Exact page and selector | Evidence | Boundaries |
|---|---|---|---|
| Existing financing screen-reader status | `/s/:slug/services/:service`, `body.service-detail[data-trade]`; `main > section.tp-section.tp-finance#financing > div.tp-shell > div.tp-plan-comparison[data-service-finance][data-finance-config] > p.tp-sr-only[data-finance-status][role=status][aria-live=polite]`; exact text `Enter a valid cost.`, absolute clipped 1px box | [Original verification](checks/finance-comparison-blocker.json), [390 crop](finance-comparison-blocker/390.png) | Positive plus wrong page/body/role/hook/class/text/geometry/clip/position/live semantics/section/parent/config/nested-content tests; 60 boundary cases pass. Removing only registry entries restores the round-4 hash. |

Capture readiness now waits for visible CSS animations/transitions to finish or settle and then two animation frames before every packet screenshot/crop/frame. It changes no CSS, animation state, screenshot mode, threshold, sample or per-state assertion. A non-settling animation times out as an error rather than being silently accepted. Exact replay must match all 143 files on each of three runs.

### Approved wrap results

`automatic-qa-finance-cards.mjs` passes **8 layout states and 60 exact-status cases (4 positive, 56 negative)**. The 1440px card rectangles are identical before/after; all card text, values, links and order match at every width, with JS on and off. The frozen overflow check passes. [Measurements](checks/finance-cards.json), [log](checks/finance-cards.log), [detector lock](checks/finance-status-lock.log).

| Wrapped component | 390 before / after | 768 before / after |
|---|---|---|
| Service financing `.tp-plan-cards`; every card retained, only the untrue swipe hint hidden | [Before](before/finance-cards-390-js.png) / [After](after/finance-cards-390-js.png) | [Before](before/finance-cards-768-js.png) / [After](after/finance-cards-768-js.png) |

The Copper Kite service cards declare `zoom_overlay` and the original images use `loading=lazy`. Capture makes them eager and awaits decoding. The inspected capture state has `sm-ready`, no hover, reduced motion, `transform:none`, opacity 1 and **zero running CSS animations/transitions**. Thus an active zoom/fade/reveal or an undecoded image is not demonstrated as the cause; image-only browser raster readiness remains under investigation. No product style or capture mode changed. [Observed effect state](checks/services-readiness-inspection.json). The shared readiness helper passes visible animation/transition, hidden animation and already-settled page checks without CSS mutation: [tests](checks/capture-readiness.json).

### Current replay and audit results

All **three exact replays match 143/143 files**, preserving the dated review snapshot. [All three results](checks/three-exact-replays.json). The required three-run test passes, but the separate final contract replay still fails as documented above. An active hover/zoom/fade was ruled out in the captured state; the browser’s internal raster timing cause was not conclusively isolated. No screenshot mode, product CSS effect, normalization, tolerance or detector threshold was changed.

The latest 162-state platform matrix, 15 QA staff states and all 12 focused commands pass. The 17 approved video clips pass calibration and the existing synthetic house morph fails as intended. The complete 102-command suite was stopped at the contract blocker; only three commands completed in this final attempt.

## Existing Legal-page policy recognition — standing round-6 approval

The footer-policy regression exposed a recognition gap: `src/core-site-pages.js` already renders the reviewed license and disclosure on `/legal`, and the existing regression explicitly forbids duplicating them in the footer. No product markup, policy wording, layout or protected response changes. Capture now measures the existing visible Legal paragraphs at each width and stores crops; a missing, hidden, clipped, wrong-site, wrong-width or mismatched fact still fails. Only the exact same-site Legal link in the existing shared footer can reference that measured evidence. Generic checks remain unchanged after removing the registered entries. The local footer-policy fixture is explicitly designated Sample Fictional; its existing assertions are unchanged.

| Page type | Exact recognition | Evidence and negative boundaries |
|---|---|---|
| `/s/:slug/legal`, `body.core-page[data-core-page="legal"][data-trade]` | `main#main > section.core-legal > section > h2` and direct `p`, headings `License` / `Promotions and Financing`; exact saved license and disclosure, visibly rendered at the current width | [Measurements and crops](checks/legal-policy-recognition.json): missing, hidden, zero-size, offscreen, clipped, wrong text/heading/page/body/kind/trade/parent all fail |
| Existing enumerated public site page types with shared studio footer, or service-detail footer | `body > footer.studio-footer[data-footer-settings="1"] > div.studio-footer-bottom > nav[aria-label="Legal"] > a[href]`; service-only `body.service-detail[data-trade] > footer.sd-footer > nav[aria-label="Footer"] > a[href]`; exact `Legal` label and same-origin `/s/:slug/legal` destination | [Measurements and crops](checks/legal-policy-recognition.json): missing/hidden/zero/offscreen link, wrong/empty/external href, wrong label/parent/page, missing or wrong evidence, and failed measured facts all fail. [Detector lock](checks/recognition-lock.json) |

All 232 exact Legal recognition boundary cases pass; the frozen-source lock also passes. A failed or incomplete suite command is never counted as passed.

## Approved page-action contrast repair

The full design-style audit found that older generic anchor rules override the foreground of the new approved `Get my price` action on Legal/Privacy/Terms. The intended CTA background and text tokens are now kept together by an exact `.qa-page-action > a.qa-primary` rule in the isolated polish file. No old stylesheet, markup, control, wording or protected-response bytes change. [Before/after crops and AA measurements across four Looks, Legal/Privacy/Terms/Blog, and 1440/768/390](checks/page-action-colors.json). Focused contrast validation passes; the final design-style matrix was interrupted at the separate contract replay blocker.

The approved no-JS rail fallback also exposed legacy white link text on a light surface in the non-Current Looks. Only that new normal-flow fallback now uses a paired Look surface/text token set. JS-on styling, geometry, links and labels are unchanged. [Before/after crops and all four Look × four width measurements](checks/rail-colors.json). Focused contrast validation passes; the final design-style matrix was interrupted at the separate contract replay blocker.

The design-style picker regression previously waited a fixed 600ms after Publish. The real QA prerequisite is asynchronous and takes longer, so that run observed the previous published style. The test now waits for the actual POST response (asserting HTTP 200) before its unchanged saved-style and rendered-style assertions. This strengthens completion verification; it does not skip QA or seed approval. The initial rail color diagnostic used a fixture without a rail, then depended on a test server that closed; both incomplete attempts remain in their logs and are not passes. The rail check now renders the same existing baseline fixture in an isolated local runtime, without approval or QA records.

## Legacy private-panel assertion compatibility

The planning-ambient run reached real QA with 0 Fail but its old whole-page `Sample` scan then matched the newly approved `Sample Fictional` business name. The nine affected media suites now remove only their exact, test-local fictional business name from the string under that unchanged scan. No generic Sample token or pending-panel text is removed. Positive preview-label checks likewise exclude the company name, so they still require an actual preview label. [Every changed test, exact name and assertion count](checks/fictional-name-assertions.json). The product placeholder detector is unchanged.

## Final revision rerun preparation

The repaired footer-policy command passes both tests with real QA and 0 Fail; the expanded exact Legal recognition has 232 passing boundary cases. Approved page actions have 0 AA failures across 48 states. No-JS rail colors pass all 16 Look/width states with identical geometry and markup and 0 intersections.

An overlapping rebuild invalidated the tail of the media-library browser run: its Bold hero-b no-JS state reported 208px overflow while built assets were being replaced; the following command could not import the temporarily missing bundle. The exact fixture, rerendered after a completed build with the frozen detector and unchanged sampling, has 0px overflow at 1440/1280/768/390 ([diagnostic](checks/media-overflow-probe.json)). No overflow tolerance or product layout change was made for it. These failed/incomplete attempts are not passes. The build itself succeeded; the first protected-check invocation omitted the required `after` argument and safely refused baseline mode. The corrected comparison is rerun without touching the baseline.

The interrupted suite manifest and logs are retained in [this attempt record](checks/attempts/round6-pre-final/state.json). The full 102-command run was restarted on the final revision with no overlapping rebuild, then stopped at the independent contract replay failure recorded above.


### Populated-project approved scope (2026-09-30)

In progress: exact local map-tile fixture, source-free closed lightbox, project submit recognition and metadata clearance. Generic detector, timing, equality and external network blocking remain unchanged. Validation results follow after execution.

| Recognition page type | Exact selector and wording | Evidence / negative boundaries |
|---|---|---|
| Project story `/s/:slug/projects/:id`, `article.project-story > div.story-shell` | `section.story-contact#contact > form#lead-form > button.story-cta:not([type])`, Submit project inquiry; native submit, enabled, visible, within document bounds | `checks/project-recognition.json`; `recognition/project-submit-positive-390.png`; missing/hidden/hidden ancestor/zero-size/offscreen/disabled/non-submit/non-form/second primary/wrong page/wrong label all Fail; `checks/recognition-lock.json` restores frozen round-4 SHA-256 |


The approved fixes passed: map routing (3 positive and 15 negative browser request checks, 7 URL/method boundaries), lightbox lifecycle/Escape/focus/no-JS, and project submit recognition (4 positive / 48 negative). `populated-project-captures.json` records before/after at all four widths and 0 intersections at the unchanged 60ms samples. The original 10 failures remain above as history. The real project-target capture now reports 1,131 Pass / 2 Borderline / 0 Fail; its isolated test Borderlines use the existing staff-decision helper. The five Sample packets remain undecided.

| Approved populated-project change | Before | After / check |
|---|---|---|
| Chat clears project metadata `dl`, `dt`, `dd`, retains keyboard-focus visibility | [1440 before](before/populated-project-metadata-1440.png), [390 before](before/populated-project-metadata-390.png) | [1440 after](after/populated-project-metadata-1440.png), [390 after](after/populated-project-metadata-390.png), [all widths / 60ms measurements](checks/populated-project-captures.json) |
| Closed lightbox has no source-free image; selected source/alt created only on open, removed on close | [Original saved project HTML](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/pages/page-012.html) | [Lifecycle / Escape / focus / no-JS](checks/project-lightbox.json) |
| Exact local neutral OpenStreetMap tile fixture; no live requests | [Original blocked requests](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/failures.json) | [Local fixture SHA and request audit, other hosts still Fail](checks/project-map-routing.json) |
| Existing project inquiry submit recognized only on the project-story page | [Original 390 result](helper-blockers/platform/d9073e63-3df5-42e5-b45d-68fae130dbbd/256049d7bfc378fd0c24624d4d7955af70848cc728855a41f96ff09ccd4a573c/qa-crops/page-012-390-2.png) | [Actual inquiry](after/populated-project-inquiry-390.png), [52 boundary cases](checks/project-recognition.json), [frozen lock](checks/recognition-lock.json) |

The metadata evidence script first stalled because its diagnostic-only image wait did not activate lazy images. That incomplete attempt is not counted. It was corrected to use the existing eager-loading behavior and rerun; no capture or detector setting changed. All 279 protected hashes plus platform.css and 374 archived responses still match the approved manifests; no additional output normalization or approved-hash change was needed.


Commit byte preservation: the existing `*.js text eol=lf` rule would otherwise rewrite the frozen detector CRLF bytes on staging. A file-specific `.gitattributes` entry disables text/EOL conversion for `src/aws/qa-browser.js` only. The detector bytes and SHA-256 remain unchanged; this preserves the existing exact lock rather than changing or normalizing its expected hash.


### Expense CSV test month boundary

The fresh suite reached a date-dependent `tests/expenses.mjs` assertion on 2026-10-01 UTC (September 30 PT). Its default current-month export correctly excluded the September 2026 history, so the old test could not find `Rate needed`. The test now explicitly requests the seeded September range, retains the original honesty assertion, additionally requires all 324 unknown-rate rows, and checks that the default export respects the current UTC month. No Expenses product code, data rules, text, route or date behavior changed. The failed attempt and interrupted commands are retained in [the attempt summary](checks/populated-date-window-attempt/summary.json); none count as passed. [Date-window evidence](checks/expense-export-date-window.json). The full 102-command run is restarted after this test-only correction.

## Approved readable-body-text clearance: service credentials

The subsequent full-suite attempt passed 40 commands, then `premium-service` failed two real 768px captures before approval: the existing `.sd-phone-bar` covered `.sd-confirmed-facts` credentials on Flat roofs and Roof installation. Painted-text overlaps measured 26.25 × 10.34px and 43.48 × 14.34px. Joe’s standing approval for readable body-text blocks applies: only `.sd-confirmed-facts span` and `.sd-confirmed-facts a` were added to the existing shared visibility-only clearance selector. No dimensions, controls, wording, timing or detector changes. The failed run and three interrupted commands are preserved in [the attempt record](checks/credentials-clearance-attempt/summary.json); none are counted as passes.

| Covered body text | Before | After | Check |
|---|---|---|---|
| Flat-roof contractor credentials | [768](before/credentials-flat-roofs-768-reduced.png), [390](before/credentials-flat-roofs-390-reduced.png) | [768](after/credentials-flat-roofs-768-reduced.png), [390](after/credentials-flat-roofs-390-reduced.png) | [Unchanged detector, 2px/60ms](checks/credentials-clearance.json) |
| Roof-installation contractor credentials | [768](before/credentials-roof-installation-768-reduced.png), [390](before/credentials-roof-installation-390-reduced.png) | [768](after/credentials-roof-installation-768-reduced.png), [390](after/credentials-roof-installation-390-reduced.png) | 24 after states total, four widths × three motion/JS modes × two pages; 0 intersections |

The focused premium-service regression now passes end to end through real browser QA. Its previously failing credentials state reports 0 Fail. Before/after diagnostics reproduce the overlap on both affected pages at 768 in normal and reduced motion, and all 24 after states pass. The first diagnostic alignment attempt stalled at no-JS style injection and was stopped; the corrected diagnostic applies the existing QA style/readiness sequence only to JS-enabled states, retaining normal static no-JS behavior. Production capture settings never changed.

The first platform-matrix invocation after this fix omitted its required real-approval helper and correctly failed publication with HTTP 409 (Complete the review packet before approval). Its failure remains in `checks/credentials-platform-matrix.log`. The rerun loads the existing real browser QA helper; no approval check is skipped or weakened.

Platform matrix navigation: the old DOM `element.click()` bypassed actionability and two attempts timed out without console/AA findings. The actual-click diagnostic then proved the phone Expenses sidebar is intentionally hidden behind its existing Menu button. The audit now opens that existing menu (and a closed navigation group when necessary) and uses Playwright’s real click, retaining the same selected-view assertion and timeout. No product behavior, screenshot setting, audit threshold or measured state was changed. The earlier incomplete attempts are retained, never counted as passes.

## Standing-rule recognition and fictional fixtures (2026-10-01)

The interrupted final suite found six blocked commands. No product markup, copy, consent, layout, controls, or generic detector checks changed. Four clearly fictional 555 test records are now designated Sample Fictional in fixture data only; all behavior assertions remain. The standalone Robles published-copy capture still passes (1,086 Pass, 2 Borderline, 0 Fail).

| Exact entry | Scope and selector | Evidence and negatives |
|---|---|---|
| Redundant uploaded brand image | Conversion home, core index/city, service detail, pricing and blog index only; direct header brand-link img.site-brand-logo, recorded logoId, exact home href, adjacent visible span.site-brand-name equal to settings.name | recognition/brand-*.png; tests/automatic-qa-brand-recognition.mjs covers missing/hidden/incorrect adjacent name, wrong asset/link/page/header, extra content, missing alt and missing record. Results pending. |
| Thousand Oaks permission | Roofing city page /areas/thousand-oaks only; main#main > section.rc-inquiry#city-inquiry > form#lead-form[data-city="Thousand Oaks"] > label.core-consent > input[name=consent][type=checkbox]; exact existing wording | recognition/thousand-oaks-consent-*.png; missing, checked, not required, hidden, wrong page/trade/body/name/type/wording and offscreen negatives. Results pending. |

Both entries are registered for exact removal back to the frozen round-4 SHA-256. No captures or tests are counted as passed before execution.

Service detail pages also repeat the same recorded logo and adjacent visible business name in `body > footer.sd-footer > a > img.site-brand-logo`. This exact service-page-only redundant role is included in the same positive/negative boundary matrix and removable lock entry. No footer markup or text changed. The interim capture correctly blocked 33 footer measurements before this registration.

The service-pages-all-trades SEO title assertion retains its exact full business-name check, updated from `${trade} Local` to the newly designated `Sample Fictional ${trade} Local`. The first designation-only run reached this stale expected name after real QA passed; it is recorded as failed, not passed. No behavior assertion was removed.

| Craft homepage existing final action | `/s/:slug`, `body.theme-craft`; `main > section.public-contact#contact > form#lead-form > button.public-button:not([type])`, visible enabled native Send request submit | `tests/automatic-qa-craft-recognition.mjs`: 4 positive / 48 negative cases (missing, hidden, zero/offscreen, disabled, non-submit, wrong parent/page/label and duplicate primary); results pending; frozen round-4 restoration proof registered. No markup, wording or consent changed. |

The Craft contact Call link and Send request button shared the filled public-button treatment. Under Joe’s duplicate-primary approval, the exact Craft contact phone link now uses a transparent background, inherited light text and an inset outline; its dimensions, wording, href and order are unchanged. The form submit remains primary. This is isolated in review-qa-polish.css; existing stylesheets are unchanged. [Before phone crop](helper-blockers/service-pages-all-trades-corrected/43e057cc-3e07-401b-86f4-4324cdf7badd/156fb7135dc5eaab5d665e371c4a02791f49eb007d04ca461352de57dc632d8e/qa-crops/page-001-390-3.png). After capture and protection verification pending.
