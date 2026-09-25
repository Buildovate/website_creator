# #015B — Platform mobile polish

Local fictional Roofing fixture, captured in Chrome at 390×844 and 1440×900 on 2026-09-25. No push or deployment.

## Results

- Full regression runner: **44/44 passed**, including build and auth TypeScript check. Logs and machine-readable results: [regressions/](regressions/) and [results.json](regressions/results.json).
- #015A platform browser checks, rerun with #015B assertions: **101 phone + 101 desktop states**, **0 layout failures**, **0 browser errors**. See [platform-mobile-audit.json](platform-mobile-audit.json).
- Browser assertions cover a single scrollable trade row, keyboard arrow and browser touch-swipe scrolling, primary Add contact, no Publish changes dock on operational screens, first contact visible in the framed Contacts viewport, one visible phone upload action, styled file picker, and upload retry.
- Camera control was exercised through the browser fixture; the separate #015A real-iPhone camera check remains pending.

## Screenshots

| View | Phone 390×844 | Desktop 1440×900 |
| --- | --- | --- |
| Contacts: swipeable trade row, primary Add contact, first record, no Publish dock | [phone](phone-contacts-trade-row-primary-add.png) | [desktop](desktop-contacts-trade-row-primary-add.png) |
| Trade row after a touch swipe | [phone](phone-contacts-trade-row-after-swipe.png) | [desktop](desktop-contacts-trade-row-after-scroll.png) |
| Calendar: no Publish dock | [phone](phone-calendar-no-publish.png) | [desktop](desktop-calendar-no-publish.png) |
| Upload: styled file picker, Take a photo, one phone Upload photographs action | [phone](phone-upload-styled-single-action.png) | [desktop](desktop-upload-styled.png) |
| Contractor Contacts: no Publish dock | [phone](phone-contractor-contacts-no-publish.png) | [desktop](desktop-contractor-contacts-no-publish.png) |
| Contractor Calendar: no Publish dock | [phone](phone-contractor-calendar-no-publish.png) | [desktop](desktop-contractor-calendar-no-publish.png) |

The Contacts and Calendar captures are framed at their content region, as in the #015A mobile inventory. The full dashboard header remains above that region.
