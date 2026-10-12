import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanTrust,TRUST_NETWORKS,publicTrustSelections,validateTrustPublication} from '../src/platform/trust.ts';
import {worker,env,admin} from './preview-fixture.mjs';
const today=new Date().toISOString().slice(0,10),future='2099-12-31';
const google={id:'google',enabled:true,approved:true,profileUrl:'https://www.google.com/maps?cid=1234',display:'rating',rating:4.7,reviewCount:34,evidence:{url:'https://www.google.com/maps?cid=1234',note:'PRIVATE_EVIDENCE_NOTE',confirmed:true,checkedAt:today},expiresAt:future};
const selected=(networks=[google])=>({version:1,enabled:true,showRatings:true,networks});
async function request(path,method='GET',value,user=admin,origin='https://test.local'){
 return worker.fetch(new Request('https://test.local'+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value===undefined?undefined:JSON.stringify(value)}),env);
}
async function api(path,method='GET',value){const r=await request('/api'+path,method,value);assert.equal(r.status,200,await r.clone().text());return r.json();}
test('network contract: bounded HTTPS fields, supported networks, stable order and explicit clear',()=>{
 const s=cleanTrust(selected());assert.deepEqual(cleanTrust(undefined,s),s);assert.equal(cleanTrust({}).networks.length,0);
 assert.equal(TRUST_NETWORKS.length,16);assert.equal(s.networks[0].rating,4.7);
 for(const value of [null,[],{version:2},{networks:[google,google]},{networks:[{id:'fake'}]},{layout:'random'},{placements:['below-hero','below-hero']},{networks:[{...google,rating:6}]},{networks:[{...google,reviewCount:-1}]},{networks:[{...google,expiresAt:'2026-02-30'}]},{networks:[{...google,evidence:{url:'http://unsafe.test'}}]}])assert.throws(()=>cleanTrust(value));
 for(const profileUrl of ['http://google.com/','javascript:alert(1)','https://user:pass@google.com/','https://google.com.evil.test/','https://127.0.0.1/','https://google.com:4000/'])assert.throws(()=>cleanTrust(selected([{...google,profileUrl}])));
 assert.throws(()=>cleanTrust(selected([{...google,id:'nate',profileUrl:'https://natex.org/'}])));
 const order=cleanTrust(selected([{id:'yelp',enabled:true,profileUrl:'https://www.yelp.com/biz/qa'},google]));assert.deepEqual(order.networks.map(n=>n.id),['yelp','google']);
});
test('publication and render-time evidence gates: approval, freshness, counts and license support',()=>{
 validateTrustPublication(selected());assert.equal(publicTrustSelections(selected()).length,1);
 for(const change of [{approved:false},{profileUrl:''},{rating:null},{reviewCount:null},{expiresAt:'2000-01-01'},{evidence:{...google.evidence,confirmed:false}},{evidence:{...google.evidence,url:''}},{evidence:{...google.evidence,checkedAt:'2099-01-01'}}]){
  const value=selected([{...google,...change}]);assert.throws(()=>validateTrustPublication(value));assert.equal(publicTrustSelections(value).length,0);
 }
 assert.equal(publicTrustSelections(selected(),{},new Date('2100-01-01')).length,0);
 const license={id:'state-license',enabled:true,approved:true,profileUrl:'https://www.cslb.ca.gov/',credential:'Active contractor license',evidence:google.evidence,expiresAt:future};
 assert.throws(()=>validateTrustPublication(selected([license])));
 validateTrustPublication(selected([license]),{licenseNumber:'QA-123',licenseState:'CA',confirmed:{license:true}});
 const profile={id:'google',enabled:true,approved:true,profileUrl:google.profileUrl};validateTrustPublication(selected([profile]));assert.equal(publicTrustSelections(selected([profile])).length,1);
 assert.equal(publicTrustSelections({...selected(),enabled:false}).length,0);
});
test('actual API: draft/snapshot separation, old-client preservation, validation, publish recheck and permissions',async()=>{
 const row=await env.DB.prepare('SELECT id FROM tenants WHERE slug=?').bind('robles-roofing').first(),path='/tenants/'+row.id;
 let {tenant}=await api(path);const initial=tenant.published;
 ({tenant}=await api(path,'PUT',{version:tenant.version,settings:{...tenant.settings,trust:selected()}}));
 assert.equal(tenant.settings.trust.networks[0].evidence.note,'PRIVATE_EVIDENCE_NOTE');assert.deepEqual(tenant.published,initial);
 const older={...tenant.settings};delete older.trust;({tenant}=await api(path,'PUT',{version:tenant.version,settings:older}));assert.equal(tenant.settings.trust.networks.length,1);
 const invalid=await request('/api'+path,'PUT',{version:tenant.version,settings:{...tenant.settings,trust:selected([{...google,profileUrl:'http://google.com'}])}});assert.equal(invalid.status,400);
 assert.equal((await request('/api'+path,'PUT',{version:tenant.version,settings:tenant.settings},null)).status,401);
 assert.equal((await request('/api'+path,'PUT',{version:tenant.version,settings:tenant.settings},admin,'https://attacker.test')).status,403);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});({tenant}=await api(path));assert.equal(tenant.published.trust.networks[0].rating,4.7);
 ({tenant}=await api(path,'PUT',{version:tenant.version,settings:{...tenant.settings,trust:selected([{...google,evidence:{...google.evidence,confirmed:false}}])}}));
 assert.equal((await request('/api'+path+'/publish','POST',{version:tenant.version,approved:true})).status,400);assert.equal((await api(path)).tenant.published.trust.networks[0].evidence.confirmed,true);
 // Stale/forged stored drafts are checked again at publication, not just during PUT.
 const forged={...tenant.settings,trust:selected([{...google,expiresAt:'2000-01-01'}])};await env.DB.prepare('UPDATE tenants SET settings=? WHERE id=?').bind(JSON.stringify(forged),tenant.id).run();
 assert.equal((await request('/api'+path+'/publish','POST',{version:tenant.version,approved:true})).status,400);
 ({tenant}=await api(path,'PUT',{version:tenant.version,settings:{...tenant.settings,trust:{}}}));assert.equal(tenant.settings.trust.networks.length,0);assert.equal(tenant.published.trust.networks.length,1);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});assert.equal((await api(path)).tenant.published.trust.networks.length,0);
 assert.ok(!(await (await request('/s/robles-roofing','GET',undefined,null)).text()).includes('PRIVATE_EVIDENCE_NOTE'));
});

