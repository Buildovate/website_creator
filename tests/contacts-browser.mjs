import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import {openGameSection,mockGameBoard} from './helpers/game-navigation.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from './fixtures/roofing-journey.mjs';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const base='http://127.0.0.1:8131',out=releaseRepoRoot+"/docs/build-evidence/015C";fs.mkdirSync(out,{recursive:true});
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'contacts-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8131',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'contacts-admin','oai-authenticated-user-email':'contacts-admin@example.test'};
async function api(path,method='GET',value){const response=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(response.status,200,await response.clone().text());return response.json()}
await api('/setup','POST',{});const fixture=structuredClone(roofingFixture);fixture.slug='contacts-restore-qa';fixture.settings.name='Fictional Roofing Contacts QA';
const {tenant}=await api('/tenants','POST',fixture);const scope='/workspace/'+tenant.id;
await runtime.env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind(crypto.randomUUID(),tenant.id,'contacts-owner','contacts-owner@example.test','owner',new Date().toISOString()).run();
const a=await api(scope+'/contacts','POST',{data:{company:'Ventura Test Roofing',name:'Avery Sample',phone:'8055550101',email:'avery@fixture.test',trade:'Roofing',stage:'New',notes:'Call about roof repair.'}});
const b=await api(scope+'/contacts','POST',{data:{company:'Coastline Gutters',name:'Sam Sample',phone:'8055550102',email:'sam@fixture.test',trade:'Roofing',stage:'New',notes:'Needs an estimate.'}});

