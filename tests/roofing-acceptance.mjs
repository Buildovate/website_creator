import {openGameSection,mockGameBoard} from './helpers/game-navigation.mjs';
// #028 Roofing homeowner acceptance is exercised against an isolated local runtime.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028';
const base='http://127.0.0.1:8181',slug='roofing-acceptance-028';
process.chdir(root);
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const result={checks:[],pages:[],screenshots:[],failures:[],browserErrors:[],assets:[],headers:[],inquiry:null};
const check=(value,label)=>{assert.ok(value,label);result.checks.push(label)};
fs.mkdirSync(out+'/screenshots',{recursive:true});
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'acceptance@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8181',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'acceptance-admin','oai-authenticated-user-email':'acceptance@example.test'};
async function api(path,method='GET',data){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json()}
await api('/setup','POST',{});
const settings={siteStyle:'current',name:'QA Roofing Acceptance',journey:'roof-repair',phone:'8054410199',owner:'QA Owner',ownerStatement:'I listen before I quote.',area:'Ventura County',serviceAreas:[{city:'Ventura'},{city:'Oxnard'},{city:'Camarillo'}],services:['Roof installation','Roof repair','Roof replacement','Asphalt shingles','Metal roofing','Flat roofs','Roof maintenance','Gutters'].map(name=>({name})),ebook:{enabled:true,reviewedRevision:'roofing-guide-022-v1'},platform:{financing:{enabled:true,lenders:[{id:'hearth',enabled:true,confirmed:true,applicationUrl:'https://merchant.example.test/roofing'}],programs:[{id:'qa-term',lenderId:'hearth',name:'QA configured terms',apr:6,months:36,enabled:true,confirmed:true}]},promotions:{enabled:true,offers:[]}}};
const {tenant}=await api('/tenants','POST',{designKit:'roofing',slug,settings});
await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind('acceptance-owner',tenant.id,'acceptance-owner','owner-acceptance@example.test','owner',new Date().toISOString()).run();
const films=JSON.parse(fs.readFileSync(root+'/public/planning-films.json')).slots;
for(const [slot,status] of [['roofing-financing-ambient','Ready'],['roofing-financing-scroll','Pending'],['roofing-promotions-ambient','Ready'],['roofing-promotions-scroll','Ready']]){check(films[slot]?.status===status,'media slot '+slot+' '+status);check(fs.existsSync(root+'/public'+films[slot].poster),'poster available '+slot)}
const baselines=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/outside-scope-baseline.json'));
for(const {row} of baselines){const keys=Object.keys(row);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run()}
const server=await listen(runtime,8181),browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const seenAssets=new Set();
const route='/s/'+slug;
const safeName=path=>path===route?'home':path.slice(route.length+1).replaceAll('/','-');
async function shot(page,name,fullPage=true){await page.screenshot({path:out+'/screenshots/'+name+'.jpg',type:'jpeg',quality:78,fullPage});result.screenshots.push('screenshots/'+name+'.jpg')}
async function waitReady(page){await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(180)}
async function navAlignment(page,selector='[data-nav-fit].site-desktop-nav,.site-desktop-nav,.cx-desktop-nav'){
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(selector=>{const nav=document.querySelector(selector);return nav&&(!nav.matches('[data-nav-fit]')||nav.classList.contains('site-nav-fit-ready'))},selector,{timeout:10000});
 return page.evaluate(async selector=>{
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const nav=document.querySelector(selector),visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&!el.closest('[hidden]')};
  const links=[...nav.querySelectorAll(':scope > a,:scope > .site-nav-links > a')].filter(el=>visible(el)&&!el.hasAttribute('data-nav-cta'));
  const first=links.find(el=>/^(Services|Expertise)$/i.test(el.textContent.trim()))||links[0],peer=links.find(el=>el!==first&&/^(Areas|Pricing)$/i.test(el.textContent.trim()))||links.find(el=>el!==first);
  if(!first||!peer)return null;
  const measure=(item,link)=>{const a=getComputedStyle(item),b=getComputedStyle(link),x=item.getBoundingClientRect(),y=link.getBoundingClientRect();return {summary:a.fontSize+' '+a.fontWeight,link:b.fontSize+' '+b.fontWeight,baseline:Math.abs((x.top+x.height/2)-(y.top+y.height/2))}};
  const summary=nav.querySelector('.site-expertise>summary');
  return {...measure(first,peer),...(summary&&visible(summary)?{expertise:measure(summary,peer)}:{})};
 },selector);
}
async function settlePage(page){const height=await page.evaluate(()=>document.documentElement.scrollHeight),step=await page.evaluate(()=>Math.max(500,Math.floor(innerHeight*.8)));for(let y=0;y<height;y+=step){await page.evaluate(value=>scrollTo(0,value),y);await page.waitForTimeout(25)}await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(700)}
async function testAssets(context,page,label){
 const refs=await page.evaluate(()=>[...document.querySelectorAll('img[src],source[src],video[poster],script[src],link[rel=stylesheet][href],img[srcset],source[srcset],link[imagesrcset]')].flatMap(el=>{const raw=[el.getAttribute('src'),el.getAttribute('poster'),el.getAttribute('href')].filter(Boolean);for(const value of [el.getAttribute('srcset'),el.getAttribute('imagesrcset')].filter(Boolean))raw.push(...value.split(',').map(part=>part.trim().split(/\s+/)[0]));return raw}));
 for(const ref of refs){const url=new URL(ref,base);if(url.origin!==base||seenAssets.has(url.href))continue;seenAssets.add(url.href);const r=await context.request.get(url.href);check(r.status()>=200&&r.status()<400,'asset '+ref+' '+label);result.assets.push({url:url.pathname,status:r.status()})}
}
async function pageCheck(context,page,path,device,mode='normal'){
 const label=safeName(path)+'-'+device+'-'+mode;
 const response=await page.goto(base+path,{waitUntil:'domcontentloaded'});
 check(response?.status()===200,'HTTP 200 '+label);
 await waitReady(page);
 check(await page.locator('h1').count()===1,'one H1 '+label);
 const forms=await page.locator('main form').evaluateAll(xs=>xs.map(form=>({id:form.id,actions:[...form.querySelectorAll('button,input[type=submit]')].filter(el=>el.tagName==='BUTTON'&&(!el.getAttribute('type')||el.getAttribute('type')==='submit')||el.getAttribute('type')==='submit').length})));
 check(forms.every(form=>form.actions===1),'one submit per form '+label+' '+JSON.stringify(forms));
 const overflow=await page.evaluate(()=>({window:innerWidth,scroll:document.documentElement.scrollWidth,items:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+2&&getComputedStyle(el).position!=='fixed'}).slice(0,8).map(el=>({tag:el.tagName,cls:String(el.className).slice(0,80),right:Math.round(el.getBoundingClientRect().right)}))}));
 check(overflow.scroll<=overflow.window+1,'no overflow '+label+' '+JSON.stringify(overflow));
 const h1=await page.locator('h1').first().innerText();
 if(mode==='normal'){await settlePage(page);await testAssets(context,page,label);await shot(page,label)}
 const shifts=await page.evaluate(()=>window.__cls?.map(e=>({value:e.value,sources:e.sources?.map(s=>({node:s.node?.className||s.node?.tagName,old:s.previousRect,new:s.currentRect}))}))||[]);const cls=shifts.reduce((total,e)=>total+e.value,0);
 if(cls<=.05)result.checks.push('CLS <= .05 '+label);else result.failures.push({path,device,mode,error:'CLS '+cls,shifts:shifts.slice(0,5)});
 if(mode==='reduced')check(await page.evaluate(()=>document.getAnimations().every(animation=>animation.playState!=='running')),'reduced motion static '+label);
 if(mode==='nojs')check(await page.locator('main').innerText().then(t=>t.length>100),'no-JS content '+label);
 result.pages.push({path,device,mode,h1,cls});
}
try{
 const discovery=await browser.newContext({viewport:{width:1440,height:900}}),p0=await discovery.newPage();
 await p0.goto(base+route+'/services');
 const services=await p0.locator('a[href*="/services/"]').evaluateAll(xs=>[...new Set(xs.map(x=>new URL(x.href).pathname).filter(x=>x.includes('/services/')))]);
 await p0.goto(base+route+'/areas');
 const cities=await p0.locator('a[href*="/areas/"]').evaluateAll(xs=>[...new Set(xs.map(x=>new URL(x.href).pathname).filter(x=>x.includes('/areas/')))]);
 check(services.length===8,'eight offered Roofing service pages discovered');
 check(cities.length===3,'three service-area city pages discovered');
 await discovery.close();
 const paths=[route,route+'/services',...services,route+'/areas',...cities,route+'/faq',route+'/about',route+'/promotions',route+'/financing',route+'/contact',route+'/legal',route+'/resources/before-you-decide-on-your-roof',route+'/thank-you'];
 for(const [device,width,height] of [['desktop',1440,900],['phone',390,844]]){
  for(const mode of ['normal','nojs','reduced']){
   const context=await browser.newContext({viewport:{width,height},hasTouch:device==='phone',javaScriptEnabled:mode!=='nojs',reducedMotion:mode==='reduced'?'reduce':'no-preference'});
   await context.addInitScript(()=>{window.__cls=[];try{new PerformanceObserver(list=>window.__cls.push(...list.getEntries().filter(x=>!x.hadRecentInput))).observe({type:'layout-shift',buffered:true})}catch{}});
   const page=await context.newPage();page.on('pageerror',e=>result.browserErrors.push({device,mode,error:e.message}));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)result.browserErrors.push({device,mode,error:'HTTP '+r.status()+' '+r.url()})});
   for(const path of paths){try{await pageCheck(context,page,path,device,mode)}catch(e){result.failures.push({path,device,mode,error:e.message});throw e}}
   if(mode==='normal'){
    await page.goto(base+route);await waitReady(page);
    const footer=await page.locator('footer a[href]').evaluateAll(xs=>xs.map(x=>({text:x.textContent.trim(),href:x.getAttribute('href')})).filter(x=>x.href?.startsWith('/')));
    for(const item of footer){const r=await context.request.get(base+item.href);check(r.status()===200,'footer link '+item.text+' '+device)}
    await page.locator('#services').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-(document.querySelector('.cx-header')?.getBoundingClientRect().height||0)-8,behavior:'instant'}));await page.waitForTimeout(250);
    const cards=await page.locator('.cx-service-grid article').evaluateAll(xs=>xs.map(x=>{const image=x.querySelector('img'),h=x.querySelector('h3'),p=x.querySelector('p');return {opacity:getComputedStyle(x).opacity,imageOpacity:getComputedStyle(image).opacity,filter:getComputedStyle(image).filter,hColor:getComputedStyle(h).color,pColor:getComputedStyle(p).color}}));
    const contrast=value=>{const nums=value.match(/[\d.]+/g)?.slice(0,3).map(Number)||[0,0,0],light=nums.map(n=>{const c=n/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4}),l=.2126*light[0]+.7152*light[1]+.0722*light[2];return 1.05/(l+.05)};
    check(cards.every(x=>x.opacity==='1'&&x.imageOpacity==='1'&&x.filter==='none'&&contrast(x.hColor)>=4.5&&contrast(x.pColor)>=4.5),'WCAG AA full-contrast Roofing cards '+device);
    await shot(page,'polish-service-cards-after-'+device,false);
    const header=await page.locator('.cx-desktop-nav').isVisible().catch(()=>false);
    if(header){const geom=await navAlignment(page,'.cx-desktop-nav');check(geom&&geom.summary===geom.link&&geom.baseline<=3,'light header nav links match '+device+' '+JSON.stringify(geom));if(geom?.expertise)check(geom.expertise.summary===geom.expertise.link&&geom.expertise.baseline<=3,'light header Expertise peer alignment '+device+' '+JSON.stringify(geom.expertise));await shot(page,'polish-header-after-'+device,false)}else{await page.evaluate(()=>scrollTo(0,0));await page.locator('.cx-mobile-menu > summary').click();await shot(page,'polish-header-after-'+device,false)}
    await page.goto(base+route+'/contact');await waitReady(page);
    const form=page.locator('#lead-form');check(await form.count()===1,'one inquiry form '+device);check(await form.locator('button').count()===1,'one form save action '+device);
    await form.locator('[name=service]').selectOption('Roof repair');
    const cityField=form.locator('[name=projectCity]');if(await cityField.getAttribute('type')==='hidden')check((await cityField.inputValue()).length>0,'contact city preset '+device);else await cityField.fill('Ventura');
    await form.locator('[name=message]').fill('Local #028 acceptance inquiry; no customer.');
    await form.locator('[name=name]').fill('QA Acceptance');
    const phone=device==='desktop'?'8055550928':'8055550929';
    await form.locator('[name=phone]').fill(phone);
    await form.locator('[name=consent]').check();
    await form.locator('button').click();
    await page.waitForURL('**/thank-you');
    check(await page.locator('h1').isVisible(),'saved inquiry confirmation '+device);
    const detail=await api('/tenants/'+tenant.id);
    check(detail.inquiries.some(x=>x.phone===phone&&x.message.includes('Local #028 acceptance inquiry')),'real local inquiry saved '+device);
    result.inquiry={count:detail.inquiries.length,phones:detail.inquiries.map(x=>x.phone)};
    await shot(page,'saved-inquiry-confirmation-'+device,false);
    const auth=await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'acceptance-owner',email:'owner-acceptance@example.test'}});
    check(auth.status()===200,'local owner session '+device+' '+auth.status());
    await page.goto(base);await page.waitForSelector('[data-section=templates]',{state:'attached'});
    if(device==='desktop')await openGameSection(page,'templates');else await openGameSection(page,'templates');
    await page.waitForSelector('#generation-panel[data-state=ready]');
    const status=await page.locator('#generation-status').innerText();check(status.includes('Your current ones stay in place.'),'plain-language status '+device+' '+status);
    await page.locator('#generation-panel').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-14,behavior:'instant'}));await page.waitForTimeout(150);
    await shot(page,'polish-design-locks-after-'+device,false);
    await page.close();
   }
   await context.close();
  }
 }
 for(const {row} of baselines){const ctx=await browser.newContext({viewport:{width:1440,height:900}}),page=await ctx.newPage();await page.goto(base+'/s/'+row.slug);const h=await navAlignment(page);check(h&&h.summary===h.link&&h.baseline<=3,'Nav link alignment '+row.slug+' '+JSON.stringify(h));if(h?.expertise)check(h.expertise.summary===h.expertise.link&&h.expertise.baseline<=3,'Expertise peer alignment '+row.slug+' '+JSON.stringify(h.expertise));result.headers.push({kit:row.slug,...h});await ctx.close()}
 check(result.browserErrors.length===0,'zero browser exceptions');
 if(result.failures.length)process.exitCode=1;
 console.log(JSON.stringify({checks:result.checks.length,pages:result.pages.length,screenshots:result.screenshots.length,assets:result.assets.length,headers:result.headers.length,failures:result.failures.length}));
}finally{fs.writeFileSync(out+'/acceptance-results.json',JSON.stringify(result,null,2));await browser.close();await new Promise(resolve=>server.close(resolve));await runtime.close()}
