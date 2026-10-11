import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRuntime} from 'file:///C:/Users/joe/website_creator/src/aws/server.js';
import worker from 'file:///C:/Users/joe/website_creator/dist/server/index.js';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028A',base='https://test.local',appBase='http://127.0.0.1:8172';
process.chdir(root);
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'lock@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8172',APP_ORIGIN:appBase}});
const headers={origin:appBase,'content-type':'application/json','oai-authenticated-user-id':'lock-admin','oai-authenticated-user-email':'lock@example.test'};
let response=await worker.fetch(new Request(appBase+'/api/setup',{method:'POST',headers,body:'{}'}),runtime.env);if(!response.ok)throw Error(await response.text());
const rows=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/outside-scope-baseline.json'));
for(const {row}of rows){const keys=Object.keys(row);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run()}
const saved=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/027A-part2/after-responses.json')),results=[];
for(const row of saved){const r=await worker.fetch(new Request(base+row.url,{headers}),runtime.env),body=await r.text(),hash=createHash('sha256').update(body).digest('hex');if(row.url==='/s/ambient-baseline-roofing/services')fs.writeFileSync(out+'/response-current-example.html',body);results.push({kit:row.kit,url:row.url,status:r.status,expectedStatus:row.status,sha256:hash,expectedSha256:row.sha256,identical:r.status===row.status&&hash===row.sha256})}
fs.writeFileSync(out+'/outside-scope-responses.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({total:results.length,identical:results.filter(x=>x.identical).length,changed:results.filter(x=>!x.identical).slice(0,15)}));
await runtime.close();
