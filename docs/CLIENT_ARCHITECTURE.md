# Website client structure

The Node AWS runtime and Worker-rendered HTML are unchanged. Production uses esbuild through build.mjs; Docker remains the primary development path. This extraction does not introduce React, another API stack or a new deployment.

## Source and output

| Source | Responsibility | Browser output |
| --- | --- | --- |
| src/client/workspace/index.ts | Workspace entrypoint | /app.js |
| src/client/workspace/shell.ts | Role-specific navigation and page heading | included in app.js |
| src/client/editor/visual-editor.js | Draft state, section order, device previews and save controls | included in app.js |
| src/client/workspace/legacy-workspace.js | Remaining legacy feature orchestration | included in app.js |
| src/client/shared/api.ts | AWS cookie/CSRF session transport and expiry handling | bundled where used |
| src/client/shared/workspace-api.ts | Explicit AWS versus original Sites transport boundary | included in app.js |
| src/client/shared/session.ts | Typed session and safe login return paths | bundled where used |
| src/client/shared/html.ts, forms.ts | Escaping and common form markup | included in app.js |
| src/client/site/index.ts | Public-site entrypoint and comparison/hero hooks | /site.js |
| src/client/site/portfolio.js | Portfolio filtering, map and fallback interactions | included in site.js |
| src/client/site/inquiries.ts | Public inquiry submission and status | included in site.js |
| src/client/site/cinematic.js, cinematic-controls.js, showcase.js, cutaway.js, trade-components.js | Existing public-site effects | same compatibility JS URLs |
| src/client/styles/app.css | Ordered style imports | /app.css |

The stylesheet sections retain their original order: foundation, editor, workspace, design-library, workspace-overrides, responsive, integrations. The split was verified byte-for-byte before bundling; it does not redesign the UI. Unmoved public styles/media/JSON remain in public.

## State boundaries

The visual editor receives explicit API, task, refresh, render and notification callbacks plus current/dirty accessors. It does not own the surrounding workspace. Save still sends the current tenant version and updates the shared tenant only after success. Publication remains a separate action. The shell receives read-only state accessors so it sees current role/navigation state on every render.

New shell, inquiry, helper and transport modules use TypeScript. The moved editor and public-effect bodies retain JavaScript to keep this extraction narrow; they are not claimed as fully type-checked. The existing auth typecheck includes the TypeScript client; npm run typecheck:client is an explicit entrypoint for that check.

## Remaining legacy boundary

The remaining workspace feature handlers still share a closure with public/crm-enhancements.js, public/control-ui.js and public/engagement-ui.js. Their source and behavior were not changed. scripts/build-client.mjs keeps their single, validated injection point during bundling. It must not be removed until those handlers receive explicit state/action interfaces. Do not edit dist or recreate parallel source files under public.

## Development and validation

Run npm run build, npm run typecheck:client, npm run test:client, npm run test:aws and npm run test:auth. The Docker dev override mounts scripts as well as src/public. Rebuild/restart after source edits.

Vite remains a fixture-based QA server, not production auth. It serves the same built client compatibility files and still needs npm run build plus the original media bundle. Existing fixture suites require missing public/assets images; no substitute files have been added.
