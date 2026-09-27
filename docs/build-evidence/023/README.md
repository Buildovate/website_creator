# #023 — Stable generation manifest

Completed locally on 2026-09-26. **0 Higgsfield credits**, no generation/vendor calls, no push, deployment or staging access. #023A was not started.

## What the manifest does

Each site now keeps a versioned record of its saved design: the composition, current layout, effect flags, background/transition seed and selected variant, thumbnail effect/seed/lock, scroll-story settings, Roofing CTA placement, journey, uploaded-image IDs, page media and editorial references. It inventories installed asset paths using the existing catalogs and the existing homepage/service renderers. Page-copy fingerprints refer back to the saved page records rather than duplicating a second content system. Business facts remain in the original settings.

Every design revision has a generation ID, revision number, creation time, reason, site ID, URL slug, schema version, lock map, choices, asset references and validation digest. Immutable history lives in the tenant-scoped generation_manifests table (migration 0008). Current draft and published manifests stay inside their existing snapshots. Normal saves with unchanged choices keep the same generation ID. Regeneration creates a new ID even when every choice is locked.

Loading validates the version, site/slug binding, structure, locks, saved-choice match, asset references and digest. Corrupt data is rejected; it is never silently re-rolled. This digest detects accidental corruption and is not a credential or cryptographic signature. Clients cannot replace a stored manifest. An older editor may submit an exact historical server manifest from this tenant; it is verified against immutable history and then discarded in favor of current metadata and locks. The unchanged trade-enablement browser suite exposed this compatibility case, and its successful 258-check retry is recorded alongside the original failure. The server owns manifest updates and existing optimistic versions prevent stale/double saves.

Older sites adopt their effective saved choices on first full tenant load. Metadata adoption uses a compare-and-swap guard and does not increment the content version or publish a draft. Existing implicit thumbnail and CTA seeds are made explicit without changing the rendered page. Draft and published snapshots are adopted separately, so private edits do not leak into publication. Backups retain the snapshot manifest; old backups are adopted, and corrupt backups are rejected before restoration.

## What was reused

| Existing capability | Integration |
| --- | --- |
| cleanDesign / design-variant.js | Its existing option lists are now exported as one registry; normalization and output stay the same. Regeneration uses that registry. |
| #019 thumbnail effect, lock and seed | Recorded directly and selected with the existing cleanThumbnailMotion function. A locked seed/effect survives regeneration and later normal saves. |
| Backgrounds and transitions | Existing generationId/slug seed and serviceLayoutVariant select the same trade-specific treatments. Locking treatments preserves the seed and variant. |
| Composer checked/unchecked dimensions | Existing “Vary” choices initialize from the manifest; applying a composition persists those locks. Saved library recipes can retain them, and site creation adopts them. |
| Installed imagery and saved uploads | Inventory comes from existing catalogs/renderers and saved photo IDs. No new or replacement imagery is produced. |
| Existing CTA/editorial locks | Existing CTA lock is synchronized with the manifest. Page title locks are retained with the saved page references; regeneration does not rewrite those pages. |
| Tenant access and publication | Existing owner/admin checks, draft settings, published snapshots, media-ownership gates, version checks and backup flow remain in force. Editors/viewers can inspect their site; only owners/admins may change manifest locks or regenerate. |

## Regeneration principle and checklist

Regeneration changes unlocked creative choices while business facts, selected services, page addresses and information architecture stay stable. Local composition changes are immediate private drafts. New AI compositions remain **Pending / Not connected**: retaining approved installed art is never described as newly generated work. Preview, review and publication remain separate steps.

| Choice / asset | Local regeneration | Stable boundary |
| --- | --- | --- |
| Typography, card/rhythm/palette, service/owner layout, banner/headline/entrance treatment | Advance unlocked approved options | Existing cleanDesign vocabulary |
| Template and optional spotlight effect | Change only if unlocked | Existing renderer and effect flags |
| Trade background/transition variant | Change existing seed only if unlocked | Same trade-specific treatment library |
| Thumbnail effect | Existing seeded selector, only if unlocked | Same geometry, accessibility and #019 primitives |
| Hero/drone, scroll-story media, motion layout/anatomy, section order, CTA content/placement | Retained in this ticket | Protected #016–#022 features and approved media |
| New hero/service/city art, ebook composition, story/FAQ art, About portrait/shorts, financing/promo films | Pending; Not connected | No AI call, credits or falsely “completed” media job |
| Business facts, services, URLs, legal, lender logic, receipts and prices | Never regenerated | Existing source records and publication validation |

