import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {worker,env,admin} from './preview-fixture.mjs';
const origin='https://test.local';
async function req(path,method='GET',value){return worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json','oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email},body:value?JSON.stringify(value):undefined}),env)}
async function api(path,method='GET',v){const r=await req('/api'+path,method,v);assert.equal(r.status,200,await r.clone().text());return r.json()}
const kits=JSON.parse(readFileSync('public/design-kits.json')),films=JSON.parse(readFileSync('public/trade-build-films.json')),original=JSON.parse(readFileSync('public/trade-films.json'));
for(const id of Object.keys(kits).filter(id=>films[id]))for(const layout of ['immersive','editorial','studio']){
 const r=await req('/design-preview/'+id+'/'+layout);assert.equal(r.status,200);const h=await r.text(),hero=h.match(/<section id="home"[\s\S]*?<\/section>/)?.[0];
 assert.ok(hero);assert.ok(!hero.includes('<form'));assert.equal((hero.match(/<h1>/g)||[]).length,1);assert.equal((hero.match(/data-story-select=/g)||[]).length,3);
 assert.ok(hero.includes('Request an estimate'));assert.ok(hero.includes('Explore our expertise'));assert.ok(hero.includes('href="#craft-inquiry"'));assert.ok(hero.includes('data-build-video'));
 assert.ok(h.includes('THE SPACE BETWEEN<br>AN IDEA AND REALITY'));assert.ok(h.includes('data-detail-video'));assert.ok(h.includes('/assets/craft-films/'+id+'.mp4'));assert.ok(!h.includes('data-cutaway-tour'));assert.ok(!h.includes('data-cutaway-overlay'));assert.ok(h.includes('class="craft-story-form"'));
 const craft=h.match(/<section class="kit-commercial[\s\S]*?<\/section>/)?.[0];assert.ok(craft);assert.ok(craft.indexOf('id="craft-inquiry"')<craft.indexOf('<figure>'));assert.ok(craft.includes((original[id]||films[id]).url));assert.ok(!craft.includes('film-pov'));
 assert.ok(h.includes(films[id].scrubUrl));for(const key of ['url','poster','openingPoster'])assert.ok(existsSync('public'+new URL(films[id][key],origin).pathname),id+' '+key);
 const off=await (await req('/design-preview/'+id+'/'+layout+'?scrollStory=false')).text();assert.ok(off.includes('founder-standard-hero'));assert.ok(!off.includes('data-feature="hero.scrollStory"'));assert.ok(off.includes('id="craft-inquiry"'));
}
let {tenant:t}=await api('/tenants','POST',{designKit:'roofing',slug:'story-control-test',settings:{name:'Story Test Roofing',phone:'8055550199',area:'Oxnard',services:[{name:'Roof repair',description:'Discuss the condition.'}]}});
({tenant:t}=await api('/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,scrollStory:{chapters:[{headline:'APPROVED OPENING'}],heroCaptions:['A clear start.','Work underway.','The result.'],detailIntro:'The roof details.',detailCaptions:['Plan.','Protect.','Finish.'],proof:[{text:'UNAPPROVED CLAIM',approved:false},{text:'APPROVED FACT',approved:true}]}}}));
assert.equal(t.settings.scrollStory.detailCaptions[1],'Protect.');
let h=await (await req('/s/'+t.slug+'?preview=1')).text();assert.ok(h.includes('APPROVED OPENING'));assert.ok(h.includes('UNAPPROVED CLAIM · preview'));assert.ok(h.includes('The roof details.'));assert.ok(h.includes('Work underway.'));
await api('/tenants/'+t.id+'/publish','POST',{version:t.version,approved:true});h=await (await req('/s/'+t.slug)).text();assert.ok(!h.includes('UNAPPROVED CLAIM'));assert.ok(h.includes('APPROVED FACT'));
// Original partial lead-capture test belongs to the unrecovered sales workflow; public inquiry transport remains covered by client/auth tests.
({tenant:t}=await api('/tenants/'+t.id));
({tenant:t}=await api('/tenants/'+t.id,'PUT',{version:t.version,settings:{...t.settings,scrollStory:{...t.settings.scrollStory,mode:'chapters',detailEnabled:false}}}));
h=await (await req('/s/'+t.slug+'?preview=1')).text();assert.ok(!h.includes('id="craft-story"'));assert.equal((h.match(/data-story-scene=/g)||[]).length,5);assert.ok(h.includes('id="craft-inquiry"'));
const robles=await (await req('/s/robles-roofing')).text();assert.ok(robles.includes('data-build-video'));assert.ok(robles.includes('data-detail-video'));assert.ok(robles.includes('/assets/films/roofing-transformation.mp4'));
console.log('PASS: 12 trades × 3 layouts; hero/direct-form link; original craft films; detail scene; persisted captions/toggle; legacy chapter mode; proof gating; website media restoration scope.');
