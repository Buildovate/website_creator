# #028F-B Borderline FIX — 67 phone-header truncation + 3 transformation video

- State: **OPEN — all 70 original findings remain open.**
- Decision: **Joe REJECTED — fix in product, never Accept** (2026-10-07).
- Due: **before October 27, 2026**, before the first live contractor.
- Do not Accept, waive, or reclassify these findings. This document records the follow-up ticket; it records no QA review decisions.
- `qaGateClear=false`. Suite-102 is 102 PASS / 0 PASS-WITH-WARNING / 0 FAILED / 0 incomplete.
- Fresh 8ab QA: 3,492 Pass / 3 Borderline / 0 Fail. The 67 original header findings are no longer detected by that snapshot, but their original IDs remain open here, not reclassified or accepted.
- Fix the original phone-header truncation and transformation-video findings in product, with evidence under a separate ticket. Keep the QA detector and thresholds unchanged.

Source: [original 70 findings](checks/round8q-samples-before-findings.json); [latest verification](checks/round8ab-results.json). IDs are qualified by Sample and captured version because a local check ID may recur across sites.

## Captured versions

| Sample | Original version SHA-256 |
|---|---|
| sample-fictional-copper-kite-ventura | `d7988c0810814f3ef989d49e2a345279e310e035e5fb23812e1248a8767d7b4e` |
| sample-fictional-blue-orchard-pasadena | `6523f729d8cead8729fb20834bd595bbd1fe45b96696db53892d5221aa27949f` |
| sample-fictional-paper-lantern-temecula | `4e17f2ebdce5ce80d1eb3b7a3d091c58571be4d8b7f80fd55ed950afa67f56d1` |
| sample-fictional-cobalt-heron-irvine | `41ad0560f3d6aa26c1afa38e01957b32d437bf5627b8bcf7e9400e93e6216d04` |
| sample-fictional-ochre-willow-riverside | `34adc73ab20e03a94063f21c24e46539cf107bd10878d5326f5b69f36801b90c` |

## Phone-header truncation — 67 open IDs

