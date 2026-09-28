# #028P — Platform look

**Done.** Branch: feature/local-environment-setup. Baseline commit: 49b032eefdda23a7e7a66f9031c4f3d4f26c7271. Higgsfield credits: **0**. No push or deployment; no other ticket started.

## Console gate and baseline proof

The zero-diagnostics gate applies to pages whose body has `bv-platform`, including the approved editor, Look-picker and fixture exceptions. Unknown page scope fails closed. Public/trade pages visited by legacy suites remain fully logged and were compared with the accepted baseline; they are outside this ticket's platform gate. No console messages were suppressed.

An isolated copy of commit 49b032e reproduced the exact editor sandbox warning at all three viewports. The [editor baseline](before-console/baseline-console.md) retains six passing commands, 304 states and 26 messages. It proves the warning predates #028P; Louie's security-review follow-up is in BUILD-BACKLOG. The copy and junction were removed without touching the active tree or .preserve/.

The separate [public baseline](before-console/public-baseline-console.md) ran all 11 implicated legacy browser suites with full capture. All passed unchanged. [Diff](checks/public-console-diff.json): 37/37 current records match by suite, message, status and URL after normalizing only the port; 31 of these are unapproved public diagnostics, with **zero new** diagnostics.

| Approved platform exception | Count | Boundary |
|---|---:|---|
| Look-picker protected frames | 12 | Exact four visible frame URLs, text and state |
| Pre-existing editor iframe warning | 6 | Exact iframe source, title, sandbox and state |
| Deliberate failure fixtures | 26 | Exact injected or declared URL, method, status and state |

## Expenses contrast fix

The five phone-menu headings and five chevrons use `--bv-ink-3` on white, with `--bv-navy` on hover, focus and selection. Open, hover, keyboard focus and selected captures pass 4.5:1 text and 3:1 icon checks: [open](legacy/expense-polish-browser/015GA/menu-open-phone.png), [hover](legacy/expense-polish-browser/015GA/menu-hover-phone.png), [focus](legacy/expense-polish-browser/015GA/menu-focus-phone.png), [selected](legacy/expense-polish-browser/015GA/menu-selected-phone.png).

## Logged public follow-ups

BUILD-BACKLOG records “Public trade-site favicon missing (404 on /favicon.ico)” and “Legacy test pages: roofing-part2 financing link 404 and empty-guide resource 404, confirm intended.” No protected public page or trade iframe was changed.

## What changed

- A separate /platform.css bundle, scoped under body.bv-platform, supplies guide tokens and reusable bv- buttons, cards, pills, forms, rail, callouts, tables, tabs, navigation, dialogs/drawers, states, copy controls and optional dismissible offers. No offers were inserted.
- Seven local WOFF2 faces: Barlow 400/500/600/700, Barlow Condensed 600/700, IBM Plex Mono 500; font-display: swap, system fallbacks, [provenance and licenses](font-assets.json). No platform Google Fonts requests.
- Platform shells load the bundle; auth and preview chrome retain their routes and behavior. The adapter maps legacy classes and existing handlers, gives at most one visual primary, supplies mobile table labels and native-dialog focus trapping. Public iframe contents, app.css and existing stylesheet bytes stay unchanged.
- 720px platform phone boundary and guide typography/surfaces. Future-screen rules are in AGENTS.md and [PLATFORM-LOOK.md](../../product/PLATFORM-LOOK.md). Dark Blueprint tokens are defined but unused; the trade template is untouched.
- Final approved fixes: Calendar actions top-align on phones; blank days use the muted surface token, and all Calendar cell/event color overrides use guide tokens. Expenses selected-tab navy underline now wins in the dashboard and in its existing moved-tab drawer. Project placeholders use muted surface/secondary ink tokens. Platform foreground/background button transitions are removed; shadow motion remains, with reduced-motion suppression.
- A proper SVG favicon and platform-only references cover dashboard/Expenses, sign-in/auth messages and preview chrome. The fresh matrix records no favicon 404.

Guide conflict: disabled text #6b737c fails AA on the originally suggested disabled fill, so it uses the guide white card background. The exact corrected foreground token is retained.

## Test changes and preservation

- contact-linkage-browser remains unchanged; product CSS fixes the Calendar action alignment.
- expense-polish-browser checks guide navy text and a 3px selected underline instead of obsolete blue fill; menu text and phone boundary reflect the approved guide. It adds four menu-state contrast/focus checks while retaining all behavior, target, chart, drawer and keyboard assertions.
- platform-mobile and platform-ui-cleanup support ticket-specific output paths. The mobile test also accepts the additive body class, guide file-button color and 720px boundary.
- platform-mobile, expenses-browser, financing-states-browser, generation-browser, hero-editor-browser and promotion-unlocks-browser declare exact permission/offline fixtures. Test-only route instrumentation records injected 503/403 responses before delivery and preserves original route handlers, values and assertions. The existing Promotions POST-offline fixture received the same explicit declaration and passed a targeted rerun after the full suite; its 400/404/429 and abort diagnostics remain unallowlisted.
- Legacy evidence writes are redirected into this ticket. Console events and exceptions remain logged, including unapproved public-page diagnostics.
- Button foreground/background transitions are removed only under the platform look; callback and generation primary/secondary state changes are checked at start, 60ms and 180ms in normal motion.
- The first matrix attempt overlapped the suite's rebuild, which replaces dist. It recorded two stylesheet MIME errors. That run is retained under checks/intermediate/matrix-during-rebuild.*. The final matrix runs after the suite has finished restoring/building assets; no MIME error is allowlisted.

## Final results

