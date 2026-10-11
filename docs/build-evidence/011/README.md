# #011 — Reviewed legal publication rules

Completed locally, 2026-09-24. Real K23 policy content remains **Needs review**; every reviewed record below is an explicitly fictional QA fixture, not approved legal language.

The framework binds administrator-controlled review records to a business jurisdiction/trade. Attached policies must be current and reviewed; required license number/state gate publication. Missing policy keeps the existing publication fallback with Needs review status and suppresses optional structured positive bonded/insured claims. Existing owner attestation is also required. Confirmed negative insurance disclosures remain intact.

Questionnaire exposes status, review reference and draft jurisdiction/state fields. Ordinary editors cannot alter the review record; older editors preserve it and restoring a backup cannot revive a withdrawn policy. Required public disclosure placement is #012.

## Screenshots

| State | Desktop | Mobile |
|---|---|---|
| Missing K23 policy | [Desktop](desktop-none.png) | [Mobile](mobile-none.png) |
| Required license facts absent | [Desktop](desktop-missing.png) | [Mobile](mobile-missing.png) |
| Fictional reviewed fixture | [Desktop](desktop-reviewed.png) | [Mobile](mobile-reviewed.png) |

These are the actual Questionnaire component and styles, mounted against the local worker API at 1440×1000 and 390×844. The capture uses labeled fictional fixtures and checks draft-only save through the real API.

## Executed verification

- Build: PASS, 276 assets / 14 trade kits ([output](build.txt)).
- TypeScript auth/workspace check: exit 0 ([output](typecheck.txt)).
- `node --test tests/legal-policy.mjs tests/constitution.mjs tests/premium-service.mjs tests/website-pages.mjs tests/trust.mjs`: **26 passed, 0 failed** ([output](tests.txt)).
- Browser: all three states on both viewports; accessible fields, no horizontal overflow/page errors, actual draft save preserves published data/review metadata ([output](browser-output.txt)).
- Boundary coverage includes invalid references, future/expired/scope-mismatched reviews, hidden required-license inputs, owner/admin permissions, rejected publication preserving its prior snapshot, old-client omission and backup withdrawal.

Reproduce with `node build.mjs`, the test command above, `node scripts/preview-legal-policy.mjs` (8105), then `node scripts/capture-legal-policy.cjs`. An initial direct-import extension failure was fixed; final output is green. No real legal policy, license-board connection, paid generation, deployment or external messaging occurred.
