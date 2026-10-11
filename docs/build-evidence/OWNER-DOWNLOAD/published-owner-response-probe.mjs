import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/OWNER-DOWNLOAD',require=createRequire(import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const result={ticket:'OWNER-DOWNLOAD',startedAt:new Date().toISOString(),checks:[],screenshots:[],qaGateClear:false,original70RejectedOpen:true,providerCalls:0,failures:[]};
const flush=()=>{};
const check=(value,label)=>{assert.ok(value,label);result.checks.push(label);console.log('PASS '+label);flush()};
const git=(...args)=>execFileSync('git',['-c','safe.directory='+root,'-C',root,...args],{encoding:'utf8'}).trim();
const protectedPaths=git('ls-files','--','public','src/qa-gate.js','src/qa-page-action.js','src/qa-video.js','src/aws/qa-browser.js','src/aws/qa-capture.js','tests/automatic-qa-*.mjs','docs/build-evidence/027A-part2','docs/build-evidence/028F/source-locks').split('\n').filter(Boolean);
const protectedBefore=Object.fromEntries(protectedPaths.map(p=>[p,hash(fs.readFileSync(root+'/'+p))]));
const held=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/MERGE-1/round2/preservation-before.json'));
const sql=new DatabaseSync(':memory:');for(const file of fs.readdirSync(root+'/drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(fs.readFileSync(root+'/drizzle/'+file,'utf8'));
const DB={prepare(query){let args=[];const s={bind(...values){args=values;return s},async first(){return sql.prepare(query).get(...args)||null},async all(){return {results:sql.prepare(query).all(...args)}},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}}}};return s},async batch(list){return Promise.all(list.map(s=>s.run()))}};
let browser;const oldFetch=globalThis.fetch;globalThis.fetch=async()=>{result.providerCalls++;throw Error('Provider call forbidden')};
try{
 const esbuild=require(root+'/node_modules/esbuild');
 const built=await esbuild.build({absWorkingDir:root,stdin:{contents:"export {default as worker} from './src/worker.js';export {DEFAULT,settings} from './src/core.js';",resolveDir:root},bundle:true,write:false,format:'esm',platform:'browser',loader:{'.html':'text','.pdf':'binary'},external:['cloudflare:workers']});
 const {worker,DEFAULT,settings}=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].contents).toString('base64'));
 const client=await esbuild.build({absWorkingDir:root,entryPoints:['src/client/workspace/index.ts'],bundle:true,write:false,format:'iife',platform:'browser'});
 const types={'.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4','.ico':'image/x-icon','.pdf':'application/pdf'};
 const ASSETS={async fetch(req){const pathname=new URL(req.url).pathname;if(pathname==='/app.js')return new Response(client.outputFiles[0].contents,{headers:{'content-type':'application/javascript'}});for(const dir of ['dist/client','public']){const file=path.resolve(root+'/'+dir,'.'+decodeURIComponent(pathname));if(file.startsWith(path.resolve(root+'/'+dir)+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())return new Response(fs.readFileSync(file),{headers:{'content-type':types[path.extname(file)]||'application/octet-stream'}})}return new Response('Not found',{status:404})}};
 const image=fs.readFileSync(root+'/public/assets/roofing.jpg');
 const env={DB,ASSETS,REVIEW_ISOLATED:true,BUCKET:{async get(key){return {body:key==='public-image'?image:Buffer.from('PRIVATE_MEDIA_SECRET')}},async head(){return null}}};
 const time='2026-10-08T00:00:00Z',user={id:'download-owner',email:'owner@example.test'};
 sql.prepare('INSERT INTO admins(user_id,email,role,created_at) VALUES(?,?,?,?)').run('bootstrap-admin','admin@example.test','admin',time);
 const published=settings({...DEFAULT,name:'Sample Fictional Zip Roofing',phone:'8054410199',area:'Ventura',template:'craft',services:[{name:'Roof Repair',description:'Find and repair roof damage.'}],showOwner:false,showProjects:false,effects:{...DEFAULT.effects,scrollStory:false},logoId:'public-photo'});
 for(const [id,mode,pub]of [['owned','one_time_purchase',true],['buyout','buyout',true],['unpublished','one_time_purchase',false],['monthly','monthly',true],['annual','annual',true]]){
  const draft={...published,hero:'PRIVATE_DRAFT_SECRET',siteOwnership:{state:'owned'},ownsSite:true};
  sql.prepare('INSERT INTO tenants(id,slug,name,settings,published,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,1,?,?)').run(id,'download-'+id,published.name,JSON.stringify(draft),pub?JSON.stringify(published):null,pub?'published':'draft',time,time);
  sql.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').run('member-'+id,id,user.id,user.email,'owner',time);
  const record={schemaVersion:1,state:['monthly','annual'].includes(mode)?'rental':'owned',source:mode,paymentStatus:'paid',currency:'USD',amountCents:150000,paymentReference:'local-fixture-only',prepaidUntil:'2030-01-01'};
  sql.prepare('INSERT INTO workspace_records(id,scope,kind,data,version,created_at,updated_at) VALUES(?,?,?,?,1,?,?)').run('site-ownership-'+id,id,'site_ownership',JSON.stringify(record),time,time);
 }
 for(const [id,key]of [['public-photo','public-image'],['private-photo','private-image']])sql.prepare('INSERT INTO photos(id,tenant_id,object_key,caption,stage,bytes,created_at) VALUES(?,?,?,?,?,?,?)').run(id,'owned',key,'Fixture image','other',image.length,time);
 // Other published fixture pages do not borrow the owned fixture's photo.
 for(const id of ['buyout','unpublished','monthly','annual']){const row=sql.prepare('SELECT * FROM tenants WHERE id=?').get(id),draft=JSON.parse(row.settings);delete draft.logoId;const pub=row.published?JSON.parse(row.published):null;if(pub)delete pub.logoId;sql.prepare('UPDATE tenants SET settings=?,published=? WHERE id=?').run(JSON.stringify(draft),pub?JSON.stringify(pub):null,id);}
 const origin='http://owner-download.test',req=(id,tail='',who=user)=>worker.fetch(new Request(origin+'/api/tenants/'+id+tail,{headers:who?{'oai-authenticated-user-id':who.id,'oai-authenticated-user-email':who.email}: {}}),env);
 const response=await req('owned','/download');
 const bytes=Buffer.from(await response.arrayBuffer());
 const diagnosis={case:'published-owner ZIP',capturedAt:new Date().toISOString(),status:response.status,contentType:response.headers.get('content-type'),body:response.headers.get('content-type')?.includes('application/zip')?null:bytes.toString('utf8'),bytes:bytes.length,providerCalls:result.providerCalls};
 const existing=JSON.parse(fs.readFileSync(out+'/results.json','utf8'));existing.responseDiagnosis=diagnosis;fs.writeFileSync(out+'/results.json',JSON.stringify(existing,null,2)+'\n');console.log(JSON.stringify(diagnosis));
}catch(error){console.error(error.stack);process.exitCode=1;}finally{sql.close();globalThis.fetch=oldFetch;}
