# #028B follow-up — process content parity and hero spacing

**Complete locally (2026-09-28).** Verified on `feature/local-environment-setup`, based on accepted commit `10df48d`. No push, deployment, provider calls or new media. **Higgsfield credits: 0.**

## Fixes

Process b and c now retain the original supporting line, contact destination and installed process artwork. b pairs the introduction/artwork with a vertical timeline; c places the introduction/artwork above horizontal step cards, which stack on phones. Generic trades retain their three existing step names without invented descriptions. Roofing retains its existing four descriptions and either its installed photo sequence or roof-plan SVG. The contact remains the section's single primary action.

Hero b and c now reserve space for the unchanged floating rail above 1000px. Hero b also uses a balanced text/media column ratio and a bounded headline size. Both retain the original business context, phone and link destinations. Hero a, the rail component, all default renderers and platform CSS are untouched.

The backlog records the deferred issue: Process 'a' supporting line lowercases trade names (e.g. 'your hvac project'); needs proper trade display names. That original copy remains unchanged in every variant for factual parity.

The expanded phone run exposed a font-swap layout shift in Flooring b/c (CLS 0.135559). Source capture traced it to the hero heading and restored contact rows rewrapping while the existing fonts loaded. Only hero b/c now preload the installed DM Sans and Barlow font files; the font choices, source files and hero a are unchanged. The repeated cold-load diagnostic went from eight failures in 30 states to zero: all 20 b/c loads recorded zero CLS, while ten a loads remained unchanged. [Before](checks/flooring-cls-repeat-before-font-preload.json) / [After](checks/flooring-cls-repeat.json). The complete matrices and suite were restarted against this fix.

## Content-parity gate

`tests/section-content-parity.mjs` compares all six sections in a/b/c across all 17 kits and four design styles, with populated and empty optional data: **408 cases / 2,448 section comparisons**. It checks semantic text facts, business context, telephone destinations, all link destinations, media presence and complete installed source sets (the hero retains the approved poster-for-film exception) and form field facts. Populated review fixtures run through the actual review client, including review excerpts, ratings, authors, dates and provider attribution. Four negative boundary cases prove that dropping copy, a link, a phone destination or media fails the gate.

Layout-only numbering, decorative animation controls and repeated decorative text are not contractor facts. Existing poster-for-film behavior is retained. No-source reviews remain omitted, and the independent filter/fallback checks verify omission after filtering, full-source aggregates and the absent-setting identity rule.

## Evidence preservation

All 1,921 pre-existing files in the 028B evidence folder were inventoried and backed up before this work. This follow-up writes into this new folder. Original screenshots and reports remain byte-identical; only the parent README receives a follow-up link. Backups and downloaded executables are excluded from the commit. Existing unrelated work is left untouched.

## Final checks

| Check | Result | Evidence |
|---|---|---|
| Existing command suite | PASS: 102/102 | [Details](full-checks.json) |
| Render and layout-pattern assertions | PASS: 8,293; 408 base + 204 configured-offer cases | [Details](checks/section-variants.json) |
| Content parity | PASS: 408 cases / 2,448 section comparisons / 4 negative boundaries; 0 failures | [Details](checks/content-parity.json) |
| Review filter/API | PASS: 62; full-source 3.5 average / 4 reviews unchanged | [Details](checks/review-rating-filter.json) |
| Fallback and behavior | PASS: 608 assertions / 94 states; includes JS-off, reduced motion, pending media, review omission and local inquiry submissions | [Details](checks/variants-fallbacks.json) |
| Required browser matrix | PASS: 216/216 at 1440, 768 and 390 | [Details](checks/variants-browser.json) |
| Expanded process/hero matrix | PASS: 544/544: all 17 trades, 4 styles, b/c at 1440, 1280, 768 and 390 | [Details](checks/process-all-kits.json) |
| Cold-load font-swap regression | PASS: 30/30; all 20 b/c hero loads have zero CLS | [Details](checks/flooring-cls-repeat.json) |
| Text AA | PASS: 50,104 measurements; 0 failures in Current, Bold, Fresh and Classic | [Details](checks/quality-summary.json) |
| Focus / geometry | PASS: 20,644 focus checks / 1,528 geometry checks; 0 failures | [Details](checks/quality-summary.json) |
| Overflow, content loss, broken images, primary actions, page exceptions | PASS: 0 failures across 760 states | [Details](checks/quality-summary.json) |
| Layout shift | PASS: Maximum 0.023765 <= 0.05 | [Details](checks/quality-summary.json) |
| Hero/rail clearance | PASS: Minimum 44.75px >= 24px; rail unchanged | [Details](checks/quality-summary.json) |
| Accepted protections | PASS: 279/279 + platform.css = 280/280 identical | [Details](checks/accepted-protected-final.json) |
| Archived responses | PASS: 374/374 byte-identical | [Details](checks/sites-unchanged.log) |
| Prior evidence | PASS: 1,921 backups byte-verified; all original files unchanged except the intentional parent README link | [Details](checks/accepted-protected-final.json) |

