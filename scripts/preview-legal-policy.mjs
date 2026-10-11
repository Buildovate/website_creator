// Local-only fictional policy fixtures. No legal approval, provider keys or external requests.
import {writeFileSync} from 'node:fs';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from '../tests/fixtures/roofing-journey.mjs';
import {legalFixture} from '../tests/fixtures/legal-policy.mjs';
const port=8105,base='http://127.0.0.1:'+port;
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'legal-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:base}});
async function request(path,method='GET',data){return worker.fetch(new Request(base+'/api'+path,{method,headers:{origin:base,'content-type':'application/json','oai-authenticated-user-id':'legal-qa','oai-authenticated-user-email':'legal-qa@example.test'},body:data?JSON.stringify(data):undefined}),runtime.env);}
async function api(path,method='GET',data){const r=await request(path,method,data);if(!r.ok)throw Error(await r.text());return r.json();}
await api('/setup','POST',{});const manifest={};
for(const mode of ['none','missing','reviewed']){
 const f=structuredClone(roofingFixture);f.slug='legal-'+mode;f.settings.name='Ridgeline · Policy QA';f.settings.platform={...f.settings.platform,legal:mode==='none'?{}:structuredClone(legalFixture),footer:{bonded:true,insured:true}};f.settings.license=mode==='reviewed'?'QA-LICENSE-001':'';
 let {tenant}=await api('/tenants','POST',f);const response=await request('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});const publication={status:response.status,body:await response.json()};tenant=(await api('/tenants/'+tenant.id)).tenant;manifest[mode]={tenant,publication};console.log(mode+': publication '+publication.status);
}
writeFileSync('docs/build-evidence/011/local-fixture.json',JSON.stringify(manifest,null,2));
const server=await listen(runtime,port);for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>runtime.close()));console.log('Local policy fixtures: '+base);
