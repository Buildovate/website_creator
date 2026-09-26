import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import test from 'node:test';
import {settings,ROBLES} from '../src/core.js';
import {visibleServicePages} from '../src/service-registry.js';
import {renderUniversalServicePage} from '../src/service-detail.js';
const content=JSON.parse(readFileSync('public/service-content.json','utf8'));
const art=JSON.parse(readFileSync('public/service-art.json','utf8'));
const mediaNeeded=readFileSync('docs/product/MEDIA-NEEDED.md','utf8');
test('every curated service has a distinct hero or an explicit media request',()=>{
 const used=new Map();let total=0,missing=0;
 for(const [trade,services] of Object.entries(content))for(const name of Object.keys(services)){
  total++;const source=art[trade]?.[name];
  if(!source){missing++;assert.ok(mediaNeeded.includes(`| ${trade} | ${name} | Hero |`),`${trade}/${name} has no hero request`);continue}
  assert.ok(source.startsWith('/assets/'),`${trade}/${name} media path`);
  assert.ok(existsSync('public'+source),`${trade}/${name} missing ${source}`);
  assert.ok(!used.has(source),`${trade}/${name} shares ${source} with ${used.get(source)}`);
  used.set(source,`${trade}/${name}`);
 }
 assert.equal(total,132);assert.equal(missing,0);
});
test('section photo requests cover all services until distinct photography is available',()=>{
 for(const [trade,services] of Object.entries(content))for(const name of Object.keys(services)){
  for(const section of ['Scope detail','Process detail'])assert.ok(mediaNeeded.includes(`| ${trade} | ${name} | ${section} |`),`${trade}/${name}/${section}`);
 }
});
test('preview comparison is tagged, publication hides absent project photos, and prices require approval',()=>{
 const s=settings(ROBLES),page=visibleServicePages(s).find(item=>item.serviceName==='Roof repair');
 const render=(site,preview)=>renderUniversalServicePage(site,page,{slug:'robles-roofing',preview,photos:[],projects:[],origin:'https://example.test'});
 const draft=render(s,true),published=render(s,false);
 assert.match(draft,/sd-comparison/);assert.match(draft,/Sample · Before/);assert.match(draft,/data-compare-range/);
 assert.doesNotMatch(published,/sd-comparison/);assert.doesNotMatch(published,/sd-sample-tag/);
 assert.doesNotMatch(published,/\$123\.45/);
 const unapproved=render({...s,priceBook:{items:[{service:'Roof repair',tier:'Good',priceCents:12345}]}},false);
 assert.doesNotMatch(unapproved,/\$123\.45/);
 const approved=render({...s,priceBook:{items:[{service:'Roof repair',tier:'Good',priceCents:12345,approved:true}]}},false);
 assert.match(approved,/\$123\.45/);
});