### AA by style

| Style | Measurements | Failures |
|---|---:|---:|
| current | 12526 | 0 |
| bold | 12526 | 0 |
| fresh | 12526 | 0 |
| classic | 12526 | 0 |

### Test execution

The source and behavior assertions were not weakened. Existing 028B test scripts accept `BV_028B_EVIDENCE` so this rerun preserves the original evidence. The new browser geometry checks require visible process art, no empty trailing band and at least 24px between the headline box and the unchanged rail. All-trade runs also retain the existing contrast, focus, primary-action, image, overflow and CLS gates.

The legacy runner redirects its evidence to this follow-up folder. Independent regressions run while the all-trade browser matrix runs; rebuilds and the existing temporary Pending-media fixtures wait until that matrix finishes. The original film catalog and the legacy test's executable-path substitution are restored in `finally` blocks. No assertions are removed. Downloaded executables are reused locally and excluded from the commit.

Viewport contexts run independently in pairs with `BV_028B_PARALLEL=2`; fixtures and assertions are unchanged. New and rerun variant commands use `BV_028B_EVIDENCE=C:\Users\joe\website_creator\docs\build-evidence\028B\followup` and the repository working directory:

- `node C:/Users/joe/website_creator/tests/section-content-parity.mjs` — PASS.
- `node C:/Users/joe/website_creator/tests/section-variants.mjs` — PASS.
- `node C:/Users/joe/website_creator/tests/review-rating-filter.mjs` — PASS.
- `node C:/Users/joe/website_creator/tests/section-variants-browser.mjs` — PASS.
- `node C:/Users/joe/website_creator/tests/section-variants-browser.mjs --all-process` — PASS.
- `node C:/Users/joe/website_creator/tests/section-variants-fallbacks.mjs` — PASS.
- `node C:/Users/joe/website_creator/docs/build-evidence/028B/followup/tools/suite.mjs` — PASS.
- `node C:/Users/joe/website_creator/docs/build-evidence/028B/followup/tools/sites-unchanged.mjs after` — PASS.
- `node C:/Users/joe/website_creator/docs/build-evidence/028B/followup/tools/preservation.mjs` — PASS.

### All 102 commands

