import {createServer} from 'node:http';
import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {resolve,extname,join} from 'node:path';
import {createRequire} from 'node:module';
import {worker,env,admin} from '../../../tests/preview-fixture.mjs';
import {DEFAULT,ROBLES,settings} from '../../../src/core.js';
import library from '../../../public/trade-library.json' with {type:'json'};
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='C:/Users/joe/website_creator',out=join(root,'docs/build-evidence/004W-v4'),port=8142,origin=`http://127.0.0.1:${port}`;
const mime={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.mp4':'video/mp4'};
for(const trade of ['Roofing','HVAC','Plumbing']){const slug='showpiece-'+trade.toLowerCase();const input=trade==='Roofing'?ROBLES:{...DEFAULT,name:trade+' Studio',trade,designKit:trade.toLowerCase(),phone:'(805) 555-0123',area:'Ventura County',services:library[trade].map(name=>({name,description:''}))};const s=settings({...input,serviceAreas:[{city:'Oxnard'},{city:'Ventura'},{city:'Camarillo'}]}),id=crypto.randomUUID(),time=new Date().toISOString();await env.DB.prepare('INSERT INTO tenants (id,slug,name,settings,published,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)').bind(id,slug,s.name,JSON.stringify(s),JSON.stringify(s),'published',time,time).run()}
const staticFile=pathname=>{const relative=decodeURIComponent(pathname).replace(/^\/+/,''),roots=[join(root,'dist/client'),join(root,'public')];for(const base of roots){const file=resolve(base,relative);if(file.startsWith(resolve(base)+'\\')&&existsSync(file))return file}return null};
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,origin),file=staticFile(url.pathname);if(file&&!url.pathname.startsWith('/s/')){res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'}).end(readFileSync(file));return}const response=await worker.fetch(new Request(origin+req.url,{method:req.method,headers:req.headers}),env);res.writeHead(response.status,Object.fromEntries(response.headers)).end(Buffer.from(await response.arrayBuffer()))}catch(error){res.writeHead(500).end(String(error))}});
await new Promise(done=>server.listen(port,'127.0.0.1',done));const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const targets=[['roof-repair','/s/robles-roofing/services/roof-repair'],['roof-replacement','/s/showpiece-roofing/services/roof-replacement'],['hvac-installation','/s/showpiece-hvac/services/air-conditioning-installation'],['plumbing-leak','/s/showpiece-plumbing/services/leak-detection'],['services','/s/showpiece-roofing/services'],['oxnard','/s/showpiece-roofing/areas/oxnard'],['about','/s/showpiece-roofing/about'],['financing','/s/showpiece-roofing/financing?preview=1'],['ventura','/s/showpiece-roofing/areas/ventura'],['legacy-roofing','/s/robles-roofing/services/roof-installation']];
const results=[],errors=[],checks=[];
const headers={'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email};
const assert=(condition,message)=>{if(!condition)throw Error(message);checks.push(message)};
try{
 for(const [label,path] of targets)for(const [size,viewport] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}]]){
  const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:size==='phone',extraHTTPHeaders:headers});
  page.on('pageerror',error=>errors.push({label,size,message:error.message}));
  const response=await page.goto(origin+path,{waitUntil:'domcontentloaded'});
  await page.evaluate(async()=>{for(const img of document.querySelectorAll('main img')){img.loading='eager';await img.decode().catch(()=>{});}await document.fonts.ready;});
  const state=await page.evaluate(()=>({title:document.title,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth-innerWidth,broken:[...document.querySelectorAll('main img')].filter(x=>!x.naturalWidth).map(x=>x.src),images:[...document.querySelectorAll('main img')].map(x=>x.getAttribute('src')),heroImage:document.querySelector('.core-hero-visual img,.sd-hero-art img,.tm-poster,.foundation-hero-art img')?.getAttribute('src')||''}));
  assert(response.status()===200,label+' '+size+' HTTP 200');assert(state.h1===1,label+' '+size+' one H1');assert(state.overflow===0,label+' '+size+' no horizontal overflow');assert(!state.broken.length,label+' '+size+' all images decoded');
  if(await page.locator('.service-detail').count())assert(new Set(state.images).size===state.images.length,label+' '+size+' no repeated photos');
  const file=label+'-'+size+'.png';await page.screenshot({path:join(out,file),fullPage:true});results.push({label,size,path,status:response.status(),file,...state});
  if(['roof-repair','hvac-installation','plumbing-leak'].includes(label)){
   await page.locator('#signature').scrollIntoViewIfNeeded();const summary=page.locator('.sd-hotspot-list summary').first();await summary.focus();await page.keyboard.press('Enter');assert(await summary.evaluate(el=>el.parentElement.open),label+' '+size+' keyboard hotspot opens');
   const scene=page.locator('[data-ar-scene]');await scene.scrollIntoViewIfNeeded();await page.waitForTimeout(60);const before=await scene.evaluate(el=>el.style.getPropertyValue('--ar-progress'));await page.evaluate(()=>scrollBy(0,120));await page.waitForTimeout(60);const after=await scene.evaluate(el=>el.style.getPropertyValue('--ar-progress'));assert(before!==after,label+' '+size+' AR follows scroll');
   await page.evaluate(()=>scrollBy(0,-120));await page.waitForTimeout(60);assert(await scene.evaluate(el=>el.style.getPropertyValue('--ar-progress'))===before,label+' '+size+' AR reverses without drift');
   await page.locator('[data-ar-toggle]').focus();await page.keyboard.press('Enter');const frozen=await scene.evaluate(el=>el.style.getPropertyValue('--ar-progress'));await page.evaluate(()=>scrollBy(0,80));await page.waitForTimeout(60);assert(await scene.evaluate(el=>el.style.getPropertyValue('--ar-progress'))===frozen,label+' '+size+' pause holds movement');
   await scene.screenshot({path:join(out,label+'-ar-'+size+'.png')});
   await page.locator('.sd-hero-actions [data-estimator-service]').click();assert(await page.locator('#lead-form input[name=service]').inputValue()!==''&&await page.locator('#lead-form progress').getAttribute('value')==='1',label+' '+size+' service-preselected estimator step');
  }
  if(label==='financing'){assert(await page.locator('[data-finance-result]').innerText().then(x=>/Sample/i.test(x)&&/7.99% APR · 60 months/.test(x)),size+' sample payment has adjacent APR and term');}
  await page.close();
 }
 for(const mode of ['no-js','reduced-motion'])for(const [label,path] of targets){
  const page=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced-motion'?'reduce':'no-preference',extraHTTPHeaders:headers});await page.goto(origin+path,{waitUntil:'load'});
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,text:document.querySelector('main')?.innerText.length,animated:document.querySelector('[data-ar-scene]')?.classList.contains('ar-moving')||false}));assert(state.overflow===0&&state.text>200,label+' '+mode+' content and layout');assert(!state.animated,label+' '+mode+' static assembly');
  if(['roof-repair','financing','about'].includes(label))await page.screenshot({path:join(out,label+'-'+mode+'-phone.png'),fullPage:true});await page.close();
 }
 const preview=await browser.newPage({viewport:{width:390,height:844},extraHTTPHeaders:headers});await preview.goto(origin+'/s/robles-roofing/services/roof-repair?preview=1');assert(await preview.locator('meta[name=robots]').getAttribute('content')==='noindex,nofollow','Full preview is noindex');const range=preview.locator('[data-compare-range]');await range.focus();await preview.keyboard.press('ArrowRight');assert(await range.inputValue()==='51','Sample comparison keyboard control');assert(await preview.locator('#lead-form button').isDisabled(),'Preview submission stays disabled');await preview.screenshot({path:join(out,'roof-repair-full-preview-phone.png'),fullPage:true});await preview.close();
 assert(errors.length===0,'No browser JavaScript errors');
 writeFileSync(join(out,'capture-results.json'),JSON.stringify({results,errors,checks},null,2));console.log(JSON.stringify({screenshots:results.length,checks:checks.length,errors}));
}finally{await browser.close();await new Promise(done=>server.close(done))}
