# #020 — One distinct Roofing planning story

Completed locally on 2026-09-26. No push, deployment, staging access, vendor connection or paid generation. Higgsfield credits used: **0**. Nothing required for this ticket remains unfinished. #021 was not started.

## Built and reused

The Roofing roof-repair journey has one photographic planning chapter, **“A small leak. A bigger question.”** It helps a homeowner distinguish a contained defect from a roof that needs a wider assessment without diagnosing their house or promising a result. Three notes explain tracing the entry, checking surrounding materials and defining the written scope. A separate dark-green editorial composition, large vent/flashing photo, generous typography and a restrained water-path graphic distinguish it from the flight hero, service tiles and #018 action.

| Use | Implementation / reuse |
| --- | --- |
| Homepage, after the existing process/layer story and before comparison/gallery | src/roofing-story.js through src/conversion-page.js; only Roofing roof-repair journey |
| Center visual | Existing /assets/service-showpiece/roofing-roof-repair-scope.webp (1536×1030); illustrative generated Roofing photograph, not project proof; no hero footage repeated |
| Connecting graphic | New low-contrast, decorative /assets/stories/roofing.svg; no measurements or asserted condition |
| Three supporting notes | Always-visible semantic ordered list; desktop beside image, phone below it |
| Next step | Existing native #contact anchor and data-service-link handler; preselects the first offered Roof repair, Roof replacement or Inspections option; no-JS form remains fully usable |
| Saved visibility | Existing Design → Planning questions effect (effects.planning); saved draft/public snapshot behavior reused |
| Motion | Existing conversion bundle and post-hero loading gate; one-shot 120ms decorative 3px path / small rule settle. No text, caption, image or CTA opacity reveal; no pinning or scrub |

The previous LayerExplode, StickyStack, comparison and inquiry behavior already existed and remains intact. The chapter follows these earlier scenes rather than interrupting their lazy-load proximity: an initial placement delayed the process module enough to move the contact anchor. Moving the new chapter resolved that interaction; the #018 browser suite passes unchanged. #019 primitives, #016 quiz, #017 financing, Expenses, all drone/hero assets and other trades are unchanged.

## Rules and scope decisions

Root #020 requests one Roofing story, so the wider Pack G all-trade concepts and new custom card/image editors are not part of this ticket. Existing Planning questions control is reused. UX-RULES’ sub-150ms timing and current always-visible-content rule override Pack G’s 0.6–1.2s stagger: only decorative accents settle at 120ms. Reduced motion, touch and no JavaScript show the finished static composition; captions and CTAs are never delayed. No customer reviews, outcomes, rates, prices, warranty claims or fake urgency are added.

Preview adds a visible **Sample** label and retains noindex. Published output removes that label while preserving illustrative-image attribution; it does not present the image as completed customer work. If the chapter is disabled or none of its relevant selected services exists, the entire chapter is omitted—no empty panel. Other Roofing journeys/templates are not silently switched to this journey.

## State coverage

Loaded/public and preview, initial decorative rest, settled/focus, reduced-motion, no-JS, slow image and failed image are captured. Fixed image aspect ratio reserves geometry during download/decode. Image failure replaces the visual with an honest message while keeping every note and the next step. Offline navigation has no new network-dependent action: an already-loaded page retains the static guide and native form link. Empty/unsupported selection renders no chapter. No new submission or success state is introduced; the existing form owns that flow.

## Checks

- Build and TypeScript: passed.
- **61 regression scripts** passed, including **30 new story checks** and **3 added conversion assertions**.
- **13 browser suites** passed; the new story suite has **58 assertions**, no exceptions, keyboard and first-tap touch navigation, static reduced/no-JS output and zero sampled chapter layout shift.
- Platform mobile: **208 states**, no recorded overflow, undersized targets or input failures. This reuses the existing automated suite; Joe’s earlier real-iPhone camera check remains pending and is unrelated.
- Template asset integrity: **605 references across 17 kits**. All existing film frame-decode checks pass using installed ffprobe on PATH; the first shell lacked ffprobe and was corrected without changing that test.
- Vite restarted with node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173. **8 page/asset responses were 200**; enabled and disabled published/private-preview fixtures checked. See route-check.json.
- Full logs: checks.json, final-checks.json, existing-browser-checks.json, browser-results.json, regression-results.json, platform-mobile-audit.json and adjacent .log files.
- Restored **1615** backed-up evidence files after the suite; **262** unrelated file hashes unchanged. See preservation.json. Test fixtures are fictional and local only.

## Screenshots

Desktop browser viewport: **1440×900**. Phone viewport: **390×844**. Full-section captures extend vertically to include the entire story. For these section-only extracts, screenshot-only CSS hides fixed header/dock/skip chrome to prevent it being stamped across the story; content and layout are unaltered. The viewport-start, viewport-next-step and published-empty files are unmodified browser viewport captures with normal navigation. Rest and focus captures use the actual decorative CSS states, with no text alteration. Phone and reduced-motion states intentionally have no animation.

- [focus-desktop.png](focus-desktop.png)
- [focus-phone.png](focus-phone.png)
- [image-error-desktop.png](image-error-desktop.png)
- [image-error-phone.png](image-error-phone.png)
- [loading-desktop.png](loading-desktop.png)
- [loading-phone.png](loading-phone.png)
- [no-js-desktop.png](no-js-desktop.png)
- [no-js-phone.png](no-js-phone.png)
- [preview-settled-desktop.png](preview-settled-desktop.png)
- [preview-settled-phone.png](preview-settled-phone.png)
- [published-desktop.png](published-desktop.png)
- [published-empty-desktop.png](published-empty-desktop.png)
- [published-empty-phone.png](published-empty-phone.png)
- [published-phone.png](published-phone.png)
- [reduced-desktop.png](reduced-desktop.png)
- [reduced-phone.png](reduced-phone.png)
- [rest-desktop.png](rest-desktop.png)
- [rest-phone.png](rest-phone.png)
- [viewport-next-step-desktop.png](viewport-next-step-desktop.png)
- [viewport-next-step-phone.png](viewport-next-step-phone.png)
- [viewport-start-desktop.png](viewport-start-desktop.png)
- [viewport-start-phone.png](viewport-start-phone.png)

Local preview: http://127.0.0.1:5173/s/story-020-enabled#roof-planning-story (disposable QA fixture). No screenshots or claims represent a real customer project.