| Gate | Result | Evidence |
|---|---|---|
| Full regression suite | PASS — 102/102 commands | [Record](full-checks.json) |
| Platform matrix | PASS — 162/162 states at 1440×900, 1280×800 and 390×844 | [Record](after-platform.json) |
| Matrix contrast | PASS — 14179 text and 16573 borders; 0 failures | [Record](after-platform.json) |
| Expanded contrast | PASS — 383 states; 33610 text and 66834 borders; 0 failures | [Record](checks/expanded-contrast-summary.json) |
| Keyboard, overflow, one primary | PASS — 7979 controls; 0 failing states, overflow or multiple primaries | [Record](after-platform.json) |
| Button transitions | PASS — 66 samples, 1752 checks; 0 failures | [Record](checks/callback-browser-transitions.json) |
| Platform console gate | PASS — 0 non-allowlisted diagnostics; 44 narrow exceptions logged | [Record](checks/console-allowlist.json) |
| Exception boundaries | PASS — 41 cases passed | [Record](checks/console-allowlist-tests.json) |
| Public console baseline | PASS — 37/37 match; 0 new | [Record](checks/public-console-diff.json) |
| Tokens, fonts, reduced motion | PASS — 315 scoped selectors, 7 local faces, 0 Google requests | [Record](checks/platform-look-tokens.log) |
| Protected pages | PASS — 279/279 hashes and 374/374 responses | [Record](checks/sites-unchanged.log) |
| Prior evidence and unrelated files | PASS — 11612 evidence files and 2523 unrelated files; 0 differences | [Record](checks/preservation.json) |

### All 102 commands

