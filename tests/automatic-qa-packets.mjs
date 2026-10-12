import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRuntime} from '../src/aws/server.js';
import {createReviewCapture} from '../src/aws/review-capture.js';
import worker from './helpers/qa-source-worker.mjs';
import {mediaSamples} from './fixtures/media-library.mjs';
const root=releaseRepoRoot,out=root+'/docs/build-evidence/028F',origin='http://127.0.0.1:8212';
const capture=createReviewCapture({onScreenshot:async({path,readiness})=>{const file=out+'/capture-readiness/'+readiness.environment.packetSlug+'/'+readiness.environment.versionHash+'/'+path+'.json';fs.mkdirSync(file.slice(0,file.lastIndexOf('/')),{recursive:true});fs.writeFileSync(file,JSON.stringify(readiness,null,2));},browserModule:'playwright',executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
const runtime=await createRuntime({worker,reviewCapture:capture,env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'review@example.test',APP_ORIGIN:origin,OPENAI_API_KEY:'',GOOGLE_PLACES_API_KEY:'',YELP_API_KEY:''}});
const req=(path,method='GET',value,user={id:'review-admin',email:'review@example.test'})=>worker.fetch(new Request(origin+path,{method,headers:{origin,'content-type':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);
const api=async(path,method='GET',value,user)=>{const response=await req('/api'+path,method,value,user);assert.equal(response.status,200,await response.clone().text());return response.json()};
const packets=[];const results=[],check=(value,label)=>{assert.ok(value,label);results.push(label)};
const all=mediaSamples(),fixtures=process.argv.includes('--smoke')?all.slice(0,1):all;
try{
 await api('/setup','POST',{});
 for(const f of fixtures){
  const row={...f.row,status:'draft',published:null},keys=Object.keys(row);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run();
  const t=(await api('/tenants/'+f.id)).tenant;
  const denied=await req('/api/tenants/'+f.id+'/publish','POST',{version:t.version,approved:true});check(denied.status===409,'Publishing without packet denied: '+f.id);
  let status=await api('/tenants/'+f.id+'/review-packet');await api('/tenants/'+f.id+'/review-packet','POST',{versionHash:status.versionHash});
  const deadline=Date.now()+15*60*1000;
  do{await new Promise(resolve=>setTimeout(resolve,1000));status=await api('/tenants/'+f.id+'/review-packet');if(status.packet?.status==='Capture failed')throw Error(status.packet.captureMessage);if(Date.now()>deadline)throw Error('Packet capture timed out');}while(status.packet?.status!=='Complete');
  const p=status.packet;check(p.pages.length>=12,'Every enabled page captured: '+f.id);check(p.pages.every(p=>p.screenshots[1440]&&p.screenshots[390]),'Both widths: '+f.id);check(p.clips.every(c=>Object.keys(c.frames).length===5),'Five frames per clip: '+f.id);check(p.claims.some(c=>c.category==='consent'),'Consent text captured: '+f.id);check(p.claims.some(c=>c.category==='financing'),'Financing text captured: '+f.id);
  const folder=out+'/packets/'+f.id+'/'+p.versionHash;fs.mkdirSync(folder,{recursive:true});for(const file of ['packet.json','source.json',...p.files.map(x=>x.path)]){const response=await req('/api/tenants/'+f.id+'/review-packet/file?version='+p.versionHash+'&path='+encodeURIComponent(file));assert.equal(response.status,200);fs.mkdirSync(folder+'/'+file.split('/').slice(0,-1).join('/'),{recursive:true});fs.writeFileSync(folder+'/'+file,Buffer.from(await response.arrayBuffer()))}
  packets.push({id:f.id,versionHash:p.versionHash,pages:p.pages.length,clips:p.clips.length,qa:status.qa.summary});
  fs.writeFileSync(out+'/checks/qa-packets.json',JSON.stringify({captureAssertionsPassed:true,qaGateClear:packets.every(p=>p.qa.clear),count:results.length,packets,results},null,2));
  console.log(JSON.stringify(status.qa.summary));
  console.log('CAPTURED '+f.id+': '+p.pages.length+' pages, '+p.clips.length+' clips, '+p.claims.length+' claims');
 }
 fs.writeFileSync(out+'/checks/qa-packets.json',JSON.stringify({captureAssertionsPassed:true,qaGateClear:packets.every(p=>p.qa.clear),count:results.length,packets,results},null,2));
}finally{await runtime.close()}
