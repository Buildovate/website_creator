import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import {openGameSection,mockGameBoard} from './helpers/game-navigation.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from './fixtures/roofing-journey.mjs';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const base='http://127.0.0.1:8132',out=releaseRepoRoot+"/docs/build-evidence/015D";fs.mkdirSync(out,{recursive:true});
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'callback-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8132',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'callback-admin','oai-authenticated-user-email':'callback-admin@example.test'};
async function api(path,method='GET',value){const response=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(response.status,200,await response.clone().text());return response.json()}
await api('/setup','POST',{});const fixture=structuredClone(roofingFixture);fixture.slug='callback-qa';fixture.settings.name='Fictional Roofing Callback QA';const {tenant}=await api('/tenants','POST',fixture);const scope='/workspace/'+tenant.id;
await runtime.env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind(crypto.randomUUID(),tenant.id,'callback-owner','callback-owner@example.test','owner',new Date().toISOString()).run();
const contact=await api(scope+'/contacts','POST',{data:{company:'Ventura Test Roofing',name:'Avery Sample',phone:'8055550102',email:'avery@fixture.test',trade:'Roofing',stage:'New',notes:'Call about roof repair.'}});
await api(scope+'/contacts','POST',{data:{company:'Coastline Gutters',name:'Sam Sample',phone:'8055550103',email:'sam@fixture.test',trade:'Roofing',stage:'Called',notes:'Needs an estimate.'}});
const server=await listen(runtime,8132),browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
const results={phone:{},desktop:{},errors:[]};
async function capture(page,name){await page.screenshot({path:out+'/'+name+'.png'});return name+'.png'}
async function frame(page,selector){await page.evaluate(selector=>{const el=document.querySelector(selector);if(el)scrollTo(0,el.getBoundingClientRect().top+scrollY-20)},selector);await page.waitForTimeout(120)}
try{
 for(const [kind,viewport] of [['phone',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
  const context=await browser.newContext({viewport,hasTouch:kind==='phone'}),page=await context.newPage();page.on('pageerror',error=>results.errors.push(error.message));
  await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'callback-owner',email:'callback-owner@example.test'}});
  await page.goto(base);await page.locator('.bv-game').waitFor();
  if(kind==='phone')await openGameSection(page,'contacts');else await openGameSection(page,'contacts');
  await page.waitForSelector(`[data-contact-card="${contact.id}"]`,{state:"attached"});await frame(page,kind==='phone'?'#crm-contact-slot':'.contact-desktop-table');
  const state=results[kind];state.viewport=viewport;
  const record=kind==='phone'?page.locator(`[data-contact-card="${contact.id}"]`):page.locator('.crm-table tbody tr').filter({has:page.locator(`[data-detail="${contact.id}"]`)}).first();
  for(const action of ['data-callback','data-book-appt'])assert.equal(await record.locator(`[${action}]`).isVisible(),true);
  assert.equal(await record.locator('[data-callback]').innerText(),'Call Back');assert.equal(await record.locator('[data-book-appt]').innerText(),'Book Appt');
  assert.equal((await record.innerText()).includes('(805) 555-0102'),true);assert.match(await record.locator('a[href^="tel:"]').getAttribute('href'),/8055550102/);
  if(kind==='phone')state.card=await capture(page,'phone-contact-card-actions');else{
   const geometry=await page.locator('.contact-desktop-table').evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth,stage:!!el.querySelector('[data-column=stage]'),actions:el.querySelector('tbody .row-actions')?.getBoundingClientRect().right,edge:el.getBoundingClientRect().right}));
   assert.equal(geometry.stage,true);assert.ok(geometry.scroll<=geometry.client+1,JSON.stringify(geometry));assert.ok(geometry.actions<=geometry.edge+1,JSON.stringify(geometry));
   assert.equal(await page.locator('.workspace-label').count(),0);state.table=await capture(page,'desktop-contacts-table-actions');
  }
  await record.locator('[data-callback]').click();await page.waitForSelector('#callback-editor');
  assert.equal(await page.locator('#callback-editor [name="durationMinutes"] option').count(),4);
  assert.equal(await page.locator('#callback-editor [name="status"]').isVisible(),true);
  assert.equal(await page.locator('#callback-editor [name="assignees"]').count()>0,true);
  state.scheduler=await capture(page,kind+'-callback-scheduler');
  if(kind==='phone'){
   const local=new Date(Date.now()+4*86400000);const value=new Date(local.getTime()-local.getTimezoneOffset()*60000).toISOString().slice(0,16);
   await page.locator('#callback-editor [name="start"]').fill(value);await page.locator('#callback-editor [name="durationMinutes"]').selectOption('30');
   await page.locator('#callback-editor [name="notes"]').fill('Call after the roof inspection.');
   await page.locator('#callback-editor .assignee-picker').evaluate(el=>el.open=true);
   await page.locator('#callback-editor [name="assignees"]').first().check();
   await page.locator('#callback-editor button.primary').click();await page.waitForSelector('#callback-editor',{state:'hidden'});
   const saved=(await api(scope+'/contacts/'+contact.id)).record;assert.ok(saved.data.nextCallbackAt);assert.equal(saved.data.callAttempts,1);
  }else await page.locator('#dialog .dialog-close').click();
  await record.locator('[data-detail]').last().click();await page.waitForSelector('.contact-profile');
  assert.equal(await page.locator('.person-avatar').count()>0,true);assert.equal(await page.locator('.next-callback').isVisible(),true);
  state.detail=await capture(page,kind+'-contact-detail');
  await page.locator('#detail-callback').click();await page.waitForSelector('#callback-editor');await page.locator('#dialog .dialog-close').click();
  await record.locator('[data-book-appt]').click();await page.waitForSelector('#appointment-editor');assert.equal(await page.locator('#appointment-editor [name="contactId"]').inputValue(),contact.id);await page.locator('#dialog .dialog-close').click();
  if(kind==='phone')await openGameSection(page,'calendar');else await openGameSection(page,'calendar');
  await page.waitForSelector('#cal-view');await frame(page,'#crm-calendar-slot');await page.locator('#status').evaluate(el=>el.textContent='');
  if(kind==='phone'){
   assert.equal(await page.locator('#cal-view').inputValue(),'upcoming');assert.equal(await page.locator('.calendar-upcoming').isVisible(),true);
   state.upcoming=await capture(page,'phone-upcoming-appointments');
  }else{assert.equal(await page.locator('.calendar-callback').count()>0,true);state.month=await capture(page,'desktop-calendar-month-callback');await page.locator('#cal-view').selectOption('upcoming');await page.waitForSelector('.calendar-upcoming')}
  assert.equal(await page.locator('.calendar-callback').count()>0,true);state.calendar=await capture(page,kind+'-calendar-callback');
  await page.locator('.calendar-callback').first().click();await page.waitForSelector('#callback-editor');assert.equal(await page.locator('#callback-editor h2').innerText(),'Edit callback');
  await page.keyboard.press('Escape');await context.close();
 }
 assert.deepEqual(results.errors,[]);fs.writeFileSync(out+'/browser-results.json',JSON.stringify(results,null,2));console.log('PASS #015D browser: formatted phone, visible actions, callback scheduler/calendar, upcoming phone view and fitted desktop table.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));await runtime.close()}
