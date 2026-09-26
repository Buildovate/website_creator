# Virtual Estimator — flagship specification (#029V)

Status: planned, not implemented. The visuals receive a later Astra High review/build. Applies to all 17 trade families, with trade-specific questions, imagery and pricing. Follow [UX-RULES.md](UX-RULES.md) and [PREVIEW-MODE.md](PREVIEW-MODE.md). Full-preview examples carry a small `Sample` tag and noindex; publishing removes unanswered samples. Never present a synthetic project, review, rating, urgency, price, savings or rebate as fact. Public legal text lives on `/legal`, except APR and term beside a financing payment.

## Journey and lead capture

1. The first step asks “Let's price your <roof/patio/system>. Where should I text your quote?” Name and mobile number are required; email can be asked later. The call/text consent box is **unticked** and records the exact consent version, time and source. Submit creates a CRM lead immediately. If consent is declined, keep the estimate usable without marketing texts or calls; K23 reviews transactional messaging language.
2. Contractor setting chooses gate timing: **before start** (default), after the price range, or before the exact quote. Preserve the same short, in-flow step at every position. Record estimator start, gate impression, completion, abandonment and finished estimate by site, page placement and gate setting so #015G can compare actual conversion and cost. Anonymous pre-gate work must not be misrepresented as a captured lead.
3. Ask for address after the gate. Use Google Solar/Maps where the provider covers that location to show the homeowner's satellite house with an outlined roof or yard. A measured roof area can feed the price only with a valid provider result and contractor-approved unit rates. Let the homeowner correct the outline/dimensions; when the feed fails, accept manual measurements or inspection-only flow and label the result accordingly. Do not infer an exact price from imagery alone.
4. Save partial answers to the same lead as the visitor continues, including source and consent. Restore the private quote on return with a secure share link; alert the contractor when an authenticated recipient reopens it. Rate-limit and expire links, and avoid exposing address or house imagery in public previews.

## Visual system

The visual is a trade-specific, progressive scene tied to the answers: material swatches, color/style redraws, a patio dimension placed in the yard, old-to-new reveal, X-ray layers, measurement lines, a new roof/system scanning over the old, daylight/rain slider, progress path, step-by-step house build, price count-up and booking-card flip. Select the useful subset for each service; one primary motion per section, no repeated effect in adjacent sections. Share the #004Q/#004R AR/photo-visualizer engine and the “Preview on your home” entry point, including selected service, color and dimensions. No-JS and reduced motion present the complete static state and equivalent controls. Measure performance, accessibility and mobile readability before release.

## Estimate and decision

- Present Good / Better / Best with distinct contractor-approved inclusions, materials, warranty, **full price** and monthly payment when financing exists. Show the scope assumptions, estimate confidence and inspection conditions. No price appears without an approved price-book line; unavailable pricing becomes an inspection path.
- Suggest add-ons only from the contractor's approved price book, with their approved price/range and an explicit opt-in. Never imply a location-wide purchase trend without evidence.
- For Roofing, HVAC, water heaters and Plumbing, compare repair versus replace over a 5–10-year horizon using known age, condition, approved repair/replacement ranges and stated assumptions. If data is missing, show the questions or request an inspection, not a fabricated savings figure.
- Show rebates, tax credits and utility programs only from a verified, current program applicable to the entered address, with eligibility caveats and source/date. Storm work may offer an insurance-claim **help** path, with no coverage/outcome promise. K23 approves wording.
- For HVAC, Windows/Doors, Insulation, Solar and cool roofs, place modeled energy savings and payback alongside the payment, identify assumptions and source, and suppress figures without suitable data.
- Offer the full price plus two or three real financing plans when available. Put APR and term immediately adjacent to **every** monthly payment, including cards and slider states. A payment slider recomputes with the selected real lender terms. Prequalification goes through the contractor's configured partner. Adapter contract supports Hearth, Enhancify, Service Finance, Wisetack and Sunbit where a live integration exists, with admin-added future lender configurations and a safe unavailable state. No fake approval, rate or lender response. K23 reviews exact disclosures.
- Close with e-sign and an optional deposit using backend idempotency (one tap, one charge). Show actual open inspection slots from the CRM calendar, reserve one **without payment**, and provide Call now. If the calendar is disconnected, offer request-a-time instead of made-up availability.

## Follow-through and operations

- Text a shareable quote containing the house image, package, full price and payment only when the applicable consent and delivery path permit it. Aim for first permitted text within 60 seconds; failures are visible and retriable. AI follow-up sends only within contractor-approved rules and logged consent; draft for approval otherwise.
- Chat or voice mode accepts the homeowner's situation, fills the same fields, asks one or two focused follow-ups, and produces the same calculated estimate. Always show/edit the interpreted answers before finalizing. Preserve an accessible text path.
- Result trust panel shows only confirmed license, insurance, warranty, real reviews and years in business; hide each missing fact. Support rep/tablet mode with a clear handoff to the homeowner. Allow private photo uploads for Siding, Painting and interior work with consent, retention and access controls.
- Give each placement/campaign a tracked link. CRM lead stores house image, package, add-ons, financing choice as a **budget signal** (not a credit decision), score, source and partial/completed state. Score provenance is visible and can be corrected by staff.
- Research Google's “Online Estimates” surface: price range completeness, wording, schema and a Google Business Profile checklist. Treat gate eligibility as an **open question**; do not claim qualification until verified.

## Placement on public pages

The estimator is included with no setup fee. The header and phone sticky bar show “Get my price” beside Call now. Homepage uses it as primary hero CTA and has a lower preview. Service pages preselect that service and use a tailored teaser plus mid-page start. City pages use local wording. Our Work, Reviews and before/after place the invitation beneath proof. About, FAQ and blog have one inline prompt. `/legal` has none; `/thank-you` offers “Save your quote.” Emergency Locksmith and emergency Plumbing keep Call now primary. Write unique placement copy and source IDs per page; beyond the header/sticky controls, never show more than one estimator prompt per screen. Track starts and completions by source.

## Positioning and verification

Planning comparison supplied by Joe; competitor prices and capabilities must be checked against current primary sources before any publication or sales claim.

| Comparison target | User-supplied planning snapshot | Intended Buildovate difference |
| --- | --- | --- |
| Roofle | $350/month plus $2,000 setup; roof measurement and prequalification | Live house visual, three packages, multi-lender real prequalification, all trades and no setup fee |
| Roofr | $149/month; contact before price | Live house visual and transparent scope/pricing from approved book |
| Demand IQ | $495–995/month; multi-trade AI, no visual or live financing in supplied comparison | Visual estimate tied to the house and configured lender prequalification |

Acceptance: test each gate position, consent state, partial lead, source attribution, secure return and reopen alert; valid/invalid satellite measurement; missing price/program/lender/calendar; package/add-on arithmetic; APR/term placement at every responsive width; one-charge retries; voice/text parity; preview/published data boundaries; desktop/390px, keyboard, touch, no-JS and reduced motion. Verify real integrations individually before enabling. Log per-estimate and per-bundle actual cost in #015G.
