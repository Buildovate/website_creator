# Full-preview mode

This is a standing product rule for contractor prospect previews.

## Private preview

- An authorized prospect preview shows every core page and section for the selected trade: services, areas and city pages, about and owner photo, reviews, FAQ, contact, financing, promotions, Our Work and projects, and before/after.
- When the contractor has not supplied a fact, review, photo, project, or offer, the preview fills that space with a **trade-specific illustrative sample** and a small visible **Sample** tag. A sample describes placement and presentation; it never claims to be a completed job, customer review, active financing offer, or promotion.
- The server sends `noindex,nofollow` on preview pages. Preview sample records do not enter JSON-LD, public APIs, or any sitemap.
- Preview forms, offer unlocks, and other real submission actions remain disabled.

## Published site

- Rendering reads the published snapshot. Sample content is derived only for preview and is automatically absent from published page output. Publishing never copies sample records into the contractor's real reviews, projects, offers, or schema.
- A page or section without real content is hidden. The standard contact, service, service-area, FAQ, about, thank-you, and legal pages use confirmed site settings and selected services; review pages require a confirmed review source. Financing and Promotions require real enabled programs or offers.
- Never publish invented reviews. `AggregateRating`, when present, must be calculated solely from real reviews returned by a connected source.
- Published Our Work and the Project Map show only real, owner-published jobs. Until real jobs exist, the preview may show tagged layout examples; the published site omits the work block.

## Implementation checks

- Preview navigation exposes all pages, including Financing and Promotions, regardless of whether a contractor has configured real offers.
- Published navigation and the sitemap share the same visibility rules as the route handlers.
- Tests cover preview `noindex`, sample isolation from schema and sitemap, published 404 behavior for unsupplied content, and uniqueness of city page sentences.
