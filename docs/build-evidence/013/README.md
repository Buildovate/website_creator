# Ticket #013 — footer social identities

Eight individual social controls now share one normalized network list. Google Business and X/Twitter complete the missing Pack C identities. All profiles default off with empty URLs. Enabling one requires a saved HTTPS URL; only an owner-published snapshot changes public footers. No real profile URL was added.

## Evidence

- [Desktop footer, all enabled](desktop-enabled.png) and [icon detail](desktop-enabled-icons.png); [both new profiles disabled](desktop-disabled.png) and [icon detail](desktop-disabled-icons.png). Viewport: 1440×900.
- [Mobile footer, all enabled](mobile-enabled.png) and [icon detail](mobile-enabled-icons.png); [both new profiles disabled](mobile-disabled.png) and [icon detail](mobile-disabled-icons.png). Viewport: 390×844.
- [Browser checks](browser-results.json) run by [reproducible local script](browser-evidence.mjs): 8 enabled / 6 after toggling Google Business and X/Twitter off, no horizontal overflow, accessible names and hidden decorative SVGs, new-tab protections, and keyboard Tab order. Questionnaire controls for both new networks save their enabled state and URL to draft.
- [Focused regression output](tests.txt): 22/22 pass, including normalization, footer publication isolation, shared routes and policy/page checks. [Build](build.txt) and [typecheck](typecheck.txt) pass.

The screenshots and browser fixture use `Fictional Roofing QA` and `example.test` URLs; they are not contractor identities or approved live profiles. The links are only published when a contractor saves/enables their URL and the owner publishes. K22 permitted brand assets and profile evidence remain unavailable. The Google Business pin/star is a generic local symbol, and the footer makes no brand affiliation, rating or certification claim. No external account, paid service, push or deployment was used.
