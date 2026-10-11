# #025 — Roofing Financing decision story

**Phase 1 complete locally in stub mode. Dedicated film Pending; Phase 2 not run. Higgsfield credits used: 0.** No credit checks, vendor calls, credential access, generation, push, deployment or staging access took place. Part A was committed separately as 01a7175; its finished ambient chapter still publishes unchanged with its poster.

## What changed

Roofing Financing now has a distinct five-step decision story after the calculator and before the contact/next-step area. An installed roofing assessment photograph, quiet roofline treatment, large caption and clear contact link make a complete section while its film is missing. All five questions are present and readable immediately. The story invites the homeowner to understand the work, compare available paths, read the total cost and terms, apply only if they choose, then confirm the next step. It makes no approval or payment claim.

The old general roofing-build film in this Financing slot was replaced by this purpose-specific, versioned planning slot. It is **not** marked approved or generated. No changes were made to Promotions, other trades, the homepage hero/drone assets or the protected earlier features.

Published pages show the finished photograph, questions and action even while the film is Pending. Private previews add the Sample / Pending / Not connected media-status panel and remain noindex. No private status or Sample wording appears in the published page. The #017 lender adapter and contractor-supplied terms still exclusively control the calculator; no new payment examples or lender integrations were introduced.

## Reused and verified

| Existing piece | How it is reused |
|---|---|
| public/planning-films.json | Adds roofing-financing-scroll-v1 to the same versioned catalog; the #024 ambient descriptor is unchanged. |
| Existing scroll-story controller in constitution.ts | Extends its existing forward/reverse duration scrubbing with five visible DOM beats, a pause button, near-viewport loading, off-screen seek suspension, static data-saving mode and poster/error states scoped to this new slot. No second player. |
| ambient-video.js and #024 planning chapter | Remain unchanged. Their full existing lazy/pause/reduced/no-JS browser suite passed again. Before/after chapter HTML is identical in preview and published modes. |
| #019 thumbnailVisual | Supplies the same static responsive-image/error shell, with no change to the primitives. |
| Trade background treatment and seed | Reuses Roofing’s existing seed-selected treatment and section boundary styling. |
| #023 settings, manifest, validation and snapshots | Stores the slot ID/version, status, null clip, duration, model, purpose, focal point, five beats, seed-selected treatment and all three poster asset references. No new storage path or contractor controls. |

New site revisions record both media slots. Existing revisions keep their saved ambient descriptor and any saved scroll descriptor. An older draft gains the missing scroll slot on its next normal save from its existing seed; the read-time fallback uses the same fixed installed descriptor. That first migration is the only addition: later renders, saves, restarts, regeneration and republishing keep it unchanged, and normal saves retain the generation ID. Published snapshots stay private from draft changes. Owner/admin permissions, tenant checks and catalog/manifest validation are reused; arbitrary clip URLs, media references and catalog overrides are rejected. The existing generation and hero-editor regression suites also passed unchanged.

## Media and fallback behavior

| Installed image | Dimensions | Bytes |
|---|---:|---:|
| /assets/planning/roofing-scroll-720.webp | 720 × 483 | 87,376 |
| /assets/planning/roofing-scroll-1280.webp | 1280 × 858 | 243,736 |

Both are optimized local derivatives of /assets/service-showpiece/roofing-inspections-hero.webp. That source and the drone assets were not edited. Imagery is labeled illustrative, never customer-project proof. The image uses responsive srcset, explicit dimensions and lazy loading.

A future installed Ready clip has no src or autoplay in the HTML, is muted/inline and starts loading only near the viewport. The static image remains underneath while loading and on network failure. Scroll drives the full duration in both directions; video playback itself stays paused. The button pauses/resumes scrubbing with keyboard and touch, and seeking suspends off-screen or while the document is hidden. A 120ms opacity transition is the only entry transition. Reduced motion, data saving, unsupported observation and no JavaScript retain the finished poster/document layout, without a clip download. No content, caption or action waits for motion. Headers clear the section headings, and the ready stage fits below the sticky header on both evidence viewports.

The installed roofing-story.mp4 is used **only in explicitly labeled, in-memory QA test-fixture HTML** to exercise the Ready player. It is not saved into this pending slot or passed off as the new planning film. The dedicated film is the only unfinished production asset.

## Checks

Two pre-existing browser tests needed unchanged reruns: service-motion-browser hit a Playwright “Route is already handled” interception race, and expenses-browser checked for its new vendor row immediately after the editor closed. Both reruns passed (167 and 93 assertions respectively); their source and protected features were not modified. Original failure logs, first-attempt result JSON and retry logs are retained. The verification tables report the final successful results, not a claim that every first attempt passed.

