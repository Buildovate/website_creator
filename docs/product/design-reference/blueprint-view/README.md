# Blueprint view — design reference

Blueprint is a proposed optional view of the contractor backoffice. It presents setup and operations as rooms on an architectural plan, with connections, honest status markers, a next-action card, and inspection milestones. The existing Tabs view remains the default in the proposed product.

[`prototype-v3.html`](prototype-v3.html) is a **static, clickable design reference only**. It is not production code. All company, project, account, connection, score and event data are examples for the made-up **Summit Ridge Roofing**. Its simulate links demonstrate visual states; they do not make real provider connections or record real results.

To explore it, double-click `prototype-v3.html` and open it in a browser. The corner **Reset** link, or opening the file with `?reset` appended to its URL, clears the prototype's browser-saved state. Links labeled **“Prototype: simulate”** exist only for demonstration. Future behavior and acceptance rules are specified in [#028G](../../../../BUILD-BACKLOG.md), not by the prototype's shortcuts. [manifest.json](manifest.json) records SHA-256 hashes of this HTML file and every screenshot copied byte-for-byte from the source handoff. The folder's `.gitattributes` keeps the copied HTML bytes unchanged on checkout.

## Screenshots

| File | Caption |
| --- | --- |
| [desktop-game-start.png](screenshots/desktop-game-start.png) | Fresh A-101 plan with every room outlined, a next-action card, legend and zero-point score. |
| [desktop-game-midway.png](screenshots/desktop-game-midway.png) | Several built rooms, a waiting-to-connect Financing room, a real-event marker example and partial score. |
| [desktop-stamp.png](screenshots/desktop-stamp.png) | Foundation inspection stamp shown after the onboarding room is built. |
| [desktop-game-complete.png](screenshots/desktop-game-complete.png) | Finished-house elevation at 100 points with the single View your site action. |
| [desktop-financing-form.png](screenshots/desktop-financing-form.png) | Financing form in a desktop side panel while the dimmed plan stays visible. |
| [desktop-after-save.png](screenshots/desktop-after-save.png) | Saved Financing setup still waiting for connection, with the Next room action in the panel. |
| [desktop-focus-editor.png](screenshots/desktop-focus-editor.png) | Full page-editing focus overlay and Back to plan control; the editor body is a placeholder. |
| [phone-game-midway.png](screenshots/phone-game-midway.png) | Phone plan with a built onboarding room, inspection progress and a pinned next-action card. |
| [phone-promotions-sheet.png](screenshots/phone-promotions-sheet.png) | Full-height Promotions sheet showing an empty offer list, one Save action and plan connections. |
| [phone-plan.png](screenshots/phone-plan.png) | Phone entry to the Blueprint with the view toggle, next action, score, legend and first room. |
