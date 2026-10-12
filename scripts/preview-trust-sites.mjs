import {readFileSync} from 'node:fs';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from '../tests/fixtures/roofing-journey.mjs';
import {trustSitesFixture} from '../tests/fixtures/trust-sites.mjs';
const port=8102,base='http://127.0.0.1:'+port;
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'trust-sites-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:base}});
async function api(path,method='GET',data){const bytes=data instanceof Uint8Array;const r=await worker.fetch(new Request(base+'/api'+path,{method,headers:{origin:base,'content-type':bytes?'image/jpeg':'application/json','oai-authenticated-user-id':'trust-sites-qa','oai-authenticated-user-email':'trust-sites-qa@example.test'},body:bytes?data:data?JSON.stringify(data):undefined}),runtime.env);if(!r.ok)throw Error(await r.text());return r.json();}
await api('/setup','POST',{});
for(const mode of ['many','row','empty']){
 const fixture=structuredClone(roofingFixture);fixture.slug='trust-sites-'+mode;fixture.settings.name='Ridgeline Roofing · QA';fixture.settings.showOwner=false;fixture.settings.effects={scrollStory:false};
 fixture.settings.trust=structuredClone(trustSitesFixture);if(mode==='row')fixture.settings.trust.networks=fixture.settings.trust.networks.slice(0,3);if(mode==='empty')fixture.settings.trust.networks=[];
 let {tenant}=await api('/tenants','POST',fixture);const path='/tenants/'+tenant.id;
 const logo=await api(path+'/photos','POST',new Uint8Array(readFileSync('tests/fixtures/roofing-demo-logo.jpg')));
 tenant=(await api(path,'PUT',{version:tenant.version,settings:{...tenant.settings,logoId:logo.id}})).tenant;
 await api(path+'/publish','POST',{version:tenant.version,approved:true});
 // A private draft evidence note must never leak to public markup.
 tenant=(await api(path)).tenant;const draft=structuredClone(tenant.settings);draft.trust.networks.push({id:'custom',enabled:false,label:'PRIVATE_DRAFT_TRUST',evidence:{note:'PRIVATE_DRAFT_EVIDENCE'}});await api(path,'PUT',{version:tenant.version,settings:draft});
 console.log(base+'/s/'+fixture.slug);
}
const server=await listen(runtime,port);for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>runtime.close()));
