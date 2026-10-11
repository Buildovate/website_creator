# All-in sales page — #031A

Status: future-build specification. This page sells **Buildovate plans to contractors**; it is not part of a contractor's public website. Prices and entitlements below are **proposals**, pending the single pricing configuration and #015H approval. Do not hard-code any price, discount, annual amount, stack line or plan inclusion in page copy. Render all of them from versioned pricing config so a change propagates to the hero, receipt, comparison, calculator, sticky bar, FAQ, upgrade path and checkout. Follow [UX-RULES.md](UX-RULES.md). Legal terms belong on `/legal`, linked unobtrusively from pricing.

## Plans and pricing source

| Proposed plan | Monthly | Annual prepay, two months free | Included scope |
| --- | ---: | ---: | --- |
| Website | $50 | $500 | Custom domain, hosting, SSL, reviews display, and all base-site features. |
| Growth | $279 | $2,790 | Website plus exclusive Higgsfield media library, cinematic hero video, AI chat assistant, [Virtual Estimator #029V](VIRTUAL-ESTIMATOR.md), weather-triggered offers, one-tap Spanish, city/area SEO pages, review requests, missed-call text-back and SMS inbox, financing prequalification, promotions, multi-step forms, and the 12-post light social pack. |
| All-in | $449 | $4,490 | Growth plus estimator voice mode, AR “Preview on your home,” AI photo visualizer, Our Work map and project pages, text-a-photo AI triage, seasonal maintenance reminders, [Nextdoor draft flow #030N](../../BUILD-BACKLOG.md), blog and SEO content, and the monthly [social posting pack #030M](SOCIAL-AUTOPOSTING.md). |

No setup fee applies to any plan or add-on. **The website build itself is quoted separately**; show that distinction adjacent to plan prices and in FAQ. Plans do not silently include Buildovate CRM: mark CRM-dependent data and actions with an accurate dependency and show the fallback when a contractor has not connected CRM data. A customer's own domain and content rights, cancellation and export behavior need approved terms before sale.

**Social pack entitlement:** Growth includes the 12-post light pack; All-in includes the full 20-post pack. Both remain subject to the same approved entitlement configuration before sale. The full pack is “also included” in All-in with no dollar value in the receipt until its separate price is final.

## Page sequence

1. **Hero:** One short, specific promise about helping a contractor turn website visits into booked jobs, without promising a result. Show the config-driven All-in monthly price and **See my site** primary / **Book a demo** secondary actions. The visual is a real Buildovate trade site at phone and laptop sizes with the actual Virtual Estimator paused mid-quote. Use a working, permissioned preview; no invented contractor result or fake UI. Keep one clear next step above the fold at 390px.
2. **Animated receipt:** Show each à la carte line and price with a tick, count the running total to the config-derived sum, strike through that sum, then land the All-in price. Pair animation with readable semantic rows. In reduced motion and no-JS, render the **final complete receipt** immediately with the same math and price. Do not animate numbers in a way that hides them from screen readers.
3. **What a homeowner sees:** A short scroll story: finds the contractor site → enters a service/address and gets a price in #029V → previews work on their home with AR where supported → sees full price and real financing payment with APR and term beside it → books an actual available slot or requests a time → receives a permitted text. Show the real feature or an honest, labeled product preview if it is not built yet; do not stage a transaction or lender approval. Use one primary motion per section and no adjacent repeated effect.
4. **Plan comparison:** Website, Growth and All-in columns; emphasize All-in as **Most complete**, not a fake popularity claim. Group rows under **Get found**, **Win the job**, and **Keep them coming back**. Checkmarks correspond to the same entitlement data used by checkout. At 390px, show one plan at a time with a swipeable selector and a sticky, keyboard-operable plan switcher; keep row labels visible and provide Previous/Next controls. A static no-JS table remains fully readable.
5. **Math:** Ask for average job value and close rate. Compute `extra closed jobs = ceil(All-in monthly price / average job value)` and `qualified opportunities at that close rate = ceil(extra closed jobs / close rate)` for valid positive inputs; also show the unrounded revenue calculation in a help note. Clearly label this a **revenue-only illustration using the contractor's own inputs**, not profit, a forecast, or a guaranteed result. The subscription may require more jobs to cover when job costs are considered. Do not default to invented job values or rates; handle blank, zero and invalid inputs. K23 approves the exact disclaimer.
6. **Competitor comparison:** Compare narrowly defined tools and billing terms, never imply feature equivalence or bundle a vendor's unrelated products. Every public figure links to its primary source and displays “Checked on YYYY-MM-DD.” Revalidate at publish and on a scheduled review; hide any stale or unverifiable row. Approved research snapshot below is editorial evidence, not a hard-coded UI data source.
7. **Proof:** Real permissioned contractor results and testimonials only, with source and period. Hide this entire section if none are approved. Never invent a review, logo, contractor count, booking lift or revenue number.
8. **FAQ:** Contracts/cancellation; what “no setup fee” covers versus separately quoted website build; who owns domain, contractor-supplied content and approved media; what happens to connected social accounts/posts on cancellation; fair-use allowances, opt-in SMS top-ups and the price/process for extra hero films; CRM requirement and fallback for CRM-dependent features. Pull current allowance/top-up data from #015H and current terms from `/legal`, with a small Legal link in pricing. Do not invent unapproved top-up or film prices.
9. **Final CTA:** Repeat **See my site** and **Book a demo** with the configured phone number. The path and source tag match the hero's intent but identify this section separately for measurement.

## Proposed All-in à la carte receipt

These editorial input amounts add to **$956 per month**. The runtime computes this total from a single pricing config and validates it against the approved price version; no text literal is copied into the UI. The social posting pack is an unpriced “also included” row and contributes **$0** to this comparison until its à la carte price is final. The difference is **$507**, and `507 / 956 = 53.033…%`, displayed as **53% off buying these items separately** only while all quoted items, periods and availability genuinely match. #015G records cost and margin independently of this customer-facing comparison.

| Item | Proposed monthly à la carte |
| --- | ---: |
| Website plan | $50 |
| Virtual Estimator | $149 |
| Our Work map and project pages | $79 |
| Blog and SEO content | $79 |
| AI photo visualizer | $59 |
| Missed-call text-back and SMS inbox | $59 |
| Exclusive Higgsfield media library | $49 |
| AI chat assistant | $49 |
| City/area SEO pages | $49 |
| Estimator voice mode | $39 |
| AR Preview on your home | $39 |
| Text-a-photo AI triage | $39 |
| Seasonal maintenance reminders | $39 |
| Cinematic hero video | $29 |
| One-tap Spanish | $29 |
| Review requests | $29 |
| Weather-triggered offers | $19 |
| Nextdoor post drafting | $19 |
| Financing prequalification | $19 |
| Promotions | $19 |
| Multi-step forms | $15 |
| **Total of priced items** | **$956** |
| Monthly social posting pack | **Also included; value not counted** |
| **All-in** | **$449** |

## Dated competitor research for comparison candidates

Only these directly sourced examples may enter a future public comparison after an editorial recheck. Compare exact products and billing basis; omit any unverified $500 setup example or unnamed vendor. The user-facing page must link the figure itself to the live source and print its check date.

| Candidate | Figure from vendor's own page, checked 2026-09-25 | Scope note |
| --- | --- | --- |
| [Roofr Instant Estimator](https://roofr.com/pricing) | **$149/month billed monthly**; vendor page also shows an annual-billing equivalent | Estimator add-on, not a complete contractor website. Recheck page toggle before publishing. |
| [Demand IQ Capture](https://www.demand-iq.com/pricing) | **$495/month, paid annually**; higher plans shown separately | Multi-trade lead/quote platform; quote annual billing prominently, not as a month-to-month offer. |
| [Roofle Roof Quote PRO](https://offers.roofle.com/partnerships) | **$350/month plus $2,000 one-time setup** for the cited monthly option | Roof-quote product, not an equivalent All-in bundle. Verify whether the offer is generally available before showing it. |

No competitor row may use a cached price without a current primary-source link, checked date, exact plan/billing term and K23-approved wording. If vendor terms change, the row disappears until reviewed.

## Motion, access, tracking and upgrade path

- Match the Buildovate brand with real product imagery, restrained motion and one primary motion per section. Use a fast first paint, 4.5:1 text contrast, visible focus, semantic controls and 44px touch targets. At 390px, a sticky bottom bar displays the config-driven All-in price and **See my site** without covering content. No-JS and reduced motion keep the entire offer, comparison and calculator explanation readable; the calculator may use a noninteractive worked-free explanation when JavaScript is unavailable.
- Track source-tagged plan views, receipt completion (only after the full value stack was actually viewed), calculator use without leaking private job-value input, plan clicks, demo bookings and checkout starts by plan and page section. Join these to real downstream conversion and #015G cost/margin records; avoid duplicate events on re-entry and distinguish preview/test traffic.
- Website and Growth subscribers see an in-dashboard value stack showing only what an upgrade adds to their current entitlements. Use the same pricing config, current subscription and approved purchase flow; no phantom savings if a feature is already owned or unavailable. #015G compares real upgrade revenue with actual cost per site and bundle.
- Selling rules: no countdowns, invented urgency/scarcity, invented contractor results, reviews or counts. Any savings statement must recompute from the same **$956 vs $449** price version and disappear if the arithmetic or legal approval fails. Do not place legal terms in decorative sections; link `/legal` near pricing.

## Future-build acceptance

Assert prices and entitlement checks match the pricing config in every page/upgrade/checkout placement; 21 priced rows total **$956**, annual prepay is ten months, and the displayed discount rounds correctly to **53%**. Test the receipt sequence and complete reduced-motion/no-JS state; calculator arithmetic, validation and illustration label; current cited/dated competitor rows and stale-row hiding; proof absent with no real data; desktop three-column and 390px one-plan navigation; sticky bar, keyboard/contrast/scroll access; and source-tagged tracking events with no duplicates. Capture desktop and phone evidence. Block publication on unresolved terms, unverified competitor pricing or inconsistent Growth social-posting entitlement.
