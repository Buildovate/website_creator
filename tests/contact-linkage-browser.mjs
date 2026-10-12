import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from './fixtures/roofing-journey.mjs';

const require=createRequire(import.meta.url),{chromium}=require('playwright');
const base='http://127.0.0.1:8142',out=releaseRepoRoot+"/docs/build-evidence/015E";fs.mkdirSync(out,{recursive:true});
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'linkage-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8142',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'linkage-admin','oai-authenticated-user-email':'linkage-admin@example.test'};
async function api(path,method='GET',value){const response=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(response.status,200,await response.clone().text());return response.json()}
await api('/setup','POST',{});
const fixture=structuredClone(roofingFixture);fixture.slug='linked-roofing-qa';fixture.settings.name='Linked Roofing QA';const {tenant}=await api('/tenants','POST',fixture);
const linked=await api('/workspace/global/contacts','POST',{data:{company:'Linked Roofing QA',name:'Avery Sample',phone:'8055550102',email:'avery@fixture.test',trade:'Roofing',stage:'Paid'}});
let contact=(await api('/workspace/global/contacts/'+linked.id)).record;await api('/flow/link-website','POST',{contactId:linked.id,tenantId:tenant.id,version:contact.version});
const prepare=await api('/workspace/global/contacts','POST',{data:{company:'Fictional Coast Roofing',name:'Jamie Sample',phone:'8055550135',email:'jamie@fixture.test',trade:'Roofing',stage:'Called'}});
const start=new Date(Date.now()+14*86400000).toISOString(),end=new Date(Date.parse(start)+60*60000).toISOString();
const appointment=await api('/workspace/global/calendar','POST',{data:{title:'Website walkthrough · Fictional Coast Roofing',contactId:prepare.id,assignees:[headers['oai-authenticated-user-email']],start,end,status:'Scheduled',timezone:'America/Los_Angeles',meetingType:'Phone',interests:['Website Design'],reminderEmail:true,reminderSms:false}});
const server=await listen(runtime,8142),browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE}),results={phone:{},desktop:{},errors:[]};
async function navigate(page,name){await page.evaluate(name=>document.querySelector(`[data-action="nav"][data-view="${name}"]`)?.click(),name);await page.waitForFunction(name=>document.querySelector(`[data-action="nav"][data-view="${name}"]`)?.classList.contains('active'),name)}
async function capture(page,name){await page.screenshot({path:out+'/'+name+'.png'});return name+'.png'}
async function show(page,selector){await page.locator(selector).first().scrollIntoViewIfNeeded();await page.waitForTimeout(100)}
try{
 for(const [device,viewport] of [['phone',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
  const context=await browser.newContext({viewport,hasTouch:device==='phone',reducedMotion:'reduce'}),page=await context.newPage();page.on('pageerror',error=>results.errors.push(error.message));
  await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'linkage-admin',email:'linkage-admin@example.test'}});
  await page.goto(base);await page.waitForSelector('[data-action="nav"][data-view="contacts"]');
  const state=results[device];state.viewport=viewport;
  await navigate(page,'overview');await page.waitForSelector('.prep-tasks');assert.equal(await page.locator('.prep-tasks [data-prepare-contact="'+prepare.id+'"]').count(),1);state.overview=await capture(page,device+'-walkthrough-prep-overview');
  await navigate(page,'websites');await page.waitForSelector('th:has-text("Customer")');assert.equal(await page.locator('tbody').getByText('Linked Roofing QA').count()>0,true);state.websiteTable=await capture(page,device+'-website-customer-link');
  await navigate(page,'customers');await page.waitForSelector('[data-contact-card="'+linked.id+'"]',{state:'attached'});const customerRow=device==='phone'?page.locator('[data-contact-card="'+linked.id+'"]'):page.locator('.crm-table tbody tr').filter({has:page.locator('[data-detail="'+linked.id+'"]')}).first();assert.equal(await customerRow.locator('[data-customer-portal]').isVisible(),true);await customerRow.scrollIntoViewIfNeeded();state.customerPortal=await capture(page,device+'-customer-portal-action');
  await navigate(page,'contacts');await page.waitForSelector('[data-contact-card="'+linked.id+'"]',{state:'attached'});
  const row=device==='phone'?page.locator('[data-contact-card="'+linked.id+'"]'):page.locator('.crm-table tbody tr').filter({has:page.locator('[data-detail="'+linked.id+'"]')}).first();
  await show(page,device==='phone'?'[data-contact-card="'+linked.id+'"]':'.contact-desktop-table');
  assert.equal(await row.locator('[data-quick-menu]').isVisible(),true);assert.equal(await row.locator('select.quick-action').count(),0);
  if(device==='phone'){
   assert.equal(await row.locator('[data-detail]').count(),1);assert.equal(await row.locator('.row-actions [data-detail]').count(),0);
   for(const attr of ['data-no-answer','data-callback','data-book-appt','data-quick-menu'])assert.equal(await row.locator('['+attr+']').count(),1);
   await row.locator('[data-select-contact]').check();assert.equal(await page.locator('#dialog[open]').count(),0);await row.locator('[data-select-contact]').uncheck();
   const actionTops=await row.locator('.row-actions>button,.row-actions>.quick-menu').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().top));assert.ok(Math.max(...actionTops)-Math.min(...actionTops)<8,JSON.stringify(actionTops));
   state.actions=await capture(page,'phone-contact-card-actions');
  }else state.actions=await capture(page,'desktop-contact-row-actions');
  await row.locator('[data-quick-menu]').click();await page.waitForSelector('.quick-menu-list:popover-open');assert.equal(await row.locator('[data-quick-menu]').getAttribute('aria-expanded'),'true');
  const box=await page.locator('.quick-menu-list:popover-open').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=viewport.width,JSON.stringify(box));
  assert.equal(await page.locator('.quick-menu-list:popover-open [data-quick-choice]').count(),5);state.more=await capture(page,device+'-contact-more-open');
  await page.keyboard.press('Escape');await page.waitForSelector('.quick-menu-list:popover-open',{state:'hidden'});assert.equal(await row.locator('[data-quick-menu]').getAttribute('aria-expanded'),'false');
  await row.locator('[data-detail]').first().click();await page.waitForSelector('.contact-website-link');assert.equal(await page.locator('#detail-open-website').isVisible(),true);state.link=await capture(page,device+'-linked-contact-detail');
  await page.locator('.dialog-close').click();
  const prepRow=device==='phone'?page.locator('[data-contact-card="'+prepare.id+'"]'):page.locator('.crm-table tbody tr').filter({has:page.locator('[data-detail="'+prepare.id+'"]')}).first();
  await prepRow.locator('[data-detail]').first().click();await page.waitForSelector('#detail-prepare-design');await page.locator('#detail-prepare-design').click();await page.waitForSelector('#prepare-design');state.prepare=await capture(page,device+'-prepare-design');await page.locator('.dialog-close').click();
  await navigate(page,'calendar');await page.waitForSelector('#cal-view');await page.locator('#cal-view').selectOption('month');await page.waitForSelector('.calendar-month');
  const today=page.locator('.calendar-day.today');assert.equal(await today.count(),1);assert.equal(await today.locator('b').isVisible(),true);await show(page,'.calendar-controls');if(device==='phone')state.calendarControls=await capture(page,'phone-calendar-controls');await today.scrollIntoViewIfNeeded();await page.waitForTimeout(100);state.today=await capture(page,device+'-calendar-today-month');
  if(device==='phone'){
   const controls=await page.locator('.calendar-controls').evaluate(el=>{const ids=['cal-prev','cal-today','cal-next','cal-add','cal-settings'];return ids.map(id=>{const r=el.querySelector('#'+id).getBoundingClientRect();return {id,top:r.top,right:r.right,bottom:r.bottom}})});
   assert.ok(Math.max(...controls.map(c=>c.top))-Math.min(...controls.map(c=>c.top))<8,JSON.stringify(controls));assert.ok(controls.every(c=>c.right<=390));state.controls=controls;
  }else{await page.locator('#cal-view').selectOption('week');await page.waitForSelector('.calendar-week');assert.equal(await page.locator('.calendar-week .calendar-day.today').count(),1);state.todayWeek=await capture(page,'desktop-calendar-today-week')}
  await page.locator('#cal-view').selectOption('upcoming');await page.waitForSelector('.calendar-upcoming');await page.locator('[data-event="'+appointment.id+'"]').first().click();await page.waitForSelector('#appointment-editor');
  assert.equal(await page.locator('#appt-design').isVisible(),true);assert.equal(await page.locator('[name=durationMinutes]').inputValue(),'60');assert.equal(await page.locator('[name=interests][value="Website Design"]').isChecked(),true);state.appointment=await capture(page,device+'-appointment-prep');
  await context.close();
 }
 assert.deepEqual(results.errors,[]);fs.writeFileSync(out+'/browser-results.json',JSON.stringify(results,null,2));console.log('PASS #015E browser: customer linkage, card/menu keyboard behavior, design preparation, appointment interests/duration, today highlight and 390px calendar row.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));await runtime.close()}
