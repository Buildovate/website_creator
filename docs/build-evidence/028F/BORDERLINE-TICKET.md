# #028F-B Borderline FIX — 67 phone-header truncation + 3 transformation video

- State: **OPEN — all 70 original findings remain open.**
- Decision: **Joe REJECTED — fix in product, never Accept** (2026-10-07).
- Due: **before October 27, 2026**, before the first live contractor.
- Do not Accept, waive, or reclassify these findings. This document records the follow-up ticket; it records no QA review decisions.
- `qaGateClear=false`. Suite-102 is 102 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 0 incomplete.
- Fresh 8ab QA: 3,492 Pass / 3 Borderline / 0 Fail. The 67 original header findings are no longer detected by that snapshot, but their original IDs remain open here, not reclassified or accepted.
- Fix the original phone-header truncation and transformation-video findings in product, with evidence under a separate ticket. Keep the QA detector and thresholds unchanged.

Source: [original 70 findings](checks/round8q-samples-before-findings.json); [latest verification](checks/round8ab-results.json). IDs are qualified by Sample and captured version because a local check ID may recur across sites.

## Captured versions

| Sample | Original version SHA-256 |
|---|---|
| sample-fictional-copper-kite-ventura | `d7988c0810814f3ef989d49e2a345279e310e035e5fb23812e1248a8767d7b4e` |
| sample-fictional-blue-orchard-pasadena | `6523f729d8cead8729fb20834bd595bbd1fe45b96696db53892d5221aa27949f` |
| sample-fictional-paper-lantern-temecula | `4e17f2ebdce5ce80d1eb3b7a3d091c58571be4d8b7f80fd55ed950afa67f56d1` |
| sample-fictional-cobalt-heron-irvine | `41ad0560f3d6aa26c1afa38e01957b32d437bf5627b8bcf7e9400e93e6216d04` |
| sample-fictional-ochre-willow-riverside | `34adc73ab20e03a94063f21c24e46539cf107bd10878d5326f5b69f36801b90c` |

## Phone-header truncation — 67 open IDs

