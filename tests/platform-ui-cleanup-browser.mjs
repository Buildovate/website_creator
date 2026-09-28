import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {roofingFixture} from './fixtures/roofing-journey.mjs';

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const phase=process.argv[2]||'after';
assert.ok(['before','after'].includes(phase));
const root='C:/Users/joe/website_creator';
const out=(process.env.PLATFORM_CLEANUP_EVIDENCE||root+'/docs/build-evidence/015FA')+'/'+phase;
fs.mkdirSync(out,{recursive:true});
const base='http://127.0.0.1:8146';
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'cleanup-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8146',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'cleanup-admin','oai-authenticated-user-email':'cleanup-admin@example.test'};
async function api(path,method='GET',value){const response=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(response.status,200,await response.clone().text());return response.json()}
await api('/setup','POST',{});
const siteFixture=structuredClone(roofingFixture);siteFixture.slug='cleanup-template-qa';siteFixture.settings.name='Cleanup Template QA';
const site=(await api('/tenants','POST',siteFixture)).tenant;
const contacts={};
for(const device of ['phone','desktop'])contacts[device]=await api('/workspace/global/contacts','POST',{data:{company:'Fictional Coast Roofing '+device,name:'Jamie Sample',phone:device==='phone'?'8055550135':'8055550136',email:'jamie-'+device+'@fixture.test',trade:'Roofing',stage:'Called'}});
const server=await listen(runtime,8146);
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results={phase,checks:[],errors:[]};
async function capture(page,name){const file=name+'.png';await page.screenshot({path:out+'/'+file,fullPage:false});return phase+'/'+file}
async function nav(page,name){await page.locator(`[data-action="nav"][data-view="${name}"]`).first().click();await page.waitForFunction(name=>document.querySelector(`[data-action="nav"][data-view="${name}"]`)?.classList.contains('active'),name)}
try{
 for(const [device,viewport] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}],['desktop-1280',{width:1280,height:900}]]){
  const context=await browser.newContext({viewport,hasTouch:device==='phone',reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));
  await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'cleanup-admin',email:'cleanup-admin@example.test'}});
  await page.goto(base);await page.waitForSelector('[data-action="nav"][data-view="contacts"]');
  await nav(page,'contacts');await page.waitForSelector('.contact-workspace');
  const contact=contacts[device==='phone'?'phone':'desktop'];
  const row=device==='phone'?page.locator(`[data-contact-card="${contact.id}"]`):page.locator('.contact-desktop-table tbody tr').filter({has:page.locator(`[data-detail="${contact.id}"]`)}).first();
  await row.scrollIntoViewIfNeeded();await capture(page,device+'-contacts');
  if(phase==='after'&&device!=='phone'){
   const geometry=await row.locator('.row-actions').evaluate(el=>{const buttons=[...el.querySelectorAll(':scope > button, :scope > .quick-menu > button')].filter(x=>x.getClientRects().length);const tops=buttons.map(x=>x.getBoundingClientRect().top);return {tops,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}});
   assert.ok(Math.max(...geometry.tops)-Math.min(...geometry.tops)<3,JSON.stringify(geometry));
   assert.ok(geometry.scrollWidth<=geometry.clientWidth+2,JSON.stringify(geometry));
   const nameCell=await row.locator('td').nth(1).evaluate(cell=>({button:cell.querySelector('[data-detail]').getBoundingClientRect().right,cell:cell.getBoundingClientRect().right}));
   assert.ok(nameCell.button<=nameCell.cell+1,JSON.stringify(nameCell));
   assert.ok((await row.locator('td').nth(1).locator('[data-detail]').getAttribute('title')).startsWith('Fictional Coast Roofing'));
   assert.equal(await row.locator('.row-actions [data-detail]').count(),0);
   assert.equal(await row.locator('.quick-menu-list [data-quick-choice="details"]').count(),1);
   await row.locator('[data-quick-menu]').click();await row.locator('[data-quick-choice="details"]').click();await page.waitForSelector('.contact-profile');assert.equal(await page.locator('#dialog[open]').count(),1);await page.locator('.dialog-close').click();
   results.checks.push(device+' desktop single-row actions and More → Details');
  }
  if(device==='desktop-1280'){await context.close();continue}
  await nav(page,'tradeLibrary');await page.waitForSelector('.design-card');await capture(page,device+'-template-library');
  if(phase==='after'){
   assert.equal(await page.locator('.design-card').first().locator('h2').textContent(),'Ridgeline (Roofing)');
   assert.ok((await page.locator('.design-card').allTextContents()).every(x=>!x.includes('RIDGELINE')));
   results.checks.push(device+' template list formatting');
  }
  await page.locator('[data-kit-create="roofing"]').click();await page.waitForSelector('.kit-create-form');await capture(page,device+'-template-picker');
  if(phase==='after')assert.ok((await page.locator('.kit-create-form').textContent()).includes('Ridgeline (Roofing)'));
  await page.locator('.dialog-close').click();
  await nav(page,'websites');
  await page.locator(`[data-action="open"][data-id="${site.id}"]`).first().click();
  await page.waitForSelector('[data-section="templates"]',{state:'attached'});
  await page.locator('[data-section="templates"]').first().evaluate(el=>el.click());
  await page.getByRole('button',{name:'Creative direction',exact:true}).click();await page.waitForSelector('#kit-settings');await page.locator('#content .eyebrow').filter({hasText:'YOUR ACTIVE DESIGN KIT'}).first().scrollIntoViewIfNeeded();await capture(page,device+'-template-detail');
  if(phase==='after')assert.ok((await page.locator('#content').textContent()).includes('Ridgeline (Roofing)'));
  await nav(page,'contacts');await page.waitForSelector('.contact-workspace');
  const prepared=device==='phone'?page.locator(`[data-contact-card="${contact.id}"]`):page.locator('.contact-desktop-table tbody tr').filter({has:page.locator(`[data-detail="${contact.id}"]`)}).first();
  await prepared.locator('[data-detail]').first().click();await page.waitForSelector('#detail-prepare-design');
  await capture(page,device+'-contact-details');
  await page.locator('#detail-prepare-design').click();await page.waitForSelector('#prepare-design');
  await capture(page,device+'-prepare-dialog');
  if(phase==='after'){
   assert.equal(await page.locator('#prepare-design select[name=kit] option:checked').textContent(),'Ridgeline (Roofing)');
   const visible=await page.getByRole('button',{name:'Create linked website draft'}).evaluateAll(els=>els.filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden').length);
   assert.equal(visible,1,'one visible create button');
   if(device==='phone'){
    const gap=await page.locator('#dialog').evaluate(dialog=>{const button=dialog.querySelector('#prepare-design .primary');return {gap:Math.round(dialog.getBoundingClientRect().bottom-button.getBoundingClientRect().bottom),visible:button.getBoundingClientRect().bottom<=innerHeight}});
    assert.ok(gap.gap<=65,JSON.stringify(gap));assert.equal(gap.visible,true);results.checks.push('phone compact prepare dialog and single submit');
   }
   await page.locator('#prepare-design button.primary').click();await page.waitForSelector('[data-section="templates"]',{state:'attached'});
   const linked=(await api('/workspace/global/contacts/'+contact.id)).record;
   assert.ok(linked.data.tenantId,'remaining action creates linked draft');
   results.checks.push(device+' create linked draft works');
  }
  await context.close();
 }
 assert.deepEqual(results.errors,[]);
 fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2));
 console.log(`PASS #015FA ${phase}: ${results.checks.length} checks; ${results.errors.length} browser errors.`);
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));await runtime.close()}
