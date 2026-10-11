# #170 — Trade kit enablement

Completed locally on 2026-09-26 from c383109ad06189eaec0e792e3308d7ee0dae828f. Branch: feature/local-environment-setup.

## Changes

- Enabled Groundwork (Concrete) and Stillwater (Pools); added Keyline (Locksmith), eight services each, using the existing JSON catalogs and shared renderer. All 17 choices are available in the library, create and prepare pickers, composer and contractor questionnaire.
- Added unique Locksmith briefs/FAQs and 24 distinct service photos. Retained 48 existing Concrete/Pools service photos. Added nine kit photos. Services carry the chosen service into the estimator entry form. City pages use trade-specific local context and four unique FAQs.
- Two seed-selected background/section-divider treatments per trade; Locksmith adds brass hardware to the existing layered interaction. Static reduced-motion/no-JS layouts remain available.
- Preview art now shows only the design name; template card titles, selectors and dialogs retain Name (Trade). Questionnaire trade changes refresh service choices and save only explicitly selected services to draft.
- Full sample previews are private/noindex, and absent/sample proof and unapproved prices stay off published service pages. Representative generated imagery is not customer project proof. No homepage renderer or drone asset was edited. Three conventional kit-poster aliases support the existing homepage fallback without changing that renderer.

## Executed checks

| Check | Result |
|---|---|
| Build / typecheck | Pass / pass |
| Existing + new regression scripts | 52 passed, including six new #170 unit tests |
| Template asset integrity | 17 kits; passed |
| New browser suite | 258 checks; 8 selector inventories; no browser errors |
| Existing platform mobile suite | 202 screen states; no overflow, target or input failures |
| Existing browser suites | Contacts, callback, contact linkage and platform cleanup all passed; cleanup 7 checks |
| Template media audit (--local only) | 1326 renders; 0 errors; 609 assets; 0 missing |
| Restarted Vite | 9/9 home, service and city private-preview URLs return 200/noindex |

See checks.json, browser-results.json, platform-mobile-audit.json, individual logs, media-audit/summary.json and vite-checks.json. The initial regression run caught the old 14-trade seed assertion and the missing Locksmith media-ledger rows; both were corrected and rerun successfully. Browser harness retries corrected desktop/phone selectors before the final successful capture.

## Higgsfield

33 completed still generations: nano_banana_2, 2K, 3:2, one image per prompt. 2579.8 credits before; 2513.8 after; **66 used**. No video. The 33 optimized WebP files total 6,659,634 bytes, excluding three compatibility aliases. See credits.json, image-requests.json, image-results.json and image-provenance.json. Contact sheets: images-0.png, images-12.png, images-24.png. No missing stills remain for these kits.

## Screenshots

All captures are genuine browser PNGs. Desktop 1440×900; phone 390×844; full page. Reduced motion was selected so below-fold content is visible in a single capture. The create screenshots show the selected Locksmith trade; the browser option inventory proves all 17 options are present (native select popups are not part of a full-page browser screenshot).

- [concrete-home-desktop.png](concrete-home-desktop.png)
- [concrete-service-desktop.png](concrete-service-desktop.png)
- [concrete-city-desktop.png](concrete-city-desktop.png)
- [pools-home-desktop.png](pools-home-desktop.png)
- [pools-service-desktop.png](pools-service-desktop.png)
- [pools-city-desktop.png](pools-city-desktop.png)
- [locksmith-home-desktop.png](locksmith-home-desktop.png)
- [locksmith-service-desktop.png](locksmith-service-desktop.png)
- [locksmith-city-desktop.png](locksmith-city-desktop.png)
- [trade-library-desktop.png](trade-library-desktop.png)
- [composer-desktop.png](composer-desktop.png)
- [create-picker-desktop.png](create-picker-desktop.png)
- [prepare-picker-desktop.png](prepare-picker-desktop.png)
- [questionnaire-desktop.png](questionnaire-desktop.png)
- [concrete-home-phone.png](concrete-home-phone.png)
- [concrete-service-phone.png](concrete-service-phone.png)
- [concrete-city-phone.png](concrete-city-phone.png)
- [pools-home-phone.png](pools-home-phone.png)
- [pools-service-phone.png](pools-service-phone.png)
- [pools-city-phone.png](pools-city-phone.png)
- [locksmith-home-phone.png](locksmith-home-phone.png)
- [locksmith-service-phone.png](locksmith-service-phone.png)
- [locksmith-city-phone.png](locksmith-city-phone.png)
- [trade-library-phone.png](trade-library-phone.png)
- [composer-phone.png](composer-phone.png)
- [create-picker-phone.png](create-picker-phone.png)
- [prepare-picker-phone.png](prepare-picker-phone.png)
- [questionnaire-phone.png](questionnaire-phone.png)
- [concrete-service-no-js-phone.png](concrete-service-no-js-phone.png)
- [pools-service-no-js-phone.png](pools-service-no-js-phone.png)
- [locksmith-service-no-js-phone.png](locksmith-service-no-js-phone.png)

## Preservation and limits

Backed up and restored 654 existing evidence files, including untracked files. SHA-256 matched all 262 pre-existing modified/untracked paths; see preservation.json. Tests used isolated local fixtures. No staging requests, push, deployment or public publishing occurred. Vite uses private local sample drafts. No paid generation or external business integration is triggered by kit selection. No physical phone test was performed; phone evidence is Chromium at the specified viewport.

No implementation blockers remain for this ticket. #015G remains queued and was not started.
