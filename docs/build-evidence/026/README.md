# #026 — Roofing Promotions ambient planning chapter

**Phase 1 complete locally in stub mode. The dedicated film is Pending / Not connected. Higgsfield credits used: 0. Phase 2 was not run.** No vendor calls, credit checks, credential access, generation, push, deployment or staging access took place.

## What changed

The new “A home to care for. A day to carry on with.” chapter combines a wide roof-detail photograph with two short prose blocks about entrances, daily routines, material placement and cleanup. It sits beside the offer journey without presenting an offer of its own. The shared ambient player is ready for a future approved clip, but no new film is downloaded or claimed today.

The finished section is public with its poster, whether or not any offers have been entered. Only private preview media-status panels and Sample badges disappear on publish. Preview remains noindex. For Roofing, an enabled Promotions page can now show its useful guidance even with zero enabled offers. Its no-offer opening invites a roof conversation; empty offer cards, the invented preview maintenance-offer tile and the unlock steps are omitted. Disabling the page still returns 404. Other trades retain their existing gates, and homepage/navigation behavior was not changed. Only contractor-entered offers render as offer cards. Their actual terms remain linked to /legal; the new chapters add no terms, disclaimers, deal, percentage, price, date, deadline or countdown.

The two prose blocks are not numbered. There is no image caption or “illustrative/concept” label on this chapter; the descriptive image alternative text names the roof detail without attributing it to a customer.

## Existing Promotions sections and distinct purpose

| Section | Existing job | Relationship to this ticket |
|---|---|---|
| Hero and ribbon | Introduce the page and lead to entered offers | Offer-free Roofing opening is honest when none exist. |
| How it works | Browse, answer the configured challenge, contact the business with its code | Quiz behavior, storage and verification are unchanged; hidden with no offers. |
| Current / upcoming / expired offer groups | Show saved contractor offer records, dates and unlock controls | No generated offers; stored dates and legal links retained. |
| #026 ambient chapter | Plan access, routines, material space and cleanup around an occupied home | New; practical household logistics, not another scope/payment or unlock checklist. |
| Project story slot | Previously a general project-to-payment video with Imagine / Understand / Make a plan | Retained for the separately authorized #027 pass; this ambient chapter does not repeat its scope/payment narrative. |
| Inquiry and footer | A project conversation and shared navigation | Existing form, consent, source attribution and footer reused unchanged. |

## What was reused

- **public/planning-films.json:** new versioned roofing-promotions-ambient-v1 slot in the shared catalog, with null clip, Pending status and Not connected generation state.
- **src/client/site/ambient-video.js:** reused unchanged with lazy source assignment, muted inline looping, keyboard/touch pause, off-screen/background pause and static reduced-motion/data-saving/error fallbacks.
- **#019 thumbnailVisual:** existing static image/error shell; no primitive changes. New locally optimized WebP derivatives use 720/1280 srcset, explicit dimensions and lazy loading. Original images are untouched.
- **Roofing background treatments:** existing seed-selected roofline treatment under the prose/beat surface; no new random rendering path.
- **#023 settings/manifest/validation/snapshots:** the existing planningFilms extension records slot ID/version, status, null clip, duration, model, purpose, focal point, beats, treatment and all poster/source references. Existing descriptors are preserved verbatim. Older drafts add only the missing slot on their next save; no render-time reroll or generation occurs. Normal saves keep the generation ID. Repeated saves, renders, restart, regeneration and republishing keep the choice stable. Drafts stay private until owner publication; existing role, tenant and validation gates are reused. No new storage path or contractor controls; no extra Save button.
- **Header sizing:** existing shared ResizeObserver updates the header offset; scoped CSS keeps this chapter’s headings below it without altering the protected Financing markup.

The new slate/copper roof photo differs from #020’s roof-repair scope, #024’s customer-detail photo and #025’s inspections hero. This is generic installed site artwork; no copy presents it as a customer project or business proof.

| Poster | Bytes |
|---|---:|
| /assets/planning/roofing-promotions-ambient-720.webp | 48,376 |
| /assets/planning/roofing-promotions-ambient-1280.webp | 120,386 |

## States, accessibility and verification

Posters reserve their space before loading. All prose, headings and actions are server-rendered and remain readable with no JavaScript. Reduced motion and data saving leave a finished static image and make no request for the new clip. A future Ready clip is silent with preload=none and no initial src; the shared player loads it only near the viewport. The image remains behind it during loading or failure. Entry opacity is 120ms; no moving text or delayed content. At 390px there is no horizontal overflow, controls are at least 44px, and visible keyboard focus and header offsets are checked. No layout shift was attributed to the new section. Whole-page fixture shifts, where present, are recorded with DOM sources in layout-shifts files; they belong to the existing hero/navigation and QA banner rather than the new section.

