# Module: <name>

<!-- Keep this doc terse and factual. Read it before touching this module.
     Update it when routes, tables, pages, or rules change.
     One home per fact: point at setup.md, OPERATIONS.md, and docs/ENVIRONMENTS.md
     instead of copying them. Never invent endpoints, env vars, or resource names. -->

## Purpose
One or two sentences: what this module does and who uses it (public site, workspace, or both).

## Server
- **Routes**: method + path + one-line purpose. Write "none" if this module has no HTTP surface.
- **Tables**: name + key fields + non-obvious semantics.
- **Code**: files that own the behavior.
- **Auth**: which identity and role can do what. Point at `docs/modules/auth.md` for `AUTH_MODE`; do not restate it.

## Browser
- **Pages**: path + purpose. This app serves HTML from the Worker and scripts in `public/`, not a separate React app.
- **Scripts / data**: `public/` files this module owns.
- **Calls**: which server routes the browser hits.

## Business rules
Rules the code does not make obvious. If a rule lives in `OPERATIONS.md` or a release note, link that file and state only the invariant.

## Gotchas
Traps, legacy quirks, and things that look wrong but are intentional. Mark unknowns as unknown. Do not guess.

## Related modules
Modules this one depends on or feeds.

## Sources
Files this doc was mined from. Those files stay; this doc is the domain summary.
