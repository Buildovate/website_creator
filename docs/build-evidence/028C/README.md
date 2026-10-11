# #028C — Uniqueness generator

**Done locally.** Based on accepted `4880c3b`, branch `feature/local-environment-setup`. AI copy is **not connected**. Credits used: **0**. Actual provider calls: **0**. No new npm dependencies, routes, migration, deployment or push.

## What changed

Explicit regeneration through the existing #023 action now reserves a stable seed, one of four Looks, six a/b/c section layouts and authored copy. Existing sites retain their exact output until explicitly regenerated. Merely opening a site, saving it, adopting its manifest or publishing it does not activate this feature.

The seed reuses the existing stored site seed or derives one with `stableSiteStyleSeed(siteId)`. No time, UUID or random value selects rendered content. The selector walks all 2,916 combinations in deterministic order, honors saved contractor Look first and staff overrides next, rejects repeated section structures, then seeks at least three differing picks from every same-trade draft/published snapshot. It records each rule-driven fallback and the best available distance if the constrained pool is exhausted. A saved reservation survives changes to neighboring sites. Concurrent requests reserve against an optimistic per-trade lock in the existing JSON record store, atomically with the tenant update.

The manifest records seed/source, style, six section IDs, six copy IDs and exact text, copy version, factual identity, overrides and authenticated staff actor, Look provenance, fallback reasons/counts, structural purposes/patterns and uniqueness results. Comparisons include total sites/snapshots, pool fingerprint and the 32 nearest snapshots. A later explicit Look save retains its layouts, records the actor and reassesses its actual distance; an exhausted result is reconsidered at the next regeneration. Existing historical Looks have no invented author.

`replayUniqueChoices(originalFacts, manifest)` restores the same rendered result, including the existing secondary composition choices. Normal factual edits refresh the authored copy without silently rerolling layouts. The AI path remains off; the generation panel says **AI copy not connected**. Client-forged generated records or picks are rejected.

### Staff overrides

Use the existing authenticated `POST /api/tenants/:id/generation` action with `action: "regenerate"`, the current row `version`, and optional `overrides: {seed: 123, style: "bold", sections: {hero: "b", process: "c"}}`. Only staff administrators may submit overrides; the server records their identity. Seeds are integers 0–4294967295. A contractor’s saved Look wins over any conflicting staff style. Conflicting fixed page rules return a clear validation error; disabling the final Contact section must be resolved before regeneration. No new selector or settings route was added.

### Authored copy catalog

Three versioned choices per slot × six slots × 17 trades = **306 catalog entries**. IDs follow `<kit>.<slot>.v1.a|b|c`. All fact interpolation is escaped. Missing facts select usable neutral wording; no fabricated reviews, years, licenses, counts, offers, prices, awards, urgency or deadlines. Copy purposes differ by section. The catalog uses proper display names such as HVAC and Roofing. The existing variant-a renderer functions are unchanged; an opt-in composition layer applies saved generated copy after the accepted renderer.

| Slot | Three authored choices | Facts / missing-data behavior | Purpose |
|---|---|---|---|
| Hero | Service + location / project starting point / clear service starting point | Business, chosen services and city/area; generic project language when absent | Relevance |
| Services | Choose the work / where to begin / project starting point | Only saved service names; trade project wording if none | Scope |
| Process | Bring questions / priorities to conversation / clearer work conversation | Trade display name and optional business; accepted step names, phone and artwork retained | Preparation |
| Financing | Compare terms / beyond the payment / written price first | Existing configured terms only; unavailable calculator remains omitted | Payment comparison |
| Reviews | Customer perspectives / customers’ words / customer perspective | Real connected source and minReviewRating; published empty result omitted | Source evidence |
| Final CTA | Property priorities / project request / next-step conversation | Business and trade; no offer or urgency required | Inquiry |

### Reused and preserved

