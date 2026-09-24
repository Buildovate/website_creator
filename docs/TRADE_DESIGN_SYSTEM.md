# Premium trade-page design standard — #004B

All future trade detail pages must use public/trade-page.css and public/trade-page.js. The first implementation is the Roofing service renderer in src/website-pages.js. Existing homepages and other trade routes are not retrofitted by this ticket.

- Use the trade-page root and tp-* components: shell, header, hero, trust, section-heading, signs, timeline, scope, compare, reviews, faq, contact and final. Keep styles scoped; do not fork a stylesheet per trade.
- Use contractor brand color through --tp-accent and computed --tp-accent-ink (black/white chosen for WCAG AA normal text). Dark ink, warm neutral surfaces, large self-hosted Barlow display type, restrained borders and consistent spacing establish hierarchy.
- Lead with generated full-bleed imagery, a dark overlay, one editable homeowner headline and request/call actions. Future trades need their own generated image set and relevant sign/process copy, not Roofing imagery.
- Source credentials only from confirmed contractor profile data; omit empty fields. Ratings require a source URL. Reuse license/insurance visibility controls. Never turn illustrative imagery into customer proof.
- Use four to six image cards and a four-step timeline. data-reveal progressively enhances visible content; reduced motion disables reveal movement and smooth scrolling. Native disclosures and range controls retain keyboard operation.
- Before/after defaults must be visibly labeled generated examples. Replace only with two tenant-owned, permissioned photographs of the same project. This grants access only to the rendered pair after publication; it does not publish their parent project.
- Reviews use the existing confirmed-source system. Missing review data produces an honest empty state. Keep FAQ answers, phone links and forms truthful; a submitted request is not a booked appointment.
- Verify desktop/mobile layout, no overflow, keyboard controls, reduced motion, published/draft boundaries, ownership and source claims. Save full-page evidence for each new trade adoption.

Backoffice: Questionnaire → Service-page trust profile and Service page headlines & comparison. Save updates draft settings; normal publication remains required. Blank service headline selects the default. Comparison upload selection is available for existing service-page records; creating the full page editor remains a later ticket.

## #004C conversion rules

Apply [CONVERSION-PLAYBOOK section 6](product/CONVERSION-PLAYBOOK.md) to each new detail page. Prefer a truthful first-person value CTA; do not promise a free service without confirmation. Keep one inquiry, with optional finance interest and unlocked offer context. Use icon-led benefit bullets and strong process heading hierarchy.

Skip reviews when there are no confirmed excerpts; an empty public proof band is not acceptable. Sales samples belong only to the authenticated /sales-preview/:slug/services/:service route for unpublished tenants, with persistent and per-section sample labels. Never persist sample claims or expose the mode on a published tenant.

Service financing requires confirmed configured partner terms and footer.financingDisclosure. APR/term are fixed to those terms; no off-page CTA. Active promotions must match the service tag; one quiz unlock feeds the same inquiry, preserving server date/answer checks.
