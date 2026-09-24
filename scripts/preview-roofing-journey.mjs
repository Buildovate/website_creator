// Disposable loopback-only Roofing fixture for ticket #002. No .env is loaded.
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from '../tests/fixtures/roofing-journey.mjs';
const port=8096,base='http://127.0.0.1:'+port;
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'roofing-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:String(port),APP_ORIGIN:base}});
async function api(path,method='GET',data){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers:{origin:base,'content-type':'application/json','oai-authenticated-user-id':'roofing-qa','oai-authenticated-user-email':'roofing-qa@example.test'},body:data?JSON.stringify(data):undefined}),runtime.env);if(!r.ok)throw Error(await r.text());return r.json()}
await api('/setup','POST',{});
const {tenant}=await api('/tenants','POST',roofingFixture);
await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
const server=await listen(runtime,port);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>runtime.close()));
console.log('Ticket #002 local-only fixture: '+base+'/s/'+roofingFixture.slug+' (memory database; no external delivery).');
