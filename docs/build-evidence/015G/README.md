# #015G — Admin Expenses & Margin

Completed locally on 2026-09-26 on feature/local-environment-setup. #015G was available; no alternate suffix was needed. This implements the local dashboard and the explicitly requested Not connected states. It does **not** claim live vendor/bank/email integration. No vendor API, billing account, paid credit, staging environment, push or deployment was used.

## What was built

- **Admin-only Revenue screen:** /admin/expenses, with server-enforced admin access on all /api/admin/expenses routes, receipts and exports. Contractors and operators are denied. Existing session/Origin/CSRF protections apply. Actions and reads are audited; edits carry optimistic versions.
- **Vendor registry:** OpenAI API, Higgsfield, AWS, SendGrid, Twilio, Google Places, domain registrar, Codex/ChatGPT and Metricool. Admins add/edit arbitrary vendors and categories (including Attorney), billing types, effective-dated rate lines, balances and allowances. Blank rates say **Rate needed**. No code edit is required.
- **AI costs:** existing connected OpenAI and Places calls pass through a metering wrapper; it makes no additional request. Actual returned model, effort, input/output units and available site/product attribution are kept. Model-specific rate lines can use model:input / model:output IDs. There is a tested self-meter hook for future Higgsfield integration; disconnected/preview events post nothing. Provider billing imports remain separate and Not connected.
- **Products and profits:** editable six-product starting catalog with no invented selling prices, vendor-cost mappings and bought allowances. Catalog unit economics are labeled separately from actual profit. Fractional-cent token costs accumulate before display rounding. Actual per-product, per-site and business margins use posted operating expenses and administrator-reconciled receipts against existing sales documents. Signed proposals, commission credits and CRM Paid labels are not revenue. One-time generation is separate from running cost. Refunds are negative entries.
- **One ledger:** manual entries, private PDF/PNG/JPEG receipts, reviewed CSV history/bank/receipt exports, pending approval, vendor matching rules, duplicate-safe source IDs, reversible matching and monthly reconciliation. Pending/matched/failed/declined transactions do not inflate posted expense. A bank charge can link to its already-recorded connector/bill/receipt expense. Unmatched vendors remain Needs review and cannot be approved until assigned.
- **Recurring bills:** monthly/yearly calendar periods, month-end anchors, deterministic IDs and catch-up. Normal Node startup and hourly maintenance post due configured bills; dashboard access and Post due bills also catch up. Operating bills allocate costs evenly across published sites at posting; Development bills never enter site running cost. Fixed bills are shown separately from direct costs.
- **Development:** totals by month, phase, ticket and vendor, scoped drill-downs, CSV backfill and export, cumulative operating margin, break-even and 6/12/24-month recovery calculation. Unknown Development rates or missing/nonpositive actual margin suppress payback. Unknown Operating costs suppress operating margin. Development never reduces operating margin.
- **States and phone layout:** seven views, month-to-date/custom ranges, dense desktop rows and phone cards, 44px controls, visible focus, native modal focus traps, sticky Save and retained forms on errors. Loading, empty, partial, full, error, retry and offline states have evidence. No UX-rule conflict required an override. Phone cards follow the explicit mobile acceptance rule.

## Real Higgsfield history

Initialization imports **318 individual generations, 636 credits**, once per provider job ID:

| Evidence | Images | Credits | Recorded day |
|---|---:|---:|---|
| #004W-v4 image-jobs/results + README/replacement record | 285 | 570 | 2026-09-26 |
| #170 image-results + credits.json | 33 | 66 | 2026-09-26 |

The rejected privacy-fencing image still consumed credits; it and the replacement are both retained. The accepted results file had overwritten that index, so the original job ID comes from image-jobs.json. Dates follow provider result filenames; the rejected original uses the documented batch day and explicitly records that provenance (no invented exact timestamp). Stored provider model is nano_banana_flash; requested model nano_banana_2 is retained separately. Each generation used the documented 2 credits. **USD per credit remains Rate needed.** Repeated initialization neither duplicates history nor resets administrator rates. The imported rows are bundled in src/expenses-history.json, with source references per row. Vite was initialized with this real history only; no QA dollar fixtures were added to Vite.

## Verification

| Check | Result |
|---|---|
| Build / typecheck | Pass / pass |
| Regression scripts | 55 passed (58 commands including build, typecheck and asset integrity) |
| New accounting regressions | 82 passed |
| New metering / scheduling / encryption checks | 15 passed; mocked responses only |
| New browser suite | 93 checks, 27 captures, 0 browser exceptions |
| Existing platform mobile suite | 204 states, no layout failures |
| Other existing browser suites | All 6 passed: contacts, callbacks, linkage, platform cleanup, trade enablement, trade visuals |
| Video release regression | All 24 scroll films decoded fully; installed ffprobe added to the test process PATH |
| Restarted Vite | /admin/expenses returns 200; historical initialization confirms 318 / 636 |
| Actual session-authenticated HTTP adapter | Admin page/API 200; contractor page/API 403; contractor menu absent |

