# #028 Roofing homeowner acceptance

Local acceptance on `feature/local-environment-setup`. **Higgsfield credits used: 0.** No push, deployment or staging environment. The QA fixture and its two inquiries are local test data.

## Results

- **101/101 final commands passed:** build, typecheck, 72 regression scripts, 25 browser suites, template asset integrity and the platform mobile suite. The mobile suite checked all 210 states; asset integrity checked 635 references across 17 kits. [Final results](final-checks.json) · [command logs](checks/).
- The [Roofing acceptance suite](acceptance-results.json) passed **911 assertions** across **132 page/mode/device checks** for 22 routes at 1440×900 and 390×844, including no-JS and reduced motion. It checked 88 local assets, 17 kit headers, one submit per form, no overflow, and no browser exceptions. Highest measured CLS: **0.025**.
- Two real local inquiries were saved in the fixture and led to the [desktop](screenshots/saved-inquiry-confirmation-desktop.jpg) and [phone](screenshots/saved-inquiry-confirmation-phone.jpg) confirmations. The fixture's test lender link is not a real contractor integration.
- **374/374** archived public response contracts across all 17 kits remained byte-identical. The comparison used the original public request origin and authenticated preview context. [Per-route hashes](outside-scope-responses.json).
- Vite was restarted locally and its new PID was confirmed listening on port 5173. **39/39 current, persistent QA URLs returned HTTP 200**, including the Robles home, visible core pages, Roof Repair and installed assets. [Current URL results](qa-current-urls.json). The historical 53-URL list contains 22 transient prior-ticket QA tenants that are not in the clean local database; those URLs returned 404 after restart and are recorded in [the full historical probe](qa-urls.json). The isolated #028 fixture separately returned 200 for all 22 routes under acceptance.
- **10,621** prior evidence files were restored and SHA-256 verified byte-for-byte; **2,377** pre-existing dirty/untracked files were verified unchanged. [Preservation result](preservation.json). Redundant regenerated copies were discarded after verification; the #028 results and captures remain here.

The first complete run recorded two failures in [run history](full-checks.json): the old #027A test required obsolete #028G wording, and reduced-motion Roofing first paint occasionally reached CLS 0.088 while the deferred stylesheet arrived. The documentation assertion was updated for the authorized #028G text. The critical CSS builder now includes the existing first-screen layout and header rules. Focused retests passed: [#027A regression](checks/roofing-polish-part2-final.log), [#028 acceptance](checks/roofing-acceptance-final.log), and [Roofing browser suite](checks/roofing-polish-part2-browser-final.log). The final acceptance run had zero failures.

## Before and after polish

| Fix | Before | After | Finding |
|---|---|---|---|
| Roofing service cards | [Desktop](screenshots/polish-service-cards-before-desktop.png) · [Phone](screenshots/polish-service-cards-before-phone.png) | [Desktop](screenshots/polish-service-cards-after-desktop.jpg) · [Phone](screenshots/polish-service-cards-after-phone.jpg) | The earlier shot caught a 650ms opacity reveal mid-transition. Roofing cards now keep full-color photos and WCAG AA heading/body contrast throughout. |
| Light header Expertise | [Desktop](screenshots/polish-header-before-desktop.png) | [Desktop](screenshots/polish-header-after-desktop.jpg) · [Phone menu](screenshots/polish-header-after-phone.jpg) | The summary inherited body typography. It now matches adjacent nav links in size, weight and vertical center; the caret stays inline. All 17 kits were measured. |
| Design-locks status | [Desktop](screenshots/polish-design-locks-before-desktop.png) · [Phone](screenshots/polish-design-locks-before-phone.png) | [Desktop](screenshots/polish-design-locks-after-desktop.jpg) · [Phone](screenshots/polish-design-locks-after-phone.jpg) | The contractor sees that new photos and videos are unavailable and current media stays in place. |

## Every Roofing page

These full-page captures were taken after scrolling through the page and allowing motion and lazy media to settle. Each route also passed the no-JS and reduced-motion checks. [ROOFING_ACCEPTANCE.md](../../product/ROOFING_ACCEPTANCE.md) contains a pass/fail and honest visual-quality note for every page.

