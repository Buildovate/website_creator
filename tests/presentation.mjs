import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {worker,env,admin} from './preview-fixture.mjs';
const fetchPage=async(path)=>worker.fetch(new Request('https://test.local'+path,{headers:{'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email}}),env);
const response=await fetchPage('/s/robles-roofing');assert.equal(response.status,200);const html=await response.text();
for(const expected of ['data-build-video','data-detail-video','OUR SERVICES','A FRESH<br><em>PERSPECTIVE.</em>','id="lead-form"','roof-cutaway.webp','Robles Roofing Oxnard | Roof Repair &amp; Installation'])assert.ok(html.includes(expected),expected);
assert.ok(!html.includes('id="project-data"'),'Synthetic sample jobs stay out of the published site');
const previewResponse=await fetchPage('/s/robles-roofing?preview=1'),preview=await previewResponse.text();assert.ok(preview.includes('id="project-data"'),'Private preview retains the sample layout');
assert.equal((html.match(/data-comparison=/g)||[]).length,5);assert.equal((html.match(/data-step=/g)||[]).length,5);assert.ok(!html.includes('{{'));assert.ok(!html.includes('owner-photo-file'));assert.ok(html.includes('tel:+18052480739'));
for(const match of html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)){const path=match[1];if(path.startsWith('/assets/')||/\.(css|js)$/.test(path))assert.ok(existsSync('./dist/client'+path),'Missing '+path)}
assert.ok(html.includes('content="index,follow"'));assert.equal(response.headers.get('x-robots-tag'),'index, follow');assert.ok(preview.includes('noindex,nofollow'));assert.equal(previewResponse.headers.get('x-robots-tag'),'noindex, nofollow');assert.ok(!html.includes('4.9'));assert.ok(!html.includes('500+'));
const core=await import('../src/core.js');const custom=core.settings({...core.ROBLES,name:'Another Roofing Company',owner:'Actual Owner',phone:'(805) 555-0100',experience:'',license:'',area:'Custom service area',showOwnerPhoto:false});assert.equal(custom.showOwnerPhoto,false);assert.equal(custom.license,'');
assert.ok(readFileSync('public/portfolio-theme.css','utf8').includes('@media(prefers-reduced-motion:reduce)'));
console.log('PASS: cinematic page renders, correct SEO title, 5 comparison choices, 5 process steps, real portfolio and inquiry markup, all local assets resolve, no unresolved tokens, no browser-only owner editor, privacy metadata, verified-claim handling, owner-photo toggle, reduced-motion rules.');