Reused #028A Looks/tokens/fonts, #028B a/b/c compositors, process artwork, photographs/posters/film catalog, #023 manifest/locks/history, existing routes and draft/publish boundary, financing calculator/legal text, forms, and review filtering/full-source aggregates. Generated reviews use the existing no-source and zero-after-filter omission rules. Sample previews retain their labeling. Pending films still publish their installed posters.

Only regenerated pages load the new scoped `generated-site.css`. It fixes actual generated-combination contrast issues in review surfaces, Current buttons/service cards, chapter rail, financing benefit/step text and form borders; it supplies a visible focus ring. The original 52 CSS source files have no Git changes. All 279 accepted rendered hashes plus platform.css and 374 archived responses remain byte-identical. No existing CSS or variant-a function body was restyled. Raw HTML/CSS captures use ticket-local Git attributes to preserve their exact served bytes without line-ending conversion.

## Fictional Sample proof

These are local test fixtures, never real businesses or published sites. All names explicitly say Sample Fictional; review responses are local mocks. They have different Southern California cities and service mixes, no invented business history/license/offer, and Paper Lantern has no review source. Seeds derive directly from their saved fixture IDs, with no staff override.

| Fictional contractor | City / services | Seed / Look | Hero / services / process / financing / reviews / CTA | Captures |
|---|---|---|---|---|
| Sample Fictional Copper Kite Roofing | Ventura: Roof installation, Roof repair | 661037279 / current | b / b / b / c / a / b | [1440](after/sample-fictional-copper-kite-ventura-1440.png) / [390](after/sample-fictional-copper-kite-ventura-390.png) |
| Sample Fictional Blue Orchard Roofing | Pasadena: Roof repair, Roof replacement | 3361108726 / classic | b / c / c / c / a / a | [1440](after/sample-fictional-blue-orchard-pasadena-1440.png) / [390](after/sample-fictional-blue-orchard-pasadena-390.png) |
| Sample Fictional Paper Lantern Roofing | Temecula: Roof replacement, Asphalt shingles | 3744509370 / current | c / b / a / b / b / c | [1440](after/sample-fictional-paper-lantern-temecula-1440.png) / [390](after/sample-fictional-paper-lantern-temecula-390.png) |

[Desktop side-by-side](contact-sheet-1440.jpg) · [Phone side-by-side](contact-sheet-390.jpg) · [Desktop first screen](contact-sheet-1440-first-screen.png) · [Phone first screen](contact-sheet-390-first-screen.png). Full saved inputs/manifests: [sample-fixtures.json](sample-fixtures.json). Every pair differs in style or hero and at least three section layouts: [distance proof](checks/sample-distances.json).

## Final verification

| Gate | Result | Evidence |
|---|---|---|
| Existing suite | 102/102 PASS, including build and client typecheck | [Details](full-checks.json) |
| Generator | 3859 assertions / 68 trade-style cases / 306 copy entries PASS | [Details](checks/uniqueness.json) |
| Generation API | 418 assertions / 68 trade-style cases PASS, including simultaneous reservations | [Details](checks/uniqueness-api.json) |
| Generated browser matrix | 417 states + 12 normal-motion/JS-off states PASS | [Details](checks/uniqueness-browser.json) |
| Existing browser matrix | 216 + 544 expanded states PASS | [Details](checks/variants-browser.json) |
| Original content parity | 408 cases / 2,448 comparisons / 4 negative boundaries PASS | [Details](checks/content-parity.json) |
| Generated content parity | 408 cases / 2,448 comparisons / 4 negative boundaries PASS | [Details](checks/generated-content-parity.json) |
| Variant render | 8,293 assertions / 408 base + 204 optional-offer cases PASS | [Details](checks/section-variants.json) |
| Review filter | 62 checks PASS; all/3/4/5; full-source aggregate remains 3.5 from four mixed reviews | [Details](checks/review-rating-filter.json) |
| Fallbacks | 608 assertions / 94 states PASS | [Details](checks/variants-fallbacks.json) |
| AA text | 98,186 measurements; 0 failures | [Details](checks/quality-summary.json) |
| Generated control boundaries | 3,048 measurements; 0 failures | [Details](checks/quality-summary.json) |
| Focus / geometry | 29,191 focus and 1,868 geometry checks; 0 failures | [Details](checks/quality-summary.json) |
| Overflow / content loss / primary actions / broken images / page exceptions | 0 failures | [Details](checks/quality-summary.json) |
| CLS | Maximum 0.023765 <= 0.05 | [Details](checks/quality-summary.json) |
| Platform legacy screenshot audit | 383 states; 33,609 text + 66,834 border measurements; 0 failures | [Details](checks/quality-summary.json) |
| Protected rendering | 279 + platform.css = 280/280 exact hashes | [Details](checks/accepted-protected-final.json) |
| Archived responses | 374/374 byte-identical | [Details](checks/sites-unchanged.log) |