| Route | Desktop | Phone |
|---|---|---|
| Home | [1440](screenshots/home-desktop-normal.jpg) | [390](screenshots/home-phone-normal.jpg) |
| Services | [1440](screenshots/services-desktop-normal.jpg) | [390](screenshots/services-phone-normal.jpg) |
| Roof installation | [1440](screenshots/services-roof-installation-desktop-normal.jpg) | [390](screenshots/services-roof-installation-phone-normal.jpg) |
| Roof repair | [1440](screenshots/services-roof-repair-desktop-normal.jpg) | [390](screenshots/services-roof-repair-phone-normal.jpg) |
| Roof replacement | [1440](screenshots/services-roof-replacement-desktop-normal.jpg) | [390](screenshots/services-roof-replacement-phone-normal.jpg) |
| Asphalt shingles | [1440](screenshots/services-asphalt-shingles-desktop-normal.jpg) | [390](screenshots/services-asphalt-shingles-phone-normal.jpg) |
| Metal roofing | [1440](screenshots/services-metal-roofing-desktop-normal.jpg) | [390](screenshots/services-metal-roofing-phone-normal.jpg) |
| Flat roofs | [1440](screenshots/services-flat-roofs-desktop-normal.jpg) | [390](screenshots/services-flat-roofs-phone-normal.jpg) |
| Roof maintenance | [1440](screenshots/services-roof-maintenance-desktop-normal.jpg) | [390](screenshots/services-roof-maintenance-phone-normal.jpg) |
| Gutters | [1440](screenshots/services-gutters-desktop-normal.jpg) | [390](screenshots/services-gutters-phone-normal.jpg) |
| Areas | [1440](screenshots/areas-desktop-normal.jpg) | [390](screenshots/areas-phone-normal.jpg) |
| Ventura | [1440](screenshots/areas-ventura-desktop-normal.jpg) | [390](screenshots/areas-ventura-phone-normal.jpg) |
| Oxnard | [1440](screenshots/areas-oxnard-desktop-normal.jpg) | [390](screenshots/areas-oxnard-phone-normal.jpg) |
| Camarillo | [1440](screenshots/areas-camarillo-desktop-normal.jpg) | [390](screenshots/areas-camarillo-phone-normal.jpg) |
| FAQ | [1440](screenshots/faq-desktop-normal.jpg) | [390](screenshots/faq-phone-normal.jpg) |
| About | [1440](screenshots/about-desktop-normal.jpg) | [390](screenshots/about-phone-normal.jpg) |
| Promotions | [1440](screenshots/promotions-desktop-normal.jpg) | [390](screenshots/promotions-phone-normal.jpg) |
| Financing | [1440](screenshots/financing-desktop-normal.jpg) | [390](screenshots/financing-phone-normal.jpg) |
| Contact | [1440](screenshots/contact-desktop-normal.jpg) | [390](screenshots/contact-phone-normal.jpg) |
| Legal | [1440](screenshots/legal-desktop-normal.jpg) | [390](screenshots/legal-phone-normal.jpg) |
| Roofing guide | [1440](screenshots/resources-before-you-decide-on-your-roof-desktop-normal.jpg) | [390](screenshots/resources-before-you-decide-on-your-roof-phone-normal.jpg) |
| Thank-you | [1440](screenshots/thank-you-desktop-normal.jpg) | [390](screenshots/thank-you-phone-normal.jpg) |

## Reuse, stubs and follow-ups

Reused the local AWS runtime, published Roofing fixture pattern, the existing city and #027A browser test patterns, installed trade art, the #024–#027 film catalog and player, and the 17-kit response snapshots. The #028G Blueprint change is specification text only. The shared light-header CSS correction is the only intended non-Roofing visual normalization; no other public HTML changed.

[The acceptance document](../../product/ROOFING_ACCEPTANCE.md) lists the poster-only #025 slot, other installed media states, and the outstanding K02, financing, review-provider, guide-delivery, CRM and K23 legal gates. Missing films did not block #028. Its per-page visual notes call out the QA fixture's absent owner portrait, repeated service/city layout rhythm, and a sparse-looking protected Promotions scroll panel in a still capture. The online inquiry uses JavaScript; the no-JS phone contact remains available.