| Verification | Result |
|---|---:|
| Build and typecheck | Pass |
| Existing + new regression scripts | 67 passed |
| #025 server/render assertions | 353 passed |
| Browser suites | 19 passed |
| #025 browser assertions | 155 passed |
| Platform mobile states | 210 passed |
| Template asset integrity | 609 references; all 17 kits passed |
| Outside-scope HTML | 305 HTTP-200 responses, all 17 kits byte-identical |
| #024 chapter HTML | Preview and published byte-identical to Part A |
| New story content layout shifts | None on desktop or phone |
| Whole-page CLS | 0.000614 desktop / 0 phone; desktop sources are the unchanged navigation and hero link |
| New section 390px overflow | None |
| Viewport screenshots | 60 |
| Vite route checks after restart | 8 returned 200 |
| Older evidence files restored byte-for-byte | 2698 |
| Unrelated dirty/untracked files preserved byte-for-byte | 262 |

See checks.json, final-checks.json, existing-browser-checks.json, regression-results.json, browser-results.json, seek-desktop.json, seek-phone.json, layout-shifts-desktop.json, layout-shifts-phone.json, outside-scope-proof.json, ambient-before.json, platform-mobile-audit.json and preservation.json. The finalized #025 browser suite was also rerun after the full runner had loaded its earlier revision, adding precise layout-shift-source assertions; all 155 assertions passed. The tiny desktop shift belongs to the unchanged header/hero text, with no source inside the story; the phone measurement is zero. All prior evidence regenerated by a suite was backed up first and restored after verification; current relevant results are copied into this folder. Build/browser logs are retained here. The required Vite command was restarted on 127.0.0.1:5173. Local QA routes:

- http://127.0.0.1:5173/s/roofing-ambient-025/financing — 200
- http://127.0.0.1:5173/s/roofing-ambient-025/financing?preview=1 — 200
- http://127.0.0.1:5173/s/roofing-ambient-empty-025/financing?preview=1 — 200
- http://127.0.0.1:5173/api/tenants/101ca114-5d44-4119-b664-fca4884c2c84/generation — 200
- http://127.0.0.1:5173/planning-films.json — 200
- http://127.0.0.1:5173/planning-scroll.css — 200
- http://127.0.0.1:5173/assets/planning/roofing-scroll-720.webp — 200
- http://127.0.0.1:5173/assets/planning/roofing-scroll-1280.webp — 200

## Viewport screenshots

Desktop is 1440×900; phone is 390×844. Each PNG is its own actual viewport capture. Preview and published page/intro/story/questions captures show the changed section and its surrounding page. Reduced-motion, no-JS and data-saving captures prove the static published experience. Fixture captures cover loading, forward/reverse progress, pause and network failure using the clearly labeled installed QA clip.

- [preview-page-desktop.png](preview-page-desktop.png)
- [preview-intro-desktop.png](preview-intro-desktop.png)
- [preview-story-desktop.png](preview-story-desktop.png)
- [preview-questions-desktop.png](preview-questions-desktop.png)
- [preview-status-desktop.png](preview-status-desktop.png)
- [published-page-desktop.png](published-page-desktop.png)
- [published-intro-desktop.png](published-intro-desktop.png)
- [published-story-desktop.png](published-story-desktop.png)
- [published-questions-desktop.png](published-questions-desktop.png)
- [fixture-loading-desktop.png](fixture-loading-desktop.png)
- [fixture-progress-0-1-desktop.png](fixture-progress-0-1-desktop.png)
- [fixture-progress-0.5-3-desktop.png](fixture-progress-0.5-3-desktop.png)
- [fixture-progress-1-5-desktop.png](fixture-progress-1-5-desktop.png)
- [fixture-progress-0.5-6-desktop.png](fixture-progress-0.5-6-desktop.png)
- [fixture-progress-0-7-desktop.png](fixture-progress-0-7-desktop.png)
- [fixture-progress-1-8-desktop.png](fixture-progress-1-8-desktop.png)
- [fixture-paused-desktop.png](fixture-paused-desktop.png)
- [fixture-network-error-desktop.png](fixture-network-error-desktop.png)
- [fixture-reduced-desktop.png](fixture-reduced-desktop.png)
- [published-reduced-intro-desktop.png](published-reduced-intro-desktop.png)
- [published-reduced-story-desktop.png](published-reduced-story-desktop.png)
- [published-reduced-questions-desktop.png](published-reduced-questions-desktop.png)
- [fixture-no-js-desktop.png](fixture-no-js-desktop.png)
- [published-no-js-intro-desktop.png](published-no-js-intro-desktop.png)
- [published-no-js-story-desktop.png](published-no-js-story-desktop.png)
- [published-no-js-questions-desktop.png](published-no-js-questions-desktop.png)
- [fixture-save-data-desktop.png](fixture-save-data-desktop.png)
- [published-save-data-intro-desktop.png](published-save-data-intro-desktop.png)
- [published-save-data-story-desktop.png](published-save-data-story-desktop.png)
- [published-save-data-questions-desktop.png](published-save-data-questions-desktop.png)
- [preview-page-phone.png](preview-page-phone.png)
- [preview-intro-phone.png](preview-intro-phone.png)
- [preview-story-phone.png](preview-story-phone.png)
- [preview-questions-phone.png](preview-questions-phone.png)
- [preview-status-phone.png](preview-status-phone.png)
- [published-page-phone.png](published-page-phone.png)
- [published-intro-phone.png](published-intro-phone.png)
- [published-story-phone.png](published-story-phone.png)
- [published-questions-phone.png](published-questions-phone.png)
- [fixture-loading-phone.png](fixture-loading-phone.png)
- [fixture-progress-0-1-phone.png](fixture-progress-0-1-phone.png)
- [fixture-progress-0.5-3-phone.png](fixture-progress-0.5-3-phone.png)
- [fixture-progress-1-5-phone.png](fixture-progress-1-5-phone.png)
- [fixture-progress-0.5-6-phone.png](fixture-progress-0.5-6-phone.png)
- [fixture-progress-0-7-phone.png](fixture-progress-0-7-phone.png)
- [fixture-progress-1-8-phone.png](fixture-progress-1-8-phone.png)
- [fixture-paused-phone.png](fixture-paused-phone.png)
- [fixture-network-error-phone.png](fixture-network-error-phone.png)
- [fixture-reduced-phone.png](fixture-reduced-phone.png)
- [published-reduced-intro-phone.png](published-reduced-intro-phone.png)
- [published-reduced-story-phone.png](published-reduced-story-phone.png)
- [published-reduced-questions-phone.png](published-reduced-questions-phone.png)
- [fixture-no-js-phone.png](fixture-no-js-phone.png)
- [published-no-js-intro-phone.png](published-no-js-intro-phone.png)
- [published-no-js-story-phone.png](published-no-js-story-phone.png)
- [published-no-js-questions-phone.png](published-no-js-questions-phone.png)
- [fixture-save-data-phone.png](fixture-save-data-phone.png)
- [published-save-data-intro-phone.png](published-save-data-intro-phone.png)
- [published-save-data-story-phone.png](published-save-data-story-phone.png)
- [published-save-data-questions-phone.png](published-save-data-questions-phone.png)