| # | Command | Result | Log |
|---:|---|---|---|
| 1 | `node C:/Users/joe/website_creator/node_modules/typescript/bin/tsc -p C:/Users/joe/website_creator/tsconfig.auth.json` | PASS | [typecheck](checks/typecheck.log) |
| 2 | `node C:/Users/joe/website_creator/tests/auth-session.mjs` | PASS | [auth-session](checks/auth-session.log) |
| 3 | `node C:/Users/joe/website_creator/tests/aws-adapter.mjs` | PASS | [aws-adapter](checks/aws-adapter.log) |
| 4 | `node C:/Users/joe/website_creator/tests/builder.mjs` | PASS | [builder](checks/builder.log) |
| 5 | `node C:/Users/joe/website_creator/tests/callback-restore.mjs` | PASS | [callback-restore](checks/callback-restore.log) |
| 6 | `node C:/Users/joe/website_creator/tests/cinematic-films.mjs` | PASS | [cinematic-films](checks/cinematic-films.log) |
| 7 | `node C:/Users/joe/website_creator/tests/client-modules.mjs` | PASS | [client-modules](checks/client-modules.log) |
| 8 | `node C:/Users/joe/website_creator/tests/constitution.mjs` | PASS | [constitution](checks/constitution.log) |
| 9 | `node C:/Users/joe/website_creator/tests/contact-linkage.mjs` | PASS | [contact-linkage](checks/contact-linkage.log) |
| 10 | `node C:/Users/joe/website_creator/tests/contacts-restore.mjs` | PASS | [contacts-restore](checks/contacts-restore.log) |
| 11 | `node C:/Users/joe/website_creator/tests/control.mjs` | PASS | [control](checks/control.log) |
| 12 | `node C:/Users/joe/website_creator/tests/conversion-references.mjs` | PASS | [conversion-references](checks/conversion-references.log) |
| 13 | `node C:/Users/joe/website_creator/tests/core-site-pages.mjs` | PASS | [core-site-pages](checks/core-site-pages.log) |
| 14 | `node C:/Users/joe/website_creator/tests/crm-next.mjs` | PASS | [crm-next](checks/crm-next.log) |
| 15 | `node C:/Users/joe/website_creator/tests/crm.mjs` | PASS | [crm](checks/crm.log) |
| 16 | `node C:/Users/joe/website_creator/tests/design-kits.mjs` | PASS | [design-kits](checks/design-kits.log) |
| 17 | `node C:/Users/joe/website_creator/tests/ebook.mjs` | PASS | [ebook](checks/ebook.log) |
| 18 | `node C:/Users/joe/website_creator/tests/engagement-providers.mjs` | PASS | [engagement-providers](checks/engagement-providers.log) |
| 19 | `node C:/Users/joe/website_creator/tests/engagement.mjs` | PASS | [engagement](checks/engagement.log) |
| 20 | `node C:/Users/joe/website_creator/tests/expense-metering.mjs` | PASS | [expense-metering](checks/expense-metering.log) |
| 21 | `node C:/Users/joe/website_creator/tests/expense-polish.mjs` | PASS | [expense-polish](checks/expense-polish.log) |
| 22 | `node C:/Users/joe/website_creator/tests/expenses.mjs` | PASS | [expenses](checks/expenses.log) |
| 23 | `node C:/Users/joe/website_creator/tests/financing-comparison.mjs` | PASS | [financing-comparison](checks/financing-comparison.log) |
| 24 | `node C:/Users/joe/website_creator/tests/financing-states.mjs` | PASS | [financing-states](checks/financing-states.log) |
| 25 | `node C:/Users/joe/website_creator/tests/footer-policy.mjs` | PASS | [footer-policy](checks/footer-policy.log) |
| 26 | `node C:/Users/joe/website_creator/tests/generation.mjs` | PASS | [generation](checks/generation.log) |
| 27 | `node C:/Users/joe/website_creator/tests/hero-editor.mjs` | PASS | [hero-editor](checks/hero-editor.log) |
| 28 | `node C:/Users/joe/website_creator/tests/legacy-scroll-video.mjs` | PASS | [legacy-scroll-video](checks/legacy-scroll-video.log) |
| 29 | `node C:/Users/joe/website_creator/tests/legal-policy.mjs` | PASS | [legal-policy](checks/legal-policy.log) |
| 30 | `node C:/Users/joe/website_creator/tests/media-ranges.mjs` | PASS | [media-ranges](checks/media-ranges.log) |
| 31 | `node C:/Users/joe/website_creator/tests/motion-v2.mjs` | PASS | [motion-v2](checks/motion-v2.log) |
| 32 | `node C:/Users/joe/website_creator/tests/neighborhood.mjs` | PASS | [neighborhood](checks/neighborhood.log) |
| 33 | `node C:/Users/joe/website_creator/tests/owner-photo.mjs` | PASS | [owner-photo](checks/owner-photo.log) |
| 34 | `node C:/Users/joe/website_creator/tests/planning-ambient.mjs` | PASS | [planning-ambient](checks/planning-ambient.log) |
| 35 | `node C:/Users/joe/website_creator/tests/planning-motion.mjs` | PASS | [planning-motion](checks/planning-motion.log) |
| 36 | `node C:/Users/joe/website_creator/tests/planning-scroll.mjs` | PASS | [planning-scroll](checks/planning-scroll.log) |
| 37 | `node C:/Users/joe/website_creator/tests/platform.mjs` | PASS | [platform](checks/platform.log) |
| 38 | `node C:/Users/joe/website_creator/tests/premium-service.mjs` | PASS | [premium-service](checks/premium-service.log) |
| 39 | `node C:/Users/joe/website_creator/tests/presentation.mjs` | PASS | [presentation](checks/presentation.log) |
| 40 | `node C:/Users/joe/website_creator/tests/project-experience.mjs` | PASS | [project-experience](checks/project-experience.log) |
| 41 | `node C:/Users/joe/website_creator/tests/promotion-unlocks.mjs` | PASS | [promotion-unlocks](checks/promotion-unlocks.log) |
| 42 | `node C:/Users/joe/website_creator/tests/reference-proof.mjs` | PASS | [reference-proof](checks/reference-proof.log) |
| 43 | `node C:/Users/joe/website_creator/tests/review-lookup.mjs` | PASS | [review-lookup](checks/review-lookup.log) |
| 44 | `node C:/Users/joe/website_creator/tests/roofing-cities.mjs` | PASS | [roofing-cities](checks/roofing-cities.log) |
| 45 | `node C:/Users/joe/website_creator/tests/roofing-cta.mjs` | PASS | [roofing-cta](checks/roofing-cta.log) |
| 46 | `node C:/Users/joe/website_creator/tests/roofing-story.mjs` | PASS | [roofing-story](checks/roofing-story.log) |
| 47 | `node C:/Users/joe/website_creator/tests/sales-ops.mjs` | PASS | [sales-ops](checks/sales-ops.log) |
| 48 | `node C:/Users/joe/website_creator/tests/saved-designs.mjs` | PASS | [saved-designs](checks/saved-designs.log) |
| 49 | `node C:/Users/joe/website_creator/tests/scroll-media.mjs` | PASS | [scroll-media](checks/scroll-media.log) |
| 50 | `node C:/Users/joe/website_creator/tests/scroll-story.mjs` | PASS | [scroll-story](checks/scroll-story.log) |
| 51 | `node C:/Users/joe/website_creator/tests/scroll-video-controller.mjs` | PASS | [scroll-video-controller](checks/scroll-video-controller.log) |
| 52 | `node C:/Users/joe/website_creator/tests/service-content.mjs` | PASS | [service-content](checks/service-content.log) |
| 53 | `node C:/Users/joe/website_creator/tests/service-motion.mjs` | PASS | [service-motion](checks/service-motion.log) |
| 54 | `node C:/Users/joe/website_creator/tests/service-pages-all-trades.mjs` | PASS | [service-pages-all-trades](checks/service-pages-all-trades.log) |
| 55 | `node C:/Users/joe/website_creator/tests/service-playbook.mjs` | PASS | [service-playbook](checks/service-playbook.log) |
| 56 | `node C:/Users/joe/website_creator/tests/showpiece-media.mjs` | PASS | [showpiece-media](checks/showpiece-media.log) |
| 57 | `node C:/Users/joe/website_creator/tests/showpiece-v4.mjs` | PASS | [showpiece-v4](checks/showpiece-v4.log) |
| 58 | `node C:/Users/joe/website_creator/tests/template-name.mjs` | PASS | [template-name](checks/template-name.log) |
| 59 | `node C:/Users/joe/website_creator/tests/trade-enablement.mjs` | PASS | [trade-enablement](checks/trade-enablement.log) |
| 60 | `node C:/Users/joe/website_creator/tests/trade-revisions.mjs` | PASS | [trade-revisions](checks/trade-revisions.log) |
| 61 | `node C:/Users/joe/website_creator/tests/trade-upgrade.mjs` | PASS | [trade-upgrade](checks/trade-upgrade.log) |
| 62 | `node C:/Users/joe/website_creator/tests/trade-visual-correctness.mjs` | PASS | [trade-visual-correctness](checks/trade-visual-correctness.log) |
| 63 | `node C:/Users/joe/website_creator/tests/trades-financing.mjs` | PASS | [trades-financing](checks/trades-financing.log) |
| 64 | `node C:/Users/joe/website_creator/tests/trust.mjs` | PASS | [trust](checks/trust.log) |
| 65 | `node C:/Users/joe/website_creator/tests/website-pages.mjs` | PASS | [website-pages](checks/website-pages.log) |
| 66 | `node C:/Users/joe/website_creator/tests/workspace-owner.mjs` | PASS | [workspace-owner](checks/workspace-owner.log) |
| 67 | `node C:/Users/joe/website_creator/tests/workspace.mjs` | PASS | [workspace](checks/workspace.log) |
| 68 | `node C:/Users/joe/website_creator/tests/zoom.mjs` | PASS | [zoom](checks/zoom.log) |
| 69 | `node C:/Users/joe/website_creator/scripts/check-template-assets.mjs` | PASS | [template-assets](checks/template-assets.log) |
| 70 | `node C:/Users/joe/website_creator/tests/platform-mobile.mjs` | PASS | [platform-mobile](checks/platform-mobile.log) |
| 71 | `node C:/Users/joe/website_creator/docs/build-evidence/clips-phase2/callback-calendar-clock.mjs` | PASS | [callback-browser](checks/callback-browser.log) |
| 72 | `node C:/Users/joe/website_creator/tests/contact-linkage-browser.mjs` | PASS | [contact-linkage-browser](checks/contact-linkage-browser.log) |
| 73 | `node C:/Users/joe/website_creator/tests/contacts-browser.mjs` | PASS | [contacts-browser](checks/contacts-browser.log) |
| 74 | `node C:/Users/joe/website_creator/tests/ebook-browser.mjs` | PASS | [ebook-browser](checks/ebook-browser.log) |
| 75 | `node C:/Users/joe/website_creator/tests/expense-polish-browser.mjs` | PASS | [expense-polish-browser](checks/expense-polish-browser.log) |
| 76 | `node C:/Users/joe/website_creator/tests/expenses-browser.mjs` | PASS | [expenses-browser](checks/expenses-browser.log) |
| 77 | `node C:/Users/joe/website_creator/tests/financing-states-browser.mjs` | PASS | [financing-states-browser](checks/financing-states-browser.log) |
| 78 | `node C:/Users/joe/website_creator/tests/generation-browser.mjs` | PASS | [generation-browser](checks/generation-browser.log) |
| 79 | `node C:/Users/joe/website_creator/tests/hero-editor-browser.mjs` | PASS | [hero-editor-browser](checks/hero-editor-browser.log) |
| 80 | `node C:/Users/joe/website_creator/tests/planning-ambient-browser.mjs` | PASS | [planning-ambient-browser](checks/planning-ambient-browser.log) |
| 81 | `node C:/Users/joe/website_creator/tests/planning-scroll-browser.mjs` | PASS | [planning-scroll-browser](checks/planning-scroll-browser.log) |
| 82 | `node C:/Users/joe/website_creator/tests/platform-ui-cleanup-browser.mjs` | PASS | [platform-ui-cleanup-browser](checks/platform-ui-cleanup-browser.log) |
| 83 | `node C:/Users/joe/website_creator/tests/promotion-unlocks-browser.mjs` | PASS | [promotion-unlocks-browser](checks/promotion-unlocks-browser.log) |
| 84 | `node C:/Users/joe/website_creator/tests/roofing-cities-browser.mjs` | PASS | [roofing-cities-browser](checks/roofing-cities-browser.log) |
| 85 | `node C:/Users/joe/website_creator/tests/roofing-cta-browser.mjs` | PASS | [roofing-cta-browser](checks/roofing-cta-browser.log) |
| 86 | `node C:/Users/joe/website_creator/tests/roofing-story-browser.mjs` | PASS | [roofing-story-browser](checks/roofing-story-browser.log) |
| 87 | `node C:/Users/joe/website_creator/tests/service-motion-browser.mjs` | PASS | [service-motion-browser](checks/service-motion-browser.log) |
| 88 | `node C:/Users/joe/website_creator/tests/trade-enablement-browser.mjs` | PASS | [trade-enablement-browser](checks/trade-enablement-browser.log) |
| 89 | `node C:/Users/joe/website_creator/tests/trade-visual-browser.mjs` | PASS | [trade-visual-browser](checks/trade-visual-browser.log) |
| 90 | `node C:/Users/joe/website_creator/tests/clips-phase2.mjs` | PASS | [clips-phase2](checks/clips-phase2.log) |
| 91 | `node C:/Users/joe/website_creator/tests/clips-phase2-browser.mjs` | PASS | [clips-phase2-browser](checks/clips-phase2-browser.log) |
| 92 | `node C:/Users/joe/website_creator/tests/roofing-polish-part1.mjs` | PASS | [roofing-polish-part1](checks/roofing-polish-part1.log) |
| 93 | `node C:/Users/joe/website_creator/tests/roofing-polish-part1-browser.mjs` | PASS | [roofing-polish-part1-browser](checks/roofing-polish-part1-browser.log) |
| 94 | `node C:/Users/joe/website_creator/tests/roofing-polish-part2.mjs` | PASS | [roofing-polish-part2](checks/roofing-polish-part2.log) |
| 95 | `node C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs` | PASS | [roofing-polish-part2-browser](checks/roofing-polish-part2-browser.log) |
| 96 | `node C:/Users/joe/website_creator/tests/roofing-acceptance.mjs` | PASS | [roofing-acceptance](checks/roofing-acceptance.log) |
| 97 | `node C:/Users/joe/website_creator/tests/design-styles.mjs` | PASS | [design-styles](checks/design-styles.log) |
| 98 | `node C:/Users/joe/website_creator/build.mjs` | PASS | [build](checks/build.log) |
| 99 | `node C:/Users/joe/website_creator/tests/promotions-ambient.mjs` | PASS | [promotions-ambient](checks/promotions-ambient.log) |
| 100 | `node C:/Users/joe/website_creator/tests/promotions-scroll.mjs` | PASS | [promotions-scroll](checks/promotions-scroll.log) |
| 101 | `node C:/Users/joe/website_creator/tests/promotions-ambient-browser.mjs` | PASS | [promotions-ambient-browser](checks/promotions-ambient-browser.log) |
| 102 | `node C:/Users/joe/website_creator/tests/promotions-scroll-browser.mjs` | PASS | [promotions-scroll-browser](checks/promotions-scroll-browser.log) |

