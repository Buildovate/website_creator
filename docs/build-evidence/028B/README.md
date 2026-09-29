# #028B — Section layout variants

**Follow-up to `10df48d`:** [process content parity and hero rail spacing](followup/README.md). Current fixes, retaken screenshots, updated contact sheets and rerun results are in that separate folder. The original evidence below records the accepted initial implementation and is preserved.

**Complete locally (2026-09-28).** All required checks pass on feature/local-environment-setup, starting from accepted #028P commit 17e35f0 (following #028A 49b032e). Local commit only; no push or deployment. **Higgsfield credits: 0. Actual provider calls: 0.**

## What was built

Three layouts (`a`, `b`, `c`) for each of six sections: **18 catalog variants, including 12 new compositions**. Optional choices live in the existing draft/published JSON. Missing choices and explicit `a` preserve the accepted renderer. Only opt-in pages load `/section-variants.css`, once in the document head. The new layouts use the Current/Bold/Fresh/Classic typography and palette tokens and existing installed photos/posters. The new heroes intentionally use static installed media; the original `a` hero and all existing film catalog assets remain intact.

Joe’s decisions resolve the original preflight conflict: published reviews with no source or no qualifying excerpts are omitted; hero/final CTA require exactly one visual primary action; all other sections allow at most one. Services `a` retains zero primary buttons and byte-identical markup. There is no selector or randomizer; #028C has not started. Financing variants rearrange the existing calculator on the Financing page, preserving its configured terms, selected lenders, calculator behavior, disclosure links and adjacent film chapter.

## Variant catalog

| Section | ID | Layout | Required data | Empty/fallback behavior |
|---|---|---|---|---|
| hero | a | Accepted film/photo hero | Existing trade heading, intro, action and installed media | Existing fallback unchanged |
| hero | b | Media-left split; copy and one primary on the right | Same heading, intro, action and installed poster/photo | Static installed media; no new media required |
| hero | c | Stacked headline and action above a wide panorama | Same heading, intro, action and installed poster/photo | Static installed media |
| services | a | Accepted service-card grid | Contractor-selected services and existing trade copy | Existing omission/empty rules unchanged |
| services | b | Alternating photo/text rows | Same services, photos, descriptions and detail links | No invented services; no primary required |
| services | c | Native disclosure list with photo and description inside each item | Same services, photos, descriptions and detail links | Native keyboard/JS-off disclosure; no primary required |
| process | a | Accepted process composition for the trade/journey | Existing trade-config process steps | Existing availability rules |
| process | b | Vertical timeline beside the section introduction | Same ordered process steps | No extra claims or measurements |
| process | c | Separate horizontal step cards, stacked on phone | Same ordered process steps | No extra claims or measurements |
| financing | a | Accepted calculator section on the Financing page | Contractor-selected confirmed lender and supplied terms | No public calculator without eligible configured terms |
| financing | b | Introduction above a wide calculator workbench | Same approved program selector, calculator and lender handoff | Same honest financing states; Pending film remains poster |
| financing | c | Calculator left with an explanatory sidebar on desktop | Same approved program selector, calculator and lender handoff | Same honest financing states; Pending film remains poster |
| reviews | a | Accepted source-card grid | Confirmed real source; optional rating filter | No source/zero qualifying excerpts: omit published section |
| reviews | b | Editorial heading column beside a stacked review list | Same source excerpts, attribution and full-source aggregates | No source/zero qualifying excerpts: omit published section |
| reviews | c | Featured first excerpt above a supporting review grid | Same source excerpts, attribution and full-source aggregates | No source/zero qualifying excerpts: omit published section |
| final CTA | a | Accepted contact introduction and inquiry form | Existing contractor contact and consent fields | Complete with zero promotions |
| final CTA | b | Centered introduction above a wide inquiry form | Same form fields, consent, validation and submission transport | Complete with zero promotions; one primary |
| final CTA | c | Inquiry form left and contact copy right; stacked on phone | Same form fields, consent, validation and submission transport | Complete with zero promotions; one primary |

The original no-source preview keeps its existing honest Sample treatment. No invented quote, price, rating, discount, deadline or offer is supplied by a variant. Configured fixture reviews and financing terms are clearly named QA/TEST FIXTURE in evidence and never stored in production data.

## Stored fields and review filter

```json
{
  "sectionVariants": {
    "hero": "c", "services": "b", "process": "c",
    "financing": "b", "reviews": "c", "finalCta": "b"
  },
  "minReviewRating": 4
}
```

