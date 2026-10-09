# Pack 3 — Price Book, entitlements and close timer

Companion to [the U–AA specification](PACK3_UPSELLS_MEDIA_CRM_SPEC.md). **Proposed catalog, not a live checkout or implemented integration.** Prices reproduce the supplied defaults in USD; scopes marked proposed settle unspecified quantities for owner review before activation. All rows start `active:false`; activate only after fulfillment exists and commercial terms are approved. Catalog changes never rewrite accepted invoices.

## Common product fields

Every SKU has `version`, `name`, the customer-facing description below, integer `unit_price_cents`, `currency:USD`, `category:Website Add-ons`, `billing`, `tax_code:requires_configuration`, `fulfillment_code`, versioned `entitlements`, `active:false`, picker `sort` and `timer_eligible`. Taxes must be configured for the business/product/customer before checkout; do not assume every line is tax-free. Display prices below exclude any configured taxes and client ad spend.

Sort groups: 100 videos, 200 creative, 300 distribution/content, 400 seasonal, 500 future operations/growth. Favorite Standard, Extra and Bundle. Base website is a separate category and scope; $700 is the supplied bundle comparison assumption, not a newly established universal site price. Codes below name proposed fulfillment handlers, not functions claimed to exist today.

## Included website capabilities

- Genuine customer-video module, real uploads, captions/placement controls and post-job request templates are included; templates do not include SMS sending or provider fees.
- A neutral empty public state does not expose commerce. AI explainers and genuine customer stories have separate public labels/sections even when managed in the same media panel.
- Existing template imagery, template films, baseline About treatment, default service pages and ordinary earned-promotion unlock remain included. A paid creative upgrade cannot erase an included baseline feature.
- Proposed U launch quota: one initial promotional graphic set per website, four aspect variants, with technical corrections included. The paid three-pack grants three additional distinct offer sets. Saving later offers preserves usable text/layout even if artwork awaits credits; saving is not a purchase. Owner artistic regeneration consumes a separately disclosed available credit; no unpriced automatic charge.
- Contractor uploads never consume AI generation credits. Transcoding/storage limits apply consistently and must be visible before upload; increasing AI slot count alone never bills anything.

## Video and website bundle products

| SKU | Customer-facing description / pitch | Price / billing | Fulfillment code | Exact entitlement and boundary |
|---|---|---|---|---|
| `AI-UGC-PACK` | AI Spokesperson Video Pack — explain two services with clearly labeled AI presenters. | $197 once | `video.pack.standard` | 2 finished 15–30s videos, captions/posters/site placement, 1 owner-requested regeneration per video; no fictional customer endorsement. |
| `AI-UGC-PACK-PLUS` | Video Pack Plus — the same two videos with priority and more creative revision room. | $297 once | `video.pack.plus` | Standard entitlement plus 2 extra shared regenerations (4 total), one light polish pass, 24–48h target after complete inputs/approval; capacity-dependent target, not guaranteed delivery. |
| `AI-UGC-EXTRA` | Add one more AI service explainer. | $79/video | `video.extra` | One additional finished video; proposed 1 regeneration for that extra video. Requires a pack or existing eligible pack ownership. Real uploads need neither. |
| `AI-UGC-REFRESH` | Refresh the AI videos you already own for a new season. | $97/order | `video.refresh` | Snapshot eligible owned AI slot IDs at purchase, replace each once with new script/seed, preserve old live version until approved. No extra slots or perpetual regeneration; normal cadence about 90 days. Hard operational ceiling 24 slots until a larger quote is approved. |
| `WEB+UGC-BUNDLE` | Website + two AI service explainers in one package. | $849 once | `website.video.bundle` | Contracted base website plus Standard video pack, not Plus. Separate component grants for reconciliation. Fixed price excluded from timer; $48 less than the supplied $700 + $197 comparison. |

Standard and Plus are alternatives. An upgrade credits the verified existing purchase through a dedicated adjustment; never blindly grants another pack. Bundled Standard must not also be billed as a separate Standard line. Owned credits remain tied to that website/tenant.

## Creative products

