import assert from 'node:assert/strict';
import {worker,env,admin} from './preview-fixture.mjs';
const origin='https://test.local';
async function req(path,method='GET',value,user=admin){return worker.fetch(new Request(origin+'/api'+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value?JSON.stringify(value):undefined}),env)}
async function get(path){const r=await req(path);assert.equal(r.status,200);return r.json()}
const tenant=(await get('/tenants')).tenants[0],base='/tenants/'+tenant.id;
const checks=await get(base+'/readiness');assert.ok(checks.checks.find(x=>x.label==='Phone').ready);assert.equal(checks.checks.find(x=>x.label==='Logo').ready,false);
const settings={...tenant.settings,hero:'UNSAVED <script>headline</script>',sections:[{id:'area',enabled:true},{id:'services',enabled:false},{id:'work',enabled:false},{id:'process',enabled:true}]};
const preview=await req(base+'/render','POST',{settings});assert.equal(preview.status,200);const html=(await preview.json()).html;assert.ok(html.includes('UNSAVED &lt;script&gt;'));assert.ok(!html.includes('id="services"'));assert.ok(!html.includes('id="work"'));assert.ok(html.indexOf('id="area"')<html.indexOf('id="process"'));assert.equal((await get(base)).tenant.settings.hero,tenant.settings.hero);
assert.equal((await req(base+'/render','POST',{settings:{...settings,heroPhotoId:'other-tenant-photo'}})).status,400);
const sales={stage:'Presented',assignedTo:'Joe',amount:750,notes:'Follow up after walkthrough'};
assert.equal((await req(base+'/sales','PUT',{data:sales,version:0})).status,200);assert.equal((await get(base+'/sales')).data.assignedTo,'Joe');assert.equal((await req(base+'/sales','PUT',{data:sales,version:0})).status,409);
assert.equal((await req(base+'/sales','PUT',{data:{...sales,stage:'Paid'},version:1})).status,400);
const paid={...sales,stage:'Paid',ownerApproved:true,approvalNote:'Recorded owner approval',paymentReference:'Manual test reference'};assert.equal((await req(base+'/sales','PUT',{data:paid,version:1})).status,200);
assert.equal((await get('/pipeline')).records[0].data.stage,'Paid');
await env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind('editor-member',tenant.id,'editor','editor@example.test','editor',new Date().toISOString()).run();
const editor={id:'editor',email:'editor@example.test'};assert.equal((await req(base+'/sales','GET',null,editor)).status,403);assert.equal((await req('/pipeline','GET',null,editor)).status,403);assert.equal((await req(base+'/render','POST',{settings},editor)).status,200);assert.equal((await req(base+'/readiness','GET',null,null)).status,401);
assert.equal((await req(base,'PUT',{settings,version:tenant.version})).status,200);const changed=(await get(base)).tenant;assert.equal(changed.settings.sections[0].id,'area');assert.equal(changed.published.hero,tenant.settings.hero);
console.log('PASS: readiness facts, live render without save, section reorder/hide, escaped copy, image isolation, sales persistence/concurrency/evidence gates, admin-only sales, editor preview, anonymous denial, saved draft vs publication.');
