# Module: engagement

## Purpose
Visitor chat, review profiles, and the public pricing page, plus the provider connections those features check. Follow-up sequences that do not send are `workspace.md`. This module is the live conversation and the provider adapters.

## Server
- **Routes**:
  - `GET|POST /api/public/:slug/chat` and `.../chat/start|message|handoff` (`src/engagement.js`). Published tenant only. Chat must not be `enabled: false`.
  - `POST /api/chat/sms` — Twilio inbound. Requires `TWILIO_AUTH_TOKEN`, a valid `x-twilio-signature`, matching `AccountSid` and `To`.
  - `/api/engagement/:tenant/config|threads|verify-phone|confirm-phone|connections` and thread id when present. `GET` is `read`. Thread writes are `write`. Config changes are `owner`.
  - `GET /api/public/:slug/reviews` — published, or `?preview=1` with `access`. Requires `reviews.confirmed`. Daily audit cap 100 (`reviews.requested`).
  - `POST /api/engagement/:tenant/review-lookup` — `write`. Google lookup cap 10 per hour when `GOOGLE_PLACES_API_KEY` is set (`src/reviews.js`).
  - `GET /api/engagement/:tenant/pricing` — member. `GET /s/:slug/pricing`. `POST /api/public/:slug/pricing-inquiry` (`src/pricing.js`).
- **Tables**: `chat_threads` (tenant, hashed visitor token, `reference` unique, `status` default `open`, `human`, `message_count`, `ip_hash`, `notification` default `not_requested`, `expires_at`) and `chat_messages` (`sender`, `body`, unique `provider_id`). Review and pricing settings live in tenant settings JSON (`reviews`, `pricing`), not in their own tables. Pricing inquiries are written as site inquiries and contacts (`docs/chat-pricing-release.md`).
- **Code**: `src/engagement.js`, `src/reviews.js`, `src/pricing.js`, `src/hero-contact.js`, `public/visitor-chat.js`, `public/reviews.js`, `public/pricing.js`, `public/engagement-ui.js`.
- **Auth**: public chat and reviews do not use platform login. Staff inbox actions use tenant `access`. SMS webhook uses the Twilio signature, not a user session.

### Provider flags
`connectionState` (`src/engagement.js`):

| Flag | True when |
|---|---|
| `ai` | `OPENAI_API_KEY` is set |
| `sms` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` are all set |
| `google` | `GOOGLE_PLACES_API_KEY` is set |
| `yelp` | `YELP_API_KEY` is set |

Zoom is separate: `zoomStatus` in `src/zoom.js` (global calendar only). See `workspace.md`.

`GET /api/workspace/:scope/connections` reports the same style of flags for the settings screen. Saving a preference does not connect an external account (`CRM-RELEASE.md`).

Chat model: `OPENAI_CHAT_MODEL`, else `OPENAI_MODEL`, else `gpt-4.1-mini` (`docs/chat-pricing-release.md`). Chat calls `https://api.openai.com/v1/responses` with `store: false` and no tools. Answers are limited to published business facts plus contractor-entered knowledge. Human takeover (`human`) pauses AI.

Visitor cookie: `bvchat_{tenantId}`, HttpOnly, Secure, SameSite=Strict, path scoped to the chat API, max-age 604800 (seven days).

SMS: contractor saves an E.164 number, confirms a code (expires in ten minutes, five attempts), then enables alerts (`docs/chat-pricing-release.md`). Inbound replies must include `#` plus the thread reference. Phone changes invalidate verification.

Reviews: Google and Yelp profile URLs are HTTPS and host-allowlisted in `cleanReviews` (`src/reviews.js`). Google Place ID and Yelp business id are optional stored identifiers. Yelp id can be parsed from `/biz/{id}`. Privacy and terms URLs must be HTTPS when set. Excerpts are fetched on request and are not stored (`DESIGN_RESEARCH.md`). Source links work without API keys. Live excerpts need the keys.

`RESEND_API_KEY` is an accepted env name (`.env.example`, `src/aws/env.js`). `.env.example` says campaign delivery stays held until a delivery worker exists. No Resend send function is part of this module's chat path.

## Browser
- **Pages**: chat widget on the published site, reviews section, `/s/:slug/pricing`, workspace Live chat / Pricing / Reviews (`docs/chat-pricing-release.md`).
- **Scripts / data**: `public/visitor-chat.js`, `public/reviews.js`, `public/pricing.js`, `public/engagement-ui.js`, `public/engagement.css`, `public/reviews.css`, `public/pricing.css`.
- **Calls**: the public and `/api/engagement/` routes above.

## Business rules
- Chat on an unpublished site returns 404 (`Website unavailable.`).
- Closed threads reject new visitor messages.
- Pricing submissions record contact permission and do not invent marketing consent. Unapproved prices stay on authorized drafts (`docs/chat-pricing-release.md`).
- Do not widen Sites sharing just to receive the Twilio webhook (`docs/chat-pricing-release.md`). Contractors can reply from the workspace inbox without it.
- Google overall rating is not recomputed from filtered excerpts (`OPERATIONS.md`, `DESIGN_RESEARCH.md`).
- No production provider credentials were present when `docs/chat-pricing-release.md` was written. Whether keys are set on preview or production now is an environment property, not something this repo records.

## Gotchas
- `AUTH_MODE=disabled` on preview and production means workspace replies still require a user (`identity()` → 401) until auth is turned on. Public chat does not. See `auth.md`.
- Twilio signature base is the full request URL. A proxy that changes the URL breaks verification.
- Tests for SMS, Google, and Yelp use mocks (`docs/chat-pricing-release.md`). They are not evidence that live accounts are connected.
- Unknown: live webhook URL reachability and which provider keys are set on EB. Not in git.

## Related modules
`sites` (published snapshot and inquiries), `workspace` (follow-up drafts, connections screen, Zoom), `auth` (staff inbox), `design` (pricing films).

## Sources
`src/engagement.js`, `src/reviews.js`, `src/pricing.js`, `src/worker.js`, `src/zoom.js`, `db/schema.ts`, `docs/chat-pricing-release.md`, `DESIGN_RESEARCH.md`, `CRM-RELEASE.md`, `OPERATIONS.md`, `.env.example`, `src/aws/env.js`.