Every section key is optional and defaults to `a`. Omitted settings preserve a previously saved choice during ordinary updates; an explicit empty `sectionVariants` object clears choices. Values are validated by the existing tenant draft save flow. Published snapshots remain independent. No schema migration, route, auth change or platform UI is added.

| Review setting | Display rule | Aggregate rule |
|---|---|---|
| Absent | Exact accepted behavior, including the existing `reviews.minimum` rule | Existing full-source aggregate unchanged |
| `all` | All real available excerpts; overrides the old Google-only display threshold | Confirmed full-source average/count only |
| `3`, `4`, `5` | Real excerpts with numeric rating at or above that value; unrated/non-numeric excluded | Same full-source average/count, never recomputed from filtered cards |

The new option defaults conceptually to `all`; compatibility deliberately preserves the old behavior when no value is saved. A legacy Google configuration may already have a 4+ threshold. Explicit `all` removes that display threshold. The mixed 2/3/4/5 fixture always reports **3.5 / 5 from 4 reviews**, while visible card counts change to 4/3/2/1. If the full aggregate is unavailable it is omitted. The existing review path emits no review structured-data aggregate. Zero qualifying excerpts removes the published section entirely; no-JS shows no fabricated review evidence. Source attribution continues to describe excerpts rather than the full collection.

[4+ mixed-fixture reviews screenshot](after/roofing-reviews-c-1440.png) · [Filter API/unit evidence](checks/review-rating-filter.json) · [Browser filter and legacy DOM identity evidence](checks/variants-fallbacks.json).

## Screenshots

Each contact sheet includes Roofing, Patios and HVAC, variants a/b/c, at 1440 and 390 pixels. Original section captures are linked below; the browser matrix also measures 768 pixels. Six full homepages mix independent choices under normal motion. There are **108 section captures + 6 mixed homepages**. The section matrix uses reduced motion so installed posters and static layouts can be compared consistently.

| Section | Contact sheet |
|---|---|
| hero | [Sheet](contact-sheets/hero.jpg) |
| services | [Sheet](contact-sheets/services.jpg) |
| process | [Sheet](contact-sheets/process.jpg) |
| financing | [Sheet](contact-sheets/financing.jpg) |
| reviews | [Sheet](contact-sheets/reviews.jpg) |
| finalCta | [Sheet](contact-sheets/finalCta.jpg) |

| Trade | Mixed homepage desktop | Mixed homepage phone |
|---|---|---|
| roofing | [1440](after/roofing-mixed-home-1440.png) | [390](after/roofing-mixed-home-390.png) |
| patios | [1440](after/patios-mixed-home-1440.png) | [390](after/patios-mixed-home-390.png) |
| hvac | [1440](after/hvac-mixed-home-1440.png) | [390](after/hvac-mixed-home-390.png) |