### Text AA by Look (main browser matrices)

| Look | Measurements | Failures |
|---|---:|---:|
| current | 24,857 | 0 |
| bold | 23,843 | 0 |
| fresh | 23,821 | 0 |
| classic | 24,277 | 0 |

The generated matrix audits home and financing for all 17 trades × four Looks at 1440/768/390, plus the three Samples. It includes whole-page text, controls, focus, primary actions, review aggregate/filter behavior, images, overflow, process artwork and hero/rail geometry. Six extra normal-motion and six JS-off Sample states verify the exact saved heading, visible poster and static output. CLS is measured with a PerformanceObserver in JavaScript-enabled states; it is explicitly unmeasured, not reported as zero, in JS-off states.

The accepted variant render/filter/parity/browser assertions remain intact. The existing generation browser test changes one obsolete expectation: the first explicit regeneration adopts the unlocked composition, while repeated regeneration with the same saved seed must now preserve every manifest choice. Lock, privacy, error/retry and save assertions remain unchanged. The new visible-heading check compares exact DOM text and visibility separately because CSS text-transform legitimately uppercases the display.

The legacy suite redirects captures to this ticket, restores its temporary Pending-film fixture and rebuilds the final catalog. It retains the existing narrow platform console matcher: no new exception was added. The optional legacy console capture also records public negative fixtures/resource diagnostics outside that platform gate; these are retained as diagnostic data, not silently marked allowlisted. Platform-gated diagnostics have zero non-allowlisted errors. Browser page exceptions are zero. Provider adapters used for review fixtures are in-process mocks; external provider requests are blocked.

Early exploratory contrast failures were fixed only in generated-site scope, then the full generated matrix was rerun. One initial Roofing acceptance measurement reported 4px overflow during normal motion; the complete final 102-command run passed the unchanged acceptance assertions. No behavior assertion or threshold was relaxed.

### All 102 existing commands

Commands run from `C:\Users\joe\website_creator`. `node build.mjs` is the `npm run build` implementation; the typecheck invokes the same TypeScript config as `typecheck:client`. Each result and log is retained below.

