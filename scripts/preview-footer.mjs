// Local-only fictional footer fixtures; no provider connections or external sends.
import {writeFileSync} from 'node:fs';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {footerFixture} from '../tests/fixtures/footer.mjs';
const port=8106,base='http://127.0.0.1:'+port;
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'footer-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:base}});
async function api(path,method='GET',data){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers:{origin:base,'content-type':'application/json','oai-authenticated-user-id':'footer-qa','oai-authenticated-user-email':'footer-qa@example.test'},body:data?JSON.stringify(data):undefined}),runtime.env);if(!r.ok)throw Error(await r.text());return r.json();}
await api('/setup','POST',{});const manifest={};
for(const mode of ['single','hidden','required','multiple']){
 let {tenant}=await api('/tenants','POST',footerFixture(mode));await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});manifest[mode]={url:base+'/s/'+tenant.slug,policy:mode==='required'||mode==='multiple'?'Fictional QA policy; not approved legal language':'Missing policy: Needs review'};
}
writeFileSync('docs/build-evidence/012/local-fixture.json',JSON.stringify(manifest,null,2));
const server=await listen(runtime,port);for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>runtime.close()));console.log('Local footer fixtures: '+base);