| SKU | Customer-facing description / pitch | Price / billing | Fulfillment code | Included scope / boundary |
|---|---|---|---|---|
| `AI-ABOUT-PORTRAIT` | An additional custom About portrait treatment that fits your brand. | $99 once | `creative.about.portrait` | Proposed 2 coordinated crops of one approved portrait concept + 1 regeneration; consenting real person or explicitly illustrative model, never a fictional employee identity. Additional to Pack 2 baseline. |
| `AI-PROMO-GRAPHICS-PACK` | Make your next three offers look ready for the spotlight. | $129/pack | `creative.promo.three` | 3 distinct offer graphic sets with four variants each; one set is one credit, not four. Technical corrections included; no unlimited artistic revisions. |
| `HIGGS-SHORT-CUSTOM` | A custom 13-second service story for your brand. | $149 once | `creative.short.custom` | 1 original 13s concept, finished 16:9 and 9:16 reframes/captions, one consolidated edit round; beyond included template film. |
| `HIGGS-SHORT-ADS-3` | Three concise service/offer films ready to review for ads. | $297/pack | `creative.short.ads3` | 3 distinct 13s films and platform exports; does not include publishing, campaign management, media spend or guaranteed ad approval. |
| `AR-PREVIEW-PACK` | Help homeowners explore supported design options with AR. | $179 once | `creative.ar.enable` | Actual compatible AR viewer and approved trade asset pack required; a video alone does not fulfill this. Inactive until supported devices, asset count and acceptance test are defined. |
| `CITY-PAGES-EXTRA-5` | Build relevant pages for five additional service areas. | $99/pack | `pages.city.5` | 5 confirmed, differentiated city pages beyond the five base footer cities; footer stays at five selected links. No ranking promise. |
| `CITY-PAGES-EXTRA-10` | Extend useful service-area coverage to ten more cities. | $179/pack | `pages.city.10` | 10 additional city pages; same truth/uniqueness gates. No automatic claim the contractor serves every nearby city. |
| `TRUST-SETUP-DONE` | Get your real credentials and review-profile links organized. | $79 once | `trust.concierge` | One setup pass for supplied verifiable profile/credential links; no purchase of reviews, badge licensing or invented ratings. |
| `PROMO-UNLOCK-PRO` | Give your earned offers a more polished reveal. | $79 once | `promo.unlock.pro` | Premium themes and configured fixed-reward spin presentation; baseline unlock stays included. Pack 2 task/reward validation still applies. |
| `EBOOK-CUSTOM` | A custom guide for your trade and offer. | $149 once | `creative.ebook.custom` | Proposed one 8-page PDF, title/cover and one consolidated content revision; verified contractor facts, accessible export. |
| `RUSH-LAUNCH-48H` | Move a ready project into the priority production queue. | $151 once | `operations.rush48` | 48h target from confirmed complete inputs and available capacity; exclusions/clock stated at purchase. No approval, DNS or external review guarantee. |
| `BRAND-KIT-EXPAND` | Give your next campaign more visual variety without losing the brand. | $99 once | `creative.brand.expand` | Proposed one alternate accessible palette, 2 patterns and 3 OG compositions; existing logo is preserved. |
| `MONTHLY-CREATIVE` | Keep your creative current with a small monthly production allowance. | $197/month | `creative.monthly` | 1 offer graphic set + either 1 custom Short OR 1 refresh of eligible owned AI slots each paid month. Choose before dispatch; not both. Distribution separate. |

## Media and recurring presence

| SKU | Customer-facing description / pitch | Price / billing | Fulfillment code | Included scope / boundary |
|---|---|---|---|---|
| `MEDIA-CONNECT` | Connect the accounts and location your business actually uses. | $149 once | `media.connect` | Proposed one business: one Facebook Page, Instagram professional account and GBP location; verify ownership/access and map destinations. Connection does not confer publishing subscription or platform approval. Additional businesses/locations quoted separately. |
| `MEDIA-PUBLISH` | Approve your content and send it through a managed publishing queue. | $97/month | `media.publish` | Proposed up to 30 unique approved content units/month, up to the 3 connected v1 destinations each; crossposts and technical retries do not consume extra units. Existing eligible media, no new custom production included. |
| `JOBSITE-PUBLISH` | Turn approved job photos into useful project-map stories and optional posts. | $79/month | `media.jobsite` | Proposed up to 20 selected projects/month, up to 10 photos each. Map drafting/publication and one optional social/GBP post per project included under this SKU's jobsite-only entitlement, so Media Publish is not double-required for these posts. External channels still need setup, permission and capability. |
| `DISTRIBUTE-UGC` | Distribute an existing approved video pack once. | $49/batch | `media.video.batch` | One identified pack of 2–6 videos, each to selected supported connected destinations once; actual platform suitability governs. No video generation or ongoing subscription. Duplicate retries free. Larger owned refresh sets are not automatically a six-video distribution pack. |
| `CONTENT-MONTH` | A full month of ready-to-review local content. | $297/month | `content.month` | 22 creative units: 14 feed posts + 4 GBP updates + 4 Story/Reel ideas, captions/alt/briefs/schedule. Feed/GBP units receive reusable approved imagery or finished still assets before marked ready; four ideas are scripts/shot lists, not completed videos. Export included, external publishing separate. |
| `CONTENT-MONTH-PRO` | The monthly plan with four finished short videos. | $497/month | `content.month.pro` | Same 22 units, with the 4 ideas fulfilled as 4 finished Shorts/Reels; 4 GBP updates already included, not four extra duplicate posts. Light monthly results note; no guaranteed reach/leads. Provider credits budgeted by service, not assumed free through Ultra. |
| `PRESENCE-BUNDLE` | Monthly content and publishing in one service. | $397/month | `presence.bundle` | Content Month + Media Publish entitlements; Connect $149 once separate unless explicitly waived in signed terms. Components total $394; **do not claim this $397 price saves money**. Convenience packaging, no invented bonus. |

