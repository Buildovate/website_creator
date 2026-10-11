# #015FA Platform UI cleanup

The existing #015F number belongs to Contractor forms, so this review follow-up uses **#015FA**. This ticket changes only the contractor/admin platform. All screenshots use a local fictional fixture and Chrome at 1440×900 or 390×844; the extra Contacts comparison is at 1280×900.

## Changes and UX sweep

1. **One linked-draft action.** The 390px action dock no longer clones the Prepare design form's submit button. The form retains its primary action. A browser regression submits it and verifies the contact is linked to the private draft. The submit path also now writes portable JSON so a local PostgreSQL-compatible database can complete the link; it recovers a previously created, unlinked draft.
2. **Compact phone preparation.** Removed the dock's reserved bottom padding for this dialog. The primary action stays above the fold and the dialog ends immediately after it.
3. **Consistent template names.** A single `formatTemplateName` helper formats all template-kit labels as `Name (Trade)` in the trade library, art cards, create and prepare pickers, composer, and active design settings. The 14 current trade kits are covered by a unit regression.
4. **Single-row desktop actions.** Removed Details from the visible action row and added Open details under More. At 1280px and 1440px, No Answer, Call Back, Book Appt, and More fit on one row without overflow. More retains keyboard access and Escape behavior from the existing platform suite.
5. **Additional UX rule fix on touched screens.** Long contact names now truncate inside their table cell and expose the full name in a tooltip, instead of colliding with the phone column. Phone action buttons remain at least 44px and the existing platform inventory reports zero undersized targets.

## Screenshots

| Changed screen | Desktop before → after | Phone before → after |
| --- | --- | --- |
| Contacts row/card | [before](before/desktop-contacts.png) → [after](after/desktop-contacts.png) | [before](before/phone-contacts.png) → [after](after/phone-contacts.png) |
| Contact detail | [before](before/desktop-contact-details.png) → [after](after/desktop-contact-details.png) | [before](before/phone-contact-details.png) → [after](after/phone-contact-details.png) |
| Prepare dialog open | [before](before/desktop-prepare-dialog.png) → [after](after/desktop-prepare-dialog.png) | [before](before/phone-prepare-dialog.png) → [after](after/phone-prepare-dialog.png) |
| Trade template library | [before](before/desktop-template-library.png) → [after](after/desktop-template-library.png) | [before](before/phone-template-library.png) → [after](after/phone-template-library.png) |
| Create template dialog | [before](before/desktop-template-picker.png) → [after](after/desktop-template-picker.png) | [before](before/phone-template-picker.png) → [after](after/phone-template-picker.png) |
| Active design settings | [before](before/desktop-template-detail.png) → [after](after/desktop-template-detail.png) | [before](before/phone-template-detail.png) → [after](after/phone-template-detail.png) |
| Contacts at 1280px | [before](before/desktop-1280-contacts.png) → [after](after/desktop-1280-contacts.png) | — |

## Checks

- [Full regression results](regressions/results.json): **58/58 passed**, including build, TypeScript typecheck, all existing suites, the shared formatter regression, and the new desktop/phone browser regression. Individual logs are in `regressions/`.
- [Browser result](after/results.json): **7 targeted UI checks, 0 browser errors**. The test asserts one visible linked-draft submit, successful submit and contact linkage, compact phone dialog, formatted labels, and one-row desktop actions at both widths.
- #015A platform mobile inventory: **101 phone + 101 desktop screens**, zero horizontal overflow, undersized targets, undersized inputs, or browser errors. The suite log is [platform-mobile.mjs.log](regressions/platform-mobile.mjs.log). Its generated 015A files were restored from the pre-test backup, as were the older 015C–015E evidence directories.
- Local Vite restarted from this repository with `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`. The platform route `/` and trade design preview route `/design-preview/roofing/immersive` both returned **HTTP 200**. Contacts, trade library, and website design settings are views within the `/` platform route; their rendered states and actions are covered by the browser checks above.

The browser captures use desktop Chrome touch emulation for the phone viewport. The separate #015A physical iPhone camera check remains pending; this ticket did not perform that device check.
