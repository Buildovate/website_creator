# #027 — Roofing Promotions written-estimate story

**Phase 1 complete locally in stub mode. The dedicated film is Pending / Not connected. Higgsfield credits used: 0. Phase 2 was not run.** No vendor calls, credit checks, credential access, generation, push, deployment or staging access took place.

## What changed

The old generic project-to-payment film on Roofing Promotions is replaced by a distinct four-beat story about putting an offer into the written estimate. A new installed roof-detail photograph anchors a dark editorial stage; every beat and the contact action stay readable before a clip exists. A later approved clip will scrub forward and backward using the existing #025 controller.

The finished section is public with its poster, whether or not any offers have been entered. Only private preview media-status panels and Sample badges disappear on publish. Preview remains noindex. For Roofing, an enabled Promotions page can now show its useful guidance even with zero enabled offers. Its no-offer opening invites a roof conversation; empty offer cards, the invented preview maintenance-offer tile and the unlock steps are omitted. Disabling the page still returns 404. Other trades retain their existing gates, and homepage/navigation behavior was not changed. Only contractor-entered offers render as offer cards. Their actual terms remain linked to /legal; the new chapters add no terms, disclaimers, deal, percentage, price, date, deadline or countdown.

Part A’s ambient chapter is unchanged, including its photograph, copy, private status, manifest choice and player. The story says something different: how the offer and the job’s written description belong in the same estimate.

## Existing Promotions sections and distinct purpose

| Section | Existing job | Relationship to this ticket |
|---|---|---|
| Hero and ribbon | Introduce the page and lead to entered offers | Offer-free Roofing opening is honest when none exist. |
| How it works | Browse, answer the configured challenge, contact the business with its code | Quiz behavior, storage and verification are unchanged; hidden with no offers. |
| Current / upcoming / expired offer groups | Show saved contractor offer records, dates and unlock controls | No generated offers; stored dates and legal links retained. |
| #026 ambient chapter | Plan access, routines, material space and cleanup around an occupied home | Retained unchanged; wide photo and unnumbered prose. |
| Project story slot | Previously a general project-to-payment video with Imagine / Understand / Make a plan | Replaced with offer-to-estimate reconciliation, using a different photo and visible narrative beats. |
| Inquiry and footer | A project conversation and shared navigation | Existing form, consent, source attribution and footer reused unchanged. |

## What was reused

- **public/planning-films.json:** new versioned roofing-promotions-scroll-v1 slot in the shared catalog, with null clip, Pending status and Not connected generation state.
- **#025 scroll-story controller in src/client/site/constitution.ts:** reused unchanged, with forward/reverse seeking through the whole duration, visible DOM beats, pause/resume, near-viewport loading, off-screen seek suspension and static data-saving/error states. The existing data hook is reused; there is no second controller.
- **#019 thumbnailVisual:** existing static image/error shell; no primitive changes. New locally optimized WebP derivatives use 720/1280 srcset, explicit dimensions and lazy loading. Original images are untouched.
- **Roofing background treatments:** existing seed-selected roofline treatment under the prose/beat surface; no new random rendering path.
- **#023 settings/manifest/validation/snapshots:** the existing planningFilms extension records slot ID/version, status, null clip, duration, model, purpose, focal point, beats, treatment and all poster/source references. Existing descriptors are preserved verbatim. Older drafts add only the missing slot on their next save; no render-time reroll or generation occurs. Normal saves keep the generation ID. Repeated saves, renders, restart, regeneration and republishing keep the choice stable. Drafts stay private until owner publication; existing role, tenant and validation gates are reused. No new storage path or contractor controls; no extra Save button.
- **Header sizing:** existing shared ResizeObserver updates the header offset; scoped CSS keeps this chapter’s headings below it without altering the protected Financing markup.

The new maintenance roof-detail photo differs from #020’s roof-repair scope, #024’s customer-detail photo and #025’s inspections hero, and from #026’s craft banner. This is generic installed site artwork; no copy presents it as a customer project or business proof.