See checks.json, regression-results.json, meter-results.json, browser-results.json, platform-mobile-audit.json, existing-browser-checks.json and route-checks.json. The Vite configuration is an existing always-admin local fixture; contractor denial is verified through the real HTTP auth adapter, not by pretending Vite impersonates a contractor. The first trade-photo browser run overlapped a rebuild; the stable rerun passed all 173 checks. No public template assertion was weakened.

## Screenshots

Desktop captures use 1440×900; phone captures use 390×844. Full-page PNGs. All dollar amounts in the disposable browser database are explicitly **test-only fixtures**, not seeded business data; the full-data/payback captures include an on-screen QA label. Initial/partial views preserve the actual unknown dollar rates. The fixture database and receipts are destroyed at the end of the run.

- [empty-desktop.png](empty-desktop.png)
- [empty-phone.png](empty-phone.png)
- [vendor-editor-phone.png](vendor-editor-phone.png)
- [overview-desktop.png](overview-desktop.png)
- [vendors-desktop.png](vendors-desktop.png)
- [models-desktop.png](models-desktop.png)
- [products-desktop.png](products-desktop.png)
- [development-desktop.png](development-desktop.png)
- [connections-desktop.png](connections-desktop.png)
- [ledger-receipt-desktop.png](ledger-receipt-desktop.png)
- [empty-period-desktop.png](empty-period-desktop.png)
- [error-desktop.png](error-desktop.png)
- [overview-phone.png](overview-phone.png)
- [vendors-phone.png](vendors-phone.png)
- [models-phone.png](models-phone.png)
- [products-phone.png](products-phone.png)
- [development-phone.png](development-phone.png)
- [connections-phone.png](connections-phone.png)
- [ledger-receipt-phone.png](ledger-receipt-phone.png)
- [empty-period-phone.png](empty-period-phone.png)
- [error-phone.png](error-phone.png)
- [full-overview-desktop.png](full-overview-desktop.png)
- [development-payback-desktop.png](development-payback-desktop.png)
- [full-overview-phone.png](full-overview-phone.png)
- [development-payback-phone.png](development-payback-phone.png)
- [loading-phone.png](loading-phone.png)
- [offline-phone.png](offline-phone.png)

The existing platform suite also discovered the new sidebar screen, bringing its inventory to 204 states. Its additional captures are [platform-expenses-desktop.png](platform-expenses-desktop.png) and [platform-expenses-phone.png](platform-expenses-phone.png).

## Still Rate needed / Not connected

- All nine seeded vendors start with unknown dollar rates; catalog prices and cost mappings require administrator input. Actual allowance data and current live balances are not supplied. The Higgsfield 2,513.8 balance is a dated 2026-09-26 observation, not a live read.
- AWS Cost Explorer, Twilio billing and OpenAI organization billing sync, Plaid, and inbound receipt email/parsing are **Not connected**. Sync has a truthful no-network response. No inbox address is invented. Before live enablement, provider transports, pagination, webhook validation and AWS workload/site attribution require their reviewed contracts and approved access. Manual/CSV/receipt review is available now.
- Server-only credential storage is implemented and tested with AES-GCM. EXPENSE_VAULT_KEY must be base64 for 32 random bytes in the approved secret store; it has no default. Without it the credential endpoint refuses storage. No real key was read, saved or returned, and no live connector consumes the encrypted records yet.
- Estimator, SMS, visualizer allowance metering and estimator gate conversion remain Not connected until those product integrations exist. No automatic overage charge is made.
- Historical recurring allocations use the published-site roster at posting; the application has no historical active-site roster to reconstruct. The UI states this limitation. Payback uses the selected period's recorded margin with a minimum one-month denominator; it assumes no growth. Dollar amounts are USD; no currency conversion is invented.
- Receipt upload accepts PDF/PNG/JPEG up to 5 MB. Browser injection tests upload/privacy; physical iPhone camera or HEIC conversion was not certified in this ticket. The camera picker is available; existing #015A manual phone check remains separate.

These live gates are listed in NEEDS-KEYS.md. No other ticket was started. The backlog header still queues #015F; it was not started. #015H also remains unbuilt.

## Preservation

Restored **869 backed-up evidence files** and verified all **262 pre-existing changed/untracked files** byte-for-byte. See preservation.json. Public trade templates, homepage markup, drone assets and controllers are unchanged. The only public-provider code edits are server-side metering wrappers; existing template/media regressions pass. All real changes are in C:/Users/joe/website_creator; scratch/backup files stay outside the commit.
