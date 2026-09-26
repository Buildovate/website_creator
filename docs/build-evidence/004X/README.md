# #004X — Core site pages and full-preview mode

## Scope and route results

The shared page renderer serves `/services`, `/areas`, `/areas/<city>`, `/about`, `/reviews`, `/faq`, `/contact`, `/thank-you`, and `/legal` under each `/s/<site>` path. Existing `/financing` and `/promotions` routes now appear in private preview even when the contractor has no configured offer. Published sites show those two routes, and `/reviews`, only when real source data exists.

The [browser matrix](browser-results.json) checked Roofing (Robles), HVAC, and Patios in published and private preview modes at 1440×900 and 390×844: **160 route checks**, no unexpected browser errors, no horizontal overflow, and one H1 per page. It also followed the rendered header and footer site links and verified HTTP 200. Private previews returned 200 with `noindex`; the unconfigured published review, financing, and promotion pages returned the expected 404 and were absent from navigation and the sitemap. The deliberately unhandled route used for the before captures also returned the old 404 template.

The route tests check unique city sentences, published sample isolation, schema, metadata, navigation, and sitemap. Published schema excludes sample records; preview pages have no sample schema. The service-content test rejects repeated card openings and blurbs that restate their card title.

## Screenshots

There are **136 PNGs** in this folder. `before-<trade>-<size>-404-template.png` shows the unchanged 404 design that the missing routes previously used. `after-<trade>-<size>-<mode>-<route>.png` captures each available route. The `mode` is `preview` or `published`; `size` is `desktop` or `phone`.

- [Roofing phone services](after-roofing-phone-published-services.png), [city page](after-roofing-phone-published-areas-oxnard.png), [about](after-roofing-phone-published-about.png), [legal](after-roofing-phone-published-legal.png)
- [Roofing desktop services](after-roofing-desktop-published-services.png), [contact](after-roofing-desktop-published-contact.png)
- [HVAC phone areas](after-hvac-phone-published-areas.png), [preview about](after-hvac-phone-preview-about.png), [preview project story](after-hvac-phone-preview-project-story.png), [desktop FAQ](after-hvac-desktop-published-faq.png)
- [Patios phone preview financing](after-patios-phone-preview-financing.png), [preview promotions](after-patios-phone-preview-promotions.png), [preview project story](after-patios-phone-preview-project-story.png), [desktop services](after-patios-desktop-published-services.png)

## Regression and platform audit

[Full regression results](regressions/results.json): **54/54 commands passed**, including build and typecheck. Individual command logs are in `regressions/`.

[#015A platform mobile audit](platform-mobile-audit.json): **101 phone and 101 desktop states**, zero browser errors, zero layout failures, and all checked workflows passed. The audit's real camera step remains marked for physical iPhone/Safari verification by the existing suite.

The local Vite process was restarted from the repo on port 5173. `/s/robles-roofing`, `/s/robles-roofing/services`, `/s/robles-roofing/areas`, and `/s/robles-roofing/about` each returned HTTP 200.

No deployment or push was performed.
