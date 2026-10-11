# Ticket #003 — executed local evidence

Date: 2026-09-24. Repository: `C:/Users/joe/website_creator`. Scope: draft/published page contracts only, plus the requested #027A backlog entry. No screenshot is required for this data-only ticket; the current request asks for test output. No page UI, deployment, external delivery or generation is claimed.

## Commands and actual output

Fresh backend bundle (exit 0):

```powershell
node --input-type=module -e "import {build} from 'esbuild'; await build({entryPoints:['src/worker.js'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',loader:{'.html':'text'},external:['cloudflare:workers']}); console.log('PASS fresh server bundle for ticket #003');"
```

```text
PASS fresh server bundle for ticket #003
```

`node --test tests/website-pages.mjs` — exit 0. Actual runner totals:

```text
ℹ tests 11
ℹ suites 0
ℹ pass 11
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

The suite executes typed record round-trips, generated IDs, stable URLs after title edits/reordering, duplicates/limits/schema rejection, photo-reference shape validation, real tenant API saves/renders, foreign/missing-photo rejection in each media slot, create ownership, HTTP 400s, roles/origin/concurrency, owner publication, old-editor preservation, draft deletion isolation, stale stored-draft validation, backup/restore and duplication. It uses the actual bundled worker with the existing SQLite and in-memory bucket fixture. Public service URLs remain 404; private photos remain private. API success is persisted/read back and compared with the published database snapshot.

`node node_modules/typescript/bin/tsc -p tsconfig.auth.json` — exit 0, no diagnostics.

`node tests/constitution.mjs` — exit 0:

```text
PASS configuration safety, locked values and calculator math
PASS tenant roles, draft/publication isolation, shared footers, feature gates and promotion unlock/expiry
PASS 84 trade/layout legal-preview links and their access controls
```

`node tests/conversion-references.mjs` — exit 0:

```text
PASS conversion references: 3 journeys × 3 layouts, draft isolation, claim approval/escaping, inquiry persistence, preview auth, anchor integrity, one H1, effects, and legacy CTA corrections.
PASS service checklist: custom names, descriptions, deduplication, selection limits, full service rendering and draft isolation.
PASS Roofing #002: repair/replacement copy matches selected services, direct call/inquiry paths, both inquiry intents persisted, one preserved hero film, repair-only/static fallback and published isolation. Local fixture only.
```

`node tests/reference-proof.mjs` — exit 0:

```text
PASS reference proof: published project map, unpublished isolation, owner visibility, logo privacy/publish, connected review placement, no-key fallback and mocked provider attribution/filtering.
```

## Limits of evidence

The first #003 run caught an incorrect test assumption about duplication returning `tenant`; it actually returns `id`. The assertion now retrieves that tenant before checking that page facts/media were not copied, and the final suite passes. The constitution test initially hit an esbuild filesystem sandbox restriction; it passed when rerun with repository access. Provider responses in existing regression tests are mocks, not live connections. Validation uses the current working tree with pre-existing uncommitted foundations/assets; this commit deliberately excludes those unrelated changes and is not a clean-checkout release certification.