| Trade / section | a desktop / phone | b desktop / phone | c desktop / phone |
|---|---|---|---|
| roofing / hero | [1440](after/roofing-hero-a-1440.png) / [390](after/roofing-hero-a-390.png) | [1440](after/roofing-hero-b-1440.png) / [390](after/roofing-hero-b-390.png) | [1440](after/roofing-hero-c-1440.png) / [390](after/roofing-hero-c-390.png) |
| roofing / services | [1440](after/roofing-services-a-1440.png) / [390](after/roofing-services-a-390.png) | [1440](after/roofing-services-b-1440.png) / [390](after/roofing-services-b-390.png) | [1440](after/roofing-services-c-1440.png) / [390](after/roofing-services-c-390.png) |
| roofing / process | [1440](after/roofing-process-a-1440.png) / [390](after/roofing-process-a-390.png) | [1440](after/roofing-process-b-1440.png) / [390](after/roofing-process-b-390.png) | [1440](after/roofing-process-c-1440.png) / [390](after/roofing-process-c-390.png) |
| roofing / financing | [1440](after/roofing-financing-a-1440.png) / [390](after/roofing-financing-a-390.png) | [1440](after/roofing-financing-b-1440.png) / [390](after/roofing-financing-b-390.png) | [1440](after/roofing-financing-c-1440.png) / [390](after/roofing-financing-c-390.png) |
| roofing / reviews | [1440](after/roofing-reviews-a-1440.png) / [390](after/roofing-reviews-a-390.png) | [1440](after/roofing-reviews-b-1440.png) / [390](after/roofing-reviews-b-390.png) | [1440](after/roofing-reviews-c-1440.png) / [390](after/roofing-reviews-c-390.png) |
| roofing / finalCta | [1440](after/roofing-finalCta-a-1440.png) / [390](after/roofing-finalCta-a-390.png) | [1440](after/roofing-finalCta-b-1440.png) / [390](after/roofing-finalCta-b-390.png) | [1440](after/roofing-finalCta-c-1440.png) / [390](after/roofing-finalCta-c-390.png) |
| patios / hero | [1440](after/patios-hero-a-1440.png) / [390](after/patios-hero-a-390.png) | [1440](after/patios-hero-b-1440.png) / [390](after/patios-hero-b-390.png) | [1440](after/patios-hero-c-1440.png) / [390](after/patios-hero-c-390.png) |
| patios / services | [1440](after/patios-services-a-1440.png) / [390](after/patios-services-a-390.png) | [1440](after/patios-services-b-1440.png) / [390](after/patios-services-b-390.png) | [1440](after/patios-services-c-1440.png) / [390](after/patios-services-c-390.png) |
| patios / process | [1440](after/patios-process-a-1440.png) / [390](after/patios-process-a-390.png) | [1440](after/patios-process-b-1440.png) / [390](after/patios-process-b-390.png) | [1440](after/patios-process-c-1440.png) / [390](after/patios-process-c-390.png) |
| patios / financing | [1440](after/patios-financing-a-1440.png) / [390](after/patios-financing-a-390.png) | [1440](after/patios-financing-b-1440.png) / [390](after/patios-financing-b-390.png) | [1440](after/patios-financing-c-1440.png) / [390](after/patios-financing-c-390.png) |
| patios / reviews | [1440](after/patios-reviews-a-1440.png) / [390](after/patios-reviews-a-390.png) | [1440](after/patios-reviews-b-1440.png) / [390](after/patios-reviews-b-390.png) | [1440](after/patios-reviews-c-1440.png) / [390](after/patios-reviews-c-390.png) |
| patios / finalCta | [1440](after/patios-finalCta-a-1440.png) / [390](after/patios-finalCta-a-390.png) | [1440](after/patios-finalCta-b-1440.png) / [390](after/patios-finalCta-b-390.png) | [1440](after/patios-finalCta-c-1440.png) / [390](after/patios-finalCta-c-390.png) |
| hvac / hero | [1440](after/hvac-hero-a-1440.png) / [390](after/hvac-hero-a-390.png) | [1440](after/hvac-hero-b-1440.png) / [390](after/hvac-hero-b-390.png) | [1440](after/hvac-hero-c-1440.png) / [390](after/hvac-hero-c-390.png) |
| hvac / services | [1440](after/hvac-services-a-1440.png) / [390](after/hvac-services-a-390.png) | [1440](after/hvac-services-b-1440.png) / [390](after/hvac-services-b-390.png) | [1440](after/hvac-services-c-1440.png) / [390](after/hvac-services-c-390.png) |
| hvac / process | [1440](after/hvac-process-a-1440.png) / [390](after/hvac-process-a-390.png) | [1440](after/hvac-process-b-1440.png) / [390](after/hvac-process-b-390.png) | [1440](after/hvac-process-c-1440.png) / [390](after/hvac-process-c-390.png) |
| hvac / financing | [1440](after/hvac-financing-a-1440.png) / [390](after/hvac-financing-a-390.png) | [1440](after/hvac-financing-b-1440.png) / [390](after/hvac-financing-b-390.png) | [1440](after/hvac-financing-c-1440.png) / [390](after/hvac-financing-c-390.png) |
| hvac / reviews | [1440](after/hvac-reviews-a-1440.png) / [390](after/hvac-reviews-a-390.png) | [1440](after/hvac-reviews-b-1440.png) / [390](after/hvac-reviews-b-390.png) | [1440](after/hvac-reviews-c-1440.png) / [390](after/hvac-reviews-c-390.png) |
| hvac / finalCta | [1440](after/hvac-finalCta-a-1440.png) / [390](after/hvac-finalCta-a-390.png) | [1440](after/hvac-finalCta-b-1440.png) / [390](after/hvac-finalCta-b-390.png) | [1440](after/hvac-finalCta-c-1440.png) / [390](after/hvac-finalCta-c-390.png) |

## Reuse, fixes and preservation