| Sample | Open check ID | Page / frame | Width |
|---|---|---|---|
| sample-fictional-copper-kite-ventura | `page-001-390-clipped-text` | /s/sample-fictional-copper-kite-ventura | 390 |
| sample-fictional-copper-kite-ventura | `page-002-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/about | 390 |
| sample-fictional-copper-kite-ventura | `page-003-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/areas | 390 |
| sample-fictional-copper-kite-ventura | `page-004-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/areas/ventura | 390 |
| sample-fictional-copper-kite-ventura | `page-005-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/blog | 390 |
| sample-fictional-copper-kite-ventura | `page-006-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/contact | 390 |
| sample-fictional-copper-kite-ventura | `page-007-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/faq | 390 |
| sample-fictional-copper-kite-ventura | `page-008-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/legal | 390 |
| sample-fictional-copper-kite-ventura | `page-011-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/pricing | 390 |
| sample-fictional-copper-kite-ventura | `page-012-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/reviews | 390 |
| sample-fictional-copper-kite-ventura | `page-013-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/services | 390 |
| sample-fictional-copper-kite-ventura | `page-014-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/services/roof-installation | 390 |
| sample-fictional-copper-kite-ventura | `page-015-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/services/roof-repair | 390 |
| sample-fictional-copper-kite-ventura | `page-016-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/thank-you | 390 |
| sample-fictional-blue-orchard-pasadena | `page-001-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena | 390 |
| sample-fictional-blue-orchard-pasadena | `page-002-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/about | 390 |
| sample-fictional-blue-orchard-pasadena | `page-003-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/areas | 390 |
| sample-fictional-blue-orchard-pasadena | `page-004-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/areas/pasadena | 390 |
| sample-fictional-blue-orchard-pasadena | `page-005-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/blog | 390 |
| sample-fictional-blue-orchard-pasadena | `page-006-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/contact | 390 |
| sample-fictional-blue-orchard-pasadena | `page-007-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/faq | 390 |
| sample-fictional-blue-orchard-pasadena | `page-008-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/legal | 390 |
| sample-fictional-blue-orchard-pasadena | `page-011-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/pricing | 390 |
| sample-fictional-blue-orchard-pasadena | `page-012-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/reviews | 390 |
| sample-fictional-blue-orchard-pasadena | `page-013-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/services | 390 |
| sample-fictional-blue-orchard-pasadena | `page-014-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/services/roof-repair | 390 |
| sample-fictional-blue-orchard-pasadena | `page-015-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/services/roof-replacement | 390 |
| sample-fictional-blue-orchard-pasadena | `page-016-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/thank-you | 390 |
| sample-fictional-paper-lantern-temecula | `page-001-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula | 390 |
| sample-fictional-paper-lantern-temecula | `page-002-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/about | 390 |
| sample-fictional-paper-lantern-temecula | `page-003-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/areas | 390 |
| sample-fictional-paper-lantern-temecula | `page-004-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/areas/temecula | 390 |
| sample-fictional-paper-lantern-temecula | `page-005-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/blog | 390 |
| sample-fictional-paper-lantern-temecula | `page-006-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/contact | 390 |
| sample-fictional-paper-lantern-temecula | `page-007-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/faq | 390 |
| sample-fictional-paper-lantern-temecula | `page-008-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/legal | 390 |
| sample-fictional-paper-lantern-temecula | `page-011-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/pricing | 390 |
| sample-fictional-paper-lantern-temecula | `page-012-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/services | 390 |
| sample-fictional-paper-lantern-temecula | `page-013-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/services/asphalt-shingles | 390 |
| sample-fictional-paper-lantern-temecula | `page-014-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/services/roof-replacement | 390 |
| sample-fictional-paper-lantern-temecula | `page-015-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/thank-you | 390 |
| sample-fictional-cobalt-heron-irvine | `page-001-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine | 390 |
| sample-fictional-cobalt-heron-irvine | `page-002-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/about | 390 |
| sample-fictional-cobalt-heron-irvine | `page-003-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/areas | 390 |
| sample-fictional-cobalt-heron-irvine | `page-004-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/areas/irvine | 390 |
| sample-fictional-cobalt-heron-irvine | `page-005-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/blog | 390 |
| sample-fictional-cobalt-heron-irvine | `page-006-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/contact | 390 |
| sample-fictional-cobalt-heron-irvine | `page-007-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/faq | 390 |
| sample-fictional-cobalt-heron-irvine | `page-008-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/legal | 390 |
| sample-fictional-cobalt-heron-irvine | `page-011-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/pricing | 390 |
| sample-fictional-cobalt-heron-irvine | `page-012-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/services | 390 |
| sample-fictional-cobalt-heron-irvine | `page-013-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/services/air-conditioning-installation | 390 |
| sample-fictional-cobalt-heron-irvine | `page-014-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/services/air-conditioning-repair | 390 |
| sample-fictional-cobalt-heron-irvine | `page-015-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/thank-you | 390 |
| sample-fictional-ochre-willow-riverside | `page-001-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside | 390 |
| sample-fictional-ochre-willow-riverside | `page-002-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/about | 390 |
| sample-fictional-ochre-willow-riverside | `page-003-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/areas | 390 |
| sample-fictional-ochre-willow-riverside | `page-004-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/areas/riverside | 390 |
| sample-fictional-ochre-willow-riverside | `page-005-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/blog | 390 |
| sample-fictional-ochre-willow-riverside | `page-006-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/contact | 390 |
| sample-fictional-ochre-willow-riverside | `page-007-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/faq | 390 |
| sample-fictional-ochre-willow-riverside | `page-008-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/legal | 390 |
| sample-fictional-ochre-willow-riverside | `page-011-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/pricing | 390 |
| sample-fictional-ochre-willow-riverside | `page-012-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/services | 390 |
| sample-fictional-ochre-willow-riverside | `page-013-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/services/heating-installation | 390 |
| sample-fictional-ochre-willow-riverside | `page-014-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/services/heating-repair | 390 |
| sample-fictional-ochre-willow-riverside | `page-015-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/thank-you | 390 |

## Transformation video — 3 open IDs

| Sample | Open check ID | Page / frame | Width |
|---|---|---|---|
| sample-fictional-copper-kite-ventura | `clip-0` | /s/sample-fictional-copper-kite-ventura | 960 |
| sample-fictional-blue-orchard-pasadena | `clip-0` | /s/sample-fictional-blue-orchard-pasadena | 960 |
| sample-fictional-paper-lantern-temecula | `clip-0` | /s/sample-fictional-paper-lantern-temecula | 960 |

## Round 1d — read-only diagnosis (October 8, 2026 PT)

