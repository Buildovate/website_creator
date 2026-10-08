# Module: Game onboarding (#028G G-1 and G-2a)

State: G-1 and G-2a verified. Game is the only site workspace per Round 3h. API 16 and browser 21 pass; G-1 remains 40 + 16. Header/logo/nav/platform-look pass; platform-mobile retains the approved BASE fixture exception. G-2b not started.

## Contracts

- `src/blueprint/progress.js`: `evaluateProgress(sources)` is pure and deterministic. Returns nine quests with id, level, xpEarned, xpMax, done, steps, dataSource and status; plus levels, totalXp/siteStrength, nextLevelAt, four stamps and eight badges.
- A source is available only with `state: 'available'`. Missing/disconnected sources never award quest XP. The estimator's step weights are 5/10/5 for explanation, but its 20 XP is awarded only when all three pass. All quests together total 100.
- Levels are the first incomplete group, not a total-XP shortcut: out-of-order work does not skip prerequisites. Next-level totals are 40 and 85; level 3 has no further level. The UI should pair this number with the outstanding member quests.
- `finishedPreview(real)` returns a detached, labeled Preview with a completed illustrative house and an unchanged clone of the real progress. It does not manufacture earned badges, stamps or XP and has no persistence.
- `src/blueprint/deps.js`: dynamically imports the owner modules on demand. Absent module/export/invalid result returns `{state:'not_connected'}`. Syntax/runtime failures and missing dependencies inside an owner module propagate. No owner files are created. No provider or credential access is implemented.
- `src/blueprint/sources.js`: `readProgressSources(env, tenantId)` is an internal, read-only server service using tenant-scoped queries. `progressForRequest` is the future route boundary and reuses existing `access(..., 'read')` before reading. GET /api/game/:tenant is mounted by G-2a through the existing access gate. The pure engine is not an authorization or persistence API.

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


## Single-view desktop workspace (G-2a / Round 3h)

GET /api/game/:tenant returns real tenant name, role, view=game and evaluated saved progress. Non-GET methods are rejected; obsolete personal view records are ignored and never rewritten. No client progress submission is accepted.

The Game controller reads shell state through one event bridge and observes the existing content node. sections.js maps all 26 original section IDs to nine quests, filtered against actual permitted legacy navigation. It moves original #content/#status into a Game section frame and invokes the existing section handler. Forms, uploads, saves, dialogs, role gates and data sources stay intact. Back preserves the open form; switching forms retains legacy navigation behavior. Promotions/Financing open questionnaire anchors. Inventory: build-evidence/028G/NOTES.md. Legacy-workspace.js is unchanged.

Initial loading/error states have visible recovery controls; failed refresh retains the last board with an honest message. Read-only access stays labeled. Caption uses --bv-bp-ink/--bv-bp-deep (14.47:1); all four desktop states pass opacity/contrast. Prototype activity is not enabled. Tours, finished-version display and celebration remain G-2b.