| Sample | Open check ID | Page / frame | Width |
|---|---|---|---|
| sample-fictional-copper-kite-ventura | `page-001-390-clipped-text` | /s/sample-fictional-copper-kite-ventura | 390 |
| sample-fictional-copper-kite-ventura | `page-002-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/about | 390 |
| sample-fictional-copper-kite-ventura | `page-003-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/areas | 390 |
| sample-fictional-copper-kite-ventura | `page-004-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/areas/ventura | 390 |
| sample-fictional-copper-kite-ventura | `page-005-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/blog | 390 |
| sample-fictional-copper-kite-ventura | `page-006-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/contact | 390 |
| sample-fictional-copper-kite-ventura | `page-007-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/faq | 390 |
| sample-fictional-copper-kite-ventura | `page-008-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/legal | 390 |
| sample-fictional-copper-kite-ventura | `page-011-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/pricing | 390 |
| sample-fictional-copper-kite-ventura | `page-012-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/reviews | 390 |
| sample-fictional-copper-kite-ventura | `page-013-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/services | 390 |
| sample-fictional-copper-kite-ventura | `page-014-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/services/roof-installation | 390 |
| sample-fictional-copper-kite-ventura | `page-015-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/services/roof-repair | 390 |
| sample-fictional-copper-kite-ventura | `page-016-390-clipped-text` | /s/sample-fictional-copper-kite-ventura/thank-you | 390 |
| sample-fictional-blue-orchard-pasadena | `page-001-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena | 390 |
| sample-fictional-blue-orchard-pasadena | `page-002-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/about | 390 |
| sample-fictional-blue-orchard-pasadena | `page-003-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/areas | 390 |
| sample-fictional-blue-orchard-pasadena | `page-004-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/areas/pasadena | 390 |
| sample-fictional-blue-orchard-pasadena | `page-005-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/blog | 390 |
| sample-fictional-blue-orchard-pasadena | `page-006-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/contact | 390 |
| sample-fictional-blue-orchard-pasadena | `page-007-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/faq | 390 |
| sample-fictional-blue-orchard-pasadena | `page-008-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/legal | 390 |
| sample-fictional-blue-orchard-pasadena | `page-011-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/pricing | 390 |
| sample-fictional-blue-orchard-pasadena | `page-012-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/reviews | 390 |
| sample-fictional-blue-orchard-pasadena | `page-013-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/services | 390 |
| sample-fictional-blue-orchard-pasadena | `page-014-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/services/roof-repair | 390 |
| sample-fictional-blue-orchard-pasadena | `page-015-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/services/roof-replacement | 390 |
| sample-fictional-blue-orchard-pasadena | `page-016-390-clipped-text` | /s/sample-fictional-blue-orchard-pasadena/thank-you | 390 |
| sample-fictional-paper-lantern-temecula | `page-001-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula | 390 |
| sample-fictional-paper-lantern-temecula | `page-002-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/about | 390 |
| sample-fictional-paper-lantern-temecula | `page-003-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/areas | 390 |
| sample-fictional-paper-lantern-temecula | `page-004-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/areas/temecula | 390 |
| sample-fictional-paper-lantern-temecula | `page-005-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/blog | 390 |
| sample-fictional-paper-lantern-temecula | `page-006-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/contact | 390 |
| sample-fictional-paper-lantern-temecula | `page-007-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/faq | 390 |
| sample-fictional-paper-lantern-temecula | `page-008-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/legal | 390 |
| sample-fictional-paper-lantern-temecula | `page-011-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/pricing | 390 |
| sample-fictional-paper-lantern-temecula | `page-012-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/services | 390 |
| sample-fictional-paper-lantern-temecula | `page-013-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/services/asphalt-shingles | 390 |
| sample-fictional-paper-lantern-temecula | `page-014-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/services/roof-replacement | 390 |
| sample-fictional-paper-lantern-temecula | `page-015-390-clipped-text` | /s/sample-fictional-paper-lantern-temecula/thank-you | 390 |
| sample-fictional-cobalt-heron-irvine | `page-001-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine | 390 |
| sample-fictional-cobalt-heron-irvine | `page-002-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/about | 390 |
| sample-fictional-cobalt-heron-irvine | `page-003-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/areas | 390 |
| sample-fictional-cobalt-heron-irvine | `page-004-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/areas/irvine | 390 |
| sample-fictional-cobalt-heron-irvine | `page-005-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/blog | 390 |
| sample-fictional-cobalt-heron-irvine | `page-006-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/contact | 390 |
| sample-fictional-cobalt-heron-irvine | `page-007-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/faq | 390 |
| sample-fictional-cobalt-heron-irvine | `page-008-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/legal | 390 |
| sample-fictional-cobalt-heron-irvine | `page-011-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/pricing | 390 |
| sample-fictional-cobalt-heron-irvine | `page-012-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/services | 390 |
| sample-fictional-cobalt-heron-irvine | `page-013-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/services/air-conditioning-installation | 390 |
| sample-fictional-cobalt-heron-irvine | `page-014-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/services/air-conditioning-repair | 390 |
| sample-fictional-cobalt-heron-irvine | `page-015-390-clipped-text` | /s/sample-fictional-cobalt-heron-irvine/thank-you | 390 |
| sample-fictional-ochre-willow-riverside | `page-001-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside | 390 |
| sample-fictional-ochre-willow-riverside | `page-002-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/about | 390 |
| sample-fictional-ochre-willow-riverside | `page-003-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/areas | 390 |
| sample-fictional-ochre-willow-riverside | `page-004-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/areas/riverside | 390 |
| sample-fictional-ochre-willow-riverside | `page-005-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/blog | 390 |
| sample-fictional-ochre-willow-riverside | `page-006-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/contact | 390 |
| sample-fictional-ochre-willow-riverside | `page-007-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/faq | 390 |
| sample-fictional-ochre-willow-riverside | `page-008-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/legal | 390 |
| sample-fictional-ochre-willow-riverside | `page-011-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/pricing | 390 |
| sample-fictional-ochre-willow-riverside | `page-012-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/services | 390 |
| sample-fictional-ochre-willow-riverside | `page-013-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/services/heating-installation | 390 |
| sample-fictional-ochre-willow-riverside | `page-014-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/services/heating-repair | 390 |
| sample-fictional-ochre-willow-riverside | `page-015-390-clipped-text` | /s/sample-fictional-ochre-willow-riverside/thank-you | 390 |

## Transformation video — 3 open IDs

| Sample | Open check ID | Page / frame | Width |
|---|---|---|---|
| sample-fictional-copper-kite-ventura | `clip-0` | /s/sample-fictional-copper-kite-ventura | 960 |
| sample-fictional-blue-orchard-pasadena | `clip-0` | /s/sample-fictional-blue-orchard-pasadena | 960 |
| sample-fictional-paper-lantern-temecula | `clip-0` | /s/sample-fictional-paper-lantern-temecula | 960 |
