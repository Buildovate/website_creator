# Module: Game onboarding progress (#028G G-1)

State: G-1 logic verified in round 2b; 56 fixture tests pass, header/logo/nav/platform-look guards pass, and platform-mobile has the expressly permitted BASE #057A-T2 failure. No route/UI is exposed.

## Contracts

- `src/blueprint/progress.js`: `evaluateProgress(sources)` is pure and deterministic. Returns nine quests with id, level, xpEarned, xpMax, done, steps, dataSource and status; plus levels, totalXp/siteStrength, nextLevelAt, four stamps and eight badges.
- A source is available only with `state: 'available'`. Missing/disconnected sources never award quest XP. The estimator's step weights are 5/10/5 for explanation, but its 20 XP is awarded only when all three pass. All quests together total 100.
- Levels are the first incomplete group, not a total-XP shortcut: out-of-order work does not skip prerequisites. Next-level totals are 40 and 85; level 3 has no further level. The UI should pair this number with the outstanding member quests.
- `finishedPreview(real)` returns a detached, labeled Preview with a completed illustrative house and an unchanged clone of the real progress. It does not manufacture earned badges, stamps or XP and has no persistence.
- `src/blueprint/deps.js`: dynamically imports the owner modules on demand. Absent module/export/invalid result returns `{state:'not_connected'}`. Syntax/runtime failures and missing dependencies inside an owner module propagate. No owner files are created. No provider or credential access is implemented.
- `src/blueprint/sources.js`: `readProgressSources(env, tenantId)` is an internal, read-only server service using tenant-scoped queries. `progressForRequest` is the future route boundary and reuses existing `access(..., 'read')` before reading. No route is mounted in G-1. The pure engine is not an authorization or persistence API.

## Existing evidence reused

Tenant settings and questionnaire fact confirmation supply the four business basics; authored page drafts and the manual `sales` owner-approval record supply website-page progress; saved offers and explicit financing None supply their decisions. The existing `chat_config.phoneVerified` gate plus enabled SMS alerts supplies Leads & CRM readiness. `tenants.status/published` supplies publication status, while paid-plan and live-domain evidence must come from their owners' contracts.

Questionnaire factsConfirmed is conservative: prefilled or found-but-unconfirmed business values cannot count merely because they are saved. G-4 must map its future per-field confirmation into the same evidence shape. No arbitrary completion booleans from settings are consumed.

The sales approval is an existing manual staff-entered record of owner approval with a reference. It is not the staff-only review_approval QA packet and not paid-plan proof. Required drafts are home, About, FAQ, every selected service, and enabled authored city pages; no complete score is inferred from generated page URLs alone.

## Missing records in BASE

No persisted successful Google/Yelp display, estimator homeowner configuration/minimum item contract/consent configuration, CRM connection, verified email alerts, social connection/none choice/social published post, or new-review event records are available. No automatic inference from keys, application links, social URLs, website blog posts or rating totals is permitted. Promotion No offer right now has no saved choice field yet: empty offers remain incomplete. Financing None already has an explicit persisted selection.

Fixtures exercise future positive evidence contracts without inventing production records. A complete fixture is not proof that all integrations are available in BASE.

## Tests and host isolation

`tests/game-progress.mjs`: 40 passing Node tests, including all 512 quest subsets, dependencies, tenant-scoped SQLite reads and corrupt JSON rejection. `tests/game-milestones.mjs`: 16 passing Node tests. `tests/game-fixtures.mjs` contains fictional offline records only.

`tests/game-guard-loader.mjs` / `game-guard-build.mjs` are prepared test-host adapters: in-memory path/port substitution, own output paths, local-only fetch and isolated .data builds. The round 2 invocation failed before execution because --import received a Windows path. In authorized round 2b, a file URL fixed the command without editing tests/app code: isolated build and header-logo/nav/platform-look passed; platform-mobile stopped at the approved BASE review-packet exception. No original test, assertion, detector, baseline, threshold or protected dist file changed. See build-evidence/028G/NOTES.md for exact results; platform-mobile is not claimed passing.

