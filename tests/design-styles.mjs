import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRuntime} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {STYLE_IDS,tradeStyles,stableSiteStyleSeed,selectedSiteStyle,cleanSiteStyle} from '../src/design-styles.js';
import {applySiteStyle} from '../src/site-style-render.js';
const out='C:/Users/joe/website_creator/docs/build-evidence/028A',checks=[];
function check(value,label){assert.ok(value,label);checks.push(label)}
check(Object.keys(tradeStyles).length===17,'four configs for all 17 installed kits');
for(const [kit,styles]of Object.entries(tradeStyles)){check(styles.length===4,kit+' has four styles');for(const style of styles)check(style.headingFont&&style.bodyFont&&style.palette.background&&style.palette.surface&&style.palette.text&&style.palette.accent&&style.palette.cta&&style.spacing.section&&style.spacing.gap&&style.radius&&style.surfaceTreatment,kit+' complete config '+style.id)}
for(let i=0;i<100;i++){const id='tenant-'+i,seed=stableSiteStyleSeed(id);check(seed===stableSiteStyleSeed(id),'stable seed '+i);check(selectedSiteStyle({siteStyleSeed:seed})===STYLE_IDS[seed%4],'seed selection '+i);check(selectedSiteStyle({siteStyleSeed:seed,siteStyle:'classic'})==='classic','saved override '+i)}
check(selectedSiteStyle({})==='current','unmigrated legacy sites retain current look');
assert.throws(()=>cleanSiteStyle({siteStyle:'<script>'}));assert.throws(()=>cleanSiteStyle({siteStyleSeed:-1}));
assert.deepEqual(cleanSiteStyle({}, {siteStyle:'bold',siteStyleSeed:3}),{siteStyle:'bold',siteStyleSeed:3});
assert.deepEqual(cleanSiteStyle({siteStyleSeed:7},{siteStyleSeed:3}),{siteStyleSeed:3});
const markup='<!doctype html><html><head></head><body><a href="/s/one/contact?x=1#form">Ask</a><a href="/s/one-more">Other</a></body></html>';
check(applySiteStyle(markup,{siteStyle:'current'})===markup,'current is byte-for-byte identity');
for(const style of STYLE_IDS.slice(1)){const result=applySiteStyle(markup,{siteStyle:style});check(result.includes('data-site-style="'+style+'"'),'server applies '+style);check(result.replace(/<link rel="preload" href="\/assets\/(?:dm-sans|barlow-bold)\.ttf" as="font" type="font\/ttf" crossorigin>/g,'').replace(' data-site-style="'+style+'"','').replace(/<link rel="stylesheet" href="\/site-styles.css"><style>[\s\S]*?<\/style>/,'')===markup,'theme retains exact content and structure '+style)}
const preview=applySiteStyle(markup,{}, {previewStyle:'classic',base:'/s/one'});check(preview.includes('preview=1&amp;siteStyle=classic#form')&&preview.includes('href="/s/one-more"'),'private preview follows own links only');
const base='http://127.0.0.1:8186',headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'style-test-admin','oai-authenticated-user-email':'style-test@example.test'};
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'style-test@example.test',PORT:'8186',APP_ORIGIN:base}});
const request=(path,method='GET',data,h=headers)=>worker.fetch(new Request(base+path,{method,headers:h,body:data===undefined?undefined:JSON.stringify(data)}),runtime.env);
async function api(path,method='GET',data){const r=await request('/api'+path,method,data);assert.equal(r.status,200,await r.clone().text());return r.json()}
try{await api('/setup','POST',{});let {tenant}=await api('/tenants','POST',{designKit:'roofing',slug:'style-flow',settings:{siteStyle:'current',name:'QA Style Flow',phone:'8054410199',area:'Ventura',services:[{name:'Roof repair'}]}});
check(tenant.settings.siteStyleSeed===stableSiteStyleSeed(tenant.id),'new site gets tenant seed');
await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});tenant=(await api('/tenants/'+tenant.id)).tenant;
const original=await (await request('/s/style-flow')).text();
const saved=await api('/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,siteStyle:'classic'}});tenant=saved.tenant;
check((await (await request('/s/style-flow')).text())===original,'draft style does not change public bytes');
check((await (await request('/s/style-flow?siteStyle=bold','GET',undefined,{})).text())===original,'anonymous style query cannot override published look');
check((await request('/s/style-flow?preview=1&siteStyle=bold','GET',undefined,{})).status>=400,'private style preview rejects anonymous visitors');
const privatePreview=await request('/s/style-flow?preview=1&siteStyle=bold');check(privatePreview.headers.get('x-robots-tag').includes('noindex'),'private preview noindex');check((await privatePreview.text()).includes('data-site-style="bold"'),'unsaved authorized full preview');
const rendered=await api('/tenants/'+tenant.id+'/render','POST',{settings:{...tenant.settings,siteStyle:'fresh'}});check(rendered.html.includes('data-site-style="fresh"'),'editor render matches chosen look');
check((await request('/api/tenants/'+tenant.id,'PUT',{version:0,settings:tenant.settings})).status===409,'stale save rejected');
check((await request('/api/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,siteStyle:'invalid'}})).status===400,'invalid choice rejected');
await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});const published=await (await request('/s/style-flow')).text();check(published.includes('data-site-style="classic"'),'Publish exposes the saved style');
check((await (await request('/s/style-flow/contact')).text()).includes('data-site-style="classic"'),'style reaches the whole published site');
for(const role of ['viewer','editor']){await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind('style-'+role,tenant.id,'style-'+role,role+'@example.test',role,new Date().toISOString()).run();const h={...headers,'oai-authenticated-user-id':'style-'+role,'oai-authenticated-user-email':role+'@example.test'};const latest=(await api('/tenants/'+tenant.id)).tenant;check((await request('/api/tenants/'+tenant.id+'/publish','POST',{version:latest.version,approved:true},h)).status===403,role+' cannot publish');check((await request('/api/tenants/'+tenant.id,'PUT',{version:latest.version,settings:{...latest.settings,siteStyle:'fresh'}},h)).status===(role==='viewer'?403:200),role+' existing draft permissions retained')}
const r=(await api('/tenants/'+tenant.id)).tenant,regen=await api('/tenants/'+tenant.id+'/generation','POST',{version:r.version,action:'regenerate'});check(regen.tenant.settings.siteStyle==='fresh'&&regen.tenant.settings.siteStyleSeed===tenant.settings.siteStyleSeed,'refresh retains explicit look and seed');
console.log('PASS design styles: '+checks.length+' assertions');
}finally{await runtime.close();fs.writeFileSync(out+'/style-unit-results.json',JSON.stringify({checks,count:checks.length},null,2))}