All **70 original IDs remain REJECTED/OPEN**. No Accept, waiver, reclassification, deletion, saved-baseline update or QA gate edit. qaGateClear=false. The original version table and all 70 ID rows above are unchanged. Inventory: 67 header + 3 video, 70/70 matched by Sample and original version.

### Timeout cause and probe correction

Primary classification **(2): a universal attribute expectation that does not match every current page**. Ten service detail pages render a usable phone header/native Menu but do not include site-navigation.js; all 20 width cases therefore lack data-nav-mode. The old unconditional .shared-site-header[data-nav-mode] wait cannot complete on those pages. Current full-page measurements succeeded with no JavaScript or console errors. The old failing page was not logged, so its exact URL cannot be recovered; the ten pages incompatible with that wait are recorded in the JSON. This diagnoses the invalid wait, without claiming to reconstruct its lost trace.

Supplementary category (3): homepage data-nav-mode was absent at DOM readiness, then menu after fonts/animation frames. public/site-navigation.js:3–4 conditions initialization on [data-nav-fit]; :28 sets menu at phone width; :47–50 schedules fit after font readiness, loadingdone or resize. Header presence and loaded fonts are the actual measurement prerequisites.

Round 1c used no preview server: it routed a virtual diagnosis.invalid origin to an in-memory built worker. Port 5173 is currently not listening (ECONNREFUSED), but was not used and did not cause that timeout. The diagnostic sample returned **HTTP 200**, final URL **http://diagnosis.invalid/s/sample-fictional-copper-kite-ventura**, no redirects, header present, zero console/page errors. All verification page requests returned 200. Zero external/provider requests were sent.

[Probe source](tools/028F-B-probe.mjs) now waits for visible header + document.fonts.ready + three animation frames; it measures text rectangles and clipping ancestors, and records optional nav-mode. It retains the whole page, all stylesheet locations and actual built scripts. Results are [written to JSON](checks/028F-B-probe.json), not oversized stdout. No product event is manually triggered to conceal clipping; long names change only temporary browser text. The earlier 1b head-only extraction omitted body-injected styles and was inconclusive; the earlier helper's guessed filenames and stdout truncation are not product evidence.

### Group A — current phone verification

**Group A fixed in product for the 67 original page/name cases tested.** 67/67 fully visible at 390px, and 67/67 at 360px; zero clipping, ellipsis, painted-name/control overlap or horizontal overflow. All 134 cases are in the JSON with scrollWidth/clientWidth, white-space/overflow/text-overflow, visual truncation, line count and header height. Header names naturally wrap. This is a diagnostic observation, not closure or reclassification of any original finding.

Original cause: .shared-site-header .site-brand-name was nowrap + overflow:hidden + text-overflow:ellipsis under public/site-polish.css:80–83. The original evidence stores the text/selector and maximumPx=2, but no numeric pixel-overflow value; none is invented here. The actual repair is the 8q Menu-mode wrap override, public/site-polish.css:200–204 (normal whitespace, visible overflow, anywhere wrapping). 8x's Arial rule at :195–196 applies to foundation-page phone branding and prevents font-swap CLS; it is not the ellipsis repair. No additional Group A source fix is indicated by these cases. All these CSS/header/nav files remain protected and unchanged.

| Sample name | Trade / Look | Original IDs | 390 fully visible | 360 fully visible | Lines at 390 | Header px at 390 |
|---|---|---:|---:|---:|---:|---:|
| Sample Fictional Copper Kite Roofing | Roofing / current | 14 | 14/14 | 14/14 | 2–2 | 68.00–84.28 |
| Sample Fictional Blue Orchard Roofing | Roofing / classic | 14 | 14/14 | 14/14 | 2–2 | 68.00–84.28 |
| Sample Fictional Paper Lantern Roofing | Roofing / current | 13 | 13/13 | 13/13 | 2–2 | 68.00–84.28 |
| Sample Fictional Cobalt Heron HVAC | HVAC / bold | 13 | 13/13 | 13/13 | 2–2 | 80.00–84.28 |
| Sample Fictional Ochre Willow HVAC | HVAC / fresh | 13 | 13/13 | 13/13 | 2–2 | 80.00–84.28 |

#### Long names

30-character Pacific Coast Roofing Services; 40-character Forty Character Roofing Services Company; 50-character unbroken W string. **30/30 cases fully visible**, loaded fonts, no clipping/overflow/control overlap. Longest name tested: **50 characters, no spaces**. At phone widths the desktop nav/CTA is hidden by design; Menu fits and the Contact CTA remains reachable inside it. These checks do not certify arbitrary names or desktop service-page nav behavior.

