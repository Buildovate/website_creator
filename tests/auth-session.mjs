import {realReviewPrerequisite} from './helpers/review-approval-fixture.mjs';
import assert from 'node:assert/strict';
import { randomUUID, generateKeyPairSync, sign } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync,readdirSync } from 'node:fs';
import { createRuntime,listen,requestUrl } from '../src/aws/server.js';
import { assertRuntimeConfig } from '../src/aws/env.js';
import { applyAuth,authConfig,resolveUser,clearAuthCache } from '../src/aws/auth.js';
import { createAuthHttp,safeReturnPath,responseHeaders } from '../dist/auth/index.js';
import { createMemoryBucket } from '../src/aws/s3.js';
import { createPgliteExecutor } from '../src/aws/pglite.js';
import { applyMigrations } from '../src/aws/migrate.js';

// Exercise an existing SQLite database upgrade without editing prior migrations.
const sqlite=new DatabaseSync(':memory:');
const migrations=readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort();
for(const name of migrations.filter(n=>!n.startsWith('0005_'))) sqlite.exec(readFileSync('drizzle/'+name,'utf8'));
sqlite.exec("INSERT INTO admins(user_id,email,created_at) VALUES('existing','existing@example.test','2026-09-23')");
sqlite.exec(readFileSync('drizzle/0005_auth_sessions.sql','utf8'));
assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM admins').get().n,1);
assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM auth_sessions').get().n,0);
sqlite.close();

for(const path of ['https://evil.test','//evil.test','/\\evil.test','/login','/auth/logout','/\n/evil']) assert.equal(safeReturnPath(path),'/');
assert.equal(safeReturnPath('/join#invite'),'/join#invite');
assert.equal(requestUrl({url:'/api/session',headers:{host:'localhost:8080','x-forwarded-host':'evil.test','x-forwarded-proto':'https'}}),'http://localhost:8080/api/session');
assert.throws(()=>requestUrl({url:'/',headers:{host:'evil.test'}}));
assert.equal(requestUrl({url:'/',headers:{host:'internal','x-forwarded-host':'evil'}},{APP_ORIGIN:'https://preview.example.test'}),'https://preview.example.test/');
for(const APP_ENV of ['preview','production']) assert.ok(assertRuntimeConfig({APP_ENV,NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_URL:'local'}).some(x=>x.includes('local only')));
assert.ok(assertRuntimeConfig({APP_ENV:'local',NODE_ENV:'production',AUTH_MODE:'dev-header',DATABASE_URL:'local'}).some(x=>x.includes('refused')));
assert.ok(assertRuntimeConfig({APP_ENV:'local',NODE_ENV:'production',AUTH_MODE:'dev-header',AUTH_ALLOW_DEV_HEADERS:'1',DATABASE_URL:'local'}).every(x=>!x.includes('refused')));
assert.ok(assertRuntimeConfig({APP_ENV:'local',AUTH_MODE:'cognito',DATABASE_URL:'local'}).some(x=>x.includes('Cognito')));
assert.ok(assertRuntimeConfig({APP_ENV:'local',AUTH_MODE:'alb-oidc',DATABASE_URL:'local'}).some(x=>x.includes('ALB requires')));
assert.ok(assertRuntimeConfig({APP_ENV:'local',AUTH_MODE:'dev-header',DATABASE_URL:'local',AUTH_SESSION_TTL_SECONDS:'NaN'}).some(x=>x.includes('TTL')));

