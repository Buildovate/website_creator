# #015A — Mobile-friendly platform pass

Status: implementation and automated acceptance complete. Joe explicitly authorized the local commit with the real-device check deferred. **Real iPhone camera upload — pending manual check for Joe.** This is local fictional data. No push, deployment, external delivery or real customer publication.

## Changes

- Phone navigation uses a labeled screen selector. Forms and dialogs reflow to one column; table rows become labeled cards; calendars and boards fit without sideways scrolling.
- Shared controls meet 44×44px targets, inputs use 16px text, and save/publish controls stay in a bottom action bar. The action bar forwards existing validation, authorization and publish confirmation, and follows the visual viewport when the keyboard opens. Dialog transitions are checked for a visible bar with nonzero height.
- Image inputs retain gallery selection and add Take a photo, cancellation guidance and a selected-image preview. Existing image resizing, JPEG conversion, upload validation, metadata stripping and media visibility remain unchanged.
- The visual editor scales its virtual preview width within a bounded viewport. Its section list now names Roof materials. Viewer navigation remains enabled while edit actions remain disabled.
- Existing admin views are included in the inventory. Provider links now meet the target size and desktop boards wrap rather than requiring horizontal scrolling. No separate Contractor CRM code changed.

## Audit and captures

[Screen-by-screen acceptance matrix](AUDIT-MATRIX.md) lists each rule and before/after phone captures, with desktop captures. [Before measurements](before-audit.json) come from the genuine baseline a86a0aea8c4569ffb2451b9f4c08226b6c61b8c8. [After measurements](after-audit.json) come from the implementation. The baseline builder reads the four original entry/source files from the pinned pre-ticket commit and compiles isolated assets. It never replaces working files or the assets served to the phone fixture.

The inventory includes all 24 contractor sections, questionnaire subpanels and dynamic rows, empty and populated lists, record dialogs, alternate contact/calendar views, upload cancellation/error/retry states, owner/editor/viewer states, sign-in/invite entry, and the existing admin navigation views. Public website pages are not substituted for platform screenshots. The public drone hero is unchanged.

## Verification

Run from C:/Users/joe/website_creator:

- node docs/build-evidence/015A/build-baseline.mjs (before capture only)
- node tests/platform-mobile.mjs --before (before capture only)
- node build.mjs
- node tests/platform-mobile.mjs
- node docs/build-evidence/015A/full-regression.cjs

The browser suite exercises settings save, questionnaire save/reopen, draft/published isolation, authenticated private preview, explicit publication of a disposable fixture, photo preview/upload failure/retry and persisted photo metadata, viewer navigation and denied writes. Browser-injected image files prove the web upload path, not a physical camera.

[Full regression results](regressions/results.json) and individual logs include build, auth typecheck and all regression scripts. Final full-suite result: 44/44 commands passed (build, auth typecheck and 42 regression scripts). The subsequent final capture run covers 100 phone and 100 desktop screen/state profiles, with zero layout failures or browser errors.

## Physical iPhone acceptance

Joe selected iPhone / Safari and approved the secured phone fixture. It uses fictional in-memory data, a random single-device pairing token, IP-bound session, same-origin mutations and a 20-minute expiry. Production auth remains unchanged. Joe can run the retained [pairing script](phone-fixture.mjs) later: from C:/Users/joe/website_creator, run node build.mjs, then node docs/build-evidence/015A/phone-fixture.mjs --allow-phone. Open http://127.0.0.1:8129 on the computer and copy the displayed pairing link into Safari on an iPhone on the same Wi-Fi. The script currently binds to the computer’s 192.168.68.66 Wi-Fi address; if it changes, update phoneOrigin and the proxy listen address together. The pairing address is shown only on the loopback setup page; no token or session is recorded in evidence.

**Real iPhone camera upload — pending manual check for Joe.** Check actual camera capture and gallery upload, cancel/permission-denial where offered, retry, preview/saved image, iOS version, and reachable actions with the keyboard open. This is explicitly deferred by Joe and does not block this local commit; it is not recorded as passed. Request metadata, if produced, is in device/http-events.json; images and request bodies are not saved there.

Next ticket: #016. It has not been started.
