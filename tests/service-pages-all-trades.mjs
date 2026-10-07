import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {worker,env,admin} from './preview-fixture.mjs';
import {DEFAULT,settings} from '../src/core.js';
import {visibleServicePages,reconcileServicePages} from '../src/service-registry.js';
import {backfillServicePageSettings} from '../src/service-backfill.js';
import {normalizeWebsitePages} from '../src/platform/website-pages.ts';

const library=JSON.parse(readFileSync('public/trade-library.json','utf8'));
const request=(path,method='GET',body)=>worker.fetch(new Request('https://test.local'+path,{method,headers:{origin:'https://test.local','content-type':'application/json','oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email},body:body?JSON.stringify(body):undefined}),env);
async function json(path,method='GET',body){const response=await request('/api'+path,method,body);assert.equal(response.status,200,await response.clone().text());return response.json()}

test('every trade selection creates visible, stable service records by default',()=>{
 for(const [trade,names] of Object.entries(library)){
  const s=settings({...DEFAULT,name:`${trade} Fixture`,trade,area:'Ventura',services:names.map(name=>({name,description:''}))});
  assert.equal(visibleServicePages(s).length,names.length,trade);
  assert.equal(new Set(visibleServicePages(s).map(p=>p.slug)).size,names.length,trade);
  assert.ok(visibleServicePages(s).every(p=>p.enabled),trade);
  const old={...s,websitePages:{version:1,pages:[]}};
  assert.deepEqual(visibleServicePages(old).map(p=>p.slug),visibleServicePages(s).map(p=>p.slug),'old snapshot backfill is deterministic');
 }
 const long=settings({...DEFAULT,name:'Long Service Fixture',trade:'Roofing',services:[{name:'1 '+('specialty installation and careful repair '.repeat(3)).slice(0,95)}]});
 assert.ok(long.websitePages.pages[0].id.length<=80);
 assert.ok(long.websitePages.pages[0].slug.length<=80);
 assert.deepEqual(normalizeWebsitePages(long.websitePages),long.websitePages);
 const collided=reconcileServicePages({version:1,pages:[{id:'service-roof-repair',kind:'service',slug:'different-work',title:'Different work',serviceName:'Different work',enabled:true}]},[{name:'Different work'},{name:'Roof repair'}]);
 assert.equal(new Set(collided.pages.map(p=>p.id)).size,2);
 assert.deepEqual(normalizeWebsitePages(collided).pages.map(p=>p.serviceName),['Different work','Roof repair']);
 const original=reconcileServicePages({version:1,pages:[]},Array.from({length:24},(_,i)=>({name:`Old service ${i}`})));
 const rotated=reconcileServicePages(original,Array.from({length:24},(_,i)=>({name:`New service ${i}`})));
 assert.equal(rotated.pages.length,24);
 assert.equal(original.pages.length,24,'backfill does not mutate the source snapshot');
 assert.deepEqual(normalizeWebsitePages(rotated),rotated);
});

test('legacy draft and published snapshots are backfilled once without changing visibility choices',async()=>{
 const raw=await env.DB.prepare('SELECT id,settings,published FROM tenants WHERE slug=?').bind('robles-roofing').first();
 const draft=JSON.parse(raw.settings),live=JSON.parse(raw.published);
 delete draft.websitePages;delete live.websitePages;
 await env.DB.prepare('UPDATE tenants SET settings=?,published=? WHERE id=?').bind(JSON.stringify(draft),JSON.stringify(live),raw.id).run();
 const first=await backfillServicePageSettings(env.DB);
 assert.ok(first.drafts>=1&&first.published>=1);
 const next=await env.DB.prepare('SELECT settings,published FROM tenants WHERE id=?').bind(raw.id).first();
 assert.equal(JSON.parse(next.settings).websitePages.pages.length,draft.services.length);
 assert.equal(JSON.parse(next.published).websitePages.pages.length,live.services.length);
 assert.deepEqual(await backfillServicePageSettings(env.DB),{drafts:0,published:0});
});

test('Roofing, HVAC, and Patios publish cards, menus, SEO, sitemap, and hidden-page 404',async()=>{
 for(const trade of ['Roofing','HVAC','Patios']){
  const names=library[trade].slice(0,3),slug=`all-service-${trade.toLowerCase()}`;
  let {tenant}=await json('/tenants','POST',{slug,settings:{...DEFAULT,name:`Sample Fictional ${trade} Local`,trade,phone:'8055550102',area:'Ventura',services:names.map(name=>({name,description:`Local ${name.toLowerCase()} work.`}))}});
  const base='/s/'+slug,path='/tenants/'+tenant.id;
  await json(path+'/publish','POST',{version:tenant.version,approved:true});
  ({tenant}=await json(path));
  const pages=visibleServicePages(tenant.published);
  const home=await request(base),homeHtml=await home.text();
  assert.equal(home.status,200);
  for(const page of pages){
   const route=`${base}/services/${page.slug}`;
   assert.ok(homeHtml.includes(`href="${route}"`),`${trade} card or menu: ${route}`);
   const response=await request(route),html=await response.text();
   assert.equal(response.status,200,`${trade} ${route}`);
   assert.match(html,new RegExp(`<title>[^<]*${page.serviceName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}[^<]*Ventura[^<]*\\| Sample Fictional ${trade} Local<\\/title>`));
   assert.ok(html.includes(`rel="canonical" href="https://test.local${route}"`));
   assert.equal((html.match(/<h1\b/g)||[]).length,1);
   assert.ok(html.includes(`name="service" value="${page.serviceName}" readonly`));
   const structured=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
   assert.deepEqual(structured.map(x=>x['@type']),['LocalBusiness','Service']);
   assert.equal(structured[1].url,`https://test.local${route}`);
  }
  const sitemap=await request(base+'/sitemap.xml'),xml=await sitemap.text();
  assert.equal(sitemap.status,200);
  for(const page of pages)assert.ok(xml.includes(`${base}/services/${page.slug}`));
  const draft=structuredClone(tenant.settings);draft.websitePages=reconcileServicePages(draft.websitePages,draft.services);draft.websitePages.pages.find(p=>p.slug===pages[0].slug).enabled=false;
  ({tenant}=await json(path,'PUT',{version:tenant.version,settings:draft}));
  assert.equal((await request(`${base}/services/${pages[0].slug}?preview=1`)).status,404);
  await json(path+'/publish','POST',{version:tenant.version,approved:true});
  const hidden=await request(`${base}/services/${pages[0].slug}`);
  assert.equal(hidden.status,404);
  const visibleHome=await (await request(base)).text();
  assert.ok(!visibleHome.includes(`href="${base}/services/${pages[0].slug}"`));
  const visibleSitemap=await (await request(base+'/sitemap.xml')).text();
  assert.ok(!visibleSitemap.includes(`${base}/services/${pages[0].slug}`));
 }
});
