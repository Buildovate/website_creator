# Ticket #004 — executed local evidence (2026-09-24)

Service route: /s/:slug/services/:service-slug. Local fixture: service-detail-test/services/roof-repair.

Fresh esbuild server bundle: exit 0.
```text
node tests/website-pages.mjs
✔ #004 service detail: published snapshot, preview membership, media and inquiry
✔ #004 shared browser handler preserves service context and suppresses preview sends
ℹ tests 13
ℹ pass 13
ℹ fail 0

node tests/reference-proof.mjs
PASS reference proof: published project map, unpublished isolation, owner visibility, logo privacy/publish, connected review placement, no-key fallback and mocked provider attribution/filtering.

node tests/conversion-references.mjs
PASS conversion references: 3 journeys × 3 layouts, draft isolation, claim approval/escaping, inquiry persistence, preview auth, anchor integrity, one H1, effects, and legacy CTA corrections.
PASS service checklist: custom names, descriptions, deduplication, selection limits, full service rendering and draft isolation.
PASS Roofing #002: repair/replacement copy matches selected services, direct call/inquiry paths, both inquiry intents persisted, one preserved hero film, repair-only/static fallback and published isolation. Local fixture only.

node tests/constitution.mjs
PASS configuration safety, locked values and calculator math
PASS tenant roles, draft/publication isolation, shared footers, feature gates and promotion unlock/expiry
PASS 84 trade/layout legal-preview links and their access controls
```

All final commands exited 0. Tests cover escaped headline/scope/art/process/materials/FAQ, conditional FAQ dependencies, enabled/selected gating, anonymous/outsider/member preview access, immutable public snapshots, published versus draft/thumbnail media, consent/origin rejection, persisted contextual inquiry and the real browser handler's service/city/timing serialization and preview suppression. No browser screenshot was captured; evidence is executed tests, not visual sign-off.

Earlier test runs exposed outdated #003 expectations (page media now becomes public upon publish), a fixture-generated slug different from the requested URL, and the test VM's CommonJS export binding. These test issues were corrected before the final pass.

Validation uses this local working tree's pre-existing uncommitted foundations and assets. The isolated commit intentionally excludes them and is not clean-checkout release certification. Existing provider regression responses are mocks. No external credentials, live integration, deployment or send. Section H stays Partial: #005 links the selected-service grid; further editors, page-family features and generated creative work remain open. #027A Roofing polish remains queued before #028.