| Characters | Width | Fully visible | Lines | Header px range across five samples | Navigation / CTA |
|---|---:|---:|---:|---:|---|
| 30 | 390 | 5/5 | 2–2 | 68.00–80.00 | 5/5 Menu fits; Contact reachable |
| 30 | 360 | 5/5 | 2–2 | 68.00–80.00 | 5/5 Menu fits; Contact reachable |
| 40 | 390 | 5/5 | 2–2 | 68.00–80.00 | 5/5 Menu fits; Contact reachable |
| 40 | 360 | 5/5 | 3–3 | 84.06–98.06 | 5/5 Menu fits; Contact reachable |
| 50 (no spaces) | 390 | 5/5 | 5–5 | 125.44–139.44 | 5/5 Menu fits; Contact reachable |
| 50 (no spaces) | 360 | 5/5 | 5–5 | 125.44–139.44 | 5/5 Menu fits; Contact reachable |

#### Before screenshots (current product before any Borderline fix)

Five 390×844 screenshots, one for each Sample/Look combination. No after screenshots because this round changes no product code.

- [sample-fictional-copper-kite-ventura — Roofing / current](screenshots/028F-B/sample-fictional-copper-kite-ventura-390-before.png)
- [sample-fictional-blue-orchard-pasadena — Roofing / classic](screenshots/028F-B/sample-fictional-blue-orchard-pasadena-390-before.png)
- [sample-fictional-paper-lantern-temecula — Roofing / current](screenshots/028F-B/sample-fictional-paper-lantern-temecula-390-before.png)
- [sample-fictional-cobalt-heron-irvine — HVAC / bold](screenshots/028F-B/sample-fictional-cobalt-heron-irvine-390-before.png)
- [sample-fictional-ochre-willow-riverside — HVAC / fresh](screenshots/028F-B/sample-fictional-ochre-willow-riverside-390-before.png)

### Group B — identical transformation clip

All three Roofing homepages use public/assets/films/roofing-transformation.mp4, **2,223,549 bytes**, SHA-256 **968e9fdfb507139b9a5516730d85bd8f435269f10e72813850c525babdb534a8**. The dist copy matches. The three original five-frame sets are byte-identical; each clip-0 remains OPEN and is also the remaining finding in the 8ab snapshot (3,492 Pass / 3 Borderline / 0 Fail).

Trigger: **0% vs 75%, histogram distance 0.666341 > Pass maximum 0.65**, below Fail cutoff 0.80; SSIM 0.152492. Morph interpolation residual 0.592779 is above 0.20, so the morph-residual branch is not the trigger. Frames 50%/75% show detached/ghosted roof fragments over exposed framing, while crop/camera/background lighting shift substantially. This is one shared asset-quality cause. The raw 960px decoded-video capture contains no page headline or CSS overlay; changing poster, text or page crop cannot repair the video signal. All saved frames and per-clip measurements are linked in the JSON.

Proposal only; none applied:

| Option | Possible files / protected exception requiring Joe approval | Tradeoff |
|---|---|---|
| Re-render/replace with steadier camera and coherent roof assembly | public/assets/films/roofing-transformation.mp4; poster if needed; public/trade-films.json:2–24 only if metadata changes | Preserves the film; requires approved production/review work, no generation authorized here |
| Swap to a reviewed, approved alternate clip | public/trade-films.json:3–7 and approved local asset | Must verify the alternate independently; none is claimed approved by this diagnosis |
| Show existing poster only | public/trade-films.json:3 (null URL uses existing still fallback); src/trade-components.js:12 only if a later approved renderer change is needed | Removes the defective motion from product use; requires Joe's explicit product decision, not a waiver |

Next-batch proposal: Group A needs verification rather than another CSS patch; select and approve one Group B option, then verify header-logo.mjs, header-nav-fit.mjs, new QA captures for all five Samples and full Suite-102 at the end. Estimate two later rounds (media repair, final verification). No historical packet or baseline rewrites; no detector/threshold changes. All 70 original IDs remain OPEN throughout this evidence round.

### Preservation and scope

