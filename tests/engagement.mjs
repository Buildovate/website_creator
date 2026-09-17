import assert from 'node:assert/strict';
import {worker,env,admin} from './preview-fixture.mjs';
const origin='https://test.local';
async function req(path,method='GET',data,user=admin,extras={}){return worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{}),...extras},body:data?JSON.stringify(data):undefined}),env)}
async function ok(path,method='GET',data,user=admin,extras={}){const r=await req(path,method,data,user,extras);assert.equal(r.status,200,await r.clone().text());return r.json()}
const tenant=(await ok('/api/tenants')).tenants[0],ep='/api/engagement/'+tenant.id,pub='/api/public/'+tenant.slug;
const other=(await ok('/api/tenants','POST',{slug:'other-roofing',settings:{name:'Other Roofing',trade:'Roofing'}})).tenant;
const stranger={id:'stranger',email:'stranger@example.test'};
assert.equal((await req(ep+'/threads','GET',null,stranger)).status,404);
assert.equal((await req(ep+'/config','PUT',{},null)).status,401);
let cfg=(await ok(ep+'/config')).record;
assert.equal((await req(ep+'/verify-phone','POST',{consent:true})).status,409);
assert.equal((await req(ep+'/config','PUT',{version:cfg.version,data:{smsEnabled:true,phone:'+18052480739',phoneVerified:true}})).status,400);
await ok(ep+'/config','PUT',{version:cfg.version,data:{enabled:true,aiEnabled:true,welcome:'How can we help?',verifyCode:'do-not-store'}});
assert.ok(!JSON.stringify(await ok(ep+'/config')).includes('do-not-store'));
assert.equal((await req(pub+'/chat/start','POST',{name:'Visitor'},null)).status,400);
const start=await req(pub+'/chat/start','POST',{name:'Test Visitor',contact:'visitor@example.test',consent:true},null);assert.equal(start.status,200,await start.clone().text());const cookie=start.headers.get('set-cookie').split(';')[0];assert.ok(start.headers.get('set-cookie').includes('HttpOnly'));
assert.equal((await ok(pub+'/chat','GET',null,null)).thread,null);
const initial=await ok(pub+'/chat','GET',null,null,{cookie});assert.equal(initial.messages.length,1);assert.equal(initial.ai,false);
const post=await ok(pub+'/chat/message','POST',{message:'I need help with my roof.'},null,{cookie});assert.equal(post.messages.filter(m=>m.sender==='visitor').length,1);assert.equal(post.messages.at(-1).sender,'system');
const inbox=await ok(ep+'/threads'),id=inbox.threads[0].id;assert.ok(!JSON.stringify(inbox).includes('token_hash'));
assert.equal((await req('/api/engagement/'+other.id+'/threads/'+id)).status,404);
assert.equal((await req(pub+'/chat/message','POST',{message:'stolen'},null,{cookie:cookie+'wrong'})).status,401);
assert.equal((await req(pub+'/chat/message','POST',{message:'CSRF'},null,{cookie,origin:'https://evil.example'})).status,403);
let calls=0;const original=globalThis.fetch;env.OPENAI_API_KEY='test-key';globalThis.fetch=async(url,opts)=>{assert.equal(url,'https://api.openai.com/v1/responses');calls++;const b=JSON.parse(opts.body);assert.equal(b.store,false);assert.ok(!b.tools);assert.ok(b.instructions.includes('Do not invent prices'));return Response.json({output:[{content:[{type:'output_text',text:'What issue have you noticed?'}]}]})};
try{const result=await ok(pub+'/chat/message','POST',{message:'Do you repair shingles?'},null,{cookie});assert.ok(result.messages.some(m=>m.sender==='assistant'));
await ok(ep+'/threads/'+id,'POST',{message:'Mario here, happy to discuss the roof.'});await ok(pub+'/chat/message','POST',{message:'Thank you.'},null,{cookie});assert.equal(calls,1);const handoff=await ok(pub+'/chat/handoff','POST',{},null,{cookie});assert.equal(handoff.human,true);
await ok(ep+'/threads/'+id,'POST',{action:'close'});assert.equal((await req(pub+'/chat/message','POST',{message:'closed'},null,{cookie})).status,409);
}finally{globalThis.fetch=original;delete env.OPENAI_API_KEY}
const pricing=await req('/s/'+tenant.slug+'/pricing','GET',null,null);assert.equal(pricing.status,200);const html=await pricing.text();assert.ok(!html.includes('class="price-option'));assert.ok(html.includes('class="pricing-split'));assert.ok(html.includes('/assets/films/roofing-story.mp4'));assert.ok(html.includes('data-pricing-form'));assert.ok(html.includes('autoplay loop'));
const inquiry={name:'Estimate Test',phone:'2025550144',email:'estimate@example.test',service:'Repair & protect',timing:'Just exploring',budget:'Discuss options',message:'Test request',consent:true};await ok(pub+'/pricing-inquiry','POST',inquiry,null);const submissions=(await ok('/api/workspace/'+tenant.id+'/submissions')).records;assert.ok(submissions.some(x=>x.data.formId==='pricing'));assert.ok((await ok('/api/tenants/'+tenant.id)).inquiries.some(x=>x.phone==='2025550144'));
const {pricing:p}=await ok(ep+'/pricing');let saved=(await ok('/api/tenants/'+tenant.id)).tenant;await ok('/api/tenants/'+tenant.id,'PUT',{version:saved.version,settings:{...saved.settings,pricing:{...p,approved:false,packages:[{...p.packages[0],price:'$1234'}]}}});const draft=await (await req('/s/'+tenant.slug+'/pricing?preview=1')).text();assert.ok(!draft.includes('$1234'));assert.equal((await ok(ep+'/pricing')).pricing.packages[0].price,'$1234');assert.ok(!html.includes('$1234'));assert.equal((await req('/s/'+tenant.slug+'/pricing?preview=1','GET',null,null)).status,401);
const lookup=await ok(ep+'/review-lookup','POST',{yelpUrl:'https://www.yelp.com/biz/robles-roofing-oxnard'});assert.equal(lookup.yelpBusinessId,'robles-roofing-oxnard');assert.equal((await req(ep+'/review-lookup','POST',{googleUrl:'http://169.254.169.254/'})).status,400);
console.log('PASS chat: tenant/session isolation, consent, origin validation, private cookies, disconnected services, AI grounding, human takeover, closing; pricing: rendered pages, preview privacy, linked contact/submission capture; reviews: safe links and business ID extraction.');
