# Media library runtime (#028D)

The source catalog is `public/trade-media-library.json`. `src/design-kits.js` exposes each trade's `mediaLibrary`. Approved assets require a job/account provenance record, Joe Engel's rights reference, individual visual clearance and a SHA-256 digest. Pending and rejected inventory is never eligible for a new selection. The inventory also records evidence/reference files; these are not website content.

`settings.mediaPicks` is optional. Its default is absent: the old renderer and asset links remain byte-identical. Existing sites opt in only through the existing regeneration action. The server owns this record; an ordinary settings save cannot forge it. There are no migrations or new routes.

The record stores the #028C seed, catalog version, trade, hero and four section picks, source/poster IDs, URLs and hashes, a CSS tint treatment, staff override history and reuse/exhaustion decisions. `generationManifest.choices.mediaPicks` stores the exact same record. Replay restores those saved choices, not a fresh catalog selection. Approval and hashes are revalidated at render time: revoked clips can show their still-approved saved poster; an unapproved poster fails closed.

Hero selection uses approved clips only when the trade has at least two. Otherwise it uses approved stills. Seeded ordering chooses the least-used asset among same-trade sites; clip/poster siblings share their job family when checking reuse. Existing generation transactions serialize concurrent reservations. Exhausted pools are recorded honestly. Slots are never filled by duplicating catalog clips.

Staff can pass `mediaOverrides: {hero: "asset-id", services: "asset-id"}` to the existing generation POST with `action: "regenerate"` and the current tenant version. Valid keys are `hero`, `services`, `process`, `financing` and `finalCta`; values must belong to the eligible approved pool. Admin authorization and actor history are enforced. There is no new selector UI.

Explicitly selected, tenant-owned hero photos (`heroPhotoId` or the existing scroll-story poster choice) win over the library reservation. Owned photos are never tinted. Private/unselected uploads are not auto-published. Existing uploaded project imagery stays in its existing section and keeps its access rules.

Recoloring is a 12% CSS tint over media pixels. It never alters originals. Text remains outside the tint; full-bleed copy has opaque contrast surfaces. The original four Look styles still supply their typography and text colors. Media reserves its dimensions. Video sources load on intersection, stay muted/inline, pause offscreen, and have a keyboard-operable pause button. Reduced motion and JavaScript-off use the poster alone.

Library media has no project attribution, invented caption or job detail. `isSample` remains provenance metadata. Custom per-contractor video remains disabled until #028F. No provider key is required for these local assets.

Proof, counts, individual Pending content issues, tests and historical future credit estimates are in [#028D evidence](../build-evidence/028D/README.md) and [MEDIA-GAPS](../build-evidence/028D/MEDIA-GAPS.md). No generation was authorized or performed by this ticket.
