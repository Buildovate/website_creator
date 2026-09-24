import assert from 'node:assert/strict';
import {worker,env,admin} from './preview-fixture.mjs';

const origin='https://test.local';
const tenant=await env.DB.prepare('SELECT * FROM tenants WHERE slug=?').bind('robles-roofing').first();
const path='/api/engagement/'+tenant.id+'/review-lookup';
const profiles={googleUrl:'https://maps.google.com/?q=Robles',yelpUrl:'https://www.yelp.com/biz/robles-roofing-oxnard'};
const bindings={...env,GOOGLE_PLACES_API_KEY:'fixture-only-google',YELP_API_KEY:'fixture-only-yelp'};
const noKeys={...env,GOOGLE_PLACES_API_KEY:'',YELP_API_KEY:''};
async function request(data,{config=bindings,user=admin,requestOrigin=origin}={}){
 return worker.fetch(new Request(origin+path,{method:'POST',headers:{origin:requestOrigin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:JSON.stringify(data)}),config);
}
async function ok(data,options){const r=await request(data,options);assert.equal(r.status,200,await r.clone().text());return r.json();}
const originalFetch=globalThis.fetch;
let calls=[],empty=false,fail=false;
globalThis.fetch=async(url,options)=>{
 const u=new URL(url);calls.push({url:u,body:options?.body&&JSON.parse(options.body)});
 if(fail)return new Response('fixture provider unavailable',{status:503});
 if(u.hostname==='places.googleapis.com'&&u.pathname==='/v1/places:searchText')return Response.json({places:empty?[]:[{id:'ChIJ_test',displayName:{text:'Robles Roofing'},formattedAddress:'Oxnard',googleMapsUri:'https://maps.google.com/?q=place_id:ChIJ_test'}]});
 if(u.hostname==='api.yelp.com'&&u.pathname==='/v3/businesses/search')return Response.json({businesses:[{id:'robles-roofing-oxnard',name:'Robles Roofing',location:{display_address:['Oxnard','CA']},url:'https://www.yelp.com/biz/robles-roofing-oxnard'}]});
 throw Error('Unexpected external request in review-lookup fixture');
};
try{
 const offline=await ok(profiles,{config:noKeys});
 assert.deepEqual(offline.google,[]);
 assert.equal(offline.yelpBusinessId,'robles-roofing-oxnard');
 assert.ok(offline.status.some(s=>s.includes('Connect Google Places')));
 assert.ok(offline.status.some(s=>s.includes('Connect Yelp')));
 assert.ok(offline.status.every(s=>!s.includes('saved')),'Lookup must not claim it saved settings');
 assert.equal(calls.length,0,'Missing-key fallback must not call providers');
 assert.equal((await request({provider:'google',name:'Robles Roofing',location:'Oxnard'},{config:noKeys})).status,409);
 assert.equal((await request({provider:'yelp',name:'Robles Roofing',location:'Oxnard'},{config:noKeys})).status,409);
 assert.equal((await request({googleUrl:'https://evil.test/'})).status,400);
 assert.equal((await request(profiles,{user:null})).status,401);
 assert.equal((await request(profiles,{requestOrigin:'https://evil.test'})).status,403);
 assert.equal(calls.length,0,'Invalid/unauthorized requests must not call providers');

 const legacy=await ok(profiles);
 // These are the exact fields consumed by bindReviewSection in engagement-ui.js.
 assert.equal(legacy.google[0].id,'ChIJ_test');
 assert.equal(legacy.google[0].url,'https://maps.google.com/?q=place_id:ChIJ_test');
 assert.equal(legacy.yelpBusinessId,'robles-roofing-oxnard');
 assert.ok(Array.isArray(legacy.status));
 assert.ok(legacy.status.some(s=>s.includes('Save your settings')));
 assert.equal(calls.length,1,'Profile matching searches Google; Yelp ID comes from the supplied URL');

 const google=await ok({provider:'google',name:'Requested business',location:'Requested city'});
 assert.equal(google.provider,'google');assert.deepEqual(google.results,legacy.google);
 assert.equal(calls.at(-1).body.textQuery,'Requested business Requested city');
 const yelp=await ok({provider:'yelp',name:'Requested business',location:'Requested city'});
 assert.equal(yelp.provider,'yelp');assert.equal(yelp.results[0].id,'robles-roofing-oxnard');
 assert.equal(yelp.results[0].address,'Oxnard, CA');
 assert.equal(calls.at(-1).url.searchParams.get('term'),'Requested business');
 assert.equal(calls.at(-1).url.searchParams.get('location'),'Requested city');

 empty=true;
 const missing=await ok(profiles);assert.deepEqual(missing.google,[]);
 assert.ok(missing.status.some(s=>s.startsWith('No Google match found.')));
 empty=false;fail=true;
 assert.equal((await request(profiles)).status,502,'Upstream failure must not become a successful match');
 fail=false;
 const after=await env.DB.prepare('SELECT * FROM tenants WHERE id=?').bind(tenant.id).first();
 assert.equal(after.settings,tenant.settings,'Lookup never saves or confirms a profile');
 assert.equal(after.published,tenant.published,'Lookup never changes the published site');

 // Both request shapes must share the same hourly provider-search budget.
 const count=await env.DB.prepare("SELECT COUNT(*) AS n FROM audit WHERE tenant_id=? AND action='reviews.lookup'").bind(tenant.id).first();
 for(let n=count.n;n<20;n++)await ok({provider:'google',name:'Robles Roofing',location:'Oxnard'});
 const beforeLimited=calls.length;
 assert.equal((await request(profiles)).status,429);
 assert.equal((await request({provider:'yelp',name:'Robles Roofing',location:'Oxnard'})).status,429);
 assert.equal(calls.length,beforeLimited,'Rate-limited requests must not reach providers');
 console.log('PASS review lookup: profile-form compatibility, Google/Yelp business search, missing-key fallback, invalid profile/origin/auth rejection, empty matches, upstream failure, draft/publish isolation and shared hourly limit. All external responses mocked; no live connections or messages.');
}finally{globalThis.fetch=originalFetch;}