| Poster | Bytes |
|---|---:|
| /assets/planning/roofing-promotions-scroll-720.webp | 57,350 |
| /assets/planning/roofing-promotions-scroll-1280.webp | 130,378 |

## States, accessibility and verification

Posters reserve their space before loading. All prose, headings and actions are server-rendered and remain readable with no JavaScript. Reduced motion and data saving leave a finished static image and make no request for the new clip. A future Ready clip is silent with preload=none and no initial src; the shared player loads it only near the viewport. The image remains behind it during loading or failure. Entry opacity is 120ms; no moving text or delayed content. At 390px there is no horizontal overflow, controls are at least 44px, and visible keyboard focus and header offsets are checked. No layout shift was attributed to the new section. Whole-page fixture shifts, where present, are recorded with DOM sources in layout-shifts files; they belong to the existing hero/navigation and QA banner rather than the new section.

The local Ready fixture uses /assets/films/roofing-story.mp4 only to exercise the player, is explicitly labeled QA, and is never saved into the catalog or tenant media choice. The real dedicated film remains missing.

| Check | Final result |
|---|---:|
| Build / typecheck / template asset integrity | Pass |
| Regression scripts | 69 passed |
| New server/render assertions | 362 passed |
| Browser suites | 21 passed |
| New browser assertions | 177 passed |
| Platform mobile states | 210 passed |
| Outside-scope HTML | 306 HTTP-200 responses across 17 kits, byte-identical |
| Viewport captures | 66 |
| Restarted Vite QA URLs | 9 returned 200 |
| Prior evidence restored byte-for-byte | 3125 files |
| Unrelated dirty/untracked files preserved byte-for-byte | 262 files |

The existing callback browser suite assumes today + four days is still in the visible month. On this run that fixture crossed the September/October boundary. Its unchanged normal run and retry failed; the unchanged suite passed using the documented matching Node/browser mid-month clock in callback-calendar-clock.mjs. A first controlled-date attempt used a past date and expired its fictional browser cookie; that diagnostic failure is also retained when applicable. Platform code and callback test source were not edited. The same documented clock is used for this part. The missing story slot inherits the saved Promotions background when migrating a site that already regenerated; two added migration assertions pass. The ambient browser check was scoped to its own status panel after the second panel made its page-wide selector ambiguous. No ambient rendering or player behavior changed. Build, typecheck, all regression scripts, generation browser checks and both Promotions browser suites were repeated after these final corrections. Original logs remain available.

Other unchanged browser retries: promotions-ambient-browser. See checks.json and any retry logs for attempt results; final counts do not imply that every first attempt passed. The outside-scope baseline is captured before source changes, and proof is produced by actual worker responses. Existing evidence was backed up before any suite and restored afterward. Current suite results are retained separately in this folder. Vite was restarted with node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173; route-check.json lists each published/preview/no-offer/media URL.

## Viewport evidence

Desktop: 1440×900. Phone: 390×844. Each PNG is a real viewport capture. Preview and published pages, the new chapter, no-offer pages, reduced motion, no-JS and data saving are included. Ready fixture captures cover loading, playback/progress, pause and network failure; the fixture label is test-only.

- [preview-page-desktop.png](preview-page-desktop.png)
- [preview-intro-desktop.png](preview-intro-desktop.png)
- [preview-story-desktop.png](preview-story-desktop.png)
- [preview-questions-desktop.png](preview-questions-desktop.png)
- [preview-status-desktop.png](preview-status-desktop.png)
- [published-page-desktop.png](published-page-desktop.png)
- [published-intro-desktop.png](published-intro-desktop.png)
- [published-story-desktop.png](published-story-desktop.png)
- [published-questions-desktop.png](published-questions-desktop.png)
- [published-no-offers-page-desktop.png](published-no-offers-page-desktop.png)
- [published-no-offers-intro-desktop.png](published-no-offers-intro-desktop.png)
- [published-no-offers-story-desktop.png](published-no-offers-story-desktop.png)
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
- [published-no-offers-page-phone.png](published-no-offers-page-phone.png)
- [published-no-offers-intro-phone.png](published-no-offers-intro-phone.png)
- [published-no-offers-story-phone.png](published-no-offers-story-phone.png)
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

