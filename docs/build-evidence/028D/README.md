# #028D — Media library fallback

**Complete locally. All required gates pass.** Base `fc25c85`, branch `feature/local-environment-setup`. **0 credits used; 0 provider calls.** Local commit only; no push or deployment.

## Built and reused

- Added runtime libraries for all 17 trades, with ten hero clip slots, hero stills and four section-still pools. Each asset records source, rights/license, date, approval, approver, Sample flag and recolor permission. Unclear assets stay Pending; rejected takes stay rejected.
- Reused installed imagery, job/provenance records, existing Phase 2 section clips, #028C seed/transaction reservations and #023 manifests. No original media file was changed.
- Implemented deterministic approved-only picks, least-used same-trade selection, staff overrides with actor history, exact replay, bounded non-destructive palette tint and selected owned-photo priority. Thin clip pools use approved stills. Exhaustion is recorded.
- New runtime code is opt-in. Sites without media picks retain their prior HTML/CSS. Existing variant-a renderer bodies and old stylesheets are untouched. There is no new route, migration, UI or provider integration.
- Static posters cover reduced motion, JavaScript off and unavailable/pending clips. Videos lazy-load, remain silent/inline, pause offscreen, reserve dimensions and expose keyboard pause/resume. Full-bleed text has an opaque contrast surface.
- #028B2 More section variants is logged for later; it is not implemented. #028E is not started.

[Runtime contract](../../media/LIBRARY.md) · [Rights and approvals](../../media/RIGHTS-AND-APPROVALS.md) · [Full inventory](media-inventory.json) · [Runtime catalog](../../../../public/trade-media-library.json) · [Review ledger](visual-review/review-ledger.json)

## Approved counts

| Trade | Hero clips | Section clips | Hero stills | Section stills |
|---|---:|---:|---:|---:|
| Roofing | 1 | 3 | 10 | 13 |
| Patios | 2 | 0 | 3 | 3 |
| Plumbing | 1 | 0 | 2 | 2 |
| HVAC | 1 | 0 | 5 | 5 |
| Electrical | 1 | 0 | 2 | 2 |
| Landscaping | 1 | 0 | 2 | 2 |
| General Contractors | 1 | 0 | 2 | 2 |
| Flooring | 2 | 0 | 4 | 4 |
| Painting | 1 | 0 | 4 | 4 |
| Fencing | 1 | 0 | 8 | 8 |
| Garage Doors | 2 | 0 | 4 | 4 |
| Pest Control | 0 | 0 | 3 | 3 |
| Windows/Doors | 0 | 0 | 4 | 4 |
| Solar | 0 | 0 | 1 | 1 |
| Concrete | 0 | 0 | 3 | 3 |
| Pools | 0 | 0 | 2 | 2 |
| Locksmith | 0 | 0 | 2 | 2 |

Distinct assets: **17 approved clips** (14 hero + 3 section) and **60 approved stills/posters**. Windows/Doors uses four relevant, approved door/window/interior assets whose original Locksmith, Painting and General Contractors provenance is retained. Section/hero pools can share the same file; table entries are not additive distinct-file counts.

Starter to two hero clips/trade: **1,600 credits**, leaving **177.8** of Joe’s reported **1,777.8**. Starter to four: **4,320 credits**, exceeding that balance by **2,542.2**. These reuse historical quotes; no live cost/balance call was made. Full remaining target is 12,516 credits. [Per-trade counts and every missing prompt](MEDIA-GAPS.md).



## Fictional Sample proof

Five local fixtures, never real businesses or externally published pages. Roofing reuses the three #028C fixtures, including Paper Lantern with no review source. Two HVAC fixtures have different cities, services and palettes. Every same-trade pair has different approved hero media. The 12% treatments are saved in their manifests.

| Sample | City | Look / approved hero | Tint | Screenshots |
|---|---|---|---|---|
| Sample Fictional Copper Kite Roofing | Ventura | current / `still-72eda981c2b0353c` | `#95613d` | [1440](after/sample-fictional-copper-kite-ventura-1440.png) / [390](after/sample-fictional-copper-kite-ventura-390.png) |
| Sample Fictional Blue Orchard Roofing | Pasadena | classic / `still-ac470bbf04776726` | `#326b78` | [1440](after/sample-fictional-blue-orchard-pasadena-1440.png) / [390](after/sample-fictional-blue-orchard-pasadena-390.png) |
| Sample Fictional Paper Lantern Roofing | Temecula | current / `roofing-trade-craft-films-poster` | `#78603c` | [1440](after/sample-fictional-paper-lantern-temecula-1440.png) / [390](after/sample-fictional-paper-lantern-temecula-390.png) |
| Sample Fictional Cobalt Heron HVAC | Irvine | bold / `still-caa2bf273a4f103e` | `#326778` | [1440](after/sample-fictional-cobalt-heron-irvine-1440.png) / [390](after/sample-fictional-cobalt-heron-irvine-390.png) |
| Sample Fictional Ochre Willow HVAC | Riverside | fresh / `still-a4779e366baf829f` | `#885336` | [1440](after/sample-fictional-ochre-willow-riverside-1440.png) / [390](after/sample-fictional-ochre-willow-riverside-390.png) |