test('#009 strip renders only approved selections with source links, no assumed marks or ratings',async()=>{
 const {renderTrustStrip}=await import('../src/trust.js');const s={trade:'Roofing',trust:selected()};
 const html=renderTrustStrip(s);assert.match(html,/4\.7/);assert.match(html,/34 reviews/);assert.match(html,/Owner-confirmed/);assert.ok(!html.includes('PRIVATE_EVIDENCE_NOTE'));assert.ok(!html.includes('<img'));assert.match(html,/rel="noopener noreferrer"/);
 assert.equal(renderTrustStrip({...s,trade:'Plumbing'}),'');assert.equal(renderTrustStrip(s,{placement:'footer'}),'');
 for(const trust of [{},selected([]),selected([{...google,approved:false}]),selected([{...google,enabled:false}]),selected([{...google,expiresAt:'2000-01-01'}])])assert.equal(renderTrustStrip({...s,trust}),'');
 const neutral=renderTrustStrip({...s,trust:selected([{id:'google',enabled:true,approved:true,profileUrl:google.profileUrl}])});assert.match(neutral,/View profile/);assert.ok(!neutral.includes('trust-rating'));assert.ok(!neutral.includes('★'));
 const custom=renderTrustStrip({...s,trust:selected([{id:'custom',enabled:true,approved:true,profileUrl:'https://chamber.example.test/',label:'<script>bad</script>'}])});assert.ok(!custom.includes('<script>bad'));assert.match(custom,/&lt;script&gt;/);
 const many=TRUST_NETWORKS.filter(n=>n.domains.length).slice(0,6).map(n=>({id:n.id,enabled:true,approved:true,profileUrl:'https://'+n.domains[0]+'/qa'}));
 assert.match(renderTrustStrip({...s,trust:selected(many)}),/data-trust-mode="carousel"/);assert.match(renderTrustStrip({...s,trust:selected(many.slice(0,3))}),/data-trust-mode="row"/);
 assert.ok(!renderTrustStrip({...s,trust:{...selected(),showRatings:false}}).includes('trust-rating'));
});
test('#009 public/preview rendering preserves selected network snapshot and source privacy',async()=>{
 const row=await env.DB.prepare('SELECT id FROM tenants WHERE slug=?').bind('robles-roofing').first(),path='/tenants/'+row.id;let {tenant}=await api(path);
 ({tenant}=await api(path,'PUT',{version:tenant.version,settings:{...tenant.settings,designKit:'roofing',template:'cinematic',journey:'roof-repair',trust:selected()}}));
 let page=await (await request('/s/robles-roofing','GET',undefined,null)).text();assert.ok(!page.includes('data-trust-strip'));
 const preview=await (await request('/s/robles-roofing?preview=1')).text();assert.match(preview,/data-trust-network="google"/);assert.ok(!preview.includes('PRIVATE_EVIDENCE_NOTE'));
 assert.equal((await request('/s/robles-roofing?preview=1','GET',undefined,null)).status,401);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});({tenant}=await api(path));
 page=await (await request('/s/robles-roofing','GET',undefined,null)).text();assert.match(page,/data-trust-network="google"/);assert.ok(!page.includes('PRIVATE_EVIDENCE_NOTE'));
 ({tenant}=await api(path,'PUT',{version:tenant.version,settings:{...tenant.settings,trust:selected([])}}));
 assert.match(await (await request('/s/robles-roofing','GET',undefined,null)).text(),/data-trust-network="google"/);
 await api(path+'/publish','POST',{version:tenant.version,approved:true});assert.ok(!(await (await request('/s/robles-roofing','GET',undefined,null)).text()).includes('data-trust-strip'));
});