## Conflicts resolved in favor of the current request

- Pack A’s prestige urgency, demo offers, deadlines/countdowns, generated promotional graphics and claim-copy suggestions do not authorize inventing or generating an offer. Only saved contractor records appear; this chapter is useful without one.
- Pack D’s immediate two-film production and approved-film completion are deferred by the explicitly authorized Phase 1 stub. The finished poster section publishes; only private media status/Sample decoration is removed. K02 remains open.
- Pack captions suggesting illustrative/concept labels are overridden by the explicit no-caption instruction for these sections. No business proof is inferred from the imagery.
- Pack disclaimers beside the story and older financing example suggestions are superseded by legal-only-on-/legal and the protected #017 lender rules. Financing output is byte-identical and no example payment is introduced.
- Pack regeneration requests do not trigger vendor production or reroll saved choices; the manifest keeps the installed selections stable.
- The local one-ticket-per-session convention is superseded by the explicit two-part request, with one local commit per part. No other ticket is started.

## Phase 2 — proposed clip only

| Page | Trade | Purpose | Length | Resolution | Proposed Higgsfield model | Generations | Credits |
|---|---|---|---:|---|---|---:|---|
| Promotions | Roofing | Reconcile a relevant entered offer with the written roofing estimate | 12s | 1920×1080, 16:9, center-safe phone crop | Seedance 2.5 (seedance_2_5) | 1 | quote needed |

Exact proposed prompt:

> Ultra — Seedance 2.5, reference-driven premium roofing planning narrative. Create a 12-second silent 16:9 film in one coherent architectural and tabletop setting. 0–3 seconds: a residential roof detail and a homeowner's blank project folder resting on a nearby table. 3–6 seconds: a smooth camera move across unbranded shingle and flashing samples beside a blank sheet, showing the work being defined. 6–9 seconds: a second plain sheet aligns with the first, suggesting an offer being reconciled with a written estimate, without readable text, figures or signatures. 9–12 seconds: settle on the tidy folder and selected material detail with the same home softly visible beyond. Show a considered planning conversation, never an automatic discount, approval or completed customer job. Preserve home geometry, camera direction and prop continuity; restrained transitions, stable first and last half-second. Keep essential details in the central phone-safe crop and leave room for separate readable DOM copy. New customer variant changes roof geometry, sample textures, table dressing and camera arc. No visible text, numbers, prices, discount badges, percentages, countdowns, deadlines, lenders, brand marks, testimonial actors, unsafe work or audio. 1080p, approved reference mode if available, generate_audio=false.

One clip / one proposed generation. Credits **quote needed**. No provider availability, supported parameters, entitlement or current tariff was queried. Approval and a quote are required before generation; inspect actual duration, visual continuity, mobile crop, seek behavior and poster match after production. Source photo remains in place until the film is approved. No other unfinished Phase 1 item is claimed as live integration.

## Combined future estimate — all four planned clips

| Ticket | Page / purpose | Length | Resolution | Proposed model | Generations | Credits |
|---|---|---:|---|---|---:|---|
| #024 | Financing ambient / understand roof scope calmly | 8s | 1920×1080 | Cinema Studio Video 3.0 | 1 | quote needed |
| #025 | Financing scroll / understand payment choices | 12s | 1920×1080 | Seedance 2.5 | 1 | quote needed |
| #026 | Promotions ambient / plan around everyday life | 8s | 1920×1080 | Cinema Studio Video 3.0 | 1 | quote needed |
| #027 | Promotions scroll / offer into written estimate | 12s | 1920×1080 | Seedance 2.5 | 1 | quote needed |

**4 clips / 4 proposed generations. Total credits: quote needed. Credits used across these phases: 0.** Nothing has been generated or ordered. Each clip has a different purpose, framing and prompt; none is a duplicate film under another slot name.
