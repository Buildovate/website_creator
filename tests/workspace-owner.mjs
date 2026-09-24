import assert from 'node:assert/strict';
import {createRuntime,listen} from '../src/aws/server.js';
import {createPgliteExecutor} from '../src/aws/pglite.js';
const executor=await createPgliteExecutor();
const runtime=await createRuntime({executor,env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'joe@buildovate.com',PORT:'0'}});
const server=await listen(runtime,0),base='http://127.0.0.1:'+server.address().port;
async function login(id,email){const r=await fetch(base+'/auth/local-session',{method:'POST',headers:{origin:base,'content-type':'application/json'},body:JSON.stringify({userId:id,email})});assert.equal(r.status,200);const cookie=r.headers.get('set-cookie').split(';')[0];const s=await(await fetch(base+'/api/session',{headers:{cookie}})).json();return {s,headers:{cookie,origin:base,'content-type':'application/json','x-csrf-token':s.csrfToken}};}
const setup=u=>fetch(base+'/api/setup',{method:'POST',headers:u.headers,body:'{}'});
try {
 const old=await login('legacy','yoelengel18@gmail.com');assert.equal(old.s.user.owner,false);assert.equal((await setup(old)).status,403);
 const joe=await login('cognito-joe','joe@buildovate.com');assert.equal(joe.s.user.owner,true);assert.equal(joe.s.user.admin,false);assert.equal((await setup(joe)).status,200);
 const session=await(await fetch(base+'/api/session',{headers:joe.headers})).json();assert.equal(session.initialized,true);assert.equal(session.user.admin,true);assert.equal(session.user.owner,true);
 assert.equal((await fetch(base+'/api/team',{headers:joe.headers})).status,200);
 assert.equal((await fetch(base+'/api/team',{headers:old.headers})).status,403);
 const other=await login('other','other@example.test');assert.equal((await setup(other)).status,403);
 console.log('PASS: configured owner initialization, admin access, team owner authorization, old-owner and unrelated-user rejection');
} finally {await new Promise(r=>server.close(r));await runtime.close();}
