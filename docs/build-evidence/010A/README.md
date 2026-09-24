# #010A — Reviews visible in the first section screen

Removed the large house graphic from connected reviews. Source cards now come directly after the display-font heading and spaced subtitle; each has stars, a short quote, reviewer name and original-source link. Provider summaries follow the cards. Quotes use up to 30 source words and four visible lines, with the original link available for full context. Cards remain still, including on the shared service page.

## Visual evidence

All names, quotes, business facts and provider results below are **fictional local QA fixtures**, explicitly labeled in the screenshots. These exercise the actual provider-response renderer; they are not real customer endorsements or proof of a live connection.

| View | First screen | Entire section | Missing connection | Service page |
|---|---|---|---|---|
| Desktop 1440×1000 | [Screenshot](desktop-reviews.png) | [Screenshot](desktop-reviews-section.png) | [Source-link fallback](desktop-reviews-unconnected.png) | [Screenshot](desktop-service-reviews.png) |
| Mobile 390×844 | [Screenshot](mobile-reviews.png) | [Screenshot](mobile-reviews-section.png) | [Source-link fallback](mobile-reviews-unconnected.png) | [Screenshot](mobile-service-reviews.png) |

[Small-mobile long quote, 360×780](small-mobile-long-quote.png). Visual inspection confirmed the first card’s stars, quote, author and original source are readable together. The source link also clears the mobile sticky action bar. Provider policy links and aggregates remain below the cards.

## Executed verification

- [Build output](build.txt): pass, 276 referenced files / 14 trade kits.
- [Regression output](tests.txt): **10 passed, 0 failed** across reference-proof, trust, conversion-references, service-playbook and premium-service.
- [Browser output](browser-output.txt) and [measurements](browser-results.json): pass at desktop/mobile; full first card ends at y=699/551 with usable viewport bottoms y=1000/770. Heading uses TradeDisplay; subtitle gap is 18px/16px.
- Normal/reduced motion, refresh, long-quote handling, no document overflow or browser errors. Service pages load the shared review styles, retain readable dark-theme contrast and hide the whole section without excerpts. Source cards are excluded from sample-review loops.
- Google’s 3.8/40 aggregate remains unchanged despite the selected five-star excerpt; Yelp’s 4.0/12 stays provider-sourced. Google sample-selection note, source links, reviewer links, dates, attributions and policy links are retained. No feeds/HTTP failure/no JavaScript retain usable source links; no stars or quotes are invented.

Reproduce: run node build.mjs, start [preview-reviews-010A.mjs](../../../scripts/preview-reviews-010A.mjs), then run [capture-reviews-010A.cjs](../../../scripts/capture-reviews-010A.cjs) with local Playwright and Chrome paths as needed. The preview uses memory/PGlite, test-only placeholder keys and mocked Google/Yelp responses; outbound provider requests are rejected. [Fixture manifest](local-fixture.json).

K03/K04 live provider capability and K22 permitted marks remain unverified as recorded in NEEDS-KEYS.md. No new assets or credentials were needed. No push, deployment, generation or external messages. #011 was not started.
