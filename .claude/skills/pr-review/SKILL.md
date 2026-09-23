---
name: pr-review
description: Read-only review of the current branch versus develop, or of one docs/modules doc against its code. Proposes fixes and never applies them.
---

# pr-review [module]

Review this repo. Never change code, docs, or git state.

## Mode

| Argument | What to do |
|---|---|
| *(none)* | Review `git diff origin/develop...HEAD` |
| `<module>` | Deep-review that module against `docs/modules/<module>.md` |

Module names are the files in `docs/modules/` except `_TEMPLATE.md`: `infra`, `auth`, `sites`, `design`, `workspace`, `media`, `engagement`. Any other argument: ask which was meant. Do not guess.

## Branch diff
1. `git fetch origin develop`, then `git diff origin/develop...HEAD`. An empty diff stops with "branch has no changes vs develop".
2. For every module whose files appear, read `docs/modules/<module>.md` before those hunks.
3. Read surrounding code. Grep call sites (root `CLAUDE.md` code-search rules). Do not review a hunk in isolation.
4. Run the checklist below on the changed code only.

## One module
1. Read `docs/modules/<module>.md`. Extract documented routes, tables, enums, and rules. That list is the checklist.
2. Find the code the doc names. Code wins if they disagree.
3. Flag both directions: code breaking a documented rule, and doc drift (the fix proposal is a doc edit, not a drive-by rewrite).

## Checklist
1. **Auth** — preview/production behavior matches `docs/modules/auth.md`. Do not treat `aws/env/*.env.example` `AUTH_MODE=alb-oidc` as the live setting. `dev-header` stays local.
2. **Tenant isolation** — queries are scoped by `tenant_id` or workspace `scope`. A missing membership for a non-admin is 404, not a data leak (`docs/modules/sites.md`).
3. **Publish split** — public pages read `published`, not draft `settings`, unless `?preview=1` and `access` succeeded.
4. **Origin checks** — state-changing browser posts require `Origin` to match the request URL where the owning module says so.
5. **Secrets** — no keys, connection strings, or filled `docker.env` in the diff.
6. **Infra names** — no CRM Elastic Beanstalk apps or CRM Aurora. Bucket and region checks in `src/aws/env.js` stay intact.
7. **Docs** — a behavior change updates the one module that owns it. `setup.md` and `OPERATIONS.md` are not deleted.
8. **Runtime** — a docs-only diff does not need a product-code change. If product code changed, say which test command should be run. Do not run mutating deploy commands.

## Output

```markdown
## Review findings — <scope>

### [CRITICAL] <one-line defect>
**File:** `path/to/file.js:42`
**Evidence:** <quote>
**Rule:** <module doc or CLAUDE.md section>
**Proposed fix:** <one sentence, not applied>
```

Severity: CRITICAL (auth bypass, cross-tenant read, secret in git), HIGH (broken publish/draft split, wrong env gate), MEDIUM (missing origin check, swallowed error), LOW (doc drift, naming).

End with counts. No findings is a valid result.