[Desktop hero comparison](side-by-side-hero-1440.jpg) · [Phone hero comparison](side-by-side-hero-390.jpg) · [Full desktop pages](side-by-side-full-1440.jpg) · [Full phone pages](side-by-side-full-390.jpg) · [Saved fixture manifests](sample-fixtures.json).

## Final verification

| Gate | Result | Evidence |
|---|---|---|
| Existing suite | 102/102 PASS, build and client typecheck included | [Details](full-checks.json) |
| Media selection/replay | 3287 checks / 68 trade-style cases PASS | [Details](checks/media-library.json) |
| Media API | 481 checks / 68 cases PASS | [Details](checks/media-api.json) |
| Media inventory | 6868 checks; 804 installed catalog entries PASS | [Details](checks/media-inventory-validation.json) |
| Media browser matrix | 423 states + 20 normal/JS-off; 117 affected states rechecked PASS | [Details](checks/media-browser.json) |
| Interaction audit | 84 states, all four Looks, a/b/c, chapter/static hero modes, both viewports PASS | [Details](checks/media-interactions.json) |
| Existing browser matrices | 216 + 544 states PASS | [Details](checks/process-all-kits.json) |
| Render and filter | 8,293 variant checks + 62 filter checks PASS | [Details](checks/section-variants.json) |
| Static/empty fallbacks | 608 assertions / 94 states PASS | [Details](checks/variants-fallbacks.json) |
| Original and generated content parity | 2,448 + 2,448 comparisons; four negative boundaries each PASS | [Details](checks/generated-content-parity.json) |
| Uniqueness regression | 3,859 unit + 418 API checks PASS | [Details](checks/uniqueness.json) |
| Text AA | 109,000 measurements / 0 failures | [Details](checks/quality-summary.json) |
| Control borders / focus | 3,084 borders and 29,284 focus checks / 0 failures | [Details](checks/quality-summary.json) |
| Overflow / content / primary actions / page exceptions | 0 failures | [Details](checks/quality-summary.json) |
| CLS | Maximum 0.024156 <= 0.05 | [Details](checks/quality-summary.json) |
| Platform legacy audit | 383 captures, 33,611 text + 66,834 border measurements / 0 failures | [Details](checks/quality-summary.json) |
| Protected site hashes | 279 + platform.css = 280/280 exact matches | [Details](checks/accepted-protected-final.json) |
| Archived responses | 374/374 byte-identical | [Details](checks/sites-unchanged.log) |

Text AA by Look (main matrices):

| Look | Measurements | Failures |
|---|---:|---:|
| current | 24,842 | 0 |
| bold | 24,106 | 0 |
| fresh | 24,074 | 0 |
| classic | 24,261 | 0 |

The final Current rerun replaces the affected states when aggregating quality counts. The additional interaction audit checks real pointer and keyboard pause/resume, offscreen pause, reserved dimensions, no video fetch with reduced motion/JS off, loaded posters and opaque text surfaces over tinted imagery. JS-off CLS is explicitly unmeasured, not reported as zero. All review providers in browser tests are local fixtures; external calls are blocked.

The existing narrow platform console matcher is unchanged. Platform-gated non-allowlisted diagnostics: **0**. As in accepted #028C, optional legacy capture also records public negative-fixture/resource diagnostics outside that platform gate; they remain raw diagnostic data and are not newly allowlisted. Their count and the inherited exception count are in the quality summary.

## QA corrections and reuse

- Fixed intrinsic hero sizing and preserved original `aside` tags when attaching media.
- Kept original chapter-controller hooks; placed full-bleed and static-hero pause controls outside inaccessible image layers. Scoped overrides neutralize the old icon-button positioning only on the new inline media control. Pointer clicks are tested without force.
- Paused media stays below the sticky header. Media-enabled Current chapter CTAs use the existing generated contrast-safe color pair, and the static hero separator inherits its readable text color. Old stylesheets and sites without picks are unchanged.
- Changing trades clears incompatible saved media until regeneration; rendering also rejects mismatched trade records. A newly selected valid owned hero immediately wins without recoloring.
- `tests/uniqueness-content-parity.mjs` now counts `.ml-motion` even inside the old topline exclusion. This strengthens control parity across a/b/c; no factual, form or behavior assertion was weakened.
- Reused #028A style tokens, #028B renderers, #028C seeds/atomic reservations and #023 manifest history. Full protected hashing also proves all original renderer bodies and existing stylesheets stayed unchanged. No dependency, route, migration, auth model or provider integration was added.

## Every existing command

Run from `C:\Users\joe\website_creator`. The suite invokes the implementations of `npm run build` and `npm run typecheck:client`; both named npm commands were also executed successfully.

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

## Reproduction and scope

