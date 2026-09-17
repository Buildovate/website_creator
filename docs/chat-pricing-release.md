# Website conversations, reviews, pricing and films

This release extends the restored version 14 UI. It does not restore the rejected Creative Expansion composer.

## Where to manage it

Open Websites → Manage a contractor:
- **Live chat**: conversations, replies, human takeover, close conversation, welcome message, factual knowledge, assistant toggle, verified contractor cell phone and SMS alerts.
- **Pricing**: editable page headline, introduction, project options, optional approved prices, inclusions, FAQs, film visibility, draft preview and page toggle. Use Publish changes to publish pricing edits.
- **Reviews**: Google/Yelp profile links, matching business confirmation, provider identifiers, public policy links and featured Google excerpt filter. Publish the review settings after confirming ownership.

Buildovate Settings → Connections reports actual credential availability for AI, SMS, Google Places and Yelp. Existing provider buttons open account setup; they do not imply completed API authorization.

## Current deployment boundaries

No production provider credentials existed when this release was built. Conversations and estimate requests are stored immediately; AI responses, SMS alerts and provider review imports remain unavailable until their credentials are connected. No real text messages or review-provider requests were sent during testing. All provider tests use mock responses.

The platform still uses workspace-restricted Sites access. An external SMS provider cannot reach its signed inbound webhook until a public webhook ingress or suitable public deployment is configured. Do not widen the platform audience just to enable a webhook. Contractors can reply from the responsive website inbox in the meantime.

## Runtime connections

Store keys as Sites server secrets, never in the browser or a contractor settings field:
- `OPENAI_API_KEY`; optional `OPENAI_CHAT_MODEL` (falls back to existing `OPENAI_MODEL`, then `gpt-4.1-mini`). Chat uses Responses with `store:false`, bounded history and no tools. Answers are grounded in published business information and contractor-entered knowledge.
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`. A contractor saves an E.164 phone, requests and confirms a verification code, then enables alerts. Alert replies use the included #reference. Configure POST to `/api/chat/sms` on a publicly reachable host; requests must carry a valid Twilio signature, account, sending number and verified contractor phone. Never configure an unsigned proxy.
- `GOOGLE_PLACES_API_KEY` with Places API (New) enabled. Profile matching returns candidates for confirmation. Public policy links are required for display. Provider data is fetched on demand, not persisted or backed up. Overall ratings remain unfiltered; featured excerpts are labeled and attributed.
- `YELP_API_KEY`. Business IDs are extracted from /biz/ profile URLs. Yelp excerpts require an API plan that includes the reviews endpoint; otherwise the overall rating and profile link remain usable.

## Data and access

Chat has dedicated tenant-scoped thread/message tables. Visitor tokens are hashed at rest, sent only in HttpOnly/Secure/SameSite cookies, and expire after seven days. Every staff inbox operation checks tenant membership and role. Messages are rate-limited; assistant output does not execute actions. A human takeover pauses AI. Inbound provider IDs are unique to deduplicate SMS webhook retries.

SMS codes expire after ten minutes and have five verification attempts. Phone changes invalidate verification. Configuration changes require owner/admin access. SMS transmission acceptance is labeled separately from delivery.

Pricing submissions populate the tenant's inquiries, contacts and Forms & Submissions. They record contact permission without inventing marketing consent. Unapproved price text appears only in authorized drafts. No price promises or completed-project claims are synthesized.

New schema migration is additive. Existing contacts, settings, projects and uploaded assets remain in place. Manual content restores do not delete chat threads.

## Films

Seven 15-second trade films use 1280×720 H.264, fast-start MP4 and muted/looping inline playback. Films pause offscreen and when the page is hidden. Reduced-motion and data-saving preferences keep manual playback. Users can pause and jump between four story chapters. Public “AI-generated” wording has been changed to “Illustrative project”; the people and properties are not presented as actual contractor customers or work. The clips contain no actual prices.

The new clips include assessment, AR-style scope visualization, work/reveal, and a homeowner closing scene. Original clips remain available in the repository. Source references are in project-film-sources.json.

## Verification

- Tenant/session isolation, origin checks, consent, secure visitor cookies, disconnected-provider behavior, AI fallback, human takeover and conversation closing.
- Mocked SMS verification, alert recipient, inbound signature checks and replay deduplication.
- Mocked Google matching, rating/filter integrity, Yelp excerpts and authorized draft reads.
- Pricing form capture, published-vs-draft separation and existing workspace/owner-image regressions.
- Desktop pricing composition, 390-pixel mobile page/chat, and backoffice tab rendering inspected in the managed preview.

## Provider references

- [Google Places attribution and storage rules](https://developers.google.com/maps/documentation/places/web-service/policies)
- [Google Places Text Search](https://developers.google.com/maps/documentation/places/web-service/text-search)
- [Yelp reviews endpoint](https://docs.developer.yelp.com/reference/v3_business_reviews)
- [Twilio webhook verification](https://www.twilio.com/docs/usage/webhooks/webhooks-security)
