# LAUNCH-PAY PAY-1 notes

## Changed files

- `config/pricing.v1.json` — versioned catalog and locked ownership/rental policy.
- `src/platform/catalog.ts` — catalog validation, snapshot, plan entitlement resolution and pure term helpers.
- `tests/catalog.mjs` — PAY-1 coverage.
- `docs/product/PACK3_PRICE_BOOK.md`, `docs/product/PACK4_CATALOG_DELTA.md` — owner-provided, unchanged source inputs.
- `docs/build-evidence/LAUNCH-PAY/STATUS.md`, `NOTES.md`, `results.json` — evidence.

## Protected-file proof before commit

Command (BASE = `b2446730d551656067f2aaa15a9c27497dceb8f7`):

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- src/worker.js src/site-polish.js src/website-pages.js src/blog.js src/pricing.js public/site-polish.css src/design-preview-pages.js public/design-preview-pages.css docs/modules/design.md src/qa-gate.js src/qa-page-action.js src/qa-video.js tests/header-logo.mjs tests/header-nav-fit.mjs dist public/templates public/trades 'tests/automatic-qa-*.mjs'
```

Output: empty. Exit code: 0.

No file in `C:\Users\joe\website_creator` was accessed during this round. Port 5181 and local `.data` were not needed for these pure catalog tests.
