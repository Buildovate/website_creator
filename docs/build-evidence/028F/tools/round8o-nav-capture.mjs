import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F/checks/round8o-nav';
export async function captureNav({matrix=false}={}){
 process.chdir(root);fs.mkdirSync(out,{recursive:true});
 const {worker,env,admin}=await import(pathToFileURL(root+'/tests/preview-fixture.mjs'));
 const compiled=await build({stdin:{contents:"export {websiteHeader} from './src/site-polish.js';export {settings,DEFAULT} from './src/core.js';export {kits} from './src/design-kits.js';export {applySiteStyle} from './src/site-style-render.js';",resolveDir:root},bundle:true,format:'esm',platform:'node',write:false,loader:{'.html':'text','.pdf':'binary'}});
 const {websiteHeader,settings,DEFAULT,kits,applySiteStyle}=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
 const library=JSON.parse(fs.readFileSync(root+'/public/trade-library.json'));
 const types={'.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4','.json':'application/json'};
 const server=http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://127.0.0.1');let response;
  if(url.pathname.startsWith('/_nav/')){const [, ,kitId,look]=url.pathname.split('/'),kit=kits[kitId];const s=settings({...DEFAULT,name:'Trade QA',trade:kit.trade,designKit:kitId,color:kit.color,siteStyle:look,phone:'8054410199',area:'Ventura',services:library[kit.trade].map(name=>({name}))});const markup='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/showcase.css"><link rel="stylesheet" href="/site-polish.css"></head><body class="showcase" data-trade="'+kit.trade+'">'+websiteHeader(s,{base:'/s/nav-qa',preview:true})+'<script src="/site-navigation.js"></script></body></html>';response=new Response(applySiteStyle(markup,s),{headers:{'content-type':'text/html'}});}
  else{const file=path.resolve(root+'/public','.'+decodeURIComponent(url.pathname));if(file.startsWith(path.resolve(root+'/public')+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())response=new Response(fs.readFileSync(file),{headers:{'content-type':types[path.extname(file)]||'application/octet-stream'}});else response=await worker.fetch(new Request('https://test.local'+url.pathname+url.search,{headers:{'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email}}),env);}
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error));}});
 let browser;const errors=[],records=[],matrixRecords=[];
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
  const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});page.on('pageerror',error=>errors.push(error.message));await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  const observe=()=>page.evaluate(()=>{const h=document.querySelector('.shared-site-header'),nav=h.querySelector('[data-nav-fit]'),brand=h.querySelector('.kit-brand'),cta=nav.querySelector('[data-nav-cta]'),box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};},visible=e=>!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';return {width:innerWidth,all:[...nav.querySelectorAll('a')].map(a=>({label:a.textContent.trim(),href:a.getAttribute('href')})),visible:[...nav.querySelectorAll(':scope>a')].filter(visible).map(a=>({label:a.textContent.trim(),box:box(a)})),overflow:[...nav.querySelectorAll('.site-fit-links a')].map(a=>a.textContent.trim()),moreVisible:visible(nav.querySelector('.site-fit-trigger'))&&!nav.querySelector('.site-fit-overflow').hidden,brand:box(brand),cta:box(cta),nav:box(nav),phoneMenu:visible(h.querySelector('.site-mobile-menu')),horizontalOverflow:document.documentElement.scrollWidth-innerWidth};});
  const settle=()=>page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
  const panelProof=()=>page.evaluate(()=>[...document.querySelectorAll('.site-fit-links a')].map(a=>{const r=a.getBoundingClientRect(),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {label:a.textContent.trim(),box:r.toJSON(),centerHit:hit===a||a.contains(hit),unclipped:a.scrollWidth<=a.clientWidth+1,inViewport:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight};}));
  await page.goto(origin+'/design-preview/roofing/immersive',{waitUntil:'load',timeout:60000});await settle();
  for(const width of [1440,1280,1024,820,390]){
   await page.setViewportSize({width,height:width===390?844:900});await settle();
   if(width===390)await page.locator('.site-mobile-menu>summary').click({timeout:5000});
   const record=await observe();record.screenshot='round8o-nav/roofing-'+width+'.png';await page.screenshot({path:out+'/roofing-'+width+'.png'});
   if(record.moreVisible){const button=page.locator('.site-fit-trigger');await button.focus();await page.keyboard.press('Enter');record.moreExpanded=await button.getAttribute('aria-expanded');record.openLinks=await page.locator('.site-fit-links a:visible').allTextContents();record.panelProof=await panelProof();await page.screenshot({path:out+'/roofing-'+width+'-more.png'});await page.keyboard.press('Escape');record.escapeClosed=(await button.getAttribute('aria-expanded'))==='false';record.focusReturned=await button.evaluate(el=>document.activeElement===el);}
   records.push(record);
  }
  await page.setViewportSize({width:1440,height:900});await settle();const resizedBack=await observe();
  if(matrix)for(const kit of Object.keys(kits))for(const look of ['current','bold','fresh','classic']){await page.goto(origin+'/_nav/'+kit+'/'+look,{waitUntil:'load',timeout:60000});await settle();for(const width of [1440,820]){await page.setViewportSize({width,height:900});await settle();const record={kit,look,...await observe()};if(record.moreVisible){await page.locator('.site-fit-trigger').click({timeout:5000});record.panelProof=await panelProof();await page.keyboard.press('Escape');}matrixRecords.push(record);}}
  const result={mode:matrix?'assertion-input capture':'Step 0 visual record; assertions not run',records,resizedBack,matrixRecords,errors};fs.writeFileSync(out+'/results.json',JSON.stringify(result,null,2));return result;
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){const result=await captureNav();console.log(JSON.stringify({mode:result.mode,records:result.records.map(r=>({width:r.width,visible:r.visible.map(a=>a.label),overflow:r.overflow,moreVisible:r.moreVisible,phoneMenu:r.phoneMenu,horizontalOverflow:r.horizontalOverflow})),errors:result.errors},null,2));}