| Command | Result | Log |
|---|---|---|
| `node C:/Users/joe/website_creator/build.mjs` | PASS | [build](checks/build.log) |
| `node C:/Users/joe/website_creator/node_modules/typescript/bin/tsc -p C:/Users/joe/website_creator/tsconfig.auth.json` | PASS | [typecheck](checks/typecheck.log) |
| `node C:/Users/joe/website_creator/tests/auth-session.mjs` | PASS | [auth-session](checks/auth-session.log) |
| `node C:/Users/joe/website_creator/tests/aws-adapter.mjs` | PASS | [aws-adapter](checks/aws-adapter.log) |
| `node C:/Users/joe/website_creator/tests/builder.mjs` | PASS | [builder](checks/builder.log) |
| `node C:/Users/joe/website_creator/tests/callback-restore.mjs` | PASS | [callback-restore](checks/callback-restore.log) |
| `node C:/Users/joe/website_creator/tests/cinematic-films.mjs` | PASS | [cinematic-films](checks/cinematic-films.log) |
| `node C:/Users/joe/website_creator/tests/client-modules.mjs` | PASS | [client-modules](checks/client-modules.log) |
| `node C:/Users/joe/website_creator/tests/constitution.mjs` | PASS | [constitution](checks/constitution.log) |
| `node C:/Users/joe/website_creator/tests/contact-linkage.mjs` | PASS | [contact-linkage](checks/contact-linkage.log) |
| `node C:/Users/joe/website_creator/tests/contacts-restore.mjs` | PASS | [contacts-restore](checks/contacts-restore.log) |
| `node C:/Users/joe/website_creator/tests/control.mjs` | PASS | [control](checks/control.log) |
| `node C:/Users/joe/website_creator/tests/conversion-references.mjs` | PASS | [conversion-references](checks/conversion-references.log) |
| `node C:/Users/joe/website_creator/tests/core-site-pages.mjs` | PASS | [core-site-pages](checks/core-site-pages.log) |
| `node C:/Users/joe/website_creator/tests/crm-next.mjs` | PASS | [crm-next](checks/crm-next.log) |
| `node C:/Users/joe/website_creator/tests/crm.mjs` | PASS | [crm](checks/crm.log) |
| `node C:/Users/joe/website_creator/tests/design-kits.mjs` | PASS | [design-kits](checks/design-kits.log) |
| `node C:/Users/joe/website_creator/tests/ebook.mjs` | PASS | [ebook](checks/ebook.log) |
| `node C:/Users/joe/website_creator/tests/engagement-providers.mjs` | PASS | [engagement-providers](checks/engagement-providers.log) |
| `node C:/Users/joe/website_creator/tests/engagement.mjs` | PASS | [engagement](checks/engagement.log) |
| `node C:/Users/joe/website_creator/tests/expense-metering.mjs` | PASS | [expense-metering](checks/expense-metering.log) |
| `node C:/Users/joe/website_creator/tests/expense-polish.mjs` | PASS | [expense-polish](checks/expense-polish.log) |
| `node C:/Users/joe/website_creator/tests/expenses.mjs` | PASS | [expenses](checks/expenses.log) |
| `node C:/Users/joe/website_creator/tests/financing-comparison.mjs` | PASS | [financing-comparison](checks/financing-comparison.log) |
| `node C:/Users/joe/website_creator/tests/financing-states.mjs` | PASS | [financing-states](checks/financing-states.log) |
| `node C:/Users/joe/website_creator/tests/footer-policy.mjs` | PASS | [footer-policy](checks/footer-policy.log) |
| `node C:/Users/joe/website_creator/tests/generation.mjs` | PASS | [generation](checks/generation.log) |
| `node C:/Users/joe/website_creator/tests/hero-editor.mjs` | PASS | [hero-editor](checks/hero-editor.log) |
| `node C:/Users/joe/website_creator/tests/legacy-scroll-video.mjs` | PASS | [legacy-scroll-video](checks/legacy-scroll-video.log) |
| `node C:/Users/joe/website_creator/tests/legal-policy.mjs` | PASS | [legal-policy](checks/legal-policy.log) |
| `node C:/Users/joe/website_creator/tests/media-ranges.mjs` | PASS | [media-ranges](checks/media-ranges.log) |
| `node C:/Users/joe/website_creator/tests/motion-v2.mjs` | PASS | [motion-v2](checks/motion-v2.log) |
| `node C:/Users/joe/website_creator/tests/neighborhood.mjs` | PASS | [neighborhood](checks/neighborhood.log) |
| `node C:/Users/joe/website_creator/tests/owner-photo.mjs` | PASS | [owner-photo](checks/owner-photo.log) |
| `node C:/Users/joe/website_creator/tests/planning-ambient.mjs` | PASS | [planning-ambient](checks/planning-ambient.log) |
| `node C:/Users/joe/website_creator/tests/planning-motion.mjs` | PASS | [planning-motion](checks/planning-motion.log) |
| `node C:/Users/joe/website_creator/tests/planning-scroll.mjs` | PASS | [planning-scroll](checks/planning-scroll.log) |
| `node C:/Users/joe/website_creator/tests/platform.mjs` | PASS | [platform](checks/platform.log) |
| `node C:/Users/joe/website_creator/tests/premium-service.mjs` | PASS | [premium-service](checks/premium-service.log) |
| `node C:/Users/joe/website_creator/tests/presentation.mjs` | PASS | [presentation](checks/presentation.log) |
| `node C:/Users/joe/website_creator/tests/project-experience.mjs` | PASS | [project-experience](checks/project-experience.log) |
| `node C:/Users/joe/website_creator/tests/promotion-unlocks.mjs` | PASS | [promotion-unlocks](checks/promotion-unlocks.log) |
| `node C:/Users/joe/website_creator/tests/reference-proof.mjs` | PASS | [reference-proof](checks/reference-proof.log) |
| `node C:/Users/joe/website_creator/tests/review-lookup.mjs` | PASS | [review-lookup](checks/review-lookup.log) |
| `node C:/Users/joe/website_creator/tests/roofing-cities.mjs` | PASS | [roofing-cities](checks/roofing-cities.log) |
| `node C:/Users/joe/website_creator/tests/roofing-cta.mjs` | PASS | [roofing-cta](checks/roofing-cta.log) |
| `node C:/Users/joe/website_creator/tests/roofing-story.mjs` | PASS | [roofing-story](checks/roofing-story.log) |
| `node C:/Users/joe/website_creator/tests/sales-ops.mjs` | PASS | [sales-ops](checks/sales-ops.log) |
| `node C:/Users/joe/website_creator/tests/saved-designs.mjs` | PASS | [saved-designs](checks/saved-designs.log) |
| `node C:/Users/joe/website_creator/tests/scroll-media.mjs` | PASS | [scroll-media](checks/scroll-media.log) |
| `node C:/Users/joe/website_creator/tests/scroll-story.mjs` | PASS | [scroll-story](checks/scroll-story.log) |
| `node C:/Users/joe/website_creator/tests/scroll-video-controller.mjs` | PASS | [scroll-video-controller](checks/scroll-video-controller.log) |
| `node C:/Users/joe/website_creator/tests/service-content.mjs` | PASS | [service-content](checks/service-content.log) |
| `node C:/Users/joe/website_creator/tests/service-motion.mjs` | PASS | [service-motion](checks/service-motion.log) |
| `node C:/Users/joe/website_creator/tests/service-pages-all-trades.mjs` | PASS | [service-pages-all-trades](checks/service-pages-all-trades.log) |
| `node C:/Users/joe/website_creator/tests/service-playbook.mjs` | PASS | [service-playbook](checks/service-playbook.log) |
| `node C:/Users/joe/website_creator/tests/showpiece-media.mjs` | PASS | [showpiece-media](checks/showpiece-media.log) |
| `node C:/Users/joe/website_creator/tests/showpiece-v4.mjs` | PASS | [showpiece-v4](checks/showpiece-v4.log) |
| `node C:/Users/joe/website_creator/tests/template-name.mjs` | PASS | [template-name](checks/template-name.log) |
| `node C:/Users/joe/website_creator/tests/trade-enablement.mjs` | PASS | [trade-enablement](checks/trade-enablement.log) |
| `node C:/Users/joe/website_creator/tests/trade-revisions.mjs` | PASS | [trade-revisions](checks/trade-revisions.log) |
| `node C:/Users/joe/website_creator/tests/trade-upgrade.mjs` | PASS | [trade-upgrade](checks/trade-upgrade.log) |
| `node C:/Users/joe/website_creator/tests/trade-visual-correctness.mjs` | PASS | [trade-visual-correctness](checks/trade-visual-correctness.log) |
| `node C:/Users/joe/website_creator/tests/trades-financing.mjs` | PASS | [trades-financing](checks/trades-financing.log) |
| `node C:/Users/joe/website_creator/tests/trust.mjs` | PASS | [trust](checks/trust.log) |
| `node C:/Users/joe/website_creator/tests/website-pages.mjs` | PASS | [website-pages](checks/website-pages.log) |
| `node C:/Users/joe/website_creator/tests/workspace-owner.mjs` | PASS | [workspace-owner](checks/workspace-owner.log) |
| `node C:/Users/joe/website_creator/tests/workspace.mjs` | PASS | [workspace](checks/workspace.log) |
| `node C:/Users/joe/website_creator/tests/zoom.mjs` | PASS | [zoom](checks/zoom.log) |
| `node C:/Users/joe/website_creator/scripts/check-template-assets.mjs` | PASS | [template-assets](checks/template-assets.log) |
| `node C:/Users/joe/website_creator/tests/platform-mobile.mjs` | PASS | [platform-mobile](checks/platform-mobile.log) |
| `node C:/Users/joe/website_creator/docs/build-evidence/clips-phase2/callback-calendar-clock.mjs` | PASS | [callback-browser](checks/callback-browser.log) |
| `node C:/Users/joe/website_creator/tests/contact-linkage-browser.mjs` | PASS | [contact-linkage-browser](checks/contact-linkage-browser.log) |
| `node C:/Users/joe/website_creator/tests/contacts-browser.mjs` | PASS | [contacts-browser](checks/contacts-browser.log) |
| `node C:/Users/joe/website_creator/tests/ebook-browser.mjs` | PASS | [ebook-browser](checks/ebook-browser.log) |
| `node C:/Users/joe/website_creator/tests/expense-polish-browser.mjs` | PASS | [expense-polish-browser](checks/expense-polish-browser.log) |
| `node C:/Users/joe/website_creator/tests/expenses-browser.mjs` | PASS | [expenses-browser](checks/expenses-browser.log) |
| `node C:/Users/joe/website_creator/tests/financing-states-browser.mjs` | PASS | [financing-states-browser](checks/financing-states-browser.log) |
| `node C:/Users/joe/website_creator/tests/generation-browser.mjs` | PASS | [generation-browser](checks/generation-browser.log) |
| `node C:/Users/joe/website_creator/tests/hero-editor-browser.mjs` | PASS | [hero-editor-browser](checks/hero-editor-browser.log) |
| `node C:/Users/joe/website_creator/tests/planning-ambient-browser.mjs` | PASS | [planning-ambient-browser](checks/planning-ambient-browser.log) |
| `node C:/Users/joe/website_creator/tests/planning-scroll-browser.mjs` | PASS | [planning-scroll-browser](checks/planning-scroll-browser.log) |
| `node C:/Users/joe/website_creator/tests/platform-ui-cleanup-browser.mjs` | PASS | [platform-ui-cleanup-browser](checks/platform-ui-cleanup-browser.log) |
| `node C:/Users/joe/website_creator/tests/promotion-unlocks-browser.mjs` | PASS | [promotion-unlocks-browser](checks/promotion-unlocks-browser.log) |
| `node C:/Users/joe/website_creator/tests/roofing-cities-browser.mjs` | PASS | [roofing-cities-browser](checks/roofing-cities-browser.log) |
| `node C:/Users/joe/website_creator/tests/roofing-cta-browser.mjs` | PASS | [roofing-cta-browser](checks/roofing-cta-browser.log) |
| `node C:/Users/joe/website_creator/tests/roofing-story-browser.mjs` | PASS | [roofing-story-browser](checks/roofing-story-browser.log) |
| `node C:/Users/joe/website_creator/tests/service-motion-browser.mjs` | PASS | [service-motion-browser](checks/service-motion-browser.log) |
| `node C:/Users/joe/website_creator/tests/trade-enablement-browser.mjs` | PASS | [trade-enablement-browser](checks/trade-enablement-browser.log) |
| `node C:/Users/joe/website_creator/tests/trade-visual-browser.mjs` | PASS | [trade-visual-browser](checks/trade-visual-browser.log) |
| `node C:/Users/joe/website_creator/tests/clips-phase2.mjs` | PASS | [clips-phase2](checks/clips-phase2.log) |
| `node C:/Users/joe/website_creator/tests/clips-phase2-browser.mjs` | PASS | [clips-phase2-browser](checks/clips-phase2-browser.log) |
| `node C:/Users/joe/website_creator/tests/roofing-polish-part1.mjs` | PASS | [roofing-polish-part1](checks/roofing-polish-part1.log) |
| `node C:/Users/joe/website_creator/tests/roofing-polish-part1-browser.mjs` | PASS | [roofing-polish-part1-browser](checks/roofing-polish-part1-browser.log) |
| `node C:/Users/joe/website_creator/tests/roofing-polish-part2.mjs` | PASS | [roofing-polish-part2](checks/roofing-polish-part2.log) |
| `node C:/Users/joe/website_creator/tests/roofing-polish-part2-browser.mjs` | PASS | [roofing-polish-part2-browser](checks/roofing-polish-part2-browser.log) |
| `node C:/Users/joe/website_creator/tests/roofing-acceptance.mjs` | PASS | [roofing-acceptance](checks/roofing-acceptance.log) |
| `node C:/Users/joe/website_creator/tests/design-styles.mjs` | PASS | [design-styles](checks/design-styles.log) |
| `node C:/Users/joe/website_creator/tests/promotions-ambient.mjs` | PASS | [promotions-ambient](checks/promotions-ambient.log) |
| `node C:/Users/joe/website_creator/tests/promotions-scroll.mjs` | PASS | [promotions-scroll](checks/promotions-scroll.log) |
| `node C:/Users/joe/website_creator/tests/promotions-ambient-browser.mjs` | PASS | [promotions-ambient-browser](checks/promotions-ambient-browser.log) |
| `node C:/Users/joe/website_creator/tests/promotions-scroll-browser.mjs` | PASS | [promotions-scroll-browser](checks/promotions-scroll-browser.log) |

