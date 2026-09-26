# #018 — Roofing CTA burst and pricing placement

Completed locally on feature/local-environment-setup. **Higgsfield credits used: 0.** No external vendor connection, spend, staging access, push or deployment. Screenshots use a disposable, explicitly named QA TEST FIXTURE business; its approved $625 price is a test record, not a quote from a real contractor.

## Scope, rules and reused work

Read root BUILD-BACKLOG.md #018, Pack F in docs/product/01-CORE-SITE-A-N.md, UX-RULES.md and the design/sites guidance. Reused the existing Roofing conversion journey renderer, installed flashing photograph, inquiry form, service preselection, private noindex previews, publication snapshots, measured sticky header and platform questionnaire/save lifecycle. The existing service cards already read priceBook.items, but the core settings save path dropped that field. It is now normalized and retained for Roofing. No new price-book management system, financing calculation or inquiry transport was built.

Current rules override Pack F's urgency examples and generic default pricing copy: no countdown, seasonal claim, free inspection, scarcity or invented proof is used. UX-RULES' sub-150ms timing overrides the older pack's 150–400ms motion suggestion; this burst uses 120ms transforms/opacity with no bounce or loop. The one-ticket scope selects two of Pack F's allowed homepage zones (after services / after roof-layer scrollytelling), not the entire cross-trade CTA matrix. The destination is the existing roof inquiry form.

## What changed

- One photo-led Roofing CTA moment below the unchanged hero, with an editorial split, restrained roofline accent, six low-contrast inline shingle SVGs behind the actual inquiry button and page-specific copy. Only that button has the burst. Pointer decoration cannot intercept clicks; focus has a visible outline, touch activates immediately with a solid pressed state, and reduced motion has no burst or transition. No JavaScript is required to read content or follow the form anchor.
- Exactly one secondary, soft-outline price inquiry is rendered at the saved allowed slot when an eligible price exists. It shows an approved, enabled, positive integer-cent price-book entry for an actually offered service, with supplied label/scope. A selected missing entry does not silently substitute a different price. Invalid, unapproved, disabled, other-service and Sample-tagged entries never supply a published price.
- A missing preview price shows a clearly labeled **Sample** $450 layout example in an existing noindex preview; this value exists only in view markup, never in saved priceBook data. Publishing with no eligible price removes the whole price panel and its CTA, including Sample text/value, while retaining the real roofing inquiry action. The real QA fixture uses $625 from its approved book entry in both draft and published views.
- Roofing settings persist roofingCta (slot, lock, generation, burst, selected item) and the existing priceBook.items shape. A seeded choice is saved at creation, stable on reload and ordinary saves, reselected on a changed generation unless locked. Owners/admins can choose, lock or re-roll between the two allowed slots in the Questionnaire, select an approved entry and turn off the burst. Editors can read those controls and save ordinary copy; server-side owner authorization blocks their placement changes. Older editors that omit the fields retain them.
- Roofing-only scroll margins include headings, sections, cards and the nested price panel. In-page navigation closes the phone menu, measures the collapsed header and aligns the target below it. Evidence assertions check both the form and price-card top against the real header bottom. Ordinary scrolling remains normal; no homepage hero geometry or drone media changed.

Other trades receive neither the component nor the new settings fields. The Expenses module, #016 quiz and #017 financing source/tests remain unchanged. There are no new external-key requirements.

## Verification

| Check | Result |
|---|---|
| Build / typecheck | Passed |
| All existing and new regression scripts | 59 passed |
| New #018 server/data regressions | 32 passed |
| All browser suites | 11 passed |
| New #018 browser assertions | 88 passed; no page exceptions |
| Platform mobile audit | 206 states passed |
| Template asset integrity | 604 referenced assets / 17 kits passed |
| Restarted Vite routes | 5 URLs returned 200 |
| Screenshots | 24 actual desktop/phone PNG captures |

See checks.json and individual logs, existing-browser-checks.json, regression-results.json, browser-results.json, platform-mobile-audit.json, route-check.json and summary.json. Existing conversion-reference checks also assert one Roofing-only burst/pricing action in every journey layout and none in HVAC/Patios. Disposable server fixtures cover persistence, draft/public isolation, price gates, owner denial, unsupported placement rejection and publication stripping. Browser checks cover 1440×900 / 390×844, 44px action targets, no page overflow, focus/touch/preselection, saved owner controls, reduced motion, no JavaScript and measured header clearance. The screenshot harness waits for existing deferred styles/motion and decoded imagery before capturing final layout.

The initial price-panel capture exposed a nested scroll-margin omission. A dedicated top-edge assertion reproduced it; the final CSS and passing rerun resolve it. Build/typecheck and the full suite were rerun against the final code.

## Screenshots

The paired cta and price captures are separate real viewport screenshots so the complete phone panel and its Sample label can be reviewed without hiding them under the dock. The published-no-price captures show the entire remaining inquiry moment with the price panel absent. Reduced-motion and no-JS captures show readable static content; focus captures show the subtle six-shingle burst on desktop only. Owner controls are also captured at both sizes.

- [burst-focus-desktop.png](burst-focus-desktop.png)
- [burst-focus-phone.png](burst-focus-phone.png)
- [burst-rest-desktop.png](burst-rest-desktop.png)
- [burst-rest-phone.png](burst-rest-phone.png)
- [contact-anchor-desktop.png](contact-anchor-desktop.png)
- [contact-anchor-phone.png](contact-anchor-phone.png)
- [no-js-desktop.png](no-js-desktop.png)
- [no-js-phone.png](no-js-phone.png)
- [owner-placement-desktop.png](owner-placement-desktop.png)
- [owner-placement-phone.png](owner-placement-phone.png)
- [preview-sample-cta-desktop.png](preview-sample-cta-desktop.png)
- [preview-sample-cta-phone.png](preview-sample-cta-phone.png)
- [preview-sample-price-desktop.png](preview-sample-price-desktop.png)
- [preview-sample-price-phone.png](preview-sample-price-phone.png)
- [published-no-price-cta-desktop.png](published-no-price-cta-desktop.png)
- [published-no-price-cta-phone.png](published-no-price-cta-phone.png)
- [published-price-book-cta-desktop.png](published-price-book-cta-desktop.png)
- [published-price-book-cta-phone.png](published-price-book-cta-phone.png)
- [published-price-book-price-desktop.png](published-price-book-price-desktop.png)
- [published-price-book-price-phone.png](published-price-book-price-phone.png)
- [reduced-motion-cta-desktop.png](reduced-motion-cta-desktop.png)
- [reduced-motion-cta-phone.png](reduced-motion-cta-phone.png)
- [reduced-motion-price-desktop.png](reduced-motion-price-desktop.png)
- [reduced-motion-price-phone.png](reduced-motion-price-phone.png)

## Preservation and remaining limits

Backed up and restored **1338** files that older suites regenerate, and verified **262** pre-existing unrelated modified/untracked files byte-for-byte. See preservation.json. Rerun outputs needed for this ticket were copied here before restoration; newly regenerated older-suite extras were moved into this ticket's regenerated-extra folder. No unrelated source, public templates, drone assets or historical evidence is included in this commit.

No #018 acceptance item remains blocked. The $625 record is local QA data only; production pricing still requires the contractor's own approved price-book entry. Physical-device testing was not requested; phone evidence uses Chromium at 390×844 with touch enabled. #019 remains Not started; no other ticket was begun.
