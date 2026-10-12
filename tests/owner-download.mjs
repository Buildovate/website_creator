import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import fs from 'node:fs';
import {openGameSection} from './helpers/game-navigation.mjs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const root=releaseRepoRoot,out=root+'/docs/build-evidence/OWNER-DOWNLOAD',require=createRequire(import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const result={ticket:'OWNER-DOWNLOAD',startedAt:new Date().toISOString(),checks:[],screenshots:[],qaGateClear:false,original70RejectedOpen:true,providerCalls:0,failures:[]};
const flush=()=>fs.writeFileSync(out+'/results.json',JSON.stringify(result,null,2)+'\n');
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
 const built=await esbuild.build({absWorkingDir:root,stdin:{contents:"export {default as worker} from './src/worker.js';export {DEFAULT,settings} from './src/core.js';",resolveDir:root},bundle:true,write:false,format:'esm',platform:'neutral',conditions:['workerd','worker'],mainFields:['module','main'],loader:{'.html':'text','.pdf':'binary'},external:['cloudflare:workers','node:*']});
 const {worker,DEFAULT,settings}=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].contents).toString('base64'));
 const client=await esbuild.build({absWorkingDir:root,entryPoints:['src/client/workspace/index.ts'],bundle:true,write:false,format:'iife',platform:'browser'});
 const types={'.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4','.ico':'image/x-icon','.pdf':'application/pdf'};
 const ASSETS={async fetch(req){const pathname=new URL(req.url).pathname;if(pathname==='/app.js')return new Response(client.outputFiles[0].contents,{headers:{'content-type':'application/javascript'}});for(const dir of ['dist/client','public']){const file=path.resolve(root+'/'+dir,'.'+decodeURIComponent(pathname));if(file.startsWith(path.resolve(root+'/'+dir)+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())return new Response(fs.readFileSync(file),{headers:{'content-type':types[path.extname(file)]||'application/octet-stream'}})}return new Response('Not found',{status:404})}};
 const image=fs.readFileSync(root+'/public/assets/roofing.webp');
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
 check((await req('monthly','/download')).status===403,'monthly rental forbidden even with owner membership and forged draft flags');
 check((await req('annual','/download')).status===403,'annual rental forbidden during prepaid term');
 check((await req('owned','/download',null)).status===401,'anonymous download forbidden');
 check((await req('owned','/download',{id:'outsider',email:'outsider@example.test'})).status===404,'cross-tenant download forbidden');
 check((await req('unpublished','/download')).status===409,'unpublished owned site requires publication');
 const unavailable=await req('unpublished');const state=await unavailable.json();check(state.siteDownload.owned&&!state.siteDownload.published,'unpublished owner has server-confirmed disabled state');
 const zip=await req('owned','/download');check(zip.status===200,'one-time owner gets published static ZIP');check(zip.headers.get('content-type')==='application/zip'&&zip.headers.get('content-disposition').includes('download-owned.zip'),'ZIP download headers');
 const bytes=Buffer.from(await zip.arrayBuffer());fs.writeFileSync(out+'/published-fixture.zip',bytes);const entries=new Map();let at=0;while(bytes.readUInt32LE(at)===0x04034b50){const size=bytes.readUInt32LE(at+18),nameLength=bytes.readUInt16LE(at+26),extra=bytes.readUInt16LE(at+28),name=bytes.subarray(at+30,at+30+nameLength).toString(),start=at+30+nameLength+extra;entries.set(name,bytes.subarray(start,start+size));at=start+size;}check(bytes.readUInt32LE(at)===0x02014b50&&bytes.readUInt32LE(bytes.length-22)===0x06054b50,'ZIP local entries, central directory and end record present');
 for(const page of ['index.html','services/index.html','services/roof-repair/index.html','areas/index.html','areas/ventura/index.html','about/index.html','faq/index.html','contact/index.html','thank-you/index.html','legal/index.html'])check(entries.has(page),'published page included '+page);
 check([...entries.keys()].some(p=>p.endsWith('.css'))&&[...entries.keys()].some(p=>p.endsWith('.js')),'local CSS and browser JS included');check(entries.has('media/public-photo')&&entries.get('media/public-photo').equals(image),'published owner photo included byte-for-byte');check(!entries.has('media/private-photo'),'unpublished/private photo excluded');
 check(![...entries.values()].some(b=>b.includes('PRIVATE_DRAFT_SECRET')||b.includes('PRIVATE_MEDIA_SECRET')),'draft and private-media sentinels absent');
 check([...entries.keys()].every(p=>!/(?:^|\/)(?:\.env|src|server|tests|node_modules|credentials)(?:\.|\/|$)/i.test(p)),'no environment, credentials, server source, tests or dependencies');check(![...entries.keys()].some(p=>/api\.js|worker\.js|package(?:-lock)?\.json/.test(p)),'no Worker/API/package server files');
 check(!entries.get('index.html').includes('/s/download-owned/'),'exported page links use portable root paths');
 result.zip={bytes:bytes.length,sha256:hash(bytes),entries:[...entries].map(([name,data])=>({name,bytes:data.length,sha256:hash(data)})),publishedPages:[...entries.keys()].filter(n=>n.endsWith('.html')),secretChecks:['forbidden names','draft sentinel','private-media sentinel','no source/package files'],localArtifact:'published-fixture.zip (not staged)'};
 const bought=await req('buyout','/download');check(bought.status===200,'completed flat buyout gets ZIP');await bought.arrayBuffer();
 sql.prepare("UPDATE workspace_records SET data='{}' WHERE id='site-ownership-monthly'").run();check(!(await (await req('monthly')).json()).siteDownload.owned,'missing/malformed entitlement fails closed');
 const {chromium}=require('playwright');browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE,args:['--disable-gpu','--force-color-profile=srgb']});
 for(const [id,label]of [['owned','owner-published'],['unpublished','owner-unpublished'],['monthly','renter']])for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});
  await page.route('**/*',async route=>{const request=route.request(),url=new URL(request.url());if(url.origin!==origin)return route.abort();const response=await worker.fetch(new Request(request.url(),{method:request.method(),headers:{...request.headers(),'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email},...(request.method()!=='GET'?{body:request.postDataBuffer()}: {})}),env);return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});});
  await page.goto(origin,{waitUntil:'networkidle',timeout:30000});await page.locator('[data-action=open][data-id="'+id+'"]').click();await page.waitForFunction(()=>document.querySelector('.page-heading h1')?.textContent==='Sample Fictional Zip Roofing',null,{timeout:15000});await page.evaluate(()=>document.fonts.ready);await openGameSection(page,'business');
  const button=page.locator('[data-action=download-site]');if(id==='monthly')check(await button.count()===0,label+' hides download at '+width);else{check(await button.isVisible(),label+' shows download at '+width);check(await button.isDisabled()===(id==='unpublished'),label+' enabled state at '+width);check(await button.textContent()===(id==='unpublished'?'Publish first':'Download site'),label+' button label at '+width);}
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' fits '+width);
  const file='screenshots/'+label+'-'+width+'.png';await page.screenshot({path:out+'/'+file,animations:'disabled',timeout:15000});result.screenshots.push({state:label,width,path:file,sha256:hash(fs.readFileSync(out+'/'+file))});flush();
  if(id==='owned'&&width===1440){const pending=page.waitForEvent('download',{timeout:30000});await button.click();const download=await pending;check(download.suggestedFilename()==='download-owned.zip','browser download filename');check(await download.failure()===null,'browser owner download completes');}
  await page.close();
 }
 const protectedChanged=Object.entries(protectedBefore).filter(([p,sha])=>hash(fs.readFileSync(root+'/'+p))!==sha).map(([p])=>p);check(!protectedChanged.length,'protected file bytes unchanged');result.protected={files:protectedPaths.length,changed:protectedChanged,diff:git('diff','--','public','src/qa-gate.js','src/qa-page-action.js','src/qa-video.js','src/aws/qa-browser.js','src/aws/qa-capture.js','tests/automatic-qa-*.mjs','docs/build-evidence/027A-part2','docs/build-evidence/028F/source-locks')};check(result.protected.diff==='','protected git diff empty');
 const changed=held.files.filter(p=>hash(fs.readFileSync(root+'/'+p.path))!==p.sha256);check(!changed.length&&held.files.length===228,'held work 228/228 unchanged including BUILD-BACKLOG');result.held={matches:228,total:228,backlogSha256:hash(fs.readFileSync(root+'/BUILD-BACKLOG.md'))};check(result.providerCalls===0,'zero provider calls');result.status='PASS';result.count=result.checks.length;result.completedAt=new Date().toISOString();flush();console.log('PASS OWNER-DOWNLOAD '+result.count+' checks');
}catch(error){result.status='FAIL';result.failures.push({message:error.message,stack:error.stack});result.count=result.checks.length;flush();console.error(error.stack);process.exitCode=1;}finally{if(browser)await browser.close();sql.close();globalThis.fetch=oldFetch;}
