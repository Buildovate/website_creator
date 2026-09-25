import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createRuntime,listen} from '../../../src/aws/server.js';
import worker from '../../../dist/server/index.js';
import {roofingFixture} from '../../../tests/fixtures/roofing-journey.mjs';
import {promotionStates} from '../../../tests/fixtures/roofing-promotions.mjs';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='C:/Users/joe/website_creator/docs/build-evidence/015-v2',base='http://127.0.0.1:8126';
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'promotion-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8126',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'promotion-qa','oai-authenticated-user-email':'promotion-qa@example.test'};
async function api(path,method='GET',value){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json()}
await api('/setup','POST',{});const tenants={};
for(const state of ['current','upcoming','expired','none','off']){
 const fixture=structuredClone(roofingFixture);fixture.slug='fictional-promotion-'+state;fixture.settings.name='Fictional Roofing QA';fixture.settings.platform.promotions={enabled:state!=='off',offers:promotionStates[state]||[]};
 const {tenant}=await api('/tenants','POST',fixture);await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});tenants[state]=tenant;
}
const server=await listen(runtime,8126),browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results={profiles:[],errors:[]};
try{
 for(const [view,width,height,timezoneId]of[['desktop',1440,900,'America/Los_Angeles'],['mobile',390,844,'Asia/Tokyo']]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:view==='mobile',timezoneId,reducedMotion:'reduce'}),page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));const states=[];
  for(const state of ['current','upcoming','expired','none']){
   const path='/s/'+tenants[state].slug;await page.goto(base+path+'/promotions');
   if(state==='current'){
    const menu=page.locator('.site-mobile-menu'),summary=menu.locator('summary');
    if(view==='mobile'){
     assert.equal(await summary.isVisible(),true);assert.equal(await page.locator('.site-desktop-nav').isVisible(),false);
     await page.screenshot({path:out+'/mobile-menu-closed.png'});
     await summary.click();assert.equal(await menu.getAttribute('open'),'');
     const desktopLabels=await page.locator('.site-desktop-nav a').allTextContents(),mobileLabels=await menu.locator('nav a').allTextContents();
     assert.deepEqual(mobileLabels.slice(0,desktopLabels.length),desktopLabels);assert.match(mobileLabels.at(-1),/^Call /);
     assert.match(await menu.locator('.site-call-link').getAttribute('href'),/^tel:/);
     for(const link of await menu.locator('nav a').all()){const box=await link.boundingBox();assert.ok(box&&box.height>=44,'menu target >=44px');}
     await page.screenshot({path:out+'/mobile-menu-open.png'});
     await summary.focus();await page.keyboard.press('Enter');assert.equal(await menu.getAttribute('open'),null);
    }else{assert.equal(await summary.isVisible(),false);assert.equal(await page.locator('.site-desktop-nav').isVisible(),true);}
   }
   await page.locator('#offers').scrollIntoViewIfNeeded();
   assert.equal(await page.locator('[data-promotion-state]').count(),state==='none'?0:1);
   assert.equal(await page.locator('[data-promotion-quiz]').count(),state==='current'?1:0);
   const summary=page.locator('[data-promotion-state] summary');if(state!=='none'){await summary.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-promotion-state] details').getAttribute('open'),'');assert.match(await page.locator('.foundation-terms').innerText(),/No monetary value/);assert.match(await page.locator('.foundation-terms').innerText(),/Results are not guaranteed/);assert.doesNotMatch(await page.locator('#offers').innerText(),/<No guarantee>|UTC|\{\{/);const dates=await page.locator('.foundation-offer-dates time').allTextContents();assert.ok(dates.every(value=>/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(value)));if(state==='current'&&view==='mobile'){assert.deepEqual(dates,['Dec 31, 2019','Jan 1, 2099']);await page.locator('.foundation-offer-dates').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/mobile-date-format.png'});}}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,state+' horizontal overflow');
   await page.evaluate(()=>document.activeElement?.blur());
   const target=page.locator(state==='none'?'.foundation-empty':'[data-promotion-state]');
   await target.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-(document.querySelector('.shared-site-header')?.getBoundingClientRect().height||0)-20,behavior:'instant'}));
   await page.screenshot({path:out+'/'+view+'-'+state+'.png'});
   if(state==='current'&&view==='mobile'){await page.locator('.foundation-terms').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/'+view+'-'+state+'-terms.png'});}
   if(state==='current'){
    await page.waitForFunction(()=>typeof document.querySelector('[data-promotion-quiz]').onsubmit==='function');await page.locator('[name=answer][value="1"]').check();await page.locator('[data-promotion-quiz] button').click();await page.waitForFunction(()=>document.querySelector('[data-unlock-status]').textContent.includes('not quite right'));
    assert.ok(!(await page.content()).includes('QA-015-PRIVATE-CODE'));await page.locator('[name=answer][value="0"]').check();await page.locator('[data-promotion-quiz] button').click();await page.waitForFunction(()=>document.querySelector('[data-unlock-status]').textContent.includes('QA-015-PRIVATE-CODE'));await page.locator('[data-unlock-status]').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/'+view+'-verified.png'});
   }
   states.push({state,passed:true});
  }
  await page.goto(base+'/s/'+tenants.current.slug);const strip=page.locator('[data-promotion-strip]');await strip.scrollIntoViewIfNeeded();await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('[data-promotion-strip]')).paddingLeft)>0);await strip.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-(document.querySelector('.cx-header')?.getBoundingClientRect().height||0)-20,behavior:'instant'}));await page.screenshot({path:out+'/'+view+'-homepage-strip.png'});assert.equal(await strip.locator('a').getAttribute('href'),'/s/'+tenants.current.slug+'/promotions');
  await page.goto(base+'/s/'+tenants.off.slug);assert.equal(await page.locator('[data-promotion-strip]').count(),0);assert.equal((await page.request.get(base+'/s/'+tenants.off.slug+'/promotions')).status(),404);
  await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'promotion-qa',email:'promotion-qa@example.test'}});await page.goto(base+'/s/'+tenants.current.slug+'/promotions?preview=1');assert.equal(await page.locator('[data-promotion-quiz] button').isDisabled(),true);await page.locator('[data-promotion-quiz] button').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/'+view+'-preview.png'});
  results.profiles.push({view,width,height,timezoneId,states,wrongAnswerRejected:true,verifiedCodeOnly:true,keyboardTerms:true,previewDisabled:true,pageSwitch:true,passed:true});console.log('PASS '+view+': four display states, terms, quiz, homepage switch and preview');await context.close();
 }
 const staticContext=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});const staticPage=await staticContext.newPage();await staticPage.goto(base+'/s/'+tenants.current.slug+'/promotions');await staticPage.locator('.site-mobile-menu summary').click();assert.equal(await staticPage.locator('.site-mobile-menu').getAttribute('open'),'');await staticPage.locator('.site-mobile-menu summary').click();await staticPage.locator('summary').last().click();await staticPage.locator('[data-promotion-quiz] noscript').scrollIntoViewIfNeeded();await staticPage.screenshot({path:out+'/mobile-no-js.png'});assert.match(await staticPage.locator('#offers').innerText(),/JavaScript is needed/);await staticContext.close();
 assert.deepEqual(results.errors,[]);results.noJavaScript=true;writeFileSync(out+'/browser-results.json',JSON.stringify(results,null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));await runtime.close()}
