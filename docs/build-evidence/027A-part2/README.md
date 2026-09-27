# #027A Part 2 — Roofing homeowner polish

Done locally on 2026-09-27. This ticket finishes the remaining Roofing polish and the two authorized #028G documentation substitutions. **Higgsfield credits used: 0.** No media was generated, no provider account was called, and no expense data changed. No push, deployment, staging environment, or other ticket work.

Branch: `feature/local-environment-setup`. Baseline: `cd31c4db0cbb51625ee36458f17e99a052bc4929`. The local commit is identified by `feat: finish Roofing homeowner polish (#027A Part 2)`; its hash is recorded in the final response and local `commit-result.json`.

## Before and after

| Item | Before | After | Evidence at 1440×900 and 390×844 |
| --- | --- | --- | --- |
| 1 | No extra direct headline option. First-save defaults could alter existing CTA labels. | Added “Roof concerns? Let’s make a clear plan.” Existing effective CTA labels/captions carry into the first draft. Saved privately, then explicitly published. | [Desktop](screenshots/01-headline-option-desktop.png) · [Phone](screenshots/01-headline-option-phone.png) |
| 2 | Installation/replacement reused a tile photo; phone cards were tall. | Eight different installed tile photos, service display headings, compact two-column phone grid. Header-to-hero gap remains 0px. | [Desktop](screenshots/02-service-tiles-desktop.png) · [Phone](screenshots/02-service-tiles-phone.png) |
| 3 | Tall source strip, verbose provider details, public refresh. | Shorter source strip; 2×2 phone links; compact confirmed rating/count/source badges. Attribution/policies retained; refresh remains private. | [Desktop](screenshots/03-rating-badges-desktop.png) · [Phone](screenshots/03-rating-badges-phone.png) |
| 4 | No compact monthly/total comparison. | One bar per configured plan, dark green/lime presentation, comma-formatted budget; no chart or sample payment without supplied terms. | [Desktop](screenshots/04-financing-monthly-desktop.png) · [Phone](screenshots/04-financing-monthly-phone.png) |
| 5 | Reused flashing photo, plain PDF cover, public connection status, forced phone height. | Unique installed shingle photo; designed publication cover in both PDFs; private-only delivery status; natural-height phone form. | [Desktop](screenshots/05-ebook-cover-desktop.png) · [Phone](screenshots/05-ebook-cover-phone.png) |
| 6 | 24 flat toggles; multiple Save actions could share a screen. | Five plain-language groups under Advanced. Design locks and Creative direction have separate views. One visible Save, including the phone dock. | [Desktop](screenshots/06-manifest-desktop.png) · [Phone](screenshots/06-manifest-phone.png) |
| 7 | Large preview/status void and tight actions. | Compact live preview, roomier buttons, warmer editor copy. Same draft/version/publish workflow. | [Desktop](screenshots/07-hero-actions-desktop.png) · [Phone](screenshots/07-hero-actions-phone.png) |
| 8 | Social profiles wrapped inconsistently. | Only enabled, entered profiles; eight desktop columns and four plus four on phone. | [Desktop](screenshots/08-socials-desktop.png) · [Phone](screenshots/08-socials-phone.png) |
| 9 | Weak inquiry receipt. | Clear saved-request confirmation and warmer next steps; profile-confirmed next-step text only, no invented response time. | [Desktop](screenshots/09-success-desktop.png) · [Phone](screenshots/09-success-phone.png) |
| 10 | Small owner quote treatment. | Large serif quotation mark with restrained green treatment. | [Desktop](screenshots/10-owner-quote-desktop.png) · [Phone](screenshots/10-owner-quote-phone.png) |
| 11 | Similar Other work cards; repeated installed photos, including filename aliases. | Three distinct card treatments; same-trade installed-image allocation checks SHA-256, including alias files. | [Desktop](screenshots/11-locksmith-other-work-desktop.png) · [Phone](screenshots/11-locksmith-other-work-phone.png) |
| 12 | Cold #020 headings and faint water line. | Warmer three-step wording and outlined lime water path; same sequence. | [Desktop](screenshots/12-water-path-desktop.png) · [Phone](screenshots/12-water-path-phone.png) |
| 13 | White rectangle for border_draw. | 120ms on-brand border reveal; static final border under reduced motion, touch, and no JS. | [Desktop](screenshots/13-drawn-border-desktop.png) · [Phone](screenshots/13-drawn-border-phone.png) |
| 14 | Part 1 had already removed city captions. | Confirmed absent in current Roofing city pages and all captured kit variants. | [Desktop](screenshots/14-city-desktop.png) · [Phone](screenshots/14-city-phone.png) |
| 15 | Roofing used the generic next-step composition. | Two stable seeded Roofing compositions: roof inspection trace and four photo/cross-section frames. One primary motion; all four steps remain available with reduced motion or no JS. | [Desktop](screenshots/15-roof-b-motion-desktop.png) · [Phone](screenshots/15-roof-b-motion-phone.png) |
| 16 | Large labeled video controls. | 44px circular bottom-corner pause/resume icons. Original accessible names, keyboard behavior, pressed states, player and focus ring retained. | [Desktop](screenshots/16-ambient-icon-desktop.png) · [Phone](screenshots/16-ambient-icon-phone.png) |
| 17 | Long desktop blank runway below Promotions steps. | Compact desktop travel; photo and four-step band fill the available viewport. Original four beats and scrub controller retained. | [Desktop](screenshots/17-promotions-band-desktop.png) · [Phone](screenshots/17-promotions-band-phone.png) |
| 18 | #028G finished-house completion concept. | Only the two requested Business at work sentence/Done-when substitutions. No #028G implementation. | Exact section regression and Git diff |

