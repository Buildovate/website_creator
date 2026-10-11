# Roofing clips — #024–#027 Phase 2

Completed locally on 2026-09-27 PT on `feature/local-environment-setup`. Three accepted clips are attached. #025 remains **Pending after its one allowed retake** and publishes with its installed poster. No push, deployment, or staging-environment action occurred.

## Spend and generation settings

Balance before: **2,513.8 credits**. Balance after every generation is below; final provider balance was independently re-read as **1,777.8 credits**. Total: **736 / 896 credits**, leaving **160 credits of the cap unused**. Every read-only estimate matched its approved quote before submission. No extra images or unlisted clips were generated. Both Seedance clips and retakes used the installed poster in accepted omni_reference mode; no t2v fallback was necessary. All attempts requested 1080p, 16:9, silent, generate_audio=false. Seedance bitrate_mode was high; Cinema genre was auto. “Ultra” remained prompt text only.

| Ticket | Model | Mode | Seconds | Credits | Retake | Balance after | Result |
|---|---|---|---:|---:|---|---:|---|
| #024 | cinematic_studio_3_0 | text-to-video; genre auto | 8 | 80 | No | 2,433.8 | Ready |
| #025 | seedance_2_5 | omni_reference | 12 | 144 | No | 2,289.8 | Rejected |
| #026 | cinematic_studio_3_0 | text-to-video; genre auto | 8 | 80 | No | 2,209.8 | Ready |
| #027 | seedance_2_5 | omni_reference | 12 | 144 | No | 2,065.8 | Rejected |
| #025 | seedance_2_5 | omni_reference | 12 | 144 | Yes | 1,921.8 | Pending after retake |
| #027 | seedance_2_5 | omni_reference | 12 | 144 | Yes | 1,777.8 | Ready |

Exact unmodified README prompts, estimates, submission parameters, job IDs, balances, final verdicts and master URLs are recorded in [generation-log.json](generation-log.json). Original Higgsfield masters remain at the provider's existing user master-asset location, each under its unique hf_...mp4 key; none was overwritten. Local master copies and SHA-256 values are listed in [master-assets.json](master-assets.json). Download archives and local masters are retained locally; the commit includes the review frames, delivery assets and evidence manifests without duplicating the archives/master binaries.

## Visual review

Five PNG frames at 0%, 25%, 50%, 75%, and the final available frame (100%) were reviewed for each of six attempts: **30 review frames**. Directories: `024-take1`, `025-take1`, `promotions-take1/026`, `promotions-take1/027`, `025-take2`, `027-take2`. All contain `frame-0.png` through `frame-100.png` and probe metadata.

C1: sound roof/material geometry. C2: no text, logos, watermarks or numbers. C3: no identifiable faces; any rooftop worker has a visible harness. C4: poster palette/material/light. C5: calm ambient motion and seamless loop. C6: ordered scroll-story beats. C7: central subject survives the phone crop. N/A means the check applies to the other clip type.

| Attempt | C1 | C2 | C3 | C4 | C5 | C6 | C7 |
|---|---|---|---|---|---|---|---|
| #024 take 1 | Pass | Pass | Pass | Pass — extracted poster | Pass — 0.5s blend | N/A | Pass |
| #025 take 1 | Pass | Fail | Fail — harness not verifiable | Pass | N/A | Pass | Pass |
| #026 take 1 | Pass | Pass | Pass | Pass | Pass — 0.5s blend | N/A | Pass |
| #027 take 1 | Pass | Pass | Pass | Pass | N/A | Fail | Pass |
| #025 retake | Pass | Fail | Pass | Pass | N/A | Fail | Fail |
| #027 retake | Pass | Pass | Pass | Pass | N/A | Pass | Pass |

- **#024 take 1:** Stable blue-gray tabletop, no people or markings. Opening extracted frame matches the delivered film and is a better poster than the unrelated installed golden roof photograph.
- **#025 take 1:** Calendar numbers/text at 50%, 75%, 100%. Background roof worker at the closing frame is too blurred to verify the harness. Retake was triggered by check 2.
- **#026 take 1:** Stable slate/copper detail, warm afternoon palette and no people. Existing poster retained.
- **#027 take 1:** Folder exits the composition; the 9–12s closing folder/material beat is missing. Retake triggered by check 6.
- **#025 retake:** Calendar digits/markings remain at 75% and 100%; requested 6–9s overhead organizing view is missing. Wide ending arrangement puts sample/calendar toward opposite frame edges. Keep installed poster; no further retake.
- **#027 retake:** Roof detail to folder/sample to paired blank sheets, then settled folder/material composition. No people or text. Existing warm terracotta roof poster retained; extracted macro frame is less descriptive.

The #025 retake failed, so no further generation or attachment was attempted for it. Its section remains complete and movable as the existing `planningScroll` component, with five DOM steps and its original responsive photograph. No Financing chapter merge was performed.

## Encodes and posters

Exact sizes below are bytes, in order **desktop MP4 / desktop WebM / mobile MP4 / mobile WebM**. Desktop is 1920×1080; mobile is 960×540. MP4 is H.264 with faststart; WebM is VP9. All delivered files are 24fps, contain no audio, and meet the requested decimal-MB limits.

| Ticket | Seconds | Sizes (bytes, MP4 / WebM at 1920 then 960) | Poster used and reason |
|---|---:|---|---|
| #024 | 8 | 1,368,544 / 769,586 / 350,131 / 306,731 | Extracted first frame, 1280/720 WebP. It matches the cool morning planning scene; the former warm exterior roof image did not. |
| #025 | 12 requested | No delivery encodes: rejected after retake | Existing `roofing-scroll-1280/720.webp` retained. Extracted `025-extracted-poster.webp` is evidence only. |
| #026 | 8 | 2,283,139 / 1,728,043 / 679,556 / 727,963 | Existing `roofing-promotions-ambient-1280/720.webp`; slate, copper and warm light already match. |
| #027 | 12 | 4,064,528 / 4,160,092 / 1,465,005 / 1,750,790 | Existing `roofing-promotions-scroll-1280/720.webp`; it provides a clearer roof context than the extracted close-up and matches the terracotta material and warm light. |

