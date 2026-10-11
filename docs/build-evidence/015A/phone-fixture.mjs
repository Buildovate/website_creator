// Run only after explicit approval for the secured, temporary phone check.
if(!process.argv.includes('--allow-phone'))throw Error('Phone networking requires explicit approval and --allow-phone.');
import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRuntime,listen} from '../../../src/aws/server.js';
import worker from '../../../dist/server/index.js';
import {roofingFixture} from '../../../tests/fixtures/roofing-journey.mjs';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const phase='device',out='C:/Users/joe/website_creator/docs/build-evidence/015A',base='http://127.0.0.1:8128';
fs.mkdirSync(out+'/'+phase,{recursive:true});
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'mobile-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8128',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'mobile-admin','oai-authenticated-user-email':'mobile-admin@example.test'};
async function api(path,method='GET',value){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json()}
await api('/setup','POST',{});const fixture=structuredClone(roofingFixture);fixture.slug='mobile-platform-qa';fixture.settings.name='Fictional Roofing Mobile QA';fixture.settings.owner='Fictional Owner';
let {tenant}=await api('/tenants','POST',fixture);await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
await runtime.env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind(crypto.randomUUID(),tenant.id,'mobile-owner','mobile-owner@example.test','owner',new Date().toISOString()).run();

// Fixed fictional owner, in-memory database and storage; no production credentials.
const server=await listen(runtime,8128);
const login=await fetch(base+'/auth/local-session',{method:'POST',headers:{origin:base,'content-type':'application/json'},body:JSON.stringify({userId:'mobile-owner',email:'mobile-owner@example.test'})});
const session=login.headers.get('set-cookie').split(';')[0];
const {createServer}=await import('node:http'),{randomBytes,timingSafeEqual}=await import('node:crypto');
const token=randomBytes(32).toString('hex'),phoneOrigin='http://192.168.68.66:8127',expires=Date.now()+20*60*1000,events=[];let pairedAddress='';
const equal=(a,b)=>a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const proxy=createServer(async(req,res)=>{try{
 res.setHeader('cache-control','no-store');
 if(Date.now()>expires){res.writeHead(410);res.end('Phone check expired.');return;}
 if(req.url==='/pair/'+token&&!pairedAddress){pairedAddress=req.socket.remoteAddress;res.setHeader('set-cookie','phone_qa='+token+'; HttpOnly; SameSite=Strict; Path=/; Max-Age=1200');res.writeHead(303,{location:'/'});res.end();return;}
 const supplied=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('phone_qa='))?.slice(9)||'';
 if(!equal(supplied,token)||req.socket.remoteAddress!==pairedAddress){res.writeHead(403);res.end('Pair this phone from the local setup page.');return;}
 if(req.url.startsWith('/auth/')||req.url.startsWith('/api/setup')){res.writeHead(403);res.end();return;}
 if(!['GET','HEAD'].includes(req.method)&&req.headers.origin!==phoneOrigin){res.writeHead(403);res.end();return;}
 const chunks=[];let bytes=0;for await(const c of req){bytes+=c.length;if(bytes>3*1024*1024){res.writeHead(413);res.end();return;}chunks.push(c)}
 const upstream=await fetch(base+req.url,{method:req.method,headers:{'content-type':req.headers['content-type']||'application/octet-stream',origin:base,cookie:session},body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks),redirect:'manual'});
 if(req.url.startsWith('/api/')&&req.method!=='GET'){events.push({time:new Date().toISOString(),path:req.url,method:req.method,status:upstream.status,bytes,userAgent:req.headers['user-agent']});fs.writeFileSync(out+'/device/http-events.json',JSON.stringify(events,null,2));}
 res.statusCode=upstream.status;for(const[k,v]of upstream.headers)if(!['content-length','content-encoding','transfer-encoding','set-cookie'].includes(k))res.setHeader(k,v);res.end(Buffer.from(await upstream.arrayBuffer()));
}catch{res.statusCode=500;res.end('Local fixture request failed.');}});
// Pairing URL stays in a loopback-only setup page, never in committed files/logs.
const setup=createServer((req,res)=>{res.setHeader('cache-control','no-store');res.setHeader('content-type','text/html');res.end('<!doctype html><title>iPhone QA pairing</title><h1>Temporary iPhone test</h1><p>Same Wi-Fi only. Expires in 20 minutes. Only the first paired device can connect.</p><p>Open this address in iPhone Safari:</p><p>'+phoneOrigin+'/pair/'+token+'</p><p>Use Website screen → Business → Upload brand image → Take a photo. Use a harmless object, without people or private details. Check cancel/retry, preview, upload, and saved image. Also focus a field to check that the bottom action remains reachable above the keyboard.</p>');});
await new Promise(r=>setup.listen(8129,'127.0.0.1',r));await new Promise(r=>proxy.listen(8127,'192.168.68.66',r));
console.log('Secured phone fixture ready. Pairing instructions: http://127.0.0.1:8129 (local computer only). Expires after 20 minutes.');
async function shutdown(){proxy.close();setup.close();server.close();await runtime.close();process.exit()}
setTimeout(shutdown,20*60*1000);process.on('SIGINT',shutdown);
