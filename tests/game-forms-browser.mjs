import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
// Real local workspace plus explicitly labeled future-progress display fixtures. No retries.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {evaluateProgress} from '../src/blueprint/progress.js';
import {complete} from './game-fixtures.mjs';
import {roofingFixture} from './fixtures/roofing-journey.mjs';
const root=releaseRepoRoot,base='http://127.0.0.1:5183',out=root+'/docs/build-evidence/028G',checks=[],screens=[],readability=[];
fs.mkdirSync(out+'/round8',{recursive:true});fs.mkdirSync(out+'/screenshots',{recursive:true});
const {chromium}=createRequire(import.meta.url)('playwright');
await build({entryPoints:[root+'/src/client/auth/bridge.ts'],outfile:root+'/.data/028G/dist/client/auth-bridge.js',bundle:true,format:'iife',globalName:'BuildovateAuth',platform:'browser',target:'es2022'});
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'game-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'5183',APP_ORIGIN:base,ASSETS_ROOT:root+'/public'}});
const priorAssets=runtime.env.ASSETS;
runtime.env.ASSETS={fetch:async req=>{const path=new URL(req.url).pathname,file=root+'/.data/028G/dist/client'+path;if(/^\/[a-z0-9-]+\.(js|css)$/.test(path)&&fs.existsSync(file))return new Response(fs.readFileSync(file),{headers:{'content-type':path.endsWith('.css')?'text/css':'application/javascript'}});return priorAssets.fetch(req)}};
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'game-admin','oai-authenticated-user-email':'game-admin@example.test'};
async function api(path,method='GET',value){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json();}
let browser,server;
async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
try{
 await api('/setup','POST',{});const fixture=structuredClone(roofingFixture);fixture.slug='game-g6-qa';fixture.settings.name='Harbor Roofing · QA fixture';fixture.settings.platform.questionnaire={factsConfirmed:false};fixture.settings.hero='Talk through your roof repair';fixture.settings.intro='We explain the repair scope before work begins.';fixture.settings.conversionBrief={headline:'',intro:'',confirmed:false};const {tenant}=await api('/tenants','POST',fixture);
 for(const user of ['game-owner','game-second'])await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind(user+'-member',tenant.id,user,user+'@example.test','owner',new Date().toISOString()).run();
 server=await listen(runtime,5183);browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
 const context=await browser.newContext({viewport:{width:1440,height:900},isMobile:false,hasTouch:true,deviceScaleFactor:1}),page=await context.newPage(),errors=[],blocked=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname!=='127.0.0.1'&&!['data:','blob:'].includes(u.protocol)){blocked.push(u.href);return route.abort();}return route.continue();});
 await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'game-owner',email:'game-owner@example.test'}});
 async function capture(name){await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:out+'/screenshots/'+name+'.png'});screens.push(name+'.png');}



 const business=()=>page.locator('form[data-form=settings]');
 const questionnaire=()=>page.locator('#questionnaire-form');
 async function topShot(name){await page.locator('.bv-game-section-toolbar').scrollIntoViewIfNeeded();await capture(name);}
 await check('Business Start opens the original shared form and real Save path',async()=>{
  await page.goto(base);await page.locator('[data-game-step=name]').waitFor();const skip=page.getByRole('button',{name:'Skip tour',exact:true});if(await skip.isVisible())await skip.click();
  await page.locator('[data-game-step=name]').click();await business().waitFor();assert.equal(await business().count(),1);
  await business().locator('[name=owner]').fill('Desktop owner QA');
  const response=page.waitForResponse(r=>r.url().endsWith('/api/tenants/'+tenant.id)&&r.request().method()==='PUT');
  await business().getByRole('button',{name:'Save business settings',exact:true}).click();assert.equal((await response).status(),200);
  await page.locator('#status').filter({hasText:'Business settings saved as draft.'}).waitFor();
  const saved=(await api('/tenants/'+tenant.id)).tenant;assert.equal(saved.settings.owner,'Desktop owner QA');assert.equal(saved.published,null);assert.equal(saved.status,'draft');await topShot('g6-desktop-business-saved');
 });
 await check('Questionnaire Save uses the same draft API and refreshes real progress while open',async()=>{
  await page.locator('[data-game-back]').click();await page.locator('[data-game-autofill-open]').click();await questionnaire().waitFor();
  await questionnaire().locator('[name=factsConfirmed]').check();
  const response=page.waitForResponse(r=>r.url().endsWith('/api/tenants/'+tenant.id)&&r.request().method()==='PUT');
  await questionnaire().getByRole('button',{name:'Save questionnaire',exact:true}).click();assert.equal((await response).status(),200);
  await page.locator('.bv-game-strength strong').filter({hasText:'Your site, 10% built'}).waitFor();
  const saved=(await api('/tenants/'+tenant.id)).tenant;assert.equal(saved.settings.platform.questionnaire.factsConfirmed,true);assert.equal(saved.published,null);
  assert.equal((await api('/game/'+tenant.id)).progress.totalXp,10);await topShot('g6-desktop-questionnaire-saved');
 });
 await check('Publish step focuses the original action and preserves the real review gate',async()=>{
  await page.locator('[data-game-back]').click();await page.locator('[data-game-quest=launch]').click();await page.locator('[data-game-step=published]').click();
  const publish=page.locator('#content [data-action=publish]');await publish.waitFor();assert.equal(await publish.count(),1);
  await page.waitForFunction(()=>document.activeElement?.matches('#content [data-action=publish]'));
  page.once('dialog',d=>d.accept());
  const response=page.waitForResponse(r=>r.url().endsWith('/api/tenants/'+tenant.id+'/publish')&&r.request().method()==='POST');
  await publish.click();const reply=await response;assert.equal(reply.status(),409);assert.match((await reply.json()).error,/Complete the review packet before approval/);
  await page.locator('#status').filter({hasText:'Complete the review packet before approval.'}).waitFor();assert.equal((await api('/tenants/'+tenant.id)).tenant.published,null);await topShot('g6-desktop-publish-gated');
 });
 await page.setViewportSize({width:390,height:844});
 await check('phone edits save through the original action and reopen with the saved value',async()=>{
  await business().locator('[name=owner]').fill('Phone owner QA');
  const response=page.waitForResponse(r=>r.url().endsWith('/api/tenants/'+tenant.id)&&r.request().method()==='PUT');
  await business().getByRole('button',{name:'Save business settings',exact:true}).click();assert.equal((await response).status(),200);
  await page.locator('#status').filter({hasText:'Business settings saved as draft.'}).waitFor();
  await page.locator('[data-game-back]').click();await page.locator('[data-game-phone=settings]').click();await page.locator('[data-game-setting=business]').click();
  assert.equal(await business().locator('[name=owner]').inputValue(),'Phone owner QA');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await topShot('g6-phone-business-saved');
 });
 await check('offline save retains typed answers and cannot change the draft',async()=>{
  const saved=JSON.stringify((await api('/tenants/'+tenant.id)).tenant.settings);await business().locator('[name=owner]').fill('Offline unsaved QA');await context.setOffline(true);
  await business().getByRole('button',{name:'Save business settings',exact:true}).click();await page.locator('#status.error').waitFor();
  assert.equal(await business().locator('[name=owner]').inputValue(),'Offline unsaved QA');assert.equal(JSON.stringify((await api('/tenants/'+tenant.id)).tenant.settings),saved);await topShot('g6-phone-offline');await context.setOffline(false);
 });
 await check('stale version is rejected by the real server without replacing entered answers',async()=>{
  const current=(await api('/tenants/'+tenant.id)).tenant;await api('/tenants/'+tenant.id,'PUT',{version:current.version,settings:{...current.settings,owner:'Other saved QA'}});
  const response=page.waitForResponse(r=>r.url().endsWith('/api/tenants/'+tenant.id)&&r.request().method()==='PUT');
  await business().getByRole('button',{name:'Save business settings',exact:true}).click();assert.equal((await response).status(),409);
  assert.equal(await business().locator('[name=owner]').inputValue(),'Offline unsaved QA');assert.equal((await api('/tenants/'+tenant.id)).tenant.settings.owner,'Other saved QA');await topShot('g6-phone-conflict');
 });
 await check('viewer cannot save or publish through the real API or Game form',async()=>{
  await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind('g6-viewer-member',tenant.id,'g6-viewer','g6-viewer@example.test','viewer',new Date().toISOString()).run();
  const current=(await api('/tenants/'+tenant.id)).tenant;
  for(const [suffix,method,body] of [['','PUT',{version:current.version,settings:current.settings}],['/publish','POST',{version:current.version,approved:true}]]){
   const response=await worker.fetch(new Request(base+'/api/tenants/'+tenant.id+suffix,{method,headers:{...headers,'oai-authenticated-user-id':'g6-viewer','oai-authenticated-user-email':'g6-viewer@example.test'},body:JSON.stringify(body)}),runtime.env);assert.equal(response.status,403);
  }
  await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'g6-viewer',email:'g6-viewer@example.test'}});
  await page.reload();await page.locator('[data-game-phone=settings]').click();await page.locator('[data-game-setting=business]').click();await business().waitFor();
  assert.equal(await business().getByRole('button',{name:'Save business settings',exact:true}).count(),0);assert.equal(await page.locator('#content [data-action=publish]').count(),0);await topShot('g6-phone-readonly');
 });
 await check('no provider requests, uncaught errors, new view or publication bypass',async()=>{
  assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);assert.equal(await page.locator('[data-game-tabs]').count(),0);assert.equal((await api('/tenants/'+tenant.id)).tenant.published,null);
 });
 fs.writeFileSync(out+'/round8/forms-browser.json',JSON.stringify({passed:true,count:checks.length,checks,screenshots:screens,port:5183,providerCalls:0,publishResult:'Real route returns 409 until required staff review; no approval bypass'},null,2));console.log(checks.length+'/'+checks.length+' passed; '+screens.length+' screenshots');
}catch(error){fs.writeFileSync(out+'/round8/forms-browser-failure.json',JSON.stringify({passed:false,completed:checks.length,checks,screenshots:screens,error:error.stack},null,2));throw error;}
finally{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));await runtime.close();}
