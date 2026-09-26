# #017 — Expose honest financing connection states

Completed locally on 2026-09-26 on feature/local-environment-setup. **Higgsfield credits used: 0.** No deployment, push, staging access, live lender/vendor calls or credential access. All figures shown in QA captures belong to disposable, clearly named QA TEST FIXTURE records.

## Specification, current rules and reused work

Read root BUILD-BACKLOG.md #017, Pack 1 sections B and C in full, UX-RULES.md, and the sites/workspace/engagement guidance. Existing code already had merchant application links, enabled/confirmed gates, service financing programs, payment math, one/two/three lender handoffs, draft/publication isolation, private noindex previews, role enforcement and mobile save actions. These were reused rather than replaced.

Current user rules override the older pack in four places: the registry now supports **Hearth, Enhancify, Service Finance, Wisetack and Sunbit**, plus Other/None; unavailable financing is hidden on published sites rather than showing a “coming soon” public state; sample payments and arbitrary example-term controls are preview only; full legal wording stays on /legal, with APR and term adjacent to every payment. No guessed APRs, lender fees, approval rates, pre-qualification claims, urgency, video generation or broad Pack B/C redesign was introduced.

## Built

- A shared typed lender adapter owns the six registry entries and distinguishes **Not connected** API status from **Application link ready**. It reads no credentials and performs no external request. Client-supplied Live/Connected/approved flags cannot turn it into a connection. Other requires a supplied name before its link can be confirmed; None preserves setup while hiding public financing.
- Admin and contractor Questionnaire settings show the same clear connection badges, incomplete-link status, publication readiness, five named lender choices, Other and None. Lender selection can be saved before any link or terms exist. Confirmation means the contractor confirms its merchant relationship and business-issued link; it is never API verification. Approved HTTPS links reject embedded credentials and unsafe schemes.
- Financing.requested retains page intent separately from the derived financing.enabled visibility flag. The Questionnaire writes both intent and its master choice. A published financing page needs a selected confirmed link and at least one enabled, confirmed contractor-supplied program with valid APR and term. None, absent/unconfirmed terms or an unconfirmed link hides financing. Existing shared navigation/sitemap/section gates consume the derived flag; no homepage template was edited.
- The public Financing calculator selects a configured program and locks APR/term to it. It asks for the homeowner's written project amount, calculates only from the selected supplied terms, clears stale output on edits, and keeps APR/term beside the payment. Even an altered APR input is reset to that program before calculation. The existing collapsed lender handoff supports one through five named providers, with no matched-offer or approval claim. No input is sent to a lender.
- Preview retains a clearly marked **Sample** payment per $1,000 at 7.99% APR / 60 months, sample comparison controls, noindex metadata and suppressed application links. Published markup includes neither those sample values nor the sample controls. Preview configuration is not saved into the contractor's programs.
- Existing service financing comparisons use the supplied programs and lender names, including Other. Missing financing hides the entire section; preview sample blocks remain tagged. Full disclosure text was removed from those public blocks and remains on the Legal page. Published terms and the no-JavaScript handoff remain readable; reduced motion retains content.
- Setup states cover empty/not connected, partial link-only setup, saving, saved draft, error with retained answers, offline/retry, None and supplied-term readiness. Phone controls meet 44px targets, retain readable input text and sticky Save/Publish actions, and avoid horizontal page scrolling. An offline save now gives a plain reconnect/retry instruction.

The “connected-link-and-terms-fixture” captures mean a **confirmed merchant link plus contractor-supplied terms**, not an API connection. They deliberately continue to show **Not connected**. No fake live-connection state was added just for a screenshot. This completes #017's explicitly scoped stub/link-state ticket; live connections remain blocked on documented provider access.

## Verification

| Check | Result |
|---|---|
| Build / typecheck | Pass |
| Regression scripts | 58 passed (57 existing plus the new financing-state suite) |
| New #017 server/configuration checks | 74 passed |
| All browser suites | 10 passed (9 existing plus the new financing-state suite) |
| New #017 browser checks | 77 passed; zero browser exceptions |
| Platform mobile inventory | 204 desktop/phone states passed |
| Template asset integrity | 604 referenced files / 17 kits passed |
| Local route verification | Six HTTP 200 responses; unconnected public Financing correctly returns 404 |
| New captures | 40 desktop/phone screenshots |

See checks.json, final-checks.json, existing-browser-checks.json, regression-results.json, browser-results.json, platform-mobile-audit.json, route-check.json and the individual logs. Regression coverage includes all lender choices, Other validation, None, missing/disabled/unconfirmed terms and links, unsafe URLs, forged connection flags, sample/noindex boundaries, public service/homepage hiding, one/two/three/five lender links, locked supplied APR/term, publication isolation and withdrawal. Browser checks exercise actual admin/contractor screens, save/error/offline recovery, preview and published payment blocks, no-JavaScript content and phone targets/overflow. The existing #016 server and browser suites pass unchanged.

