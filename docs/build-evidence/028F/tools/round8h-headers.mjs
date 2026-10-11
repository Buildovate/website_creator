import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createRuntime,listen} from '../../../../src/aws/server.js';
import worker from '../../../../dist/server/index.js';
const root='C:/Users/joe/website_creator',stage=process.argv[2];
assert.ok(['before','after'].includes(stage));
const out=root+'/docs/build-evidence/028F/checks/round8h-headers/'+stage,origin='http://127.0.0.1:8298',name='Yoeliko Header QA';
fs.mkdirSync(out,{recursive:true});
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'header-logo@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8298',APP_ORIGIN:origin,OPENAI_API_KEY:'',GOOGLE_PLACES_API_KEY:'',YELP_API_KEY:''}});
const headers={origin,'content-type':'application/json','oai-authenticated-user-id':'header-logo-admin','oai-authenticated-user-email':'header-logo@example.test'};
const records=[],errors=[];let server,browser;
async function api(path,method='GET',value){const binary=value instanceof Uint8Array,r=await worker.fetch(new Request(origin+'/api'+path,{method,headers:{...headers,...(binary?{'content-type':'image/jpeg'}:{})},body:value===undefined?undefined:binary?value:JSON.stringify(value)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json();}
try{
 await api('/setup','POST',{});
 let {tenant}=await api('/tenants','POST',{designKit:'roofing',slug:'header-logo-qa',settings:{name,phone:'8054410199',area:'Ventura',journey:'roof-repair',services:[{name:'Roof repair'}],siteStyle:'current'}});
 server=await listen(runtime,8298);browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const art=await browser.newPage({viewport:{width:600,height:176}});
 await art.setContent('<html><body style="margin:0;background:#173b30;color:#f3f4ef;display:flex;gap:28px;align-items:center;height:176px;padding:0 28px;box-sizing:border-box;font:700 34px Arial,sans-serif"><svg aria-hidden="true" width="108" height="104" viewBox="0 0 108 104"><path d="M8 52 54 12l46 40M22 44v48h64V44M42 92V64h24v28" fill="none" stroke="#d2ef9e" stroke-width="8"/></svg><span>YOELIKO<br>HEADER QA</span></body></html>');
 const logoBytes=await art.screenshot({type:'jpeg',quality:95});fs.writeFileSync(out+'/uploaded-logo.jpg',logoBytes);await art.close();
 const photo=await api('/tenants/'+tenant.id+'/photos?caption=Header%20logo%20QA%20fixture','POST',logoBytes);
 tenant=(await api('/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,logoId:photo.id,logoContainsName:true}})).tenant;
 for(const look of ['current','bold','fresh','classic']){
  tenant=(await api('/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,siteStyle:look}})).tenant;
  for(const [device,width,height] of [['desktop',1440,900],['phone',390,844]]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',hasTouch:device==='phone'});
   try{
    assert.equal((await context.request.post(origin+'/auth/local-session',{headers:{origin},data:{userId:'header-logo-admin',email:'header-logo@example.test'}})).status(),200);
    const page=await context.newPage();page.on('pageerror',e=>errors.push({look,device,message:e.message}));
    await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
    const url=origin+'/s/'+tenant.slug+'?preview=1';assert.equal((await page.goto(url,{waitUntil:'load',timeout:60000})).status(),200);
    await page.evaluate(()=>document.fonts.ready);
    const header=page.locator('body > header').first();await header.locator('.site-brand-logo').evaluate(img=>img.decode());
    const observed=await header.evaluate(el=>{const img=el.querySelector('.site-brand-logo'),text=el.querySelector('.site-brand-name'),link=img.closest('a'),b=text.getBoundingClientRect();return {alt:img.getAttribute('alt'),imageAriaHidden:img.getAttribute('aria-hidden'),hiddenAttribute:text.hidden,textDisplay:getComputedStyle(text).display,textRects:text.getClientRects().length,textBox:{x:b.x,y:b.y,width:b.width,height:b.height},linkText:link.textContent.trim(),imageComplete:img.complete,naturalWidth:img.naturalWidth};});
    const file=look+'-'+device+'.png',crop=look+'-'+device+'-header.png';await page.screenshot({path:out+'/'+file});await header.screenshot({path:out+'/'+crop});
    records.push({look,device,width,height,url,mode:'Authorized draft preview; identical upload/settings flow in both stages',file,crop,...observed});
    if(stage==='after'){assert.equal(observed.alt,name);assert.notEqual(observed.imageAriaHidden,'true');assert.equal(observed.hiddenAttribute,true);assert.equal(observed.textDisplay,'none');assert.equal(observed.textRects,0);assert.equal(observed.textBox.width,0);assert.equal(observed.textBox.height,0);assert.ok(observed.imageComplete&&observed.naturalWidth>0);}
   }finally{await context.close();}
  }
 }
 assert.equal(errors.length,0,JSON.stringify(errors));
 console.log((stage==='after'?'PASS':'RECORDED')+' '+stage+' header evidence: '+records.length+' states, '+records.length*2+' screenshots, zero page errors');
}finally{
 fs.writeFileSync(out+'/results.json',JSON.stringify({stage,name,records,errors},null,2));
 if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));await runtime.close();
}