Held work **228/228 SHA-256 matches**; BUILD-BACKLOG.md unchanged. No site, video, test, QA, threshold, normalization, baseline or checksum edits; no Suite-102 run. No parallel worktree/port use, push, deploy, real provider call or credit usage. Only this appended section, the diagnostic probe/JSON and five screenshots are authorized commit contents.

## Round 2 — Group B alternate film (2026-10-08)

Only the three Group B homepage commercial-film references changed, in `src/trade-components.js`. Each exact homepage base selects the already-installed Roofing pricing/story film. The shared Roofing default, headers, copy, video bytes, QA code, thresholds, saved packets, baselines and checksums are unchanged.

### Candidate and prior pass

The only alternate Roofing video installed directly in `public/assets/films/` is **roofing-story.mp4** (1,973,651 bytes), SHA-256 `03cc70d5d02a9310216d91f58426260405cc833432fad7c0f9aa8f1486123dc4`. The two Roofing WebP files are still images, not film candidates. The most recent #028F video snapshot is round 8ab; this clip passed its unchanged five-frame consistency check as clip-2 on each sample’s pricing page:

- [sample-fictional-copper-kite-ventura prior clip-2 Pass](checks/round8ab-samples/packets/sample-fictional-copper-kite-ventura/6dc55e1bd90785f669fda8f2fa3aa6a4d6c1d3529b306dbe60f7bbb36f732ce9/qa-report.json).
- [sample-fictional-blue-orchard-pasadena prior clip-2 Pass](checks/round8ab-samples/packets/sample-fictional-blue-orchard-pasadena/2af53292692f8f834c0f81051f784b8c7383b466773d6807b4b500ca41deb7c5/qa-report.json).
- [sample-fictional-paper-lantern-temecula prior clip-2 Pass](checks/round8ab-samples/packets/sample-fictional-paper-lantern-temecula/7fe45c63acae0f539055f4c546ae5a29d6c6815bf0a96167dde9c0d3ddcd21eb/qa-report.json).

Old film: `public/assets/films/roofing-transformation.mp4`, SHA-256 `968e9fdfb507139b9a5516730d85bd8f435269f10e72813850c525babdb534a8`. New film: `public/assets/films/roofing-story.mp4`, SHA-256 `03cc70d5d02a9310216d91f58426260405cc833432fad7c0f9aa8f1486123dc4`; existing approved poster `/assets/films/roofing-story.webp`. Neither asset was edited.

### New Group B check results — INCONCLUSIVE; stopped before commit

Isolated local capture of current source bundled in memory, using the existing browser flags, 960×540 five-frame extraction at 0/25/50/75/100%, unchanged capture readiness and `captureClipQA`. No Suite-102 or full Sample QA rerun. Each homepage reference was verified on the rendered page; media geometry checked at 390/768/1440. No provider calls or credits.

| Homepage | Five-frame consistency | Decode/poster/frame fill | Maximum histogram distance | Minimum SSIM | Morph residual |
|---|---|---|---:|---:|---:|
| sample-fictional-copper-kite-ventura | Pass | Pass | 0 | 1 | 1 |
| sample-fictional-blue-orchard-pasadena | Pass | Pass | 0 | 1 | 1 |
| sample-fictional-paper-lantern-temecula | Pass | Pass | 0 | 1 | 1 |

Pass thresholds remain histogram ≤0.65 and SSIM ≥−0.05; morph thresholds unchanged. **The harness reported 3/3 Pass, but all extracted frames produced SSIM 1 and histogram distance 0 at every timestamp. This contradicts the varying-frame measurements in the prior pass for the same asset. These new results are INCONCLUSIVE, not verified passes. Stop: no retry or commit.** Full measurements and the isolated helper are saved locally in `checks/028F-B-round2-video.json` and `tools/028F-B-round2-video.mjs`; these are not staged in this narrowly specified commit.

### After screenshots

Screenshots show each homepage’s commercial section at 1440px, with the new resting poster under reduced motion.
- [sample-fictional-copper-kite-ventura](screenshots/028F-B/sample-fictional-copper-kite-ventura-round2-after.png) — SHA-256 `c4abd2039dccb47a6bc04abc838246cd6c8ceaab87cdfefa4acbdb2ec21add58`.
- [sample-fictional-blue-orchard-pasadena](screenshots/028F-B/sample-fictional-blue-orchard-pasadena-round2-after.png) — SHA-256 `eee2159ab59b2de277b52ef1c9311f5f74cc8cbe2da6753e75d835320acf85f1`.
- [sample-fictional-paper-lantern-temecula](screenshots/028F-B/sample-fictional-paper-lantern-temecula-round2-after.png) — SHA-256 `f07b2932a4cc6c0d6a5abae55cbd847cbc128951de5dfe450c05803afec31873`.

