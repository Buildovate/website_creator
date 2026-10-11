import assert from 'node:assert/strict';import fs from 'node:fs';import{createRuntime}from'../src/aws/server.js';import worker from '../dist/server/index.js';
import{originalRows,variantSettings,styles}from'./fixtures/section-variants.mjs';import{mediaPool}from'../src/media-library.js';
const out='C:/Users/joe/website_creator/docs/build-evidence/028D',origin='http://127.0.0.1:8196',runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'media@example.test',APP_ORIGIN:origin}});
const admin={id:'media-admin',email:'media@example.test'},owner={id:'media-owner',email:'media-owner@example.test'},checks=[];
const request=(path,method='GET',value,user=admin)=>worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);
const api=async(path,method='GET',value,user=admin)=>{const r=await request('/api'+path,method,value,user);assert.equal(r.status,200,await r.clone().text());return r.json()};
const ok=(v,label)=>{assert.ok(v,label);checks.push(label)};const nativeFetch=globalThis.fetch;let providerCalls=0;globalThis.fetch=()=>{providerCalls++;throw Error('Provider call forbidden')};let first;
try{
 await api('/setup','POST',{});
 for(const{row}of originalRows)for(const style of styles){
  const s=variantSettings(row,style,'a',false),id='media-api-'+s.designKit+'-'+style,r={...row,id,slug:id,settings:JSON.stringify(s),published:JSON.stringify(s),status:'published'},keys=Object.keys(r);
  await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>r[k])).run();
  let t=(await api('/tenants/'+id)).tenant;const published=await(await request('/s/'+id)).text(),choice=mediaPool(s.designKit,'hero').at(-1);
  t=(await api('/tenants/'+id+'/generation','POST',{version:t.version,action:'regenerate',mediaOverrides:{hero:choice}})).tenant;
  ok(t.settings.mediaPicks.slots.hero.assetId===choice,id+' staff media override');ok(t.settings.mediaPicks.overrides.history[0].by.id===admin.id,id+' actor saved');
  ok(JSON.stringify(t.settings.mediaPicks)===JSON.stringify(t.settings.generationManifest.choices.mediaPicks),id+' manifest persisted');
  ok(await(await request('/s/'+id)).text()===published,id+' published snapshot unchanged until publish');
  const preview=await(await request('/s/'+id+'?preview=1')).text();ok(preview.includes(t.settings.mediaPicks.slots.hero.poster.url),id+' preview uses chosen poster');
  t=(await api('/tenants/'+id+'/generation','POST',{version:t.version,action:'regenerate'})).tenant;ok(await(await request('/s/'+id+'?preview=1')).text()===preview,id+' repeat HTML identical');
  t=(await api('/tenants/'+id,'PUT',{version:t.version,settings:{...t.settings,color:'#194c5b'}})).tenant;
  ok(t.settings.generationManifest.choices.mediaPicks.slots.hero.treatment.color==='#194c5b',id+' saved palette treatment');
  if(!first)first=t;
 }
 const id=first.id;await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind(owner.id,id,owner.id,owner.email,'owner','2026-09-28T00:00:00Z').run();
 ok((await request('/api/tenants/'+id+'/generation','POST',{version:first.version,action:'regenerate',mediaOverrides:{hero:mediaPool('roofing','hero')[0]}},owner)).status===403,'Owner cannot supply staff media override');
 ok((await request('/api/tenants/'+id,'PUT',{version:first.version,settings:{...first.settings,mediaPicks:{slots:{hero:{assetId:'forged'}}}}})).status===409,'Ordinary save cannot forge media record');
 ok((await request('/api/tenants/'+id+'/generation','POST',{version:first.version,action:'regenerate',mediaOverrides:{hero:'unknown-pending'}})).status===400,'Invalid or unapproved override rejected');
 const races=[];for(let n=0;n<2;n++){const{row}=originalRows.find(x=>JSON.parse(x.row.settings).designKit==='roofing'),s=variantSettings(row,'current','a',false),id='media-race-'+n,r={...row,id,slug:id,settings:JSON.stringify(s),published:JSON.stringify(s),status:'published'},keys=Object.keys(r);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>r[k])).run();races.push((await api('/tenants/'+id)).tenant)}
 const concurrent=await Promise.all(races.map(t=>api('/tenants/'+t.id+'/generation','POST',{version:t.version,action:'regenerate',overrides:{seed:443}})));
 ok(concurrent[0].tenant.settings.mediaPicks.slots.hero.assetId!==concurrent[1].tenant.settings.mediaPicks.slots.hero.assetId,'Concurrent same-seed generations reserve different available hero media');
 ok(providerCalls===0,'No provider calls');
 fs.writeFileSync(out+'/checks/media-api.json',JSON.stringify({passed:true,count:checks.length,cases:68,providerCalls,checks},null,2));console.log('PASS '+checks.length+' media API checks');
}finally{globalThis.fetch=nativeFetch;await runtime.close()}
