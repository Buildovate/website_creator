# #015 — Roofing promotion display states

Completed locally on 2026-09-24 on feature/local-environment-setup. No push or deployment. Every offer and tenant used here is fictional, disposable QA data; no real promotion was created.

## Behavior

- Enabled offers are grouped into Current, Upcoming and Expired using the server clock. Starts are inclusive; ends are exclusive. Disabled offers are omitted. No current offers produces an honest project-contact fallback; an empty collection has no offer cards.
- Each card retains its description, reward, start/end dates and expandable eligibility terms. Dates are explicitly UTC (the existing stored ISO format); source offsets are converted accurately, including a daylight-saving repeated-hour fixture. No business timezone setting is invented.
- Only current cards expose a quiz. Upcoming/expired offers cannot be unlocked by a direct API request. The existing endpoint still checks eligibility time at submission. Codes are absent before successful answer verification, and draft quizzes stay disabled.
- The homepage promotion strip and link obey the published Promotions page switch, preserve authenticated preview context, and use neutral copy even when no offer is current. Disabling the published page removes the strip/links and returns 404 for the page. Draft toggles do not change public output.
- No countdown, free-claim promise, receipt persistence, external integration or generated assets were added. Display states are evaluated when the page is requested; the existing endpoint checks availability again on submission. #016 receipt/replay/rate-limit work remains separate.

## Executed checks

| Check | Result |
|---|---|
| Full runner: build, TypeScript, all 41 regression scripts | **43/43 passed** |
| Added promotion scenarios in constitution.mjs | **8/8 passed**: current, upcoming, expired, none, disabled offer, mixed, exact time boundaries, draft/published switch |
| Desktop Chromium, 1440×900, America/Los_Angeles | **Passed** four states, terms via keyboard, wrong/correct answers, switch and disabled preview |
| Mobile Chromium, 390×844, touch-capable, Asia/Tokyo | **Passed** same checks; no horizontal overflow |
| Mobile JavaScript disabled | **Passed** visible dates/terms and explicit quiz fallback |
| Browser console exceptions | **0** |

Browser screenshots use reduced motion for settled content; no drone hero or motion code was changed. This ticket did not rerun Lighthouse. Browser fixtures verify real local HTTP routes against an in-memory database and memory storage.

- [Machine-readable regression results](regressions/results.json), with each command's output in regressions/.
- [Focused promotion test output](regressions/constitution.mjs.log).
- [Browser assertions](browser-results.json).
- Reproduce from the repository: node docs/build-evidence/015/full-regression.cjs, then node docs/build-evidence/015/browser-evidence.mjs. The browser runner uses the installed Chrome/Playwright paths recorded in its source and closes its loopback server after completion.

## Final screenshots

| State | Desktop | Mobile |
|---|---|---|
| Current (before verification) | [Current](desktop-current.png) | [Current](mobile-current.png), [quiz and terms](mobile-current-terms.png) |
| Upcoming | [Upcoming](desktop-upcoming.png) | [Upcoming](mobile-upcoming.png) |
| Expired | [Expired](desktop-expired.png) | [Expired](mobile-expired.png) |
| No offer | [None](desktop-none.png) | [None](mobile-none.png) |
| Homepage strip | [Strip](desktop-homepage-strip.png) | [Strip](mobile-homepage-strip.png) |
| Correctly verified fictional code | [Verified](desktop-verified.png) | [Verified](mobile-verified.png) |
| Disabled draft quiz | [Preview](desktop-preview.png) | [Preview](mobile-preview.png) |
| No JavaScript | — | [Static fallback](mobile-no-js.png) |

Current mobile content spans two real viewport captures so dates, controls and terms are readable. Screenshots were visually inspected; upcoming/expired text contrast was corrected before final capture. The homepage capture waits for its existing deferred stylesheet to load.
