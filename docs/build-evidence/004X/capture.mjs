import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {resolve,extname,join} from 'node:path';
import {createRequire} from 'node:module';
import {worker,env,admin} from '../../../tests/preview-fixture.mjs';
import library from '../../../public/trade-library.json' with {type:'json'};

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='C:/Users/joe/website_creator',out=join(root,'docs/build-evidence/004X'),port=8144,origin=`http://127.0.0.1:${port}`;
const mime={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.avif':'image/avif','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4'};
async function api(path,method='GET',data){const response=await worker.fetch(new Request(origin+'/api'+path,{method,headers:{origin,'content-type':'application/json','oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email},body:data?JSON.stringify(data):undefined}),env);assert.equal(response.status,200,await response.clone().text());return response.json()}
const robles=(await api('/tenants')).tenants.find(x=>x.slug==='robles-roofing');
let row=(await api('/tenants/'+robles.id)).tenant;
row=(await api('/tenants/'+robles.id,'PUT',{version:row.version,settings:{...row.settings,serviceAreas:[{city:'Oxnard'},{city:'Ventura'},{city:'Camarillo'}]}})).tenant;
await api('/tenants/'+row.id+'/publish','POST',{version:row.version,approved:true});
for(const trade of ['HVAC','Patios']){
 const slug=trade.toLowerCase()+'-004x';
 const {tenant}=await api('/tenants','POST',{designKit:trade.toLowerCase(),slug,settings:{name:trade+' Fixture',trade,phone:'8055550102',area:'Ventura County',address:'Ventura, CA 93001',template:'editorial',serviceAreas:[{city:'Oxnard'},{city:'Ventura'},{city:'Camarillo'}],services:library[trade].map(name=>({name,description:''}))}});
 await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
}
const staticFile=pathname=>{if(pathname==='/favicon.ico')pathname='/favicon.svg';const relative=decodeURIComponent(pathname).replace(/^\/+/,''),roots=[join(root,'dist/client'),join(root,'public')];for(const base of roots){const file=resolve(base,relative);if(file.startsWith(resolve(base)+'\\')&&existsSync(file))return file}return null};
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,origin),file=staticFile(url.pathname);if(file&&!url.pathname.startsWith('/s/')){res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'}).end(readFileSync(file));return}const response=await worker.fetch(new Request(origin+req.url,{method:req.method,headers:req.headers}),env);res.writeHead(response.status,Object.fromEntries(response.headers)).end(Buffer.from(await response.arrayBuffer()))}catch(error){res.writeHead(500).end(String(error))}});
await new Promise(done=>server.listen(port,'127.0.0.1',done));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[],errors=[],routes=['','/services','/areas','/areas/oxnard','/areas/ventura','/about','/reviews','/faq','/contact','/thank-you','/legal','/financing','/promotions'];
try{
 for(const [trade,slug] of [['Roofing','robles-roofing'],['HVAC','hvac-004x'],['Patios','patios-004x']]){
  for(const [size,viewport] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}]]){
   const context=await browser.newContext({viewport,deviceScaleFactor:1,hasTouch:size==='phone',extraHTTPHeaders:{'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email}});
   const page=await context.newPage();
   page.on('pageerror',error=>errors.push({trade,size,kind:'pageerror',message:error.message}));
   page.on('console',message=>{if(message.type()==='error')errors.push({trade,size,kind:'console',url:message.location().url,message:message.text()})});
   const base=`${origin}/s/${slug}`;
   // The prior route list rendered this same 404 template. Capture it once per size.
   await page.goto(base+'/route-not-built-in-004w-v2',{waitUntil:'domcontentloaded'});
   await page.screenshot({path:join(out,`before-${trade.toLowerCase()}-${size}-404-template.png`)});
   for(const mode of ['published','preview']){
    for(const route of routes){
     const url=base+route+(mode==='preview'?'?preview=1':'');
     const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
     const expected=mode==='published'&&['/reviews','/financing','/promotions'].includes(route)?404:200;
     assert.equal(response.status(),expected,`${trade} ${size} ${mode} ${route}`);
     if(expected!==200){results.push({trade,size,mode,route,status:response.status(),reason:'Unsupplied content is hidden on published sites'});continue}
     const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll('h1').length,title:document.title,robots:document.querySelector('meta[name=robots]')?.content,sample:document.querySelectorAll('.core-sample,.foundation-pill').length}));
     assert.ok(state.overflow<=1,`${trade} ${size} ${mode} ${route} overflow ${state.overflow}`);
     assert.equal(state.h1,1,`${trade} ${size} ${mode} ${route} H1`);
     if(mode==='preview')assert.match(state.robots||'',/noindex/);
     const label=route?route.slice(1).replaceAll('/','-'):'home';
     if(route!=='/areas/ventura')await page.screenshot({path:join(out,`after-${trade.toLowerCase()}-${size}-${mode}-${label}.png`)});
     results.push({trade,size,mode,route,status:response.status(),...state});
     if(['','/services','/contact','/legal'].includes(route)){
      const links=await page.locator('.shared-site-header a[href^="/s/"],.studio-footer a[href^="/s/"],.cx-desktop-nav a[href^="/s/"],.cx-mobile-menu a[href^="/s/"]').evaluateAll(nodes=>[...new Set(nodes.map(x=>x.getAttribute('href')).filter(Boolean))]);
      for(const link of links){const href=new URL(link,origin),check=await page.request.get(href.href);assert.equal(check.status(),200,`${trade} ${mode} ${route} link ${link}`)}
     }
    }
   }
   if(trade!=='Roofing'){
   const storyPath='?preview=1&project=example-0';
   const storyResponse=await page.goto(base+storyPath,{waitUntil:'domcontentloaded',timeout:30000});
   assert.equal(storyResponse.status(),200,`${trade} ${size} preview project story`);
   await page.waitForLoadState('networkidle');
   await page.evaluate(()=>document.fonts.ready);
   const storyState=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll('h1').length,robots:document.querySelector('meta[name=robots]')?.content,sample:document.querySelectorAll('.sample-tag').length,headerBackground:getComputedStyle(document.querySelector('.shared-site-header')).backgroundColor,headerOpacity:getComputedStyle(document.querySelector('.shared-site-header')).opacity}));
   assert.ok(storyState.overflow<=1&&storyState.h1===1&&storyState.sample>0&&/noindex/.test(storyState.robots||''),`${trade} ${size} preview project story`);
   await page.screenshot({path:join(out,`after-${trade.toLowerCase()}-${size}-preview-project-story.png`)});
   results.push({trade,size,mode:'preview',route:'/project-story',status:200,...storyState});
   }
   await context.close();
  }
 }
 const unexpected=errors.filter(error=>!error.url.includes('route-not-built-in-004w-v2')&&!/\/(reviews|financing|promotions)$/.test(error.url));
 assert.equal(unexpected.length,0,JSON.stringify(unexpected.slice(0,12)));
}finally{const unexpectedErrors=errors.filter(error=>!error.url.includes('route-not-built-in-004w-v2')&&!/\/(reviews|financing|promotions)$/.test(error.url));writeFileSync(join(out,'browser-results.json'),JSON.stringify({results,expected404ConsoleEvents:errors.length-unexpectedErrors.length,unexpectedErrors},null,2));await browser.close();await new Promise(done=>server.close(done))}
console.log(`PASS #004X browser matrix: ${results.length} route checks, zero unexpected browser errors`);
