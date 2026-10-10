import assert from 'node:assert/strict';import fs from 'node:fs';
import {createRuntime} from '../src/aws/server.js';import worker from '../dist/server/index.js';
import {originalRows,variantSettings,styles} from './fixtures/section-variants.mjs';
import {pickDistance} from '../src/uniqueness.js';
const out='C:/Users/joe/website_creator/docs/build-evidence/028C',origin='http://127.0.0.1:8197';
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'unique@example.test',APP_ORIGIN:origin}});
const admin={id:'unique-admin',email:'unique@example.test'},owner={id:'unique-owner',email:'unique-owner@example.test'},checks=[];
const request=(path,method='GET',value,user=admin)=>worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);
const api=async(path,method='GET',value,user=admin)=>{const r=await request('/api'+path,method,value,user);assert.equal(r.status,200,await r.clone().text());return r.json()};
const ok=(v,label)=>{assert.ok(v,label);checks.push(label)};
const nativeFetch=globalThis.fetch;let providerCalls=0;globalThis.fetch=()=>{providerCalls++;throw Error('No provider call allowed')};
let first;
try{await api('/setup','POST',{});
for(const {row}of originalRows)for(const style of styles){
 const s=variantSettings(row,style,'a',false);delete s.siteStyleSeed;s.name='Sample API '+s.trade;s.phone='8054410199';
 const id='unique-api-'+s.designKit+'-'+style,fixture={...row,id,slug:id,settings:JSON.stringify(s),published:JSON.stringify(s),status:'published'};
 const keys=Object.keys(fixture);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>fixture[k])).run();
 let tenant=(await api('/tenants/'+id)).tenant;const before=await(await request('/s/'+id)).text();
 tenant=(await api('/tenants/'+id+'/generation','POST',{version:tenant.version,action:'regenerate',overrides:{seed:57,sections:{hero:'b',reviews:'b'}}})).tenant;
 ok(tenant.settings.uniqueness.style===style,id+' chosen Look');ok(tenant.settings.sectionVariants.hero==='b',id+' staff variant');ok(tenant.settings.uniqueness.seed===57,id+' seed override');
 ok((await(await request('/s/'+id)).text())===before,id+' public snapshot unchanged');
 const privateHtml=await(await request('/s/'+id+'?preview=1')).text();
 const repeat=(await api('/tenants/'+id+'/generation','POST',{version:tenant.version,action:'regenerate'})).tenant;
 ok((await(await request('/s/'+id+'?preview=1')).text())===privateHtml,id+' identical API regeneration');
 ok(repeat.settings.generationManifest.choices.uniqueness.seed===57,id+' persisted manifest');
 if(!first)first=repeat;
}
const id=first.id;
await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind(owner.id,id,owner.id,owner.email,'owner','2026-09-28T00:00:00Z').run();
ok((await request('/api/tenants/'+id+'/generation','POST',{version:first.version,action:'regenerate',overrides:{seed:9}},owner)).status===403,'owner cannot claim staff override');
ok((await request('/api/tenants/'+id,'PUT',{version:first.version,settings:{...first.settings,uniqueness:{...first.settings.uniqueness,seed:9}}})).status===409,'generic save cannot forge generated record');
ok((await request('/api/tenants/'+id,'PUT',{version:first.version,settings:{...first.settings,sectionVariants:{...first.settings.sectionVariants,hero:'c'}}})).status===409,'generic save cannot bypass generated staff section picks');
first=(await api('/tenants/'+id,'PUT',{version:first.version,settings:{...first.settings,siteStyle:'classic'}},owner)).tenant;
ok(first.settings.uniqueness.style==='classic','owner Look wins during ordinary save');ok(Number.isInteger(first.settings.uniqueness.uniqueness.minimumDistance),'Look save reassesses actual distance without stale claims');ok(first.settings.uniqueness.overrides.look.by.id===owner.id,'Look actor recorded');
const save=(await api('/tenants/'+id,'PUT',{version:first.version,settings:{...first.settings,name:'Sample API Renamed'}})).tenant;
ok(JSON.stringify(save.settings.uniqueness.copy).includes('Sample API Renamed'),'facts refresh without stale copy');
ok(JSON.stringify(save.settings.sectionVariants)===JSON.stringify(first.settings.sectionVariants),'facts save preserves layout');
const races=[];for(let n=0;n<2;n++){const {row}=originalRows.find(({row})=>JSON.parse(row.settings).designKit==='roofing'),s=variantSettings(row,'current','a',false);delete s.siteStyle;s.phone='8054410199';const fixture={...row,id:'unique-race-'+n,slug:'unique-race-'+n,settings:JSON.stringify(s),published:JSON.stringify(s),status:'published'},keys=Object.keys(fixture);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>fixture[k])).run();races.push((await api('/tenants/'+fixture.id)).tenant)}
const concurrent=await Promise.all(races.map(t=>api('/tenants/'+t.id+'/generation','POST',{version:t.version,action:'regenerate',overrides:{seed:222}})));
const picks=concurrent.map(x=>({style:x.tenant.settings.uniqueness.style,...x.tenant.settings.sectionVariants}));ok(pickDistance(...picks)>=3,'concurrent same-seed sites reserve different combinations');
ok(providerCalls===0,'zero provider calls');

fs.writeFileSync(out+'/checks/uniqueness-api.json',JSON.stringify({passed:true,count:checks.length,cases:68,providerCalls,checks},null,2));
}finally{globalThis.fetch=nativeFetch;await runtime.close()}

console.log('PASS '+checks.length+' API checks; database pool and queued jobs closed');