Headline publication evidence: `01-published-before-*`, `01-saved-draft-*`, `01-published-after-*`. The test compares the public headline before and after draft save and explicit publish, and checks both existing CTA labels exactly. Manifest evidence also includes Advanced and the separate Creative direction view. Missing financing: `04-financing-no-terms-*` and `04-financing-preview-empty-*`; configured terms: monthly and total screenshots. Review ratings, social profiles and lender programs in screenshots are explicitly isolated local QA fixtures, not live business facts or provider integration claims.

The two eight-page PDFs were rendered in full under `pdf/`; all fourteen body pages retain their original extracted text. The cover was inspected at publication scale and both browser viewport sizes (`05-pdf-cover-*`). [PDF verification](pdf/verification.json). Both storyboard variants have viewport, complete-section, reduced-motion and no-JavaScript captures. Fixed site navigation is omitted only from the four complete-section captures so it does not obscure the steps; viewport screenshots retain it. [Screenshot/assertion manifest](browser-results.json).

## Reused work

- The #023 generation manifest, all 24 keys, lock persistence, authorization, regeneration API and private draft/publish semantics. The phone dock still calls the original form handler; it follows the selected settings view.
- The #023A hero editor, static preview, version checks, hero frames, story order and installed drone/hero assets. Only the selectable wording and editor presentation changed.
- The existing #008–#010 provider responses, confirmed source rules, reviewer attribution, profile links, policy links and private refresh. No K22 logo rights are established, so readable provider names are used.
- The #017 supplied-program gate and existing financingEstimate calculation. Chart values come from the same entered project cost/down payment and real adapter/configured APR and term.
- The #020 three-step story, section hooks and visual foundation; the water path uses the existing path geometry with a visible SVG outline.
- Existing service-art/service-media assets, installed thumbnails and trade catalog photographs. No photo files were overwritten. The image allocator prefers another asset for the same service, then the same trade; user-uploaded project evidence is never reassigned.
- Existing owner quote, footer profile settings, inquiry success route, ebook consent/receipt/delivery adapters and private-only sample handling.
- All four Phase 2 clip descriptors, posters and web encodes; shared lazy/offscreen/reduced-motion player; original scroll controller; and every Part 1 Financing loop file. The new controls only change presentation. Promotions still works with zero entered offers.