### Preservation and decisions

Held work **228/228 SHA-256 matches**, including BUILD-BACKLOG.md. All **70 original IDs remain REJECTED/OPEN**, with no Accept, waiver, reclassification, deletion or re-baseline. **qaGateClear=false**. Three inconclusive captures do not establish verification of the product swap or close the original findings. No headers/text changes, Suite-102, push, deploy or provider calls.

Verification stop: the extracted moving-video evidence is unexpectedly identical across timestamps. The selected candidate and three source references remain uncommitted. No second candidate was tried. The three after screenshots show the resting poster only.

## Round 2b — valid Group B moving-video check (2026-10-08)

### Identical-frame cause and helper-only fix

Quote from the capture trace: **The helper answered `Range: bytes=0-` with `200` and no `Content-Range` / `Accept-Ranges`. Chrome buffered the full 15.041667 seconds but exposed a seekable range of `[0, 0]`; every requested timestamp was clamped back to zero.** At 25/50/75/100%, requested times were 3.76041675/7.5208335/11.28125025/14.991667 seconds; actual time remained 0, with one PNG SHA. This was a local helper HTTP-response bug, not repeated output writes or a product/video fault.

Only the ticket helper was fixed: local MP4 requests now receive correct `206`, byte-range body, `Content-Range`, `Accept-Ranges` and `Content-Length`. It rejects an unreached timestamp or fewer than five distinct saved-frame SHAs. Product video bytes, existing QA/readiness functions, thresholds and baselines remain unchanged. Diagnosis: `checks/028F-B-round2b-capture-diagnosis.json` (local, not staged).

### Selected existing asset

`public/assets/films/roofing-story.mp4` — SHA-256 `03cc70d5d02a9310216d91f58426260405cc833432fad7c0f9aa8f1486123dc4`. Prior clip-2 passes are linked in Round 2 above. The three exact homepage references from Round 2 remain; no additional product edit was made in Round 2b. Other Roofing sites still select the existing shared default.

### One verification run

| Sample homepage | Video consistency | Decode/poster/frame fill | Distinct saved frames |
|---|---|---|---:|
| sample-fictional-copper-kite-ventura | Pass | Pass | 5/5 |
| sample-fictional-blue-orchard-pasadena | Pass | Pass | 5/5 |
| sample-fictional-paper-lantern-temecula | Pass | Pass | 5/5 |

**3/3 Pass** with five genuinely different frames per clip. Maximum histogram distance **0.54834** (Pass ceiling 0.65); minimum SSIM **0.094672** (Pass floor −0.05); morph residual **0.899981**. Measurements exactly match the prior round-8ab story-film pass. Actual times: 0, 3.760416, 7.520833, 11.281250 and 14.991667 seconds. Local geometry checked at 390/768/1440; no letterboxing. Five same-timestamp frames are identical across the three samples because they use the same film, but all five timestamps within each sample differ.

[Check JSON and all 15 saved-frame paths/SHAs](checks/028F-B-round2b-video.json). No Suite-102 was run.

- [sample-fictional-copper-kite-ventura — after, resting poster at 1440px](screenshots/028F-B/sample-fictional-copper-kite-ventura-round2b-after.png).
- [sample-fictional-blue-orchard-pasadena — after, resting poster at 1440px](screenshots/028F-B/sample-fictional-blue-orchard-pasadena-round2b-after.png).
- [sample-fictional-paper-lantern-temecula — after, resting poster at 1440px](screenshots/028F-B/sample-fictional-paper-lantern-temecula-round2b-after.png).

### Preservation and commit scope

Held work **228/228 matches**, including BUILD-BACKLOG.md. All **70 original Borderlines stay REJECTED/OPEN**; no Accept, waiver, reclassification, deletion or re-baseline. **qaGateClear=false**. No header/text, QA source/test, detector, normalization, threshold, saved baseline/checksum or asset edits. No provider calls, credits, push or deploy.

Commit scope: the three homepage references in `src/trade-components.js`, this ticket, the Round 2b check JSON, three after page screenshots and 15 new video-frame PNGs. The helper and separate diagnosis JSON remain local/untracked as required by the explicit staging list.
