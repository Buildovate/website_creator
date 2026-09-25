# #015D — Callbacks, contact detail and Calendar phone polish

Fictional Roofing fixture, captured in Chrome at 390×844 and 1440×900 on 2026-09-25. The v11 recovery code was a read-only behavior reference. Local commit only; no push or deployment.

## Results

- Full regression runner: **48/48 passed**, including build, typecheck, callback server/browser checks and the #015A platform mobile inventory. [Machine-readable results](regressions/results.json) and [individual logs](regressions/).
- Platform inventory: **101 phone + 101 desktop states**, **0 layout failures**, **0 browser errors**. [Platform audit](platform-mobile-audit.json).
- Callback server checks cover version conflicts, 15/30/45/60-minute reservation, contact activity and Next callback, callback update and cancellation, conflicting/foreign contact rejection, global/tenant isolation, preserve-on-edit and duplicate import, generic appointment-edit guard, and no prospect reminders.
- Browser checks cover visible Call Back and Book Appt from rows/cards and detail, raw-digit tel links with formatted display, fitted 1440px table, the callback editor and Calendar reopening, phone Upcoming view, and the single desktop Workspace label. [Browser results](browser-results.json).
- The separate #015A physical iPhone/Safari camera check remains pending.

## Screenshots

| View | Phone 390×844 | Desktop 1440×900 |
| --- | --- | --- |
| Contact card/row with visible actions and formatted phone | [phone card](phone-contact-card-actions.png) | [desktop table and row](desktop-contacts-table-actions.png) |
| Callback scheduler | [phone](phone-callback-scheduler.png) | [desktop](desktop-callback-scheduler.png) |
| Contact detail and Next callback | [phone](phone-contact-detail.png) | [desktop](desktop-contact-detail.png) |
| Callback on Calendar | [phone](phone-calendar-callback.png) | [desktop upcoming](desktop-calendar-callback.png) |
| Upcoming appointments / month view | [phone upcoming](phone-upcoming-appointments.png) | [desktop month callback](desktop-calendar-month-callback.png) |

No live email, SMS, Zoom, or Google Calendar delivery is claimed. Callback scheduling is a local platform calendar record.
