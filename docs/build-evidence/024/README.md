# #024 — Roofing Financing ambient media, Phase 1

**Phase 1 complete locally in stub mode.** The dedicated film remains **Pending / Not connected**. No generation vendor, lender or billing account was called. **Higgsfield credits used: 0.** No push, deployment or staging access. Phase 2 has not run. Its numeric credit quote is still unavailable; it is not represented as zero-cost production.

## What was already built and reused

- The Financing route, real contractor-supplied terms, lender selection, private preview and published snapshot already existed. Their lender adapter and calculations are unchanged. The existing scroll-story section and its full-duration player remain unchanged; #025 is not started.
- The installed ambient player lived in trade-components.js. It is now an exported shared player in ambient-video.js. Existing trade theaters follow their original branch; the new lazy option adds deferred source assignment, poster-first loading and the dedicated pause control. Existing cinematic and scroll-player regressions remain in force.
- #019's thumbnailVisual supplies the static photographic frame; the saved static effect deliberately leaves only the ambient film as the section's motion. The primitive itself is unchanged.
- Existing Roofing roofline/shingle background treatments and the existing serviceLayoutVariant selector are reused. The selected treatment is saved once and displayed at lower contrast beside the photograph.
- #023's settings, choice validation, manifest revisions, asset inventory, optimistic saves, history, role checks, backups and publication flow are reused. No parallel table, generation job, storage path or contractor editor was created. #023A's editor and controls are unchanged.

## What changed

The Roofing Financing page has a quiet photographic planning chapter between the financing benefits and the calculator. It explains the roof scope, decking questions and payment comparison without simulating approval or promising affordability. Its photograph, serif caption, numbered notes and estimate action remain readable with no JavaScript. Copy and CTA never wait for motion. A scrim protects the caption over an available clip.

The installed customer-detail roofing photograph was resized into two WebP posters. Its original file is unchanged. The 720px poster is **50,296 bytes**; the 1280px poster is **139,800 bytes**. Both are recorded in the manifest and selected with srcset. The poster is a representative illustration, never presented as this contractor's completed work or customer evidence.

public/planning-films.json has one versioned slot: roofing-financing-ambient-v1, target 8 seconds, 1920×1080, silent. It has an explicit null clip reference and Pending / Not connected state. New Roofing drafts record the full descriptor under settings.planningFilms and generationManifest.choices.planningFilms; the existing asset inventory records both posters and their source. Existing sites keep their current manifest on read. Their first ordinary draft save adds the fixed installed descriptor as a new revision, without changing their published snapshot or generation seed. Subsequent saves, renders, worker restarts, regeneration and republishing retain that saved selection. A future catalog change cannot silently replace an existing revision's choice. Until that first save, an older private preview can show the same fixed catalog proposal; no pending media appears publicly.

Preview shows a finished photographic section with a Sample badge and explicit missing-film status. Published pages omit the pending section entirely. The ready branch is fully implemented and exercised with an **installed roofing story clip as a clearly labeled local QA fixture only**. That clip is not saved into the production catalog or falsely approved as the future Financing film.

Available clips stay src-less until within 240px of the viewport, preload only then, play silently in view, and pause off-screen or when the document is hidden. Keyboard and touch controls pause/resume; a manual pause survives leaving and returning. A failed load retains the image. Reduced motion and data-saving preferences prevent source assignment and use the static image; no-JavaScript HTML already contains the poster, copy and links. Transitions are 120ms. Reserved geometry avoids media layout shift. Scoped scroll margins use the measured shared header height.

## Current-rule conflicts resolved

The older Pack 1 financing text and #004W/#017 assertions allowed hard-coded preview payment examples. The current #024 instruction prohibits those examples without the real lender adapter. **Only Roofing Financing** now uses the existing supplied-program path in preview as well as published mode. If no backed terms exist, private preview says payment options are not connected and links to the roof inquiry. No hypothetical monthly payment is inserted. All other trades' Financing HTML is unchanged, and lender choices/calculation logic are unchanged. Legal wording stays on /legal. Only the superseded Roofing payment assertions in showpiece-v4 and financing-states were updated; their other assertions remain intact.

## Verification

| Check | Result |
| --- | --- |
| Build and typecheck | Passed |
| Regression scripts, existing plus new | 66 passed |
| #024 server/HTML assertions | 344 passed, including 305 full-response identity checks |
| All browser suites | 18 passed |
| #024 browser assertions | 91 passed |
| Platform desktop/mobile states | 210 passed |
| Template asset integrity | 607 referenced files / 17 kits passed |
| Outside-scope output | 305 HTTP-200 pages across all 17 kits byte-identical |
| Media layout shift | 0 at desktop and phone in the installed-clip fixture |
| Sticky-heading targets | Planning chapter, calculator and contact clear the header |
| Restarted Vite checks | 8 affected URLs returned 200 |
| Viewport captures | 38, desktop 1440×900 and phone 390×844 |
| Evidence preservation | 2391 files restored byte-for-byte; 262 unrelated files unchanged |

checks.json and existing-browser-checks.json list every script result. browser-results.json lists state assertions and captures; outside-scope-baseline.json and outside-scope-proof.json hold before/after SHA-256 hashes and status codes. All 305 comparisons are actual 200 HTML responses, including every offered service in the fixture kits, homepages, city/core pages, Promotions and non-Roofing Financing. Existing #023 and #023A all-kit migration/hero checks also pass. Test-generated old evidence is restored after the run; copies of the current run's result summaries are stored here.

Vite was restarted with:

    node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173

Local preview: http://127.0.0.1:5173/s/roofing-ambient-024/financing?preview=1

Published supplied-terms fixture (pending media hidden): http://127.0.0.1:5173/s/roofing-ambient-024/financing