Run `tests/media-library.mjs`, `tests/media-inventory.mjs`, `tests/media-api.mjs` and `tests/media-library-browser.mjs`. The focused audit uses `--media-only`; the affected-Look rerun uses `--current-final`. The full suite is `docs/build-evidence/028D/tools/suite.mjs`. Existing variants use `BV_028B_EVIDENCE=C:/Users/joe/website_creator/docs/build-evidence/028D/variants` and optionally `BV_028B_PARALLEL=2`. Finish builds before browser matrices; legacy evidence writers are redirected into this ticket. Final hashing uses `tools/sites-unchanged.mjs after` and `tools/preservation.mjs`.

The original 11,355-file inventory is the pre-ticket repository snapshot, excluding dependencies, build copies, `.preserve/` and this ticket’s new captures. Initial candidate/estimate artifacts are retained as history; the runtime catalog, review ledger, updated MEDIA-GAPS and final checks above are authoritative. Evidence/reference screenshots are not selectable website content. Pending inventory is never a new library pick; legacy pages retain their accepted output by requirement. Custom contractor video stays disabled until #028F.

Large redirected legacy screenshot trees, debug captures, backups, temporary runtime files and downloaded test executables are excluded from the commit. Required final captures, visual approval evidence, raw checks and comparison evidence are included. `.preserve/`, OneDrive and unrelated files/apps were not operated on. **0 credits spent; Joe’s reported balance remains 1,777.8. No push or deploy. #028E not started.**

## Pending because of content or uncertainty



The table lists every visually reviewed asset that could not be cleared. A Pending decision is conservative, not a claim that every small blurred mark is readable. The individual review sheet is linked in the ledger. Catalog-only clips without job IDs and unreviewed installed assets also remain Pending for provenance; they are excluded from selection. Prior #025 takes and the first #027 take remain rejected. The owner-sample images containing “YOUR PHOTO HERE” remain Pending and are not library picks.

