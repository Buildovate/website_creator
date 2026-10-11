# Ticket #014 — homeowner inquiry page context

Service, city and source-page context now survives submission even when no service is selected. The browser sends plain project notes and separate fields. The server formats bounded context into the existing inquiry message, so the current contractor inbox and newly created contact notes receive it without a database migration.

The source is a same-origin path belonging to the destination tenant. Query strings and fragments are excluded. Service-page context is checked against enabled, selected services in the published snapshot; published city records can supply city context to the shared contract. Project defaults come only from an owned published project. Visitor-entered project city, timing, roof details, financing preferences and promotion codes remain request details, not verified facts or offers. This ticket does not build a new city-page renderer.

Preview flags, preview URLs and preview referrers are rejected. Browser handlers also suppress draft/sample paths. Origin checks, required name/phone/contact consent, honeypot discard, project ownership and the three-per-phone/per-tenant daily limit remain enforced. Contact capture remains inquiry-only: no marketing opt-in, email/SMS send, or external CRM synchronization is added.

## Executed evidence

- [Full regression results](regressions/results.json): **43/43 commands**, including build, TypeScript and 41 test files. Individual logs are adjacent.
- [Focused page/inquiry tests](website-pages.txt): **30/30 tests**, including city-only input, context retention, query removal, mismatched/foreign source, draft/published isolation, a published foreign tenant's project rejection, consent/phone/type validation, honeypot, long-note bounds, rate limits and no marketing enrollment.
- [Desktop and phone browser results](browser-results.json): actual service-page form submissions saved under the expected tenant with service/city/source/timing/notes. Both authenticated previews have disabled buttons; a direct preview fetch returns 403 and adds no inquiry. No page errors.
- [Desktop saved form](desktop-saved.png), [phone saved form](mobile-saved.png), [desktop disabled preview](desktop-preview-disabled.png), [phone disabled preview](mobile-preview-disabled.png). Browser sizes: 1440×900 and 390×844; PNGs capture the form and its status.

The browser fixture uses a fictional business and test phone numbers. No real homeowner inquiry or external message was sent. Source attribution is visitor-supplied context, not authentication proof. Existing callers without explicit context retain their notes and receive the site's root path as the source fallback.

## Reproduction

From C:/Users/joe/website_creator, run node docs/build-evidence/014/full-regression.cjs. After the build, run node docs/build-evidence/014/browser-evidence.mjs. The latter creates an isolated in-memory local fixture on loopback port 8124, uses the supported local development session for preview QA, captures evidence, and closes its server. It loads no private environment files. Chrome/Playwright use the installed local runtime paths in the script.

Local commit only; no push or deployment. Next ticket: #015, not started.