The local Ready fixture uses /assets/films/roofing-story.mp4 only to exercise the player, is explicitly labeled QA, and is never saved into the catalog or tenant media choice. The real dedicated film remains missing.

| Check | Final result |
|---|---:|
| Build / typecheck / template asset integrity | Pass |
| Regression scripts | 68 passed |
| New server/render assertions | 354 passed |
| Browser suites | 20 passed |
| New browser assertions | 139 passed |
| Platform mobile states | 210 passed |
| Outside-scope HTML | 306 HTTP-200 responses across 17 kits, byte-identical |
| Viewport captures | 72 |
| Restarted Vite QA URLs | 9 returned 200 |
| Prior evidence restored byte-for-byte | 2907 files |
| Unrelated dirty/untracked files preserved byte-for-byte | 262 files |

The existing callback browser suite assumes today + four days is still in the visible month. On this run that fixture crossed the September/October boundary. Its unchanged normal run and retry failed; the unchanged suite passed using the documented matching Node/browser mid-month clock in callback-calendar-clock.mjs. A first controlled-date attempt used a past date and expired its fictional browser cookie; that diagnostic failure is also retained when applicable. Platform code and callback test source were not edited. The old constitution no-offer 404 assertion was updated for the requested Roofing publication behavior; its first failure and corrected passing result are retained. The two earlier Financing baseline tests now exclude only the intentionally changed Roofing Promotions preview; this ticket’s new baseline explicitly includes the protected Roofing Financing page in preview and published modes.

Other unchanged browser retries: none. See checks.json and any retry logs for attempt results; final counts do not imply that every first attempt passed. The outside-scope baseline is captured before source changes, and proof is produced by actual worker responses. Existing evidence was backed up before any suite and restored afterward. Current suite results are retained separately in this folder. Vite was restarted with node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173; route-check.json lists each published/preview/no-offer/media URL.

## Viewport evidence

Desktop: 1440×900. Phone: 390×844. Each PNG is a real viewport capture. Preview and published pages, the new chapter, no-offer pages, reduced motion, no-JS and data saving are included. Ready fixture captures cover loading, playback/progress, pause and network failure; the fixture label is test-only.