- Reused the existing showcase/conversion renderers, service selection, process copy, installed photo/poster catalog, inquiry form transport and consent, review adapters/attribution, financing calculations and selected-lender handoff. Existing legal wording and publish gates remain.
- New code composes renderer-owned section content without reserializing untouched HTML. No page with all-default choices loads the new stylesheet. No existing public stylesheet or platform source/style is changed.
- Browser testing caught and fixed low-contrast Bold financing text and the new lender handoff outline, a late stylesheet layout shift, hidden review-grid specificity, duplicated accessible/animated Roofing hero text when converting a journey headline, and legacy decorative-art grid placement leaking into the new reviews layouts. The stylesheet now blocks in the head; the new heroes have one semantic headline. Explicit new review column rules and browser geometry assertions protect the intended arrangements. Section captures are framed from the full document after clearing keyboard focus, avoiding sticky chrome moving into element screenshots.
- New sections declare composition patterns. A duplicate-pattern check rejects repeated patterns, including a negative duplicate fixture. Native details provide keyboard and JS-off service access. Reduced motion disables new section transitions; new media dimensions are reserved.
- The existing 102-command inventory is reused through a #028B-local runner. Legacy evidence writes are redirected into this folder. The accepted callback clock harness and temporary Pending-film fixture are reused; original test/catalog bytes are restored in `finally`. No existing behavior assertion is weakened. FFmpeg/FFprobe are reused read-only from the accepted local download, with no new dependency or download.
- The original #028B preflight evidence was backed up to `.data/028B-prior-evidence-review-filter` before updates. Original before captures and baseline files remain unchanged. Backups and downloaded executables are excluded from the ticket commit. `.preserve/`, OneDrive, unrelated work and old evidence are not edited.

## Verification

[Machine-readable final summary](checks/final-summary.json).

