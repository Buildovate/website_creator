# Public-page console baseline — 49b032e

An isolated copy of commit `49b032eefdda23a7e7a66f9031c4f3d4f26c7271` ran the same 11 legacy browser suites that produced the current public-page diagnostics. All 11 passed with their original assertions. The copy used only path redirection to keep evidence and builds inside itself, plus a Playwright console capture hook; no product source or assertions changed. The two promotion suites used the same temporary Pending-film fixture as the full suite, then restored it.

[Full console records and command results](public-baseline-console.json): 37 messages, including deliberate failure fixtures. [Comparison](../checks/public-console-diff.json): 37/37 current records match by suite, message, status and source URL, ignoring only the port number. This includes all 31 current non-allowlisted public diagnostics. New current diagnostics: **0**. Baseline-only diagnostics: **0**.

The baseline copy and its `node_modules` junction were removed after evidence was saved. The active working tree, original before captures and `.preserve/` were not used for the reproduction.