# Contractor questionnaire v2 — gap plan (#015Q)

Planning only; no form or data-model changes in this pass. Sources checked: `src/client/workspace/questionnaire.ts` (current UI), `src/core.js` site settings, and `docs/product/PACK1_CORE_SITE_SPEC.md` (planned fields). A field named only in a spec is not treated as already asked in the live questionnaire. Keep the existing draft/publish boundary and [full-preview rules](PREVIEW-MODE.md); follow [UX-RULES.md](UX-RULES.md).

## What the current questionnaire already asks

| Current area | Existing asks to retain and prefill |
| --- | --- |
| Business | Business and owner names, phone, email, address, hours, license number, verified experience, logo/brand image, business time zone, homepage headline and introduction, business story and priorities. |
| Conversion and trust | Customer journey, target audience, traffic source, customer problem, reference headline/introduction/differentiator/next-step promise with confirmation. The trust panel already asks years, license number and state, an insured yes/no answer, crew size, warranty length, credentials, owner-entered Google rating/count/source URL, jobs completed and per-group confirmation. Service pages also ask years, warranty summary, source rating/URL and confirmation. Do not ask these again. |
| Services and geography | Selected services, per-service page visibility/headline/typical price range/before-after media, featured service cities and city review evidence. Do not re-ask a saved service or city. |
| Contact, offers and finance | Contact locations, footer details and bonded/insured checkboxes for footer and locations; social profile URLs; configured lender/program link and live confirmation, APR and months for existing financing programs, financing enabled; promotion dates/terms and associated offer settings. Existing lender fields are a starting point, not proof of a live prequalification adapter. |

## Ask only for missing data

Every item is skippable. Prefill from verified CRM records and earlier answers, show the source and last update, and let the owner correct it. Never overwrite a confirmed answer with a sample. Render only sections relevant to the selected trade and plan. Before publishing, missing facts hide affected public blocks; full-preview mode may fill each unanswered section with trade-specific `Sample` content, noindex and no sample schema. Save progress after each step, restore it on phone, show progress and a clear resume path. A skip never becomes a fabricated fact.

| Section | Missing or additional fields | Conditional behavior |
| --- | --- | --- |
| Virtual Estimator | Per-service approved price ranges **or** Buildovate CRM price-book connection; Good/Better/Best inclusions, materials and package-specific warranty; priced add-ons/ranges; minimum job size; accepts insurance-claim work yes/no; lead-gate position (default before start). | Reuse existing service typical-price ranges where valid; ask package and add-on details only for selected services. No unapproved estimate number. |
| Financing | Multi-partner selection: Hearth, Enhancify, Service Finance, Wisetack, Sunbit, Other, None; offered plan APR/term where absent; real prequalification on/off. | Prefill existing lender URL, APR/months and enabled state. Ask only if financing is offered; distinguish referral link from live prequalification. |
| Booking and alerts | Inspection availability or CRM calendar connection, lead-alert recipients, text-back number. | Prefill company phone and connected CRM calendar. Ask booking only for relevant services; show request-a-time until real slots exist. |
| Trust | License **type** and any missing jurisdiction detail, insurance and bonding **evidence** (the existing yes/no answers remain), and precise warranty terms beyond the existing length/summary. | Reuse license number/state, insured/bonded answers, years and warranty summary. Ask for missing proof, never a second copy of the same fact. Show verified values only. |
| Social posting | Networks used, authority to post for the business, per-post approval or auto-approval, brand voice, willing offers, permission to use actual job photos. | Profile links already exist; add authorization separately. Do not post or reuse photos before permission. |
| Nextdoor and Google Business Profile | Presence yes/no and profile links for each. | Ask only the missing presence/link fields; integration availability remains separate from a profile URL. |
| Core pages | Full cities-served list for `/areas`, owner story detail, real review sources, common customer questions, Spanish content yes/no. | Reuse featured cities, existing business story and rating source where applicable; distinguish a rating URL from actual review records. |
| Locksmith | State locksmith license and license type, emergency hours, typical ETA as a confirmed range, upfront service prices/ranges. | Locksmith only; existing general license/hours prefill when valid. Never print an ETA or price until confirmed. |
| Plan | Website only, Growth or All-in; selected add-ons and opt-in fair-use top-ups. | Show proposed bundle terms separately from actual subscription/entitlement records. Never enable an add-on from an unanswered field. |

## Acceptance for the future build

Field-by-field migration preserves existing answers, consent and provenance. Test prefill/skip/resume on 390px and desktop, conditional trade/plan sections, no duplicate questions, sample preview versus published hiding, validation of money and APR fields, changed-value visibility and keyboard access. Connect the resulting answer map to #029V, #015H, #030N and Locksmith #041D without allowing questionnaire samples into real CRM leads, offers, schema or public pages.
