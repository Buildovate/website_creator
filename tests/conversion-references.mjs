import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {serviceOptions,selectServices} from '../src/client/workspace/service-selection.ts';
import library from '../public/trade-library.json' with {type:'json'};
import {roofingFixture} from './fixtures/roofing-journey.mjs';
import {worker,env,admin} from './preview-fixture.mjs';
const origin='https://test.local';
async function request(path,method='GET',body,user=admin){return worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:body?JSON.stringify(body):undefined}),env)}
async function api(path,method='GET',body){const r=await request('/api'+path,method,body);assert.equal(r.status,200,await r.clone().text());return r.json()}
const cases=[['roofing','roof-repair','Roof repair','Request roof repair'],['hvac','hvac-replacement','Heat pumps','Discuss my HVAC options'],['patios','patio-design','Patio covers','Plan my patio project']];
for(const [kit,journey,service,cta] of cases){
 for(const layout of ['immersive','editorial','studio']){
  const r=await request(`/design-preview/${kit}/${layout}?journey=${journey}`);assert.equal(r.status,200);const h=await r.text();
  assert.ok(h.includes(`data-journey="${journey}"`));assert.ok(h.includes('cx-film-hero'));assert.equal((h.match(/data-build-video/g)||[]).length,1,'One scroll film in the hero');assert.ok(h.includes(kit==='roofing'?'Discuss my roofing options':cta));assert.equal((h.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1);assert.equal((h.match(/id="home"/g)||[]).length,1);
  assert.equal((h.match(/id="lead-form"/g)||[]).length,1);assert.ok(h.includes('Preview — submission disabled'));assert.ok(!h.includes('Free estimate'));assert.ok(!h.includes('fictional customer'));assert.ok(!h.includes('About the business'));assert.ok(!h.includes('data-review-slug'));
  assert.ok(h.includes('name="projectCity"'));assert.ok(h.includes('name="timeframe"'));assert.ok(h.includes('Illustrative')||h.includes('Concept imagery'));
  const allIds=[...h.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(allIds).size,allIds.length,'No duplicate DOM IDs');
  for(const link of h.matchAll(/href="#([^"]+)"/g))assert.ok(allIds.includes(link[1]),`Missing anchor ${link[1]}`);
 }
 let {tenant:t}=await api('/tenants','POST',{designKit:kit,slug:'conversion-'+kit,settings:{name:'Reference '+kit,phone:'8055550123',area:'Test City',journey,showDemoProjects:false,services:[{name:service}],conversionBrief:{headline:'UNCONFIRMED_HEADLINE',difference:'UNCONFIRMED_CLAIM',nextStep:'UNCONFIRMED_PROMISE'}}});
 assert.equal(t.settings.journey,journey);
 let h=await (await request('/s/'+t.slug+'?preview=1')).text();for(const value of ['UNCONFIRMED_HEADLINE','UNCONFIRMED_CLAIM','UNCONFIRMED_PROMISE'])assert.ok(!h.includes(value));
 await api('/tenants/'+t.id+'/publish','POST',{version:t.version,approved:true});
 ({tenant:t}=await api('/tenants/'+t.id));
 ({tenant:t}=await api('/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,conversionBrief:{headline:'A confirmed headline',difference:'<script>unsafe()</script>',nextStep:'We discuss the scope first.',confirmed:true}}}));
 h=await (await request('/s/'+t.slug+'?preview=1')).text();assert.ok(h.includes('A confirmed headline'));assert.ok(h.includes('&lt;script&gt;'));assert.ok(!h.includes('<script>unsafe()'));
 const published=await (await request('/s/'+t.slug,'GET',null,null)).text();assert.ok(!published.includes('0 published projects'));assert.ok(!published.includes('id="customer-reviews"'));assert.ok(!published.includes('href="#projects"'));assert.ok(!published.includes('data-empty-project-map'));assert.ok(!published.includes('id="job-map"'),'No invented coordinates when there are no projects');assert.ok(!published.includes('A confirmed headline'));assert.ok(published.includes(`data-journey="${journey}"`));
 ({tenant:t}=await api('/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,design:{...t.settings.design,font:'editorial',cards:'soft'},effects:{...t.settings.effects,scrollStory:false,cutaway:false}}}));
 assert.equal(t.settings.journey,journey);assert.equal(t.settings.conversionBrief.confirmed,true);
 h=await (await request('/s/'+t.slug+'?preview=1')).text();assert.ok(h.includes('cx-font-editorial'));assert.ok(!h.includes('data-build-video'));assert.ok(!h.includes('id="inside"'));
 ({tenant:t}=await api('/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,reviews:{googleUrl:'https://www.google.com/maps?cid=1234',confirmed:true}}}));
 const withProof=await (await request('/s/'+t.slug+'?preview=1')).text();assert.equal((withProof.match(/id="customer-reviews"/g)||[]).length,1,'Decorator must not duplicate the proof section');
 const invalid=await request('/api/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,journey:journey==='roof-repair'?'patio-design':'roof-repair'}});assert.equal(invalid.status,400);
 const originalServices=t.settings.services;
 const allServices=selectServices(originalServices,serviceOptions(originalServices,library[t.settings.trade]));
 ({tenant:t}=await api('/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,services:allServices}}));
 const allHtml=await (await request('/s/'+t.slug+'?preview=1')).text();
 assert.ok(allServices.length>3);for(const item of allServices)assert.ok(allHtml.includes(`<h3>${item.name}</h3>`),item.name);
 assert.ok(!(await (await request('/s/'+t.slug,'GET',null,null)).text()).includes(`<h3>${allServices.find(x=>x.name!==service).name}</h3>`),'Service choices remain draft only');
 ({tenant:t}=await api('/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,services:originalServices}}));
 const selectedHtml=await (await request('/s/'+t.slug+'?preview=1')).text();
 assert.ok(!selectedHtml.includes(`<h3>${allServices.find(x=>x.name!==service).name}</h3>`),'Deselected services do not display');
 const lead=await request('/api/public/'+t.slug+'/inquiries','POST',{name:'Test Homeowner',phone:'8055550144',consent:true,message:service+' · Project city: Test City · Preferred timing: Planning ahead · Test inquiry'},null);assert.equal(lead.status,200,await lead.clone().text());
 const detail=await api('/tenants/'+t.id);assert.ok(detail.inquiries.some(x=>x.message.includes('Project city: Test City')));
}
assert.equal((await request('/api/tenants','POST',{designKit:'roofing',slug:'invalid-offering',settings:{name:'Roof Company',journey:'roof-repair',services:[{name:'Roof installation'}]}})).status,400);
assert.equal((await request('/design-preview/plumbing/studio?journey=roof-repair')).status,400);
assert.equal((await request('/design-preview/roofing/studio?journey=roof-repair','GET',null,null)).status,401);
const legacy=await (await request('/design-preview/roofing/immersive')).text();assert.ok(legacy.includes('Request an estimate'));assert.ok(!legacy.includes('Free estimate'));assert.ok(!legacy.includes('About the business'));
const client=readFileSync('dist/client/conversion.js','utf8');assert.ok(client.includes('prefers-reduced-motion'));assert.ok(client.includes('data-service-link'));
console.log('PASS conversion references: 3 journeys × 3 layouts, draft isolation, claim approval/escaping, inquiry persistence, preview auth, anchor integrity, one H1, effects, and legacy CTA corrections.');

const custom=[{name:'Custom roof repair',description:'Keep the contractor’s wording.'},{name:'Gutters',description:'Existing gutter scope.'}];
assert.deepEqual(serviceOptions(custom,['Gutters','Roof repair']),['Custom roof repair','Gutters','Roof repair']);
assert.deepEqual(selectServices(custom,['custom roof repair','CUSTOM ROOF REPAIR','Roof repair']),[custom[0],{name:'Roof repair',description:''}]);
assert.throws(()=>selectServices(custom,[]),/at least one/);assert.throws(()=>selectServices([],Array.from({length:25},(_,i)=>'Service '+i)),/24/);
console.log('PASS service checklist: custom names, descriptions, deduplication, selection limits, full service rendering and draft isolation.');

// #002: one published Roofing fixture supports both intents without inventing services.
let {tenant:roofing}=await api('/tenants','POST',roofingFixture);
await api('/tenants/'+roofing.id+'/publish','POST',{version:roofing.version,approved:true});
const roofPath='/s/'+roofing.slug;
let roofHtml=await (await request(roofPath,'GET',null,null)).text();
assert.ok(roofHtml.includes('ROOF REPAIR &amp; REPLACEMENT'));
assert.ok(roofHtml.includes('Discuss my roofing options'));
assert.ok(!roofHtml.includes('Request roof repair'),'Replacement visitors must not submit a repair-only promise');
assert.ok(roofHtml.includes('href="tel:+18055550123"'));
assert.ok(roofHtml.includes('class="cx-header"'));
assert.equal((roofHtml.match(/data-build-video/g)||[]).length,1);
for(const {name} of roofingFixture.settings.services){assert.ok(roofHtml.includes(`<h3>${name}</h3>`));assert.ok(roofHtml.includes(`/services/${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`));}
assert.ok(!roofHtml.includes('<h3>Metal roofing</h3>'),'Unselected services stay absent');
for(const [i,service] of ['Roof repair','Roof replacement'].entries()){
 const response=await request('/api/public/'+roofing.slug+'/inquiries','POST',{name:'Roofing QA '+i,phone:'805555015'+i,consent:true,message:service+' · Project city: Ventura · Preferred timing: Planning ahead · Local ticket 002 check'},null);
 assert.equal(response.status,200,await response.clone().text());
}
({tenant:roofing}=await api('/tenants/'+roofing.id));
const saved=await api('/tenants/'+roofing.id);
for(const service of ['Roof repair','Roof replacement'])assert.ok(saved.inquiries.some(x=>x.message.includes('\n\n'+service+' ·')));
({tenant:roofing}=await api('/tenants/'+roofing.id,'PUT',{version:roofing.version,settings:{...roofing.settings,services:[{name:'Roof repair'}],effects:{...roofing.settings.effects,scrollStory:false}}}));
const repairOnly=await (await request(roofPath+'?preview=1')).text();
assert.ok(repairOnly.includes('Request roof repair'));assert.ok(!repairOnly.includes('ROOF REPAIR &amp; REPLACEMENT'));
assert.ok(!repairOnly.includes('data-build-video'));assert.ok(repairOnly.includes('class="cx-hero"'));
roofHtml=await (await request(roofPath,'GET',null,null)).text();
assert.ok(roofHtml.includes('Discuss my roofing options'));assert.ok(roofHtml.includes('data-build-video'),'Draft preferences must not change the published journey');
console.log('PASS Roofing #002: repair/replacement copy matches selected services, direct call/inquiry paths, both inquiry intents persisted, one preserved hero film, repair-only/static fallback and published isolation. Local fixture only.');
