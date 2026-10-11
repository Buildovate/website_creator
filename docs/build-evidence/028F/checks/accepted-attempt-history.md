# Accepted final-validation attempt history

These failed or incomplete executions are retained, never counted as passes. No capture settings, detector, thresholds or timing assertions changed during their reruns.

| Command | Earlier execution | Subsequent completed execution |
|---|---|---|
| No-JS clearance | Failed during navigation with Chrome `net::ERR_NETWORK_IO_SUSPENDED`, before the state assertion. [Actual log](accepted-clearance-no-js-network-suspended.log). | Unchanged command passed all 16 states / 240 samples / 0 intersections. [Rerun](accepted-clearance-no-js.log). |
| Five Sample packets | Timed out during Blue Orchard; only the earlier completed packet is present in the partial report. [Actual log](accepted-five-samples-timeout.log), [partial report](accepted-samples-timeout-partial.json). | All five completed with exactly 3,425 Pass / 70 open Borderline / 0 Fail and `qaGateClear=false`. All three following main replays passed 143/143 exact files. [Rerun](accepted-samples-replays-retry.log). |
| Financing comparison | The full-suite execution found five real header intersections on `/s/finance-comparison/services/roof-maintenance` at 1440. [Actual log](financing-comparison.log). It remains a failed execution. | The unchanged diagnostic recheck passed: actual browser prerequisite 1,133 Pass / 2 Borderline / 0 Fail, followed by the existing payment/inquiry behavior assertions. [Recheck](accepted-financing-comparison-recheck.log). |

The wall-clock gap coincided with the recorded network-suspension navigation error. OS sleep and the cause of the five financing intersections are not established. The financing failure was not reproduced, and no product fix, delay, tolerance or capture-setting change is claimed. Its original helper did not export the failure crop; the helper now preserves real blocking crops before the unchanged assertion. It never supplies a passing QA report.

The three earlier #028E diagnostic contracts were accepted by Joe at 48/48 each with exact file equality. Their preservation code remains. The 102-command run stopped at the new populated-project scope blocker: 37 passed, 2 failed, 3 interrupted and 60 not run. The successful financing recheck remains a separate execution. See accepted-validation-summary.json and accepted-command-results.md.

0 Higgsfield credits and 0 real provider calls.
