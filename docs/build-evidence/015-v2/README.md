# Ticket #015-v2 — Roofing promotion review fixes

Completed locally with fictional, disposable Roofing fixtures. No push, deployment, external delivery or real contractor promotion.

## Changes

- Added validated `settings.platform.timeZone` with `America/Los_Angeles` as the default. Older editors preserve the saved zone. Public offer cards show short dates in the published business zone; the ISO instants and start-inclusive/end-exclusive eligibility stay intact. Questionnaire offer date/time inputs remain explicitly labeled as the editing device’s local time.
- Replaced the shared site header’s clipped phone nav row with a native menu containing every available desktop link plus tap-to-call when a phone is supplied. It opens without JavaScript, and touch/keyboard targets are at least 44px high.
- Replaced the visible `<No guarantee>` token with “Results are not guaranteed.” Other angle/curly placeholder tokens are removed from rendered promotion fields.

## Verification

- [Full regression results](regressions/results.json): **44/44 passed**, including build, TypeScript, the platform mobile suite and the promotion tests; command logs are in [regressions](regressions/).
- [#015 browser rerun](browser-results.json), driven by [browser-evidence.mjs](browser-evidence.mjs): desktop 1440×900 and touch-capable phone 390×844 each pass current/upcoming/expired/none, terms keyboard access, wrong/correct answers, homepage switch, preview isolation and no horizontal overflow. Added checks cover menu parity, tap-to-call, 44px menu links, short dates and no visible placeholder/UTC text. No-JS menu and quiz fallback pass; zero browser exceptions. The phone browser uses an Asia/Tokyo device zone to verify that display remains in the saved America/Los_Angeles business zone.
- [Questionnaire browser check](platform-timezone-results.json), driven by [platform-timezone-evidence.mjs](platform-timezone-evidence.mjs): the field defaults to Los Angeles, saves New York, reopens with that value, has a readable 16px input and 44px height on phone, and has no horizontal overflow.
- `tests/constitution.mjs` covers invalid zones, March daylight-saving date rollover, November start/end boundaries, draft/publication zone isolation, older-editor preservation and public placeholder exclusion.

## Screenshots

| State | Phone 390×844 | Desktop 1440×900 |
|---|---|---|
| Navigation | [Menu open](mobile-menu-open.png), [closed](mobile-menu-closed.png) | [Current page/header](desktop-current.png) |
| Promotion date | [Business-zone short dates](mobile-date-format.png) | [Current offer](desktop-current.png) |
| Business time zone setting | [Saved field](mobile-business-timezone-setting.png) | [Saved field](desktop-business-timezone-setting.png) |
| Other #015 states | [Upcoming](mobile-upcoming.png), [expired](mobile-expired.png), [none](mobile-none.png), [terms](mobile-current-terms.png), [verified](mobile-verified.png), [preview](mobile-preview.png), [no JS](mobile-no-js.png) | [Upcoming](desktop-upcoming.png), [expired](desktop-expired.png), [none](desktop-none.png), [verified](desktop-verified.png), [preview](desktop-preview.png) |

The shared Roofing hero, motion controller and media were not changed. #015A’s physical iPhone camera check remains pending separately.