let record=(await api(scope+'/contacts/'+b.id)).record;await api(scope+'/contacts/'+b.id+'/call-outcome','POST',{version:record.version,outcome:'No Answer'});
const server=await listen(runtime,8131),browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
const results={phone:{},desktop:{},errors:[]};
async function capture(page,name){await page.screenshot({path:out+'/'+name+'.png'});return name+'.png'}
async function frame(page){await page.evaluate(()=>{const el=document.querySelector('#crm-contact-slot');scrollTo(0,el.getBoundingClientRect().top+scrollY-20)});await page.waitForTimeout(120)}
async function tap(page,selector){const box=await page.locator(selector).boundingBox();await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2)}
try{
 for(const [kind,viewport]of [['phone',{width:390,height:844}],['desktop',{width:1440,height:900}]]){
  const context=await browser.newContext({viewport,hasTouch:kind==='phone',acceptDownloads:true,reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',error=>results.errors.push(kind+': '+error.message));page.on('dialog',dialog=>dialog.accept());
  await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'contacts-owner',email:'contacts-owner@example.test'}});
  await page.goto(base);await page.locator('.bv-game').waitFor();if(kind==='phone')await openGameSection(page,'contacts');else await openGameSection(page,'contacts');await page.waitForSelector('[data-contact-card]',{state:'attached'});await frame(page);
  const state=results[kind];state.viewport=viewport;
  if(kind==='phone'){
   assert.equal(await page.locator('#contact-filters-open').isVisible(),true);assert.equal(await page.locator('.smartlists').isVisible(),false);
   assert.ok(await page.locator('.contact-card').first().evaluate(el=>el.getBoundingClientRect().top)<844);
   assert.equal(await page.locator('.platform-action-dock').isVisible(),false);
   const company=page.locator(`[data-contact-card="${a.id}"]`);assert.equal(await company.locator('.contact-card-company').count(),1);assert.equal(await company.locator('.contact-card-person').count(),1);assert.match(await company.locator('a[href^="tel:"]').getAttribute('href'),/8055550101/);
   state.contacts=await capture(page,'phone-contacts');
   await tap(page,'#contact-filters-open');assert.equal(await page.locator('#contact-filters').evaluate(el=>el.open),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#contact-filters').evaluate(el=>el.open),false);
   await page.locator('#contact-filters-open').click();state.filters=await capture(page,'phone-filters-sheet');await page.locator('#filter-outcome').selectOption('No Answer');await page.locator('#filter-done').click();assert.equal(await page.locator('.contact-card').count(),1);assert.equal(await page.locator('.contact-card-company').innerText(),'Coastline Gutters');state.outcome=await capture(page,'phone-call-outcome');
   await page.locator('#contact-filters-open').click();await page.locator('#filter-outcome').selectOption('');await page.locator('#filter-done').click();
   const note=page.locator(`[data-contact-card="${a.id}"]`);await note.locator('summary').click();await note.locator('textarea').fill('Roof inspection booked for review.');await note.locator('[data-save-note]').click();await page.waitForFunction(id=>document.querySelector(`[data-contact-card="${id}"] .note-status`)?.textContent==='Saved',a.id);state.notes=await capture(page,'phone-inline-notes');
   await page.locator('#status').evaluate(el=>el.textContent='');await frame(page);await tap(page,`[data-contact-card="${a.id}"] [data-select-contact]`);assert.equal(await page.locator('#contact-bulk-bar').isVisible(),true);state.bulk=await capture(page,'phone-bulk-select');
   await page.locator('#clear-selection').click();const formula=await api(scope+'/contacts','POST',{data:{company:'=HYPERLINK("https://example.test","fixture")',name:'Formula Test',phone:'8055550103',email:'formula@fixture.test',trade:'Roofing',stage:'New'}});await page.reload();await page.locator('.bv-game').waitFor();await openGameSection(page,'contacts');await page.locator(`[data-contact-card="${formula.id}"] [data-select-contact]`).check();const downloadEvent=page.waitForEvent('download');await page.locator('[data-bulk=export]').click();const download=await downloadEvent;const csv=fs.readFileSync(await download.path(),'utf8');assert.ok(csv.startsWith('\ufeff'));assert.match(csv,/"'=HYPERLINK/);state.exportGuard=true;const formulaRecord=(await api(scope+'/contacts/'+formula.id)).record;await api(scope+'/contacts/'+formula.id,'DELETE',{version:formulaRecord.version});
  }else{
   assert.equal(await page.locator('#contact-outcome').isVisible(),true);state.contacts=await capture(page,'desktop-contacts');
   await page.locator('#contacts-select-page').check();assert.equal(await page.locator('#contact-bulk-bar').isVisible(),true);state.bulk=await capture(page,'desktop-bulk-select');await page.locator('#clear-selection').click();
   await page.locator('#contact-outcome').selectOption('No Answer');assert.equal(await page.locator('.crm-table tbody tr').count(),1);state.outcome=await capture(page,'desktop-call-outcome');await page.locator('#contact-outcome').selectOption('');
   const note=page.locator('.crm-table tbody tr').filter({has:page.locator(`[data-detail="${a.id}"]`)}).first();await note.locator('[data-column=notes]').scrollIntoViewIfNeeded();assert.equal(await note.locator('[data-column=notes] textarea').inputValue(),'Roof inspection booked for review.');state.notes=await capture(page,'desktop-inline-notes');
   await page.locator('#contact-stage').selectOption('New');state.filters=await capture(page,'desktop-inline-filters');await page.locator('#contact-stage').selectOption('');
  }
  if(kind==='phone')await openGameSection(page,'business');else await openGameSection(page,'business');await page.locator('[data-action=upload]').click();await page.waitForSelector('#dialog[open]');
  if(kind==='phone'){await page.waitForSelector('#dialog .choose-photo',{state:'visible'});assert.equal(await page.locator('#dialog .choose-photo').isVisible(),true);assert.equal(await page.locator('#dialog input[name=files]').evaluate(el=>getComputedStyle(el).opacity),'0');assert.equal(await page.locator('#dialog .platform-action-dock button').filter({hasText:'Upload photographs'}).count(),1)}
  state.picker=await capture(page,kind+'-photo-picker');await context.close();
 }
 assert.deepEqual(results.errors,[]);fs.writeFileSync(out+'/browser-results.json',JSON.stringify(results,null,2));console.log('PASS #015C browser: phone cards, first-screen contacts, Filters sheet, call outcome, notes, bulk select, CSV BOM/formula guard, styled picker and desktop counterparts.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));await runtime.close()}
