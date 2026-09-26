import {legalFixture} from './fixtures/legal-policy.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {worker,env,admin} from './preview-fixture.mjs';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['src/platform/premium.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {cleanServiceProfile}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const origin='https://test.local';
async function req(path,method='GET',data,user=admin){return worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':data instanceof Uint8Array?'image/jpeg':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:data instanceof Uint8Array?data:data===undefined?undefined:JSON.stringify(data)}),env)}
async function api(path,method='GET',data){const r=await req('/api'+path,method,data);assert.equal(r.status,200,await r.clone().text());return r.json()}
for(const value of [{rating:'5.1',ratingSource:'https://example.test'},{rating:'4.9'},{years:'-1'},{years:'201'},{rating:'4.5',ratingSource:'javascript:alert(1)'}])assert.throws(()=>cleanServiceProfile(value));
let t=(await api('/tenants','POST',{preset:'robles',slug:'premium-test'})).tenant;
const path='/tenants/'+t.id,url='/s/'+t.slug+'/services/roof-repair';
async function save(settings){t=(await api(path,'PUT',{version:t.version,settings})).tenant;}
async function publish(){await api(path+'/publish','POST',{approved:true,version:t.version});t=(await api(path)).tenant;}
await save({...t.settings,websitePages:{version:1,pages:[{id:'repair',kind:'service',slug:'roof-repair',title:'Roof repair',serviceName:'Roof repair',enabled:true,questions:[{question:'Is this a booking?',answer:'No, availability is confirmed separately.'}]}]},serviceProfile:{},reviews:{},color:'#ffea00'});
await publish();
let html=await (await req(url,'GET',undefined,null)).text();
assert.match(html,/Stop the leak at its source/);
assert.ok(!html.includes('class="tp-trust"'));
assert.ok(!html.includes('Service illustration'));
assert.equal((html.match(/class="sd-sign-list"/g)||[]).length,1);
assert.equal((html.match(/<li><b>0[1-4]<\/b>/g)||[]).length,4);
assert.ok(!html.includes('sd-comparison'), 'No fabricated project comparison is published');
assert.ok(html.includes('--accent:#ffea00'));
assert.ok(html.includes('data-ar-scene'));
assert.ok(!html.includes('data-review-slug'));
const photo=await api(path+'/photos','POST',new Uint8Array(readFileSync('public/assets/roofing.jpg')));
await save({...t.settings,serviceProfile:{years:'12',warranty:'Written workmanship warranty',rating:'4.8',ratingSource:'https://example.test/reviews',confirmed:true},platform:{...t.settings.platform,legal:legalFixture,footer:{...t.settings.platform.footer,insured:true}},websitePages:{...t.settings.websitePages,pages:t.settings.websitePages.pages.filter(p=>p.id==='repair').map(p=>({...p,headline:'CUSTOM DRAFT <headline>',media:{...p.media,hero:{photoId:photo.id,alt:'Private hero',caption:''}}}))}});
html=await (await req(url,'GET',undefined,null)).text();assert.ok(!html.includes('CUSTOM DRAFT'));assert.ok(!html.includes('class="tp-trust"'));
html=await (await req(url+'?preview=1')).text();assert.ok(html.includes('CUSTOM DRAFT &lt;headline&gt;'));assert.ok(html.includes('Licensed &amp; insured'));assert.ok(html.includes('12 years'));assert.ok(html.includes('4.8 / 5'));assert.ok(html.includes('Written workmanship warranty'));
await publish();
html=await (await req(url,'GET',undefined,null)).text();assert.ok(html.includes('CUSTOM DRAFT &lt;headline&gt;'));assert.ok(html.includes('/media/'+photo.id),'Selected owned hero is preserved');
assert.equal((await req('/media/'+photo.id,'GET',undefined,null)).status,200);
await save({...t.settings,websitePages:{...t.settings.websitePages,pages:t.settings.websitePages.pages.filter(p=>p.id==='repair').map(p=>({...p,media:{...p.media,bannerOne:{photoId:photo.id,alt:'Before owned',caption:''}}}))}});
await publish();assert.equal((await req('/media/'+photo.id,'GET',undefined,null)).status,200,'The selected hero remains public');
await save({...t.settings,websitePages:{...t.settings.websitePages,pages:t.settings.websitePages.pages.filter(p=>p.id==='repair').map(p=>({...p,media:{...p.media,bannerTwo:{photoId:photo.id,alt:'After owned',caption:''}}}))}});
await publish();html=await (await req(url,'GET',undefined,null)).text();assert.ok(!html.includes('sd-comparison'),'A repeated photo is not a before/after pair');assert.ok(html.includes('/media/'+photo.id));
assert.equal((await req('/media/'+photo.id,'GET',undefined,null)).status,200);
await save({...t.settings,serviceProfile:{...t.settings.serviceProfile,confirmed:false},reviews:{googleUrl:'https://www.google.com/maps',confirmed:true}});
await publish();html=await (await req(url,'GET',undefined,null)).text();assert.ok(!html.includes('class="tp-trust"'));assert.ok(html.includes('data-review-slug="premium-test"'));
console.log('PASS premium service: distinct hero and section photos, four process steps, editable escaped headline, draft/publish isolation, sourced/confirmed/empty trust fields, no invented reviews, owned-hero privacy, repeated-comparison suppression and brand tokens.');

for(const reduced of [true,false]){
 const classes=new Set(),listeners={},range={value:'50',setAttribute(k,v){this[k]=v},addEventListener(k,fn){listeners[k]=fn}},styles={};
 const item={classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}};
 const box={querySelector:()=>range,style:{setProperty:(k,v)=>styles[k]=v}};
 let observer,reduceChange;
 runInNewContext(readFileSync('public/trade-page.js','utf8'),{matchMedia:()=>({matches:reduced,addEventListener:(k,fn)=>reduceChange=fn}),window:{IntersectionObserver:true},IntersectionObserver:class{constructor(fn){observer=fn}observe(){}unobserve(){}disconnect(){}},document:{querySelector:()=>null,querySelectorAll:s=>s==='[data-reveal]'?[item]:s==='[data-comparison]'?[box]:[]}});
 assert.equal(classes.has('tp-pending'),!reduced);
 if(observer){observer([{isIntersecting:true,target:item}]);assert.equal(classes.size,0);}
 range.value='73';listeners.input();assert.equal(styles['--split'],'73%');assert.equal(range['aria-valuetext'],'73 percent before image');
}
console.log('PASS premium interactions: scroll reveal enhancement, visible reduced-motion fallback, comparison input and accessible value.');
