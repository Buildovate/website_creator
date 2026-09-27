# #019 — Accessible thumbnail motion primitives

Completed locally on feature/local-environment-setup. **Higgsfield credits used: 0.** No vendor connection, new image/video generation, staging access, push or deployment. Every captured business is a disposable QA fixture.

## Scope and reuse

Read root BUILD-BACKLOG.md #019, the full referenced Pack O, UX-RULES.md, conversion-design principles and design/sites/workspace guidance. The root ticket narrows the larger Pack O library to **3D flip plus two restrained primitives**. This ticket implements flip_3d, zoom_overlay and border_draw, with none as the static fallback. The other Pack O effects, AR features, video loops and a cross-trade rollout are not claimed as implemented by #019. No new ticket was started.

Reused the real Services overview, visible-service registry, service-specific copy and installed front/scope imagery, native service URLs, private noindex preview/public snapshots, owner roles, Questionnaire save/error/offline feedback and mobile Save/Publish dock. There was no existing saved thumbnail-effect/lock/seed system. The optional homepage services application was left out, protecting the hero, drone and #018 CTA entirely.

## Primitives and usage

| Primitive | Where used | Active desktop / keyboard | Touch, reduced motion, no JavaScript |
|---|---|---|---|
| Photo flip (flip_3d) | Roofing /s/:slug/services; owner live preview | 1000px perspective, 180-degree photo-only horizontal turn, hidden backfaces, 120ms ease-out; secondary installed image of the same service | Static front photograph; all information and the same service link visible |
| Gentle photo zoom (zoom_overlay) | Same overview when selected; owner live preview | Photo scales to 1.035 over 120ms; content/CTA remain outside the photograph | Static full photo and permanently visible link; no hover-only overlay |
| Corner frame (border_draw) | Same overview when selected; owner live preview | Inset decorative border appears with a restrained scale/opacity transition, 120ms | Finished static frame on touch/reduced motion; static front without decoration in no-JS mode |
| Static photography (none) | Manual fallback choice at the same locations | No image effect | Identical static content |

One saved effect applies to every eligible service card on that site’s overview. Photographs keep a fixed 3:2 frame, consistent grid/card geometry, and object-fit cropping; animated layers stay clipped within the media area. The whole card is one native anchor, with a visible focus ring and a 44px-or-larger action area. There are no new fake offers, prices, ratings, measurements, urgency, legal text or CTA bursts.

**Current rules override older Pack O directions:** the pack’s 400–600ms flip is reduced to 120ms under UX-RULES. Only the decorative photograph flips, never titles, descriptions, captions or the CTA. Rear content is an alternate installed photo of the same service, marked decorative for assistive technology; there is no exclusive rear copy or rear CTA to trap on touch. The zoom’s action stays permanently visible instead of appearing in an overlay. No idle, bounce, magnetic movement, WebGL or autoplay was introduced.

## Saved controls and states

- Roofing settings retain thumb_motion_effect, thumb_motion_locked and thumb_motion_seed. Generation seeds distribute equally across the three supported motion effects; static is an explicit manual choice. Rendering and normal saves do not re-roll the choice. A lock preserves the effect/seed through regeneration; unlocking after a prior locked regeneration still honors the owner’s manual choice.
- Owner/admin Questionnaire controls offer the four choices, lock and a three-card preview using actual selected services. Preview states: rest, active/focus, reduced motion and phone. An empty selection explains what is needed. Viewers/editors can inspect the controls; server-side checks deny saving owner motion changes. Existing ordinary editor saves still work. Previous editors that omit the fields preserve the saved choice.
- Progressive enhancement waits for required images to load and decode. While loading, the name, description, caption and native link already exist. A failed rear photo leaves the good front static, regardless of which response finishes first. A failed front shows a named image-unavailable fallback without changing geometry or hiding the action. No JavaScript gives static content and working service links. Existing Questionnaire loading/save/error/offline states were reused.
- Draft choices remain private until normal owner publication. No new Sample content is stored or published; existing Sample sections and noindex preview behavior are unchanged. Unknown service media uses the prior static trade-appropriate fallback rather than invented or cross-trade images.

## Verification

| Check | Result |
|---|---|
| Build / typecheck | Passed |
| Regression scripts | 60 passed |
| New #019 server/data checks | 30 passed |
| Browser suites | 12 passed |
| New #019 browser assertions | 167 passed; no exceptions |
| Platform mobile audit | 208 states passed |
| Template asset integrity | 604 referenced files / 17 kits passed |
| Restarted Vite routes | 13 returned 200 |
| Desktop/phone captures | 44 PNGs |