The 30-content-unit publishing cap and 20-project jobsite cap are proposed operational defaults, not source locks. Show them in checkout before activating these SKUs. A content unit delivered to three destinations is one creative unit with three independently tracked delivery attempts. Jobsite and calendar drafts can reference the same approved media without billing twice for the same creative generation.

## Seasonal and future-pack catalog placeholders

These supplied prices are recorded for continuity. Pack 4 is now received: its [catalog delta](PACK4_CATALOG_DELTA.md) supplies detailed seasonal/creative/growth/ads/email scope and supersedes the specific placeholders below. Products remain unavailable to sell until implemented and activated.

| SKU | Customer-facing description / pitch | Price / billing | Fulfillment code | Scope or activation gate |
|---|---|---|---|---|
| `SEASONAL-DROP` | Choose a timely offer and receive the creative to present it. | $129/drop | `seasonal.drop` | Propose 2–3 ideas, fulfill 1 owner-selected offer with one graphic set and copy. No automatic discount invention or publication. |
| `SEASONAL-DROP-VIDEO` | Add a 13-second film for that seasonal offer. | $79/add-on | `seasonal.drop.video` | 1 Short attached to one paid Drop; not a standalone monthly service. |
| `SEASONAL-PASS` | Plan a year's seasonal creative in advance. | $497/year | `seasonal.pass` | Proposed 8 drops/year, zero included videos; optional videos $79 each. Resolves the supplied 6–8 / optional-two ambiguity explicitly. Scope retained by Pack 4; first paid year is explicitly timer-eligible, renewal full price. |
| `SEASONAL-PASS-PRO` | Pair each seasonal drop with a short film. | $797/year | `seasonal.pass.pro` | Proposed 8 drops + 8 attached Shorts/year; external queueing requires publishing entitlement, permission and current approvals. |
| `WEATHER-HOME-PRO` | Configure service suggestions around relevant weather. | $79 once | `weather.rules.pro` | Advanced rules pack; verified conditions and owner-approved content, no invented emergency or automatic ad budget. Pack 4 gate. |
| `STORM-COMPANION-PRO` | Prepare a storm-response page and follow-up materials. | $99 once | `storm.companion.pro` | LP, checklist PDF, SMS drafts; sending and insurance advice not included. Pack 4 gate. |
| `JOB-BINDER` | Assemble completed-job information into a customer binder. | $97/month | `job.binder.month` | Unlimited eligible completed-job binders per Pack 4, subject to disclosed file/retention/abuse limits; actual CRM adapter and secure delivery still required. |
| `JOB-BINDER-ANNUAL` | Prepay the same binder service annually. | $497/year | `job.binder.year` | Billing variant of `JOB-BINDER`, never grant both. Preserve supplied annual price despite large difference from $1,164/year monthly; verify sustainable volume before activation. |
| `REFERRAL-ENGINE` | Track a clear customer referral program. | $79/month | `referral.engine` | Give/get links and tracking; reward funding, terms and delivery rules still require Pack 4. No positive-review reward conditioning. |
| `LANG-ES` | Make the base website and its forms useful in Spanish. | $149 once | `language.es` | Full contracted base-site content/forms, language switch and human QA; no machine-only publish. Additional future content translation separately scoped. |
| `CREW-QR-KIT` | Give one crew or placement a useful scannable destination. | $79/kit | `crew.qr.base` | Proposed one QR lander + print-ready truck/yard PDF artwork; physical printing/install not included. |
| `CREW-QR-EXTRA` | Add another tracked QR destination. | $19/unit | `crew.qr.extra` | Additional lander/code and artwork variant attached to base kit; public content/privacy controls unchanged. |
| `HOA-PACKET` | Organize repeat HOA/ARC submission packets. | $149/month | `hoa.packet.month` | Pack 4 proposes 10 source-backed packets/month plus one consolidated revision each; owner must approve quantity before sale. No HOA approval guarantee. |
| `HOA-PACKET-SINGLE` | Prepare one HOA/ARC submission packet. | $29/packet | `hoa.packet.single` | One job packet; not an unlimited revision or submission service. Pack 4 defines contents. |
| `COMPARE-PRO` | Explain your approach with a clear, fair comparison. | $49 once | `compare.pro` | Copy polish and purposeful motion; no unverified competitor claims. |
| `ANALYTICS-CONNECT` | Set up agreed measurement and a useful dashboard. | $79 once | `analytics.connect` | GA4/account mapping and dashboard setup when implemented; consent/privacy configuration and owner access required, no silent tag insertion. |
| `GROWTH-PLAN` | Maintain a focused growth plan with monthly insights. | $197/month | `growth.plan` | Research, recommendations and approved automation plan; define concrete monthly deliverables in Pack 4. No unbounded execution or promised revenue. |
| `GROWTH-PLAN-PRO` | Coordinate the growth plan with your content and seasonal work. | $397/month | `growth.plan.pro` | Plan + content coordination, seasonal priority and monthly video note; does not silently grant the separate $297 Content Month production service. |
| `ADS-CONNECT` | Connect the ad accounts you own and verify the setup. | $149 once | `ads.connect` | Meta/Google account connection, pixel/tag assistance and billing-profile link; no advertising spend authorization. |
| `ADS-CREATIVE-AUTO` | Adapt approved media into monthly ad variations. | $97/month | `ads.creative` | Proposed 6 variants/month drawn from approved assets (within supplied 3–6 guide), not six new custom videos; paid-ad usage consent required. |
| `ADS-LAUNCH` | Prepare one campaign for owner review. | $79/campaign | `ads.campaign.draft` | One configured/QA'd **draft** with geography, creative and landing page. Publishing/spend needs separate authorized budget. |
| `ADS-MANAGE` | Review and adjust campaigns within an approved budget. | $297/month + client ad spend | `ads.manage` | Creative refresh, authorized changes and weekly note; scope/platform/campaign count defined before activation. Hard owner budget caps and pause controls. |
| `ADS-MANAGE-PRO` | Coordinate managed ads with approved job and offer content. | $497/month + client ad spend | `ads.manage.pro` | Manage + job/seasonal coordination and permitted CRM offline-conversion assistance; sensitive data minimization, consent and actual connectors required. |
| `CRM-CONNECT-WEBSITE` | Connect website leads and approved project proof with your existing CRM. | **Proposed $149 once** | `crm.website.connect` | Guide band $99–$249; final amount owner-set. Setup for one organization and two approved pipes; existing eligible CRM access required. Not a CRM subscription, not a license promise, not authorization to edit the separate CRM. |