Unconnected draft: http://127.0.0.1:5173/s/roofing-ambient-empty-024/financing?preview=1

## Screenshots

All images below are real viewport captures, not cropped full-page substitutes. QA clip captures label the installed test clip in the image caption. They prove the player, not completed generation.

- [fixture-loading-desktop.png](fixture-loading-desktop.png)
- [fixture-loading-phone.png](fixture-loading-phone.png)
- [fixture-network-error-desktop.png](fixture-network-error-desktop.png)
- [fixture-network-error-phone.png](fixture-network-error-phone.png)
- [fixture-no-js-desktop.png](fixture-no-js-desktop.png)
- [fixture-no-js-phone.png](fixture-no-js-phone.png)
- [fixture-offline-desktop.png](fixture-offline-desktop.png)
- [fixture-offline-phone.png](fixture-offline-phone.png)
- [fixture-paused-focus-desktop.png](fixture-paused-focus-desktop.png)
- [fixture-paused-focus-phone.png](fixture-paused-focus-phone.png)
- [fixture-playing-desktop.png](fixture-playing-desktop.png)
- [fixture-playing-phone.png](fixture-playing-phone.png)
- [fixture-reduced-desktop.png](fixture-reduced-desktop.png)
- [fixture-reduced-phone.png](fixture-reduced-phone.png)
- [preview-calculator-desktop.png](preview-calculator-desktop.png)
- [preview-calculator-phone.png](preview-calculator-phone.png)
- [preview-no-js-desktop.png](preview-no-js-desktop.png)
- [preview-no-js-phone.png](preview-no-js-phone.png)
- [preview-notes-desktop.png](preview-notes-desktop.png)
- [preview-notes-phone.png](preview-notes-phone.png)
- [preview-page-desktop.png](preview-page-desktop.png)
- [preview-page-phone.png](preview-page-phone.png)
- [preview-pending-desktop.png](preview-pending-desktop.png)
- [preview-pending-phone.png](preview-pending-phone.png)
- [preview-planning-intro-desktop.png](preview-planning-intro-desktop.png)
- [preview-planning-intro-phone.png](preview-planning-intro-phone.png)
- [preview-poster-desktop.png](preview-poster-desktop.png)
- [preview-poster-phone.png](preview-poster-phone.png)
- [preview-reduced-desktop.png](preview-reduced-desktop.png)
- [preview-reduced-phone.png](preview-reduced-phone.png)
- [preview-unconnected-payments-desktop.png](preview-unconnected-payments-desktop.png)
- [preview-unconnected-payments-phone.png](preview-unconnected-payments-phone.png)
- [published-pending-hidden-desktop.png](published-pending-hidden-desktop.png)
- [published-pending-hidden-phone.png](published-pending-hidden-phone.png)
- [unconnected-payments-no-js-desktop.png](unconnected-payments-no-js-desktop.png)
- [unconnected-payments-no-js-phone.png](unconnected-payments-no-js-phone.png)
- [unconnected-payments-reduced-desktop.png](unconnected-payments-reduced-desktop.png)
- [unconnected-payments-reduced-phone.png](unconnected-payments-reduced-phone.png)

## Phase 2 — estimate and exact prompt; NOT RUN

Only the single #024 Roofing Financing ambient slot is included. No Financing scroll film, Promotions film or other trade rollout has been started.

| Page | Trade | Purpose | Length | Resolution / aspect | Proposed Higgsfield model | Clips | Credits per clip | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /s/:slug/financing | Roofing | Quiet planning still life beside the scope/payment explainer; seamless silent loop | 8 seconds | 1920×1080 / 16:9, central mobile-safe composition | Cinema Studio Video 3.0 (cinematic_studio_3_0), generate_audio=false | 1 | **Quote needed** | **1 × quoted rate; not yet numerically verified** |

**Production estimate: one generation for one eight-second clip, with a matching poster extracted locally. Credit total: unknown until an authorized provider quote is available.** Zero credits were spent and Phase 2 has no spend authorization. No retry allowance has been invented. If the first output is unusable, another generation would require a revised estimate/approval.

The model, duration, resolution and prompt follow the locally recorded September 23 catalog review in docs/product/PACK1_VIDEO_BRIEFS.md §3. That document records no per-clip credit tariff. K02 also says entitlement/credits are unverified. The current instruction expressly forbids calls to Higgsfield or another generation vendor, so neither a live quote nor the credit balance was checked. A numeric total cannot honestly be supplied from the available evidence; this is the one unfinished estimate item. Before Phase 2, obtain a quote for exactly these settings, present that total, and obtain explicit approval. Do not treat this README as approval to run anything.

Exact proposed prompt:

> Ultra — Cinema Studio Video 3.0, calm cinematic still-life realism. Make an 8-second silent 16:9 seamless ambient loop for a roofing Financing page. A pale oak planning table with a small unbranded roofing material sample, a blank open notebook, a closed pen and a softly out-of-focus home window behind it. Cooler morning light than the Promotions film; restrained blue-gray palette. Locked camera, extremely subtle light and curtain-shadow movement returning to the initial state. The emotion is thoughtful planning and comparison, not wealth, instant relief or approval. Keep the notebook and sample within the middle crop-safe zone, with quiet empty space around them. New customer variant changes table material, sample arrangement, window geometry and light direction. No people, hands, readable writing, calculator display, calendar numbers, cash, credit cards, rates, lender marks, phone numbers or sound. 1080p, generate_audio=false.

After an approved run: review the entire clip, extract and optimize a matching poster, encode an appropriately small silent web asset, register approved paths as a deliberate new draft revision, then rerun fallback/accessibility/weight checks before owner publication. No live lender connection is involved. **K02 remains open; #025 and all other tickets remain unstarted in this session.**
