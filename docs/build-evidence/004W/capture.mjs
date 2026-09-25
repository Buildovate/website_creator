import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {resolve,extname,join} from 'node:path';
import {createRequire} from 'node:module';
import {worker,env,admin} from '../../../tests/preview-fixture.mjs';
import {ROBLES} from '../../../src/core.js';
import library from '../../../public/trade-library.json' with {type:'json'};

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='C:/Users/joe/website_creator',out=join(root,'docs/build-evidence/004W');
const port=8139,origin=`http://127.0.0.1:${port}`;
const mime={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.avif':'image/avif','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4'};
async function api(path,method='GET',data){const response=await worker.fetch(new Request(origin+'/api'+path,{method,headers:{origin,'content-type':'application/json','oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email},body:data?JSON.stringify(data):undefined}),env);assert.equal(response.status,200,await response.clone().text());return response.json()}
for(const [trade,slug,template] of [['HVAC','hvac-004w','editorial'],['Patios','patios-004w','editorial']]){
 let {tenant}=await api('/tenants','POST',{designKit:trade.toLowerCase(),slug,settings:{name:`${trade} Fixture`,trade,phone:'8055550102',area:'Ventura',address:'Ventura, CA 93001',template,services:library[trade].slice(0,3).map(name=>({name,description:`Discuss ${name.toLowerCase()} for your property.`}))}});
 await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
}
const staticFile=pathname=>{
 const relative=decodeURIComponent(pathname).replace(/^\/+/,''),roots=[join(root,'dist/client'),join(root,'public')];
 for(const base of roots){const file=resolve(base,relative);if(file.startsWith(resolve(base)+ '\\')&&existsSync(file))return file;}
 return null;
};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,origin),file=staticFile(url.pathname);
  if(file&&!url.pathname.startsWith('/s/')){res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'}).end(readFileSync(file));return}
  const response=await worker.fetch(new Request(origin+req.url,{method:req.method,headers:req.headers}),env);
  const headers=Object.fromEntries(response.headers);res.writeHead(response.status,headers).end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500).end(String(error));}
});
await new Promise(done=>server.listen(port,'127.0.0.1',done));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[],errors=[];
try{
 for(const [trade,slug,service] of [['Roofing','robles-roofing','roof-repair'],['HVAC','hvac-004w','air-conditioning-installation'],['Patios','patios-004w','patio-covers']]){
  for(const [size,viewport] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}]]){
   const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:size==='phone'});
   page.on('pageerror',error=>errors.push({trade,size,message:error.message}));
   const base=`${origin}/s/${slug}`;
   const home=await page.goto(base,{waitUntil:'domcontentloaded'});assert.equal(home.status(),200);
   const homeOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.ok(homeOverflow<=1,`${trade} ${size} homepage overflow ${homeOverflow}`);
   await page.locator('#services').scrollIntoViewIfNeeded();
   const cards=page.locator('#services article');
   const links=await cards.locator('a[href*="/services/"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
   assert.ok(links.length>=3,`${trade} cards: ${JSON.stringify(links)}`);
   for(const link of links)assert.equal((await page.request.get(origin+link)).status(),200,`${trade}: ${link}`);
   await page.locator('#services').screenshot({path:join(out,`${trade.toLowerCase()}-${size}-cards.png`)});
   await page.evaluate(()=>scrollTo(0,0));
   if(size==='phone'){
    await page.locator('.site-mobile-menu > summary,.cx-mobile-menu > summary').first().click();
    await page.locator('.site-mobile-menu .site-expertise > summary,.cx-mobile-menu .site-expertise > summary').first().click();
   }else await page.locator('.site-desktop-nav .site-expertise > summary,.cx-desktop-nav .site-expertise > summary').first().click();
   const summary=page.locator(size==='phone'?'.site-mobile-menu .site-expertise > summary,.cx-mobile-menu .site-expertise > summary':'.site-desktop-nav .site-expertise > summary,.cx-desktop-nav .site-expertise > summary').first();
   await summary.focus();await page.keyboard.press('Enter');assert.equal(await summary.evaluate(node=>node.parentElement.open),false,`${trade} ${size} keyboard close`);
   await page.keyboard.press('Enter');assert.equal(await summary.evaluate(node=>node.parentElement.open),true,`${trade} ${size} keyboard open`);
   await page.screenshot({path:join(out,`${trade.toLowerCase()}-${size}-dropdown.png`)});
   const menuCount=await page.locator(size==='phone'?'.site-mobile-menu .site-expertise-list a,.cx-mobile-menu .site-expertise-list a':'.site-desktop-nav .site-expertise-list a,.cx-desktop-nav .site-expertise-list a').count();
   assert.ok(menuCount>=links.length+1,`${trade} menu count`);
   const serviceUrl=`${base}/services/${service}`;
   const response=await page.goto(serviceUrl,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,serviceUrl);
   await page.locator('.sd-hero-art img,.tp-hero img').first().evaluate(image=>image.decode?.().catch(()=>{}));
   const state=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth-innerWidth,service:document.querySelector('#lead-form [name=service]')?.value,sections:[...document.querySelectorAll('main section[id]')].map(section=>section.id),structured:JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent||'null').map(item=>item['@type'])}));
   assert.equal(state.h1,1);assert.ok(state.overflow<=1,`${trade} ${size} overflow ${state.overflow}`);assert.ok(state.canonical.endsWith(`/services/${service}`));assert.deepEqual(state.structured,['LocalBusiness','Service']);
   await page.screenshot({path:join(out,`${trade.toLowerCase()}-${size}-service.png`),fullPage:true});
   if(size==='phone'){
    await page.locator('.site-mobile-menu > summary,.cx-mobile-menu > summary').first().click();
    await page.locator('.site-mobile-menu .site-expertise > summary,.cx-mobile-menu .site-expertise > summary').first().click();
   }else await page.locator('.site-desktop-nav .site-expertise > summary,.cx-desktop-nav .site-expertise > summary').first().click();
   assert.equal(await page.locator(size==='phone'?'.site-mobile-menu .site-expertise-list [aria-current="page"]':'.site-desktop-nav .site-expertise-list [aria-current="page"]').count(),1);
   await page.screenshot({path:join(out,`${trade.toLowerCase()}-${size}-service-dropdown.png`)});
   results.push({trade,size,viewport,homeOverflow,links,menuCount,state});
   await page.close();
  }
 }
 assert.deepEqual(errors,[]);
 writeFileSync(join(out,'browser-results.json'),JSON.stringify({results,errors},null,2));
 console.log(`PASS #004W captures: ${results.length} desktop/phone trade combinations, all links 200, SEO and structured data valid, no overflow or page errors.`);
}finally{await browser.close();await new Promise(done=>server.close(done))}