- [preview-page-desktop.png](preview-page-desktop.png)
- [preview-planning-intro-desktop.png](preview-planning-intro-desktop.png)
- [preview-poster-desktop.png](preview-poster-desktop.png)
- [preview-notes-desktop.png](preview-notes-desktop.png)
- [preview-pending-desktop.png](preview-pending-desktop.png)
- [preview-chapter-desktop.png](preview-chapter-desktop.png)
- [preview-no-offers-desktop.png](preview-no-offers-desktop.png)
- [published-page-desktop.png](published-page-desktop.png)
- [published-planning-chapter-desktop.png](published-planning-chapter-desktop.png)
- [published-planning-poster-desktop.png](published-planning-poster-desktop.png)
- [published-no-offers-page-desktop.png](published-no-offers-page-desktop.png)
- [published-no-offers-chapter-desktop.png](published-no-offers-chapter-desktop.png)
- [published-no-offers-photo-desktop.png](published-no-offers-photo-desktop.png)
- [fixture-loading-desktop.png](fixture-loading-desktop.png)
- [fixture-playing-desktop.png](fixture-playing-desktop.png)
- [fixture-paused-focus-desktop.png](fixture-paused-focus-desktop.png)
- [fixture-network-error-desktop.png](fixture-network-error-desktop.png)
- [fixture-offline-desktop.png](fixture-offline-desktop.png)
- [fixture-reduced-desktop.png](fixture-reduced-desktop.png)
- [preview-reduced-desktop.png](preview-reduced-desktop.png)
- [published-reduced-chapter-desktop.png](published-reduced-chapter-desktop.png)
- [published-reduced-photo-desktop.png](published-reduced-photo-desktop.png)
- [published-reduced-copy-desktop.png](published-reduced-copy-desktop.png)
- [no-offers-reduced-desktop.png](no-offers-reduced-desktop.png)
- [fixture-no-js-desktop.png](fixture-no-js-desktop.png)
- [preview-no-js-desktop.png](preview-no-js-desktop.png)
- [published-no-js-chapter-desktop.png](published-no-js-chapter-desktop.png)
- [published-no-js-photo-desktop.png](published-no-js-photo-desktop.png)
- [published-no-js-copy-desktop.png](published-no-js-copy-desktop.png)
- [no-offers-no-js-desktop.png](no-offers-no-js-desktop.png)
- [fixture-save-data-desktop.png](fixture-save-data-desktop.png)
- [preview-save-data-desktop.png](preview-save-data-desktop.png)
- [published-save-data-chapter-desktop.png](published-save-data-chapter-desktop.png)
- [published-save-data-photo-desktop.png](published-save-data-photo-desktop.png)
- [published-save-data-copy-desktop.png](published-save-data-copy-desktop.png)
- [no-offers-save-data-desktop.png](no-offers-save-data-desktop.png)
- [preview-page-phone.png](preview-page-phone.png)
- [preview-planning-intro-phone.png](preview-planning-intro-phone.png)
- [preview-poster-phone.png](preview-poster-phone.png)
- [preview-notes-phone.png](preview-notes-phone.png)
- [preview-pending-phone.png](preview-pending-phone.png)
- [preview-chapter-phone.png](preview-chapter-phone.png)
- [preview-no-offers-phone.png](preview-no-offers-phone.png)
- [published-page-phone.png](published-page-phone.png)
- [published-planning-chapter-phone.png](published-planning-chapter-phone.png)
- [published-planning-poster-phone.png](published-planning-poster-phone.png)
- [published-no-offers-page-phone.png](published-no-offers-page-phone.png)
- [published-no-offers-chapter-phone.png](published-no-offers-chapter-phone.png)
- [published-no-offers-photo-phone.png](published-no-offers-photo-phone.png)
- [fixture-loading-phone.png](fixture-loading-phone.png)
- [fixture-playing-phone.png](fixture-playing-phone.png)
- [fixture-paused-focus-phone.png](fixture-paused-focus-phone.png)
- [fixture-network-error-phone.png](fixture-network-error-phone.png)
- [fixture-offline-phone.png](fixture-offline-phone.png)
- [fixture-reduced-phone.png](fixture-reduced-phone.png)
- [preview-reduced-phone.png](preview-reduced-phone.png)
- [published-reduced-chapter-phone.png](published-reduced-chapter-phone.png)
- [published-reduced-photo-phone.png](published-reduced-photo-phone.png)
- [published-reduced-copy-phone.png](published-reduced-copy-phone.png)
- [no-offers-reduced-phone.png](no-offers-reduced-phone.png)
- [fixture-no-js-phone.png](fixture-no-js-phone.png)
- [preview-no-js-phone.png](preview-no-js-phone.png)
- [published-no-js-chapter-phone.png](published-no-js-chapter-phone.png)
- [published-no-js-photo-phone.png](published-no-js-photo-phone.png)
- [published-no-js-copy-phone.png](published-no-js-copy-phone.png)
- [no-offers-no-js-phone.png](no-offers-no-js-phone.png)
- [fixture-save-data-phone.png](fixture-save-data-phone.png)
- [preview-save-data-phone.png](preview-save-data-phone.png)
- [published-save-data-chapter-phone.png](published-save-data-chapter-phone.png)
- [published-save-data-photo-phone.png](published-save-data-photo-phone.png)
- [published-save-data-copy-phone.png](published-save-data-copy-phone.png)
- [no-offers-save-data-phone.png](no-offers-save-data-phone.png)

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
| Promotions | Roofing | Quiet roof-detail scene supporting practical planning around an occupied home | 8s | 1920×1080, 16:9, center-safe phone crop | Cinema Studio Video 3.0 (cinematic_studio_3_0) | 1 | quote needed |

Exact proposed prompt:

> Ultra — Cinema Studio Video 3.0, cinematic photoreal architectural detail. Create an 8-second silent 16:9 ambient loop for a Roofing Promotions planning chapter. A slate roof edge with refined copper flashing beside a stone gable, in warm late-afternoon light. A quiet garden and window suggest an occupied home and everyday routines, without people or a claimed customer project. Locked composition with an almost imperceptible lateral drift returning to its opening position; a soft branch shadow moves gently over the material. Keep the main roof detail central for the phone crop. Match the opening and closing light and shadow; no cuts, renovation transformation or urgency. New customer variation changes roof geometry, flashing detail, garden and light direction. No text, logos, offer badge, price, discount, percentage, deadline, countdown, branded tools, unsafe work, customer testimonial or audio. 1080p, generate_audio=false.

One clip / one proposed generation. Credits **quote needed**. No provider availability, supported parameters, entitlement or current tariff was queried. Approval and a quote are required before generation; inspect actual duration, visual continuity, mobile crop, seek behavior and poster match after production. Source photo remains in place until the film is approved. No other unfinished Phase 1 item is claimed as live integration.
