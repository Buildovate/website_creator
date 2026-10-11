# #015E — Contact-to-website linkage and appointment prep

Fictional roofing data in local Chrome at 390×844 and 1440×900, captured 2026-09-25. The v11 recovery tree was read only. Local commit only; no push or deployment.

## Verification

- [Full regression results](regressions/results.json): **51/51 passed**, including build, typecheck, the #015A platform mobile inventory, and two new #015E server/browser tests. [Individual logs](regressions/).
- [Platform mobile audit](platform-mobile-audit.json): **101 phone + 101 desktop states**, zero layout failures and zero browser errors.
- [#015E browser results](browser-results.json): linked customer in Websites and Customers; phone card tap and checkbox; visible actions; More menu focus, Escape and bounds; appointment preparation; duration/interests; month/week today highlight; 390px Calendar controls on one row.
- Server test covers admin-only linking, operator tenant access, audit records, multiple contacts on one website, stale-link conflict, preservation on contact edit, private contact-prefilled draft, appointment interests/duration/reminder preferences, design task creation and cancellation, stage shortcuts, and invalid duration.
- The separate #015A physical iPhone/Safari camera check remains pending.

## Screenshots

| View | Phone 390×844 | Desktop 1440×900 |
| --- | --- | --- |
| Websites linked customer | [Phone](phone-website-customer-link.png) | [Desktop](desktop-website-customer-link.png) |
| Customer Portal action | [Phone](phone-customer-portal-action.png) | [Desktop](desktop-customer-portal-action.png) |
| Linked contact detail | [Phone](phone-linked-contact-detail.png) | [Desktop](desktop-linked-contact-detail.png) |
| Upcoming design task on Overview | [Phone](phone-walkthrough-prep-overview.png) | [Desktop](desktop-walkthrough-prep-overview.png) |
| Prepare design form | [Phone](phone-prepare-design.png) | [Desktop](desktop-prepare-design.png) |
| Appointment next steps | [Phone](phone-appointment-prep.png) | [Desktop](desktop-appointment-prep.png) |
| Contact actions | [Phone card](phone-contact-card-actions.png) | [Desktop row](desktop-contact-row-actions.png) |
| More menu open | [Phone](phone-contact-more-open.png) | [Desktop](desktop-contact-more-open.png) |
| Today in month Calendar | [Phone](phone-calendar-today-month.png) | [Desktop](desktop-calendar-today-month.png) |
| Today in week Calendar | — | [Desktop](desktop-calendar-today-week.png) |
| Calendar control row | [Phone](phone-calendar-controls.png) | — |

Website drafts remain private until the separate publish action. Email/SMS delivery is **Not connected**; reminder selections are stored preferences only.
