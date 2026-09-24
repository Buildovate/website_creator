# #004H — Motion kit v2, part 1 (Roofing)

**Partial — stopped after two failed mobile Performance attempts, as Joe requested.** This commit is local work in progress, not a completed acceptance or deployment. The Performance gate is unresolved and the requested visual/recording evidence is incomplete.

## Waiting on Joe

Authorize a further performance/evidence pass before resuming. Both attempts missed Performance 85. The second attempt includes scoped CSS bundling and deferring the existing homepage film until scrolling. No third attempt was made. The current report still identifies the finished hero image as LCP; a follow-up must inspect the actual request/style chain rather than claim the new components alone caused the score.

| Mobile audit | Performance | Accessibility | CLS | LCP |
|---|---:|---:|---:|---:|
| Attempt 1, bold-industrial | 79 | 96 | 0.008136 | 5.280 s |
| Attempt 2, bold-industrial | 78 | 100 | 0.008136 | 5.272 s |
| Attempt 2, clean-modern | 83 | 100 | 0.008136 | 4.673 s |

Targets: Performance >=85, Accessibility >=95, CLS <=0.05. Lighthouse 13.5.0, standard simulated mobile preset against the loopback-only published synthetic fixture; not a physical-device or production measurement. Lighthouse's audit viewport is its standard 412px preset; screenshot targets are separately 1440×900 and 390×844. The first CLI wrote valid reports but hit an EPERM temporary-profile cleanup error. The second used a Playwright-owned Chrome instance and completed normally.

Reports: [first HTML](lighthouse-attempt-1.report.html) / [JSON](lighthouse-attempt-1.report.json), [bold HTML](lighthouse-bold-industrial-mobile.report.html) / [JSON](lighthouse-bold-industrial-mobile.report.json), [clean HTML](lighthouse-clean-modern-mobile.report.html) / [JSON](lighthouse-clean-modern-mobile.report.json), [summary](lighthouse-summary.json).

## Implemented source; acceptance remains open

- LayerExplode: seven authored SVG layers, numbered labels and explanatory captions; scroll separates and reassembles them. Desktop pin is 230svh; mobile is 170svh without the 3D tilt. The existing cutaway remains reachable in a disclosure and as the legacy anatomy setting.
- RevealCompare: A uses a native range with explicit slider role, B uses a pointer/touch lens with a keyboard range and vertical arrow controls, C has three pressed-state buttons. Existing before.png/after.png are reused with the required AI label. C explicitly says the intact image also represents the before-storm baseline; these are not documented storm/project photographs.
- KineticText: on-load line motion plus a word-by-word scroll paragraph. The server emits one semantic copy for screen readers/search and an aria-hidden decorative copy. Reduced-motion CSS keeps the text complete, removes the pin and assembles the roof; comparison initialization uses the repaired image. Full reduced-motion browser evidence is pending.
- Extends the #004E renderer entry point and its event-driven scroll scheduler. No new scroll/animation library. New interactions load through dynamic import near the relevant sections. New animated CSS/JS properties are transform, opacity and clip-path. Existing sections, imagery, forms and legacy cutaway stay present.
- Both style token sets are saved through cleanDesign. No additional backoffice picker UI was built.

## Component options

Import from src/trade-motion.js (re-exported from src/trade-motion-v2.js):

| Component | Options | Layout meanings |
|---|---|---|
| LayerExplode | variant A/B/C; style token object or named set; id (default roof-anatomy) | A isometric tilt; B flat stack; C side-by-side label columns |
| RevealCompare | variant A/B/C; style token object or named set; id (default storm-compare) | A slider; B inspection lens; C Before storm / After storm / After repair toggle |
| KineticText | variant A/B/C; style; text; mode lines/words; tag h1/h2/p; optional id | A left aligned; B centered; C staggered lines or accented paragraph |

Style tokens: name, surface, ink, muted, accent, line (six-digit hex colors), radius (0–32px). Built-ins: **bold-industrial** and **clean-modern** in src/trade-motion-config.js. Invalid colors/layout values fall back safely. Give multiple instances unique ids.

