import test from 'node:test';
import assert from 'node:assert/strict';
import {worker,env,admin} from './preview-fixture.mjs';
import {footerFixture as baseFooterFixture,hiddenFooterFields} from './fixtures/footer.mjs';
// Existing fictional 555 fixture, explicitly designated Sample in this test only.
const footerFixture=mode=>{const f=baseFooterFixture(mode);f.settings.name='Sample Fictional '+f.settings.name;return f};
const origin='https://test.local';
async function request(path,method='GET',value,user=admin){return worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value===undefined?undefined:JSON.stringify(value)}),env);}
async function api(path,method='GET',value){const r=await request('/api'+path,method,value);assert.equal(r.status,200,await r.clone().text());return r.json();}
async function publish(t){await api('/tenants/'+t.id+'/publish','POST',{version:t.version,approved:true});return (await api('/tenants/'+t.id)).tenant;}
async function footer(path,user=null){const r=await request(path,'GET',undefined,user);assert.equal(r.status,200,path);const match=(await r.text()).match(/<footer class="studio-footer"[\s\S]*?<\/footer>/);assert.ok(match,path);return match[0];}
test('#012 hidden contact regions collapse; required facts, legal links and publication boundaries persist',async()=>{
 let t=(await api('/tenants','POST',footerFixture('hidden'))).tenant;t=await publish(t);const root='/s/'+t.slug;
 const hidden=await footer(root);
 assert.doesNotMatch(hidden,/footer-company|footer-locations|footer-policy|Hidden location heading|Empty location heading|Hidden address|100 Example Lane|office@example.test|QA-LICENSE-001|BUILT FOR YOUR EVERYDAY/);
 for(const label of ['Explore website','Legal','Social profiles','Service areas','Privacy policy','Website terms','Powered by'])assert.ok(hidden.includes(label));
 for(const kind of ['privacy','terms'])assert.equal((await request(root+'/legal/'+kind,'GET',undefined,null)).status,200);
 let s=structuredClone(t.settings);const required=footerFixture('required').settings;s.platform.legal=required.platform.legal;
 t=(await api('/tenants/'+t.id,'PUT',{version:t.version,settings:s})).tenant;
 assert.doesNotMatch(await footer(root),/QA-LICENSE-001/,'draft required facts stay private');
 assert.equal((await request(root+'?preview=1','GET',undefined,null)).status,401);
 const preview=await footer(root+'?preview=1',admin);assert.doesNotMatch(preview,/QA-LICENSE-001/);assert.match(preview,/\/legal\/privacy\?preview=1/);
 assert.match(await(await request(root+'/legal?preview=1','GET',undefined,admin)).text(),/ZZ License QA-LICENSE-001/);
 t=await publish(t);
 for(const path of [root,root+'/pricing',root+'/blog']){
  const html=await footer(path);assert.doesNotMatch(html,/QA-LICENSE-001|QA disclosure fixture|footer-policy/);assert.doesNotMatch(html,/footer-company|footer-locations|>Bonded<|>Insured</);
 }
 const legal=await(await request(root+'/legal','GET',undefined,null)).text();assert.match(legal,/ZZ License QA-LICENSE-001/);assert.match(legal,/QA disclosure fixture/);
 // The actual public legal pages must use the published snapshot, including after a draft rename.
 s=structuredClone(t.settings);s.name='Draft-only legal name';t=(await api('/tenants/'+t.id,'PUT',{version:t.version,settings:s})).tenant;
 assert.doesNotMatch(await(await request(root+'/legal/privacy','GET',undefined,null)).text(),/Draft-only legal name/);
 assert.match(await(await request(root+'/legal/privacy?preview=1','GET',undefined,admin)).text(),/Draft-only legal name/);
 console.log('PASS hidden primary/additional locations, required license independent of toggles, legal routes and private draft links');
});
test('#012 multiple locations, optional facts, custom links, financing details and safe disclosure text',async()=>{
 const f=footerFixture('multiple');f.settings.platform.footer.insured=true;f.settings.platform.footer.bonded=true;
 f.settings.platform.legal.policy.footerDisclosure='QA <script>alert(1)</script> & policy';
 f.settings.reviews={privacyUrl:'https://example.test/privacy',termsUrl:'https://example.test/terms'};
 let t=(await api('/tenants','POST',f)).tenant;t=await publish(t);const root='/s/'+t.slug,html=await footer(root);
 assert.equal((html.match(/class="footer-location"/g)||[]).length,2);assert.doesNotMatch(html,/Empty location heading/);
 assert.match(html,/tel:\+18055550111/);assert.match(html,/mailto:oxnard-office@example.test/);assert.match(html,/>Insured</);assert.doesNotMatch(html,/>Bonded</);
 assert.doesNotMatch(html,/QA &lt;script&gt;alert\(1\)&lt;\/script&gt; &amp; policy/);
 const legal=await(await request(root+'/legal','GET',undefined,null)).text();assert.match(legal,/QA &lt;script&gt;alert\(1\)&lt;\/script&gt; &amp; policy/);assert.doesNotMatch(legal,/<script>alert/);
 assert.match(html,/href="https:\/\/example.test\/privacy"/);assert.match(html,/href="https:\/\/example.test\/terms"/);
 assert.doesNotMatch(html,/class="footer-financing"|Estimate only; partner underwriting applies/);assert.match(legal,/Estimate only; partner underwriting applies/);
 let s=structuredClone(t.settings);s.platform.financing.enabled=false;s.platform.footer.locations.forEach(l=>l.visible=structuredClone(hiddenFooterFields));s.platform.footer.visible=structuredClone(hiddenFooterFields);
 t=(await api('/tenants/'+t.id,'PUT',{version:t.version,settings:s})).tenant;t=await publish(t);
 const off=await footer(root);assert.doesNotMatch(off,/footer-financing|footer-locations|footer-company|>Insured</);assert.match(await(await request(root+'/legal','GET',undefined,null)).text(),/License QA-LICENSE-001/);
 console.log('PASS two visible locations, hidden empty third location, permitted optional facts, escaped policy, custom links and financing on/off');
});