Pack 4 explicitly permits the first-year Seasonal Pass/Pro timer discount and unlimited eligible Job Binders under disclosed limits. No other annual discount, free connection on prepay, quota rollover or unlimited usage is implied. Record any separate approved waiver and fulfill setup once.

## Invoice and entitlement wireflow

1. Assigned rep selects contractor/website and a base package or bundle; picker lists active products with exact scope, price and cadence. Optional Standard/Plus and extras are mutually checked; all entitlement overlaps are summarized.
2. Draft contains immutable SKU version references, quantities, line totals, configured taxes, one-time versus recurring amounts and next billing dates. Rep cannot type an arbitrary fulfillment grant.
3. Customer receives the versioned proposal. A dedicated **Present decision offer** action starts the server timer once; merely browsing the internal catalog does not.
4. Customer locks eligible lines before expiry. Changing quantity, product or scope creates a new accepted snapshot; new lines after expiry use list price. Remove/re-add does not restart a clock. A rep checking a box alone is not customer acceptance.
5. Signed agreement reserves the plan. Verified settled payment or approved credit terms grant entitlements, once per payment/invoice-line event; manual label changes do not.
6. Creative jobs reserve credits atomically, consume on valid completion, release on technical failure. Owner-requested new directions use disclosed regeneration credits. Publishing uses a separate entitlement and content approval.
7. Website Purchased Add-ons is read-only from the ledger: granted/reserved/used/remaining, period, invoice reference and delivery state. Failed sync never guesses the customer has paid; show Pending confirmation.

