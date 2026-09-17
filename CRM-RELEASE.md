# Sales workspace revision

Contacts is the canonical UI; legacy leads and contacts records are read together without destructive migration. New contacts are stored as contacts. Duplicate checks use normalized email, North American phone numbers, company + city, and exact normalized identity tuples. Version guards reject simultaneous conflicting writes. Imports accept CSV and XLSX through read-excel-file 9.3.10 with explicit column mapping. Column settings are workspace scoped.

No Answer records the server time, actor and attempt count. Stage changes retain history. Assignments resolve to active workspace members. Contacts may be deleted while financial and appointment records remain. Fictional leads are seeded once for administrators and use example.test and reserved fictional phone numbers; demo records do not contribute to performance reporting.

Calendar supports month, week, day and agenda, team filters, configurable booking questions, local time display and server timezone validation. Overlapping scheduled appointments are rejected for shared assignees. Booking can move New/Called contacts to Booked. Notification previews do not send. The Zoom adapter automatically creates and updates meetings for the global Buildovate calendar after its Server-to-Server OAuth account is configured. ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET and ZOOM_HOST_USER_ID must be configured as server secrets; they are currently absent. Zoom meeting write permission is required. Participant URLs are saved, host start URLs and access tokens are not persisted. Timeout/ambiguous creation is held for manual reconciliation to prevent duplicate creation. Contractor calendars remain unconnected. Cancellation of a calendar record does not delete its Zoom meeting; manage cancellation in Zoom.

Financials preserves draft vs published versions. Agreement/Proposal/Quote acceptance captures typed signature, explicit electronic consent, server time and SHA-256 of the accepted published document. Stale acceptance is rejected and accepted records cannot be changed or unpublished. This is a basic electronic acceptance record, not a certified signature service. Runtime payment creation, reconciliation, email/SMS delivery and public recipient access still require connections/configuration.

User last-seen comes from an authenticated workspace session request, not the identity provider's login time. Revenue pace uses manually entered deal values and Paid stages, not verified collections. Commission statements remain manually reconciled, with existing per-role quota entry.

Validation: CRM refresh, existing CRM, workspace and sales-operations integration tests. Tests cover deduplication, version conflicts, assignment membership, calendar validation, document immutability, data isolation and demo idempotency.

## Settings, profiles and lifecycle planning

Settings centralizes provider status and setup links. It does not claim external accounts are connected by saving a preference. Google Calendar currently supports per-appointment export, not two-way synchronization. Klarna through Stripe is not eligible for B2B purchases; monthly merchant payment schedules can be inserted into Financials drafts without activating collection.

Profiles are tied to the authenticated staff member. Photos are stored in R2, stripped of JPEG metadata, and served only to signed-in staff. Display names and photos appear in member/rep presentation.

Follow-up planning creates deterministic outbox records for appointment confirmation, morning-of and one-hour-before reminders, respecting the appointment timezone and daylight saving time. Passed slots for late bookings are omitted. Updates move pending reminders; cancellations cancel the pending queue. Marking a contact Paid creates offer enrollment once. Marketing permission, opt-outs, destinations and provider availability produce explicit hold reasons. The delivery worker is not implemented or scheduled in this release: no automatic emails/SMS are sent. Customer-defined offers, sender preferences and queue previews are durable.

Lead discovery includes stored public-source searches, source-linked evidence review, editable opportunity records and deduplicated contact handoff. It does not scrape Facebook groups, monitor Reddit automatically or infer private contact information.

Contact tabs are durable filters and can be added, renamed or removed without deleting contacts. Row actions log call outcomes or open booking directly. Regression coverage is in tests/control.mjs alongside CRM and Zoom integration tests.