## Spec differences

The ticket’s approved-film completion is fulfilled in the explicitly authorized Phase 1 stub mode. Its film gate remains open in NEEDS-KEYS.md and BUILD-STATUS.md. The current publishing rule overrides hiding a finished section when only its film is pending. The video brief’s financial-anxiety-to-approval framing and illustrative-financing caption were replaced with the honest decision sequence above; approval is never implied, and lender legal/disclosure wording stays on /legal apart from APR/term beside a real configured payment. The current user instruction also overrides any sample monthly-payment suggestion in older packs. UX timing is 120ms and all motion is static under reduced motion. No unresolved spec/UX conflict was bypassed.

## Phase 2 — estimate only, not authorized to run

| Page | Trade | Purpose | Length | Resolution | Proposed Higgsfield model | Generations | Credits |
|---|---|---|---:|---|---|---:|---|
| Financing, roofing-financing-scroll-v1 | Roofing | One coherent five-beat planning story, readable without implying an offer or approval | 12 seconds | 1920×1080, 16:9; center-safe phone crop | Seedance 2.5 (seedance_2_5), Ultra / reference-driven if supported | 1 | quote needed |

**#025 total: 1 clip / 1 proposed generation; credits: quote needed.** The earlier #024 estimate adds one separate 8-second ambient clip, so the later combined estimate will contain **2 clips**. No tariff, entitlement, supported parameter combination or provider capability was checked during this zero-call phase. Obtain a provider quote and approval before any generation; do not assume a price or spend allowance. Retain center-safe props for the phone crop, and extract the final matching WebP poster locally after approval.

Exact proposed prompt:

> Ultra — Seedance 2.5, reference-driven cinematic planning narrative. Produce a 12-second silent 16:9 film about understanding payment choices for a roofing project. Maintain one refined tabletop/home visual world. 0–3 seconds: a roof material sample and closed blank project folder, suggesting the project needs definition. 3–6 seconds: a gentle camera move reveals three separate neutral blank document folders arranged for comparison, with no lender marks or financial figures. 6–9 seconds: an overhead view organizes the folders beside a blank calendar and project sample, suggesting careful reading and timing rather than automatic approval. 9–12 seconds: camera settles on the orderly planning composition with the home visible softly beyond the window, a considered next step without a celebratory payoff. Keep transitions smooth and architecture stable; hold the first and last half-second. Center important props for mobile crop; leave lower space for real DOM captions. New customer variant changes tabletop, folder geometry, roof sample and camera arc. No readable text, prices, APRs, money rain, credit cards, fake charts, signatures, handshake, distressed homeowner, lender branding or audio. 1080p, approved reference mode if supplied, generate_audio=false.

No other ticket was started.
