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
assert.ok(published.includes('class="site-brand-logo"'));assert.ok(published.includes('id="job-map"'));assert.ok(published.includes('id="customer-reviews"'));assert.ok(published.includes('data-review-slug="robles-roofing"'));
assert.equal((await request('/media/'+logoId,'GET',undefined,null)).status,200);
const projectData=JSON.parse(published.match(/<script[^>]*id="project-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.equal(projectData.length,2);assert.deepEqual(projectData.map(x=>x.city).sort(),['Oxnard','Ventura']);
await api('/tenants/'+tenant.id+'/projects','POST',{title:'UNPUBLISHED_JOB',city:'Private Draft City',service:'Roof repair',lat:34,lng:-119,completedAt:'2025-01-01'});
assert.ok(!(await (await request(base,'GET',undefined,null)).text()).includes('UNPUBLISHED_JOB'));
const fallback=await (await request('/api/public/'+tenant.slug+'/reviews','GET',undefined,null)).json();
assert.equal(fallback.providers.length,2);assert.ok(fallback.providers.every(x=>x.status&&!x.reviews&&!x.rating));
const originalFetch=globalThis.fetch;let providerCalls=0;
globalThis.fetch=async url=>{providerCalls++;const u=String(url);if(u.startsWith('https://places.googleapis.com/'))return Response.json({displayName:{text:'QA business'},rating:3.8,userRatingCount:40,googleMapsUri:reviews.googleUrl,reviews:[{rating:5,text:{text:'TEST_ONLY_REVIEW'},authorAttribution:{displayName:'QA reviewer',uri:'https://example.test/reviewer'},googleMapsUri:reviews.googleUrl},{rating:2,text:{text:'FILTERED_TEST_REVIEW'}}]});if(u.endsWith('/reviews'))return Response.json({reviews:[{rating:4,text:'TEST_ONLY_YELP_EXCERPT',user:{name:'QA Yelp reviewer'},url:reviews.yelpUrl}]});if(u.startsWith('https://api.yelp.com/'))return Response.json({name:'QA business',rating:4,review_count:12,url:reviews.yelpUrl});throw Error('Unexpected external request')};
try{const response=await request('/api/public/'+tenant.slug+'/reviews','GET',undefined,null,{...env,GOOGLE_PLACES_API_KEY:'test-only-placeholder',YELP_API_KEY:'test-only-placeholder'});assert.equal(response.status,200);const result=await response.json();assert.equal(providerCalls,3);assert.equal(result.providers[0].rating,3.8,'Keep source aggregate rating even with display filter');assert.equal(result.providers[0].reviews.length,1);assert.equal(result.providers[0].reviews[0].author,'QA reviewer');assert.equal(result.providers[1].reviews[0].text,'TEST_ONLY_YELP_EXCERPT');}finally{globalThis.fetch=originalFetch}
({tenant}=await api('/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,showProjects:false}}));
const hidden=await (await request(base+'?preview=1')).text();assert.ok(!hidden.includes('id="job-map"'));assert.ok(!hidden.includes('href="#projects"'));
assert.ok((await (await request(base,'GET',undefined,null)).text()).includes('id="job-map"'),'Draft visibility changes do not alter public projects');
console.log('PASS reference proof: published project map, unpublished isolation, owner visibility, logo privacy/publish, connected review placement, no-key fallback and mocked provider attribution/filtering.');
