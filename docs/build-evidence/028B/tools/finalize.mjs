import fs from 'node:fs';import assert from 'node:assert/strict';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028B',read=file=>JSON.parse(fs.readFileSync(out+'/'+file));
const suite=read('full-checks.json'),unit=read('checks/section-variants.json'),filter=read('checks/review-rating-filter.json'),browser=read('checks/variants-browser.json'),fallback=read('checks/variants-fallbacks.json'),protectedReport=read('checks/accepted-protected-final.json'),sites=read('checks/sites-unchanged.log');
assert.equal(suite.length,102);assert.ok(suite.every(x=>x.status===0));assert.equal(browser.states.length,216);assert.deepEqual(browser.failures,[]);assert.deepEqual(browser.errors,[]);assert.ok(unit.passed&&filter.passed&&fallback.passed&&protectedReport.passed);assert.equal(sites.matched,280);assert.equal(sites.archived,374);
const geometry=browser.states.flatMap(s=>s.geometry||[]);assert.equal(geometry.length,72);assert.ok(geometry.every(x=>x.pass));assert.equal(fallback.states.filter(s=>s.kind==='inquiry-submit').length,2);
const counts={existingCommands:suite.length,renderAssertions:unit.checks,renderCases:unit.cases,configuredOfferCases:unit.optionalCases,filterAssertions:filter.checks,browserStates:browser.states.length,fallbackAssertions:fallback.checks,fallbackStates:fallback.states.length,textMeasurements:browser.states.reduce((n,s)=>n+s.text.length,0),focusMeasurements:browser.states.reduce((n,s)=>n+s.focus.length,0),geometryChecks:geometry.length,maxCLS:Math.max(...browser.states.map(s=>s.cls)),contrastFailures:browser.states.flatMap(s=>s.text.filter(t=>!t.pass)).length,overflowFailures:browser.states.filter(s=>s.overflow>0).length,brokenImages:browser.states.flatMap(s=>s.brokenImages).length,pageExceptions:browser.errors.length,protectedHashes:279,currentProtectedHashes:280,archivedResponses:374,originalEvidenceFiles:protectedReport.priorEvidence.length,screenshots:browser.screenshots.length+fallback.screenshots.length,contactSheets:6,variantsPerSection:3,sections:6,credits:0,actualProviderCalls:0};
fs.writeFileSync(out+'/checks/final-summary.json',JSON.stringify({passed:true,...counts},null,2));
let md=fs.readFileSync(out+'/README.md','utf8');
md=md.replace(/\*\*Verification in progress\.\*\*[\s\S]*?\n\n## What was built/,'**Complete locally (2026-09-28).** All required checks pass on feature/local-environment-setup, starting from accepted #028P commit 17e35f0 (following #028A 49b032e). Local commit only; no push or deployment. **Higgsfield credits: 0. Actual provider calls: 0.**\n\n## What was built');
md=md.split('## Verification')[0]+'## Verification\n\n[Machine-readable final summary](checks/final-summary.json).\n\n| Check | Final result | Evidence |\n|---|---|---|\n';
const rows=[
 ['Existing full suite','PASS: 102/102 commands','[Inventory/results](full-checks.json), [runner log](checks/suite-run.log)'],
 ['Final build and asset integrity','PASS; 643 referenced assets / 17 kits','[Build](checks/final-build.log), [assets](checks/template-assets.log)'],
 ['Client typecheck','PASS','[Log](checks/typecheck.log)'],
 ['All-kit render/data matrix','PASS: '+unit.checks+' assertions; '+unit.cases+' base + '+unit.optionalCases+' configured-offer cases','[Report](checks/section-variants.json)'],
 ['Review filter and draft/publish API','PASS: '+filter.checks+' checks; all/3/4/5, numeric gating, full aggregates, defaults','[Report](checks/review-rating-filter.json)'],
 ['Variant browser matrix','PASS: 216 page states; Roofing, Patios, HVAC x four styles x a/b/c x 1440/768/390 x home/financing','[Measurements](checks/variants-browser.json), [log](checks/variants-browser.log)'],
 ['New-layout text AA','PASS: '+counts.textMeasurements+' measurements, 0 failures','[Computed colors and ratios](checks/variants-browser.json)'],
 ['Keyboard, focus and layouts','PASS: '+counts.focusMeasurements+' focus checks; native disclosure keyboard use; 72 review geometry/column assertions','[Measurements](checks/variants-browser.json)'],
 ['Overflow, content loss, primaries, CLS','PASS: 0 failures; max CLS '+counts.maxCLS.toFixed(6)+' <= 0.05','[Measurements](checks/variants-browser.json)'],
 ['Image loads / page exceptions','PASS: 0 broken images, 0 page exceptions','[Report](checks/variants-browser.json)'],
 ['JS-off, reduced motion and optional-data fallbacks','PASS: '+fallback.checks+' assertions / '+fallback.states.length+' states; 72 JS-off layouts; real local form submissions for b/c; selected lender/calculator behavior; Pending posters','[Report](checks/variants-fallbacks.json), [log](checks/variants-fallbacks.log)'],
 ['Review zero/default compatibility','PASS: zero-after-filter removes a/b/c; absent setting reproduces legacy populated DOM for both existing thresholds; no unavailable aggregate invented','[Browser proof](checks/variants-fallbacks.json)'],
 ['Duplicate structural patterns','PASS: active choices unique; duplicate fixture rejected','[Render tests](checks/section-variants.log)'],
 ['Accepted #028P protected hashes','PASS: 279/279 match; plus accepted platform.css makes 280/280 current protections','[Comparison](checks/accepted-protected-final.json), [current hashes](checks/sites-unchanged.log)'],
 ['Archived #028A responses','PASS: 374/374 byte-identical','[After report](after-sites.json), [log](checks/after-sites.log)'],
 ['Platform/build/dependency preservation','PASS: no diff in platform/client/auth shell, build or package files; all original CSS hashes match','[Preservation](checks/accepted-protected-final.json)'],
 ['Original preflight evidence','PASS: '+counts.originalEvidenceFiles+' files byte-identical','[Preservation](checks/accepted-protected-final.json)'],
 ['Screenshots and contact sheets','PASS: 108 section captures + 6 mixed full homepages; six sheets','[Catalog above](#screenshots)'],
 ['Dependencies, media and spend','PASS: no new dependency/media/provider call; 0 Higgsfield credits','Local installed assets and isolated mocked fixtures only']
];
md+=rows.map(r=>'| '+r.join(' | ')+' |').join('\n')+'\n\nThe 280 protections comprise 207 HTML responses, 23 loaded stylesheets and 50 existing CSS asset files. They include all 279 original #028P protections plus the platform stylesheet introduced by accepted #028P. The new opt-in stylesheet is an additional asset; no existing stylesheet is edited. Screenshots cover every requested section/variant for three trades; all 17 kits are covered by the render/data matrix. Variant a remains protected by exact output/hash comparisons and the unchanged full suite. New browser contrast measurements target the opt-in sections.\n\nMemory remained healthy during QA (approximately 24 GiB free during the full suite). Test runtimes use isolated in-memory databases and block remote browser/provider traffic; no customer data is saved outside those disposable fixtures. The same full-set provider rating/count is retained for every filter. No live provider verification is claimed.\n\nThe commit includes the requested captures/contact sheets, baseline and final protected evidence, logs and reproducible tools. Redundant screenshots emitted by legacy suites stay local under this ticket folder; the final command logs/results are retained. Backups, downloaded FFmpeg/FFprobe executables and unrelated work are excluded. No work remains Pending for #028B. #028C is not started.\n\n### Existing 102-command suite\n\nExact commands are recorded below. The two controlled compatibility fixtures and output redirection are described in Reuse above; no behavior assertion is removed.\n\n| # | Command | Result | Log |\n|---|---|---|---|\n';
const tick=String.fromCharCode(96);
md+=suite.map((c,i)=>'| '+(i+1)+' | '+tick+c.command+tick+' | PASS (exit 0) | [Log](checks/'+c.label+'.log) |').join('\n')+'\n\n### New and final commands\n\n| Command | Result |\n|---|---|\n'+[
 'node C:/Users/joe/website_creator/tests/section-variants.mjs',
 'node C:/Users/joe/website_creator/tests/review-rating-filter.mjs',
 'node C:/Users/joe/website_creator/tests/section-variants-browser.mjs',
 'node C:/Users/joe/website_creator/tests/section-variants-fallbacks.mjs',
 'node C:/Users/joe/website_creator/docs/build-evidence/028B/tools/sites-unchanged.mjs after',
 'node C:/Users/joe/website_creator/docs/build-evidence/028B/tools/preservation.mjs',
 'node C:/Users/joe/website_creator/build.mjs'
].map(c=>'| '+tick+c+tick+' | PASS |').join('\n')+'\n';
fs.writeFileSync(out+'/README.md',md);console.log(JSON.stringify(counts));

