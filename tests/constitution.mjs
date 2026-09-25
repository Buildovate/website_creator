import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {socialIcon} from '../src/social-icons.js';
const compiled=await build({entryPoints:['src/platform/constitution.ts'],bundle:true,write:false,format:'esm',platform:'node',target:'node22'});
const {normalizePlatform,financingEstimate,activeOffers,CONSTITUTION,PRICE_BOOK,FINANCING_DISCLOSURE,SOCIALS}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
import {worker,env,admin} from './preview-fixture.mjs';
const origin='https://test.local';
async function request(path,method='GET',value,user=admin,requestOrigin=origin){return worker.fetch(new Request(origin+path,{method,headers:{origin:requestOrigin,'Content-Type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value===undefined?undefined:JSON.stringify(value)}),env);}
async function api(path,method='GET',value,user=admin){const r=await request('/api'+path,method,value,user);assert.equal(r.status,200,await r.clone().text());return r.json();}
const defaults=normalizePlatform(undefined);
assert.equal(defaults.financing.enabled,false);assert.equal(defaults.promotions.enabled,false);
assert.equal(defaults.footer.bonded,false);assert.equal(defaults.footer.insured,false);
assert.equal(Object.values(defaults.footer.socials).filter(x=>x.enabled).length,0);
assert.deepEqual(Object.keys(defaults.footer.socials),Object.keys(SOCIALS));
assert.equal(Object.keys(SOCIALS).length,8);
assert.equal(defaults.timeZone,'America/Los_Angeles');
assert.equal(normalizePlatform({timeZone:'America/New_York'}).timeZone,'America/New_York');
assert.throws(()=>normalizePlatform({timeZone:'Mars/Phobos'}),/IANA business time zone/);
for(const key of Object.keys(SOCIALS)){assert.equal(defaults.footer.socials[key].url,'');assert.match(socialIcon(key),/<svg[^>]+aria-hidden="true"[^>]*>[\s\S]*<(?:path|rect|circle)/);}
assert.equal(socialIcon('unknown'),'');
assert.equal(CONSTITUTION.videoPackage,'Higgsfield Ultra');assert.equal(CONSTITUTION.salesCommission,.5);
assert.equal(CONSTITUTION.upsellWindowSeconds,900);assert.equal(CONSTITUTION.upsellDiscount,.1);
assert.deepEqual(PRICE_BOOK.map(x=>x.priceCents),[0,19700,29700,9700]);
for(const url of ['javascript:alert(1)','http://example.test','https://name:password@example.test','https://a.example/ bad'])assert.throws(()=>normalizePlatform({footer:{socials:{facebook:{url}}}}),/HTTPS/);
assert.throws(()=>normalizePlatform({version:2}),/version/);
assert.throws(()=>normalizePlatform({financing:{enabled:true}}),/confirmed lender/);
assert.throws(()=>normalizePlatform({financing:{lenders:[{id:'wisetack',enabled:true,applicationUrl:'https://example.test',confirmed:false}]}}),/merchant relationship/);
assert.throws(()=>normalizePlatform({footer:{socials:{youtube:{enabled:true}}}}),/profile link/);
for(const key of ['googleBusiness','xTwitter'])assert.throws(()=>normalizePlatform({footer:{socials:{[key]:{enabled:true}}}}),/profile link/);
const bothSocials=normalizePlatform({footer:{socials:{googleBusiness:{enabled:true,url:'https://www.google.com/maps?cid=123456'},xTwitter:{enabled:true,url:'https://x.com/roofing_qa'},unknown:{enabled:true,url:'https://example.test'}}}}).footer.socials;
assert.equal(bothSocials.googleBusiness.url,'https://www.google.com/maps?cid=123456');assert.equal(bothSocials.xTwitter.url,'https://x.com/roofing_qa');assert.equal(bothSocials.unknown,undefined);
assert.throws(()=>normalizePlatform({footer:{locations:[{id:'x',name:'one'},{id:'x',name:'two'}]}}),/unique/);
assert.equal(normalizePlatform({unknownSecret:'discard',footer:{token:'discard'}}).unknownSecret,undefined);
const zero=financingEstimate(12000,0,0,12);assert.equal(zero.monthly,1000);assert.equal(zero.interest,0);
const normal=financingEstimate(12000,2000,12,12);assert.ok(Math.abs(normal.monthly-888.4878868)<.001);assert.equal(normal.principal,10000);assert.equal(normal.disclosure,FINANCING_DISCLOSURE);
const tiny=financingEstimate(10000,0,.000000001,120);assert.ok(Number.isFinite(tiny.monthly)&&tiny.monthly>83.33);
for(const args of [[0,0,1,12],[100,100,1,12],[100,0,-1,12],[100,0,NaN,12],[100,0,1,0],[100,0,1,1.5],[100,0,101,12]])assert.throws(()=>financingEstimate(...args));
console.log('PASS configuration safety, locked values and calculator math');

let tenant=(await api('/tenants','POST',{slug:'constitution-qa',settings:{name:'QA Roofing',trade:'Roofing',template:'clean',color:'#526a42',phone:'8055550123',area:'Ventura',hero:'QA roofing projects',services:[{name:'Roof repair',description:'Inspect the issue and discuss the repair.'}]}})).tenant;
const root='/s/'+tenant.slug;
assert.equal((await request(root+'/financing')).status,404);
await api('/tenants/'+tenant.id+'/publish','POST',{approved:true,version:tenant.version});
tenant=(await api('/tenants/'+tenant.id)).tenant;
assert.equal((await request(root+'/financing','GET',undefined,null)).status,404);
const start=new Date(Date.now()-3600000).toISOString(),end=new Date(Date.now()+3600000).toISOString();
const offer={id:'plan-ahead',enabled:true,title:'Plan ahead',reward:'QA test reward',description:'A test-only offer.',terms:'QA only. No real monetary value.',startsAt:start,endsAt:end,question:'What helps define your project?',choices:['A clear scope','A guessed price'],answer:0,code:'QA-NOT-PUBLIC-IN-HTML'};
const platform=normalizePlatform({questionnaire:{story:'Owner-reviewed facts',priorities:'Clarity',factsConfirmed:true},footer:{visible:{name:false,phone:false,address:false,email:false,hours:false,license:false},bonded:true,insured:false,locations:[{id:'ventura',name:'QA Ventura',address:'Location test address',visible:{address:false,phone:true},phone:'8055550999'}],socials:{instagram:{enabled:true,url:'https://instagram.com/example'},facebook:{enabled:false,url:'https://facebook.com/example'},googleBusiness:{enabled:true,url:'https://www.google.com/maps?cid=123456'},xTwitter:{enabled:true,url:'https://x.com/roofing_qa'}}},financing:{enabled:true,lenders:[{id:'sfc',enabled:true,confirmed:true,applicationUrl:'https://merchant.example.test/sfc'},{id:'wisetack',enabled:true,confirmed:true,applicationUrl:'https://merchant.example.test/wisetack'}]},promotions:{enabled:true,offers:[offer]}});
const settings={...tenant.settings,email:'qa@example.test',address:'Hidden primary address',hours:'Hidden primary hours',license:'HIDDEN-LICENSE',platform};
const viewer={id:'constitution-viewer',email:'viewer@example.test'},editor={id:'constitution-editor',email:'editor@example.test'},outsider={id:'outsider',email:'outsider@example.test'};
for(const [user,role] of [[viewer,'viewer'],[editor,'editor']])await env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind(crypto.randomUUID(),tenant.id,user.id,user.email,role,new Date().toISOString()).run();
assert.equal((await request('/api/tenants/'+tenant.id,'PUT',{settings,version:tenant.version},viewer)).status,403);
assert.equal((await request('/api/tenants/'+tenant.id,'PUT',{settings,version:tenant.version},outsider)).status,404);
tenant=(await api('/tenants/'+tenant.id,'PUT',{settings,version:tenant.version},editor)).tenant;
assert.equal((await request(root+'/financing','GET',undefined,null)).status,404,'draft must not affect published page');
assert.equal((await request(root+'/financing?preview=1','GET',undefined,null)).status,401);
assert.equal((await request(root+'/financing?preview=1','GET',undefined,outsider)).status,404);
const preview=await request(root+'/financing?preview=1','GET',undefined,viewer);assert.equal(preview.status,200);assert.match(await preview.text(),/data-preview="true"/);
assert.equal((await request('/api/tenants/'+tenant.id+'/publish','POST',{approved:true,version:tenant.version},editor)).status,403);
assert.equal((await request('/api/tenants/'+tenant.id,'PUT',{settings,version:tenant.version-1})).status,409);
await api('/tenants/'+tenant.id+'/publish','POST',{approved:true,version:tenant.version});
tenant=(await api('/tenants/'+tenant.id)).tenant;
for(const path of [root,root+'/pricing',root+'/blog',root+'/financing',root+'/promotions']){
 const response=await request(path,'GET',undefined,null);assert.equal(response.status,200,path);const html=await response.text();const footer=html.match(/<footer[\s\S]*?<\/footer>/)?.[0];assert.ok(footer,path+' shared footer');
 for(const hidden of ['Hidden primary address','Hidden primary hours','HIDDEN-LICENSE','8055550123','qa@example.test','facebook.com','Location test address'])assert.ok(!footer.includes(hidden),path+' hides '+hidden);
 assert.match(footer,/instagram.com\/example/);assert.match(footer,/data-social-network="googleBusiness" href="https:\/\/www.google.com\/maps\?cid=123456"/);assert.match(footer,/data-social-network="xTwitter" href="https:\/\/x.com\/roofing_qa"/);
 assert.match(footer,/aria-label="Google Business profile \(opens a new tab\)"/);assert.match(footer,/aria-label="X \(Twitter\) profile \(opens a new tab\)"/);
 assert.equal((footer.match(/data-social-network=/g)||[]).length,3);assert.match(footer,/target="_blank" rel="noopener noreferrer"/);assert.match(footer,/QA Ventura/);assert.match(footer,/8055550999/);assert.doesNotMatch(footer,/>Bonded</,'Missing reviewed policy withholds optional bonding claims');assert.doesNotMatch(footer,/Insured/);
 assert.doesNotMatch(html,/QA-NOT-PUBLIC-IN-HTML/);assert.doesNotMatch(html,/50\/50|Sales Rep|15-minute|Price Book/);
}
const financeHtml=await (await request(root+'/financing','GET',undefined,null)).text();assert.match(financeHtml,/Service Finance Company/);assert.match(financeHtml,/Wisetack/);assert.doesNotMatch(financeHtml,/>Sunbit</);assert.match(financeHtml,/partner underwriting/);assert.match(financeHtml,/data-financing-calculator/);
const socialOff=structuredClone(tenant.settings);socialOff.platform.footer.socials.googleBusiness.enabled=false;socialOff.platform.footer.socials.xTwitter.enabled=false;
tenant=(await api('/tenants/'+tenant.id,'PUT',{settings:socialOff,version:tenant.version})).tenant;
assert.match(await (await request(root+'/financing','GET',undefined,null)).text(),/data-social-network="googleBusiness"/,'draft toggle cannot change published footer');
const socialPreview=await (await request(root+'/financing?preview=1')).text();assert.doesNotMatch(socialPreview,/data-social-network="(?:googleBusiness|xTwitter)"/);
await api('/tenants/'+tenant.id+'/publish','POST',{approved:true,version:tenant.version});tenant=(await api('/tenants/'+tenant.id)).tenant;
for(const path of [root,root+'/pricing',root+'/blog',root+'/financing',root+'/promotions']){const html=await (await request(path,'GET',undefined,null)).text();assert.doesNotMatch(html,/data-social-network="(?:googleBusiness|xTwitter)"/,path+' hides disabled identities');assert.match(html,/data-social-network="instagram"/);}
const unlock='/api/public/'+tenant.slug+'/promotion-unlock';
assert.equal((await request(unlock,'GET',undefined,null)).status,405);
assert.equal((await request(unlock,'POST',{offerId:offer.id,answer:0},null,'https://evil.test')).status,403);
assert.equal((await request(unlock+'?preview=1','POST',{offerId:offer.id,answer:0},null)).status,403);
for(const answer of [1,'0',null,-1]){const r=await request(unlock,'POST',{offerId:offer.id,answer},null);assert.equal(r.status,400);assert.ok(!(await r.text()).includes(offer.code));}
const success=await request(unlock,'POST',{offerId:offer.id,answer:0},null);assert.equal(success.status,200);assert.equal((await success.json()).code,offer.code);
assert.match(success.headers.get('cache-control'),/no-store/);
assert.equal((await request(unlock,'POST',{offerId:'not-this-tenant',answer:0},null)).status,404);
assert.equal(activeOffers(platform,Date.parse(end)).length,0,'expiry boundary is exclusive');
const expired=structuredClone(tenant.settings);expired.platform.promotions.offers[0].endsAt=new Date(Date.now()-1000).toISOString();tenant=(await api('/tenants/'+tenant.id,'PUT',{settings:expired,version:tenant.version})).tenant;await api('/tenants/'+tenant.id+'/publish','POST',{approved:true,version:tenant.version});tenant=(await api('/tenants/'+tenant.id)).tenant;
assert.equal((await request(unlock,'POST',{offerId:offer.id,answer:0},null)).status,404);
assert.match(await (await request(root+'/promotions','GET',undefined,null)).text(),/no active promotions/);
const off=structuredClone(tenant.settings);off.platform.financing.enabled=false;off.platform.promotions.enabled=false;tenant=(await api('/tenants/'+tenant.id,'PUT',{settings:off,version:tenant.version})).tenant;await api('/tenants/'+tenant.id+'/publish','POST',{approved:true,version:tenant.version});
for(const page of ['financing','promotions'])assert.equal((await request(root+'/'+page,'GET',undefined,null)).status,404);
assert.equal((await request(unlock,'POST',{offerId:offer.id,answer:0},null)).status,404);
console.log('PASS tenant roles, draft/publication isolation, shared footers, feature gates and promotion unlock/expiry');

const kitData=JSON.parse((await import('node:fs')).readFileSync('public/design-kits.json','utf8'));
let legalPages=0;
for(const kit of Object.keys(kitData))for(const layout of ['immersive','editorial','studio'])for(const kind of ['privacy','terms']){
 const path='/design-preview/'+kit+'/'+layout+'/legal/'+kind;
 const response=await request(path);assert.equal(response.status,200,path);assert.match(await response.text(),/Preview policy draft/);legalPages++;
}
assert.equal((await request('/design-preview/roofing/immersive/legal/privacy','GET',undefined,null)).status,401);
assert.equal((await request('/design-preview/roofing/immersive/legal/privacy','GET',undefined,outsider)).status,403);
console.log('PASS '+legalPages+' trade/layout legal-preview links and their access controls');

// #015: public fixtures, exact clock boundaries, offset conversion and switch isolation.
const {roofingFixture}=await import('./fixtures/roofing-journey.mjs');
const {promotionFixture,promotionStates}=await import('./fixtures/roofing-promotions.mjs');
const fixture=structuredClone(roofingFixture);fixture.slug='promotions-display-015';
let displayTenant=(await api('/tenants','POST',fixture)).tenant;
const displayRoot='/s/'+displayTenant.slug;
const saveDisplay=async(offers,enabled=true,publish=true)=>{
 const settings={...displayTenant.settings,platform:{...displayTenant.settings.platform,promotions:{enabled,offers}}};
 displayTenant=(await api('/tenants/'+displayTenant.id,'PUT',{settings,version:displayTenant.version})).tenant;
 if(publish){await api('/tenants/'+displayTenant.id+'/publish','POST',{approved:true,version:displayTenant.version});displayTenant=(await api('/tenants/'+displayTenant.id)).tenant;}
};
let promotionCases=0;
for(const [state,offers] of Object.entries(promotionStates)){
 await saveDisplay(offers);
 const html=await(await request(displayRoot+'/promotions','GET',undefined,null)).text();
 const home=await(await request(displayRoot,'GET',undefined,null)).text();
 assert.match(home,/data-promotion-strip/);assert.match(home,/View promotions/);
 assert.doesNotMatch(html,/QA-015-PRIVATE-CODE|data-countdown|claim (?:your |my )?free/i);
 assert.doesNotMatch(home,/QA-015-PRIVATE-CODE|claim (?:your |my )?free/i);
 const count=(html.match(/data-promotion-quiz/g)||[]).length;
 assert.equal(count,state==='current'||state==='mixed'?1:0,state+' only current cards have quizzes');
 if(state==='none'||state==='disabledOffer'){assert.doesNotMatch(html,/data-promotion-state=/);assert.match(html,/no active promotions/);}
 else {
  for(const offer of offers){const expected=Date.parse(offer.startsAt)>Date.now()?'upcoming':Date.parse(offer.endsAt)<=Date.now()?'expired':'current';assert.ok(html.includes('data-promotion-state="'+expected+'" data-offer-id="'+offer.id+'"'));}
  assert.match(html,/Eligibility &amp; offer terms/);assert.match(html,/Results are not guaranteed/);assert.match(html,/Dates below follow this business’s local time zone/);
  const visibleDates=[...html.matchAll(/<time datetime="[^"]+">([^<]+)<\/time>/g)].map(m=>m[1]);assert.ok(visibleDates.length>=2);for(const date of visibleDates)assert.match(date,/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
  assert.doesNotMatch(html,/UTC|&lt;[^&]{1,80}&gt;|\{\{[^{}]{1,80}\}\}/i);
 }
 if(state==='upcoming')assert.match(html,/>Dec 1, 2098<\/time>/);
 if(state==='expired')assert.match(html,/>Nov 7, 2021<\/time>/);
 if(state==='current'){assert.match(html,/>Dec 31, 2019<\/time>/);assert.match(html,/>Jan 1, 2099<\/time>/);}
 if(state==='upcoming'||state==='expired'||state==='disabledOffer')assert.equal((await request('/api/public/'+displayTenant.slug+'/promotion-unlock','POST',{offerId:offers[0].id,answer:0},null)).status,404);
 promotionCases++;console.log('PASS promotion display fixture: '+state);
}
const boundary=normalizePlatform({promotions:{enabled:true,offers:[{...promotionFixture,startsAt:'2026-11-01T01:30:00-07:00',endsAt:'2026-11-01T01:30:00-08:00'}]}});
for(const [time,count] of [['2026-11-01T08:29:59.999Z',0],['2026-11-01T08:30:00Z',1],['2026-11-01T09:29:59.999Z',1],['2026-11-01T09:30:00Z',0]])assert.equal(activeOffers(boundary,Date.parse(time)).length,count,time);
promotionCases++;console.log('PASS start-inclusive/end-exclusive boundaries across daylight-saving offsets');
await saveDisplay([{...promotionFixture,id:'dst-date',startsAt:'2026-03-08T07:30:00Z',endsAt:'2026-03-08T08:30:00Z'}]);
const dstHtml=await(await request(displayRoot+'/promotions','GET',undefined,null)).text();assert.match(dstHtml,/>Mar 7, 2026<\/time>/);assert.match(dstHtml,/>Mar 8, 2026<\/time>/);
await saveDisplay(promotionStates.current);
const zoneDraft={...displayTenant.settings,platform:{...displayTenant.settings.platform,timeZone:'America/New_York'}};
displayTenant=(await api('/tenants/'+displayTenant.id,'PUT',{settings:zoneDraft,version:displayTenant.version})).tenant;
assert.match(await(await request(displayRoot+'/promotions','GET',undefined,null)).text(),/>Dec 31, 2019<\/time>/,'public dates retain published zone');
assert.match(await(await request(displayRoot+'/promotions?preview=1')).text(),/>Jan 2, 2099<\/time>/,'preview uses draft zone');
await api('/tenants/'+displayTenant.id+'/publish','POST',{approved:true,version:displayTenant.version});displayTenant=(await api('/tenants/'+displayTenant.id)).tenant;
assert.match(await(await request(displayRoot+'/promotions','GET',undefined,null)).text(),/>Jan 2, 2099<\/time>/,'published dates use the saved zone');
const oldClient={...displayTenant.settings,platform:{...displayTenant.settings.platform}};delete oldClient.platform.timeZone;displayTenant=(await api('/tenants/'+displayTenant.id,'PUT',{settings:oldClient,version:displayTenant.version})).tenant;assert.equal(displayTenant.settings.platform.timeZone,'America/New_York','older editors preserve the setting');
console.log('PASS short business-zone dates, DST rollover, draft/publication and old-editor preservation');
await saveDisplay(promotionStates.current);
const promoPreview=await(await request(displayRoot+'/promotions?preview=1')).text();
assert.match(promoPreview,/<button class="foundation-button" disabled>Unlock my offer/);assert.doesNotMatch(promoPreview,/QA-015-PRIVATE-CODE/);
assert.ok((await(await request(displayRoot+'?preview=1')).text()).includes('href="'+displayRoot+'/promotions?preview=1"'));
await saveDisplay(promotionStates.current,false,false);
assert.match(await(await request(displayRoot,'GET',undefined,null)).text(),/data-promotion-strip/);
assert.doesNotMatch(await(await request(displayRoot+'?preview=1')).text(),/data-promotion-strip/);
assert.equal((await request(displayRoot+'/promotions?preview=1')).status,404);
await api('/tenants/'+displayTenant.id+'/publish','POST',{approved:true,version:displayTenant.version});
assert.doesNotMatch(await(await request(displayRoot,'GET',undefined,null)).text(),/data-promotion-strip|href="[^" ]*\/promotions(?:[?"#])/);
assert.equal((await request(displayRoot+'/promotions','GET',undefined,null)).status,404);
promotionCases++;console.log('PASS draft/publication isolation and homepage/page switch');
assert.equal(promotionCases,8);console.log('PASS 8 promotion display scenarios');
