# Local city database

Run `npm run geoip:update -- YYYY-MM` to obtain the corresponding free DB-IP City Lite monthly database from the official download host. The MMDB binary is gitignored, about 127 MB for September 2026, and must be included or mounted when building/deploying the AWS image. No API key is needed. Restart the server after refresh.

Data provider: [DB-IP](https://db-ip.com/db/lite.php). License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Required on-page attribution is included in the neighborhood banner. `manifest.json` records provenance and SHA-256 for the installed binary. Do not remove the attribution while using this data.

The city result is approximate. See `docs/product/EXPERIENCE_REDESIGN.md` for trusted proxy configuration, privacy behavior and deployment prerequisites. The process falls back to manual city selection when no database is available.