## Before / after screenshots

[Reference](reference-browser.png) · [Launchpad comparison](launchpad-comparison.png) ([HTML](launchpad-comparison.html)).

| State | Before | After |
|---|---|---|
| desktop-admin-overview | [Before](before/desktop-admin-overview.png) | [After](after/desktop-admin-overview.png) |
| desktop-admin-contacts | [Before](before/desktop-admin-contacts.png) | [After](after/desktop-admin-contacts.png) |
| desktop-modal | [Before](before/desktop-modal.png) | [After](after/desktop-modal.png) |
| desktop-contact-drawer | [Before](before/desktop-contact-drawer.png) | [After](after/desktop-contact-drawer.png) |
| desktop-admin-customers | [Before](before/desktop-admin-customers.png) | [After](after/desktop-admin-customers.png) |
| desktop-admin-pipeline | [Before](before/desktop-admin-pipeline.png) | [After](after/desktop-admin-pipeline.png) |
| desktop-admin-calendar | [Before](before/desktop-admin-calendar.png) | [After](after/desktop-admin-calendar.png) |
| desktop-admin-followupCenter | [Before](before/desktop-admin-followupCenter.png) | [After](after/desktop-admin-followupCenter.png) |
| desktop-admin-leadGen | [Before](before/desktop-admin-leadGen.png) | [After](after/desktop-admin-leadGen.png) |
| desktop-admin-commissions | [Before](before/desktop-admin-commissions.png) | [After](after/desktop-admin-commissions.png) |
| desktop-admin-payments | [Before](before/desktop-admin-payments.png) | [After](after/desktop-admin-payments.png) |
| desktop-admin-expenses | [Before](before/desktop-admin-expenses.png) | [After](after/desktop-admin-expenses.png) |
| desktop-admin-websites | [Before](before/desktop-admin-websites.png) | [After](after/desktop-admin-websites.png) |
| desktop-admin-tradeLibrary | [Before](before/desktop-admin-tradeLibrary.png) | [After](after/desktop-admin-tradeLibrary.png) |
| desktop-admin-templateLibrary | [Before](before/desktop-admin-templateLibrary.png) | [After](after/desktop-admin-templateLibrary.png) |
| desktop-admin-settings | [Before](before/desktop-admin-settings.png) | [After](after/desktop-admin-settings.png) |
| desktop-admin-profile | [Before](before/desktop-admin-profile.png) | [After](after/desktop-admin-profile.png) |
| desktop-admin-launch | [Before](before/desktop-admin-launch.png) | [After](after/desktop-admin-launch.png) |
| desktop-admin-team | [Before](before/desktop-admin-team.png) | [After](after/desktop-admin-team.png) |
| desktop-admin-monitoring | [Before](before/desktop-admin-monitoring.png) | [After](after/desktop-admin-monitoring.png) |
| desktop-admin-audit | [Before](before/desktop-admin-audit.png) | [After](after/desktop-admin-audit.png) |
| desktop-expenses-admin | [Before](before/desktop-expenses-admin.png) | [After](after/desktop-expenses-admin.png) |
| desktop-contractor-launchpad | [Before](before/desktop-contractor-launchpad.png) | [After](after/desktop-contractor-launchpad.png) |
| desktop-contractor-questionnaire | [Before](before/desktop-contractor-questionnaire.png) | [After](after/desktop-contractor-questionnaire.png) |
| desktop-questionnaire-first | [Before](before/desktop-questionnaire-first.png) | [After](after/desktop-questionnaire-first.png) |
| desktop-questionnaire-midway | [Before](before/desktop-questionnaire-midway.png) | [After](after/desktop-questionnaire-midway.png) |
| desktop-contractor-hero | [Before](before/desktop-contractor-hero.png) | [After](after/desktop-contractor-hero.png) |
| desktop-contractor-editor | [Before](before/desktop-contractor-editor.png) | [After](after/desktop-contractor-editor.png) |
| desktop-contractor-pages | [Before](before/desktop-contractor-pages.png) | [After](after/desktop-contractor-pages.png) |
| desktop-empty-state | [Before](before/desktop-empty-state.png) | [After](after/desktop-empty-state.png) |
| desktop-contractor-business | [Before](before/desktop-contractor-business.png) | [After](after/desktop-contractor-business.png) |
| desktop-contractor-ownerphoto | [Before](before/desktop-contractor-ownerphoto.png) | [After](after/desktop-contractor-ownerphoto.png) |
| desktop-contractor-templates | [Before](before/desktop-contractor-templates.png) | [After](after/desktop-contractor-templates.png) |
| desktop-look-picker | [Before](before/desktop-look-picker.png) | [After](after/desktop-look-picker.png) |
| desktop-contractor-services | [Before](before/desktop-contractor-services.png) | [After](after/desktop-contractor-services.png) |
| desktop-contractor-projects | [Before](before/desktop-contractor-projects.png) | [After](after/desktop-contractor-projects.png) |
| desktop-contractor-blog | [Before](before/desktop-contractor-blog.png) | [After](after/desktop-contractor-blog.png) |
| desktop-contractor-contacts | [Before](before/desktop-contractor-contacts.png) | [After](after/desktop-contractor-contacts.png) |
| desktop-contractor-calendar | [Before](before/desktop-contractor-calendar.png) | [After](after/desktop-contractor-calendar.png) |
| desktop-contractor-forms | [Before](before/desktop-contractor-forms.png) | [After](after/desktop-contractor-forms.png) |
| desktop-contractor-inquiries | [Before](before/desktop-contractor-inquiries.png) | [After](after/desktop-contractor-inquiries.png) |
| desktop-contractor-chat | [Before](before/desktop-contractor-chat.png) | [After](after/desktop-contractor-chat.png) |
| desktop-contractor-pricing | [Before](before/desktop-contractor-pricing.png) | [After](after/desktop-contractor-pricing.png) |
| desktop-contractor-reviews | [Before](before/desktop-contractor-reviews.png) | [After](after/desktop-contractor-reviews.png) |
| desktop-contractor-visibility | [Before](before/desktop-contractor-visibility.png) | [After](after/desktop-contractor-visibility.png) |
| desktop-contractor-plan | [Before](before/desktop-contractor-plan.png) | [After](after/desktop-contractor-plan.png) |
| desktop-contractor-readiness | [Before](before/desktop-contractor-readiness.png) | [After](after/desktop-contractor-readiness.png) |
| desktop-contractor-followups | [Before](before/desktop-contractor-followups.png) | [After](after/desktop-contractor-followups.png) |
| desktop-contractor-access | [Before](before/desktop-contractor-access.png) | [After](after/desktop-contractor-access.png) |
| desktop-contractor-domains | [Before](before/desktop-contractor-domains.png) | [After](after/desktop-contractor-domains.png) |
| desktop-contractor-backups | [Before](before/desktop-contractor-backups.png) | [After](after/desktop-contractor-backups.png) |
| desktop-preview-chrome | [Before](before/desktop-preview-chrome.png) | [After](after/desktop-preview-chrome.png) |
| desktop-sign-in | [Before](before/desktop-sign-in.png) | [After](after/desktop-sign-in.png) |
| desktop-error-state | [Before](before/desktop-error-state.png) | [After](after/desktop-error-state.png) |
| desktop-1280-admin-overview | [Before](before/desktop-1280-admin-overview.png) | [After](after/desktop-1280-admin-overview.png) |
| desktop-1280-admin-contacts | [Before](before/desktop-1280-admin-contacts.png) | [After](after/desktop-1280-admin-contacts.png) |
| desktop-1280-modal | [Before](before/desktop-1280-modal.png) | [After](after/desktop-1280-modal.png) |
| desktop-1280-contact-drawer | [Before](before/desktop-1280-contact-drawer.png) | [After](after/desktop-1280-contact-drawer.png) |
| desktop-1280-admin-customers | [Before](before/desktop-1280-admin-customers.png) | [After](after/desktop-1280-admin-customers.png) |
| desktop-1280-admin-pipeline | [Before](before/desktop-1280-admin-pipeline.png) | [After](after/desktop-1280-admin-pipeline.png) |
| desktop-1280-admin-calendar | [Before](before/desktop-1280-admin-calendar.png) | [After](after/desktop-1280-admin-calendar.png) |
| desktop-1280-admin-followupCenter | [Before](before/desktop-1280-admin-followupCenter.png) | [After](after/desktop-1280-admin-followupCenter.png) |
| desktop-1280-admin-leadGen | [Before](before/desktop-1280-admin-leadGen.png) | [After](after/desktop-1280-admin-leadGen.png) |
| desktop-1280-admin-commissions | [Before](before/desktop-1280-admin-commissions.png) | [After](after/desktop-1280-admin-commissions.png) |
| desktop-1280-admin-payments | [Before](before/desktop-1280-admin-payments.png) | [After](after/desktop-1280-admin-payments.png) |
| desktop-1280-admin-expenses | [Before](before/desktop-1280-admin-expenses.png) | [After](after/desktop-1280-admin-expenses.png) |
| desktop-1280-admin-websites | [Before](before/desktop-1280-admin-websites.png) | [After](after/desktop-1280-admin-websites.png) |
| desktop-1280-admin-tradeLibrary | [Before](before/desktop-1280-admin-tradeLibrary.png) | [After](after/desktop-1280-admin-tradeLibrary.png) |
| desktop-1280-admin-templateLibrary | [Before](before/desktop-1280-admin-templateLibrary.png) | [After](after/desktop-1280-admin-templateLibrary.png) |
| desktop-1280-admin-settings | [Before](before/desktop-1280-admin-settings.png) | [After](after/desktop-1280-admin-settings.png) |
| desktop-1280-admin-profile | [Before](before/desktop-1280-admin-profile.png) | [After](after/desktop-1280-admin-profile.png) |
| desktop-1280-admin-launch | [Before](before/desktop-1280-admin-launch.png) | [After](after/desktop-1280-admin-launch.png) |
| desktop-1280-admin-team | [Before](before/desktop-1280-admin-team.png) | [After](after/desktop-1280-admin-team.png) |
| desktop-1280-admin-monitoring | [Before](before/desktop-1280-admin-monitoring.png) | [After](after/desktop-1280-admin-monitoring.png) |
| desktop-1280-admin-audit | [Before](before/desktop-1280-admin-audit.png) | [After](after/desktop-1280-admin-audit.png) |
| desktop-1280-expenses-admin | [Before](before/desktop-1280-expenses-admin.png) | [After](after/desktop-1280-expenses-admin.png) |
| desktop-1280-contractor-launchpad | [Before](before/desktop-1280-contractor-launchpad.png) | [After](after/desktop-1280-contractor-launchpad.png) |
| desktop-1280-contractor-questionnaire | [Before](before/desktop-1280-contractor-questionnaire.png) | [After](after/desktop-1280-contractor-questionnaire.png) |
| desktop-1280-questionnaire-first | [Before](before/desktop-1280-questionnaire-first.png) | [After](after/desktop-1280-questionnaire-first.png) |
| desktop-1280-questionnaire-midway | [Before](before/desktop-1280-questionnaire-midway.png) | [After](after/desktop-1280-questionnaire-midway.png) |
| desktop-1280-contractor-hero | [Before](before/desktop-1280-contractor-hero.png) | [After](after/desktop-1280-contractor-hero.png) |
| desktop-1280-contractor-editor | [Before](before/desktop-1280-contractor-editor.png) | [After](after/desktop-1280-contractor-editor.png) |
| desktop-1280-contractor-pages | [Before](before/desktop-1280-contractor-pages.png) | [After](after/desktop-1280-contractor-pages.png) |
| desktop-1280-empty-state | [Before](before/desktop-1280-empty-state.png) | [After](after/desktop-1280-empty-state.png) |
| desktop-1280-contractor-business | [Before](before/desktop-1280-contractor-business.png) | [After](after/desktop-1280-contractor-business.png) |
| desktop-1280-contractor-ownerphoto | [Before](before/desktop-1280-contractor-ownerphoto.png) | [After](after/desktop-1280-contractor-ownerphoto.png) |
| desktop-1280-contractor-templates | [Before](before/desktop-1280-contractor-templates.png) | [After](after/desktop-1280-contractor-templates.png) |
| desktop-1280-look-picker | [Before](before/desktop-1280-look-picker.png) | [After](after/desktop-1280-look-picker.png) |
| desktop-1280-contractor-services | [Before](before/desktop-1280-contractor-services.png) | [After](after/desktop-1280-contractor-services.png) |
| desktop-1280-contractor-projects | [Before](before/desktop-1280-contractor-projects.png) | [After](after/desktop-1280-contractor-projects.png) |
| desktop-1280-contractor-blog | [Before](before/desktop-1280-contractor-blog.png) | [After](after/desktop-1280-contractor-blog.png) |
| desktop-1280-contractor-contacts | [Before](before/desktop-1280-contractor-contacts.png) | [After](after/desktop-1280-contractor-contacts.png) |
| desktop-1280-contractor-calendar | [Before](before/desktop-1280-contractor-calendar.png) | [After](after/desktop-1280-contractor-calendar.png) |
| desktop-1280-contractor-forms | [Before](before/desktop-1280-contractor-forms.png) | [After](after/desktop-1280-contractor-forms.png) |
| desktop-1280-contractor-inquiries | [Before](before/desktop-1280-contractor-inquiries.png) | [After](after/desktop-1280-contractor-inquiries.png) |
| desktop-1280-contractor-chat | [Before](before/desktop-1280-contractor-chat.png) | [After](after/desktop-1280-contractor-chat.png) |
| desktop-1280-contractor-pricing | [Before](before/desktop-1280-contractor-pricing.png) | [After](after/desktop-1280-contractor-pricing.png) |
| desktop-1280-contractor-reviews | [Before](before/desktop-1280-contractor-reviews.png) | [After](after/desktop-1280-contractor-reviews.png) |
| desktop-1280-contractor-visibility | [Before](before/desktop-1280-contractor-visibility.png) | [After](after/desktop-1280-contractor-visibility.png) |
| desktop-1280-contractor-plan | [Before](before/desktop-1280-contractor-plan.png) | [After](after/desktop-1280-contractor-plan.png) |
| desktop-1280-contractor-readiness | [Before](before/desktop-1280-contractor-readiness.png) | [After](after/desktop-1280-contractor-readiness.png) |
| desktop-1280-contractor-followups | [Before](before/desktop-1280-contractor-followups.png) | [After](after/desktop-1280-contractor-followups.png) |
| desktop-1280-contractor-access | [Before](before/desktop-1280-contractor-access.png) | [After](after/desktop-1280-contractor-access.png) |
| desktop-1280-contractor-domains | [Before](before/desktop-1280-contractor-domains.png) | [After](after/desktop-1280-contractor-domains.png) |
| desktop-1280-contractor-backups | [Before](before/desktop-1280-contractor-backups.png) | [After](after/desktop-1280-contractor-backups.png) |
| desktop-1280-preview-chrome | [Before](before/desktop-1280-preview-chrome.png) | [After](after/desktop-1280-preview-chrome.png) |
| desktop-1280-sign-in | [Before](before/desktop-1280-sign-in.png) | [After](after/desktop-1280-sign-in.png) |
| desktop-1280-error-state | [Before](before/desktop-1280-error-state.png) | [After](after/desktop-1280-error-state.png) |
| phone-admin-overview | [Before](before/phone-admin-overview.png) | [After](after/phone-admin-overview.png) |
| phone-admin-contacts | [Before](before/phone-admin-contacts.png) | [After](after/phone-admin-contacts.png) |
| phone-modal | [Before](before/phone-modal.png) | [After](after/phone-modal.png) |
| phone-contact-drawer | [Before](before/phone-contact-drawer.png) | [After](after/phone-contact-drawer.png) |
| phone-admin-customers | [Before](before/phone-admin-customers.png) | [After](after/phone-admin-customers.png) |
| phone-admin-pipeline | [Before](before/phone-admin-pipeline.png) | [After](after/phone-admin-pipeline.png) |
| phone-admin-calendar | [Before](before/phone-admin-calendar.png) | [After](after/phone-admin-calendar.png) |
| phone-admin-followupCenter | [Before](before/phone-admin-followupCenter.png) | [After](after/phone-admin-followupCenter.png) |
| phone-admin-leadGen | [Before](before/phone-admin-leadGen.png) | [After](after/phone-admin-leadGen.png) |
| phone-admin-commissions | [Before](before/phone-admin-commissions.png) | [After](after/phone-admin-commissions.png) |
| phone-admin-payments | [Before](before/phone-admin-payments.png) | [After](after/phone-admin-payments.png) |
| phone-admin-expenses | [Before](before/phone-admin-expenses.png) | [After](after/phone-admin-expenses.png) |
| phone-admin-websites | [Before](before/phone-admin-websites.png) | [After](after/phone-admin-websites.png) |
| phone-admin-tradeLibrary | [Before](before/phone-admin-tradeLibrary.png) | [After](after/phone-admin-tradeLibrary.png) |
| phone-admin-templateLibrary | [Before](before/phone-admin-templateLibrary.png) | [After](after/phone-admin-templateLibrary.png) |
| phone-admin-settings | [Before](before/phone-admin-settings.png) | [After](after/phone-admin-settings.png) |
| phone-admin-profile | [Before](before/phone-admin-profile.png) | [After](after/phone-admin-profile.png) |
| phone-admin-launch | [Before](before/phone-admin-launch.png) | [After](after/phone-admin-launch.png) |
| phone-admin-team | [Before](before/phone-admin-team.png) | [After](after/phone-admin-team.png) |
| phone-admin-monitoring | [Before](before/phone-admin-monitoring.png) | [After](after/phone-admin-monitoring.png) |
| phone-admin-audit | [Before](before/phone-admin-audit.png) | [After](after/phone-admin-audit.png) |
| phone-expenses-admin | [Before](before/phone-expenses-admin.png) | [After](after/phone-expenses-admin.png) |
| phone-contractor-launchpad | [Before](before/phone-contractor-launchpad.png) | [After](after/phone-contractor-launchpad.png) |
| phone-contractor-questionnaire | [Before](before/phone-contractor-questionnaire.png) | [After](after/phone-contractor-questionnaire.png) |
| phone-questionnaire-first | [Before](before/phone-questionnaire-first.png) | [After](after/phone-questionnaire-first.png) |
| phone-questionnaire-midway | [Before](before/phone-questionnaire-midway.png) | [After](after/phone-questionnaire-midway.png) |
| phone-contractor-hero | [Before](before/phone-contractor-hero.png) | [After](after/phone-contractor-hero.png) |
| phone-contractor-editor | [Before](before/phone-contractor-editor.png) | [After](after/phone-contractor-editor.png) |
| phone-contractor-pages | [Before](before/phone-contractor-pages.png) | [After](after/phone-contractor-pages.png) |
| phone-empty-state | [Before](before/phone-empty-state.png) | [After](after/phone-empty-state.png) |
| phone-contractor-business | [Before](before/phone-contractor-business.png) | [After](after/phone-contractor-business.png) |
| phone-contractor-ownerphoto | [Before](before/phone-contractor-ownerphoto.png) | [After](after/phone-contractor-ownerphoto.png) |
| phone-contractor-templates | [Before](before/phone-contractor-templates.png) | [After](after/phone-contractor-templates.png) |
| phone-look-picker | [Before](before/phone-look-picker.png) | [After](after/phone-look-picker.png) |
| phone-contractor-services | [Before](before/phone-contractor-services.png) | [After](after/phone-contractor-services.png) |
| phone-contractor-projects | [Before](before/phone-contractor-projects.png) | [After](after/phone-contractor-projects.png) |
| phone-contractor-blog | [Before](before/phone-contractor-blog.png) | [After](after/phone-contractor-blog.png) |
| phone-contractor-contacts | [Before](before/phone-contractor-contacts.png) | [After](after/phone-contractor-contacts.png) |
| phone-contractor-calendar | [Before](before/phone-contractor-calendar.png) | [After](after/phone-contractor-calendar.png) |
| phone-contractor-forms | [Before](before/phone-contractor-forms.png) | [After](after/phone-contractor-forms.png) |
| phone-contractor-inquiries | [Before](before/phone-contractor-inquiries.png) | [After](after/phone-contractor-inquiries.png) |
| phone-contractor-chat | [Before](before/phone-contractor-chat.png) | [After](after/phone-contractor-chat.png) |
| phone-contractor-pricing | [Before](before/phone-contractor-pricing.png) | [After](after/phone-contractor-pricing.png) |
| phone-contractor-reviews | [Before](before/phone-contractor-reviews.png) | [After](after/phone-contractor-reviews.png) |
| phone-contractor-visibility | [Before](before/phone-contractor-visibility.png) | [After](after/phone-contractor-visibility.png) |
| phone-contractor-plan | [Before](before/phone-contractor-plan.png) | [After](after/phone-contractor-plan.png) |
| phone-contractor-readiness | [Before](before/phone-contractor-readiness.png) | [After](after/phone-contractor-readiness.png) |
| phone-contractor-followups | [Before](before/phone-contractor-followups.png) | [After](after/phone-contractor-followups.png) |
| phone-contractor-access | [Before](before/phone-contractor-access.png) | [After](after/phone-contractor-access.png) |
| phone-contractor-domains | [Before](before/phone-contractor-domains.png) | [After](after/phone-contractor-domains.png) |
| phone-contractor-backups | [Before](before/phone-contractor-backups.png) | [After](after/phone-contractor-backups.png) |
| phone-preview-chrome | [Before](before/phone-preview-chrome.png) | [After](after/phone-preview-chrome.png) |
| phone-sign-in | [Before](before/phone-sign-in.png) | [After](after/phone-sign-in.png) |
| phone-error-state | [Before](before/phone-error-state.png) | [After](after/phone-error-state.png) |

## Old rules neutralized only under body.bv-platform

DM font, blue primary buttons, cool surfaces, headings, weak fields/control borders, cards, badges, tables, tabs, save bars, empty states, dialog backdrop; sidebar/nav/summary/pipeline/contact layouts; Calendar cells/events and action alignment; project placeholders; integration and questionnaire bands/labels/rail; Expenses tabs/drawers/menu surfaces and group-label states; auth surfaces; editor/generation/Look-picker chrome; inherited phone layout breakpoints; foreground/background button interpolation. The existing public CSS files and trade iframe contents remain unchanged.

## Completion

The original before files retain their hashes. Protected public HTML/CSS and archived responses match the baseline; prior evidence and unrelated dirty files remain byte identical. .preserve/ backups and FFmpeg/FFprobe downloads are excluded from the commit. The running suite restored its temporary film and test fixtures. No route, data, auth, public CSS, trade iframe or public-page behavior change was made.
