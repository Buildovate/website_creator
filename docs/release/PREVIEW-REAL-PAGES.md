# PREVIEW-REAL-PAGES

Branch: `fix/preview-real-pages`, based on staging `feb7baba`.

The design library now calls the existing live renderers instead of maintaining a second set of page bodies. The adapter supplies an isolated sample contractor, preserves the preview navigation and design query, removes repeated Sample pills, and adds one small preview-chrome note. It never saves sample data to a tenant. Forms and promotion redemption remain disabled; review quotes, business credentials, lender programs and project prices are not fabricated.

Roofing uses Ridgeline Roofing. Other sample business names come from their kit's existing art brand and trade. The five sample cities come directly from the existing #021 catalog: Oxnard, Ventura, Camarillo, Thousand Oaks and Santa Paula. These are sample service areas, not claims about a real contractor.

## Renderer coverage and gaps

| Page | Renderer used by preview and live sites | Coverage / remaining design gap |
| --- | --- | --- |
| Services | `renderCoreSitePage` | All 17 kits; Roofing retains its animated service thumbnails. |
| Service detail | `renderServicePage` → `renderUniversalServicePage` | All 17 kits and every selected service, with existing trade illustrations and media. |
| Areas | `renderCoreSitePage` | All 17 kits share the live area index. No separate bespoke area-index design exists. |
| City | `renderCoreSitePage` | Roofing uses the five authored #021 pages and `roofing-city.js`. Other kits use the current shared live city layout; no Roofing-style bespoke city renderer exists for them. |
| About | `renderAboutPage` → `renderTrustAbout`, or `renderCoreSitePage` | Roofing uses its designed trust/about page. The other 16 kits use their shared live About layout; no equivalent bespoke renderer exists. |
| Reviews | `renderCoreSitePage` | All kits use the existing live page's private-preview state. No fake customer review or rating is supplied. |
| FAQ | `renderFAQPage`, or `renderCoreSitePage` | Roofing uses its designed FAQ and installed FAQ catalog. Other kits use the current shared live FAQ layout. |
| Contact | `renderCoreSitePage` | All 17 kits use the live contact page with preview submission disabled. |
| Financing / Promotions | `renderConstitutionPage` | All 17 kits; Roofing retains its dedicated planning chapters and installed motion. No new programs or offers are supplied. |
| Projects | Existing homepage portfolio via `showcasePage` | **No standalone live `/projects` index exists in any kit.** Preview `/projects` redirects to the same preview homepage's `#projects`, preserving the query. |
| Before & After | Existing sample Project Story → `projectStory` | **No standalone live `/before-after` page exists in any kit.** The preview alias opens the existing project-story gallery/comparison. Images remain reference imagery, not a documented customer transformation. |
| Legal / privacy / terms | `renderCoreSitePage` / `renderLegalPage` | All 17 kits use the existing live legal bodies. |
| Blog / Pricing | `renderBlogPage` / `pricingPage` | Existing shared renderers retained, with the same preview composition and navigation adapter. |

The 16 kits without Roofing's bespoke About/FAQ/city treatments are **patios, plumbing, hvac, electrical, landscaping, general-contractors, flooring, painting, fencing, garage-doors, pest-control, windows-doors, solar, concrete, pools and locksmith**. Shared live layouts remain available; this ticket does not invent replacement designs. All 17 kits lack the two standalone routes noted above.

## Composition and boundaries

- Layout, font, palette, card, rhythm and hero-frame choices reach every preview sub-page. Existing `siteStyle` choices are also supported. Navigation retains the full query, including tenant scope and effect choices.
- Regenerate, Preview choices, presets and Previous design retain the current sub-page while changing the selected layout/ingredients. Switching kits starts on the matching homepage.
- The sample Project Story receives the full preview footer. Library location banners keep manual city selection and do not query an invented tenant endpoint.
- Text in preview reveal containers is immediately visible at full opacity. Reduced motion disables preview transitions; the live renderers' native static fallbacks remain available without JavaScript.
- Live renderer bodies, prices and copy are unchanged. The only shared core-page change exports its existing renderer. Pricing preview dispatch moved into the common preview route; live pricing behavior is unchanged.
- Media files, catalogs, encodes and delivery settings are unchanged. PR #9 owns media restoration.
- The Windows path fix in `readiness-batch-a.mjs` decodes the repository file URL; otherwise the core gate cannot run from a path containing spaces. It matches the independent fix in PR #9.

## Evidence

Ignored local evidence: `docs/build-evidence/PREVIEW-REAL-PAGES/`.

- `before/` and `after/`: first-screen and full-page captures for 17 page types × Roofing, Patios and Landscaping × 1440×900 and 390×844 (102 cases per phase). City comparisons use the old North Ridge stub versus the real Oxnard page. Projects/Before & After comparisons show their existing-surface destinations after the change.
- `comparisons/`: labeled before/after contact sheets for each case.
- `routes-results.json`: all kits, all layouts, every service and all five cities, renderer-body parity, query retention, authentication and invalid-route checks.
- `after-results.json`: layout, readable text, disabled forms, regenerated computed styles, navigation and static-render checks, plus browser errors.
- `core/` and `related/`: executed test output and result summaries.

Executed validation:

- Core gate: **28/28 commands passed**, 1,380 reported tests/checks.
- Eight focused suites passed: `preview-real-pages` (72,910 assertions across 17 kits × three layouts), `design-kits`, `trade-revisions`, `saved-designs`, `core-site-pages`, `service-content`, `planning-motion`, and `client-modules`.
- Browser proof: **961 checks, 102 cases, zero console/JavaScript errors**, including 72 reduced-motion/no-JS page renders. Project Story footer follow-up: **49 checks, six refreshed captures, zero errors**. The composer adds **39 passing browser checks** at 1440 and 390.
- Evidence includes 408 first/full screenshots across both phases, 102 labeled comparisons, six overview contact sheets and a local `index.html` gallery.
- Broader legacy publish-integration suites are **not all green**: two reproduce unchanged missing-JPG/decorative-thumbnail QA blockers. Exact failures, initial browser-runtime errors and suites not rerun are recorded in [KNOWN-FAILURES](KNOWN-FAILURES.md). No test threshold or QA decision was relaxed.

No merge or deployment is authorized. The 70 Borderlines remain REJECTED/OPEN and `qaGateClear=false`.
