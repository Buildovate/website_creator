import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {worker,env,admin} from './preview-fixture.mjs';
import {settings,DEFAULT} from '../src/core.js';
import {serviceAreaRibbon} from '../src/trade-visuals.js';
const kits=JSON.parse(readFileSync('public/design-kits.json'));
const headers={'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email};
const graphics=new Set();let pages=0;
for(const kit of Object.values(kits))for(const layout of ['immersive','editorial','studio']){
 const base='/design-preview/'+kit.id+'/'+layout;
 for(const suffix of ['', '/pricing','/blog']){
  const r=await worker.fetch(new Request('https://test.local'+base+suffix,{headers}),env);assert.equal(r.status,200,base+suffix);const html=await r.text();pages++;
  assert.ok(html.includes('shared-site-header'));assert.ok(html.includes('Contact Us'));assert.ok(html.includes('/trade-revisions.css'));
  assert.ok(html.includes(kit.art?.banner||'/assets/trade-art/'+kit.id+'-craft-banner.webp'),base+suffix);
  for(const asset of html.matchAll(/\/assets\/trade-art\/[^"<>]+\.webp/g)){assert.ok(existsSync('public'+asset[0]));graphics.add(asset[0]);}
  if(!suffix){assert.ok(html.includes('OUR SERVICES'));assert.ok(html.includes(kit.art?.detail||'customer-detail.webp'));assert.ok(html.includes('CUSTOMER FEEDBACK FORMAT'));assert.ok(!html.includes('sample-stars'));assert.ok(html.includes('Project Map')||html.includes('project-map'),base+' retains its project map');assert.ok(!html.includes('marquee-pause'));assert.ok(!html.includes('Service imagery is illustrative, not evidence'));}
 }
}
assert.equal(graphics.size,24);
const s=settings({...DEFAULT,name:'QA Business',trade:'Roofing',serviceAreas:[{city:'Ventura',radiusMiles:25},{city:'Oxnard',radiusMiles:15}]});assert.equal(s.area,'Ventura, Oxnard');assert.ok(serviceAreaRibbon(s).includes('Ventura'));assert.ok(serviceAreaRibbon(s).includes('+ 25 miles'));assert.equal(s.serviceAreas[0].radiusMiles,25);
assert.throws(()=>settings({...DEFAULT,name:'QA Business',trade:'Roofing',serviceAreas:[{city:'Ventura',radiusMiles:999}]}));assert.throws(()=>settings({...DEFAULT,name:'QA Business',trade:'Roofing',serviceAreas:[{city:'Ventura'},{city:'ventura'}]}));
console.log('PASS '+pages+' trade pages (14 trades × 3 designs × homepage/pricing/blog), all 24 image references, requested copy, sticky-nav assets, and city/radius validation.');
