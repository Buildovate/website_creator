import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import {seedWorkspaceEntitlements} from './helpers/workspace-payment-fixture.mjs';
import {openGameSection,mockGameBoard} from './helpers/game-navigation.mjs';
import {declareFailureFixture} from './helpers/platform-console.mjs';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from './fixtures/roofing-journey.mjs';
import {createReviewCapture} from '../src/aws/review-capture.js';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const phase=process.argv.includes('--before')?'before':'after',out=process.env.PLATFORM_MOBILE_EVIDENCE||releaseRepoRoot+"/docs/build-evidence/015A",base='http://127.0.0.1:8126';
fs.mkdirSync(out+'/'+phase,{recursive:true});
const runtime=await createRuntime({reviewCapture:createReviewCapture({browserModule:'playwright',executablePath:process.env.REVIEW_BROWSER_EXECUTABLE}),env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'mobile-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8126',APP_ORIGIN:base}});
if(phase==='before'){const currentAssets=runtime.env.ASSETS;runtime.env.ASSETS={fetch:async request=>{const pathname=new URL(request.url).pathname;if(pathname==='/app.js'||pathname==='/app.css')return new Response(fs.readFileSync(out+'/.baseline-client'+pathname),{headers:{'content-type':pathname.endsWith('.css')?'text/css':'application/javascript'}});return currentAssets.fetch(request);}};}
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'mobile-admin','oai-authenticated-user-email':'mobile-admin@example.test'};
async function api(path,method='GET',value){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json()}
// Complete the ordinary staff review API flow before any fixture publication.
// Browser evidence is real; contacts and decisions belong only to this ephemeral sample.
async function completeStaffReview(id,target='website'){
 const base='/tenants/'+id+'/review-packet',query='?target='+encodeURIComponent(target);
 let review=await api(base+query);
 await api(base+query,'POST',{versionHash:review.versionHash});
 const deadline=Date.now()+1200000;
 do{
  review=await api(base+query);
  assert.notEqual(review.packet?.status,'Capture failed',review.packet?.captureMessage);
  if(review.packet?.status==='Complete')break;
  assert.ok(Date.now()<deadline,'Staff review capture must finish');
  await new Promise(resolve=>setTimeout(resolve,250));
 }while(true);
 assert.equal(review.qa.summary.blocking,0,JSON.stringify(review.qa.report?.checks.filter(c=>c.result==='Fail')));
 for(const item of review.qa.report.checks.filter(c=>c.result==='Borderline')){
  await api(base+'/qa-decision'+query,'POST',{versionHash:review.versionHash,manifestHash:review.manifestHash,reportHash:review.qa.report.reportHash,checkId:item.id,decision:'Accept',reason:'Staff review of clearly fictional #057A-T local test data only; never approval of a contractor or saved Sample packet.'});
 }
 await api(base+'/decision'+query,'POST',{versionHash:review.versionHash,decision:'approve',checkedItems:review.packet.checklist.map(item=>item.id)});
 console.log('PASS staff review prerequisite',target,JSON.stringify({pages:review.packet.pages.length,clips:review.packet.clips.length,checklist:review.packet.checklist.length,blocking:review.qa.summary.blocking}));
}
await api('/setup','POST',{});const fixture=structuredClone(roofingFixture);fixture.slug='mobile-platform-qa';Object.assign(fixture.settings,{name:'Sample Fictional Test Roofing Co',owner:'Test Owner',phone:'(805) 555-0100',email:'roofing@example.com'});
let {tenant}=await api('/tenants','POST',fixture);await seedWorkspaceEntitlements(runtime.env.DB,tenant.id);await completeStaffReview(tenant.id);await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
const publicHome=await worker.fetch(new Request(base+'/s/'+tenant.slug),runtime.env);assert.equal(publicHome.status,200);assert.doesNotMatch(await publicHome.text(),/\(805\) 555-0123|tel:\+18055550123/,'Fixture phone must not reach published copy');
await runtime.env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind(crypto.randomUUID(),tenant.id,'mobile-owner','mobile-owner@example.test','owner',new Date().toISOString()).run();
const server=await listen(runtime,8126),browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE}),results={phase,screens:[],errors:[]};
try{
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));page.on('dialog',d=>d.accept());
await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'mobile-owner',email:'mobile-owner@example.test'}});await page.goto(base);await page.waitForSelector('[data-section=business]',{state:'attached'});
async function capture(name){const originalViewport=page.viewportSize();const originalScroll=await page.evaluate(()=>scrollY);
 await page.evaluate(name=>{document.activeElement?.blur();if(!document.querySelector('dialog[open]')&&!name.startsWith('questionnaire-')&&name!=='editor-preview'&&!name.endsWith('navigation')){const el=document.querySelector('#content>nav.tabs')?.nextElementSibling||document.querySelector('#content .metrics')||document.querySelector('#content');if(el)window.scrollTo(0,el.getBoundingClientRect().top+scrollY-20);}},name);await page.waitForTimeout(80);await page.screenshot({path:out+'/'+phase+'/'+name+'.png'});
 const data=await page.evaluate(()=>{
  const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&s.opacity!=='0'&&el.getAttribute('aria-hidden')!=='true'&&!el.closest('[hidden]')};
  const root=document.querySelector('dialog[open]')||document;
  const label=el=>(el.getAttribute('aria-label')||el.textContent||el.name||el.tagName).trim().slice(0,85);
  const controls=[...root.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,summary,[role=button]')].filter(visible);
  const small=controls.filter(el=>{const target=el.matches('[type=checkbox],[type=radio]')?(el.closest('label')||el):el;const r=target.getBoundingClientRect();return r.width<43.5||r.height<43.5}).map(label);
  const smallInputs=controls.filter(el=>el.matches('input:not([type=checkbox]):not([type=radio]):not([type=color]),select,textarea')&&parseFloat(getComputedStyle(el).fontSize)<16).map(label);
  const overflows=[...root.querySelectorAll('*')].filter(el=>visible(el)&&!el.matches('.smartlists,.contact-desktop-table,.contact-bulk-bar,.ex-tabs,.bv-game-chips')&&el.clientWidth>0&&el.scrollWidth>el.clientWidth+2&&['auto','scroll'].includes(getComputedStyle(el).overflowX)).map(el=>el.id||el.className||el.tagName);
  for(const el of controls){const r=el.getBoundingClientRect();if(!el.classList.contains('skip')&&!el.closest('.smartlists,.contact-desktop-table,.contact-bulk-bar,.ex-tabs,.bv-game-chips')&&(r.left< -1||r.right>innerWidth+1))overflows.push('clipped control: '+label(el));}
  const dock=document.querySelector('#hero-editor .hero-edit-actions')||document.querySelector('.platform-action-dock');const dr=dock?.getBoundingClientRect();const sticky=!!(dock&&!dock.hidden&&dr&&dr.height>=44&&getComputedStyle(dock).display!=='none'&&dr.bottom<=innerHeight+1&&dr.top>=0);return {stickyActions:sticky,actionRule:controls.some(b=>b.tagName==='BUTTON'&&!!b.closest('#content,dialog')&&/^(save |publish |upload photographs)/i.test(b.textContent?.trim()||''))?(innerWidth>720?'desktop':sticky?'pass':'fail'):'not applicable',camera:root.querySelector('input[type=file][accept*=image]')?(root.querySelector('input[capture]')?'control present; real device pending':'missing'):'not applicable',pageOverflow:document.documentElement.scrollWidth>innerWidth+1,overflows,smallTargets:small,smallInputs,heading:document.querySelector('h1')?.textContent,actions:[...root.querySelectorAll('button')].filter(visible).map(label)};
 });results.screens.push({name,viewport:page.viewportSize(),...data});fs.writeFileSync(out+'/'+phase+'-audit.json',JSON.stringify(results,null,2));console.log(name+': '+JSON.stringify({overflow:data.pageOverflow||data.overflows.length>0,targets:data.smallTargets.length,inputs:data.smallInputs.length}));
 if(phase==='after'&&originalViewport.width===390){await page.setViewportSize({width:1440,height:900});await capture('desktop-'+name);await page.setViewportSize(originalViewport);await page.evaluate(y=>scrollTo(0,y),originalScroll);}
}
await page.evaluate(()=>scrollTo(0,0));await capture('contractor-navigation');
const sections=await page.locator('nav[aria-label="Website settings"] [data-section]').evaluateAll(els=>els.map(el=>el.dataset.section));
for(const section of sections){if(phase==='before')await openGameSection(page,section);else await openGameSection(page,section);await page.waitForTimeout(120);await page.evaluate(()=>scrollTo(0,0));if(phase==='after'&&['contacts','calendar','inquiries','followups','access','backups','sales','readiness','plan','launchpad'].includes(section))assert.equal(await page.locator('.platform-action-dock button').filter({hasText:'Publish changes'}).count(),0);if(phase==='after'&&section==='contacts'){assert.equal(await page.locator('#contact-filters-open').isVisible(),true);assert.equal(await page.locator('.smartlists').isVisible(),false);assert.equal(await page.locator('#contact-new').evaluate(el=>el.classList.contains('primary')),true);await page.locator('#contact-filters-open').click();await page.locator('#filter-outcome').selectOption('Never called');await capture('contacts-filters-sheet');await page.locator('#filter-outcome').selectOption('');await page.locator('#filter-done').click();} await capture(section);
 if(section==='contacts'){
  for(const [control,name] of [['contact-import-mobile','contact-import'],['contact-columns-mobile','contact-columns'],['contact-tabs-mobile','contact-tabs-edit']]){await page.locator('#contact-filters-open').click();await page.locator('.filter-list-settings').evaluate(el=>el.open=true);await page.locator('#'+control).click();await page.waitForSelector('#dialog[open]');await capture('contacts-'+name);await page.locator('.dialog-close').click();await page.locator('#contact-filters').evaluate(el=>el.close());}
  await page.locator('#contact-filters-open').click();await page.locator('#filter-view').click();await page.waitForTimeout(100);await capture('contacts-board');await page.locator('#contact-filters-open').click();await page.locator('#filter-view').click();await page.waitForTimeout(100);
 }else if(section==='calendar'){
  await page.locator('#cal-settings').click();await page.waitForSelector('dialog[open]');await capture('calendar-cal-settings');await page.locator('.dialog-close').click();
  for(const view of ['week','day','agenda']){await page.locator('#cal-view').selectOption(view);await page.waitForTimeout(100);await capture('calendar-'+view);}await page.locator('#cal-view').selectOption('month');await page.waitForTimeout(100);
 }
if(section==='questionnaire'){
 const ids=await page.locator('#questionnaire section[id]').evaluateAll(els=>els.map(el=>el.id));for(const id of ids){await page.locator('#'+id).scrollIntoViewIfNeeded();await capture('questionnaire-'+id);}
 for(const [selector,name]of[['[data-q-add-location]','location'],['[data-q-add-program]','program'],['[data-q-add-offer]','offer']]){await page.locator(selector).click();await page.locator(selector).scrollIntoViewIfNeeded();await capture('questionnaire-new-'+name);}
 await page.reload();await page.waitForSelector('[data-section=business]',{state:'attached'});
 }
 if(section==='editor'){await page.locator('.preview-canvas').scrollIntoViewIfNeeded();await capture('editor-preview');}
 const dialogSelectors={business:'[data-action=upload]',services:'[data-action=specialty-picker]',projects:'[data-action=project-new]',access:'[data-action=invite]',domains:'[data-action=domain]',pages:'[data-ws-edit=pages]',forms:'[data-ws-edit=forms]',followups:'[data-ws-edit=followups]',visibility:'[data-ws-edit=visibility]',blog:'[data-ws-edit=blog]',contacts:'#contact-new',calendar:'#cal-add'};
 const selector=dialogSelectors[section];if(selector&&await page.locator(selector).count()){await page.locator(selector).first().click();await page.waitForSelector('dialog[open]');await capture(section+'-dialog');await page.locator('.dialog-close').click();await page.waitForSelector('dialog[open]',{state:'hidden'});}
}
await page.locator('[data-game-back]').click();await page.locator('.bv-game').waitFor({state:'visible'});await capture('overview');await page.locator('[data-game-phone=settings]').click();await capture('websites');