## Retaken screenshots

**138 captures:** 108 section captures (six sections, a/b/c, Roofing/Patios/HVAC, 1440/390); 24 extra hero/process b/c captures at 1280/768; six mixed full homepages. All six contact sheets are rebuilt. The original captures remain in the parent folder for before comparison.

| Section | Updated contact sheet |
|---|---|
| hero | [Sheet](contact-sheets/hero.jpg) |
| services | [Sheet](contact-sheets/services.jpg) |
| process | [Sheet](contact-sheets/process.jpg) |
| financing | [Sheet](contact-sheets/financing.jpg) |
| reviews | [Sheet](contact-sheets/reviews.jpg) |
| finalCta | [Sheet](contact-sheets/finalCta.jpg) |

| Trade / section / variant | Before 1440 / 390 | After 1440 / 1280 / 768 / 390 |
|---|---|---|
| hvac / process / b | [1440](../after/hvac-process-b-1440.png) / [390](../after/hvac-process-b-390.png) | [1440](after/hvac-process-b-1440.png) / [1280](after/hvac-process-b-1280.png) / [768](after/hvac-process-b-768.png) / [390](after/hvac-process-b-390.png) |
| hvac / process / c | [1440](../after/hvac-process-c-1440.png) / [390](../after/hvac-process-c-390.png) | [1440](after/hvac-process-c-1440.png) / [1280](after/hvac-process-c-1280.png) / [768](after/hvac-process-c-768.png) / [390](after/hvac-process-c-390.png) |
| hvac / hero / b | [1440](../after/hvac-hero-b-1440.png) / [390](../after/hvac-hero-b-390.png) | [1440](after/hvac-hero-b-1440.png) / [1280](after/hvac-hero-b-1280.png) / [768](after/hvac-hero-b-768.png) / [390](after/hvac-hero-b-390.png) |
| hvac / hero / c | [1440](../after/hvac-hero-c-1440.png) / [390](../after/hvac-hero-c-390.png) | [1440](after/hvac-hero-c-1440.png) / [1280](after/hvac-hero-c-1280.png) / [768](after/hvac-hero-c-768.png) / [390](after/hvac-hero-c-390.png) |
| patios / process / b | [1440](../after/patios-process-b-1440.png) / [390](../after/patios-process-b-390.png) | [1440](after/patios-process-b-1440.png) / [1280](after/patios-process-b-1280.png) / [768](after/patios-process-b-768.png) / [390](after/patios-process-b-390.png) |
| patios / process / c | [1440](../after/patios-process-c-1440.png) / [390](../after/patios-process-c-390.png) | [1440](after/patios-process-c-1440.png) / [1280](after/patios-process-c-1280.png) / [768](after/patios-process-c-768.png) / [390](after/patios-process-c-390.png) |
| patios / hero / b | [1440](../after/patios-hero-b-1440.png) / [390](../after/patios-hero-b-390.png) | [1440](after/patios-hero-b-1440.png) / [1280](after/patios-hero-b-1280.png) / [768](after/patios-hero-b-768.png) / [390](after/patios-hero-b-390.png) |
| patios / hero / c | [1440](../after/patios-hero-c-1440.png) / [390](../after/patios-hero-c-390.png) | [1440](after/patios-hero-c-1440.png) / [1280](after/patios-hero-c-1280.png) / [768](after/patios-hero-c-768.png) / [390](after/patios-hero-c-390.png) |
| roofing / process / b | [1440](../after/roofing-process-b-1440.png) / [390](../after/roofing-process-b-390.png) | [1440](after/roofing-process-b-1440.png) / [1280](after/roofing-process-b-1280.png) / [768](after/roofing-process-b-768.png) / [390](after/roofing-process-b-390.png) |
| roofing / process / c | [1440](../after/roofing-process-c-1440.png) / [390](../after/roofing-process-c-390.png) | [1440](after/roofing-process-c-1440.png) / [1280](after/roofing-process-c-1280.png) / [768](after/roofing-process-c-768.png) / [390](after/roofing-process-c-390.png) |
| roofing / hero / b | [1440](../after/roofing-hero-b-1440.png) / [390](../after/roofing-hero-b-390.png) | [1440](after/roofing-hero-b-1440.png) / [1280](after/roofing-hero-b-1280.png) / [768](after/roofing-hero-b-768.png) / [390](after/roofing-hero-b-390.png) |
| roofing / hero / c | [1440](../after/roofing-hero-c-1440.png) / [390](../after/roofing-hero-c-390.png) | [1440](after/roofing-hero-c-1440.png) / [1280](after/roofing-hero-c-1280.png) / [768](after/roofing-hero-c-768.png) / [390](after/roofing-hero-c-390.png) |

The installed artwork, source process copy, review renderer, design-style tokens, financing calculator and form behavior are reused. No new media, offers, review facts, step descriptions, dependencies, routes or platform changes. The original a supporting-line capitalization remains deferred as requested. **Nothing remains blocked in this follow-up. #028C has not started. Credits used: 0.**
