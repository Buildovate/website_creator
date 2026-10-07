# Final validation stopped at an unapproved scope gap

The original 102-command execution is retained as executed. The successful financing-comparison recheck is separate; its first failed execution is not recounted as a pass.

| Command | Result | Log |
|---|---|---|
| `node C:/Users/joe/website_creator/build.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/node_modules/typescript/bin/tsc -p C:/Users/joe/website_creator/tsconfig.auth.json` | PASS | [typecheck](typecheck.log) |
| `node C:/Users/joe/website_creator/tests/auth-session.mjs` | PASS | [auth-session](auth-session.log) |
| `node C:/Users/joe/website_creator/tests/aws-adapter.mjs` | PASS | [aws-adapter](aws-adapter.log) |
| `node C:/Users/joe/website_creator/tests/builder.mjs` | PASS | [builder](builder.log) |
| `node C:/Users/joe/website_creator/tests/callback-restore.mjs` | PASS | [callback-restore](callback-restore.log) |
| `node C:/Users/joe/website_creator/tests/cinematic-films.mjs` | PASS | [cinematic-films](cinematic-films.log) |
| `node C:/Users/joe/website_creator/tests/client-modules.mjs` | PASS | [client-modules](client-modules.log) |
| `node C:/Users/joe/website_creator/tests/constitution.mjs` | PASS | [constitution](constitution.log) |
| `node C:/Users/joe/website_creator/tests/contact-linkage.mjs` | PASS | [contact-linkage](contact-linkage.log) |
| `node C:/Users/joe/website_creator/tests/contacts-restore.mjs` | PASS | [contacts-restore](contacts-restore.log) |
| `node C:/Users/joe/website_creator/tests/control.mjs` | PASS | [control](control.log) |
| `node C:/Users/joe/website_creator/tests/conversion-references.mjs` | PASS | [conversion-references](conversion-references.log) |
| `node C:/Users/joe/website_creator/tests/core-site-pages.mjs` | PASS | [core-site-pages](core-site-pages.log) |
| `node C:/Users/joe/website_creator/tests/crm-next.mjs` | PASS | [crm-next](crm-next.log) |
| `node C:/Users/joe/website_creator/tests/crm.mjs` | PASS | [crm](crm.log) |
| `node C:/Users/joe/website_creator/tests/design-kits.mjs` | PASS | [design-kits](design-kits.log) |
| `node C:/Users/joe/website_creator/tests/ebook.mjs` | PASS | [ebook](ebook.log) |
| `node C:/Users/joe/website_creator/tests/engagement-providers.mjs` | PASS | [engagement-providers](engagement-providers.log) |
| `node C:/Users/joe/website_creator/tests/engagement.mjs` | PASS | [engagement](engagement.log) |
| `node C:/Users/joe/website_creator/tests/expense-metering.mjs` | PASS | [expense-metering](expense-metering.log) |
| `node C:/Users/joe/website_creator/tests/expense-polish.mjs` | PASS | [expense-polish](expense-polish.log) |
| `node C:/Users/joe/website_creator/tests/expenses.mjs` | PASS | [expenses](expenses.log) |
| `node C:/Users/joe/website_creator/tests/financing-comparison.mjs` | FAIL | [financing-comparison](financing-comparison.log) |
| `node C:/Users/joe/website_creator/tests/financing-states.mjs` | PASS | [financing-states](financing-states.log) |
| `node C:/Users/joe/website_creator/tests/footer-policy.mjs` | PASS | [footer-policy](footer-policy.log) |
| `node C:/Users/joe/website_creator/tests/generation.mjs` | PASS | [generation](generation.log) |
| `node C:/Users/joe/website_creator/tests/hero-editor.mjs` | PASS | [hero-editor](hero-editor.log) |
| `node C:/Users/joe/website_creator/tests/legacy-scroll-video.mjs` | PASS | [legacy-scroll-video](legacy-scroll-video.log) |
| `node C:/Users/joe/website_creator/tests/legal-policy.mjs` | PASS | [legal-policy](legal-policy.log) |
| `node C:/Users/joe/website_creator/tests/media-ranges.mjs` | PASS | [media-ranges](media-ranges.log) |
| `node C:/Users/joe/website_creator/tests/motion-v2.mjs` | PASS | [motion-v2](motion-v2.log) |
| `node C:/Users/joe/website_creator/tests/neighborhood.mjs` | PASS | [neighborhood](neighborhood.log) |
| `node C:/Users/joe/website_creator/tests/owner-photo.mjs` | PASS | [owner-photo](owner-photo.log) |
| `node C:/Users/joe/website_creator/tests/planning-ambient.mjs` | PASS | [planning-ambient](planning-ambient.log) |
| `node C:/Users/joe/website_creator/tests/planning-motion.mjs` | PASS | [planning-motion](planning-motion.log) |
| `node C:/Users/joe/website_creator/tests/planning-scroll.mjs` | PASS | [planning-scroll](planning-scroll.log) |
| `node C:/Users/joe/website_creator/tests/platform.mjs` | FAIL | [platform](platform.log) |
| `node C:/Users/joe/website_creator/tests/premium-service.mjs` | INTERRUPTED | [premium-service](premium-service.log) |
| `node C:/Users/joe/website_creator/tests/presentation.mjs` | PASS | [presentation](presentation.log) |
| `node C:/Users/joe/website_creator/tests/project-experience.mjs` | PASS | [project-experience](project-experience.log) |
| `node C:/Users/joe/website_creator/tests/promotion-unlocks.mjs` | INTERRUPTED | [promotion-unlocks](promotion-unlocks.log) |
| `node C:/Users/joe/website_creator/tests/reference-proof.mjs` | INTERRUPTED | [reference-proof](reference-proof.log) |
| `node C:/Users/joe/website_creator/tests/review-lookup.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-cities.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-cta.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-story.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/sales-ops.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/saved-designs.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/scroll-media.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/scroll-story.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/scroll-video-controller.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/service-content.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/service-motion.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/service-pages-all-trades.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/service-playbook.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/showpiece-media.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/showpiece-v4.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/template-name.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/trade-enablement.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/trade-revisions.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/trade-upgrade.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/trade-visual-correctness.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/trades-financing.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/trust.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/website-pages.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/workspace-owner.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/workspace.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/zoom.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/scripts/check-template-assets.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/platform-mobile.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/docs/build-evidence/clips-phase2/callback-calendar-clock.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/contact-linkage-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/contacts-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/ebook-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/expense-polish-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/expenses-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/financing-states-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/generation-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/hero-editor-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/planning-ambient-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/planning-scroll-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/platform-ui-cleanup-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/promotion-unlocks-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-cities-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-cta-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-story-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/service-motion-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/trade-enablement-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/trade-visual-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/clips-phase2.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/clips-phase2-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-polish-part1.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-polish-part1-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-polish-part2.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/roofing-acceptance.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/design-styles.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/promotions-ambient.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/promotions-scroll.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/promotions-ambient-browser.mjs` | NOT RUN | — |
| `node C:/Users/joe/website_creator/tests/promotions-scroll-browser.mjs` | NOT RUN | — |
