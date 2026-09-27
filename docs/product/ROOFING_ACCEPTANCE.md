# Roofing homeowner reference — #028

Local acceptance uses an isolated, published Roofing fixture at `/s/roofing-acceptance-028`. Its name, phone, lender link, and two submitted inquiries are test data, never production claims. The automated browser check is [`tests/roofing-acceptance.mjs`](../../tests/roofing-acceptance.mjs); its machine-readable results and desktop/phone captures are in [the #028 evidence folder](../build-evidence/028/README.md).

## Page verdict and visual quality

Each row is checked at 1440×900 and 390×844, in normal, no-JavaScript, and reduced-motion modes. A pass means the local route returned 200, one H1 rendered, assets resolved, the page did not overflow, the form had one submit where present, and measured CLS was at most 0.05. The visual note is a deliberate review, not an assertion that the page is finished in every possible contractor configuration.

| Page | Verdict | Visual quality and next action |
|---|---|---|
| Home | Pass | The service photos and copy now retain full contrast during reveal. Long-form Roofing chapters make the page substantial; their different layouts keep the sequence readable. |
| Services index | Pass | Image-led service cards read clearly. The card density at 390px needs continuing review as more services are added. |
| Roof installation | Pass | Service imagery is distinct. The common service-page rhythm is visible across the eight pages; a later art-direction pass could vary the middle chapter further. |
| Roof repair | Pass | The issue-first hero and repair imagery make the service clear. The three comparison cards in the lower page remain a dense reading moment on phone. |
| Roof replacement | Pass | Strong roof outcome image; middle-page composition shares the service system's rhythm. |
| Asphalt shingles | Pass | Material-specific visual and symptom copy are clear; lower-page comparison grid remains compact on phone. |
| Metal roofing | Pass | Metal roof image is recognizable and colors remain legible. Shared service-section geometry is the main repetition. |
| Flat roofs | Pass | Flat roof art is distinct; service FAQ is text-heavy but legible. |
| Roof maintenance | Pass | Maintenance path is clear; no fabricated service result is shown. |
| Gutters | Pass | Gutter art and copy stay service-specific; lower related-service links are compact. |
| Areas index | Pass | City navigation is clear; it is intentionally quieter than the conversion pages. |
| Ventura | Pass | Local context and city inquiry are present; the page uses the shared city geometry. |
| Oxnard | Pass | Local copy differs from Ventura; the same city geometry is still noticeable. |
| Camarillo | Pass | Local copy differs from both other cities; the repeated city layout is a later variation opportunity. |
| FAQ | Pass | Questions open natively with keyboard and no JS. The long list is functional but visually quieter than the home chapters. |
| About | Pass | Owner story is legible. The synthetic fixture has no owner portrait, so the page uses roofing fallback art; a real owner portrait is still needed for the intended human connection. |
| Promotions | Pass | The zero-offer state reads complete and does not invent urgency or a discount. The long dark scroll-media panel looks sparse in a full-page still; its protected #027 motion/player needs a separate visual review rather than a change inside #028. |
| Financing | Pass with a locally confirmed test link | The page shows only locally configured test terms. A real contractor's financing page remains hidden until that contractor supplies a confirmed program and link. Live lender integration is Not connected. |
| Contact | Pass | One clear submit action, phone option, and consent. Without JavaScript the phone link remains usable; online form submission uses the client handler. |
| Legal | Pass as a route | Legal copy is a K23 attorney-review placeholder; route acceptance does not approve the legal language. |
| Roofing guide | Pass | The guide page and request path are accessible. Automated email delivery remains Not connected. |
| Thank-you | Pass | The confirmation is shown after a real saved local inquiry; it makes no response-time promise. |

The footer's local links were followed and returned 200. Two distinct local inquiry records were saved from desktop and phone and each landed on the confirmation page. No customer data was used.

## Explicit stubs and external gates

- **#024 Financing ambient:** installed, finished local clip and poster; catalog slot Ready. Provider generation is not invoked by this ticket.
- **#025 Financing scroll:** poster-only slot remains Pending; its finished poster story may publish. This missing film does not block #028.
- **#026 Promotions ambient and #027 Promotions scroll:** installed, finished local clips and posters; both catalog slots Ready. The separate Financing chapter is also Ready. The older Phase 1 text in `NEEDS-KEYS.md` is superseded for those installed slots by the current catalog and Phase 2 evidence.
- **K02 / new creative production:** no credential or credit quote is available for additional generation. Stub mode and existing approved media remain in place; no Higgsfield credits were spent here.
- **Financing:** a confirmed merchant application link and contractor-supplied terms are required; no lender API is connected. The acceptance fixture exercises the configured-link state only.
- **Reviews:** published pages use real provider data only. The QA fixture does not invent reviews or ratings; review provider connection and source attribution remain gated by the contractor's actual settings and provider access.
- **CRM and inquiry delivery:** the local inquiry saves to the site record; external CRM connection and automated delivery are not claimed by this acceptance.
- **Guide delivery:** the local guide/request UI exists; outbound email delivery is Not connected.
- **Legal:** K23 attorney review is still required for the dedicated Legal page text. Legal wording remains on that page.

## Acceptance boundaries

The test fixture includes no actual contractor job, review, promotion, lender relationship or response-time promise. Published empty sections are hidden; the zero-offer Promotions state remains honest. Sample content is confined to preview and excluded from published proof. Reduced motion leaves the information readable without animation, and no-JS pages retain native reading, links, FAQ details and phone contact. The online inquiry itself requires JavaScript; its no-JS fallback is the tap-to-call link. This is a disclosed limitation for a future no-JS form-submission ticket.

The #028G Blueprint changes in `BUILD-BACKLOG.md` are specification text only. No Blueprint view was implemented.