| Asset / inspected file | Reason |
|---|---|
| `still-7354c5e21ede849e` — `/assets/kit-concrete.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-c0a6242e82f1d99b` — `/assets/service-showpiece/concrete-concrete-driveways-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-fbf6f580fa886d08` — `/assets/service-showpiece/concrete-concrete-driveways-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-a97dbf7fc402caa0` — `/assets/service-showpiece/concrete-concrete-foundations-hero.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-331eafd3b481f4e9` — `/assets/service-showpiece/concrete-concrete-foundations-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-604019c93365567d` — `/assets/service-showpiece/concrete-concrete-foundations-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-2800279892175e73` — `/assets/service-showpiece/concrete-concrete-patios-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-aae4cbf23b33ebf1` — `/assets/service-showpiece/concrete-concrete-patios-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-2b16fe0112965a36` — `/assets/service-showpiece/concrete-concrete-repair-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-862d12f71fa2b787` — `/assets/service-showpiece/concrete-concrete-repair-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-9f94d679ee3bb590` — `/assets/service-showpiece/concrete-concrete-repair-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-8600c234cc1ed157` — `/assets/service-showpiece/concrete-concrete-slabs-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-501a4058354da5e9` — `/assets/service-showpiece/concrete-concrete-slabs-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-a497fe162130af3d` — `/assets/service-showpiece/concrete-concrete-slabs-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-a81332bda2070778` — `/assets/service-showpiece/concrete-concrete-walkways-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-89d21988a2270b79` — `/assets/service-showpiece/concrete-concrete-walkways-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-a01ad42836c9da83` — `/assets/service-showpiece/concrete-concrete-walkways-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-47e2c9ecf4cee1b0` — `/assets/service-showpiece/concrete-decorative-concrete-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-bdcc80271ae5d28e` — `/assets/service-showpiece/concrete-decorative-concrete-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-25c1609133eb9292` — `/assets/service-showpiece/concrete-decorative-concrete-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-4a29a510ea3831ec` — `/assets/service-showpiece/concrete-stamped-concrete-hero.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-9b16ce60d9f517a6` — `/assets/service-showpiece/concrete-stamped-concrete-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-14659e1ee5b23f58` — `/assets/service-showpiece/concrete-stamped-concrete-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-e39f72b44f64cf3f` — `/assets/trade-enablement/concrete-kit-banner.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-167fcbad44b9223e` — `/assets/service-showpiece/electrical-backup-generators-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-71e7f11f0affb2d2` — `/assets/service-showpiece/electrical-backup-generators-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d3f19da2f7ca9349` — `/assets/service-showpiece/electrical-electrical-inspections-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-231ce769685e655d` — `/assets/service-showpiece/electrical-electrical-inspections-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d704b0f8d52037fc` — `/assets/service-showpiece/electrical-electrical-repairs-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-11023e8b286f0363` — `/assets/service-showpiece/electrical-electrical-repairs-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-2385e636fe6751ba` — `/assets/service-showpiece/electrical-ev-chargers-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-f2af636fa398faa0` — `/assets/service-showpiece/electrical-ev-chargers-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-8b20bd4297b2a848` — `/assets/service-showpiece/electrical-lighting-installation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-f47ec608c2366f8c` — `/assets/service-showpiece/electrical-lighting-installation-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-2300535239abd9d6` — `/assets/service-showpiece/electrical-outlets-and-switches-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-7a034d871dc77e42` — `/assets/service-showpiece/electrical-outlets-and-switches-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-25fa3a1e737e85b4` — `/assets/service-showpiece/electrical-panel-upgrades-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-5c9c2ce93237ece6` — `/assets/service-showpiece/electrical-panel-upgrades-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-97e4bbff6d412980` — `/assets/service-showpiece/electrical-rewiring-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-cafd7e2c84cbf238` — `/assets/service-showpiece/electrical-rewiring-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-8b60faeccb29e9c0` — `/assets/service-showpiece/fencing-commercial-fencing-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e029701217f831a9` — `/assets/service-showpiece/fencing-commercial-fencing-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d9715ff423baa30b` — `/assets/service-showpiece/fencing-metal-fencing-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-11c1f64f3e8f3174` — `/assets/service-showpiece/fencing-pool-fencing-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-471eef8ccd199ad2` — `/assets/service-showpiece/fencing-pool-fencing-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-88981d5306171c06` — `/assets/service-showpiece/fencing-privacy-fencing-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-46bc6da37026366d` — `/assets/service-showpiece/fencing-privacy-fencing-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0eb614c0cc7576d9` — `/assets/service-showpiece/fencing-vinyl-fencing-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-798e60b1985fb0d9` — `/assets/service-showpiece/fencing-vinyl-fencing-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-d750d58be7b2dc8f` — `/assets/service-showpiece/fencing-wood-fencing-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-2a610285951388b1` — `/assets/service-showpiece/flooring-commercial-flooring-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-270ea34a2a3713d6` — `/assets/service-showpiece/flooring-commercial-flooring-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e1e20f592862db4b` — `/assets/service-showpiece/flooring-floor-refinishing-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e12a1d9b30dbdb40` — `/assets/service-showpiece/flooring-floor-refinishing-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-c0d629852a3b4dab` — `/assets/service-showpiece/flooring-floor-repair-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-48b0ff01c2a09de7` — `/assets/service-showpiece/flooring-hardwood-flooring-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-b13b5b86c9102026` — `/assets/service-showpiece/flooring-hardwood-flooring-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-25915b861f1f8196` — `/assets/service-showpiece/flooring-laminate-flooring-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-6b53542e2ef2fd43` — `/assets/service-showpiece/flooring-laminate-flooring-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-258741eaae0aa969` — `/assets/service-showpiece/flooring-luxury-vinyl-flooring-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-3d16508719014fee` — `/assets/service-showpiece/flooring-subfloor-preparation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-082108c9b8b889b8` — `/assets/service-showpiece/flooring-subfloor-preparation-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-5617a3a03ff09901` — `/assets/service-showpiece/flooring-tile-flooring-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-832dba63f974070f` — `/assets/service-showpiece/flooring-tile-flooring-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-c8c5cb3af67b7e1e` — `/assets/service-showpiece/garage-doors-garage-door-installation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-35e73f985624515a` — `/assets/service-showpiece/garage-doors-garage-door-installation-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-9b8f1600a132cd8d` — `/assets/service-showpiece/garage-doors-garage-door-maintenance-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-c4e9111e7f291b0c` — `/assets/service-showpiece/garage-doors-garage-door-maintenance-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-59527c4acda0c4f5` — `/assets/service-showpiece/garage-doors-garage-door-repair-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-6800afbb189fadab` — `/assets/service-showpiece/garage-doors-opener-installation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-a776da42fe4a1ef4` — `/assets/service-showpiece/garage-doors-opener-installation-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-85f37f4cb306bd0d` — `/assets/service-showpiece/garage-doors-opener-repair-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e3612226dc9e1acd` — `/assets/service-showpiece/garage-doors-opener-repair-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-55808fc62ac71913` — `/assets/service-showpiece/garage-doors-panel-replacement-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-726c8608a723805f` — `/assets/service-showpiece/garage-doors-panel-replacement-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-f25c06caff0278c8` — `/assets/service-showpiece/garage-doors-spring-replacement-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-f239ba1c60394a49` — `/assets/service-showpiece/garage-doors-spring-replacement-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-8a2cb3223b2f705f` — `/assets/service-showpiece/garage-doors-weather-sealing-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-3ab9cf2cb44a191d` — `/assets/service-showpiece/general-contractors-adus-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-70a28681515ca7e8` — `/assets/service-showpiece/general-contractors-adus-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-c3945863032798fa` — `/assets/service-showpiece/general-contractors-bathroom-remodeling-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-eee6ff1b449d508e` — `/assets/service-showpiece/general-contractors-bathroom-remodeling-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-483906967076d6f6` — `/assets/service-showpiece/general-contractors-commercial-improvements-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-39111959cca396e6` — `/assets/service-showpiece/general-contractors-commercial-improvements-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-ff4334bb74effb3f` — `/assets/service-showpiece/general-contractors-home-remodeling-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0548f72dd12b60f2` — `/assets/service-showpiece/general-contractors-home-remodeling-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-dd84f20a2d417edb` — `/assets/service-showpiece/general-contractors-kitchen-remodeling-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-68247eab69adf7ec` — `/assets/service-showpiece/general-contractors-kitchen-remodeling-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-047f87d8b5f6868e` — `/assets/service-showpiece/general-contractors-new-construction-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-892bbc9703d411b6` — `/assets/service-showpiece/general-contractors-new-construction-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-e322a7cc951601cd` — `/assets/service-showpiece/general-contractors-room-additions-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-eb8935e6a68498a1` — `/assets/service-showpiece/general-contractors-room-additions-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-9f67518a4bea11c8` — `/assets/service-showpiece/general-contractors-whole-home-renovation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-5997305c5913c68e` — `/assets/service-showpiece/general-contractors-whole-home-renovation-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-9c8763377f0c9504` — `/assets/service-showpiece/hvac-air-conditioning-installation-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-25022832c923caa4` — `/assets/service-showpiece/hvac-air-conditioning-installation-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0c5e210916ad1c12` — `/assets/service-showpiece/hvac-air-conditioning-repair-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-dafdca8be5075967` — `/assets/service-showpiece/hvac-air-conditioning-repair-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-022786c71463e3bc` — `/assets/service-showpiece/hvac-ductwork-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-594c65665a70253c` — `/assets/service-showpiece/hvac-heat-pumps-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-88075c635bafa6fe` — `/assets/service-showpiece/hvac-heat-pumps-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-af48d06fe16bf019` — `/assets/service-showpiece/hvac-heating-installation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e4f42fa66ab25aa3` — `/assets/service-showpiece/hvac-heating-installation-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-74ad30d7e10a1879` — `/assets/service-showpiece/hvac-heating-repair-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-77dca63840e50c88` — `/assets/service-showpiece/hvac-heating-repair-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-b7a9188adbe91429` — `/assets/service-showpiece/hvac-indoor-air-quality-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-ac5a928cdf03ca0f` — `/assets/service-showpiece/hvac-system-maintenance-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-c1351be51e5d85c7` — `/assets/service-showpiece/landscaping-artificial-turf-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-56de741e79b92fd6` — `/assets/service-showpiece/landscaping-artificial-turf-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-eecb1b6e86d6d415` — `/assets/service-showpiece/landscaping-hardscaping-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-b62e97da1303247e` — `/assets/service-showpiece/landscaping-hardscaping-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e5546567137a33f6` — `/assets/service-showpiece/landscaping-irrigation-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-0ee2a08dd997cd18` — `/assets/service-showpiece/landscaping-irrigation-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-9403bcbbb7dc2696` — `/assets/service-showpiece/landscaping-landscape-design-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-60a5cb7c5fc81b0f` — `/assets/service-showpiece/landscaping-landscape-design-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-bb89afda77b3e6ab` — `/assets/service-showpiece/landscaping-landscape-installation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-2de60acea5fc23dc` — `/assets/service-showpiece/landscaping-landscape-installation-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-fb218d64c469c6b3` — `/assets/service-showpiece/landscaping-landscape-lighting-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-b98e5c9c121ed5b7` — `/assets/service-showpiece/landscaping-landscape-lighting-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-5620c18d5baa4bad` — `/assets/service-showpiece/landscaping-lawn-care-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-30629b9acfaf2e90` — `/assets/service-showpiece/landscaping-lawn-care-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-97f9f972ca2e8742` — `/assets/service-showpiece/landscaping-seasonal-maintenance-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-5a4893e96cfc6afe` — `/assets/service-showpiece/landscaping-seasonal-maintenance-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-022fea9a5d5a067a` — `/assets/kit-locksmith.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-ead30e51d22786b0` — `/assets/trade-enablement/locksmith-automotive-lockout-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-c82886c074621d49` — `/assets/trade-enablement/locksmith-automotive-lockout-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-bb764ccc21c91844` — `/assets/trade-enablement/locksmith-automotive-lockout-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e0d9ab8d706aac2f` — `/assets/trade-enablement/locksmith-commercial-access-control-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-657de7f8914f7ac2` — `/assets/trade-enablement/locksmith-commercial-access-control-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-2d99c8f4bb5335cc` — `/assets/trade-enablement/locksmith-commercial-access-control-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-88a8d89129c94f49` — `/assets/trade-enablement/locksmith-key-duplication-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0d456867f94363b1` — `/assets/trade-enablement/locksmith-key-duplication-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-55b28a795c1e6a73` — `/assets/trade-enablement/locksmith-key-duplication-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-fa075d0c896961d1` — `/assets/trade-enablement/locksmith-kit-banner.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-a44b57a47b5ed3f9` — `/assets/trade-enablement/locksmith-lock-installation-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-465ac4e13b782f10` — `/assets/trade-enablement/locksmith-lock-installation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-c34c42db3e9284bd` — `/assets/trade-enablement/locksmith-lock-installation-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-4bda27c0933c1a76` — `/assets/trade-enablement/locksmith-rekeying-hero.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-8707b18c519e9025` — `/assets/trade-enablement/locksmith-rekeying-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-51c792d7936ad978` — `/assets/trade-enablement/locksmith-residential-lockout-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-45ed8b491e123753` — `/assets/trade-enablement/locksmith-residential-lockout-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-2580d5af47a3db4b` — `/assets/trade-enablement/locksmith-residential-lockout-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-bbe800d9dfdf9527` — `/assets/trade-enablement/locksmith-safe-servicing-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-244f4d5dafbc69bb` — `/assets/trade-enablement/locksmith-safe-servicing-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-53134c8301c3c788` — `/assets/trade-enablement/locksmith-safe-servicing-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d7a547463bfc32f1` — `/assets/trade-enablement/locksmith-smart-locks-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0d847f1c204ac516` — `/assets/trade-enablement/locksmith-smart-locks-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0579b169dab26ad0` — `/assets/trade-enablement/locksmith-smart-locks-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-74b25e9dd18ddf9f` — `/assets/service-showpiece/painting-cabinet-painting-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0bd57151b8dc9d24` — `/assets/service-showpiece/painting-cabinet-painting-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-9ef8fbe22dd5c9a8` — `/assets/service-showpiece/painting-commercial-painting-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-581136585e1ae420` — `/assets/service-showpiece/painting-commercial-painting-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-95261a08be60d334` — `/assets/service-showpiece/painting-deck-and-fence-staining-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-9de7a233e2d00960` — `/assets/service-showpiece/painting-deck-and-fence-staining-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-50f1bed4246af6ad` — `/assets/service-showpiece/painting-decorative-finishes-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-663125cc83964566` — `/assets/service-showpiece/painting-decorative-finishes-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-6e49ae25fbd4aecb` — `/assets/service-showpiece/painting-drywall-repair-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d9aabe216e3a2e24` — `/assets/service-showpiece/painting-drywall-repair-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-edcbb7ab347a6999` — `/assets/service-showpiece/painting-exterior-painting-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e234ba90b2938ab4` — `/assets/service-showpiece/painting-interior-painting-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-23b87cec419dc886` — `/assets/service-showpiece/painting-interior-painting-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-4afc3c173863fadc` — `/assets/service-showpiece/painting-surface-preparation-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-b1bc6cf26dd0ca6c` — `/assets/service-showpiece/patios-aluminum-patio-covers-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-6696d6d587df093a` — `/assets/service-showpiece/patios-aluminum-patio-covers-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-83bcc41c25d1f967` — `/assets/service-showpiece/patios-louvered-roofs-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-6fdee2bdba56d999` — `/assets/service-showpiece/patios-louvered-roofs-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-3b5102a3d9c3d190` — `/assets/service-showpiece/patios-motorized-pergolas-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-37a964eb483a19a5` — `/assets/service-showpiece/patios-motorized-pergolas-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-b046ba016f1f7d32` — `/assets/service-showpiece/patios-outdoor-living-spaces-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-ac104a9ec1631439` — `/assets/service-showpiece/patios-patio-covers-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-162f8b047d84bdd4` — `/assets/service-showpiece/patios-patio-covers-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-4526facb135e1245` — `/assets/service-showpiece/patios-patio-enclosures-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d0f1b125dac42616` — `/assets/service-showpiece/patios-patio-enclosures-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-ed95d12ee611530f` — `/assets/service-showpiece/patios-patio-repair-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-820dabfef2cc8132` — `/assets/service-showpiece/patios-patio-repair-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-fbd3163ef5d8f91d` — `/assets/service-showpiece/patios-wood-pergolas-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-bbbaaa923203b116` — `/assets/service-showpiece/patios-wood-pergolas-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-3274bfe97c31a74d` — `/assets/service-showpiece/pest-control-ant-control-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-b96f71dfd9462ac6` — `/assets/service-showpiece/pest-control-ant-control-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d1aa4d7882ebf226` — `/assets/service-showpiece/pest-control-cockroach-control-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-88fc66b4ba1e26d5` — `/assets/service-showpiece/pest-control-cockroach-control-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-978dc25eb7f6b4fc` — `/assets/service-showpiece/pest-control-mosquito-control-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-beea7a2983dddc2a` — `/assets/service-showpiece/pest-control-mosquito-control-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-8d089a138ea7ffe7` — `/assets/service-showpiece/pest-control-pest-inspections-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-bc9c92742af5116b` — `/assets/service-showpiece/pest-control-pest-inspections-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-a327dfc16fb86c4d` — `/assets/service-showpiece/pest-control-preventive-maintenance-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-a16528db1806719e` — `/assets/service-showpiece/pest-control-preventive-maintenance-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-5021f6b15b4e8367` — `/assets/service-showpiece/pest-control-rodent-control-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-480ef320d66c3e49` — `/assets/service-showpiece/pest-control-rodent-control-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-917f62290afe23f7` — `/assets/service-showpiece/pest-control-spider-control-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-975c679a1953a4ca` — `/assets/service-showpiece/pest-control-spider-control-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-5f6202dbfe01a6ee` — `/assets/service-showpiece/plumbing-drain-cleaning-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-3ae4a155415eaa4a` — `/assets/service-showpiece/plumbing-drain-cleaning-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-296667a2a1e7aea2` — `/assets/service-showpiece/plumbing-fixture-installation-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-15be2fcece834285` — `/assets/service-showpiece/plumbing-fixture-installation-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-54faad22814e544c` — `/assets/service-showpiece/plumbing-leak-detection-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-55643c81eaaeb185` — `/assets/service-showpiece/plumbing-plumbing-repair-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-13fa20b4caf5ba81` — `/assets/service-showpiece/plumbing-plumbing-repair-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-72ca3982d2ccaf22` — `/assets/service-showpiece/plumbing-repiping-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-4238e170b8ac0d84` — `/assets/service-showpiece/plumbing-repiping-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-921356ad771fa696` — `/assets/service-showpiece/plumbing-sewer-lines-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-76e37d39fd77ab9e` — `/assets/service-showpiece/plumbing-sewer-lines-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-78395f105079f2d0` — `/assets/service-showpiece/plumbing-water-filtration-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-60506ee435bcc4a3` — `/assets/service-showpiece/plumbing-water-filtration-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-2cf6f4997116e1e7` — `/assets/service-showpiece/plumbing-water-heaters-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-f939f939c3668632` — `/assets/service-showpiece/plumbing-water-heaters-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-8e6504867217d976` — `/assets/kit-pools.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-8a9c3ceb8db507ac` — `/assets/service-showpiece/pools-pool-construction-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-1bc52a0a04842bb3` — `/assets/service-showpiece/pools-pool-construction-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-8bd67f2d5774ef1a` — `/assets/service-showpiece/pools-pool-decking-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-5c35a7b5ecaedcaa` — `/assets/service-showpiece/pools-pool-decking-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-b0f0e12bda33c9c4` — `/assets/service-showpiece/pools-pool-design-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-2f6a9b36b7641454` — `/assets/service-showpiece/pools-pool-design-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d222554ae9972a53` — `/assets/service-showpiece/pools-pool-design-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-61e3d083ff4fe0e7` — `/assets/service-showpiece/pools-pool-equipment-hero.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-346697b56995f5dd` — `/assets/service-showpiece/pools-pool-equipment-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-5af9fc0a44b31aba` — `/assets/service-showpiece/pools-pool-equipment-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-a3861c1f13efbe6a` — `/assets/service-showpiece/pools-pool-maintenance-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-c6a2ef4b43dee989` — `/assets/service-showpiece/pools-pool-maintenance-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-8ff180000fad0536` — `/assets/service-showpiece/pools-pool-maintenance-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-9dc716b2a94749d2` — `/assets/service-showpiece/pools-pool-remodeling-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0ea1d0330ba178bd` — `/assets/service-showpiece/pools-pool-remodeling-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-c3907de569789a1b` — `/assets/service-showpiece/pools-pool-remodeling-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-916caff358da6b23` — `/assets/service-showpiece/pools-pool-resurfacing-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-b521e19322f72aed` — `/assets/service-showpiece/pools-pool-resurfacing-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-c82be6f26995094d` — `/assets/service-showpiece/pools-pool-resurfacing-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-18b77cac061eaccf` — `/assets/service-showpiece/pools-pool-tile-and-coping-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-334d7e363cbe6e36` — `/assets/service-showpiece/pools-pool-tile-and-coping-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-47b2fe64017f29b9` — `/assets/service-showpiece/pools-pool-tile-and-coping-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0b0dded4d5a044b4` — `/assets/trade-enablement/pools-kit-banner.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-f70a9e28fa4ae6b1` — `/assets/trade-enablement/pools-kit-hero.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-5a9d48796bf9256d` — `/assets/service-showpiece/roofing-asphalt-shingle-install-repair-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-933b7fdfd5a67de4` — `/assets/service-showpiece/roofing-asphalt-shingle-install-repair-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-38deeb9a85bb6fdd` — `/assets/service-showpiece/roofing-asphalt-shingles-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-ccd65c399568d1c0` — `/assets/service-showpiece/roofing-asphalt-shingles-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-05e2ba5a80e324cc` — `/assets/service-showpiece/roofing-flat-roofs-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-2a7f278cdbfef539` — `/assets/service-showpiece/roofing-gutters-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-0657a85329526034` — `/assets/service-showpiece/roofing-inspections-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e8529c2ef63c21e3` — `/assets/service-showpiece/roofing-inspections-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-1a0a4a0dd05691c3` — `/assets/service-showpiece/roofing-inspections-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-a9aad2c915d55151` — `/assets/service-showpiece/roofing-metal-roofing-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-4c9a957ff2546725` — `/assets/service-showpiece/roofing-roof-installation-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-b7de6a399b15ef3e` — `/assets/service-showpiece/roofing-roof-installation-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-e8fdc2ef274c12f0` — `/assets/service-showpiece/roofing-roof-maintenance-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-7efe6dd27b70c64a` — `/assets/service-showpiece/roofing-roof-maintenance-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-e97a9519bccd4d0d` — `/assets/service-showpiece/roofing-roof-replacement-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-955a0fdf3397af1a` — `/assets/service-showpiece/roofing-roof-replacement-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-0edd61b7532ff32f` — `/assets/service-showpiece/roofing-roof-sealing-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-27ee3e3823e3678e` — `/assets/service-showpiece/roofing-roof-sealing-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-67ca996ab96d1cab` — `/assets/service-showpiece/roofing-storm-damage-hero.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-187f0e3c93781605` — `/assets/service-showpiece/roofing-storm-damage-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-359ddada1fa86b05` — `/assets/service-showpiece/solar-solar-battery-storage-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-c4c4cf1c5e3dfd5e` — `/assets/service-showpiece/solar-solar-battery-storage-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-6bde86392614f361` — `/assets/service-showpiece/solar-solar-inverter-replacement-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-9317299bc5d9e18a` — `/assets/service-showpiece/solar-solar-inverter-replacement-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-f9f4f1c21aa3822c` — `/assets/service-showpiece/solar-solar-panel-cleaning-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-94ac76470edfe30f` — `/assets/service-showpiece/solar-solar-panel-installation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-9b2f4a208e9a19a7` — `/assets/service-showpiece/solar-solar-panel-installation-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-cfc332767293394c` — `/assets/service-showpiece/solar-solar-panel-maintenance-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-b263407ce8b3c6a0` — `/assets/service-showpiece/solar-solar-panel-maintenance-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-bde26d097d583aeb` — `/assets/service-showpiece/solar-solar-removal-and-reinstallation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-11700b9663527b7f` — `/assets/service-showpiece/solar-solar-removal-and-reinstallation-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-55d90569b455a498` — `/assets/service-showpiece/solar-solar-system-design-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-b622e7817894ec4b` — `/assets/service-showpiece/solar-solar-system-design-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-512826644f813b57` — `/assets/service-showpiece/solar-solar-system-monitoring-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-b5461eb265ebfae8` — `/assets/service-showpiece/solar-solar-system-monitoring-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-244292f6e7468a0e` — `/assets/service-showpiece/windows-doors-energy-efficient-windows-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d5a1e81e1fe3c146` — `/assets/service-showpiece/windows-doors-energy-efficient-windows-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-44c9584de7529471` — `/assets/service-showpiece/windows-doors-entry-doors-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-d5d34b7d53ede99e` — `/assets/service-showpiece/windows-doors-entry-doors-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-12bc33b2aea7b09b` — `/assets/service-showpiece/windows-doors-french-doors-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-be931f8edd69b9e1` — `/assets/service-showpiece/windows-doors-french-doors-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-461a6940963147df` — `/assets/service-showpiece/windows-doors-patio-doors-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-4ca649bd7beb2466` — `/assets/service-showpiece/windows-doors-patio-doors-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-7dff609c1e342939` — `/assets/service-showpiece/windows-doors-sliding-glass-doors-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-38d52a334d00ede4` — `/assets/service-showpiece/windows-doors-sliding-glass-doors-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-56830dcae07a213b` — `/assets/service-showpiece/windows-doors-window-and-door-repair-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-bdc0c47d75d9ac74` — `/assets/service-showpiece/windows-doors-window-and-door-repair-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-f3f7a4b24209a15d` — `/assets/service-showpiece/windows-doors-window-installation-process.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-0b4838c7c0fc4e2b` — `/assets/service-showpiece/windows-doors-window-installation-scope.webp` | Visible face or partial face; not eligible under Joe’s no-face rule. |
| `still-4a84b7d78582f7c7` — `/assets/service-showpiece/windows-doors-window-replacement-process.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `still-4369590a0db6c158` — `/assets/service-showpiece/windows-doors-window-replacement-scope.webp` | Visible or unresolved small text, branding, labels or numeric markings; not cleared under Joe’s no-text rule. |
| `roofing-trade-build-films` — `/assets/build-films/roofing.mp4` | Printed text on roofing membrane at 25%. |
| `hvac-trade-build-films` — `/assets/build-films/hvac.mp4` | Worker facial detail cannot be confidently cleared in the blurred construction frames. |
| `general-contractors-trade-build-films` — `/assets/build-films/general-contractors.mp4?v=complete-20260918` | Worker face in the 50% frame. |
| `fencing-trade-build-films` — `/assets/build-films/fencing.mp4` | Worker face/profile in the 25% frame. |
| `pest-control-trade-build-films` — `/assets/build-films/pest-control.mp4` | Printed lettering on worker shirt in the opening frame. |
| `painting-trade-build-films` — `/assets/build-films/painting.mp4` | Worker facial detail cannot be confidently cleared in the moving construction frames. |
| `plumbing-trade-craft-films` — `/assets/craft-films/plumbing.mp4` | Printed markings on blue pipe; not cleared for the no-text library. |
| `plumbing-trade-craft-films-poster` — `/assets/craft-films/plumbing-finished.webp` | Printed material detail not confidently cleared. |
| `electrical-trade-craft-films` — `/assets/craft-films/electrical.mp4` | Printed logo on glove at 50%. |
| `landscaping-trade-craft-films` — `/assets/craft-films/landscaping.mp4` | Printed text/logo on glove at 25%. |
| `pest-control-trade-craft-films` — `/assets/craft-films/pest-control.mp4` | Printed text on adhesive tube in the opening frame. |
| `pest-control-trade-craft-films-poster` — `/assets/craft-films/pest-control-finished.webp` | Printed material detail not confidently cleared. |
