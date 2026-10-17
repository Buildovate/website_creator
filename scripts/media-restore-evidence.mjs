import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {chromium} from 'playwright';
import {createRuntime,listen} from '../src/aws/server.js';
import {DEFAULT} from '../src/core.js';
import {kitDefaults} from '../src/design-kits.js';
const phase=process.argv[2];if(!['before','after'].includes(phase))throw Error('Use before or after.');
if(phase==='before'&&fs.existsSync('public/media-quality.json')){const restored=JSON.parse(fs.readFileSync('public/media-quality.json')).assets.find(a=>a.path==='/assets/build-films/roofing.mp4');if(createHash('sha256').update(fs.readFileSync('public'+restored.path)).digest('hex')===restored.sha256)throw Error('Before proof requires the unmodified pre-restoration checkout. Refusing to label restored media as before.');}
const out=path.resolve('docs/build-evidence/MEDIA-RESTORE'),origin='http://127.0.0.1:8274';fs.mkdirSync(out,{recursive:true});
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',APP_ORIGIN:origin,DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',CUSTOM_DOMAINS_LIVE:'0',TEMPLATE_MEDIA_ORIGIN:phase==='after'?(process.env.TEMPLATE_MEDIA_ORIGIN||''):''}});
const settings={...DEFAULT,...kitDefaults('roofing',{name:'Sample Roofing',phone:'8055550198',area:'Ventura'}),scrollStory:{...DEFAULT.scrollStory,enabled:true,mode:'build'},effects:{...DEFAULT.effects,scrollStory:true}};
await runtime.env.DB.prepare("INSERT INTO tenants(id,slug,name,settings,published,status,created_at,updated_at) VALUES('media-restore','media-restore-roofing',?,?,?,'published','2026-01-01','2026-01-01')").bind(settings.name,JSON.stringify(settings),JSON.stringify(settings)).run();
let server,browser;const result={phase,shots:[],lighthouse:[],externalRequests:[],qaGateClear:false,delivery:phase==='after'&&process.env.TEMPLATE_MEDIA_ORIGIN?'preview CloudFront':'local restored files'};
try{
 server=await listen(runtime,8274);browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
 for(const [width,scale] of [[1440,1],[1440,2],[390,3]]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},deviceScaleFactor:scale});const p=await context.newPage();
  await p.route('**/*',route=>(route.request().url().startsWith(origin)||phase==='after'&&process.env.TEMPLATE_MEDIA_ORIGIN&&new URL(route.request().url()).origin===process.env.TEMPLATE_MEDIA_ORIGIN)?route.continue():(result.externalRequests.push(new URL(route.request().url()).hostname),route.abort()));
  await p.goto(origin+'/s/media-restore-roofing',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  const root=p.locator('[data-story-mode=build]');await root.waitFor();
  await p.evaluate(()=>{const r=document.querySelector('[data-story-mode=build]');scrollTo(0,Math.round((r.offsetHeight-r.querySelector('.story-stage').offsetHeight)*.4));r.querySelector('[data-story-select="1"]').click()});
  await p.waitForFunction(()=>{const v=document.querySelector('[data-build-video]');return v?.readyState>=2&&!v.seeking&&Math.abs(v.currentTime-v.duration*.5)<.03},{},{timeout:45000});
  await p.evaluate(()=>document.querySelector('[data-story-mode=build] .story-motion').click());await p.waitForTimeout(150);
  const name=phase+'-roofing-'+width+'-'+scale+'x.png';await p.screenshot({path:path.join(out,name)});
  const crop=width===390?{left:100,top:160,width:250,height:210}:{left:920,top:240,width:400,height:260};
  await sharp(path.join(out,name)).extract(Object.fromEntries(Object.entries(crop).map(([k,v])=>[k,v*scale]))).png().toFile(path.join(out,name.replace('.png','-crop.png')));
  result.shots.push({width,scale,name,crop,position:await p.evaluate(()=>({scrollY,videoTime:document.querySelector('[data-build-video]').currentTime,videoDuration:document.querySelector('[data-build-video]').duration,source:document.querySelector('[data-build-video]').currentSrc}))});await context.close();
 }
 await browser.close();browser=null;
 if(process.env.MEDIA_SKIP_LIGHTHOUSE!=='1')for(let i=1;i<=3;i++){
  const file=path.join(out,phase+'-lighthouse-'+i+'.json');
  await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[path.join(out,'tools/node_modules/lighthouse/cli/index.js'),origin+'/s/media-restore-roofing','--only-categories=performance','--output=json','--output-path='+file,'--quiet','--chrome-flags=--headless --no-sandbox --disable-gpu --disable-dev-shm-usage'],{windowsHide:true,env:{...process.env,CHROME_PATH:process.env.REVIEW_BROWSER_EXECUTABLE},stdio:['ignore','ignore','pipe']});let error='';child.stderr.on('data',x=>error+=x);child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error(error.slice(-1800))))});
  const r=JSON.parse(fs.readFileSync(file));if(r.runtimeError)throw Error(r.runtimeError.message);const audit=id=>r.audits[id]?.numericValue;result.lighthouse.push({run:i,score:r.categories.performance.score*100,lcp: audit('largest-contentful-paint'),fcp:audit('first-contentful-paint'),tbt:audit('total-blocking-time'),cls:audit('cumulative-layout-shift'),speedIndex:audit('speed-index'),formFactor:r.configSettings.formFactor,throttling:r.configSettings.throttlingMethod});console.log(phase+' Lighthouse mobile '+i+': '+result.lighthouse.at(-1).score);
 }
 const median=key=>result.lighthouse.map(x=>x[key]).sort((a,b)=>a-b)[1];result.medians=Object.fromEntries(['score','lcp','fcp','tbt','cls','speedIndex'].map(k=>[k,median(k)]));
 console.log('PASS '+phase+' hero proof '+JSON.stringify(result.medians));
}finally{fs.writeFileSync(path.join(out,phase+'-proof.json'),JSON.stringify(result,null,2));await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));await runtime.close()}