// Populated/long-content fixtures exercise list, detail and wrapped record states.
const scope='/workspace/'+tenant.id;
await api('/tenants/'+tenant.id+'/projects','POST',{title:'Fictional roofing repair project with a long title',city:'Ventura',service:'Roof repair',completedAt:'2025-01-01',lat:34.27,lng:-119.23,approved:false});
await api(scope+'/contacts','POST',{data:{name:'Fictional homeowner with a long contact name for wrapping',company:'Fictional Roofing Customer',phone:'8055550198',email:'qa@example.test',notes:'Local test notes. '.repeat(20)}});
await api(scope+'/pages','POST',{data:{title:'A detailed roofing planning page with a long title',slug:'planning',body:'Local fixture content. '.repeat(25)}});
await api(scope+'/forms','POST',{data:{name:'Roofing project planning inquiry with a long title',active:true,fields:[]}});
await api(scope+'/blog','POST',{data:{title:'Fictional roofing planning article with a detailed title',slug:'local-planning',body:'Fictional local article. '.repeat(20)}});
await api('/public/'+tenant.slug+'/inquiries','POST',{name:'Fictional Mobile Homeowner',phone:'8055550199',consent:true,message:'A long homeowner question with details about roof repair. '.repeat(15)});
await page.reload();await page.waitForSelector('[data-section=business]',{state:'attached'});
for(const section of ['pages','forms','blog','contacts','inquiries','projects','backups']){if(phase==='before')await openGameSection(page,section);else await openGameSection(page,section);await page.waitForTimeout(150);if(phase==='after'&&section==='contacts'){await page.evaluate(()=>{const el=document.querySelector('#crm-contact-slot');scrollTo(0,el.getBoundingClientRect().top+scrollY-20)});assert.ok(await page.locator('.contact-card').first().evaluate(el=>el.getBoundingClientRect().top)<844)}await capture(section+'-populated');
 if(section==='contacts'||section==='projects'){await page.locator(section==='contacts'?'.contact-card [data-detail]':'[data-action=project-edit]').first().click();await page.waitForSelector('dialog[open]');await capture(section+'-detail');await page.locator('.dialog-close').click();}
}
// Inventory entry points and this application's staff-only views too.
await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'mobile-admin',email:'mobile-admin@example.test'}});await page.goto(base);await page.waitForSelector('#navigation [data-view=overview]');
await page.evaluate(()=>scrollTo(0,0));await capture('admin-navigation');
const adminViews=await page.locator('#navigation [data-view]').evaluateAll(els=>els.map(e=>e.dataset.view));
for(const view of adminViews){if(await page.locator('#expense-menu').isVisible())await page.locator('#expense-menu').click();await page.locator('#navigation [data-view="'+view+'"]').click();await page.waitForTimeout(180);await capture('admin-'+view);}
await page.goto(base+'/login?signedOut=1');await capture('login');
await page.goto(base+'/join#fictional-invalid-invite');await page.waitForTimeout(150);await capture('join');
await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'mobile-owner',email:'mobile-owner@example.test'}});await page.goto(base);await page.waitForSelector('nav.tabs',{state:'attached'});
if(phase==='after'){
 // Real save/reopen and published-snapshot isolation from the phone action dock.
 await openGameSection(page,'business');await page.locator('[data-form=settings] [name=owner]').fill('Mobile workflow owner');
 await page.locator('.platform-action-dock button').filter({hasText:'Save business settings'}).click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('saved as draft'));
 let detail=await api('/tenants/'+tenant.id);assert.equal(detail.tenant.settings.owner,'Mobile workflow owner');assert.notEqual(detail.tenant.published.owner,'Mobile workflow owner');
 await openGameSection(page,'questionnaire');await page.locator('#questionnaire-form [name=owner]').fill('Questionnaire phone owner');await page.locator('.platform-action-dock button').filter({hasText:'Save questionnaire'}).click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Questionnaire saved'));
 await page.reload();await page.locator('.bv-game').waitFor();await openGameSection(page,'questionnaire');assert.equal(await page.locator('#questionnaire-form [name=owner]').inputValue(),'Questionnaire phone owner');
 const popupEvent=page.waitForEvent('popup');await page.locator('a[href^="/preview/"]').click();const popup=await popupEvent;await popup.waitForLoadState();assert.ok(popup.url().includes('/preview/'));await popup.close();
 await completeStaffReview(tenant.id);
 page.removeAllListeners('dialog');page.on('dialog',d=>d.accept());await page.locator('.platform-action-dock button').filter({hasText:'Publish changes'}).click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('published'),undefined,{timeout:1200000});
 detail=await api('/tenants/'+tenant.id);assert.equal(detail.tenant.published.owner,'Questionnaire phone owner');results.workflows={businessSave:true,questionnaireSaveReopen:true,publishedIsolation:true,privatePreview:true,explicitLocalPublish:true};
 await openGameSection(page,'business');await page.locator('[data-action=upload]').click();await page.waitForSelector('dialog[open]');
 const camera=page.locator('dialog input[capture]');assert.equal(await camera.getAttribute('capture'),'environment');await camera.dispatchEvent('cancel');assert.match(await page.locator('.phone-photo-preview').innerText(),/Camera closed/);await capture('upload-cancel');
 await camera.setInputFiles({name:'local-photo.png',mimeType:'image/png',buffer:fs.readFileSync(releaseRepoRoot+"/public/assets/premium-roofing/after.webp")});assert.equal(await page.locator('.phone-photo-preview img').count(),1);assert.equal(await page.locator('dialog .platform-action-dock button').filter({hasText:'Upload photographs'}).count(),1);assert.equal(await page.locator('dialog .photo-upload-submit').isVisible(),false);assert.equal(await page.locator('dialog .choose-photo').isVisible(),true);assert.equal(await page.locator('dialog input[type=file]:not([capture])').evaluate(el=>getComputedStyle(el,'::file-selector-button').backgroundColor),'rgb(255, 255, 255)');await capture('upload-preview');
 await page.route('**/api/tenants/*/photos?**',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Local test: upload unavailable. Try again.'})}));await page.locator('dialog .platform-action-dock button').click();await page.waitForFunction(()=>document.querySelector('#dialog-status').textContent.includes('unavailable'));await capture('upload-error');await page.unroute('**/api/tenants/*/photos?**');
 await page.locator('dialog .platform-action-dock button').click();await page.waitForSelector('dialog[open]',{state:'hidden'});detail=await api('/tenants/'+tenant.id);assert.equal(detail.photos.length,1);assert.ok(detail.photos[0].bytes>0);results.workflows.fileSelectionPreviewUploadRetry=true;results.workflows.cameraCancelHandler=true;results.workflows.realCamera='PENDING iPhone/Safari';await capture('upload-saved');

 for(const role of ['editor','viewer']){
  const endPermission=declareFailureFixture(page,{url:base+'/api/tenants/'+tenant.id+'/domains',status:403,state:'permission-'+role});
  await runtime.env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind(crypto.randomUUID(),tenant.id,'mobile-'+role,'mobile-'+role+'@example.test',role,new Date().toISOString()).run();
  await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'mobile-'+role,email:'mobile-'+role+'@example.test'}});await page.goto(base);await page.locator('.bv-game').waitFor();
  for(const section of ['business','questionnaire','editor','inquiries']){await openGameSection(page,section);await page.waitForTimeout(100);await capture(role+'-'+section);assert.equal(await page.locator('.platform-action-dock button').filter({hasText:'Publish changes'}).count(),0);if(role==='viewer')for(const b of await page.locator('.platform-action-dock button').all())assert.equal(await b.isDisabled(),true);}
  if(role==='viewer')assert.equal((await context.request.put(base+'/api/tenants/'+tenant.id,{headers:{origin:base},data:{settings:tenant.settings,version:tenant.version}})).status(),403);endPermission();
 }
 results.workflows.editorViewerRoleChecks=true;
 const failed=results.screens.filter(r=>(r.pageOverflow||r.overflows.length||r.smallTargets.length||r.smallInputs.length||r.actionRule==='fail'));results.layoutFailures=failed.map(r=>r.name);assert.deepEqual(results.errors,[]);fs.writeFileSync(out+'/'+phase+'-audit.json',JSON.stringify(results,null,2));assert.deepEqual(results.layoutFailures,[]);
}
fs.writeFileSync(out+'/'+phase+'-audit.json',JSON.stringify(results,null,2));await context.close();
}finally{await browser.close();await new Promise(r=>server.close(r));await runtime.close()}