const securePolicy=responseHeaders(new URL('https://preview.example.test/'),'preview');
assert.equal(securePolicy['strict-transport-security'],'max-age=31536000');
assert.equal(securePolicy['x-frame-options'],'SAMEORIGIN');
assert.match(securePolicy['content-security-policy'],/frame-ancestors 'self'/);
assert.equal(responseHeaders(new URL('https://localhost/'),'local')['strict-transport-security'],undefined);
assert.equal(responseHeaders(new URL('http://localhost/s/public'),'local')['content-security-policy'],undefined);
const executor=await createPgliteExecutor();
const runtime=await createRuntime({executor,env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',PORT:'0'}});
assert.equal((await applyMigrations((sql,args)=>executor.query(sql,args))).applied,0);
const server=await listen(runtime,0), base='http://127.0.0.1:'+server.address().port;
const request=(path,method='GET',body,headers={})=>fetch(base+path,{method,redirect:'manual',headers:{...(body!==undefined?{'content-type':'application/json'}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body)});
const read=async response=>{assert.equal(response.status,200,await response.clone().text());return response.json();};
async function login(id,email=id+'@example.test',oldCookie='') {
  const response=await request('/auth/local-session','POST',{userId:id,email},{origin:base,...(oldCookie?{cookie:oldCookie}:{})});
  await read(response);
  const setCookie=response.headers.get('set-cookie');
  assert.match(setCookie,/HttpOnly/);assert.match(setCookie,/SameSite=Lax/);assert.match(setCookie,/Path=\//);assert.match(setCookie,/Max-Age=3600/);
  assert.doesNotMatch(setCookie,/Domain=|Secure/);
  const cookie=setCookie.split(';')[0];
  const session=await read(await request('/api/session','GET',undefined,{cookie}));
  assert.equal(session.user.id,id);assert.ok(session.csrfToken);assert.ok(session.expiresAt);
  assert.equal(session.logoutUrl,'/auth/logout');
  return {cookie,csrf:session.csrfToken,headers:{cookie,origin:base,'x-csrf-token':session.csrfToken}};
}
try {
  const healthResponse=await request('/healthz');assert.equal(healthResponse.headers.get('x-content-type-options'),'nosniff');assert.equal(healthResponse.headers.get('strict-transport-security'),null);const health=await read(healthResponse);assert.equal(health.database.ok,true);assert.equal(health.authMode,'dev-header');
  assert.equal((await request('/healthz','POST',{})).status,405);
  assert.equal((await request('/')).status,303);
  assert.equal((await request('/preview/missing')).status,303);
  const invite=await request('/join');assert.equal(invite.status,200);assert.match(await invite.text(),/data-return-to="\/join"/);
  assert.equal((await request('/auth/local-session','GET')).status,405);
  assert.equal((await request('/auth/local-session','POST',{userId:'owner',email:'owner@example.test'},{origin:'https://evil.test'})).status,403);
  assert.equal((await request('/auth/local-session','POST',{userId:'owner',email:'bad'},{origin:base})).status,400);
  assert.equal((await request('/auth/local-session','POST',{userId:'owner',email:'x'.repeat(5000)},{origin:base})).status,413);
  assert.equal((await request('/api/session','POST',{})).status,405);
  const spoof={'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'yoelengel18@gmail.com','x-buildovate-user-id':'owner','x-buildovate-user-email':'yoelengel18@gmail.com','x-amzn-oidc-identity':'owner'};
  assert.equal((await read(await request('/api/session','GET',undefined,spoof))).user,null);
  for(const path of ['/api/tenants','/api/workspace/global/contacts','/api/team','/api/control/profile','/api/design-library','/api/pipeline'])
    assert.equal((await request(path,'GET',undefined,spoof)).status,401,path);
  const owner=await login('owner','YoelEngel18@gmail.com');
  const hashRow=await executor.query('SELECT token_hash FROM auth_sessions WHERE user_id=$1',['owner']);
  assert.equal(hashRow.rows[0].token_hash.length,64);
  assert.notEqual(hashRow.rows[0].token_hash,owner.cookie.split('=')[1]);
  assert.equal((await request('/api/setup','POST',{}, {cookie:owner.cookie,origin:base})).status,403);
  assert.equal((await request('/api/setup','POST',{}, {...owner.headers,origin:'https://evil.test','x-forwarded-host':'evil.test','x-forwarded-proto':'https'})).status,403);
  assert.equal((await request('/api/setup','POST',{}, {...owner.headers,'x-csrf-token':'é'.repeat(owner.csrf.length)})).status,403);
  await read(await request('/api/setup','POST',{},owner.headers));
  const adminSession=await read(await request('/api/session','GET',undefined,{cookie:owner.cookie}));
  assert.equal(adminSession.user.admin,true);
  const home=await request('/','GET',undefined,{cookie:owner.cookie});
  assert.match(home.headers.get('cache-control'),/no-store/);assert.equal(home.headers.get('x-frame-options'),'SAMEORIGIN');assert.match(await home.text(),/auth-bridge.js/);
  const unavailable=await request('/preview/missing','GET',undefined,owner.headers);assert.equal(unavailable.status,404);assert.match(unavailable.headers.get('content-type'),/text\/html/);assert.match(await unavailable.text(),/Website unavailable/);
  const first=(await read(await request('/api/tenants','POST',{preset:'robles',slug:'auth-one'},owner.headers))).tenant;
  const second=(await read(await request('/api/tenants','POST',{preset:'robles',slug:'auth-two'},owner.headers))).tenant;
  const editor=await login('editor'), viewer=await login('viewer'), outsider=await login('outsider');
  for(const [u,role] of [['editor','editor'],['viewer','viewer']])
    await executor.query('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES($1,$2,$3,$4,$5,1,$6)',[randomUUID(),first.id,u,u+'@example.test',role,new Date().toISOString()]);
  const memberSession=await read(await request('/api/session','GET',undefined,{cookie:editor.cookie,...spoof}));
  assert.equal(memberSession.user.id,'editor');assert.equal(memberSession.user.admin,false);
  assert.deepEqual(memberSession.memberships,[{tenantId:first.id,role:'editor'}]);
  assert.equal((await request('/api/tenants/'+second.id,'GET',undefined,editor.headers)).status,404);
  assert.equal((await request('/api/tenants/'+first.id,'GET',undefined,outsider.headers)).status,404);
  assert.equal((await request('/api/tenants/'+first.id,'PUT',{settings:first.settings,version:first.version},viewer.headers)).status,403);
  assert.equal((await request('/api/tenants/'+first.id+'/publish','POST',{approved:true,version:first.version},editor.headers)).status,403);
  const rendered=await read(await request('/api/tenants/'+first.id+'/render','POST',{settings:first.settings},editor.headers));assert.ok(rendered.html);
  assert.equal((await request('/s/auth-one')).status,404);
  await realReviewPrerequisite(runtime.env,first.id,'website',base);
  await read(await request('/api/tenants/'+first.id+'/publish','POST',{approved:true,version:first.version},owner.headers));
  const publicPage=await request('/s/auth-one');assert.equal(publicPage.status,200);assert.equal(publicPage.headers.get('x-frame-options'),null);assert.equal(publicPage.headers.get('content-security-policy'),null);
  assert.equal((await request('/s/auth-one?preview=1')).status,303);
  assert.equal((await request('/s/auth-one?preview=1','GET',undefined,outsider.headers)).status,404);
  const inquiry=await request('/api/public/auth-one/inquiries','POST',{name:'Local test',phone:'2025550100',message:'Auth test',consent:true},{origin:base});
  await read(inquiry);
  assert.equal((await request('/api/chat/sms','POST',{})).status,403); // Webhook signature/config gate, not workspace login.
  assert.equal((await request('/api/public/auth-one/not-a-public-route','POST',{})).status,401);
  const photoId=randomUUID();
  await executor.query('INSERT INTO photos(id,tenant_id,object_key,stage,bytes,created_at) VALUES($1,$2,$3,$4,$5,$6)',[photoId,first.id,'private-photo','brand',3,new Date().toISOString()]);
  await runtime.env.BUCKET.put('private-photo',new Uint8Array([1,2,3]));
  assert.equal((await request('/media/'+photoId)).status,303);
  assert.equal((await request('/media/'+photoId,'GET',undefined,editor.headers)).status,200);
  assert.equal((await request('/media/'+photoId,'GET',undefined,outsider.headers)).status,404);
  await executor.query('UPDATE members SET active=0 WHERE user_id=$1',['editor']);
  assert.equal((await request('/api/tenants/'+first.id,'GET',undefined,editor.headers)).status,404);
  assert.deepEqual((await read(await request('/api/session','GET',undefined,editor.headers))).memberships,[]);
  const rotated=await login('viewer','viewer@example.test',viewer.cookie);
  assert.equal((await read(await request('/api/session','GET',undefined,{cookie:viewer.cookie}))).user,null);
  assert.equal((await request('/auth/logout','GET',undefined,rotated.headers)).status,405);
  assert.equal((await request('/auth/logout','POST',{}, {...rotated.headers,'x-csrf-token':'wrong'})).status,403);
  const loggedOut=await request('/auth/logout','POST',{},rotated.headers);await read(loggedOut);
  assert.match(loggedOut.headers.get('set-cookie'),/Max-Age=0/);
  assert.equal((await read(await request('/api/session','GET',undefined,rotated.headers))).user,null);
  await executor.query('UPDATE auth_sessions SET expires_at=$1 WHERE user_id=$2',['2000-01-01T00:00:00.000Z','outsider']);
  assert.equal((await request('/api/tenants','GET',undefined,outsider.headers)).status,401);
  for(const cookie of ['bv_workspace=bad',owner.cookie+'; '+owner.cookie])
    assert.equal((await read(await request('/api/session','GET',undefined,{cookie}))).user,null);
  // A new Node runtime accepts the persisted session without storing role snapshots.
  const secondRuntime=await createRuntime({executor,env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'0'}});
  const secondServer=await listen(secondRuntime,0);
  try {const res=await fetch('http://127.0.0.1:'+secondServer.address().port+'/api/session',{headers:{cookie:owner.cookie}});assert.equal((await res.json()).user.id,'owner');}
  finally {await new Promise(r=>secondServer.close(r));}
  // All credential headers are removed at the Worker boundary.
  const forwarded=await applyAuth(new Request(base,{headers:{...spoof,authorization:'Bearer invalid','oai-authenticated-user-extra':'spoof'}}),runtime.auth,{id:'real',email:'real@example.test'});
  assert.equal(forwarded.headers.get('x-buildovate-user-id'),null);assert.equal(forwarded.headers.get('authorization'),null);
  assert.equal(forwarded.headers.get('oai-authenticated-user-extra'),null);assert.equal(forwarded.headers.get('oai-authenticated-user-id'),'real');
  const disabled=createAuthHttp(runtime.env.DB,{mode:'disabled',appEnv:'preview'},resolveUser);
  assert.equal((await disabled.route(new Request('https://preview.example.test/auth/local-session',{method:'POST'}),{user:null,session:null},'test')).status,404);

  assert.equal((await disabled.context(new Request(base,{headers:{cookie:owner.cookie}}))).user,null);
  let providerIdentity={id:'shared-test',email:'shared@example.test'};
  const shared=createAuthHttp(runtime.env.DB,{mode:'alb-oidc',appEnv:'preview'},async()=>providerIdentity);
  const issued=await shared.store.issue(providerIdentity,'alb-oidc');
  const sharedRequest=new Request('https://preview.example.test/api/session',{headers:{cookie:'bv_workspace='+issued.token}});
  assert.equal((await shared.context(sharedRequest)).session.user_id,'shared-test');
  // Browser login starts only behind the ALB; return paths cannot leave this origin.
  const anonymous={user:null,session:null};
  const legacy=await shared.route(new Request('https://preview.example.test/signin-with-chatgpt?return_to=%2Fjoin%3Fx%3D1'),anonymous,'test');
  assert.equal(legacy.status,303); assert.equal(legacy.headers.get('location'),'/login?returnTo=%2Fjoin%3Fx%3D1');
  const badReturn=await shared.route(new Request('https://preview.example.test/signin-with-chatgpt?return_to=https%3A%2F%2Fevil.test'),anonymous,'test');
  assert.equal(badReturn.headers.get('location'),'/login?returnTo=%2F');
  const providerPage=await shared.route(new Request('https://preview.example.test/login?returnTo=%2Fjoin'),anonymous,'test');
  assert.match(await providerPage.text(),/href="\/auth\/start\?returnTo=%2Fjoin"/);
  await assert.rejects(()=>shared.route(new Request('https://preview.example.test/auth/start'),anonymous,'test'),e=>e.status===503);
  const providerContext=await shared.context(sharedRequest);
  const completed=await shared.route(new Request('https://preview.example.test/auth/start?returnTo=%2Fjoin'),providerContext,'test');
  assert.equal(completed.headers.get('location'),'/join');
  const signedOutPage=await shared.route(new Request('https://preview.example.test/login?signedOut=1'),providerContext,'test');
  assert.equal(signedOutPage.status,200); assert.match(await signedOutPage.text(),/signed out/);
  const logoutAuth=createAuthHttp(runtime.env.DB,{mode:'alb-oidc',appEnv:'preview',albCookieName:'bv_staging_auth',logoutUrl:'https://idp.example.test/logout'},async()=>providerIdentity);
  const logoutRequest=new Request('https://preview.example.test/auth/logout',{method:'POST',headers:{origin:'https://preview.example.test',cookie:'bv_workspace='+issued.token,'x-csrf-token':issued.session.csrf_token}});
  const providerLogout=await logoutAuth.route(logoutRequest,providerContext,'test');
  const cleared=providerLogout.headers.getSetCookie(); assert.equal(cleared.length,6);
  for(const name of ['bv_workspace','bv_staging_auth','bv_staging_auth-0','bv_staging_auth-1','bv_staging_auth-2','bv_staging_auth-3']) {
    assert.ok(cleared.some(c=>c.startsWith(name+'=;')&&c.includes('Max-Age=0')&&c.includes('Secure')));
  }
  assert.equal((await providerLogout.json()).logoutUrl,'https://idp.example.test/logout');
  assert.equal(await shared.store.get(issued.token,'alb-oidc'),null);
  providerIdentity=null;
  assert.equal((await shared.context(sharedRequest)).user,null);
  providerIdentity={id:'different-user',email:'different@example.test'};
  assert.equal((await shared.context(sharedRequest)).session,null);
  const httpsAuth=createAuthHttp(runtime.env.DB,{...runtime.auth},resolveUser);
  const secureResponse=await httpsAuth.route(new Request('https://localhost/auth/local-session',{method:'POST',headers:{origin:'https://localhost','content-type':'application/json'},body:JSON.stringify({email:'secure@example.test',userId:'secure'})}),{user:null,session:null},'secure');
  assert.match(secureResponse.headers.get('set-cookie'),/; Secure/);
  // Login limiter does not touch domain mutations and is keyed to socket address.
  const limited=createAuthHttp(runtime.env.DB,runtime.auth,resolveUser);
  for(let i=0;i<20;i++) await assert.rejects(()=>limited.route(new Request(base+'/auth/local-session',{method:'POST',headers:{origin:base,'content-type':'application/json'},body:'{}'}),{user:null,session:null},'limited'),e=>e.status===400);
  await assert.rejects(()=>limited.route(new Request(base+'/auth/local-session',{method:'POST',headers:{origin:base,'content-type':'application/json'},body:'{}'}),{user:null,session:null},'limited'),e=>e.status===429);
} finally { await new Promise(r=>server.close(r));await runtime.close(); }

// Provider tokens use real signatures with mocked key discovery only.
const b64=v=>Buffer.from(JSON.stringify(v)).toString('base64url');
const jwt=(key,header,payload)=>{const data=b64(header)+'.'+b64(payload);return data+'.'+sign(header.alg==='ES256'?'sha256':'RSA-SHA256',Buffer.from(data),header.alg==='ES256'?{key,dsaEncoding:'ieee-p1363'}:key).toString('base64url');};
const ec=generateKeyPairSync('ec',{namedCurve:'prime256v1'}),pem=ec.publicKey.export({type:'spki',format:'pem'});
const albConfig=authConfig({APP_ENV:'preview',AUTH_MODE:'alb-oidc',AUTH_ALB_SIGNER:'expected-signer',AUTH_OIDC_ISSUER:'https://issuer.example.test',AUTH_OIDC_CLIENT_ID:'expected-client'});
albConfig.fetch=async()=>new Response(pem);
const header={alg:'ES256',kid:'one',signer:'expected-signer',iss:'https://issuer.example.test',client:'expected-client',exp:Math.floor(Date.now()/1000)+600};
const payload={sub:'provider-user',email:'user@example.test',email_verified:true};
const userFor=(h,p=payload)=>resolveUser(new Headers({'x-amzn-oidc-data':jwt(ec.privateKey,h,p)}),albConfig);
assert.equal((await userFor(header)).id,'provider-user');
for(const delta of [{signer:'wrong'},{client:'wrong'},{iss:'https://wrong.test'},{exp:1},{exp:'NaN'},{alg:'none'}]) assert.equal(await userFor({...header,...delta}),null);
assert.equal(await userFor(header,{...payload,email_verified:false}),null);
const badProvider={...albConfig,fetch:async()=>{throw new Error('unavailable');}};clearAuthCache();
assert.equal(await resolveUser(new Headers({'x-amzn-oidc-data':jwt(ec.privateKey,header,payload)}),badProvider),null);

const rsa=generateKeyPairSync('rsa',{modulusLength:2048});
const jwk={...rsa.publicKey.export({format:'jwk'}),kid:'old',alg:'RS256',use:'sig'};
let keys=[jwk],calls=0;
const cognito=authConfig({APP_ENV:'preview',AUTH_MODE:'cognito',COGNITO_USER_POOL_ID:'us-west-1_example',COGNITO_CLIENT_ID:'client'});
cognito.fetch=async()=>{calls++;return Response.json({keys});};
const cogClaims={...payload,token_use:'id',aud:'client',iss:'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_example',exp:Math.floor(Date.now()/1000)+600};
const cog=(changes={},kid='old')=>resolveUser(new Headers({authorization:'Bearer '+jwt(rsa.privateKey,{alg:'RS256',kid},{...cogClaims,...changes})}),cognito);
assert.equal((await cog()).id,'provider-user');
for(const changes of [{aud:'wrong'},{token_use:'access'},{iss:'https://wrong.test'},{email_verified:false},{exp:1}]) assert.equal(await cog(changes),null);
keys=[{...jwk,kid:'rotated'}];assert.equal((await cog({},'rotated')).id,'provider-user');assert.ok(calls>=2);
assert.equal(await resolveUser(new Headers({'x-buildovate-user-id':'spoof','x-buildovate-user-email':'user@example.test'}),authConfig({APP_ENV:'preview',AUTH_MODE:'dev-header',NODE_ENV:'development'})),null);
console.log('PASS: session lifecycle, migration, cookies, spoofing, CSRF, roles, isolation, public/draft/media routes, restart, provider binding and rotation.');
