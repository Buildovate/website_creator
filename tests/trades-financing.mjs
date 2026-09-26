import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {worker,env,admin} from './preview-fixture.mjs';
const origin='https://test.local',headers={origin,'content-type':'application/json','oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email};
async function req(path,method='GET',value,authenticated=true){return worker.fetch(new Request(origin+path,{method,headers:authenticated?headers:{origin,'content-type':'application/json'},body:value===undefined?undefined:JSON.stringify(value)}),env)}
async function api(path,method='GET',value){const r=await req('/api'+path,method,value);assert.equal(r.status,200,await r.clone().text());return r.json()}
const kits=JSON.parse(readFileSync('public/design-kits.json')),library=JSON.parse(readFileSync('public/trade-library.json')),art=JSON.parse(readFileSync('public/service-art.json'));
for(const id of ['windows-doors','solar']){
 const kit=kits[id];assert.equal(library[kit.trade].length,8);assert.equal(new Set(Object.values(art[kit.trade])).size,8);
 for(const asset of [kit.image,kit.videoPoster,...Object.values(kit.art),...Object.values(art[kit.trade])])assert.ok(existsSync('public'+asset),asset);
 for(const layout of ['immersive','editorial','studio']){
  const r=await req(`/design-preview/${id}/${layout}`);assert.equal(r.status,200);const html=await r.text();
  assert.match(html,/data-feature="hero.scrollStory"/);assert.equal((html.match(/data-story-scene=/g)||[]).length,5);
  assert.equal((html.match(/class="service-art"/g)||[]).length,8);assert.ok(html.includes(kit.intro));assert.match(html,/Concept imagery/);
  assert.doesNotMatch(html,/<video|undefined|\/assets\/films\/roofing/,'No fake or unrelated film fallback');
  for(const match of html.matchAll(/(?:src|poster)="(\/assets\/[^"?]+)/g))assert.ok(existsSync('public'+match[1]),match[1]);
 }
 let {tenant:t}=await api('/tenants','POST',{designKit:id,slug:'new-'+id,settings:{name:'QA '+kit.trade,phone:'8055550123',area:'Ventura',services:library[kit.trade].slice(0,2).map(name=>({name})),platform:{neighborhood:{enabled:false}}}});
 await api('/tenants/'+t.id+'/publish','POST',{version:t.version,approved:true});
 for(const path of ['/s/'+t.slug,'/s/'+t.slug+'/pricing','/s/'+t.slug+'/blog']){const r=await req(path,'GET',undefined,false);assert.equal(r.status,200);const html=await r.text();assert.ok(html.includes(kit.art.banner));assert.doesNotMatch(html,/fictional preview quotes/);for(const match of html.matchAll(/(?:src|poster)="(\/assets\/[^"?]+)/g))assert.ok(existsSync('public'+match[1]),match[1]);}
}
const providers=['sfc','wisetack','sunbit'];
for(let count=1;count<=3;count++){
 const lenders=providers.map((id,i)=>({id,enabled:i<count,confirmed:true,applicationUrl:`https://merchant.example.test/${id}`}));
 let {tenant:t}=await api('/tenants','POST',{designKit:'solar',slug:'finance-options-'+count,settings:{name:'QA Solar',phone:'8055550123',area:'Ventura',services:[{name:'Solar panel installation'}],platform:{financing:{enabled:true,lenders,programs:lenders.filter(l=>l.enabled).map(l=>({id:l.id,name:'QA '+l.id,lenderId:l.id,apr:8,months:60,enabled:true,confirmed:true}))}}}});
 const path='/s/'+t.slug+'/financing';assert.equal((await req(path,'GET',undefined,false)).status,404);
 const draft=await (await req(path+'?preview=1')).text();assert.match(draft,/Application opens on the published site/);assert.doesNotMatch(draft,/href="https:\/\/merchant/);
 await api('/tenants/'+t.id+'/publish','POST',{version:t.version,approved:true});
 let html=await (await req(path,'GET',undefined,false)).text();
 const choices=html.match(/<details class="finance-options"[\s\S]*?<\/details>/)?.[0];assert.ok(choices);
 assert.match(choices,/<summary class="foundation-button">Get Financing Options/);assert.doesNotMatch(choices,/<details[^>]*\sopen/);
 assert.equal((choices.match(/class="finance-option-link"/g)||[]).length,count);
 for(let i=0;i<providers.length;i++)assert.equal(choices.includes('href="https://merchant.example.test/'+providers[i]+'"'),i<count);
 assert.match(choices,/not matched loan offers/);assert.match(choices,/not sent to a lender/);assert.doesNotMatch(choices,/subject to change based on approved credit/); // Legal copy lives on /legal.
 assert.doesNotMatch(html,/foundation-lenders|foundation-provider-mark/);
 assert.ok(html.indexOf('Get Financing Options')>html.indexOf('data-finance-result'));
 assert.doesNotMatch(html,/data-finance-examples|data-finance-scenario/,'Published pages have no sample-term controls');
 ({tenant:t}=await api('/tenants/'+t.id));const changed=structuredClone(t.settings);changed.platform.financing.enabled=false;changed.platform.financing.requested=false;
 ({tenant:t}=await api('/tenants/'+t.id,'PUT',{version:t.version,settings:changed}));
 assert.equal((await req(path,'GET',undefined,false)).status,200,'Draft disable must not change the published flow');
 await api('/tenants/'+t.id+'/publish','POST',{version:t.version,approved:true});
 assert.equal((await req(path,'GET',undefined,false)).status,404);
}
console.log('PASS new trades: 6 layout previews + 6 public pages, all selected services and asset paths; financing 1/2/3 configured links, collapsed disclosure, draft isolation, disabled route, no fictional quotes or loan offers.');