Rep flow: “Your site includes real customer video uploads. If you want two clearly labeled AI service explainers ready at launch, the pack is $197. Extra videos are $79 each. With the eligible website package, the combined price is $849.” After that decision, offer one relevant secondary attach: “Would a custom About portrait help?” or “Would you like a monthly content plan and publishing?” Do not stack every product into a single pitch.

## Timer rules and arithmetic

State machine: `draft → running → locked_in` or `expired`; manager cancel/override is separately audited, never a hidden reset. Use server UTC, 900 seconds and 1,000 basis points (10%). UI shows MM:SS using server offset and refreshes on reconnect. Acceptance at or after expiry is list price; replayed requests cannot extend or lock stale invoices.

All activated one-time add-on rows are eligible unless expressly excluded; monthly rows discount the **first paid month only**. Bundle and base website are excluded. The first paid year of Seasonal Pass/Pro is timer-eligible under Pack 4; other annual/prepaid rows remain `timer_eligible:false` unless a distinct rule is approved. Seasonal renewals stay full price. Display renewal price as prominently as the first payment. Accepted prices remain valid for a proposed 24-hour payment window shown on the locked quote; expired unpaid quotes require a new explicit pricing decision, not silent billing. This payment deadline does not restart the 15-minute decision window or grant credits.

Use integer cents: `discountCents = floor((eligibleLineSubtotalCents * 1000 + 5000) / 10000)` (half-up per line). Round each line discount once; compute configured tax on the appropriate taxable basis through the billing system. No floating point or discount-on-discount.

| Example, before tax | List | Decision-window amount | Renewal / explanation |
|---|---:|---:|---|
| Standard 2 videos | $197.00 | $177.30 | Once; above the approximately $149 manager floor |
| Plus 2 videos | $297.00 | $267.30 | Once |
| Extra 1 video | $79.00 | $71.10 | Once |
| Standard + 1 extra (3 total) | $276.00 | $248.40 | 2 + 1 grants |
| Standard + 2 extras (4 total) | $355.00 | $319.50 | 2 + 2 grants |
| Standard + 4 extras (6 total) | $513.00 | $461.70 | 2 + 4 grants |
| Fixed $849 bundle + 2 extras | $1,007.00 | $991.20 | Only $158 extras discounted; bundle stays $849 |
| Media Publish first month | $97.00 | $87.30 | $97/month thereafter |
| Connect + first Presence month | $546.00 | $491.40 | $134.10 setup + $357.30 first month; renews at $397/month |
| Seasonal Pass annual | $497.00 | $447.30 | First paid year only under Pack 4; renewal $497 |

Microcopy: **“Decision discount: 10% off eligible add-ons locked before this timer ends. Monthly plans renew at the regular rate. Website and fixed bundles excluded.”** After locking: show exact accepted amount, renewal and payment deadline. After expiry: show list price, not a paused 00:01. The optional later follow-up window is off; sending email/SMS is a separate authorized action and cannot silently revive an offer.

Audit: deal/tenant/rep/customer identifiers, offer ID/revision, server start/expiry/acceptance, accepted line hashes/SKU versions/quantities, list/discount/tax totals, payment deadline, override actor/reason/prior offer, signature/verified payment references. No passwords, tokens or raw payment details in the audit stream.

## Failure, refunds and renewal rules

- Deduplicate provider payment events; reconcile uncertain transactions before fulfilling. Handle out-of-order charge/refund events through net settled amount and entitlement state.
- Failed/pending payment grants nothing. Partial payment grants only the explicitly settled milestone's scope; do not infer every line is funded from a deposit.
- Refund of unused work revokes unused credits. Consumed work requires the agreed refund policy/finance review, not automatic deletion of a customer's published site. Record adjustment and any remaining obligations.
- Subscription quota grants once per paid period; proposed unused production credits do not roll over. Reserve jobs before period end, allow those jobs to complete during a documented grace window, and expose expiry before purchase. Never charge for automatic overages.
- Cancellation stops next renewal and new fulfillment after the paid period. Previously approved website media remains unless rights expire or the owner removes it. External queue jobs after entitlement expiry pause; already published posts do not vanish just because a subscription ends.
- Disconnecting OAuth cancels future delivery to that account; it does not cancel billing silently. Show both controls and current renewal date. Revoked content permission overrides every paid entitlement immediately.
- Invoice changes, price updates and permission changes use immutable versions; reconciliation can replay safely without duplicate videos, posts, invoices or customer leads.
