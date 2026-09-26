import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {worker,env,admin} from './preview-fixture.mjs';
import {normalizePlatform,financingEstimate} from '../src/platform/constitution.ts';
import {serviceFinance,serviceOffers} from '../src/service-conversion.js';
const origin='https://test.local';
const req=(path,method='GET',data,user=admin,originHeader=origin)=>worker.fetch(new Request(origin+path,{method,headers:{origin:originHeader,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:data===undefined?undefined:JSON.stringify(data)}),env);
async function api(path,method='GET',data){const r=await req('/api'+path,method,data);assert.equal(r.status,200,await r.clone().text());return r.json();}
let t=(await api('/tenants','POST',{preset:'robles',slug:'playbook-test'})).tenant;const apiPath='/tenants/'+t.id;
const page={id:'repair',kind:'service',title:'Roof repair',serviceName:'Roof repair',slug:'roof-repair',enabled:true};
const live='/s/'+t.slug+'/services/roof-repair',sales='/sales-preview/'+t.slug+'/services/roof-repair';
async function save(settings){t=(await api(apiPath,'PUT',{version:t.version,settings})).tenant;}
async function publish(){await api(apiPath+'/publish','POST',{version:t.version,approved:true});t=(await api(apiPath)).tenant;}
await save({...t.settings,reviews:{},serviceProfile:{},websitePages:{version:1,pages:[page]}});
assert.equal((await req(sales,'GET',undefined,null)).status,401);
assert.equal((await req(sales,'GET',undefined,{id:'stranger',email:'stranger@example.test'})).status,404);
let html=await (await req(sales)).text();
assert.match(html,/SALES PREVIEW/);assert.match(html,/Sample/);assert.doesNotMatch(html,/Fictional review|SAMPLE rating|SAMPLE TERMS|SAMPLE OFFER/);assert.match(html,/Preview — submission disabled/);
const sampleEndpoint='/api/sales-preview/'+t.slug+'/promotion-unlock';
assert.equal((await req(sampleEndpoint,'POST',{offerId:'sample-roof',answer:0},null)).status,401);
assert.equal((await req(sampleEndpoint,'POST',{offerId:'sample-roof',answer:0},admin,'https://evil.test')).status,403);
assert.equal((await req(sampleEndpoint,'POST',{offerId:'sample-roof',answer:1})).status,400);
assert.equal((await (await req(sampleEndpoint,'POST',{offerId:'sample-roof',answer:0})).json()).code,'SAMPLE-ROOF');
await publish();
assert.equal((await req(sales)).status,404);assert.equal((await req(sampleEndpoint,'POST',{offerId:'sample-roof',answer:0})).status,404);
for(const suffix of ['','?salesPreview=1','?preview=1&salesPreview=1']){html=await (await req(live+suffix)).text();assert.doesNotMatch(html,/Fictional review|SAMPLE rating/);assert.ok(!html.includes('class="tp-reviews"'));assert.ok(!html.includes('Customer feedback belongs'));assert.ok(!html.includes('data-service-finance'));assert.ok(!html.includes('tp-promo-banner'));}
const configured={...t.settings.platform,footer:{...t.settings.platform.footer,financingDisclosure:'APPROVED TEST DISCLOSURE: subject to credit approval.'},financing:{enabled:true,lenders:[{id:'wisetack',enabled:true,confirmed:true,applicationUrl:'https://example.test/merchant'}],serviceTerms:{lenderId:'wisetack',amount:5000,downPayment:500,apr:0,months:36,confirmed:true}}};
const p=normalizePlatform(configured);assert.equal(serviceFinance(p,false).apr,0);assert.equal(financingEstimate(5000,500,0,36).monthly,125);
for(const change of [p=>p.footer.financingDisclosure='',p=>p.financing.serviceTerms=null,p=>p.financing.serviceTerms.confirmed=false,p=>p.financing.enabled=false,p=>p.financing.serviceTerms.lenderId='sunbit']){const x=structuredClone(configured);change(x);assert.equal(serviceFinance(normalizePlatform(x),false),null);}
for(const change of [t=>t.apr='',t=>t.amount=-1,t=>t.months=0,t=>t.downPayment=5001,t=>t.apr=101]){const x=structuredClone(configured);change(x.financing.serviceTerms);assert.throws(()=>normalizePlatform(x));}
const offer={id:'roof-discount',enabled:true,title:'Repair offer',description:'Current repair offer',reward:'Test reward',terms:'Test eligibility only',startsAt:new Date(Date.now()-3600000).toISOString(),endsAt:new Date(Date.now()+3600000).toISOString(),question:'Safe place to photograph?',choices:['Ground','Roof'],answer:0,code:'PRIVATE-REPAIR-CODE',serviceNames:['Roof repair'],graphic:'roof-repair'};
configured.promotions={enabled:true,offers:[offer,{...offer,id:'wrong-service',title:'WRONG SERVICE',serviceNames:['Gutter cleaning']},{...offer,id:'expired',title:'EXPIRED OFFER',startsAt:'2020-01-01',endsAt:'2020-02-01'}]};
await save({...t.settings,platform:configured});html=await (await req(live)).text();assert.ok(!html.includes('data-service-finance'),'draft stays private');await publish();html=await (await req(live)).text();
assert.match(html,/data-service-finance/);assert.doesNotMatch(html,/\$125.00/); // No service price is inferred from legacy financing defaults.
assert.doesNotMatch(html,/APPROVED TEST DISCLOSURE/);assert.match(html,/Wisetack/);assert.ok(!html.includes('https://example.test/merchant'));assert.match(html,/data-finance-interest/);assert.match(html,/financingInterest/);assert.match(html,/promotion.png/);assert.ok(!html.includes(offer.code));assert.ok(!html.includes('WRONG SERVICE'));assert.ok(!html.includes('EXPIRED OFFER'));assert.ok(!html.includes('Request this service'));
assert.ok(html.indexOf('id="financing"')>html.indexOf('id="process"'));assert.match(html,/Get my price/);
const unlock='/api/public/'+t.slug+'/promotion-unlock';assert.equal((await req(unlock,'POST',{offerId:offer.id,answer:1,serviceName:'Roof repair'},null)).status,400);assert.equal((await req(unlock,'POST',{offerId:offer.id,answer:0,serviceName:'Gutter cleaning'},null)).status,404);assert.equal((await req(unlock+'?preview=1','POST',{offerId:offer.id,answer:0},null)).status,403);assert.equal((await (await req(unlock,'POST',{offerId:offer.id,answer:0,serviceName:'Roof repair'},null)).json()).code,offer.code);
assert.equal(serviceOffers(normalizePlatform({...configured,promotions:{enabled:true,offers:[{...offer,startsAt:'2020-01-01',endsAt:'2020-02-01'}]}}),page,false).length,0);
// Opt-in public review wrapper remains absent for provider failures/zero excerpts.
for(const providers of [[],[{status:'Unavailable',reviews:[]}],[{provider:'Google Maps',reviews:[{text:'Real fixture review',rating:5}],url:'https://example.test'}]]){
 const wrapper={hidden:true},button={disabled:false,click(){return this.onclick()}},status={},target={};
 const el={dataset:{hideEmptyReviews:'true',reviewSlug:'test',reviewPreview:'false'},closest:()=>wrapper,querySelector:s=>s==='[data-load-reviews]'?button:s==='[data-review-status]'?status:target};
 runInNewContext(readFileSync('public/reviews.js','utf8'),{document:{querySelector:()=>el},window:{},fetch:async()=>({ok:true,json:async()=>({providers,minimum:4})})});
 await button.onclick();assert.equal(wrapper.hidden,providers.every(p=>!p.reviews?.length));
}
console.log('PASS #004C: authenticated draft-only visual samples without invented reviews or ratings, publish/query isolation, no hidden promo codes, sample unlock auth/origin/answer, configured finance terms and math, price-book-only service amounts, no lender exits, service/date promotion filters, real unlock validation and empty-review suppression.');

// Browser preview transport keeps session CSRF; public unlocks do not use staff identity.
{
 const status={},link={hidden:true,addEventListener(){}},button={},listeners={},code={value:''};let sent;
 const form={dataset:{preview:'true',salesPreview:'true',slug:'prospect',offer:'sample-roof',service:'Roof repair'},querySelector:s=>s==='button'?button:s==='[data-promo-status]'?status:s==='[data-promo-inquiry]'?link:{value:'0'},addEventListener:(event,fn)=>listeners[event]=fn};
 const inquiry={querySelector:()=>code};
 runInNewContext(readFileSync('public/trade-page.js','utf8'),{matchMedia:()=>({matches:true}),window:{},document:{querySelector:s=>s==='#lead-form'?inquiry:null,querySelectorAll:s=>s==='[data-service-promo]'?[form]:[]},fetch:async(url,options)=>{if(url==='/api/session')return {json:async()=>({csrfToken:'test-token'})};sent={url,...options};return {ok:true,json:async()=>({code:'SAMPLE-ROOF',message:'Not redeemable.'})}}});
 await listeners.submit({preventDefault(){}});assert.equal(sent.headers['x-csrf-token'],'test-token');assert.equal(sent.url,'/api/sales-preview/prospect/promotion-unlock');assert.equal(code.value,'SAMPLE-ROOF');assert.equal(link.hidden,false);
}
console.log('PASS #004C browser transport: sample quiz preserves session CSRF and feeds the same preview inquiry.');