Four older financing regression files were updated only where their fixtures/assertions encoded superseded rules: a bare link no longer exposes a public financing page, sample controls are not public, full legal text is not on a service card, and the new saved intent flag is cleared with a page-disable request. Those tests still exercise their existing publication, math, role, social/footer and inquiry paths. All other regression scripts were left unchanged.

Vite was restarted with exactly: node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173. Local /s/finance-017-supplied/financing, both financing preview views, both /services/roof-repair pages and the workspace return 200. /s/finance-017-empty/financing returns the expected 404 instead of advertising unavailable financing. These are local disposable fixtures, not deployed sites.

## Screenshots

Desktop: 1440×900. Phone: 390×844. Settings captures show the relevant viewport and sticky controls; public/preview captures are full-page PNGs. Each file is a real independent capture. Final phone connection states were visually reviewed for badges, copy, target sizes and the save dock.

- [settings-admin-not-connected-desktop.png](settings-admin-not-connected-desktop.png)
- [settings-contractor-not-connected-desktop.png](settings-contractor-not-connected-desktop.png)
- [settings-partial-link-desktop.png](settings-partial-link-desktop.png)
- [settings-saving-desktop.png](settings-saving-desktop.png)
- [settings-saved-link-only-desktop.png](settings-saved-link-only-desktop.png)
- [settings-error-desktop.png](settings-error-desktop.png)
- [settings-offline-desktop.png](settings-offline-desktop.png)
- [settings-none-desktop.png](settings-none-desktop.png)
- [settings-supplied-program-desktop.png](settings-supplied-program-desktop.png)
- [settings-other-lender-desktop.png](settings-other-lender-desktop.png)
- [settings-connected-link-and-terms-fixture-desktop.png](settings-connected-link-and-terms-fixture-desktop.png)
- [preview-not-connected-desktop.png](preview-not-connected-desktop.png)
- [preview-supplied-terms-desktop.png](preview-supplied-terms-desktop.png)
- [published-not-connected-service-desktop.png](published-not-connected-service-desktop.png)
- [published-supplied-terms-empty-desktop.png](published-supplied-terms-empty-desktop.png)
- [published-supplied-payment-desktop.png](published-supplied-payment-desktop.png)
- [published-application-handoff-desktop.png](published-application-handoff-desktop.png)
- [published-service-terms-desktop.png](published-service-terms-desktop.png)
- [preview-service-terms-desktop.png](preview-service-terms-desktop.png)
- [published-no-js-desktop.png](published-no-js-desktop.png)
- [settings-admin-not-connected-phone.png](settings-admin-not-connected-phone.png)
- [settings-contractor-not-connected-phone.png](settings-contractor-not-connected-phone.png)
- [settings-partial-link-phone.png](settings-partial-link-phone.png)
- [settings-saving-phone.png](settings-saving-phone.png)
- [settings-saved-link-only-phone.png](settings-saved-link-only-phone.png)
- [settings-error-phone.png](settings-error-phone.png)
- [settings-offline-phone.png](settings-offline-phone.png)
- [settings-none-phone.png](settings-none-phone.png)
- [settings-supplied-program-phone.png](settings-supplied-program-phone.png)
- [settings-other-lender-phone.png](settings-other-lender-phone.png)
- [settings-connected-link-and-terms-fixture-phone.png](settings-connected-link-and-terms-fixture-phone.png)
- [preview-not-connected-phone.png](preview-not-connected-phone.png)
- [preview-supplied-terms-phone.png](preview-supplied-terms-phone.png)
- [published-not-connected-service-phone.png](published-not-connected-service-phone.png)
- [published-supplied-terms-empty-phone.png](published-supplied-terms-empty-phone.png)
- [published-supplied-payment-phone.png](published-supplied-payment-phone.png)
- [published-application-handoff-phone.png](published-application-handoff-phone.png)
- [published-service-terms-phone.png](published-service-terms-phone.png)
- [preview-service-terms-phone.png](preview-service-terms-phone.png)
- [published-no-js-phone.png](published-no-js-phone.png)

## Preservation, access gates and limits

1202 existing evidence files were backed up before tests and restored afterward. All 262 unrelated modified/untracked file hashes match the starting inventory. New files regenerated in older evidence folders were moved under this ticket's regenerated-extra folder. See preservation.json. The homepage renderer, drone assets, Expenses & Margin source/history/tests, and #016 quiz server/client behavior remain unchanged.

NEEDS-KEYS.md retains Service Finance K05, Wisetack K06 and Sunbit K07 and adds explicit missing-access notes for Hearth, Enhancify and Other. Credential field names, provider API capabilities and sandbox contracts remain TBD rather than guessed. No secrets were read or stored. Real connections/underwriting cannot be completed without those future authorized integrations. No other #017 acceptance work remains; no other ticket was started. Next numbered ticket: #018.