| Check | Final result | Evidence |
|---|---|---|
| Existing full suite | PASS: 102/102 commands | [Inventory/results](full-checks.json), [runner log](checks/suite-run.log) |
| Final build and asset integrity | PASS; 643 referenced assets / 17 kits | [Build](checks/final-build.log), [assets](checks/template-assets.log) |
| Client typecheck | PASS | [Log](checks/typecheck.log) |
| All-kit render/data matrix | PASS: 8293 assertions; 408 base + 204 configured-offer cases | [Report](checks/section-variants.json) |
| Review filter and draft/publish API | PASS: 62 checks; all/3/4/5, numeric gating, full aggregates, defaults | [Report](checks/review-rating-filter.json) |
| Variant browser matrix | PASS: 216 page states; Roofing, Patios, HVAC x four styles x a/b/c x 1440/768/390 x home/financing | [Measurements](checks/variants-browser.json), [log](checks/variants-browser.log) |
| New-layout text AA | PASS: 6768 measurements, 0 failures | [Computed colors and ratios](checks/variants-browser.json) |
| Keyboard, focus and layouts | PASS: 2676 focus checks; native disclosure keyboard use; 72 review geometry/column assertions | [Measurements](checks/variants-browser.json) |
| Overflow, content loss, primaries, CLS | PASS: 0 failures; max CLS 0.023203 <= 0.05 | [Measurements](checks/variants-browser.json) |
| Image loads / page exceptions | PASS: 0 broken images, 0 page exceptions | [Report](checks/variants-browser.json) |
| JS-off, reduced motion and optional-data fallbacks | PASS: 608 assertions / 94 states; 72 JS-off layouts; real local form submissions for b/c; selected lender/calculator behavior; Pending posters | [Report](checks/variants-fallbacks.json), [log](checks/variants-fallbacks.log) |
| Review zero/default compatibility | PASS: zero-after-filter removes a/b/c; absent setting reproduces legacy populated DOM for both existing thresholds; no unavailable aggregate invented | [Browser proof](checks/variants-fallbacks.json) |
| Duplicate structural patterns | PASS: active choices unique; duplicate fixture rejected | [Render tests](checks/section-variants.log) |
| Accepted #028P protected hashes | PASS: 279/279 match; plus accepted platform.css makes 280/280 current protections | [Comparison](checks/accepted-protected-final.json), [current hashes](checks/sites-unchanged.log) |
| Archived #028A responses | PASS: 374/374 byte-identical | [After report](after-sites.json), [log](checks/after-sites.log) |
| Platform/build/dependency preservation | PASS: no diff in platform/client/auth shell, build or package files; all original CSS hashes match | [Preservation](checks/accepted-protected-final.json) |
| Original preflight evidence | PASS: 241 files byte-identical | [Preservation](checks/accepted-protected-final.json) |
| Screenshots and contact sheets | PASS: 108 section captures + 6 mixed full homepages; six sheets | [Catalog above](#screenshots) |
| Dependencies, media and spend | PASS: no new dependency/media/provider call; 0 Higgsfield credits | Local installed assets and isolated mocked fixtures only |

The 280 protections comprise 207 HTML responses, 23 loaded stylesheets and 50 existing CSS asset files. They include all 279 original #028P protections plus the platform stylesheet introduced by accepted #028P. The new opt-in stylesheet is an additional asset; no existing stylesheet is edited. Screenshots cover every requested section/variant for three trades; all 17 kits are covered by the render/data matrix. Variant a remains protected by exact output/hash comparisons and the unchanged full suite. New browser contrast measurements target the opt-in sections.

Memory remained healthy during QA (approximately 24 GiB free during the full suite). Test runtimes use isolated in-memory databases and block remote browser/provider traffic; no customer data is saved outside those disposable fixtures. The same full-set provider rating/count is retained for every filter. No live provider verification is claimed.

The commit includes the requested captures/contact sheets, baseline and final protected evidence, logs and reproducible tools. Redundant screenshots emitted by legacy suites stay local under this ticket folder; the final command logs/results are retained. Backups, downloaded FFmpeg/FFprobe executables and unrelated work are excluded. No work remains Pending for #028B. #028C is not started.

### Existing 102-command suite

Exact commands are recorded below. The two controlled compatibility fixtures and output redirection are described in Reuse above; no behavior assertion is removed.

| # | Command | Result | Log |
|---|---|---|---|
| 1 | `node C:/Users/joe/website_creator/build.mjs` | PASS (exit 0) | [Log](checks/build.log) |
| 2 | `node C:/Users/joe/website_creator/node_modules/typescript/bin/tsc -p C:/Users/joe/website_creator/tsconfig.auth.json` | PASS (exit 0) | [Log](checks/typecheck.log) |
| 3 | `node C:/Users/joe/website_creator/tests/auth-session.mjs` | PASS (exit 0) | [Log](checks/auth-session.log) |
| 4 | `node C:/Users/joe/website_creator/tests/aws-adapter.mjs` | PASS (exit 0) | [Log](checks/aws-adapter.log) |
| 5 | `node C:/Users/joe/website_creator/tests/builder.mjs` | PASS (exit 0) | [Log](checks/builder.log) |
| 6 | `node C:/Users/joe/website_creator/tests/callback-restore.mjs` | PASS (exit 0) | [Log](checks/callback-restore.log) |
| 7 | `node C:/Users/joe/website_creator/tests/cinematic-films.mjs` | PASS (exit 0) | [Log](checks/cinematic-films.log) |
| 8 | `node C:/Users/joe/website_creator/tests/client-modules.mjs` | PASS (exit 0) | [Log](checks/client-modules.log) |
| 9 | `node C:/Users/joe/website_creator/tests/constitution.mjs` | PASS (exit 0) | [Log](checks/constitution.log) |
| 10 | `node C:/Users/joe/website_creator/tests/contact-linkage.mjs` | PASS (exit 0) | [Log](checks/contact-linkage.log) |
| 11 | `node C:/Users/joe/website_creator/tests/contacts-restore.mjs` | PASS (exit 0) | [Log](checks/contacts-restore.log) |
| 12 | `node C:/Users/joe/website_creator/tests/control.mjs` | PASS (exit 0) | [Log](checks/control.log) |
| 13 | `node C:/Users/joe/website_creator/tests/conversion-references.mjs` | PASS (exit 0) | [Log](checks/conversion-references.log) |
| 14 | `node C:/Users/joe/website_creator/tests/core-site-pages.mjs` | PASS (exit 0) | [Log](checks/core-site-pages.log) |
| 15 | `node C:/Users/joe/website_creator/tests/crm-next.mjs` | PASS (exit 0) | [Log](checks/crm-next.log) |
| 16 | `node C:/Users/joe/website_creator/tests/crm.mjs` | PASS (exit 0) | [Log](checks/crm.log) |
| 17 | `node C:/Users/joe/website_creator/tests/design-kits.mjs` | PASS (exit 0) | [Log](checks/design-kits.log) |
| 18 | `node C:/Users/joe/website_creator/tests/ebook.mjs` | PASS (exit 0) | [Log](checks/ebook.log) |
| 19 | `node C:/Users/joe/website_creator/tests/engagement-providers.mjs` | PASS (exit 0) | [Log](checks/engagement-providers.log) |
| 20 | `node C:/Users/joe/website_creator/tests/engagement.mjs` | PASS (exit 0) | [Log](checks/engagement.log) |
| 21 | `node C:/Users/joe/website_creator/tests/expense-metering.mjs` | PASS (exit 0) | [Log](checks/expense-metering.log) |
| 22 | `node C:/Users/joe/website_creator/tests/expense-polish.mjs` | PASS (exit 0) | [Log](checks/expense-polish.log) |
| 23 | `node C:/Users/joe/website_creator/tests/expenses.mjs` | PASS (exit 0) | [Log](checks/expenses.log) |
| 24 | `node C:/Users/joe/website_creator/tests/financing-comparison.mjs` | PASS (exit 0) | [Log](checks/financing-comparison.log) |
| 25 | `node C:/Users/joe/website_creator/tests/financing-states.mjs` | PASS (exit 0) | [Log](checks/financing-states.log) |
| 26 | `node C:/Users/joe/website_creator/tests/footer-policy.mjs` | PASS (exit 0) | [Log](checks/footer-policy.log) |
| 27 | `node C:/Users/joe/website_creator/tests/generation.mjs` | PASS (exit 0) | [Log](checks/generation.log) |
| 28 | `node C:/Users/joe/website_creator/tests/hero-editor.mjs` | PASS (exit 0) | [Log](checks/hero-editor.log) |
| 29 | `node C:/Users/joe/website_creator/tests/legacy-scroll-video.mjs` | PASS (exit 0) | [Log](checks/legacy-scroll-video.log) |
| 30 | `node C:/Users/joe/website_creator/tests/legal-policy.mjs` | PASS (exit 0) | [Log](checks/legal-policy.log) |
| 31 | `node C:/Users/joe/website_creator/tests/media-ranges.mjs` | PASS (exit 0) | [Log](checks/media-ranges.log) |
| 32 | `node C:/Users/joe/website_creator/tests/motion-v2.mjs` | PASS (exit 0) | [Log](checks/motion-v2.log) |
| 33 | `node C:/Users/joe/website_creator/tests/neighborhood.mjs` | PASS (exit 0) | [Log](checks/neighborhood.log) |
| 34 | `node C:/Users/joe/website_creator/tests/owner-photo.mjs` | PASS (exit 0) | [Log](checks/owner-photo.log) |
| 35 | `node C:/Users/joe/website_creator/tests/planning-ambient.mjs` | PASS (exit 0) | [Log](checks/planning-ambient.log) |
| 36 | `node C:/Users/joe/website_creator/tests/planning-motion.mjs` | PASS (exit 0) | [Log](checks/planning-motion.log) |
| 37 | `node C:/Users/joe/website_creator/tests/planning-scroll.mjs` | PASS (exit 0) | [Log](checks/planning-scroll.log) |
| 38 | `node C:/Users/joe/website_creator/tests/platform.mjs` | PASS (exit 0) | [Log](checks/platform.log) |
| 39 | `node C:/Users/joe/website_creator/tests/premium-service.mjs` | PASS (exit 0) | [Log](checks/premium-service.log) |
| 40 | `node C:/Users/joe/website_creator/tests/presentation.mjs` | PASS (exit 0) | [Log](checks/presentation.log) |
| 41 | `node C:/Users/joe/website_creator/tests/project-experience.mjs` | PASS (exit 0) | [Log](checks/project-experience.log) |
| 42 | `node C:/Users/joe/website_creator/tests/promotion-unlocks.mjs` | PASS (exit 0) | [Log](checks/promotion-unlocks.log) |
| 43 | `node C:/Users/joe/website_creator/tests/reference-proof.mjs` | PASS (exit 0) | [Log](checks/reference-proof.log) |
| 44 | `node C:/Users/joe/website_creator/tests/review-lookup.mjs` | PASS (exit 0) | [Log](checks/review-lookup.log) |
| 45 | `node C:/Users/joe/website_creator/tests/roofing-cities.mjs` | PASS (exit 0) | [Log](checks/roofing-cities.log) |
| 46 | `node C:/Users/joe/website_creator/tests/roofing-cta.mjs` | PASS (exit 0) | [Log](checks/roofing-cta.log) |
| 47 | `node C:/Users/joe/website_creator/tests/roofing-story.mjs` | PASS (exit 0) | [Log](checks/roofing-story.log) |
| 48 | `node C:/Users/joe/website_creator/tests/sales-ops.mjs` | PASS (exit 0) | [Log](checks/sales-ops.log) |
| 49 | `node C:/Users/joe/website_creator/tests/saved-designs.mjs` | PASS (exit 0) | [Log](checks/saved-designs.log) |
| 50 | `node C:/Users/joe/website_creator/tests/scroll-media.mjs` | PASS (exit 0) | [Log](checks/scroll-media.log) |
| 51 | `node C:/Users/joe/website_creator/tests/scroll-story.mjs` | PASS (exit 0) | [Log](checks/scroll-story.log) |
| 52 | `node C:/Users/joe/website_creator/tests/scroll-video-controller.mjs` | PASS (exit 0) | [Log](checks/scroll-video-controller.log) |
| 53 | `node C:/Users/joe/website_creator/tests/service-content.mjs` | PASS (exit 0) | [Log](checks/service-content.log) |
| 54 | `node C:/Users/joe/website_creator/tests/service-motion.mjs` | PASS (exit 0) | [Log](checks/service-motion.log) |
| 55 | `node C:/Users/joe/website_creator/tests/service-pages-all-trades.mjs` | PASS (exit 0) | [Log](checks/service-pages-all-trades.log) |
| 56 | `node C:/Users/joe/website_creator/tests/service-playbook.mjs` | PASS (exit 0) | [Log](checks/service-playbook.log) |
| 57 | `node C:/Users/joe/website_creator/tests/showpiece-media.mjs` | PASS (exit 0) | [Log](checks/showpiece-media.log) |
| 58 | `node C:/Users/joe/website_creator/tests/showpiece-v4.mjs` | PASS (exit 0) | [Log](checks/showpiece-v4.log) |
| 59 | `node C:/Users/joe/website_creator/tests/template-name.mjs` | PASS (exit 0) | [Log](checks/template-name.log) |
| 60 | `node C:/Users/joe/website_creator/tests/trade-enablement.mjs` | PASS (exit 0) | [Log](checks/trade-enablement.log) |
| 61 | `node C:/Users/joe/website_creator/tests/trade-revisions.mjs` | PASS (exit 0) | [Log](checks/trade-revisions.log) |
| 62 | `node C:/Users/joe/website_creator/tests/trade-upgrade.mjs` | PASS (exit 0) | [Log](checks/trade-upgrade.log) |
| 63 | `node C:/Users/joe/website_creator/tests/trade-visual-correctness.mjs` | PASS (exit 0) | [Log](checks/trade-visual-correctness.log) |
| 64 | `node C:/Users/joe/website_creator/tests/trades-financing.mjs` | PASS (exit 0) | [Log](checks/trades-financing.log) |
| 65 | `node C:/Users/joe/website_creator/tests/trust.mjs` | PASS (exit 0) | [Log](checks/trust.log) |
| 66 | `node C:/Users/joe/website_creator/tests/website-pages.mjs` | PASS (exit 0) | [Log](checks/website-pages.log) |
| 67 | `node C:/Users/joe/website_creator/tests/workspace-owner.mjs` | PASS (exit 0) | [Log](checks/workspace-owner.log) |
| 68 | `node C:/Users/joe/website_creator/tests/workspace.mjs` | PASS (exit 0) | [Log](checks/workspace.log) |
| 69 | `node C:/Users/joe/website_creator/tests/zoom.mjs` | PASS (exit 0) | [Log](checks/zoom.log) |
| 70 | `node C:/Users/joe/website_creator/scripts/check-template-assets.mjs` | PASS (exit 0) | [Log](checks/template-assets.log) |
| 71 | `node C:/Users/joe/website_creator/tests/platform-mobile.mjs` | PASS (exit 0) | [Log](checks/platform-mobile.log) |
| 72 | `node C:/Users/joe/website_creator/docs/build-evidence/clips-phase2/callback-calendar-clock.mjs` | PASS (exit 0) | [Log](checks/callback-browser.log) |
| 73 | `node C:/Users/joe/website_creator/tests/contact-linkage-browser.mjs` | PASS (exit 0) | [Log](checks/contact-linkage-browser.log) |
| 74 | `node C:/Users/joe/website_creator/tests/contacts-browser.mjs` | PASS (exit 0) | [Log](checks/contacts-browser.log) |
| 75 | `node C:/Users/joe/website_creator/tests/ebook-browser.mjs` | PASS (exit 0) | [Log](checks/ebook-browser.log) |
| 76 | `node C:/Users/joe/website_creator/tests/expense-polish-browser.mjs` | PASS (exit 0) | [Log](checks/expense-polish-browser.log) |
| 77 | `node C:/Users/joe/website_creator/tests/expenses-browser.mjs` | PASS (exit 0) | [Log](checks/expenses-browser.log) |
| 78 | `node C:/Users/joe/website_creator/tests/financing-states-browser.mjs` | PASS (exit 0) | [Log](checks/financing-states-browser.log) |
| 79 | `node C:/Users/joe/website_creator/tests/generation-browser.mjs` | PASS (exit 0) | [Log](checks/generation-browser.log) |
| 80 | `node C:/Users/joe/website_creator/tests/hero-editor-browser.mjs` | PASS (exit 0) | [Log](checks/hero-editor-browser.log) |
| 81 | `node C:/Users/joe/website_creator/tests/planning-ambient-browser.mjs` | PASS (exit 0) | [Log](checks/planning-ambient-browser.log) |
| 82 | `node C:/Users/joe/website_creator/tests/planning-scroll-browser.mjs` | PASS (exit 0) | [Log](checks/planning-scroll-browser.log) |
| 83 | `node C:/Users/joe/website_creator/tests/platform-ui-cleanup-browser.mjs` | PASS (exit 0) | [Log](checks/platform-ui-cleanup-browser.log) |
| 84 | `node C:/Users/joe/website_creator/tests/promotion-unlocks-browser.mjs` | PASS (exit 0) | [Log](checks/promotion-unlocks-browser.log) |
| 85 | `node C:/Users/joe/website_creator/tests/roofing-cities-browser.mjs` | PASS (exit 0) | [Log](checks/roofing-cities-browser.log) |
| 86 | `node C:/Users/joe/website_creator/tests/roofing-cta-browser.mjs` | PASS (exit 0) | [Log](checks/roofing-cta-browser.log) |
| 87 | `node C:/Users/joe/website_creator/tests/roofing-story-browser.mjs` | PASS (exit 0) | [Log](checks/roofing-story-browser.log) |
| 88 | `node C:/Users/joe/website_creator/tests/service-motion-browser.mjs` | PASS (exit 0) | [Log](checks/service-motion-browser.log) |
| 89 | `node C:/Users/joe/website_creator/tests/trade-enablement-browser.mjs` | PASS (exit 0) | [Log](checks/trade-enablement-browser.log) |
| 90 | `node C:/Users/joe/website_creator/tests/trade-visual-browser.mjs` | PASS (exit 0) | [Log](checks/trade-visual-browser.log) |
| 91 | `node C:/Users/joe/website_creator/tests/clips-phase2.mjs` | PASS (exit 0) | [Log](checks/clips-phase2.log) |
| 92 | `node C:/Users/joe/website_creator/tests/clips-phase2-browser.mjs` | PASS (exit 0) | [Log](checks/clips-phase2-browser.log) |
| 93 | `node C:/Users/joe/website_creator/tests/roofing-polish-part1.mjs` | PASS (exit 0) | [Log](checks/roofing-polish-part1.log) |
| 94 | `node C:/Users/joe/website_creator/tests/roofing-polish-part1-browser.mjs` | PASS (exit 0) | [Log](checks/roofing-polish-part1-browser.log) |
| 95 | `node C:/Users/joe/website_creator/tests/roofing-polish-part2.mjs` | PASS (exit 0) | [Log](checks/roofing-polish-part2.log) |
| 96 | `node C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs` | PASS (exit 0) | [Log](checks/roofing-polish-part2-browser.log) |
| 97 | `node C:/Users/joe/website_creator/tests/roofing-acceptance.mjs` | PASS (exit 0) | [Log](checks/roofing-acceptance.log) |
| 98 | `node C:/Users/joe/website_creator/tests/design-styles.mjs` | PASS (exit 0) | [Log](checks/design-styles.log) |
| 99 | `node C:/Users/joe/website_creator/tests/promotions-ambient.mjs` | PASS (exit 0) | [Log](checks/promotions-ambient.log) |
| 100 | `node C:/Users/joe/website_creator/tests/promotions-scroll.mjs` | PASS (exit 0) | [Log](checks/promotions-scroll.log) |
| 101 | `node C:/Users/joe/website_creator/tests/promotions-ambient-browser.mjs` | PASS (exit 0) | [Log](checks/promotions-ambient-browser.log) |
| 102 | `node C:/Users/joe/website_creator/tests/promotions-scroll-browser.mjs` | PASS (exit 0) | [Log](checks/promotions-scroll-browser.log) |

### New and final commands

| Command | Result |
|---|---|
| `node C:/Users/joe/website_creator/tests/section-variants.mjs` | PASS |
| `node C:/Users/joe/website_creator/tests/review-rating-filter.mjs` | PASS |
| `node C:/Users/joe/website_creator/tests/section-variants-browser.mjs` | PASS |
| `node C:/Users/joe/website_creator/tests/section-variants-fallbacks.mjs` | PASS |
| `node C:/Users/joe/website_creator/docs/build-evidence/028B/tools/sites-unchanged.mjs after` | PASS |
| `node C:/Users/joe/website_creator/docs/build-evidence/028B/tools/preservation.mjs` | PASS |
| `node C:/Users/joe/website_creator/build.mjs` | PASS |
