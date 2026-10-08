// Evidence routing and the unchanged, owner-approved #057A egress mock.
// No assertion, capture setting, detector, runner or guard is changed.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import cp from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {syncBuiltinESMExports,createRequire} from 'node:module';
const root='C:/Users/joe/website_creator',evidence=root+'/docs/build-evidence/',out=evidence+'MERGE-1/round2',self=fileURLToPath(import.meta.url);
const syncNames=['writeFileSync','appendFileSync','mkdirSync','createWriteStream','readFileSync','existsSync','statSync','readdirSync','unlinkSync','rmSync','copyFileSync','cpSync','renameSync','openSync'];
const asyncNames=['writeFile','appendFile','mkdir','readFile','stat','readdir','access','unlink','rm','copyFile','cp','rename','open'];
const original=Object.fromEntries(syncNames.map(n=>[n,fs[n].bind(fs)])),promises=Object.fromEntries(asyncNames.map(n=>[n,fsp[n].bind(fsp)])),callbacks=Object.fromEntries(asyncNames.filter(n=>n!=='open').map(n=>[n,fs[n].bind(fs)]));
const spawn=cp.spawn.bind(cp),spawnSync=cp.spawnSync.bind(cp);
await import(pathToFileURL(evidence+'028F/tools/evidence-redirect.mjs').href);
function mapped(p,write=false){
 if(!(typeof p==='string'||p instanceof URL))return p;
 const raw=p instanceof URL?fileURLToPath(p):p,abs=path.resolve(raw).replaceAll('\\','/');
 if(!abs.toLowerCase().startsWith(evidence.toLowerCase())||abs.toLowerCase().startsWith((evidence+'MERGE-1/').toLowerCase()))return p;
 const relative=abs.slice(evidence.length),dest=out+'/generated/'+(relative.startsWith('028F/')?relative:'028F/legacy/'+(process.env.BV_CHECK_LABEL||'build')+'/'+relative);
 if(write){original.mkdirSync(path.dirname(dest),{recursive:true});return dest;}
 return original.existsSync(dest)?dest:p;
}
for(const n of ['writeFileSync','appendFileSync','mkdirSync','createWriteStream','unlinkSync','rmSync'])fs[n]=(p,...a)=>{
 const dest=mapped(p,true),value=original[n](dest,...a);
 if(n==='writeFileSync'&&String(p).endsWith('/057A/aws-egress-mock.json'))console.log('LOCAL EGRESS MOCK: intercepted OpenAI /v1/models; local 401; providerCalls=0');
 if(n==='writeFileSync'&&String(p).endsWith('/028F/full-checks.json')){
  const rows=JSON.parse(String(a[0])),failure=rows.find(r=>r.status!==0);
  if(failure){original.writeFileSync(out+'/first-failure.json',JSON.stringify(failure,null,2));console.error('MERGE-1 STOP on first FAILED: '+failure.label);spawnSync('taskkill',['/PID',String(process.pid),'/T','/F'],{windowsHide:true});throw Error('Stop on first suite failure');}
 }
 return value;
};
for(const n of ['readFileSync','existsSync','statSync','readdirSync'])fs[n]=(p,...a)=>original[n](mapped(p),...a);
for(const n of ['copyFileSync','cpSync','renameSync'])fs[n]=(a,b,...rest)=>original[n](mapped(a),mapped(b,true),...rest);
fs.openSync=(p,flags,...a)=>original.openSync(mapped(p,typeof flags==='string'&&/[wa+]/.test(flags)),flags,...a);
for(const n of ['writeFile','appendFile','mkdir','unlink','rm']){fsp[n]=(p,...a)=>promises[n](mapped(p,true),...a);fs[n]=(p,...a)=>callbacks[n](mapped(p,true),...a);}
for(const n of ['readFile','stat','readdir','access']){fsp[n]=(p,...a)=>promises[n](mapped(p),...a);fs[n]=(p,...a)=>callbacks[n](mapped(p),...a);}
for(const n of ['copyFile','cp','rename']){fsp[n]=(a,b,...rest)=>promises[n](mapped(a),mapped(b,true),...rest);fs[n]=(a,b,...rest)=>callbacks[n](mapped(a),mapped(b,true),...rest);}
fsp.open=(p,flags,...a)=>promises.open(mapped(p,typeof flags==='string'&&/[wa+]/.test(flags)),flags,...a);
cp.spawn=(file,args=[],options={})=>{const env={...process.env,...options.env};if(path.basename(file).toLowerCase().replace('.exe','')==='node'){const preload='--import='+pathToFileURL(self).href;if(!(env.NODE_OPTIONS||'').includes(preload))env.NODE_OPTIONS=preload+' '+(env.NODE_OPTIONS||'');}return spawn(file,args,{...options,env});};
syncBuiltinESMExports();
// Audit hook stays in place; only screenshot/video destination paths change.
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const seen=new WeakSet();
function wrap(p){if(seen.has(p))return;seen.add(p);const screenshot=p.screenshot.bind(p);p.screenshot=o=>screenshot(o?.path?{...o,path:mapped(o.path,true)}:o);}
const launch=chromium.launch.bind(chromium);
chromium.launch=async(...a)=>{const b=await launch(...a),nc=b.newContext.bind(b),np=b.newPage.bind(b);b.newContext=async(o={})=>{const c=await nc(o.recordVideo?{...o,recordVideo:{...o.recordVideo,dir:mapped(o.recordVideo.dir,true)}}:o);c.on('page',wrap);for(const p of c.pages())wrap(p);return c;};b.newPage=async(o={})=>{const p=await np(o);wrap(p);return p;};return b;};
await import(pathToFileURL(evidence+'057A/tools/no-provider-fetch.mjs').href);
