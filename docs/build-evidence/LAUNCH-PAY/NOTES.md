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

## PAY-2 changes and protected-file proof

PAY-2 files: `scripts/stripe-sync.mjs`, `src/payments/checkout.ts`, `src/client/workspace/billing.ts`, `tests/stripe-fake.mjs`, `tests/stripe-sync.mjs`, `tests/stripe-checkout.mjs`, `tests/stripe-no-key.mjs`, `.env.example`, `NEEDS-KEYS.md`, and these evidence files.

Command before PAY-2 commit:

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- src/worker.js src/site-polish.js src/website-pages.js src/blog.js src/pricing.js public/site-polish.css src/design-preview-pages.js public/design-preview-pages.css docs/modules/design.md src/qa-gate.js src/qa-page-action.js src/qa-video.js tests/header-logo.mjs tests/header-nav-fit.mjs dist public/templates public/trades 'tests/automatic-qa-*.mjs'
```

Output: empty; exit code 0. The proof command is rerun immediately before the commit.

## PAY-2b protected-file proof

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- src/worker.js src/site-polish.js src/website-pages.js src/blog.js src/pricing.js public/site-polish.css src/design-preview-pages.js public/design-preview-pages.css docs/modules/design.md src/qa-gate.js src/qa-page-action.js src/qa-video.js tests/header-logo.mjs tests/header-nav-fit.mjs dist public/templates public/trades 'tests/automatic-qa-*.mjs'
```

Output: empty; exit code 0.

## PAY-3 migration and protected-file proof

`drizzle/0009_black_wolfpack.sql` was generated from the PAY schema block and trimmed to its 11 PAY statements because the BASE snapshot stops at 0005 while migrations 0006–0008 already create four other tables. The 0009 full-schema snapshot and journal entry remain generated. At merge time, regenerate or verify 0009 against the merged base.

Command before PAY-3 commit:

```powershell
git diff b2446730d551656067f2aaa15a9c27497dceb8f7 -- src/worker.js src/site-polish.js src/website-pages.js src/blog.js src/pricing.js public/site-polish.css src/design-preview-pages.js public/design-preview-pages.css docs/modules/design.md src/qa-gate.js src/qa-page-action.js src/qa-video.js tests/header-logo.mjs tests/header-nav-fit.mjs dist public/templates public/trades 'tests/automatic-qa-*.mjs'
```

Output: empty; exit code 0. Offline signed-event tests: 11/11. Prior Pay tests: 28/28. No real Stripe keys or provider calls.