See checks.json, individual logs, existing-browser-checks.json, regression-results.json, browser-results.json, platform-mobile-audit.json, route-check.json and summary.json. Browser evidence uses 1440×900 and 390×844 with touch enabled on phone. requestAnimationFrame samples record every card and its text during activation (at least six frames per 180ms window); text opacity/visibility and transforms remain unchanged, card dimensions remain fixed, and the Layout Instability observer records **zero motion-induced layout shift**. Tests also cover native tab order, visible focus, first-tap/Enter navigation, reduced-motion transforms/transitions/animations, no-JS links, delayed decode, rear/front failures, no horizontal overflow, live preview and saving. Photo decode does not change card height.

Existing #016, #017, #018 and expense regressions/browser suites pass unchanged. Protected source hashes/diffs are checked in preservation.json. The final rebuild includes the delayed-front/failed-rear race correction and its regression.

## Screenshots

Each file is a real capture. Phone rest/active states deliberately remain static and can look identical; no desktop image was substituted for a phone state. The primary three primitives each have rest, active, reduced-motion and no-JS captures at both sizes. Static fallback, loading/error/partial and owner controls/previews have additional evidence.

- [border_draw-active-desktop.png](border_draw-active-desktop.png)
- [border_draw-active-phone.png](border_draw-active-phone.png)
- [border_draw-no-js-desktop.png](border_draw-no-js-desktop.png)
- [border_draw-no-js-phone.png](border_draw-no-js-phone.png)
- [border_draw-reduced-desktop.png](border_draw-reduced-desktop.png)
- [border_draw-reduced-phone.png](border_draw-reduced-phone.png)
- [border_draw-rest-desktop.png](border_draw-rest-desktop.png)
- [border_draw-rest-phone.png](border_draw-rest-phone.png)
- [flip_3d-active-desktop.png](flip_3d-active-desktop.png)
- [flip_3d-active-phone.png](flip_3d-active-phone.png)
- [flip_3d-no-js-desktop.png](flip_3d-no-js-desktop.png)
- [flip_3d-no-js-phone.png](flip_3d-no-js-phone.png)
- [flip_3d-reduced-desktop.png](flip_3d-reduced-desktop.png)
- [flip_3d-reduced-phone.png](flip_3d-reduced-phone.png)
- [flip_3d-rest-desktop.png](flip_3d-rest-desktop.png)
- [flip_3d-rest-phone.png](flip_3d-rest-phone.png)
- [image-error-desktop.png](image-error-desktop.png)
- [image-error-phone.png](image-error-phone.png)
- [image-loading-desktop.png](image-loading-desktop.png)
- [image-loading-phone.png](image-loading-phone.png)
- [image-partial-desktop.png](image-partial-desktop.png)
- [image-partial-phone.png](image-partial-phone.png)
- [none-active-desktop.png](none-active-desktop.png)
- [none-active-phone.png](none-active-phone.png)
- [none-no-js-desktop.png](none-no-js-desktop.png)
- [none-no-js-phone.png](none-no-js-phone.png)
- [none-reduced-desktop.png](none-reduced-desktop.png)
- [none-reduced-phone.png](none-reduced-phone.png)
- [none-rest-desktop.png](none-rest-desktop.png)
- [none-rest-phone.png](none-rest-phone.png)
- [owner-live-preview-desktop.png](owner-live-preview-desktop.png)
- [owner-live-preview-phone.png](owner-live-preview-phone.png)
- [owner-picker-desktop.png](owner-picker-desktop.png)
- [owner-picker-phone.png](owner-picker-phone.png)
- [owner-preview-grid-desktop.png](owner-preview-grid-desktop.png)
- [owner-preview-grid-phone.png](owner-preview-grid-phone.png)
- [zoom_overlay-active-desktop.png](zoom_overlay-active-desktop.png)
- [zoom_overlay-active-phone.png](zoom_overlay-active-phone.png)
- [zoom_overlay-no-js-desktop.png](zoom_overlay-no-js-desktop.png)
- [zoom_overlay-no-js-phone.png](zoom_overlay-no-js-phone.png)
- [zoom_overlay-reduced-desktop.png](zoom_overlay-reduced-desktop.png)
- [zoom_overlay-reduced-phone.png](zoom_overlay-reduced-phone.png)
- [zoom_overlay-rest-desktop.png](zoom_overlay-rest-desktop.png)
- [zoom_overlay-rest-phone.png](zoom_overlay-rest-phone.png)

## Preservation and limits

Restored **1464** backed-up evidence files after the suites and verified **262** unrelated modified/untracked files byte-for-byte. Rerun result summaries were copied into this ticket before restoration; new old-suite extras are retained under regenerated-extra. No hero/drone, #018 CTA, expense, quiz or financing implementation was changed. No live provider or paid capability is required. The selected root-ticket acceptance is complete; physical-device testing was not requested. #020 remains Not started.