Pack J’s broader demand for new customer-specific photography, ebook and video compositions is gated by the current zero-credit/no-vendor instructions. This ticket records those jobs honestly rather than generating them. Its historical lender/footer wording does not override the current financing/legal rules. Some protected dimensions can be recorded/locked but are deliberately not re-rolled by this pass; the existing approved content is retained. There is no claim that the pending AI-art uniqueness work is complete.

## Contractor controls and states

The existing Design templates screen now begins with the saved revision and lock panel. It reuses platform colors/type, desktop navigation, phone menu and sticky Save/Publish dock. The saved controls are rendered synchronously before the record refresh to reserve geometry. Loading is announced; buttons remain live with a busy guard. Failed/offline saves retain choices, success offers one private-preview link, and unsaved locks must be saved before regeneration. Viewer controls are read-only. Empty/error provider responses in the screenshots are explicitly local QA injections. Reduced motion is static.

Desktop captures use 1440×900; phone captures use 390×844. Panel screenshots contain the entire panel; screen-phone.png also shows its actual viewport and dock.

| State | Desktop / phone evidence |
| --- | --- |
| saved | [saved-desktop.png](saved-desktop.png) / [saved-phone.png](saved-phone.png) |
| loading | [loading-desktop.png](loading-desktop.png) / [loading-phone.png](loading-phone.png) |
| error | [error-desktop.png](error-desktop.png) / [error-phone.png](error-phone.png) |
| offline | [offline-desktop.png](offline-desktop.png) / [offline-phone.png](offline-phone.png) |
| success | [success-desktop.png](success-desktop.png) / [success-phone.png](success-phone.png) |
| regenerated | [regenerated-desktop.png](regenerated-desktop.png) / [regenerated-phone.png](regenerated-phone.png) |
| empty | [empty-desktop.png](empty-desktop.png) / [empty-phone.png](empty-phone.png) |
| reduced | [reduced-desktop.png](reduced-desktop.png) / [reduced-phone.png](reduced-phone.png) |
| read-only | [read-only-desktop.png](read-only-desktop.png) / [read-only-phone.png](read-only-phone.png) |
| composer | [composer-desktop.png](composer-desktop.png) / [composer-phone.png](composer-phone.png) |

A separate Node child process reopened the saved local database and produced the same generation ID and byte-identical published HTML. See restart-proof.json.

## Before / after proof

All **17 trade kits** have byte-identical homepage HTML before and after migration, plus assertions that every configured service page in the fixture renders identically. Each kit has migration-<kit>-before.html and migration-<kit>-after.html. migration-proof.json records byte counts and shared SHA-256 hashes; migration-results.json lists the service routes. This is rendered-HTML comparison, not a claim of pixel-diff testing.

## Executed checks

- Build and typecheck passed.
- **64 regression scripts** passed, including **185 new generation assertions**.
- **16 browser suites** passed; **51 generation browser assertions**, **21 captures**.
- Platform mobile: **208 states**, no overflow or undersized targets/inputs.
- Template asset integrity: **605 references / 17 kits**, passed.
- **0 measured save-time CLS** on desktop and phone; no #023 browser exceptions or external requests.
- **17 identical trade migrations**, repeated renders/saves/republishes and fresh server-module and separate Node-process restart proof against persisted PGLite.
- Consent/financing/CTA/thumbnail/story/city/ebook/Expenses regressions and existing browser suites remain unchanged and pass.
- Vite restarted with node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173; **6 URL checks returned 200**, including the generation endpoint, homepage, preview and service page. See route-check.json.
- Restored **2029 older evidence files**; all **262 unrelated file hashes** match the initial state. See preservation.json.

The earlier physical-iPhone camera check remains Joe’s separate pending manual check; this ticket neither performs nor claims it. Live creative production remains intentionally unfinished and Not connected. The local manifest scope is complete.

## Screenshot paths

- [composer-desktop.png](composer-desktop.png)
- [composer-phone.png](composer-phone.png)
- [empty-desktop.png](empty-desktop.png)
- [empty-phone.png](empty-phone.png)
- [error-desktop.png](error-desktop.png)
- [error-phone.png](error-phone.png)
- [loading-desktop.png](loading-desktop.png)
- [loading-phone.png](loading-phone.png)
- [offline-desktop.png](offline-desktop.png)
- [offline-phone.png](offline-phone.png)
- [read-only-desktop.png](read-only-desktop.png)
- [read-only-phone.png](read-only-phone.png)
- [reduced-desktop.png](reduced-desktop.png)
- [reduced-phone.png](reduced-phone.png)
- [regenerated-desktop.png](regenerated-desktop.png)
- [regenerated-phone.png](regenerated-phone.png)
- [saved-desktop.png](saved-desktop.png)
- [saved-phone.png](saved-phone.png)
- [screen-phone.png](screen-phone.png)
- [success-desktop.png](success-desktop.png)
- [success-phone.png](success-phone.png)
