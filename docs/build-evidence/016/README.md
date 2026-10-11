# #016 — Persist quiz completion evidence

Completed locally on 2026-09-26, branch feature/local-environment-setup. No push, deployment, staging access, live vendor connection or paid usage. **Higgsfield credits used: 0.**

## Specification and reused behavior

Read the complete root BUILD-BACKLOG.md #016, its referenced Pack 2 section T, UX-RULES.md and the owning module guidance. docs/product/BUILD-BACKLOG.md is a master-backlog pointer with an older #004X summary; it contains no #016 definition. The root ticket is authoritative and was followed.

Existing work already supplied the configured one-question quiz, published-snapshot reads, enabled/start/end eligibility, service matching, origin checks, locked reward HTML, private noindex draft previews, and a static no-JavaScript contact fallback. These were verified and reused. #016 adds durable evidence and replay/rate-limit handling, rather than building Pack T's entire future challenge library, proof moderation or redemption system. The referenced pack's broader countdown/inline-legal directions were not introduced: the current user rules require no fake urgency and legal wording only on /legal. Success feedback is plain operational copy; offer terms remain linked to /legal.

## What changed

- Migration 0006 and Drizzle schema add promotion_completions and promotion_unlock_limits. A completion contains tenant, offer, immutable offer revision, tenant-bound browser hash, question/choices/selected answer, score, optional validated service, completion timestamp and offer expiry. No raw browser token, IP address or plaintext reward code is stored in the receipt.
- Successful verification atomically writes one scoped receipt and one audit event before returning any reward code. A unique database scope makes concurrent requests idempotent. Replays return the existing receipt; expiry, changed published configuration, withdrawn offers and persistence failures cannot reveal a code. The server rechecks publication and expiry after saving.
- Durable fixed-window limits allow 8 requests per offer/browser and 100 per tenant in 15 minutes, including the initial session-start request. Atomic quota updates resist concurrent overrun. The tenant budget also bounds cleared/forged cookies; forwarding/IP headers are not trusted. Exhausted requests return 429 and Retry-After. Expired quota rows are cleaned up.
- Both existing public quiz clients establish a random HttpOnly, SameSite=Strict browser cookie before submitting an answer; HTTPS adds Secure and the cookie path is restricted to that tenant's unlock endpoint. This preserves the receipt identity when a first successful response is lost. No token is exposed to client JavaScript. The legacy service quiz's only change is this shared endpoint handshake; its design and sample-preview transport are unchanged.
- The Promotions page has designed missing-answer, checking, saved/reference, already-completed, error, offline/retry and rate-limit feedback. The answer remains selected after a retryable failure. The code is cleared during checking/errors and only appears with a confirmed receipt. Focus and live-region feedback, 44px controls, a clear next contact action, reduced-motion content and the existing no-JavaScript fallback remain usable at 390px. The offer-terms link received a scoped 44px target fix.
- No public template redesign, homepage/drone change, Expenses & Margin change, new vendor integration or paid generation. No fabricated reviews, prices or live offers. Test promotions are clearly labeled QA TEST FIXTURE in disposable local databases; they are not customer content.

## Verification

| Check | Result |
|---|---|
| Build / typecheck | Pass |
| Regression scripts | 57 passed (56 existing + new #016 suite) |
| New server regressions | 64 passed |
| Browser suites | All 9 passed (8 existing + new #016 suite) |
| New #016 browser checks | 94 passed; zero browser exceptions |
| Platform mobile suite | 204 desktop/phone states passed |
| Template asset integrity | 604 referenced files / 17 kits passed |
| Vite restart / affected routes | Four HTTP 200 checks; locked responses contain no reward code |

See checks.json, final-checks.json, regression-results.json, browser-results.json, existing-browser-checks.json, platform-mobile-audit.json and route-check.json. Individual suite logs and copies of regenerated suite result files are retained here. Existing regression files were not edited. The deliberately simulated database failure prints an expected diagnostic in promotion-unlocks.log; its assertions pass and confirm no code/receipt escapes.

New coverage includes method/origin/body/preview validation, tenant and service isolation, correct and incorrect answers, upcoming/ended/unpublished offers, revised offers, persisted receipt expiry, scoped replay, missing/failed writes, cookie-reset limits, rate-window expiry, concurrent first completions and retries, and a lost first-success response followed by recovery of the same receipt. SQLite server tests and the PostgreSQL-compatible browser fixture both apply the new migration. Browser checks also verify 44px targets, no horizontal page overflow, noindex/disabled previews and no-JavaScript content.

Vite was restarted with exactly: node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173. Local fixture routes /s/quiz-016-local/promotions, its ?preview=1 view, /s/quiz-016-local/legal, and POST /api/public/quiz-016-local/promotion-unlock (session start) all return 200. This uses the disposable local preview database, not a deployed site.

## Screenshots

28 genuine full-page PNG captures use desktop 1440×900 and phone 390×844 viewports. Each state has its own capture. The final saved/error layouts were visually reviewed; full-page captures include the complete receipt and next action. Reduced motion is enabled during browser capture; the quiz itself has no motion dependency.

- [locked-desktop.png](locked-desktop.png)
- [incomplete-desktop.png](incomplete-desktop.png)
- [incorrect-desktop.png](incorrect-desktop.png)
- [checking-desktop.png](checking-desktop.png)
- [saved-desktop.png](saved-desktop.png)
- [already-completed-desktop.png](already-completed-desktop.png)
- [error-desktop.png](error-desktop.png)
- [offline-desktop.png](offline-desktop.png)
- [retry-saved-desktop.png](retry-saved-desktop.png)
- [rate-limited-desktop.png](rate-limited-desktop.png)
- [ended-during-quiz-desktop.png](ended-during-quiz-desktop.png)
- [expired-desktop.png](expired-desktop.png)
- [preview-desktop.png](preview-desktop.png)
- [no-js-desktop.png](no-js-desktop.png)
- [locked-phone.png](locked-phone.png)
- [incomplete-phone.png](incomplete-phone.png)
- [incorrect-phone.png](incorrect-phone.png)
- [checking-phone.png](checking-phone.png)
- [saved-phone.png](saved-phone.png)
- [already-completed-phone.png](already-completed-phone.png)
- [error-phone.png](error-phone.png)
- [offline-phone.png](offline-phone.png)
- [retry-saved-phone.png](retry-saved-phone.png)
- [rate-limited-phone.png](rate-limited-phone.png)
- [ended-during-quiz-phone.png](ended-during-quiz-phone.png)
- [expired-phone.png](expired-phone.png)
- [preview-phone.png](preview-phone.png)
- [no-js-phone.png](no-js-phone.png)

## Preservation and limits

Backed up and restored 1081 prior evidence files after all suites finished. All 262 unrelated modified/untracked file hashes match the starting inventory. Newly generated files in older evidence folders were moved into this ticket's regenerated-extra directory. See preservation.json. Expenses & Margin source/history and its tests remain unchanged.

The receipt proves this anonymous browser completed the configured quiz; it does not verify a person's identity, prove one-per-household eligibility, authorize a discount or record redemption. Clearing cookies can create another browser scope within the tenant quota. Those are explicit limits, not claims of stronger verification. No external keys are needed. Nothing remains unfinished within #016's scoped acceptance criteria; no live deployment/migration was attempted. #017 is the next numbered ticket and was not started; previously queued #015F remains unchanged.
