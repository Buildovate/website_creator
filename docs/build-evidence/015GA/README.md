# #015GA — Expenses & Margin visual and usability polish

Completed locally on 2026-09-26, branch feature/local-environment-setup, based on #015G (251dab8). #015GA was free; no alternate suffix was used. No push, deployment, staging access, vendor connection or paid usage.

## Dashboard changes

- Four KPI cards show reconciled Revenue, recorded Operating cost, Operating margin with its percentage and 70% target, and Development spent through the selected end date. Margin has the strongest emphasis. Monthly sparklines use recorded observations only; missing prices break the line and a single month renders a single dot.
- Monthly Operating/Development bars, a priced-cost vendor donut, and AI-model cost bars use the existing ledger and summary. Unknown expenses never become zero-valued chart observations. A zero-cost or unpriced donut has an empty state; net vendor refunds switch to signed bars. Partial charts say known/priced amounts only. Empty, partial, loading, error/retry, offline and full states retain the original truthful accounting behavior.
- Consistent amber status badges, vendor Add rate actions, source-specific Set up sheets, editable product cost mappings, and reviewed CSV/receipt paths. No Set up action connects an account or spends money.
- The phone sidebar collapses behind a native Menu dialog. Pills scroll within their own bar, with explicit focus scrolling for every tab; the page itself does not scroll horizontally. Dense desktop tables keep vendor names as text links and money aligned right. Phone tables become labeled cards.
- Drill-downs and editors open in a desktop side panel and a phone full-screen sheet. Native modal focus trapping, Escape, focus restoration, scrollable content, sticky Save and at least 44px controls are retained. Closing or switching views restores navigation; saving refreshes the dashboard.
- Existing platform fonts and blue palette are used. Selected tabs retain readable contrast when hovered and inside detached panels. Reduced motion has no chart animation.

## Approved catalog prices

| Plan | Monthly | Annual prepay | Setup | Included social pack | Cost mapping |
|---|---:|---:|---:|---|---|
| Website | $50 | $500 | $0 | — | Cost mapping needed |
| Growth | $279 | $2,790 | $0 | 12 posts/month | Metricool social-12 × 1 monthly pack |
| All-in | $449 | $4,490 | $0 | 20 posts/month | Metricool social-20 × 1 monthly pack |

Annual prepay equals ten monthly payments (two months free). One-time, admin-only catalog seeding fills missing plan data in an existing #015G installation and preserves previously supplied prices/rates and later admin edits. All other product prices remain **Price needed**; every seeded vendor rate, including Metricool pack rates, remains **Rate needed**. These are internal catalog records, not receipts, billing entitlements or public checkout changes. #015H remains queued.

Accounting formulas, access rules, usage hooks, import logic, and the 318 real Higgsfield image records / 636 credits were not changed. The protected #015G regression files are byte-for-byte unchanged from the starting commit. The only server changes are the expressly authorized catalog fields and idempotent plan seeding behind the existing admin/Origin guard.

## Verification

| Check | Result |
|---|---|
| Build / typecheck | Pass |
| Regression scripts | 56 passed, including 34 new catalog/chart checks |
| Unchanged #015G accounting + metering | 82 + 15 checks passed |
| Unchanged #015G browser suite | 93 checks passed; zero browser exceptions |
| #015GA browser suite | 86 checks passed; 13 screenshots; zero browser exceptions |
| Platform mobile inventory | 204 phone/desktop states passed |
| Other existing browser suites | 6 passed (callbacks, contact linkage, contacts, platform cleanup, trade enablement, trade visuals) |
| Template asset integrity | 604 referenced files / 17 kits passed |
| Restarted Vite | /admin/expenses returned HTTP 200 |

See checks.json, final-checks.json, browser-results.json, platform-mobile-audit.json and the copied #015G/other suite results. The platform inventory now opens the collapsed menu before navigating, and recognizes the explicitly requested pill bar as an intentional scroll container. Its page-overflow, target-size, input-size and workflow assertions remain; the new suite verifies all seven pills are keyboard-reachable without page overflow. Two intermediate trade-browser starts coincided with a build refresh; both passed after rerunning without a concurrent build. Final results are recorded separately from intermediate attempts.

Vite was restarted with exactly: node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173. This is the local Vite admin preview fixture. Server-enforced contractor denial is still covered by the unchanged #015G suites.

## Screenshots

Desktop captures use a 1440×900 viewport; phone captures use 390×844. Dashboard/tab captures are full-page PNGs; open menu and drill-down captures show the viewport so the sheet's actual size is clear.

- [overview-empty-desktop.png](overview-empty-desktop.png)
- [overview-empty-phone.png](overview-empty-phone.png)
- [menu-open-phone.png](menu-open-phone.png)
- [overview-qa-desktop.png](overview-qa-desktop.png)
- [products-desktop.png](products-desktop.png)
- [vendors-desktop.png](vendors-desktop.png)
- [models-desktop.png](models-desktop.png)
- [drill-down-desktop.png](drill-down-desktop.png)
- [overview-qa-phone.png](overview-qa-phone.png)
- [products-phone.png](products-phone.png)
- [vendors-phone.png](vendors-phone.png)
- [models-phone.png](models-phone.png)
- [drill-down-phone.png](drill-down-phone.png)

The populated screenshots carry **QA TEST FIXTURE** labels and use a disposable, in-memory database. Test-only receipts, expenses and a test-only Higgsfield dollar rate exercise charts; they are never written to real history or the normal preview database. Empty screenshots contain no fabricated plots. Screenshots were visually reviewed, including menu and selected-tab contrast and full-screen phone sheets.

## Preservation and limits

Backed up and restored 977 prior evidence files; all 262 unrelated dirty/untracked file hashes match the starting inventory. Any newly generated old-suite screenshots were moved under regenerated-extra in this ticket. See preservation.json.

No UX-rule conflict required a policy change: the four requested KPI cards keep Operating margin as the primary number. All requested local work is complete. Live billing/import connectors remain **Not connected**, unknown rates remain **Rate needed**, and incomplete costs still suppress margin/payback where required. No costs were researched, invented or charged.