Each accepted clip also has extracted 1280/720 WebP posters in `public/assets/planning/clips-phase2`. Both ambient deliveries blend their last 0.5 seconds into the opening frame. Opening and closing delivery frames are saved as `024-loop-first/last.png` and `026-loop-first/last.png`; visual review found no visible loop jump. [asset-integrity.json](asset-integrity.json) records installed hashes and sizes; [full-decode-results.json](full-decode-results.json) records all **12 encodes / 2,688 decoded frames**, with zero audio streams and no decode errors.

## Reuse and attachment

Reused the four Phase 1 renderers and pending-media slots, their responsive posters, reserved media geometry, pause controls, 120ms opacity transitions, private status panels and public poster-fallback rule. Reused `mountAmbientVideo` in lazy mode and the existing #020-derived scroll controller through `data-financing-story`; no second player was added. Only optional responsive MP4/WebM data attributes and source selection were added. Hero/theater playback follows its original branch.

The installed catalog marks #024, #026 and #027 Ready. The #025 descriptor remains byte-identical to Phase 1. Existing saved Phase 1 sites adopt reviewed Ready descriptors on their next normal Save while preserving their layout treatment; their published snapshots stay unchanged until an explicit publish. A regression exercises that complete Save/publish sequence. New drafts use the accepted catalog immediately.

Published pages include the finished clips. The Pending #025 section retains its full poster and written steps; only private status/Sample panels disappear. Reduced motion, JavaScript off, save-data and media failures use the existing static-image behavior. Near-viewport loading, mobile sources, VP9 fallback, offscreen pause, silent playback, scroll seeking and zero media layout shifts were checked in Chrome at 1440×900 and 390×844.

## Costs

Six Higgsfield media-cost rows for the Roofing kit were appended to `src/expenses-history.json`, including both rejected initial takes and the rejected #025 retake. The original **318 rows / 636 image credits** are unchanged. Each new row records ticket, model, seconds, retake, PT date, credits and provider job ID. The existing `higgsfield / credits` rate line is reused. The local platform rate is empty: amounts/rates remain null, the row description records **Rate not set at capture**, and the existing pricing function uses a configured rate if one is later supplied. No dollar value was invented and no Expenses UI/logic was changed. [local-expense-proof.json](local-expense-proof.json) verifies all six rows in the restarted local platform.

## Current-rule conflicts with older specifications

- Generation approval supersedes the Phase 1 “do not generate” placeholders. Only the named clips and allowed failure retakes were submitted.
- The exact #024 prompt specifies cool morning tabletop imagery, while its old photo was a warm exterior roof. The expressly permitted poster replacement resolves that mismatch with the extracted frame.
- “Ultra” is not a priced model tier; only the quoted model IDs/settings determined costs.
- The failed-retake rule takes precedence over attaching all four videos. #025 uses the approved public-poster fallback.
- Earlier Financing caption copy remains untouched under the protected-copy instruction; no image disclaimer or concept caption was added. Promotions remain complete with zero entered offers. The #017 financing eligibility gate is unchanged; local public Financing QA uses explicitly labeled test terms supplied through the contractor configuration.

## Verification and evidence preservation

Build and typecheck passed. **69 existing regression scripts**, **21 existing browser suites**, the platform mobile suite (**210 states**, zero layout failures), and the existing asset-integrity check (**627 files / 17 kits**) passed. Added **129 Phase 2 server checks** and **124 Phase 2 browser checks**; total browser suites: **22**. The original scroll-media integrity test decoded all 24 existing scroll films. The existing unchanged-response method confirms **304 byte-identical HTML responses across all 17 kits**, excluding only Roofing Financing and Promotions; see [outside-scope-proof.json](outside-scope-proof.json).

The four Phase 1 regression/browser pairs intentionally ran against a temporary copy of their original Pending catalog with the current player source. Their logs identify that fixture. The Ready catalog was restored and rebuilt in a finally block, then the new suites tested the actual deliveries. The old showpiece test now expects accepted ambient plus Pending Financing story. A missing local ffprobe was resolved with the checksum-verified portable Windows build linked from [FFmpeg's download page](https://ffmpeg.org/download.html); no global installation occurred. The existing callback-browser month-boundary fixture used its documented shared mid-month clock. Initial failures and corrected reruns are retained in [checks.json](checks.json).

Before any existing evidence was overwritten by test scripts, **6405 files** were backed up. All were restored and SHA-256 verified byte-for-byte, including prior dirty evidence. **265 pre-existing unrelated/untracked files** also retain their original hashes. [preservation.json](preservation.json) records the proof. Current rerun copies live only under this new folder's `rerun-evidence` and `regenerated-extra` directories.

There are **24 Phase 2 screenshots** listed in [browser-results.json](browser-results.json): both pages at desktop/phone, each accepted clip at its midpoint, reduced-motion and JavaScript-off posters, plus published #025 fallback. Native iPhone camera testing remains outside this clip task; the platform mobile suite retains its pre-existing device-only note.

Vite was restarted with `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`. All **27 QA page/asset URLs return 200**, recorded in [qa-urls.json](qa-urls.json). Review [Financing](http://127.0.0.1:5173/s/roofing-clips-phase2-qa/financing) and [Promotions](http://127.0.0.1:5173/s/roofing-clips-phase2-qa/promotions). These are local disposable QA fixtures, not a deployment.
