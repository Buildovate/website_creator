# #022 — Local Roofing ebook preview and consent stub

Completed locally on 2026-09-26. **0 Higgsfield credits.** No live email, SMS, CRM, storage or AI provider was connected or called. Nothing was sent to anyone. No push, deployment or staging access. #023 was not started.

## Built

**Before you decide on your roof** is an eight-page homeowner guide: a photographic cover, contents and six practical chapters about the existing roof, safe observations, leak questions, repair boundaries, comparing proposals and preparing for a visit. The web page shows the cover, contents and two readable opening chapters before any request. Its typography, forest-green chapter band and installed Roofing photograph reuse the accepted visual direction without changing #020.

The complete local PDF is gated by an unticked permission checkbox. The success state offers exactly one next action: download the guide in this browser. It never says to check an inbox. **Delivery not connected** is visible before and after saving; emailSent, marketingConsent and smsConsent remain false. Phone is optional and does not authorize calls or texts.

Existing Business settings now contains the preview link, enable choice and explicit review choice for this revision. Both choices are required in the published snapshot; draft saves do not publish. The preview is authenticated, noindex and visibly Sample. Its labeled PDF/receipts are isolated from the approved published edition. The published edition has no Sample text, and an absent/unreviewed/disabled guide has no public guide content or form. This local stub keeps its guide routes noindex, including the published-fixture view.

## Reuse audit

| Earlier capability | Reused / change |
| --- | --- |
| Public inquiries and source-page attribution | Existing inquiries table, inquiryMessage validator and tenant inbox; one inquiry per successful receipt; no second lead inbox |
| Contact capture | Existing captureContact writes the local contact record for a published request; preview requests do not create contacts; no remote CRM call |
| Consent and spam boundaries | Existing exact-origin, bounded request body, honeypot and boolean permission patterns; optional email-focused guide fields added without modifying the homeowner inquiry endpoint |
| #016 quiz receipts | Reused opaque HttpOnly same-site browser identity, hashed scope, immutable evidence, unique SQL scope and atomic receipt/inquiry/audit transaction pattern; ebook_receipts is purpose-specific evidence linked to the existing inquiry, not a parallel lead system |
| #016 persisted quota storage | Reused promotion_unlock_limits with ebook-prefixed hash keys, keeping quiz code and behavior unchanged; tenant cap 100 per 15-minute bucket, browser retry cap 8, email cap 3 per UTC-day bucket |
| Publication and tenant access | Existing access checks and draft/published snapshots; preview access is checked on requests and every private download; a receipt URL alone grants nothing |
| Business screen | Added fields to its existing settings form and save flow; existing mobile menu, sticky Save action and role checks retained |
| Installed visual assets | Existing Roofing flashing photo and DM Sans/Barlow fonts; no generated artwork, hero/drone change or new trade template |

## Receipt and download contract

GET /s/:slug/resources/before-you-decide-on-your-roof establishes an anonymous browser cookie. POST /api/public/:slug/ebook validates explicit consent and saves its **server-owned wording, purpose, timestamp, email, optional phone, guide revision, mode and source page**. The inquiry contains the consent wording/time and receipt reference. Client-provided consent wording or timestamps are not trusted. Preview requests require ?preview=1 and tenant access and are marked as local Sample requests in the inbox.

The unique tenant/revision/mode/browser scope makes retries and concurrent duplicate submits return one saved receipt and one inbox entry. Changed contact payloads cannot overwrite that receipt. An idempotent replay succeeds even after the new-request quota is exhausted. Cookies are hashed before storage; no forwarding/IP header is trusted. The download checks current publication, receipt ownership and the same browser identity, plus tenant access for preview. Removing the guide from the published snapshot revokes access. A new content or consent revision must change the guide revision and receive review again.

Both PDFs are private server assets under src/ebook, not publicly served static files. They have selectable text, eight checked pages and no invented business facts, estimates, measurements or guarantees. The web cover uses the current business name; the bundled PDF is the neutral Roofing editorial edition, not a claim of per-customer generated artwork. The original Python builder is scripts/build-ebook.py; bundled reportlab/Pillow/pypdf and Poppler produced and checked the PDFs.

| PDF | Pages | Bytes | Publication rule |
| --- | --- | --- | --- |
| src/ebook/guide.pdf | 8 | 2621810 | No Sample content; approved published guide and consent receipt required |
| src/ebook/sample-guide.pdf | 8 | 2622115 | Sample on every page; private preview receipt and access required |

## Designed states and evidence

Desktop viewport **1440×900**; phone **390×844**. Published/preview/reduced/no-JS captures include the whole page. Form states are full-section captures so the status, delivery state and action remain visible together. Business settings captures show the new controls inside the existing screen. All data is an explicitly fictional local QA fixture.

