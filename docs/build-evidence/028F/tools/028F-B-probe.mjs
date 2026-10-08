import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
const require=createRequire(import.meta.url),root='C:/Users/joe/website_creator';
const output=root+'/docs/build-evidence/028F/checks/028F-B-probe.json';
const screenshotDir=root+'/docs/build-evidence/028F/screenshots/028F-B';
const diagnosisOnly=!process.argv.includes('--verify');
const original=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/028F/checks/round8q-samples-before-findings.json'));
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const result={round:'1d',mode:diagnosisOnly?'timeout diagnosis':'Group A verification',method:'Read-only full built-worker pages, SQLite :memory:, static dist/client assets intercepted locally by Playwright; no HTTP listener or real provider/network calls; no QA execution or decisions.',priorProbe:{serverUsed:false,origin:'http://diagnosis.invalid',port5173:{listening:false,request:'http://127.0.0.1:5173/s/sample-fictional-copper-kite-ventura',status:null,finalUrl:null,error:'ECONNREFUSED (confirmed before this probe)'},explanation:'Round 1c used a virtual origin with local route fulfillment; port 5173 was not involved.'},requests:[],console:[],pageErrors:[],blockedExternal:[],serverFetchAttempts:[],records:[],longNames:[],screenshots:[],qaGateClear:false,original70Open:true,providerCalls:0,credits:0};
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');
for(const file of fs.readdirSync(root+'/drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(fs.readFileSync(root+'/drizzle/'+file,'utf8'));
const DB={prepare(query){let args=[];const statement={bind(...values){args=values;return statement},async first(){return sql.prepare(query).get(...args)||null},async all(){return {results:sql.prepare(query).all(...args)}},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}}}};return statement}};
const env={DB,BUCKET:{async get(){return null},async head(){return null}}};
for(const packet of original.snapshot.packets){const source=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/028F/packets/'+packet.id+'/'+packet.versionHash+'/source.json'));sql.prepare('INSERT INTO tenants (id,slug,name,settings,published,version,status,created_at,updated_at) VALUES (?,?,?,?,?,1,?,?,?)').run(source.siteId,packet.id,source.settings.name,JSON.stringify(source.settings),JSON.stringify(source.settings),'published','2026-10-08T00:00:00Z','2026-10-08T00:00:00Z');}
globalThis.fetch=async input=>{result.serverFetchAttempts.push(String(input?.url||input));throw Error('Provider fetch forbidden in diagnostic probe');};
let browser;
const flush=()=>fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
try{
 const worker=(await import(pathToFileURL(root+'/dist/server/index.js').href)).default;
 const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--disable-gpu','--disable-accelerated-2d-canvas','--force-color-profile=srgb']});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
 page.on('console',msg=>result.console.push({type:msg.type(),text:msg.text(),location:msg.location()}));
 page.on('pageerror',error=>result.pageErrors.push(error.stack||error.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname!=='diagnosis.invalid'){result.blockedExternal.push(url.href);return route.abort();}
  const file=path.resolve(root+'/dist/client','.'+decodeURIComponent(url.pathname));
  if(file.startsWith(path.resolve(root+'/dist/client')+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile()){
   const types={'.css':'text/css','.js':'application/javascript','.ttf':'font/ttf','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.json':'application/json','.mp4':'video/mp4'};
   result.requests.push({url:url.href,status:200,source:'dist/client',file:file.slice(root.length+1)});
   return route.fulfill({status:200,contentType:types[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
  }
  const response=await worker.fetch(new Request('https://test.local'+url.pathname+url.search,{method:route.request().method()}),env);
  result.requests.push({url:url.href,status:response.status,source:'built worker',contentType:response.headers.get('content-type')});
  return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
 });
 const inspect=()=>page.evaluate(()=>{
  const header=document.querySelector('.shared-site-header');
  return {url:location.href,readyState:document.readyState,headerExists:!!header,navMode:header?.getAttribute('data-nav-mode')??null,fitNavExists:!!header?.querySelector('[data-nav-fit]'),fitReady:!!header?.querySelector('.site-nav-fit-ready'),fontsStatus:document.fonts.status,htmlClass:document.documentElement.className,headerHTML:header?.outerHTML.slice(0,1800),scripts:[...document.scripts].map(s=>({src:s.src,type:s.type,defer:s.defer})),styles:[...document.querySelectorAll('link[rel=stylesheet]')].map(s=>({href:s.href,loaded:!!s.sheet})),bodyClass:document.body.className};
 });
 const target='http://diagnosis.invalid/s/sample-fictional-copper-kite-ventura';
 const response=await page.goto(target,{waitUntil:'domcontentloaded',timeout:30000});
 result.diagnosis={initialStatus:response.status(),requestedUrl:target,finalUrl:page.url(),afterDOMContentLoaded:await inspect(),signalSource:{path:'public/site-navigation.js',lines:[3,4,28,48,49],condition:'data-nav-mode is set only when the selected header has [data-nav-fit]; fonts-ready/resize/loadingdone schedule fit().'}};flush();
 await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
 result.diagnosis.afterFontsReady=await inspect();flush();
 if(result.pageErrors.length)throw Error('Real page JavaScript error: '+result.pageErrors[0]);
 if(response.status()!==200||!result.diagnosis.afterFontsReady.headerExists)throw Error('Sample page/header unavailable');
 if(diagnosisOnly){console.log(JSON.stringify({output,status:response.status(),finalUrl:page.url(),header:result.diagnosis.afterFontsReady.headerExists,navMode:result.diagnosis.afterFontsReady.navMode,fitNav:result.diagnosis.afterFontsReady.fitNavExists,pageErrors:result.pageErrors.length,consoleErrors:result.console.filter(x=>x.type==='error').length,requests:result.requests.length}));}
 else{
  result.diagnosis.classification={number:3,cause:'Event-driven fit readiness; data-nav-mode unset at DOM readiness and menu after fonts + animation frames. No wrong server/URL or JavaScript error found on inspected page.',signal:'Header exists; document.fonts.ready; three requestAnimationFrame ticks; record optional nav-mode rather than waiting on it.'};
  const settle=async()=>{await page.locator('.shared-site-header').waitFor({state:'visible',timeout:15000});await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));});};
  const measure=()=>page.evaluate(()=>{
   const h=document.querySelector('.shared-site-header'),brand=h.querySelector('.kit-brand'),name=brand.querySelector('.site-brand-name'),menu=h.querySelector('.site-mobile-menu'),nav=h.querySelector('.site-desktop-nav'),style=getComputedStyle(name),range=document.createRange();range.selectNodeContents(name);const rects=[...range.getClientRects()].map(r=>r.toJSON()),box=e=>e.getBoundingClientRect().toJSON(),visible=e=>!!e&&!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
   const clippedBy=[];for(let p=name;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p),b=box(p);for(const r of rects)if(['hidden','clip'].includes(s.overflowX)&&(r.right>b.right+2||r.left<b.left-2)||['hidden','clip'].includes(s.overflowY)&&(r.bottom>b.bottom+2||r.top<b.top-2))clippedBy.push({class:p.className,overflowX:s.overflowX,overflowY:s.overflowY,box:b});}
   const controls=[...nav.querySelectorAll(':scope>a,.site-fit-trigger'),menu.querySelector('summary')].filter(visible),overlaps=[];for(const r of rects)for(const e of controls){const b=box(e),w=Math.min(r.right,b.right)-Math.max(r.left,b.left),height=Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top);if(w>0&&height>0)overlaps.push({label:e.textContent.trim(),width:w,height});}
   const outsideViewportPx=Math.max(0,...rects.map(r=>Math.max(-r.left,r.right-innerWidth))),horizontalOverflow=document.documentElement.scrollWidth-innerWidth,truncated=style.textOverflow==='ellipsis'&&name.scrollWidth>name.clientWidth;
   return {width:innerWidth,name:name.textContent,characters:name.textContent.length,selector:'.shared-site-header .site-brand-name',scrollWidth:name.scrollWidth,clientWidth:name.clientWidth,whiteSpace:style.whiteSpace,overflow:style.overflow,textOverflow:style.textOverflow,visuallyTruncated:truncated||clippedBy.length>0,clippedBy,textRects:rects,lineCount:new Set(rects.map(r=>Math.round(r.top))).size,nameBox:box(name),headerHeight:box(h).height,navMode:h.getAttribute('data-nav-mode'),fitNavPresent:!!h.querySelector('[data-nav-fit]'),font:getComputedStyle(brand).font,fontsReady:document.fonts.status==='loaded',overlaps,outsideViewportPx,horizontalOverflow,menuVisible:visible(menu),menuBox:box(menu.querySelector('summary')),navFit:overlaps.length===0&&horizontalOverflow<=1,contactCtaReachableInMenu:[...menu.querySelectorAll('a')].some(a=>/Contact Us/i.test(a.textContent)),desktopCtaVisible:[...nav.querySelectorAll('a')].some(a=>visible(a)&&/Contact Us|Pricing & options/.test(a.textContent)),fullyVisible:visible(name)&&!truncated&&clippedBy.length===0&&outsideViewportPx<=1&&horizontalOverflow<=1&&overlaps.length===0};
  });
  fs.mkdirSync(screenshotDir,{recursive:true});
  for(const packet of original.snapshot.packets){const source=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/028F/packets/'+packet.id+'/'+packet.versionHash+'/source.json')),packetData=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/028F/packets/'+packet.id+'/'+packet.versionHash+'/packet.json'));let shot=false;
   for(const finding of original.findings.filter(f=>f.sample===packet.id&&f.key==='clipped-text'))for(const width of [390,360]){
    await page.setViewportSize({width,height:844});const response=await page.goto('http://diagnosis.invalid'+finding.page,{waitUntil:'domcontentloaded',timeout:30000});if(response.status()!==200)throw Error('Unexpected route '+finding.page+' status '+response.status());await settle();
    const record={sample:packet.id,originalVersionHash:packet.versionHash,openId:finding.id,page:finding.page,trade:source.settings.trade,look:packetData.choices.style,...await measure()};result.records.push(record);flush();
    if(result.pageErrors.length)throw Error('Real page JavaScript error: '+result.pageErrors[0]);
    if(!shot&&width===390){const file=screenshotDir+'/'+packet.id+'-390-before.png';await page.screenshot({path:file,fullPage:false,animations:'disabled',timeout:15000});result.screenshots.push({sample:packet.id,trade:source.settings.trade,look:packetData.choices.style,file:file.slice(root.length+1),sha256:sha(file)});shot=true;flush();}
   }
   console.log('Verified '+packet.id+' '+result.records.filter(r=>r.sample===packet.id).length+' page-width cases');
  }
  for(const packet of original.snapshot.packets)for(const name of ['Pacific Coast Roofing Services','Forty Character Roofing Services Company','W'.repeat(50)])for(const width of [390,360]){
   await page.setViewportSize({width,height:844});const response=await page.goto('http://diagnosis.invalid/s/'+packet.id,{waitUntil:'domcontentloaded',timeout:30000});if(response.status()!==200)throw Error('Long-name route status '+response.status());await settle();await page.locator('.shared-site-header .site-brand-name').evaluate((el,text)=>el.textContent=text,name);await settle();result.longNames.push({sample:packet.id,mutation:'Ephemeral browser text only; source/settings/QA snapshots unchanged',...await measure()});flush();if(result.pageErrors.length)throw Error('Real page JavaScript error: '+result.pageErrors[0]);
  }
  if(result.serverFetchAttempts.length)throw Error('Unexpected server egress attempt');
  result.diagnosis.classification={number:2,cause:'The universal data-nav-mode wait does not apply to the ten static service-detail headers; homepage assignment is also event-driven.',pagesWithoutMode:[...new Set(result.records.filter(r=>r.navMode===null).map(r=>r.page))],signal:'Visible header + fonts ready + three animation frames; optional nav-mode is recorded, not required.'};
  result.summary={originalGroupACount:67,cases:result.records.length,at390:{cases:result.records.filter(r=>r.width===390).length,fullyVisible:result.records.filter(r=>r.width===390&&r.fullyVisible).length,clipped:result.records.filter(r=>r.width===390&&r.visuallyTruncated).length,notFullyVisible:result.records.filter(r=>r.width===390&&!r.fullyVisible).length},at360:{cases:result.records.filter(r=>r.width===360).length,fullyVisible:result.records.filter(r=>r.width===360&&r.fullyVisible).length,clipped:result.records.filter(r=>r.width===360&&r.visuallyTruncated).length,notFullyVisible:result.records.filter(r=>r.width===360&&!r.fullyVisible).length},longNameCases:result.longNames.length,longNameFullyVisible:result.longNames.filter(r=>r.fullyVisible).length,longestCharacters:Math.max(...result.longNames.map(r=>r.characters)),screenshots:result.screenshots.length};flush();console.log(JSON.stringify({output,...result.summary,errors:result.pageErrors.length}));
 }
}catch(error){result.stop={message:error.message,stack:error.stack};flush();console.error(error.stack);process.exitCode=1;}
finally{if(browser)await browser.close();sql.close();}