Saved homepage settings: design.motionLayout = A/B/C; design.motionStyle = bold-industrial/clean-modern; design.motionAnatomy = layers/legacy. Defaults are A, bold-industrial and layers. Existing effects.cutaway=false suppresses the anatomy. Roofing customer-intent homepage adoption is journey=roof-repair; the standard legacy homepage and service detail rendering retain their existing implementations.

## Actual verification and limits

- Build passes: [build.txt](build.txt). One intermediate stylesheet bundle failed because Leaflet uses relative sprite references; keeping that existing stylesheet separate resolved the build. [Intermediate output](build-attempt-1.txt).
- Component renderer/options/escaping/budget checks pass for six profiles. [Initial output](component-tests.txt); the current rerun appears in [regressions.txt](regressions.txt).
- Combined regression run: **11 passed / 1 failed**. Existing conversion-references assertion uses literal bare H1 markup and rejects the new attributed H1 at line 14. Updating that assertion and rerunning the remaining conversion checks is pending; they are not claimed passed. Design-kit, premium-service and eight existing film-controller checks passed.
- Browser capture stopped at an incorrect case-sensitive test expecting “Roof”; rendered copy contains “roof”. The script assertion was corrected, but not rerun before the two-performance-attempt stop. [Original output](browser-attempt-1.txt). Its earlier desktop slider Home/ArrowRight/End and exploded/reassembled position checks passed before that assertion. No complete browser suite pass is claimed.
- Read-only post-fix inspection verified 17px desktop / 13px mobile layer headings, no horizontal overflow, and mobile stage scrollHeight equals its 688px height. [Desktop current inspection](desktop-layer-current-inspection.png), [mobile current inspection](mobile-layer-current-inspection.png).
- [Complete source size accounting](motion-size.json): **28,693 bytes gzip**, below 61,440 bytes. This deliberately includes the full changed existing renderer/controller files, not just added bytes. It is not a total page payload claim.

## Evidence inventory

The desktop rest/mid/finished captures below are from the **first layout iteration**, before the CSS cascade/spacing correction. They document executed work, not final visual acceptance.

| Component | Rest | Mid | Finished |
|---|---|---|---|
| LayerExplode | [rest](desktop-layer-rest.png) | [mid](desktop-layer-mid.png) | [finished](desktop-layer-finished.png) |
| RevealCompare A | [rest](desktop-compare-rest.png) | [mid](desktop-compare-mid.png) | [finished](desktop-compare-finished.png) |
| KineticText headline | [rest](desktop-kinetic-headline-rest.png) | [mid](desktop-kinetic-headline-mid.png) | [finished](desktop-kinetic-headline-finished.png) |
| KineticText paragraph | [rest](desktop-kinetic-statement-rest.png) | [mid](desktop-kinetic-statement-mid.png) | [finished](desktop-kinetic-statement-finished.png) |

**Outstanding:** final desktop/mobile state matrix; reduced-motion screenshots; desktop/mobile scroll recordings; executed touch-lens/toggle/no-JS QA; updated conversion regression; performance acceptance. No recordings or missing screenshots are fabricated. A/B/C render as saved options, but browser verification across all six profiles remains incomplete.

## Reproduction for an authorized continuation

Run node build.mjs, then node scripts/preview-motion-v2.mjs. The fixture creates seven isolated synthetic sites at http://127.0.0.1:8104/s/motion-{bold-industrial|clean-modern}-{a|b|c} and /s/motion-legacy. Configure PLAYWRIGHT_MODULE and CHROME_PATH for browser-qa.cjs; LIGHTHOUSE_MODULE points to an installed Lighthouse ESM entry for lighthouse.mjs. Lighthouse was installed only in the task's disposable tools folder, not in application dependencies.

This pass did not use private environment files, live keys, external delivery, paid services, image/video generation, push or deployment. #004I is backlog-only. Commit locator: feat: add partial Roofing motion kit and record performance stop (#004H).