| # | Command | Result | Log |
|---:|---|---|---|
| 1 | `node C:/Users/joe/website_creator/build.mjs` | PASS | [build](checks/build.log) |
| 2 | `node C:/Users/joe/website_creator/node_modules/typescript/bin/tsc -p C:/Users/joe/website_creator/tsconfig.auth.json` | PASS | [typecheck](checks/typecheck.log) |
| 3 | `node C:/Users/joe/website_creator/tests/auth-session.mjs` | PASS | [auth-session](checks/auth-session.log) |
| 4 | `node C:/Users/joe/website_creator/tests/aws-adapter.mjs` | PASS | [aws-adapter](checks/aws-adapter.log) |
| 5 | `node C:/Users/joe/website_creator/tests/builder.mjs` | PASS | [builder](checks/builder.log) |
| 6 | `node C:/Users/joe/website_creator/tests/callback-restore.mjs` | PASS | [callback-restore](checks/callback-restore.log) |
| 7 | `node C:/Users/joe/website_creator/tests/cinematic-films.mjs` | PASS | [cinematic-films](checks/cinematic-films.log) |
| 8 | `node C:/Users/joe/website_creator/tests/client-modules.mjs` | PASS | [client-modules](checks/client-modules.log) |
| 9 | `node C:/Users/joe/website_creator/tests/constitution.mjs` | PASS | [constitution](checks/constitution.log) |
| 10 | `node C:/Users/joe/website_creator/tests/contact-linkage.mjs` | PASS | [contact-linkage](checks/contact-linkage.log) |
| 11 | `node C:/Users/joe/website_creator/tests/contacts-restore.mjs` | PASS | [contacts-restore](checks/contacts-restore.log) |
| 12 | `node C:/Users/joe/website_creator/tests/control.mjs` | PASS | [control](checks/control.log) |
| 13 | `node C:/Users/joe/website_creator/tests/conversion-references.mjs` | PASS | [conversion-references](checks/conversion-references.log) |
| 14 | `node C:/Users/joe/website_creator/tests/core-site-pages.mjs` | PASS | [core-site-pages](checks/core-site-pages.log) |
| 15 | `node C:/Users/joe/website_creator/tests/crm-next.mjs` | PASS | [crm-next](checks/crm-next.log) |
| 16 | `node C:/Users/joe/website_creator/tests/crm.mjs` | PASS | [crm](checks/crm.log) |
| 17 | `node C:/Users/joe/website_creator/tests/design-kits.mjs` | PASS | [design-kits](checks/design-kits.log) |
| 18 | `node C:/Users/joe/website_creator/tests/ebook.mjs` | PASS | [ebook](checks/ebook.log) |
| 19 | `node C:/Users/joe/website_creator/tests/engagement-providers.mjs` | PASS | [engagement-providers](checks/engagement-providers.log) |
| 20 | `node C:/Users/joe/website_creator/tests/engagement.mjs` | PASS | [engagement](checks/engagement.log) |
| 21 | `node C:/Users/joe/website_creator/tests/expense-metering.mjs` | PASS | [expense-metering](checks/expense-metering.log) |
| 22 | `node C:/Users/joe/website_creator/tests/expense-polish.mjs` | PASS | [expense-polish](checks/expense-polish.log) |
| 23 | `node C:/Users/joe/website_creator/tests/expenses.mjs` | PASS | [expenses](checks/expenses.log) |
| 24 | `node C:/Users/joe/website_creator/tests/financing-comparison.mjs` | PASS | [financing-comparison](checks/financing-comparison.log) |
| 25 | `node C:/Users/joe/website_creator/tests/financing-states.mjs` | PASS | [financing-states](checks/financing-states.log) |
| 26 | `node C:/Users/joe/website_creator/tests/footer-policy.mjs` | PASS | [footer-policy](checks/footer-policy.log) |
| 27 | `node C:/Users/joe/website_creator/tests/generation.mjs` | PASS | [generation](checks/generation.log) |
| 28 | `node C:/Users/joe/website_creator/tests/hero-editor.mjs` | PASS | [hero-editor](checks/hero-editor.log) |
| 29 | `node C:/Users/joe/website_creator/tests/legacy-scroll-video.mjs` | PASS | [legacy-scroll-video](checks/legacy-scroll-video.log) |
| 30 | `node C:/Users/joe/website_creator/tests/legal-policy.mjs` | PASS | [legal-policy](checks/legal-policy.log) |
| 31 | `node C:/Users/joe/website_creator/tests/media-ranges.mjs` | PASS | [media-ranges](checks/media-ranges.log) |
| 32 | `node C:/Users/joe/website_creator/tests/motion-v2.mjs` | PASS | [motion-v2](checks/motion-v2.log) |
| 33 | `node C:/Users/joe/website_creator/tests/neighborhood.mjs` | PASS | [neighborhood](checks/neighborhood.log) |
| 34 | `node C:/Users/joe/website_creator/tests/owner-photo.mjs` | PASS | [owner-photo](checks/owner-photo.log) |
| 35 | `node C:/Users/joe/website_creator/tests/planning-ambient.mjs` | PASS | [planning-ambient](checks/planning-ambient.log) |
| 36 | `node C:/Users/joe/website_creator/tests/planning-motion.mjs` | PASS | [planning-motion](checks/planning-motion.log) |
| 37 | `node C:/Users/joe/website_creator/tests/planning-scroll.mjs` | PASS | [planning-scroll](checks/planning-scroll.log) |
| 38 | `node C:/Users/joe/website_creator/tests/platform.mjs` | PASS | [platform](checks/platform.log) |
| 39 | `node C:/Users/joe/website_creator/tests/premium-service.mjs` | PASS | [premium-service](checks/premium-service.log) |
| 40 | `node C:/Users/joe/website_creator/tests/presentation.mjs` | PASS | [presentation](checks/presentation.log) |
| 41 | `node C:/Users/joe/website_creator/tests/project-experience.mjs` | PASS | [project-experience](checks/project-experience.log) |
| 42 | `node C:/Users/joe/website_creator/tests/promotion-unlocks.mjs` | PASS | [promotion-unlocks](checks/promotion-unlocks.log) |
| 43 | `node C:/Users/joe/website_creator/tests/reference-proof.mjs` | PASS | [reference-proof](checks/reference-proof.log) |
| 44 | `node C:/Users/joe/website_creator/tests/review-lookup.mjs` | PASS | [review-lookup](checks/review-lookup.log) |
| 45 | `node C:/Users/joe/website_creator/tests/roofing-cities.mjs` | PASS | [roofing-cities](checks/roofing-cities.log) |
| 46 | `node C:/Users/joe/website_creator/tests/roofing-cta.mjs` | PASS | [roofing-cta](checks/roofing-cta.log) |
| 47 | `node C:/Users/joe/website_creator/tests/roofing-story.mjs` | PASS | [roofing-story](checks/roofing-story.log) |
| 48 | `node C:/Users/joe/website_creator/tests/sales-ops.mjs` | PASS | [sales-ops](checks/sales-ops.log) |
| 49 | `node C:/Users/joe/website_creator/tests/saved-designs.mjs` | PASS | [saved-designs](checks/saved-designs.log) |
| 50 | `node C:/Users/joe/website_creator/tests/scroll-media.mjs` | PASS | [scroll-media](checks/scroll-media.log) |
| 51 | `node C:/Users/joe/website_creator/tests/scroll-story.mjs` | PASS | [scroll-story](checks/scroll-story.log) |
| 52 | `node C:/Users/joe/website_creator/tests/scroll-video-controller.mjs` | PASS | [scroll-video-controller](checks/scroll-video-controller.log) |
| 53 | `node C:/Users/joe/website_creator/tests/service-content.mjs` | PASS | [service-content](checks/service-content.log) |
| 54 | `node C:/Users/joe/website_creator/tests/service-motion.mjs` | PASS | [service-motion](checks/service-motion.log) |
| 55 | `node C:/Users/joe/website_creator/tests/service-pages-all-trades.mjs` | PASS | [service-pages-all-trades](checks/service-pages-all-trades.log) |
| 56 | `node C:/Users/joe/website_creator/tests/service-playbook.mjs` | PASS | [service-playbook](checks/service-playbook.log) |
| 57 | `node C:/Users/joe/website_creator/tests/showpiece-media.mjs` | PASS | [showpiece-media](checks/showpiece-media.log) |
| 58 | `node C:/Users/joe/website_creator/tests/showpiece-v4.mjs` | PASS | [showpiece-v4](checks/showpiece-v4.log) |
| 59 | `node C:/Users/joe/website_creator/tests/template-name.mjs` | PASS | [template-name](checks/template-name.log) |
| 60 | `node C:/Users/joe/website_creator/tests/trade-enablement.mjs` | PASS | [trade-enablement](checks/trade-enablement.log) |
| 61 | `node C:/Users/joe/website_creator/tests/trade-revisions.mjs` | PASS | [trade-revisions](checks/trade-revisions.log) |
| 62 | `node C:/Users/joe/website_creator/tests/trade-upgrade.mjs` | PASS | [trade-upgrade](checks/trade-upgrade.log) |
| 63 | `node C:/Users/joe/website_creator/tests/trade-visual-correctness.mjs` | PASS | [trade-visual-correctness](checks/trade-visual-correctness.log) |
| 64 | `node C:/Users/joe/website_creator/tests/trades-financing.mjs` | PASS | [trades-financing](checks/trades-financing.log) |
| 65 | `node C:/Users/joe/website_creator/tests/trust.mjs` | PASS | [trust](checks/trust.log) |
| 66 | `node C:/Users/joe/website_creator/tests/website-pages.mjs` | PASS | [website-pages](checks/website-pages.log) |
| 67 | `node C:/Users/joe/website_creator/tests/workspace-owner.mjs` | PASS | [workspace-owner](checks/workspace-owner.log) |
| 68 | `node C:/Users/joe/website_creator/tests/workspace.mjs` | PASS | [workspace](checks/workspace.log) |
| 69 | `node C:/Users/joe/website_creator/tests/zoom.mjs` | PASS | [zoom](checks/zoom.log) |
| 70 | `node C:/Users/joe/website_creator/scripts/check-template-assets.mjs` | PASS | [template-assets](checks/template-assets.log) |
| 71 | `node C:/Users/joe/website_creator/tests/platform-mobile.mjs` | PASS | [platform-mobile](checks/platform-mobile.log) |
| 72 | `node C:/Users/joe/website_creator/docs/build-evidence/clips-phase2/callback-calendar-clock.mjs` | PASS | [callback-browser](checks/callback-browser.log) |
| 73 | `node C:/Users/joe/website_creator/tests/contact-linkage-browser.mjs` | PASS | [contact-linkage-browser](checks/contact-linkage-browser.log) |
| 74 | `node C:/Users/joe/website_creator/tests/contacts-browser.mjs` | PASS | [contacts-browser](checks/contacts-browser.log) |
| 75 | `node C:/Users/joe/website_creator/tests/ebook-browser.mjs` | PASS | [ebook-browser](checks/ebook-browser.log) |
| 76 | `node C:/Users/joe/website_creator/tests/expense-polish-browser.mjs` | PASS | [expense-polish-browser](checks/expense-polish-browser.log) |
| 77 | `node C:/Users/joe/website_creator/tests/expenses-browser.mjs` | PASS | [expenses-browser](checks/expenses-browser.log) |
| 78 | `node C:/Users/joe/website_creator/tests/financing-states-browser.mjs` | PASS | [financing-states-browser](checks/financing-states-browser.log) |
| 79 | `node C:/Users/joe/website_creator/tests/generation-browser.mjs` | PASS | [generation-browser](checks/generation-browser.log) |
| 80 | `node C:/Users/joe/website_creator/tests/hero-editor-browser.mjs` | PASS | [hero-editor-browser](checks/hero-editor-browser.log) |
| 81 | `node C:/Users/joe/website_creator/tests/planning-ambient-browser.mjs` | PASS | [planning-ambient-browser](checks/planning-ambient-browser.log) |
| 82 | `node C:/Users/joe/website_creator/tests/planning-scroll-browser.mjs` | PASS | [planning-scroll-browser](checks/planning-scroll-browser.log) |
| 83 | `node C:/Users/joe/website_creator/tests/platform-ui-cleanup-browser.mjs` | PASS | [platform-ui-cleanup-browser](checks/platform-ui-cleanup-browser.log) |
| 84 | `node C:/Users/joe/website_creator/tests/promotion-unlocks-browser.mjs` | PASS | [promotion-unlocks-browser](checks/promotion-unlocks-browser.log) |
| 85 | `node C:/Users/joe/website_creator/tests/roofing-cities-browser.mjs` | PASS | [roofing-cities-browser](checks/roofing-cities-browser.log) |
| 86 | `node C:/Users/joe/website_creator/tests/roofing-cta-browser.mjs` | PASS | [roofing-cta-browser](checks/roofing-cta-browser.log) |
| 87 | `node C:/Users/joe/website_creator/tests/roofing-story-browser.mjs` | PASS | [roofing-story-browser](checks/roofing-story-browser.log) |
| 88 | `node C:/Users/joe/website_creator/tests/service-motion-browser.mjs` | PASS | [service-motion-browser](checks/service-motion-browser.log) |
| 89 | `node C:/Users/joe/website_creator/tests/trade-enablement-browser.mjs` | PASS | [trade-enablement-browser](checks/trade-enablement-browser.log) |
| 90 | `node C:/Users/joe/website_creator/tests/trade-visual-browser.mjs` | PASS | [trade-visual-browser](checks/trade-visual-browser.log) |
| 91 | `node C:/Users/joe/website_creator/tests/clips-phase2.mjs` | PASS | [clips-phase2](checks/clips-phase2.log) |
| 92 | `node C:/Users/joe/website_creator/tests/clips-phase2-browser.mjs` | PASS | [clips-phase2-browser](checks/clips-phase2-browser.log) |
| 93 | `node C:/Users/joe/website_creator/tests/roofing-polish-part1.mjs` | PASS | [roofing-polish-part1](checks/roofing-polish-part1.log) |
| 94 | `node C:/Users/joe/website_creator/tests/roofing-polish-part1-browser.mjs` | PASS | [roofing-polish-part1-browser](checks/roofing-polish-part1-browser.log) |
| 95 | `node C:/Users/joe/website_creator/tests/roofing-polish-part2.mjs` | PASS | [roofing-polish-part2](checks/roofing-polish-part2.log) |
| 96 | `node C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs` | PASS | [roofing-polish-part2-browser](checks/roofing-polish-part2-browser.log) |
| 97 | `node C:/Users/joe/website_creator/tests/roofing-acceptance.mjs` | PASS | [roofing-acceptance](checks/roofing-acceptance.log) |
| 98 | `node C:/Users/joe/website_creator/tests/design-styles.mjs` | PASS | [design-styles](checks/design-styles.log) |
| 99 | `node C:/Users/joe/website_creator/tests/promotions-ambient.mjs` | PASS | [promotions-ambient](checks/promotions-ambient.log) |
| 100 | `node C:/Users/joe/website_creator/tests/promotions-scroll.mjs` | PASS | [promotions-scroll](checks/promotions-scroll.log) |
| 101 | `node C:/Users/joe/website_creator/tests/promotions-ambient-browser.mjs` | PASS | [promotions-ambient-browser](checks/promotions-ambient-browser.log) |
| 102 | `node C:/Users/joe/website_creator/tests/promotions-scroll-browser.mjs` | PASS | [promotions-scroll-browser](checks/promotions-scroll-browser.log) |

### Reproduction

New commands: `node tests/uniqueness.mjs`, `node tests/uniqueness-api.mjs`, `node tests/uniqueness-content-parity.mjs`, `node tests/uniqueness-browser.mjs`. Set `BV_028B_PARALLEL=2` for independent browser viewport contexts. Existing variant commands use `BV_028B_EVIDENCE=C:/Users/joe/website_creator/docs/build-evidence/028C`. The local full-suite runner is `tools/suite.mjs`; protected checks are `tools/sites-unchanged.mjs after` and `tools/preservation.mjs`. Builds must finish before browser matrices start.

No remaining blocker. AI copy is deliberately disconnected, not a claimed live integration. Existing unregenerated sites and platform styles remain protected. Evidence backups, scratch runtime databases, old redirected screenshot trees and downloaded executables are excluded from this commit. **0 Higgsfield credits; no provider calls, push or deployment. #028D has not started.**
