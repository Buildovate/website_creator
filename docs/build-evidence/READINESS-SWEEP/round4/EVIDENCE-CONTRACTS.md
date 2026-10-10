# Game completion evidence — Round 4

No XP or completion rows are written. Game derives the existing nine quests on every read; the original 100-point arithmetic and all-step rules remain unchanged.

| Quest | Existing real evidence | Outcome |
|---|---|---|
| Onboarding +10 | tenants.settings name, valid phone, trade, area; platform.questionnaire.factsConfirmed | Available. Owner-confirmed saved facts; a found/unconfirmed fact does not count. |
| Website pages +15 | Saved home hero/intro, enabled authored about/FAQ/service/city drafts; sales.data.ownerApproved plus approvalNote | Available. Every required draft and recorded owner preview approval required. |
| Reviews +15 | Actual nonempty, filtered provider API response; confirmed profile, visibility setting, current matching configuration and provider key | Available through a tenant-scoped metadata receipt created only by the existing reviews API. No review text, names, ratings, counts or completion flags are stored. Empty/failing responses invalidate it; isolated QA responses never count. Receipt expires after 24 hours; this proves recent provider availability, not that a visitor viewed a particular pixel. |
| Virtual estimator +20 | Existing pricing.js is an estimate-request form, not the Virtual Estimator. form-fields.js owns generic fields; Roofing priceBook owns CTA prices, not estimator minimum-item/confirmation configuration | DEFERRED only this quest. No saved required-field + contractor-confirmed minimum-item book + estimator consent contract exists. Do not replace its three locked rules with a generic saved form. |
| Promotions +5 | platform.promotions.offers with id/title/reward | Available via an actual saved offer. No-offer choice is not inferred from the default disabled state. |
| Financing +10 | platform.financing.selection=none, or an actual connected selected lender | Available via explicit None. Existing application links remain Not connected and never count as connected lenders. |
| Leads & CRM +10 | chat_config enabled verified SMS alerts | Available. Provider-confirmed phone verification required. No CRM connection is invented. |
| Domain & publish +10 | Request payment DB active plan; domain_plan fresh tenant-bound both-host/SSL proof; tenants.status/published | Available. A registered domain or owner-verification token alone is insufficient. |
| Marketing & social +5 | Existing footer links are URLs, not connected accounts; workspace has blog publications but no social-account/explicit-none/publication owner contract | DEFERRED only this quest. No connected-channel evidence or explicit None choice is saved. First post badge also needs a provider-confirmed published social post. |

Maximum honestly attainable with current owning records: **75 XP**. The pure complete-rule fixture remains 100 XP; it is not production activity. Round 4 does not claim a real 100-XP site or capture one. Building the two missing owning features is beyond an evidence adapter and would require separate product/provider work. No schema or completion records were added. Reviews uses the existing workspace_records table for provider-response metadata.

Read paths validate existing manifests without adopting, updating, or recording history. The board, saved-detail suggestions, personal tour reads/writes and the existing tenant GET used by Game forms share that guarantee. Existing explicit business/settings/generation writes retain core.one's validated, optimistic manifest adoption. Reads do not repair corrupt metadata.
