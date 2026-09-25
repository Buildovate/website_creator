# Platform gap audit: earlier ChatGPT build ("Sites v11") vs. current website_creator

Audit date: Thu Sep 24, 2026, about 11:20 PM–12:10 AM PT. The audit was read-only on Yoeliko. No repo files were modified, committed, moved or deleted, and no app servers ran.
Current build: `C:\Users\joe\website_creator`, branch `feature/local-environment-setup` (HEAD per BUILD-STATUS: `f9f4ec6` + tickets through #015).
Method: I copied text-only files (src, public, tests, docs, .data snapshots, ChatGPT folder, a few Downloads) to the box as a 16 MB tar, then diffed them there.

---

## 0. Where the earlier version is

| Location | What it is | Verdict |
|---|---|---|
| **`C:\Users\joe\website_creator\.data\sites-v11-recovery\`** | This is a full checkout of the original **ChatGPT/OpenAI Sites v11** app: Git commit `a7de87500283677ba07a2432828fd29fa9a77ca2`, `.openai/hosting.json`, and a "Sign in with ChatGPT" login. It includes `src/`, `public/`, `tests/` and `dist/` (the built `dist/client/app.js` is 377 KB). `docs/TEMPLATE_RESTORATION.md` records how it was recovered. | **This is the earlier version. I used it as the "old" side of every comparison.** |
| `docs/TEMPLATE_RESTORATION.md` (current repo) | Says only the trade/template visual library and media were restored from v11. It also says, verbatim: *"The original v11 random-design/customer-assignment/payment workflow is a separate source difference and was not imported."* It confirms "CRM services and billing integrations were not replaced." | Explains the gap. The CRM/sales layer was deliberately left behind. |
| `.data\constitution-before`, `experience-redesign-before`, `media-restore-before`, `ticket003` | Partial pre-change snapshots from Codex tickets | They add nothing beyond v11 for the platform pages. |
| GitHub `Buildovate/website_creator` `main` (checked via API) | `public/` has only `crm-enhancements.js`, `control-ui.js` and `engagement-ui.js`. None of the 10 missing v11 UI modules are there. | The loss happened before this repo existed. The only copy is `.data\sites-v11-recovery`. |
| Git refs (read from `.git`, because `git` is not on PATH on Yoeliko) | Local branches `main`, `develop`, `feature/local-environment-setup`. Remote branches `origin/main` = `origin/staging` (21cc32e), `origin/develop` (f9f4ec6), `chore/website-dns`, `cursor/aws-website-creator-runtime-9ce0`, `cursor/codex-local-setup-bfbe`, `cursor/docker-compose-local-a7cc`, `cursor/knowledge-architecture-0899`. There are no tags. | No prototype/legacy branch was found. I could not walk the commit history without git. |
| `C:\Users\joe\OneDrive\Documents\ChatGPT\Buildovate - Website Design\` | This is the only subfolder. It holds Codex working scripts (`ticket0xx-*.cjs`), before/after copies of site-rendering files (`pack2-work`), the pack specs (PACK1–4, also in `docs/product/`) and backlog-generation output (`build-audit-work/output/BUILD-BACKLOG.md`). | There is **no platform UI** here. It is spec/work material only. |
| `Downloads\buildovate.zip` (Mar 2026), `ClientContactsV3.jsx` (Apr 2026), `BuildovateKanban.jsx`, `ContractorView.tsx`, `buildovate_phase1_wireframes.html`, and `OneDrive\Documents\Claude\Projects\Buildovate Labs\*spec.md` | Prototypes and specs for the **separate Buildovate Contractor CRM** (Leads, Activities, Agreements, Price Book, Reports, a client-contacts profile with tags, timestamped notes, linked contacts, lifetime value, relationship health, and Overview/Projects/Agreements/Financials/Activity tabs). These were built with Claude, not ChatGPT. | This is reference material only. Per backlog rule 9, that CRM is off-limits to this repo. I list its ideas in §1c as optional. |

Why it looks like "many things are missing": the v11 build concatenated **13** workspace UI modules into `app.js` (see `.data/sites-v11-recovery/build.mjs`). The current build concatenates only **3** (`scripts/build-client.mjs`: `crm-enhancements`, `control-ui`, `engagement-ui`).

* Missing client modules: `sales-upgrade-ui.js`, `flow-ui.js`, `launch-ui.js`, `launch-refinements-ui.js`, `connections-ui.js`, `portal-ui.js`, `screenshot-ui.js`, `website-sales-ui.js`, `design-studio-ui.js`, `scroll-story-ui.js`. Also the public helpers `lead-steps.js`, `checkout-simulation.js`, `launch-public.js` and `onboarding.js`.
* Missing server modules (19): `billing.js`, `calendar-connection.js`, `checkout-simulation.js`, `communications.js`, `connections.js`, `design-studio.js`, `inbox.js`, `launch.js`, `openai-health.js`, `portal-setup.js`, `price-book.js`, `proposals.js`, `sales-flow.js`, `sales-upgrade.js`, `site-experience.js`, `website-directory.js`, `website-import.js`, `website-invoice.js`, `website-sales.js`.
* Missing API route families: `/api/billing/*` (+ webhook), `/api/calendar-connection/*`, `/api/design-studio/*`, `/api/flow/*`, `/api/inbox/*` (Gmail OAuth, SMS inbound), `/api/launch/*`, `/api/website-import`, `/api/website-sales/*`, `/api/sales-upgrade/*`, `/customer-preview/`, `/design-preview/`, `/payment-return`.

Architecture note: one Contacts screen serves both audiences. `nextContacts(scope)` in `public/crm-enhancements.js` renders the admin/staff **Sales CRM → Contacts** (`scope='global'`) and also the **contractor workspace → Contacts** section (`scope=<tenantId>`, via `renderContacts` in `src/client/workspace/legacy-workspace.js`). Items marked "global only" below were admin-only in v11 too. Everything else affects contractors directly.

---

## 1. Contacts page: item-by-item

Legend: **Present** = same behavior in current. **Partial** = some of it exists. **Missing** = absent.
Old = `.data/sites-v11-recovery/…`. Cur = current repo. File references use function names because the files are minified one-liners.

### 1a. List / toolbar / columns

| # | Feature (v11) | Old source | Current | Status | Backlog |
|---|---|---|---|---|---|
| C1 | Header "Contacts" + contact count + "+ Add contact" | `public/crm-enhancements.js` `nextContacts` | same fn | Present | — |
| C2 | Import CSV / Excel with column mapping, custom columns, 5-row review | `public/app.js` import mapper; `src/excel-reader.js`; `src/crm-next.js` import (1,000 limit) | `legacy-workspace.js` import mapper; `src/crm-next.js` | Present | — |
| C3 | Edit columns (rename/hide/reorder, data kept) | `columnEditor` | same | Present | — |
| C4 | Edit tabs = saved smart lists by trade/specialty, with counts | `contactTabsEditor` (`control-ui.js`), `.smartlists` | same | Present | — |
| C5 | Add demo leads (admin) | `crm-next.js` demo seeding | same (current seeding is slightly reduced) | Present | — |
| C6 | Search (business/person/phone, full-record) | `#contact-search` | same | Present | — |
| C7 | Stage filter | `#contact-stage` | same | Present | — |
| C8 | Assigned-to filter | `#contact-assignee` | same | Present | — |
| C9 | **Call-outcome filter** (No Answer / Voicemail / Connected / Not interested / **Never called**) | `nextContacts` `#contact-outcome`, `crmFilter.outcome` | removed from toolbar and filter predicate | **Missing** | Untracked |
| C10 | List ⇄ Board (pipeline kanban) toggle, stage dropdown on cards | `#contact-view`, `data-move` | same | Present | — |
| C11 | Pagination with results count | `.contacts-pagination` | same | Present | — |
| C12 | **Row checkboxes + "select page"** | `data-select-contact`, `#contacts-select-page`, `selected` Map | none (the older `legacyContacts` in `legacy-workspace.js` has a bulk-stage toolbar, but it is dead code: `renderContacts` calls `nextContacts`) | **Missing** | Untracked |
| C13 | **Bulk bar: Assign team** | `paintBulk` → `bulkContacts('assign')` in `sales-upgrade-ui.js`; server `src/sales-upgrade.js` `action==='bulk'` (`/api/sales-upgrade/bulk/:scope`) | none | **Missing** | Untracked |
| C14 | **Bulk: Change stage** (with "Paid is manual" warning) | same | none reachable | **Missing** | Untracked |
| C15 | **Bulk: Export CSV** (BOM, formula-injection guard, `buildovate-contacts.csv`) | `bulkContacts('export')` | none. There is no contact export anywhere | **Missing** | Untracked (#123 covers consent for *imports*, not export) |
| C16 | **Bulk: Delete** (keeps appointments/docs/audit, cancels pending reminders) | `bulkContacts('delete')` | single delete only (detail view) | **Missing** | Untracked |
| C17 | **Inline notes column** (textarea + Save, optimistic version) | `nextContacts` `data-inline-note`/`data-save-note` → `PUT /api/flow/notes/:scope/:id` (`src/sales-flow.js`) | notes render as plain text; no `/api/flow` | **Missing** | Untracked |
| C18 | Stage pill and assigned-avatar cells | `nextContacts` | same | Present | — |
| C19 | **Payment column** (Invoice needed / Invoice ready / Payment verified / Test verified); global only | `paymentCell` in `website-sales-ui.js`; `/api/website-sales/statuses` | none | **Missing** | Partly tracked: #051 (itemized invoice), #054–#056 (payment connection, sandbox checkout, webhooks). The column itself is untracked. |
| C20 | **"Send Preview" row action** (emails an approved website preview + invoice); global only | `previewQuickAction`, `websitePreviewEmail` | none | **Missing** | Untracked (depends on email sender: #124/#140) |
| C21 | Row "Details" | `data-detail` | same | Present | — |
| C22 | **Row "Book Appt" button** | `data-book-appt` | only inside the "More ▾" dropdown | Partial | Untracked |
| C23 | Row "No Answer" (increments attempts, logs call) | `data-no-answer` → `/no-answer` | same | Present | — |
| C24 | **Row "Call Back" button** | `data-callback` → `callbackEditor` | none | **Missing** | Untracked |
| C25 | "More ▾": book, log voicemail/connected/not-interested, edit | `data-quick-action` | same | Present | — |
| C26 | **"Portal ↗" on Customers rows** (admin opens linked contractor workspace) | `customerPortal` / `enterCustomerPortal` (`sales-upgrade-ui.js`); `action==='link-website'` | none | **Missing** | Untracked |
| C27 | Customers view (Paid / has program) and Pipeline view | `nextContacts(scope,customers,board)` | same | Present | — |

### 1b. Contact record, detail view, activity and linkage

| # | Feature (v11) | Old source | Current | Status | Backlog |
|---|---|---|---|---|---|
| D1 | Editor fields: Business, Contact name, Email, Phone, City, Trade, Specialty, Sales stage, Website, Tags, Assignees (multi), Program, Upsell stage, Deal value, Notes, custom fields | `contactEditor` | same | Present | — |
| D2 | Communication permissions (appt email/SMS, promo email/SMS, opted out, consent note) | `contactEditor` | same | Present | #123 extends it for email |
| D3 | Duplicate check on save (email/phone/company+city) | `src/crm-next.js` | same | Present | — |
| D4 | **Preserve system link fields on edit/merge**: `tenantId`, `designStatus`, `paymentId`, `paymentVerified`, `nextCallbackAt`, `lastCallbackAppointmentId` | `src/crm-next.js` preserve list | preserve list is only `demo, calls, callAttempts, lastCallAt, stageHistory` | **Missing** | Untracked |
| D5 | Detail: stage track, stats (attempts / program+upsell / stage+assignee), tel: call link, No Answer, Edit, Book, stage select, delete | `contactDetails` | same | Present | — |
| D6 | Detail: Appointments list (open) | `contactDetails` | same | Present | — |
| D7 | Detail: Agreements & invoices list (global/admin) + "Let's do it → agreement" (`salesKit`) | `contactDetails` | same | Present | #051 upgrades to itemized |
| D8 | Detail: Activity timeline (calls + stage history) | `contactDetails` | same | Present | — |
| D9 | **Detail: profile header** (initials avatar, trade badge, DEMO badge) | `contactDetails` override in `sales-upgrade-ui.js` | none | **Missing** | Untracked |
| D10 | **Detail: "Call Back" button + "Next callback <time>" summary** | same override | none | **Missing** | Untracked |
| D11 | **Detail: "Portal ↗"** (admin) | same override | none | **Missing** | Untracked |
| D12 | **Callback scheduler**: datetime in local tz, reserve 15/30/45/60 min, status, assignees, notes. Creates a calendar event with `eventType:'callback'`, logs the attempt and sets `nextCallbackAt` | `callbackEditor` (`sales-upgrade-ui.js`); `src/workspace.js` calendar eventType handling | none (`eventType` appears 0 times in current src) | **Missing** | Untracked |
| D13 | **Calendar shows callbacks distinctly** and reopens them in the callback editor | `nextCalendar` `.calendar-callback` | removed | **Missing** | Untracked |
| D14 | **Link contact ↔ contractor website** (`tenantId`), shown in Websites table ("Customer" column, "Link from customer details") | `sales-upgrade.js` `link-website`; `app.js` `siteTable` | Websites table is Business/Trade/Publication/Updated only | **Missing** | Untracked |
| D15 | **Appointment booking from contact, v11 version**: meeting interests (required for global), AI-personalized confirmation email, duration 15–120, reminder email/SMS toggles, Zoom, "Prepare design / Built / Shown / Proposal" shortcuts that move the contact's stage | `appointmentEditor` override in `flow-ui.js`, `bookingInterests`, `/api/sales-upgrade/personalize`; `src/workspace.js` (interests, confirmation, durations, `afterBooking`, `syncCalendarAppointment`) | base editor only: Title, Starts, Ends, Link/location, Status, Notes (+ Zoom) | Partial | Untracked (email delivery itself: #124/#140) |
| D16 | Inquiry → contact auto-capture (website form creates/updates a contact) | `captureContact` (`src/crm.js`) | same | Present | AA remote sync = #156–#157 |
| D17 | **Inquiry list linked to contact** (open the contact from an inquiry, status) | not in v11 either. v11 had a lead-context panel in Inbox (`launch-ui.js` "The person behind the message") | contractor Inquiries section is a plain list (`legacy-workspace.js` `section==='inquiries'`) | Missing (both) | Untracked (#015A only makes the list mobile-friendly) |
| D18 | Contact-level email/SMS conversation (Inbox lead context, compose to contact) | `launch-ui.js` `renderInbox`, `flow-ui.js` `composeMessage`; `src/inbox.js` | none | **Missing** | Untracked. Gmail/Twilio keys are not in NEEDS-KEYS. |

### 1c. Optional ideas from the separate CRM prototype (`Downloads\ClientContactsV3.jsx`), not in v11

These were never in the ChatGPT build. I list them only because Joe may be remembering them: multiple timestamped notes with author, linked contacts (referrals/household), tag chips, lifetime value, relationship-health status, per-client tabs (Overview/Projects/Agreements/Financials/Activity) and in-app email compose. All untracked. Several of them belong to the separate CRM (backlog rule 9), so don't restore them blindly.

**Contacts totals (27 list rows + 18 detail rows = 45 items):** 23 Present, 2 Partial (C22, D15), 20 Missing. Of the missing, 19 are regressions from v11 (C9, C12–C17, C19, C20, C24, C26, D4, D9–D14, D18). D17 is counted as missing but v11 never had it either. **None of the missing items has a dedicated ticket.** C19, C20 and D18 depend on keyed tickets (#051/#054–#056, #124/#140, and no ticket yet for a Gmail/Twilio inbox).

---

## 2. Other platform pages (higher level)

Nav comparison: v11 `public/app.js` `nav()` vs. current `src/client/workspace/shell.ts`. The only nav entry that is gone is **Inbox** (admin and staff). All other views still exist, but several lost the v11 extensions.

| Page / area | v11 had (source) | Current | Status | Backlog |
|---|---|---|---|---|
| **Inbox / Conversations** (global) | Gmail mailbox per staff user (OAuth connect, search, read, reply, compose), SMS threads via Twilio inbound webhook, lead-context side panel, "Write message" (`launch-ui.js` `renderInbox`, `flow-ui.js` `composeMessage`; `src/inbox.js`, `/api/inbox/*`) | nav item and route removed | **Missing** | Untracked. Gmail OAuth and Twilio are not in NEEDS-KEYS. #105 covers connection storage generically. |
| **Follow-up center** | Base outbox plus a **message template studio** (brand logo/color, confirmation, morning and 1-hour reminders, growth messages, preview) and a delivery-worker/outbox staging with honest On hold/Ready/Expired states (`flow-ui.js` `templateStudio`; `src/communications.js`, `src/control.js` `stageOutbox`) | base follow-up list only; `communications.js` gone | Partial | Partly tracked: #127 (email rendering/preview) and #140–#142 cover *marketing* email. Appointment reminder templates are untracked. |
| **Calendar** | Callbacks, booking interests, durations, reminder toggles, Google Calendar two-way connection (`src/calendar-connection.js`) | month/week/day/agenda views, team filter, base appointment editor | Partial | Untracked |
| **Sales dashboard / Overview (staff)** | "Up next: Prepare for the walkthrough" design-task panel for staff (`flow-ui.js` `renderDesignTasks`, `/api/flow/tasks`) | overview without the task panel | **Missing** | Untracked |
| **Financials (payments)** | Stripe hosted invoices: create/finalize/verify/reconcile, customer billing portal, live vs. test payment split, payment-verified contact status, webhook (`flow-ui.js` `renderFinancials`; `src/billing.js`, `src/proposals.js`, `/api/billing/*`) | `renderGlobalWorkspace` + `financialSummary`: manual proposal/invoice docs, hosted link, acceptance lock | Partial | Tracked: #049–#057 (Price Book → itemized invoice → payment connection → sandbox checkout → webhooks → entitlements). Note that v11 had working Stripe code that could inform #054–#056. |
| **Website sales / invoice + customer preview** | Per-contact website invoice editor with line items and add-ons, invoice preview, approved offer, "Send preview" email, `/customer-preview/` page, 4-step purchase journey (payment → questionnaire → domain → approval) with a checkout simulation (`website-sales-ui.js`, `checkout-simulation.js`, `launch-public.js`; `src/website-sales.js`, `src/website-invoice.js`) | none (current has `/sales-preview/` only) | **Missing** | Partly tracked: #051/#052/#053 (itemized invoice, close-offer clock/UI). The preview email and purchase journey are untracked. |
| **Design studio / Trade library** | "A different design for every pro": random composition generator, assign it to a customer (contact search), public-source research to fill gaps, service confirmation, Price Book browser, invoice paper (`design-studio-ui.js`; `src/design-studio.js`, `src/price-book.js`, `public/price-book.json`) | Trade library + conversion reference journeys + kit composer. No generate-for-customer, research or Price Book | Partial | Partly tracked: #028C (uniqueness generator), #049/#050 (Price Book). Customer assignment and research are untracked. |
| **Create website (new tenant)** | Import from an existing contractor website (AI research, pick suggestions), full business detail fields at creation, preset picker (`launch-refinements-ui.js` `websiteImportFields`, `newBusinessDetailFields`; `src/website-import.js`) | name/slug/trade/specialties/journey only | Partial | Untracked |
| **Websites directory** | Website ↔ linked customer column, service count, design kit, explainer note (`app.js` `siteTable`, `src/website-directory.js`) | Business/Trade/Publication/Updated | Partial | Untracked |
| **Launch checklist / contractor Launchpad** | Customer launch workflow panel (purchase page → domain & monthly hosting → approval), **domain wizard** (choose → verify → connect & secure → launch, registrar guides), setup-progress rail with "Save & continue" chaining across sections (`launch-ui.js` `renderSite`/`paintDomainWizard`, `portal-ui.js` `mountSetupRail`; `src/launch.js`, `src/portal-setup.js`, `public/domain-guides.json`) | readiness checks + domains list with TXT verification; no wizard or setup rail | Partial | Untracked (#126 is email-DNS only) |
| **Contractor → CRM section** (`section==='crm'`) | "Your website. Your work. Connected.": connection preferences, Website→CRM inquiry queue, CRM→Project stories, pending-authorization state (`portal-ui.js` `renderContractorCRM`, `/api/launch/tenant/:id/crm`) | section removed | **Missing** | Tracked in principle: #156/#157 (remote CRM adapter). The contractor-facing status screen is not named in those tickets. |
| **Forms & submissions** (contractor) | 4-step lead form that saves after step 1 (`public/lead-steps.js`), submission dashboard with Partial/Complete counts and filters, and "Every inquiry, including unfinished forms" (`launch-refinements-ui.js` `submissionDashboard`) | single "Your forms" list + built-in form, plain inquiries list | **Missing** | Untracked. #014 added page context to inquiries but not partial capture. |
| **Inquiries** (contractor) | plain list (same as today) + CRM queue | plain list, "notifications not configured" | Present / Missing linkage | #015A (mobile) only |
| **Business settings** | Structured **service areas** (city + radius rows) that feed the project map (`screenshot-ui.js` `serviceAreaEditor`) | single "Service area" text field (Questionnaire has five city records from #003) | Partial | Tracked: #045 (locations), #021 (city pages) |
| **Settings → Connections** | Encrypted credential store with provider tests (Stripe, Twilio, SendGrid, Google OAuth/Gmail, Zoom, Google Calendar, DNS), red/amber/green status, 24h check expiry, guided 5-step checklist (`connections-ui.js`, `launch-ui.js` `renderSettings`, `sales-upgrade-ui.js`; `src/connections.js`) | Connections tab with static status cards ("not connected") | Partial | Partly tracked: #105 (secure connection storage), #124 (SendGrid), #054 (payments). The Zoom/Twilio/Gmail/Calendar tests are untracked. |
| **Team & access** | Team page + "Invite your lead-upload team" banner with copyable login URL (`flow-ui.js` `renderTeam`) | Team page present | Present (the banner is minor) | — |
| **Reviews** (contractor) | "Find your business" Google Places / Yelp **search-to-select** with server lookup, rate limit and audit (`engagement-ui.js`, `src/reviews.js` `reviewLookup`) | paste profile URLs + confirm match (`review-lookup` still exists in tests) | Partial | Tracked: #047 (trust/social controls), K03/K04 |
| **Live chat** | Visitor chat with OpenAI assistant, phone normalization, SMS notify (`src/engagement.js`) | chat present; phone normalization helper removed | Present (minor) | — |
| **Visual editor / Questionnaire / Pages / Media / Promotions** | v11 visual editor and scroll-story hero editor (`scroll-story-ui.js`, "Edit scroll-story hero") | current has a newer visual editor (`src/client/editor/visual-editor.js`) and Questionnaire (#003–#015). The scroll-story hero editor button is gone | Current is ahead except the scroll-story hero editor (Partial) | Scroll-story editor untracked. Promotions are tracked (#046, #060–#061). |
| **Sales performance, Lead discovery, Monitoring, Activity log, Saved templates, Profile** | same | same | Present | #070–#072 (Sales Rep) extend them |
| **Analytics / Growth** | none in v11 | none | Not a regression | #145–#148 |
| **Users/roles** | admin / staff (sales operator) / tenant owner/editor/viewer | same (+ owner flag instead of a hard-coded email) | Present | #044, #070 |

---

## 3. Untracked vs. already ticketed

**Already ticketed (the v11 code can serve as reference):** payments/Stripe invoice → #049–#057; Price Book → #049/#050; itemized invoice/close offer → #051–#053; connection storage → #105; SendGrid/email → #124/#127/#140–#143; remote CRM sync → #156/#157; service areas/locations → #045/#021; review search → #047; Sales Rep → #070–#072; uniqueness generator → #028C.

**Untracked (no ticket found in BUILD-BACKLOG.md's 186 tickets):**
1. Contacts: call-outcome filter, row selection + bulk assign/stage/export/delete, inline notes, Book Appt / Call Back row buttons, callback scheduler + calendar callbacks, detail header / next-callback / Portal, link-field preservation (C9, C12–C17, C22, C24, C26, D4, D9–D14).
2. Contact ↔ website linking, customer portal, Websites "Customer" column (D14, C26).
3. v11 appointment editor: interests, personalized confirmation, durations, reminder toggles, Built/Shown/Prepare shortcuts, staff "Prepare for the walkthrough" tasks (D15, Overview).
4. Contractor Forms & submissions with multi-step partial capture and Partial/Complete filtering. Inquiry → contact deep link.
5. Inbox / Conversations (Gmail + SMS) and contact-level messaging (D18). Keys are needed and are not in NEEDS-KEYS.
6. Launch workflow: domain wizard, setup-progress rail, customer purchase journey/preview email.
7. Create-website import from an existing site / public-source research. Design-studio customer assignment.
8. Contractor → CRM status section (the UI half of #156/#157 is not named).
9. Appointment reminder template studio / outbox staging (non-marketing).
10. Scroll-story hero editor.

---

## 4. Recommended new Codex tickets

Queue these after #015A (mobile pass), because every one of them touches platform screens and must meet the standing mobile rule. Each ticket uses `.data/sites-v11-recovery` only as **reference source**. Port the behavior into the current module layout (`public/crm-enhancements.js` or a new `src/client/workspace/*.ts`, `src/crm-next.js`, `src/workspace.js`). Do not copy the v11 files wholesale, and do not re-add hard-coded owner emails.

**#015B — Contacts restore: bulk actions, outcome filter, inline notes (≈6h).** Restore the v11 Contacts list behaviors for both the Sales CRM and the contractor-workspace scopes:
* row checkboxes and select-page;
* a sticky bulk bar with Assign team, Change stage (with the manual-Paid notice), Export CSV and Delete. Export uses a UTF-8 BOM and a formula-injection guard. Delete keeps appointments, documents and audit history and cancels pending reminders;
* a server bulk endpoint with per-record optimistic versions that reports changed/skipped counts and enforces scope access;
* the Call-outcome filter, including "Never called";
* an inline notes cell with Save, backed by a scoped, versioned notes write.

Remove the dead `legacyContacts` bulk toolbar. Add tests modeled on the v11 `tests/sales-upgrade.mjs` bulk cases (cross-tenant rejection, stale version, export escaping), plus the 390×844 and 1440×900 evidence.

**#015C — Contacts restore: callbacks and contact detail (≈5h).** Add a Call Back scheduler from the row and from the detail view:
* local-time picker, 15/30/45/60-minute reservation, status, assignees, notes;
* it creates a calendar event with type `callback`, logs the call attempt and sets the contact's next-callback time;
* callbacks render distinctly in all calendar views and reopen in the callback editor;
* it never sends a prospect invitation.

Promote Book Appt to a visible row button. Add the contact-detail profile header (initials avatar, trade and demo badges) and a "Next callback" summary. Extend the duplicate-merge preserve list so edits never drop system link fields (website link, design/payment status, next callback). Include tests for callback creation, preserve-on-edit and tenant isolation.

**#015D — Contact ↔ website linkage and appointment prep (≈6h).** Add the admin action to link a contact to an existing contractor website, and show the linked customer in the Websites table. Add a Portal action on linked Customers rows that opens that contractor workspace under existing admin rules. From an appointment, add "Prepare design" (creates a private draft website prefilled from the contact) plus Built/Shown stage shortcuts. Add a staff Overview panel listing upcoming walkthroughs that still need a design. Extend the appointment editor with meeting interests, a 15–120 minute duration and reminder email/SMS preference toggles, which are stored only. No email or SMS is sent without a connected provider; show the honest Not connected state. Payments, invoices and preview emails stay with #051–#056 and #140.

**#015E — Contractor forms: multi-step capture and inquiry linkage (≈6h).** Restore the 4-step homeowner inquiry flow:
* contact details are saved after step 1, and later steps update the same inquiry with an idempotent capture key;
* consent, honeypot, rate limits and the #014 page context are kept.

In the contractor workspace, replace the plain Forms list with a Forms & submissions dashboard showing saved/partial/complete counts and form and completion filters. Every Inquiries entry gets a status and an "Open contact" link to the auto-captured contact record. Partial inquiries must never be enrolled in marketing. Include tests for partial→complete updates, cross-tenant isolation and the preview/draft boundaries.

Not proposed as restore tickets (they need keys or are already covered): Gmail/SMS Inbox and the Connections provider tests (these need new NEEDS-KEYS entries first), the Stripe billing flow (#054–#056), the domain wizard/setup rail and the purchase journey (propose after the #015B–E Contacts work lands), and the Contractor→CRM status screen (fold it into #156).

---

## 5. Evidence and working notes

* Contacts diff: `diff` of `.data/sites-v11-recovery/public/crm-enhancements.js` (42,207 B) against `public/crm-enhancements.js` (38,012 B). The only removals are the payment fetch/column, `selected`/`paintBulk`, the outcome filter, the inline notes, the Book Appt, Call Back and Portal row buttons, the payment-setup/preview handlers and the calendar callback handling.
* Workspace diff: `.data/sites-v11-recovery/public/app.js` against `src/client/workspace/legacy-workspace.js`. Removed: Inbox view, `renderFinancials`, `renderDesignTasks`, the `crm` section, `submissionDashboard`, `serviceAreaEditor`, website import fields, setup "Save & continue", the Websites customer column and the scroll-story editor button.
* v11 client functions with no counterpart in the current src/public: listed per file in §0 and §2. For example, `sales-upgrade-ui.js` has `bulkContacts`, `callbackEditor`, `customerPortal`, `bookingInterests` and `signatureFields`.
* Build proof: `.data/sites-v11-recovery/build.mjs` (13 concatenated UI files) vs. `scripts/build-client.mjs` (3).
* On-machine side effects: my read-only commands wrote only to the tool's own scratch folder `C:\Users\joe\agent-tools\` (`audit-list.txt`, `audit-code.tgz`, 16 MB). Two oversized intermediate tarballs were created there and then deleted.
