import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {worker,env,admin} from './preview-fixture.mjs';
const origin='https://test.local';
async function req(path,method='GET',value,user=admin){return worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value?JSON.stringify(value):undefined}),env)}
async function api(path,method='GET',value,user=admin){const r=await req('/api'+path,method,value,user);assert.equal(r.status,200,await r.clone().text());return r.json()}
const kits=JSON.parse(readFileSync('public/design-kits.json')),specialties=JSON.parse(readFileSync('public/trade-library.json'));
assert.equal(Object.keys(kits).length,7);
for(const [id,k] of Object.entries(kits)){
 assert.ok(existsSync('public'+k.image));assert.ok(k.prompt.includes('Never invent reviews'));assert.equal(Object.keys(k.recipes).length,6);
 for(const layout of ['immersive','editorial','studio']){const r=await req('/design-preview/'+id+'/'+layout);assert.equal(r.status,200);const h=await r.text();assert.ok(h.includes('layout-'+layout));assert.ok(h.includes('DESIGN KIT PREVIEW'));assert.ok(h.includes('Preview — submission disabled'));assert.equal((h.match(/id="lead-form"/g)||[]).length,1);assert.ok(h.includes(k.image));}
 const {tenant:t}=await api('/tenants','POST',{designKit:id,slug:'kit-'+id,settings:{name:'QA '+k.trade,phone:'8055550188',area:'Test service area',services:specialties[k.trade].slice(0,2).map(name=>({name,description:'Scope to discuss.'})),effects:{marquee:false,parallax:false}}});
 assert.equal(t.settings.designKit,id);assert.equal(t.settings.trade,k.trade);assert.equal(t.settings.color,k.color);assert.ok(t.settings.hero!== 'Built with care. Made to last.');let h=await (await req('/s/'+t.slug+'?preview=1')).text();assert.ok(h.includes('class="showcase'));assert.ok(!h.includes('class="kit-marquee"'));assert.ok(h.includes('data-parallax="false"'));assert.ok(h.includes('Scope to discuss.'));
 await api('/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,template:'editorial',effects:{...t.settings.effects,process:false},creativeBrief:'Saved custom direction'}});const current=(await api('/tenants/'+t.id)).tenant;assert.equal(current.settings.creativeBrief,'Saved custom direction');h=await (await req('/s/'+t.slug+'?preview=1')).text();assert.ok(h.includes('layout-editorial'));assert.ok(h.includes('kit-static-step'));assert.ok(!h.includes('<div class="kit-steps"><details'));
}
assert.equal((await req('/design-preview/roofing/immersive','GET',null,null)).status,401);assert.equal((await req('/design-preview/roofing/immersive','GET',null,{id:'outsider',email:'outsider@test.local'})).status,403);assert.equal((await req('/api/tenants','POST',{designKit:'bogus',slug:'bogus-kit',settings:{name:'Invalid',trade:'Roofing',services:[{name:'Roof repair'}]}})).status,400);assert.equal((await req('/api/tenants','POST',{designKit:'patios',slug:'empty-kit',settings:{name:'Empty',services:[]}})).status,400);
console.log('PASS design kits: 7 trades × 3 real previews; imagery and prompts; authenticated preview access; kit persistence, distinct layouts, effect toggles, saved brief, no blank-specialty creation or invalid kits.');
