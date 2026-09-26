import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {worker,env,admin} from './preview-fixture.mjs';
const origin='https://test.local';
async function request(path,method='GET',value,user=admin,bindings=env){return worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':value instanceof Uint8Array?'image/jpeg':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value instanceof Uint8Array?value:value===undefined?undefined:JSON.stringify(value)}),bindings)}
async function api(path,method='GET',value){const response=await request('/api'+path,method,value);assert.equal(response.status,200,await response.clone().text());return response.json()}
const record=await env.DB.prepare('SELECT id FROM tenants WHERE slug=?').bind('robles-roofing').first();
let {tenant}=await api('/tenants/'+record.id);
const {id:logoId}=await api('/tenants/'+tenant.id+'/photos?caption=Test-only%20brand%20asset','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
const reviews={confirmed:true,minimum:4,googleUrl:'https://www.google.com/maps?cid=1234',googlePlaceId:'QA_place',privacyUrl:'https://test.local/privacy',termsUrl:'https://test.local/terms',yelpUrl:'https://www.yelp.com/biz/qa-business',yelpBusinessId:'qa-business'};
({tenant}=await api('/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,designKit:'roofing',template:'cinematic',journey:'roof-repair',logoId,reviews,showProjects:true,effects:{...tenant.settings.effects,projectMap:true}}}));
const base='/s/'+tenant.slug;
const draft=await (await request(base+'?preview=1')).text();
assert.ok(draft.includes('class="site-brand-logo"'));assert.ok(draft.includes('/media/'+logoId));assert.ok(draft.includes('id="job-map"'));assert.ok(!draft.includes('data-empty-project-map'));
assert.equal((await request('/media/'+logoId,'GET',undefined,null)).status,401,'An unpublished logo stays private');
await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
({tenant}=await api('/tenants/'+tenant.id));
const published=await (await request(base,'GET',undefined,null)).text();
assert.ok(published.includes('class="site-brand-logo"'));assert.ok(!published.includes('id="job-map"'),'Test-only jobs are excluded from public maps');assert.ok(published.includes('id="customer-reviews"'));assert.ok(published.includes('data-review-slug="robles-roofing"'));
assert.equal((await request('/media/'+logoId,'GET',undefined,null)).status,200);
assert.ok(!published.includes('id="project-data"'));
await api('/tenants/'+tenant.id+'/projects','POST',{title:'UNPUBLISHED_JOB',city:'Private Draft City',service:'Roof repair',lat:34,lng:-119,completedAt:'2025-01-01'});
assert.ok(!(await (await request(base,'GET',undefined,null)).text()).includes('UNPUBLISHED_JOB'));
const fallback=await (await request('/api/public/'+tenant.slug+'/reviews','GET',undefined,null)).json();
assert.equal(fallback.providers.length,2);assert.ok(fallback.providers.every(x=>x.status&&!x.reviews&&!x.rating));
const originalFetch=globalThis.fetch;let providerCalls=0;
globalThis.fetch=async url=>{providerCalls++;const u=String(url);if(u.startsWith('https://places.googleapis.com/'))return Response.json({displayName:{text:'QA business'},rating:3.8,userRatingCount:40,googleMapsUri:reviews.googleUrl,reviews:[{rating:5,text:{text:'TEST_ONLY_REVIEW'},authorAttribution:{displayName:'QA reviewer',uri:'https://example.test/reviewer'},googleMapsUri:reviews.googleUrl},{rating:2,text:{text:'FILTERED_TEST_REVIEW'}}]});if(u.endsWith('/reviews'))return Response.json({reviews:[{rating:4,text:'TEST_ONLY_YELP_EXCERPT',user:{name:'QA Yelp reviewer'},url:reviews.yelpUrl}]});if(u.startsWith('https://api.yelp.com/'))return Response.json({name:'QA business',rating:4,review_count:12,url:reviews.yelpUrl});throw Error('Unexpected external request')};
try{const response=await request('/api/public/'+tenant.slug+'/reviews','GET',undefined,null,{...env,GOOGLE_PLACES_API_KEY:'test-only-placeholder',YELP_API_KEY:'test-only-placeholder'});assert.equal(response.status,200);const result=await response.json();assert.equal(providerCalls,3);assert.equal(result.providers[0].rating,3.8,'Keep source aggregate rating even with display filter');assert.equal(result.providers[0].reviews.length,1);assert.equal(result.providers[0].reviews[0].author,'QA reviewer');assert.equal(result.providers[1].reviews[0].text,'TEST_ONLY_YELP_EXCERPT');}finally{globalThis.fetch=originalFetch}
({tenant}=await api('/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,showProjects:false}}));
const hidden=await (await request(base+'?preview=1')).text();assert.ok(!hidden.includes('id="job-map"'));assert.ok(!hidden.includes('href="#projects"'));
assert.ok(!(await (await request(base,'GET',undefined,null)).text()).includes('id="job-map"'),'Sample jobs stay private after draft changes');
console.log('PASS reference proof: published project map, unpublished isolation, owner visibility, logo privacy/publish, connected review placement, no-key fallback and mocked provider attribution/filtering.');

// #010 strengthens snapshot and media privacy around the actual project records.
const proofProjects=(await api('/tenants/'+tenant.id)).projects;
const publicProject=proofProjects.find(p=>p.published),projectPath='/tenants/'+tenant.id+'/projects/'+publicProject.id;
const latePhoto=await api('/tenants/'+tenant.id+'/photos?projectId='+publicProject.id+'&stage=during&caption=PRIVATE_LATE_PHOTO','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
await api(projectPath,'PUT',{version:publicProject.version,data:{...publicProject.data,title:'PRIVATE_PUBLISHED_PROJECT_EDIT'}});
const unchanged=await (await request(base,'GET',undefined,null)).text();assert.ok(!unchanged.includes('PRIVATE_PUBLISHED_PROJECT_EDIT'));assert.ok(!unchanged.includes(latePhoto.id));assert.equal((await request('/media/'+latePhoto.id,'GET',undefined,null)).status,401);
assert.equal((await request(base+'/projects/'+publicProject.id,'GET',undefined,null)).status,404,'Test-only story stays private');const story=await (await request(base+'/projects/'+publicProject.id+'?preview=1','GET',undefined,admin)).text();assert.ok(story.includes('PRIVATE_LATE_PHOTO'),'Authorized draft preview shows draft photos');assert.match(story,new RegExp('href="'+base+'\\?preview=1#projects"'),'Preview story returns to the homepage map');
const draftLogo=await api('/tenants/'+tenant.id+'/photos','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
({tenant}=await api('/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,logoId:draftLogo.id,reviews:{...reviews,googleUrl:'https://www.google.com/maps?cid=999999',confirmed:false}}}));
const unchangedBrand=await (await request(base,'GET',undefined,null)).text();assert.ok(unchangedBrand.includes('/media/'+logoId));assert.ok(!unchangedBrand.includes('/media/'+draftLogo.id));assert.ok(!unchangedBrand.includes('cid=999999'));assert.equal((await request('/media/'+draftLogo.id,'GET',undefined,null)).status,401);
const draftReviewResponse=await request('/api/public/'+tenant.slug+'/reviews?preview=1','GET',undefined,null);assert.equal(draftReviewResponse.status,401);
const blank=(await api('/tenants','POST',{slug:'proof-empty',designKit:'roofing',settings:{name:'Proof empty QA',journey:'roof-repair',phone:'8055550123',area:'Ventura',showDemoProjects:false,showOwner:false,services:[{name:'Roof repair'}]}})).tenant;
await api('/tenants/'+blank.id+'/publish','POST',{version:blank.version,approved:true});const empty=await (await request('/s/proof-empty','GET',undefined,null)).text();
assert.match(empty,/data-empty-project-map/);assert.ok(!empty.includes('id="job-map"'));assert.ok(!empty.includes('id="project-data"'));assert.ok(!empty.includes('id="customer-reviews"'));assert.match(empty,/site-brand-mark/);assert.match(empty,/Discuss my roof/);
assert.equal((await request('/api/tenants/'+blank.id,'PUT',{version:2,settings:{...blank.settings,logoId}},admin)).status,400,'Another tenant cannot select the published logo');
await api(projectPath+'/unpublish','POST',{});const removed=await (await request(base,'GET',undefined,null)).text();assert.ok(!removed.includes(publicProject.id));assert.equal((await request(base+'/projects/'+publicProject.id,'GET',undefined,null)).status,404);assert.equal((await request('/media/'+publicProject.published.afterId,'GET',undefined,null)).status,401);
console.log('PASS #010: project snapshot vs draft edits, post-publication private photos, draft logo/review privacy, cross-tenant logo rejection, actual story-to-map anchor, empty map/logo/review states and immediate project/media revocation. All provider results above are mocked.');