## Current rules and older-spec conflicts

1. Older pack motion timings of 0.6–1.2 seconds yield to the current 120ms rule. New border, chart and storyboard transitions are 120ms; reduced motion is static.
2. The planning document queues two storyboards for all 17 trades. This request implements Roofing only. Other trades' storyboards remain queued; shared photo/card/social/review changes are explicitly authorized by this ticket.
3. K22 does not establish platform-mark permission. The permitted fallback is readable platform names and source links; no new logos were introduced.
4. The protected #017 gate returns 404 for an unavailable public Financing route; the chart remains absent. Private preview retains the existing honest Not-connected state, and the public homepage omits the missing financing feature. We preserved that behavior rather than publishing example terms. Local configured-term fixtures are clearly named QA.
5. Existing live provider and delivery connections remain governed by their original gates. Public delivery connection diagnostics were removed as requested; preview/backoffice diagnostics remain. Legal and sample-content publishing rules were preserved.
6. The existing mobile dock duplicates a form action internally. On the two settings views, the inline duplicate is hidden from sight, keyboard and accessibility tree while the dock supplies the single Save action. Desktop uses the original inline action. The browser check counts the entire screen, including the dock.
7. Protected composite hero/craft image layers are a single visual and keep their exact component assets. Distinct content photographs are checked by file bytes, not merely filenames. Real uploaded project evidence is preserved rather than replaced with catalog imagery.
8. Part 1 already removed city captions and the homepage header band. Those fixes were verified, not rebuilt. The Part 1 loop and source assets remain intact.

All requested items were completed with installed assets. No new image estimate or generation approval is needed. No Part 2 item is left Pending; missing external integrations retain their prior honest state.

## Verification

- **100/100 commands passed**: 72 regression scripts, 24 browser suites, build, typecheck, template asset integrity and the platform mobile suite. [Final command results](final-checks.json); per-command logs in `checks/`. All 210 platform mobile states pass.
- **7561 new regression assertions** and **237 new browser assertions**, with zero browser exceptions. 78 new captures, plus all sixteen PDF pages. New tests cover each requested item, draft/publish separation, one Save across both settings views, image uniqueness, provider fallback, honest financing, keyboard pause, no overflow, both seeded storyboards, static equivalence, and unchanged geometry during storyboard motion.
- **374/374 response contracts across 17 kits** match after narrow documented normalization; 146 are already byte-identical. Every URL and before/after SHA-256 is in [changed-pages.json](changed-pages.json); original and final HTML are in `before/` and `after/`. Normalization covers only installed image src/alt/srcset, public refresh removal, exact success/#020 wording, the Roofing chart block and the authorized Roofing next-step replacement. It does not waive entire pages.
- **2951 installed content-photo instances** checked for existence and SHA-256 uniqueness within each captured page. [Image integrity](image-integrity.json). Core asset integrity checks cover 635 references and all 17 kits; existing media suites also validate video bytes/decoding/fallbacks.
- Old #024–#027 response checks use the documented current response contract. Four older Promotions tests exercise their original Pending fixture, then restore the installed catalog and rebuild; finished films are separately verified by the Phase 2 suite. Older navigation tests now select the actual settings view; image-failure tests target the actual allocated photo. Original behavior assertions remain.
- **53/53 Vite QA URLs return 200** after the required local restart. [URL results](qa-urls.json). Command: `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173`, working directory `C:\Users\joe\website_creator`.
- **8792 prior evidence files restored/verified byte-for-byte; 1515 pre-existing dirty/untracked files unchanged.** [Preservation](preservation.json). Prior evidence was backed up before any rerun. New rerun results live only in this ticket folder. Expenses, hero/drone assets, protected player code and Part 1 media were independently checked.

No blanket test bypasses or generated replacement media were used. Initial verification failures and focused retests are retained in `verification-history.json`; final results above reflect the corrected source. Duplicate legacy-suite screenshots and temporary PDF comparison inputs may remain local and are excluded from the commit manifest.

Next ticket: #028, not started.