test('#009 selected placement hooks work on both Roofing homepages and the service page',async()=>{
 const row=await env.DB.prepare('SELECT id FROM tenants WHERE slug=?').bind('robles-roofing').first(),path='/tenants/'+row.id;let {tenant}=await api(path);
 const trust={...selected(),placements:['below-hero','above-reviews','services','forms','footer','service-hero']};
 for(const journey of ['standard','roof-repair']){
  ({tenant}=await api(path,'PUT',{version:tenant.version,settings:{...tenant.settings,journey,trust,websitePages:{version:1,pages:[{id:'trust-repair',kind:'service',title:'Roof repair',slug:'roof-repair',serviceName:'Roof repair',enabled:true}]}}}));
  await api(path+'/publish','POST',{version:tenant.version,approved:true});({tenant}=await api(path));
  const html=await (await request('/s/robles-roofing','GET',undefined,null)).text();assert.equal((html.match(/data-trust-strip /g)||[]).length,5);assert.equal((html.match(/src="\/trust.js/g)||[]).length,1);
  for(const placement of trust.placements.filter(x=>x!=='service-hero'))assert.ok(html.includes('id="trust-'+placement+'-heading"'));
 }
 const service=await (await request('/s/robles-roofing/services/roof-repair','GET',undefined,null)).text();assert.equal((service.match(/data-trust-strip /g)||[]).length,1);assert.match(service,/trust-service-hero-heading/);
});
