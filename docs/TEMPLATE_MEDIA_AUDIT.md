# Website template media audit

Inspected 2026-09-23 (America/Los_Angeles). Scope: website_creator templates and staging only. No deployment, permission change, database mutation, production modification, commit or push was performed during this audit.

## Finding

The entire public/assets directory is absent from the local repository, Git HEAD, the pre-login AWS source bundle, and the later login source bundle. All 107 discovered /assets dependencies returned HTTP 404 on staging: **90 images (83 WebP and 7 JPEG), 15 MP4 videos, and Leaflet JavaScript/CSS**. This includes template hero art, service/specialty images, cutaway background images, film posters, transformation films, project-story films and roofing comparison images.

The pre-login previous.zip contained 152 entries and no public/assets files; owner-base.zip contained 140 entries and no public/assets files. The staging media bucket has no objects under assets/ or public/assets/. This establishes that these assets were already absent before the login/owner updates; it does not prove what caused their original omission.

## Coverage and results

- Rendered all seven trades with all three layouts and all 21 distinct design-recipe query variants plus defaults: **462 HTML responses, all HTTP 200** in an isolated in-memory test database. No live records were created.
- Every default preview includes a video element and inline SVG markup, but its file-backed media is missing. Markup success is not a working visual/video test.
- Checked 34 deployed static scripts/styles/resources plus eight design/media manifests: **42 of 42 match the local build** (text normalized for line endings; JSON compared structurally).
- Confirmed all 107 discovered /assets paths return real 404 responses using GET requests with a byte Range header; no login redirects were counted as successes.
- Ran seven existing website suites: design-kits, cinematic-films, presentation, trade-upgrade, project-experience, builder and saved-designs. All stop in the existing preview fixture because public/assets/roofing.jpg is absent. These are blocked/failed checks, not passes. No dummy images or weakened assertions were introduced.

| Trade | Default layouts checked | Missing media files per default preview |
| --- | ---: | ---: |
| Roofing | 3 | 11 |
| Patios | 3 | 12 |
| Plumbing | 3 | 12 |
| HVAC | 3 | 12 |
| Electrical | 3 | 12 |
| Landscaping | 3 | 12 |
| General Contractors | 3 | 12 |

Counts per preview overlap; use missing-assets.csv for unique paths.

## Original publication recovery

The authenticated Sites connector confirms the original staging project **appgprj_6aad6c939310819191ee9000a4be08a8**, saved version **11**, source commit **a7de87500283677ba07a2432828fd29fa9a77ca2**. Its stored TAR archive has 363 files and 153,978,880 bytes, SHA-256 **3d1fb90b340ac14c446f68171cbf1133cf4d795a8c091a65e985ef8a7e2280af**.

Only archive metadata is available through the installed read-only Sites operations; no archive bytes or source-tree export were returned. Therefore its asset completeness and newer source features remain unverified. No write credentials, access bypass tokens, or replacement media were generated. The repo also records original source URLs for seven project-story videos in docs/project-film-sources.json, but these do not cover the full missing bundle and were not substituted for the originals.

## Completion limits

This is a dependency and server-render audit, not a claim that the library is complete. Video decoding/playback, image quality, responsive visual parity, map marker assets, external font/map services, custom uploaded tenant media, and content that exists only in the original Sites source cannot be certified until the original bundle is recovered. Static path scanning may miss dynamically constructed or source-only dependencies. The 55 unprobed path-like strings in inventory.json are unresolved module/build references, not counted as confirmed missing browser resources.

## Required recovery and verification

1. Export the original staging v11 source TAR from its existing Sites project/conversation into a separate recovery directory; verify its recorded SHA-256. Preserve current AWS auth and owner changes.
2. Compare the recovered public/assets tree against missing-assets.csv, inspect archive-only media and manifest differences, and reconcile all missing files without replacing application code wholesale. Preserve media licenses and concept disclosures.
3. Rebuild; rerun this audit, the seven blocked suites, auth/client/AWS tests, and compare rendered previews visually at desktop/mobile sizes. Verify video metadata/playback/seek/posters, lazy loading, comparison sliders, cutaway interactions, maps and reduced-motion behavior.
4. Prepare a staging-only asset release with rollback metadata; verify deployed asset HTTP status/content type and browser behavior. Production requires separate approval.
5. Add a required asset-integrity release gate so a green health endpoint or build cannot approve a bundle missing its template media.

## Files

- missing-assets.csv: unique missing paths with source references.
- inventory.json: all static and rendered path observations and live responses.
- templates.json: results for all 462 template/recipe combinations.
- deployed-code.json: 42 deployment parity comparisons.
- tests.json: existing suite outcomes.
- Re-run from repo root: node scripts/audit-template-media.mjs (reads staging and writes audit reports locally).


## Recovery follow-up

The original source is now recovered and the local media/template restoration is verified. See TEMPLATE_RESTORATION.md. Earlier missing-file/live-staging results above remain historical evidence and were not rewritten as successes. Staging has not yet received the restoration.
