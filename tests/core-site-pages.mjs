import assert from 'node:assert/strict';
import test from 'node:test';
import {worker,env,admin} from './preview-fixture.mjs';
import {DEFAULT,ROBLES,settings} from '../src/core.js';
import {assertUniqueCitySentences,cityContent,coreSitemapPaths} from '../src/core-site-pages.js';
import library from '../public/trade-library.json' with {type:'json'};
import art from '../public/service-art.json' with {type:'json'};

const origin='https://test.local';
const request=(path,user=null)=>worker.fetch(new Request(origin+path,{headers:user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{}}),env);
const areas=[{city:'Oxnard'},{city:'Ventura'},{city:'Camarillo'}];
async function site(trade){
 const slug='core-'+trade.toLowerCase().replace(/[^a-z]+/g,'-');
 const input=trade==='Roofing'?ROBLES:{...DEFAULT,name:trade+' Studio',trade,designKit:trade.toLowerCase(),phone:'(805) 555-0123',area:'Ventura County',hero:'Made around your home.',services:library[trade].map(name=>({name,description:''}))};
 const s=settings({...input,serviceAreas:areas});
 const id=crypto.randomUUID(),time=new Date().toISOString();
 await env.DB.prepare('INSERT INTO tenants (id,slug,name,settings,published,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)').bind(id,slug,s.name,JSON.stringify(s),JSON.stringify(s),'published',time,time).run();
 return {slug,s};
}

test('all three trade families have core routes, unique city copy and preview isolation',async()=>{
 for(const trade of ['Roofing','HVAC','Patios']){
  const {slug,s}=await site(trade),base='/s/'+slug;
  assertUniqueCitySentences(s);
  const publicHomeResponse=await request(base),previewHomeResponse=await request(base+'?preview=1',admin);
  const homePublic=await publicHomeResponse.text(),homePreview=await previewHomeResponse.text();
  assert.equal(publicHomeResponse.headers.get('x-robots-tag'),'index, follow');
  assert.equal(previewHomeResponse.headers.get('x-robots-tag'),'noindex, nofollow');
  assert.match(homePublic,/<meta name="robots" content="index,follow">/);
  assert.ok(!homePublic.includes('DEMONSTRATION PROJECT')&&!homePublic.includes('Sample photo · Upload yours'),trade+' published homepage hides sample media');
  assert.match(homePreview,/Project Map/,trade+' preview keeps a project example');
  assert.match(homePreview,/class="sample-tag">Sample<\/span>/,trade+' preview project cards carry a Sample tag');
  const samplePath=trade==='Roofing'?base+'/projects/demo-shingle?preview=1':base+'?preview=1&project=example-0';
  const sampleStory=await request(samplePath,admin);
  assert.equal(sampleStory.status,200);
  const sampleStoryHtml=await sampleStory.text();
  assert.match(sampleStoryHtml,/class="sample-tag">Sample<\/span>/);
  if(trade!=='Roofing')assert.ok(sampleStoryHtml.includes(Object.values(art[trade])[0]),trade+' sample project uses trade imagery');
  assert.notEqual(cityContent(s,'Oxnard',0).intro.replaceAll('Oxnard','CITY'),cityContent(s,'Ventura',1).intro.replaceAll('Ventura','CITY'));
  const routes=['/services','/areas','/about','/faq','/contact','/thank-you','/legal',...areas.map(({city})=>'/areas/'+city.toLowerCase())];
  for(const route of routes){
   const published=await request(base+route),publicHtml=await published.text();
   assert.equal(published.status,200,trade+' '+route+' '+publicHtml.slice(0,100));
   assert.match(publicHtml,/<h1\b/);
   assert.equal((publicHtml.match(/<h1\b/g)||[]).length,1);
   assert.match(publicHtml,/BreadcrumbList/);
   assert.match(publicHtml,/LocalBusiness/);
   assert.ok(!publicHtml.includes('class="core-sample"'),trade+' leaked a sample on '+route);
   assert.ok(!publicHtml.includes('creativecommons.org')&&!publicHtml.includes('db-ip.com'));
   const draft=await request(base+route+'?preview=1',admin),draftHtml=await draft.text();
   assert.equal(draft.status,200,trade+' preview '+route);
   assert.equal(draft.headers.get('x-robots-tag'),'noindex, nofollow');
   assert.match(draftHtml,/<meta name="robots" content="noindex,nofollow">/);
   assert.ok(!draftHtml.includes('BreadcrumbList')&&!draftHtml.includes('LocalBusiness'));
  }
  for(const route of ['/reviews','/financing','/promotions']){
   assert.equal((await request(base+route)).status,404,trade+' hides unsupplied '+route);
   const draft=await request(base+route+'?preview=1',admin);
   assert.equal(draft.status,200,trade+' preview '+route);
   assert.match(await draft.text(),/Sample/);
  }
  const sitemap=await (await request(base+'/sitemap.xml')).text();
  for(const route of routes)assert.ok(sitemap.includes(base+route),trade+' sitemap '+route);
  for(const route of ['/reviews','/financing','/promotions'])assert.ok(!sitemap.includes(base+route),trade+' sitemap hid '+route);
  assert.ok(coreSitemapPaths(s).includes('/services/'+s.websitePages.pages.find(p=>p.kind==='service').slug));
 }
});