| State | Evidence pair / behavior |
| --- | --- |
| Readable guide | published-desktop.png / published-phone.png |
| Sample preview | preview-desktop.png / preview-phone.png |
| Empty / unavailable | empty-desktop.png / empty-phone.png; public 404 without an empty guide panel |
| Loading | loading-desktop.png / loading-phone.png; real delayed local request, aria-busy, duplicate-click guard |
| Validation error | validation-error-desktop.png / validation-error-phone.png; first invalid field focused, checkbox remains unticked |
| Save error | save-error-desktop.png / save-error-phone.png; explicitly injected local QA 503, retained fields and retry |
| Rate limited | rate-limited-desktop.png / rate-limited-phone.png; persisted cap, HTTP 429, Retry-After, no unlock |
| Success | success-desktop.png / success-phone.png; real local consent receipt, download action and reading-copy design |
| Already requested | already-requested-desktop.png / already-requested-phone.png; server receipt recovered on reload |
| Offline | offline-desktop.png / offline-phone.png; browser offline mode, retained form, no send |
| Not connected | not-connected-desktop.png / not-connected-phone.png; honest delivery status |
| Reduced motion | reduced-desktop.png / reduced-phone.png; completely static |
| No JavaScript | no-js-desktop.png / no-js-phone.png; readable pages and working native consent POST/download |
| Contractor settings | business-settings-desktop.png / business-settings-phone.png; real draft save checked |

The layout reserves image and feedback geometry, and the request panel holds its height during saving/error/success to avoid moving surrounding content. It has no entrance animation. Keyboard skip/read links, visible focus and native input validation work; touch targets and text remain usable at 390px. No remote font, tracking, vendor or PDF-storage request is made.

## Spec precedence / intentionally disconnected

The selected root ticket is one local Roofing ebook, not Pack I's complete multi-trade generation/email program. Current instructions override new generated covers, automatic email, “Check your inbox,” automatic marketing enrollment and SMS. There is no exit-intent popup or change to protected homepage/story components; the dedicated resource route is the Pack I placement used here. No prices, urgency or warranty promises were introduced. Functional permission wording stays with the required checkbox; other privacy information links to /legal. Private preview requests are explicitly permitted for testing this local stub, saved separately and never represented as published delivery.

Real SendGrid delivery, contractor subusers, domain authentication, reply-to/template configuration, suppression, event verification, optional double opt-in, remote CRM/storage and per-customer generation remain **Not connected**. Required K17/K18 settings and related future gates are in NEEDS-KEYS.md. Local guide/read/download/consent acceptance is complete; no live delivery is claimed.

## Verification

- Build and typecheck passed.
- **63 existing/new regression scripts** passed, including **62 #022 server checks** for consent, exact evidence, idempotency, quotas, publication boundaries, isolation and no outbound calls.
- **15 browser suites** passed, including **85 #022 assertions**, native no-JS submission and concurrent requests committing only one receipt.
- Platform mobile: **208 states**, no horizontal overflow, undersized targets/inputs or browser errors. Joe's earlier physical-iPhone camera check remains separate and pending; this ticket does not claim it.
- Template asset integrity: **605 references across 17 kits**, passed.
- **0 measured initial CLS** on desktop and phone; no #022 browser exceptions or external requests. All guide motion is static.
- The first new browser settings test used the hidden phone selector on desktop. It was corrected to use actual desktop tabs / phone select and rerun; initial result and successful retry are preserved in existing-browser-checks.json, final-checks.json and ebook-browser-retry.log. No existing test was weakened.
- Vite restarted with node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173; **7 affected URL/request checks returned 200**, including an actual consent-gated PDF. See route-check.json.
- All eight PDF pages and the Sample cover were rendered and visually checked; see pdf-checks.json and pdf-page-*.png.
- Restored **1876** older evidence files and verified **262** unrelated file hashes unchanged. Protected #016–#021 modules, Expenses, templates, hero and drone assets remain unchanged. See preservation.json.

Local guide: http://127.0.0.1:5173/s/roofing-guide-022/resources/before-you-decide-on-your-roof

## Screenshot files

- [already-requested-desktop.png](already-requested-desktop.png)
- [already-requested-phone.png](already-requested-phone.png)
- [business-settings-desktop.png](business-settings-desktop.png)
- [business-settings-phone.png](business-settings-phone.png)
- [empty-desktop.png](empty-desktop.png)
- [empty-phone.png](empty-phone.png)
- [loading-desktop.png](loading-desktop.png)
- [loading-phone.png](loading-phone.png)
- [no-js-desktop.png](no-js-desktop.png)
- [no-js-phone.png](no-js-phone.png)
- [not-connected-desktop.png](not-connected-desktop.png)
- [not-connected-phone.png](not-connected-phone.png)
- [offline-desktop.png](offline-desktop.png)
- [offline-phone.png](offline-phone.png)
- [pdf-page-1.png](pdf-page-1.png)
- [pdf-page-2.png](pdf-page-2.png)
- [pdf-page-3.png](pdf-page-3.png)
- [pdf-page-4.png](pdf-page-4.png)
- [pdf-page-5.png](pdf-page-5.png)
- [pdf-page-6.png](pdf-page-6.png)
- [pdf-page-7.png](pdf-page-7.png)
- [pdf-page-8.png](pdf-page-8.png)
- [pdf-sample-cover.png](pdf-sample-cover.png)
- [preview-desktop.png](preview-desktop.png)
- [preview-phone.png](preview-phone.png)
- [published-desktop.png](published-desktop.png)
- [published-phone.png](published-phone.png)
- [rate-limited-desktop.png](rate-limited-desktop.png)
- [rate-limited-phone.png](rate-limited-phone.png)
- [reduced-desktop.png](reduced-desktop.png)
- [reduced-phone.png](reduced-phone.png)
- [save-error-desktop.png](save-error-desktop.png)
- [save-error-phone.png](save-error-phone.png)
- [success-desktop.png](success-desktop.png)
- [success-phone.png](success-phone.png)
- [validation-error-desktop.png](validation-error-desktop.png)
- [validation-error-phone.png](validation-error-phone.png)
