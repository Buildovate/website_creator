import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {resolve,extname,join} from 'node:path';
import {createRequire} from 'node:module';
import {worker,env,admin} from '../../../tests/preview-fixture.mjs';
import {ROBLES} from '../../../src/core.js';
import library from '../../../public/trade-library.json' with {type:'json'};
import {serviceBrief} from '../../../src/service-content.js';

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='C:/Users/joe/website_creator',out=join(root,'docs/build-evidence/004W-v2');
const port=8141,origin=`http://127.0.0.1:${port}`;
const mime={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.avif':'image/avif','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4'};
async function api(path,method='GET',data){const response=await worker.fetch(new Request(origin+'/api'+path,{method,headers:{origin,'content-type':'application/json','oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email},body:data?JSON.stringify(data):undefined}),env);assert.equal(response.status,200,await response.clone().text());return response.json()}
for(const [trade,slug,template] of [['HVAC','hvac-004w-v2','editorial'],['Patios','patios-004w-v2','editorial']]){
 let {tenant}=await api('/tenants','POST',{designKit:trade.toLowerCase(),slug,settings:{name:`${trade} Fixture`,trade,phone:'8055550102',area:'Ventura',address:'Ventura, CA 93001',template,services:library[trade].map(name=>({name,description:''}))}});
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
 for(const [trade,slug,serviceList] of [['Roofing','robles-roofing',['roof-repair','storm-damage']],['HVAC','hvac-004w-v2',['air-conditioning-installation','ductwork']],['Patios','patios-004w-v2',['patio-covers','motorized-pergolas']]]){
  for(const [size,viewport] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}]]){
   const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:size==='phone'});
   page.on('pageerror',error=>errors.push({trade,size,message:error.message}));
   const base=`${origin}/s/${slug}`;
   const home=await page.goto(base,{waitUntil:'domcontentloaded'});assert.equal(home.status(),200);
   const homeOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.ok(homeOverflow<=1,`${trade} ${size} homepage overflow ${homeOverflow}`);
   await page.locator('#services').scrollIntoViewIfNeeded();
   const cards=page.locator('#services article');
   const rows=await cards.evaluateAll(nodes=>nodes.map(node=>({title:node.querySelector('h3')?.textContent.trim(),blurb:node.querySelector('p')?.textContent.trim(),href:node.querySelector('a[href*="/services/"]')?.getAttribute('href')})).filter(row=>row.href));
   const links=rows.map(row=>row.href);
   assert.ok(links.length>=8,`${trade} cards: ${JSON.stringify(links)}`);
   assert.equal(new Set(rows.map(row=>row.blurb)).size,rows.length,`${trade} duplicate blurbs`);
   for(const row of rows){
    assert.equal(row.blurb,serviceBrief(trade,row.title).card,`${trade} ${row.title}`);
    assert.equal((await page.request.get(origin+row.href)).status(),200,`${trade}: ${row.href}`);
   }
   await page.locator('#services').screenshot({path:join(out,`after-${trade.toLowerCase()}-${size}-cards.png`)});
   await page.evaluate(()=>scrollTo(0,0));
   if(size==='phone'){
    await page.locator('.site-mobile-menu > summary,.cx-mobile-menu > summary').first().click();
    await page.locator('.site-mobile-menu .site-expertise > summary,.cx-mobile-menu .site-expertise > summary').first().click();
   }else await page.locator('.site-desktop-nav .site-expertise > summary,.cx-desktop-nav .site-expertise > summary').first().click();
   const summary=page.locator(size==='phone'?'.site-mobile-menu .site-expertise > summary,.cx-mobile-menu .site-expertise > summary':'.site-desktop-nav .site-expertise > summary,.cx-desktop-nav .site-expertise > summary').first();
   await summary.focus();await page.keyboard.press('Enter');assert.equal(await summary.evaluate(node=>node.parentElement.open),false,`${trade} ${size} keyboard close`);
   await page.keyboard.press('Enter');assert.equal(await summary.evaluate(node=>node.parentElement.open),true,`${trade} ${size} keyboard open`);
   await page.screenshot({path:join(out,`after-${trade.toLowerCase()}-${size}-dropdown.png`)});
   const menuCount=await page.locator(size==='phone'?'.site-mobile-menu .site-expertise-list a,.cx-mobile-menu .site-expertise-list a':'.site-desktop-nav .site-expertise-list a,.cx-desktop-nav .site-expertise-list a').count();
   assert.ok(menuCount>=links.length+1,`${trade} menu count`);
   const states=[];
   for(const service of serviceList){
    const serviceUrl=`${base}/services/${service}`;
    const response=await page.goto(serviceUrl,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,serviceUrl);
    await page.locator('.sd-hero-art img').evaluate(image=>image.decode?.().catch(()=>{}));
    const state=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth-innerWidth,service:document.querySelector('#lead-form [name=service]')?.value,sections:[...document.querySelectorAll('main section[id]')].map(section=>section.id),structured:JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent||'null').map(item=>item['@type']),images:document.querySelectorAll('main figure img').length,workCards:document.querySelectorAll('#work .sd-work a').length,workImages:document.querySelectorAll('#work .sd-work img').length,signs:[...document.querySelectorAll('.sd-sign-list h3')].map(node=>node.textContent.trim()),steps:[...document.querySelectorAll('.sd-steps p')].map(node=>node.textContent.trim()),questions:[...document.querySelectorAll('.sd-faq summary')].map(node=>node.textContent.trim())}));
    assert.equal(state.h1,1);assert.ok(state.overflow<=1,`${trade} ${size} ${service} overflow ${state.overflow}`);assert.ok(state.canonical.endsWith(`/services/${service}`));assert.deepEqual(state.structured,['LocalBusiness','Service']);
    assert.equal(state.images,3);assert.equal(state.signs.length,3);assert.equal(state.steps.length,4);assert.equal(state.questions.length,3);
    assert.equal(state.workCards,state.workImages,'Our Work must not contain image placeholders');
    if(state.sections.includes('work'))assert.ok(state.workCards>0,'Our Work must contain a real project');
    await page.screenshot({path:join(out,`after-${trade.toLowerCase()}-${size}-${service}.png`),fullPage:true});
    states.push({service,...state});
   }
   assert.equal(new Set(states.flatMap(state=>state.signs)).size,6);
   assert.equal(new Set(states.flatMap(state=>state.steps)).size,8);
   assert.equal(new Set(states.flatMap(state=>state.questions)).size,6);
   results.push({trade,size,viewport,homeOverflow,links,menuCount,states});
   await page.close();
  }
 }
 assert.deepEqual(errors,[]);
 writeFileSync(join(out,'browser-results.json'),JSON.stringify({results,errors},null,2));
 console.log(`PASS #004W-v2 captures: ${results.length} desktop/phone trade combinations, two unique service pages each, no placeholders, overflow, or page errors.`);
}finally{await browser.close();await new Promise(done=>server.close(done))}
