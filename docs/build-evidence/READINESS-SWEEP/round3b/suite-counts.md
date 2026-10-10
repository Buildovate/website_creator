# Every suite — before and after Round 3b

Cases, audit groups and whole-suite outcomes are distinct units. Suite-102 is a subset, not an additional set of 102 executions. Exit warnings remain visible. The first owner-download failure and final 54-check rerun are both retained.

| Suite | Before | Round 1 | Round 2 | Round 3b | Evidence / failure |
|---|---|---|---|---|---|
| full-build | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/full-build.log)  |
| isolated-worker-build | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/final-build-gate-isolated-worker-build.log) earlier full-sweep invocation; final source verification |
| game-milestones | 16 pass / 0 fail (test cases) | 16 pass / 0 fail (test cases) | 16 pass / 0 fail (test cases) | 16 pass / 0 fail (test cases) | [log](logs/game-milestones.log)  |
| game-progress | 40 pass / 0 fail (test cases) | 40 pass / 0 fail (test cases) | 40 pass / 0 fail (test cases) | 40 pass / 0 fail (test cases) | [log](logs/game-progress.log)  |
| game-desktop-api | 16 pass / 0 fail (reported checks) | 16 pass / 0 fail (reported checks) | 16 pass / 0 fail (reported checks) | 16 pass / 0 fail (reported checks) | [log](logs/game-desktop-api.log)  |
| game-forms | 4 pass / 0 fail (reported checks) | 4 pass / 0 fail (reported checks) | 4 pass / 0 fail (reported checks) | 4 pass / 0 fail (reported checks) | [log](logs/game-forms.log)  |
| game-copy | 7 pass / 0 fail (reported checks) | 7 pass / 0 fail (reported checks) | 7 pass / 0 fail (reported checks) | 7 pass / 0 fail (reported checks) | [log](logs/game-copy.log)  |
| game-experience-api | 18 pass / 0 fail (reported checks) | 18 pass / 0 fail (reported checks) | 18 pass / 0 fail (reported checks) | 18 pass / 0 fail (reported checks) | [log](logs/game-experience-api.log)  |
| catalog | 11 pass / 0 fail (test cases) | 11 pass / 0 fail (test cases) | 11 pass / 0 fail (test cases) | 11 pass / 0 fail (test cases) | [log](logs/catalog.log)  |
| leaflet-assets | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/leaflet-assets.log)  |
| payments | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | [log](logs/payments.log)  |
| game-autofill | 21 pass / 0 fail (reported checks) | 21 pass / 0 fail (reported checks) | 21 pass / 0 fail (reported checks) | 21 pass / 0 fail (reported checks) | [log](logs/game-autofill.log)  |
| stripe-sync | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/stripe-sync.log)  |
| stripe-checkout | 9 pass / 0 fail (test cases) | 9 pass / 0 fail (test cases) | 9 pass / 0 fail (test cases) | 9 pass / 0 fail (test cases) | [log](logs/stripe-checkout.log)  |
| stripe-no-key | 2 pass / 0 fail (test cases) | 2 pass / 0 fail (test cases) | 2 pass / 0 fail (test cases) | 2 pass / 0 fail (test cases) | [log](logs/stripe-no-key.log)  |
| entitlements | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/entitlements.log)  |
| pay4a | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/pay4a.log)  |
| pay4b | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | [log](logs/pay4b.log)  |
| pay5 | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | [log](logs/pay5.log)  |
| domain-wizard | 77 pass / 0 fail (reported checks) | 77 pass / 0 fail (reported checks) | 77 pass / 0 fail (reported checks) | 77 pass / 0 fail (reported checks) | [log](logs/domain-wizard.log)  |
| owner-photo | 4 pass / 0 fail (test cases) | 4 pass / 0 fail (test cases) | 4 pass / 0 fail (test cases) | 4 pass / 0 fail (test cases) | [log](logs/owner-photo.log)  |
| owner-download | suite FAIL | suite FAIL | suite FAIL | 54 pass / 0 fail (reported checks) | [log](logs/owner-download-final.log) first sweep invocation; approved final source/fixture rerun |
| game-desktop | 21 pass / 0 fail (reported checks) | 21 pass / 0 fail (reported checks) | 21 pass / 0 fail (reported checks) | 21 pass / 0 fail (reported checks) | [log](logs/game-desktop.log)  |
| game-phone | 17 pass / 0 fail (reported checks) | 17 pass / 0 fail (reported checks) | 17 pass / 0 fail (reported checks) | 17 pass / 0 fail (reported checks) | [log](logs/game-phone.log)  |
| game-phone-midway | 2 pass / 0 fail (reported states) | suite PASS | suite PASS | suite PASS | [log](logs/game-phone-midway.log)  |
| game-experience-browser | 12 pass / 0 fail (reported checks) | 12 pass / 0 fail (reported checks) | 12 pass / 0 fail (reported checks) | 12 pass / 0 fail (reported checks) | [log](logs/game-experience-browser.log)  |
| game-autofill-browser | 12 pass / 0 fail (reported checks) | 12 pass / 0 fail (reported checks) | 12 pass / 0 fail (reported checks) | 12 pass / 0 fail (reported checks) | [log](logs/game-autofill-browser.log)  |
| game-copy-browser | 9 pass / 0 fail (reported checks) | 9 pass / 0 fail (reported checks) | 9 pass / 0 fail (reported checks) | 9 pass / 0 fail (reported checks) | [log](logs/game-copy-browser.log)  |
| game-forms-browser | 8 pass / 0 fail (reported checks) | 8 pass / 0 fail (reported checks) | 8 pass / 0 fail (reported checks) | 8 pass / 0 fail (reported checks) | [log](logs/game-forms-browser.log)  |
| pay4a-browser | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/pay4a-browser.log)  |
| pay4b-browser | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/pay4b-browser.log)  |
| pay5-browser | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/pay5-browser.log)  |
| domain-wizard-browser | suite FAIL | 23 pass / 0 fail (reported checks) | 23 pass / 0 fail (reported checks) | 23 pass / 0 fail (reported checks) | [log](logs/domain-wizard-browser.log)  |
| review-packet-browser | suite PASS | suite FAIL | suite FAIL | suite FAIL | [log](logs/review-packet-browser.log) tests/review-packet-browser.mjs:22 |
| automatic-qa-blog-phone-links | 5 pass / 0 fail (reported cases) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-blog-phone-links.log)  |
| automatic-qa-brand-recognition | 420 pass / 0 fail (reported cases) | suite PASS — exit warning | suite PASS — exit warning | suite PASS — exit warning | [log](logs/automatic-qa-brand-recognition.log)  |
| review-packet-contract | suite FAIL | suite FAIL | 48 pass / 0 fail (reported checks) | suite FAIL | [log](logs/review-packet-contract.log) tests/review-packet-contract.mjs:47 |
| automatic-qa-capture-diagnostics | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-capture-diagnostics.log)  |
| automatic-qa-capture-readiness | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-capture-readiness.log)  |
| automatic-qa-camarillo-consent | 84 pass / 0 fail (reported boundaries) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-camarillo-consent.log)  |
| automatic-qa-contract | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-contract.log)  |
| automatic-qa-craft-recognition | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-craft-recognition.log)  |
| automatic-qa-frame-initialization | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-frame-initialization.log)  |
| automatic-qa-finance-cards | 8 pass / 0 fail (reported states) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-finance-cards.log)  |
| automatic-qa-frame-source-lock | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-frame-source-lock.log)  |
| automatic-qa-frame-sample-replay | suite FAIL | suite FAIL | suite FAIL | suite FAIL | [log](logs/automatic-qa-frame-sample-replay.log) tests/automatic-qa-frame-sample-replay.mjs:19; tests/automatic-qa-frame-sample-replay.mjs:32 |
| automatic-qa-guide-browser | 56 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-guide-browser.log)  |
| automatic-qa-legal-policy-recognition | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-legal-policy-recognition.log)  |
| automatic-qa-negative-browser | 37 pass / 0 fail (reported measurements) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-negative-browser.log)  |
| automatic-qa-normalizer | 11 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-normalizer.log)  |
| automatic-qa-legacy-recognition | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-legacy-recognition.log)  |
| automatic-qa-page-action-colors | 48 pass / 0 fail (reported states) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-page-action-colors.log)  |
| automatic-qa-project-media | 15 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-project-media.log)  |
| automatic-qa-project-recognition | 48 pass / 0 fail (reported cases) | 48 pass / 0 fail (reported checks) | 48 pass / 0 fail (reported checks) | 48 pass / 0 fail (reported checks) | [log](logs/automatic-qa-project-recognition.log)  |
| automatic-qa-rail-colors | suite FAIL | suite FAIL | suite FAIL | suite FAIL | [log](logs/automatic-qa-rail-colors.log) tests/automatic-qa-rail-colors.mjs:5 |
| automatic-qa-recognition-lock | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-recognition-lock.log)  |
| automatic-qa-replay-diagnostics | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-replay-diagnostics.log)  |
| automatic-qa-polish-browser | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-polish-browser.log)  |
| review-packets | suite PASS | suite FAIL | suite PASS | suite PASS | [log](logs/review-packets.log)  |
| automatic-qa-staff-browser | suite FAIL | suite FAIL | suite FAIL | 15 pass / 0 fail (reported states) | [log](logs/automatic-qa-staff-browser.log)  |
| automatic-qa-replay | suite FAIL | suite FAIL | suite FAIL | suite FAIL | [log](logs/automatic-qa-replay.log) tests/helpers/replay-alternate-assertions.mjs:104; tests/automatic-qa-replay.mjs:8 |
| automatic-qa-status-recognition | 104 pass / 0 fail (reported boundaries) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-status-recognition.log)  |
| automatic-qa-thousand-oaks-consent | 84 pass / 0 fail (reported boundaries) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-thousand-oaks-consent.log)  |
| automatic-qa-unused-preload | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-unused-preload.log)  |
| automatic-qa-workspace-phone-links | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-workspace-phone-links.log)  |
| automatic-qa-workspace-form-recognition | 64 pass / 0 fail (reported boundaries) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-workspace-form-recognition.log)  |
| coordinator-hang-guard | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/coordinator-hang-guard.log)  |
| automatic-qa-workspace-recognition | 60 pass / 0 fail (reported boundaries) | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-workspace-recognition.log)  |
| header-logo | 6 pass / 0 fail (reported cases) | 6 pass / 0 fail (reported checks) | 6 pass / 0 fail (reported checks) | 6 pass / 0 fail (reported checks) | [log](logs/header-logo.log)  |
| header-nav-fit | 16422 pass / 0 fail (reported checks) | 16422 pass / 0 fail (reported checks) | 16422 pass / 0 fail (reported checks) | 16422 pass / 0 fail (reported checks) | [log](logs/header-nav-fit.log)  |
| media-api | 481 pass / 0 fail (reported checks) | suite PASS — exit warning | suite PASS — exit warning | suite PASS — exit warning | [log](logs/media-api.log)  |
| media-inventory | 6868 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/media-inventory.log)  |
| automatic-qa-packets | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/automatic-qa-packets.log)  |
| media-library | 3287 pass / 0 fail (reported checks) | 3287 pass / 0 fail (reported checks) | 3287 pass / 0 fail (reported checks) | 3287 pass / 0 fail (reported checks) | [log](logs/media-library.log)  |
| platform-console | 41 pass / 0 fail (reported cases) | suite PASS | suite PASS | suite PASS | [log](logs/platform-console.log)  |
| platform-look | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/platform-look.log)  |
| replay-alternate-registry | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/replay-alternate-registry.log)  |
| review-polish | 1 pass / 0 fail (reported assertions) | 1 pass / 0 fail (reported checks) | 1 pass / 0 fail (reported checks) | 1 pass / 0 fail (reported checks) | [log](logs/review-polish.log)  |
| review-rating-filter | suite FAIL | 62 pass / 0 fail (reported checks) | suite PASS | suite PASS | [log](logs/review-rating-filter.log)  |
| section-content-parity | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/section-content-parity.log)  |
| section-variants-browser | 216 pass / 0 fail (reported states) | suite PASS | 216 pass / 0 fail (reported states) | 216 pass / 0 fail (reported states) | [log](logs/section-variants-browser.log)  |
| section-variants-fallbacks | 608 pass / 0 fail (reported checks) | 608 pass / 0 fail (reported checks) | suite PASS | suite PASS | [log](logs/section-variants-fallbacks.log)  |
| section-variants | 8293 pass / 0 fail (reported checks) | 8293 pass / 0 fail (reported checks) | suite PASS | suite PASS | [log](logs/section-variants.log)  |
| uniqueness-api | 418 pass / 0 fail (reported checks) | 418 pass / 0 fail (reported checks) — exit warning | 418 pass / 0 fail (reported checks) — exit warning | 418 pass / 0 fail (reported checks) — exit warning | [log](logs/uniqueness-api.log)  |
| media-library-browser | suite FAIL | suite PASS | 423 pass / 0 fail (reported states) | 423 pass / 0 fail (reported states) | [log](logs/media-library-browser.log)  |
| uniqueness-content-parity | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/uniqueness-content-parity.log)  |
| uniqueness | 3859 pass / 0 fail (reported checks) | 3859 pass / 0 fail (reported checks) | suite PASS | suite PASS | [log](logs/uniqueness.log)  |
| pay4a-isolated-build | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pay4a-isolated-build.log)  |
| roofing-cta | 32 pass / 0 fail (reported checks) | 32 pass / 0 fail (reported checks) | 32 pass / 0 fail (reported checks) | 32 pass / 0 fail (reported checks) | [log](logs/roofing-cta.log)  |
| uniqueness-browser | suite FAIL | suite PASS | 417 pass / 0 fail (reported states) | 417 pass / 0 fail (reported states) | [log](logs/uniqueness-browser.log)  |
| roofing-cities | 402 pass / 0 fail (reported checks) | 402 pass / 0 fail (reported checks) | 402 pass / 0 fail (reported checks) | 402 pass / 0 fail (reported checks) | [log](logs/roofing-cities.log)  |
| roofing-story | 30 pass / 0 fail (reported checks) | 30 pass / 0 fail (reported checks) | 30 pass / 0 fail (reported checks) | 30 pass / 0 fail (reported checks) | [log](logs/roofing-story.log)  |
| reference-proof | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/reference-proof.log)  |
| service-motion | 30 pass / 0 fail (reported checks) | 30 pass / 0 fail (reported checks) | 30 pass / 0 fail (reported checks) | 30 pass / 0 fail (reported checks) | [log](logs/service-motion.log)  |
| financing-comparison | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/financing-comparison.log)  |
| ebook | 62 pass / 0 fail (reported checks) | 22 pass / 0 fail (reported checks) | 22 pass / 0 fail (reported checks) | 22 pass / 0 fail (reported checks) | [log](logs/ebook.log)  |
| design-styles-browser | suite FAIL | 9407 pass / 131 fail (recorded audit checks) | 9407 pass / 131 fail (recorded audit checks) | 9407 pass / 131 fail (recorded audit checks) | [log](logs/design-styles-browser.log) tests/design-styles-browser.mjs:68 |
| service-pages-all-trades | suite FAIL | 3 pass / 0 fail (test cases) | 3 pass / 0 fail (test cases) | 3 pass / 0 fail (test cases) | [log](logs/service-pages-all-trades.log)  |
| typecheck | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/final-build-gate-typecheck.log) earlier full-sweep invocation; final source verification |
| auth-session | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/auth-session.log)  |
| aws-adapter | suite PASS | suite PASS | suite FAIL | suite PASS | [log](logs/aws-adapter.log)  |
| builder | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/builder.log)  |
| callback-restore | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/callback-restore.log)  |
| cinematic-films | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/cinematic-films.log)  |
| client-modules | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/client-modules.log)  |
| contact-linkage | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/contact-linkage.log)  |
| contacts-restore | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/contacts-restore.log)  |
| control | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/control.log)  |
| financing-states | 17 pass / 0 fail (reported states) | 74 pass / 0 fail (reported checks) | 74 pass / 0 fail (reported checks) | 74 pass / 0 fail (reported checks) | [log](logs/financing-states.log)  |
| core-site-pages | 1 pass / 0 fail (test cases) | 1 pass / 0 fail (test cases) | 1 pass / 0 fail (test cases) | 1 pass / 0 fail (test cases) | [log](logs/core-site-pages.log)  |
| crm-next | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/crm-next.log)  |
| footer-policy | suite FAIL | 2 pass / 0 fail (test cases) | 2 pass / 0 fail (test cases) | 2 pass / 0 fail (test cases) | [log](logs/footer-policy.log)  |
| design-kits | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/design-kits.log)  |
| engagement-providers | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/engagement-providers.log)  |
| engagement | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/engagement.log)  |
| expense-metering | 15 pass / 0 fail (reported checks) | 15 pass / 0 fail (reported checks) | 15 pass / 0 fail (reported checks) | 15 pass / 0 fail (reported checks) | [log](logs/expense-metering.log)  |
| expense-polish | 35 pass / 0 fail (reported checks) | 35 pass / 0 fail (reported checks) | 35 pass / 0 fail (reported checks) | 35 pass / 0 fail (reported checks) | [log](logs/expense-polish.log)  |
| expenses | 85 pass / 0 fail (reported checks) | 85 pass / 0 fail (reported checks) | 85 pass / 0 fail (reported checks) | 85 pass / 0 fail (reported checks) | [log](logs/expenses.log)  |
| crm | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/crm.log)  |
| legacy-scroll-video | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/legacy-scroll-video.log)  |
| hero-editor | suite FAIL | 50 pass / 0 fail (reported checks) | 50 pass / 0 fail (reported checks) | 50 pass / 0 fail (reported checks) | [log](logs/hero-editor.log)  |
| media-ranges | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/media-ranges.log)  |
| motion-v2 | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/motion-v2.log)  |
| legal-policy | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/legal-policy.log)  |
| constitution | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/constitution.log)  |
| planning-motion | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/planning-motion.log)  |
| conversion-references | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/conversion-references.log)  |
| planning-ambient | 346 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/planning-ambient.log)  |
| neighborhood | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/neighborhood.log)  |
| presentation | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/presentation.log)  |
| planning-scroll | 352 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/planning-scroll.log)  |
| project-experience | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/project-experience.log)  |
| review-lookup | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/review-lookup.log)  |
| sales-ops | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/sales-ops.log)  |
| saved-designs | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/saved-designs.log)  |
| scroll-media | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/scroll-media.log)  |
| promotion-unlocks | 64 pass / 0 fail (reported checks) | 64 pass / 0 fail (reported checks) | 64 pass / 0 fail (reported checks) | 64 pass / 0 fail (reported checks) | [log](logs/promotion-unlocks.log)  |
| scroll-video-controller | 8 pass / 0 fail (test cases) | 8 pass / 0 fail (test cases) | 8 pass / 0 fail (test cases) | 8 pass / 0 fail (test cases) | [log](logs/scroll-video-controller.log)  |
| service-content | 3 pass / 0 fail (test cases) | 3 pass / 0 fail (test cases) | 3 pass / 0 fail (test cases) | 3 pass / 0 fail (test cases) | [log](logs/service-content.log)  |
| scroll-story | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/scroll-story.log)  |
| showpiece-media | 3 pass / 0 fail (test cases) | 3 pass / 0 fail (test cases) | 3 pass / 0 fail (test cases) | 3 pass / 0 fail (test cases) | [log](logs/showpiece-media.log)  |
| showpiece-v4 | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/showpiece-v4.log)  |
| template-name | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/template-name.log)  |
| trade-enablement | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/trade-enablement.log)  |
| trade-revisions | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/trade-revisions.log)  |
| trade-upgrade | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/trade-upgrade.log)  |
| platform | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/platform.log)  |
| trade-visual-correctness | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/trade-visual-correctness.log)  |
| premium-service | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/premium-service.log)  |
| service-playbook | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/service-playbook.log)  |
| workspace-owner | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/workspace-owner.log)  |
| trades-financing | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/trades-financing.log)  |
| zoom | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/zoom.log)  |
| template-assets | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/template-assets.log)  |
| workspace | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/workspace.log)  |
| callback-browser | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/callback-browser.log)  |
| contact-linkage-browser | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/contact-linkage-browser.log)  |
| contacts-browser | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/contacts-browser.log)  |
| platform-mobile | suite FAIL | suite FAIL | suite PASS | suite PASS | [log](logs/platform-mobile.log)  |
| ebook-browser | suite FAIL | 85 pass / 0 fail (reported checks) | 85 pass / 0 fail (reported checks) | 85 pass / 0 fail (reported checks) | [log](logs/ebook-browser.log)  |
| expense-polish-browser | 108 pass / 0 fail (reported checks) | 108 pass / 0 fail (reported checks) | 108 pass / 0 fail (reported checks) | 108 pass / 0 fail (reported checks) | [log](logs/expense-polish-browser.log)  |
| trust | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/trust.log)  |
| expenses-browser | suite FAIL | 93 pass / 0 fail (reported checks) | 93 pass / 0 fail (reported checks) | 93 pass / 0 fail (reported checks) | [log](logs/expenses-browser.log)  |
| generation-browser | suite FAIL | 51 pass / 0 fail (reported checks) | 51 pass / 0 fail (reported checks) | 51 pass / 0 fail (reported checks) | [log](logs/generation-browser.log)  |
| financing-states-browser | suite FAIL | 77 pass / 0 fail (reported checks) | 77 pass / 0 fail (reported checks) | 77 pass / 0 fail (reported checks) | [log](logs/financing-states-browser.log)  |
| planning-ambient-browser | 97 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/planning-ambient-browser.log)  |
| platform-ui-cleanup-browser | suite FAIL | suite FAIL | 7 pass / 0 fail (reported checks) | 7 pass / 0 fail (reported checks) | [log](logs/platform-ui-cleanup-browser.log)  |
| planning-scroll-browser | 155 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/planning-scroll-browser.log)  |
| hero-editor-browser | suite FAIL | 47 pass / 0 fail (reported checks) | 47 pass / 0 fail (reported checks) | 47 pass / 0 fail (reported checks) | [log](logs/hero-editor-browser.log)  |
| roofing-cities-browser | 189 pass / 0 fail (reported checks) | 189 pass / 0 fail (reported checks) | 189 pass / 0 fail (reported checks) | 189 pass / 0 fail (reported checks) | [log](logs/roofing-cities-browser.log)  |
| roofing-cta-browser | suite FAIL | 88 pass / 0 fail (reported checks) | 88 pass / 0 fail (reported checks) | 88 pass / 0 fail (reported checks) | [log](logs/roofing-cta-browser.log)  |
| promotion-unlocks-browser | 94 pass / 0 fail (reported checks) | 94 pass / 0 fail (reported checks) | 94 pass / 0 fail (reported checks) | 94 pass / 0 fail (reported checks) | [log](logs/promotion-unlocks-browser.log)  |
| trade-enablement-browser | suite FAIL | 258 pass / 0 fail (reported checks) | 258 pass / 0 fail (reported checks) | 258 pass / 0 fail (reported checks) | [log](logs/trade-enablement-browser.log)  |
| roofing-story-browser | 58 pass / 0 fail (reported checks) | 58 pass / 0 fail (reported checks) | 58 pass / 0 fail (reported checks) | 58 pass / 0 fail (reported checks) | [log](logs/roofing-story-browser.log)  |
| trade-visual-browser | 173 pass / 0 fail (reported checks) | 173 pass / 0 fail (reported checks) | 173 pass / 0 fail (reported checks) | 173 pass / 0 fail (reported checks) | [log](logs/trade-visual-browser.log)  |
| clips-phase2 | 2 pass / 0 fail (reported checks) | 2 pass / 0 fail (reported checks) | 2 pass / 0 fail (reported checks) | 2 pass / 0 fail (reported checks) | [log](logs/clips-phase2.log)  |
| service-motion-browser | suite FAIL | 167 pass / 0 fail (reported checks) | 167 pass / 0 fail (reported checks) | 167 pass / 0 fail (reported checks) | [log](logs/service-motion-browser.log)  |
| website-pages | 30 pass / 0 fail (test cases) | 30 pass / 0 fail (test cases) | 29 pass / 1 fail (test cases) | 29 pass / 1 fail (test cases) | [log](logs/website-pages.log) tests/helpers/review-approval-fixture.mjs:27; tests/helpers/review-approval-fixture.mjs:52; tests/website-pages.mjs:91; tests/website-pages.mjs:473; tests/website-pages.mjs:439 |
| clips-phase2-browser | 2 pass / 0 fail (reported checks) | 2 pass / 0 fail (reported checks) | 2 pass / 0 fail (reported checks) | 2 pass / 0 fail (reported checks) | [log](logs/clips-phase2-browser.log)  |
| roofing-polish-part1 | 1 pass / 0 fail (reported checks) | 1 pass / 0 fail (reported checks) | 1 pass / 0 fail (reported checks) | 1 pass / 0 fail (reported checks) | [log](logs/roofing-polish-part1.log)  |
| roofing-polish-part2 | 2 pass / 0 fail (reported assertions) | 2 pass / 0 fail (reported checks) | 2 pass / 0 fail (reported checks) | 2 pass / 0 fail (reported checks) | [log](logs/roofing-polish-part2.log)  |
| roofing-polish-part1-browser | 1 pass / 0 fail (reported checks) | 1 pass / 0 fail (reported checks) | 1 pass / 0 fail (reported checks) | 1 pass / 0 fail (reported checks) | [log](logs/roofing-polish-part1-browser.log)  |
| design-styles | 411 pass / 0 fail (reported assertions) | 411 pass / 0 fail (reported checks) | 411 pass / 0 fail (reported checks) | 411 pass / 0 fail (reported checks) | [log](logs/design-styles.log)  |
| generation | suite FAIL | 185 pass / 0 fail (reported checks) | 185 pass / 0 fail (reported checks) | 185 pass / 0 fail (reported checks) | [log](logs/generation.log)  |
| insertion-order | Not present | Not present | 16 pass / 0 fail (reported checks) | 16 pass / 0 fail (reported checks) | [log](logs/insertion-order.log)  |
| readiness-batch-a | Not present | Not present | Not present | 19 pass / 0 fail (test cases) | [log](logs/readiness-batch-a.log)  |
| roofing-acceptance | suite FAIL | 922 pass / 0 fail (reported checks) | 922 pass / 0 fail (reported checks) | 922 pass / 0 fail (reported checks) | [log](logs/roofing-acceptance.log)  |
| roofing-polish-part2-browser | suite FAIL | 237 pass / 0 fail (reported checks) | 237 pass / 0 fail (reported checks) | 237 pass / 0 fail (reported checks) | [log](logs/roofing-polish-part2-browser.log)  |
| promotions-ambient | 354 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/promotions-ambient.log)  |
| promotions-scroll | 362 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/promotions-scroll.log)  |
| promotions-ambient-browser | 139 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/promotions-ambient-browser.log)  |
| promotions-scroll-browser | 177 pass / 0 fail (reported checks) | suite PASS | suite PASS | suite PASS | [log](logs/promotions-scroll-browser.log)  |
| build | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/build.log)  |
| pg-stripe-no-key | 2 pass / 0 fail (test cases) | 2 pass / 0 fail (test cases) | 2 pass / 0 fail (test cases) | 2 pass / 0 fail (test cases) | [log](logs/pg-stripe-no-key.log)  |
| pg-stripe-checkout | 9 pass / 0 fail (test cases) | 9 pass / 0 fail (test cases) | 9 pass / 0 fail (test cases) | 9 pass / 0 fail (test cases) | [log](logs/pg-stripe-checkout.log)  |
| pg-domain-wizard | 77 pass / 0 fail (reported checks) | 77 pass / 0 fail (reported checks) | 77 pass / 0 fail (reported checks) | 77 pass / 0 fail (reported checks) | [log](logs/pg-domain-wizard.log)  |
| pg-corrected-payments | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | [log](logs/pg-corrected-payments.log)  |
| pg-corrected-pay4a | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/pg-corrected-pay4a.log)  |
| pg-corrected-pay4b | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | [log](logs/pg-corrected-pay4b.log)  |
| pg-corrected-pay5 | 1 pass / 4 fail (test cases) | 1 pass / 4 fail (test cases) | 5 pass / 0 fail (test cases) | 5 pass / 0 fail (test cases) | [log](logs/pg-corrected-pay5.log)  |
| pg-corrected-game-desktop-api | suite FAIL | suite FAIL | suite FAIL | 16 pass / 0 fail (reported checks) | [log](logs/pg-corrected-game-desktop-api.log)  |
| pg-corrected-game-progress | 36 pass / 4 fail (test cases) | 36 pass / 4 fail (test cases) | 36 pass / 4 fail (test cases) | 40 pass / 0 fail (test cases) | [log](logs/pg-corrected-game-progress.log)  |
| pg-corrected-game-experience-api | suite FAIL | suite FAIL | suite FAIL | 18 pass / 0 fail (reported checks) | [log](logs/pg-corrected-game-experience-api.log)  |
| pg-corrected-game-autofill | suite FAIL | suite FAIL | suite FAIL | 21 pass / 0 fail (reported checks) | [log](logs/pg-corrected-game-autofill.log)  |
| pg-corrected-entitlements | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/pg-corrected-entitlements.log)  |
| pg-workflow-engagement | suite FAIL | suite FAIL | suite PASS | suite PASS | [log](logs/pg-workflow-engagement.log)  |
| pg-workflow-engagement-providers | suite FAIL | suite FAIL | suite PASS | suite PASS | [log](logs/pg-workflow-engagement-providers.log)  |
| pg-workflow-expense-metering | 15 pass / 0 fail (reported checks) | 15 pass / 0 fail (reported checks) | 15 pass / 0 fail (reported checks) | 15 pass / 0 fail (reported checks) | [log](logs/pg-workflow-expense-metering.log)  |
| pg-workflow-expenses | 85 pass / 0 fail (reported checks) | 85 pass / 0 fail (reported checks) | 85 pass / 0 fail (reported checks) | 85 pass / 0 fail (reported checks) | [log](logs/pg-workflow-expenses.log)  |
| pg-workflow-expense-polish | 35 pass / 0 fail (reported checks) | 35 pass / 0 fail (reported checks) | 35 pass / 0 fail (reported checks) | 35 pass / 0 fail (reported checks) | [log](logs/pg-workflow-expense-polish.log)  |
| pg-workflow-crm-next | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-crm-next.log)  |
| pg-workflow-control | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-control.log)  |
| pg-workflow-sales-ops | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-sales-ops.log)  |
| pg-workflow-contacts-restore | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-contacts-restore.log)  |
| pg-workflow-contact-linkage | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-contact-linkage.log)  |
| pg-workflow-callback-restore | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-callback-restore.log)  |
| pg-workflow-review-lookup | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-review-lookup.log)  |
| pg-workflow-crm | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-crm.log)  |
| pg-workflow-workspace | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-workspace.log)  |
| pg-workflow-zoom | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-zoom.log)  |
| pg-workflow-neighborhood | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-workflow-neighborhood.log)  |
| pg-final-auth-session | suite FAIL | suite PASS | suite PASS | suite PASS | [log](logs/pg-final-auth-session.log)  |
| pg-final-saved-designs | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-final-saved-designs.log)  |
| pg-final-promotion-unlocks | 64 pass / 0 fail (reported checks) | 64 pass / 0 fail (reported checks) | 64 pass / 0 fail (reported checks) | 64 pass / 0 fail (reported checks) | [log](logs/pg-final-promotion-unlocks.log)  |
| pg-final-builder | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-final-builder.log)  |
| pg-final-hero-editor | 50 pass / 0 fail (reported checks) | 50 pass / 0 fail (reported checks) | 50 pass / 0 fail (reported checks) | 50 pass / 0 fail (reported checks) | [log](logs/pg-final-hero-editor.log)  |
| pg-workflow-trust | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | 6 pass / 0 fail (test cases) | [log](logs/pg-workflow-trust.log)  |
| pg-final-ebook | 62 pass / 0 fail (reported checks) | 22 pass / 0 fail (reported checks) | 22 pass / 0 fail (reported checks) | 22 pass / 0 fail (reported checks) | [log](logs/pg-final-ebook.log)  |
| pg-workflow-website-pages | 30 pass / 0 fail (test cases) | 30 pass / 0 fail (test cases) | 30 pass / 0 fail (test cases) | 30 pass / 0 fail (test cases) | [log](logs/pg-workflow-website-pages.log)  |
| pg-readiness-batch-a | Not present | Not present | Not present | 19 pass / 0 fail (test cases) | [log](logs/pg-readiness-batch-a.log)  |
| pg-final-platform | suite PASS | suite PASS | suite PASS | suite PASS | [log](logs/pg-final-platform.log)  |
| pg-final-generation | 185 pass / 0 fail (reported checks) | 185 pass / 0 fail (reported checks) | 185 pass / 0 fail (reported checks) | 185 pass / 0 fail (reported checks) | [log](logs/pg-final-generation.log)  |

Extra pending-catalog prerequisite: suite PASS [log](logs/pending-fixture-build.log). Temporary planning-films bytes were restored. Initial probe invocation failures (before assertions) are in probe-invocation-results.json; corrected commands retain every probe assertion.
