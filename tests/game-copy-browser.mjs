import {questCopy} from '../src/client/workspace/game/view.js';
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
const root='C:/Users/joe/wc-game',base='http://127.0.0.1:5183',out=root+'/docs/build-evidence/028G',checks=[],screens=[],readability=[];
fs.mkdirSync(out+'/round7',{recursive:true});fs.mkdirSync(out+'/screenshots',{recursive:true});
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
await build({entryPoints:[root+'/src/client/auth/bridge.ts'],outfile:root+'/.data/028G/dist/client/auth-bridge.js',bundle:true,format:'iife',globalName:'BuildovateAuth',platform:'browser',target:'es2022'});
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'game-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'5183',APP_ORIGIN:base,ASSETS_ROOT:root+'/public'}});
const priorAssets=runtime.env.ASSETS;
runtime.env.ASSETS={fetch:async req=>{const path=new URL(req.url).pathname,file=root+'/.data/028G/dist/client'+path;if(/^\/[a-z0-9-]+\.(js|css)$/.test(path)&&fs.existsSync(file))return new Response(fs.readFileSync(file),{headers:{'content-type':path.endsWith('.css')?'text/css':'application/javascript'}});return priorAssets.fetch(req)}};
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'game-admin','oai-authenticated-user-email':'game-admin@example.test'};
async function api(path,method='GET',value){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json();}
let browser,server;
async function check(name,fn){await fn();checks.push(name);console.log('PASS '+name);}
try{
 await api('/setup','POST',{});const fixture=structuredClone(roofingFixture);fixture.slug='game-g5-qa';fixture.settings.name='Harbor Roofing · QA fixture';fixture.settings.platform.questionnaire={factsConfirmed:true};fixture.settings.hero='Talk through your roof repair';fixture.settings.intro='We explain the repair scope before work begins.';fixture.settings.conversionBrief={headline:'',intro:'',confirmed:false};const {tenant}=await api('/tenants','POST',fixture);
 for(const user of ['game-owner','game-second'])await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind(user+'-member',tenant.id,user,user+'@example.test','owner',new Date().toISOString()).run();
 server=await listen(runtime,5183);browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:900},isMobile:false,hasTouch:true,deviceScaleFactor:1}),page=await context.newPage(),errors=[],blocked=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname!=='127.0.0.1'&&!['data:','blob:'].includes(u.protocol)){blocked.push(u.href);return route.abort();}return route.continue();});
 await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'game-owner',email:'game-owner@example.test'}});
 async function capture(name){await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:out+'/screenshots/'+name+'.png'});screens.push(name+'.png');}


 const panel=page.locator('.bv-game-autofill'),form=page.locator('#questionnaire-form');
 const formValues=()=>form.evaluate(f=>[...new FormData(f).entries()]);
 async function shot(name){
  await panel.evaluate(el=>el.scrollIntoView({block:'start'}));await page.evaluate(()=>document.fonts.ready);
  const problems=await panel.evaluate(root=>{
   const issues=[],lum=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0),rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
   if(document.documentElement.scrollWidth>innerWidth)issues.push('page overflow');
   for(const e of root.querySelectorAll('*')){const r=e.getBoundingClientRect();if(!r.width||!r.height||![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;let bg;for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(Number(s.opacity)!==1)issues.push('opacity');if(!bg&&!['transparent','rgba(0, 0, 0, 0)'].includes(s.backgroundColor))bg=rgb(s.backgroundColor);}if(bg){const a=lum(rgb(getComputedStyle(e).color)),b=lum(bg);if((Math.max(a,b)+.05)/(Math.min(a,b)+.05)<4.5)issues.push('contrast: '+e.textContent.slice(0,40));}}
   for(const b of root.querySelectorAll('button,summary')){const r=b.getBoundingClientRect();if(r.width&&r.height&&(r.width<44||r.height<44))issues.push('tap size');}
   return issues;
  });assert.deepEqual(problems,[]);await capture(name);
 }

 await check('desktop tour explains progress',async()=>{
  await page.goto(base);await page.locator('[data-game-tour]').waitFor();
  assert.match(await page.locator('[data-game-tour]').innerText(),/Complete every step in a quest/);
  await capture('g5-desktop-tour');await page.getByRole('button',{name:'Skip tour',exact:true}).click();
 });
 async function boardCheck(){
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const issues=await page.locator('.bv-game').evaluate(root=>{
   const issues=[],rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number),lum=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
   for(const e of root.querySelectorAll('*')){const r=e.getBoundingClientRect();if(!r.width||!r.height||e.closest('svg')||![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;let bg;for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(Number(s.opacity)!==1)issues.push('opacity');if(!bg&&!['transparent','rgba(0, 0, 0, 0)'].includes(s.backgroundColor))bg=rgb(s.backgroundColor);}if(bg){const a=lum(rgb(getComputedStyle(e).color)),b=lum(bg);if((Math.max(a,b)+.05)/(Math.min(a,b)+.05)<4.5)issues.push('contrast: '+e.textContent.slice(0,30));}}
   return issues;
  });assert.deepEqual(issues,[]);
 }
 await check('all nine desktop quest headings remain readable',async()=>{
  for(const [id,copy] of Object.entries(questCopy)){await page.locator('[data-game-quest="'+id+'"]').click();assert.equal(await page.locator('#bv-game-quest h1').innerText(),copy[1]);await boardCheck();}
  await page.locator('[data-game-quest=onboarding]').click();await page.evaluate(()=>window.scrollTo(0,0));await capture('g5-desktop-board');
 });
 const savedBefore=JSON.stringify((await api('/tenants/'+tenant.id)).tenant.settings),xpBefore=(await api('/game/'+tenant.id)).progress.totalXp;
 await check('form helper distinguishes Confirm, Save and publish',async()=>{
  await page.locator('[data-game-autofill-open]').click();await panel.waitFor();
  assert.equal(await panel.locator('h2').innerText(),'Reuse your saved business details');assert.match(await panel.innerText(),/Save stores your changes; it does not publish them/);assert.equal(await form.count(),1);await shot('g5-desktop-form');
 });
 const before=await formValues();
 await check('suggestions and Undo preserve form values and saved data',async()=>{
  await page.locator('[data-game-autofill]').click();await page.locator('[data-game-autofill-confirm-all]').waitFor();assert.match(await panel.innerText(),/No saved detail is available to reuse/);await shot('g5-desktop-suggestions');
  await page.locator('[data-game-autofill-confirm-all]').click();assert.match(await panel.innerText(),/choose Save to store your changes/);await page.locator('[data-game-autofill-undo]').click();assert.deepEqual(await formValues(),before);
 });
 await check('phone board keeps readable headings with Game as the only view',async()=>{
  await page.locator('[data-game-back]').click();await page.locator('[data-game-message]').filter({hasText:'Saved progress is up to date.'}).waitFor();
  await page.setViewportSize({width:390,height:844});await page.locator('[data-game-chip=onboarding]').waitFor();await boardCheck();assert.equal(await page.locator('[data-game-tabs]').count(),0);await page.evaluate(()=>window.scrollTo(0,0));await capture('g5-phone-board');
 });
 await check('phone form has clear helper text and the original Save action',async()=>{
  await page.locator('[data-game-phone=settings]').click();await page.locator('[data-game-setting=questionnaire][data-game-setting-quest=onboarding]').click();await panel.waitFor();await shot('g5-phone-form');
  const save=form.getByRole('button',{name:'Save questionnaire',exact:true});
  assert.equal(await save.count(),1);await save.waitFor({state:'visible'});
  assert.equal(await save.evaluate(b=>b.type==='submit'&&b.form.id==='questionnaire-form'&&!b.disabled),true);
  fs.writeFileSync(out+'/round7/save-button.json',JSON.stringify(await save.evaluate(b=>({selector:'#questionnaire-form .save-bar button[type=submit]',text:b.textContent,form:b.form.id,type:b.type,visible:!!b.getClientRects().length,html:b.outerHTML})),null,2));
 });
 await check('keyboard and reduced motion preserve readable phone suggestions',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-game-autofill]').focus();await page.keyboard.press('Enter');await page.locator('[data-game-autofill-confirm-all]').waitFor();await panel.locator('summary').click();assert.match(await panel.innerText(),/Online sources · Not connected/);
  assert.equal(await panel.evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0);await shot('g5-phone-suggestions');assert.deepEqual(await formValues(),before);
 });
 await check('unpublished phone preview stays honest',async()=>{
  await page.locator('[data-game-back]').click();await page.locator('[data-game-phone=preview]').click();const dialog=page.locator('dialog.bv-game-preview');await dialog.waitFor();assert.match(await dialog.innerText(),/isn’t published yet/);assert.equal(await dialog.locator('iframe').count(),0);await capture('g5-phone-preview-unpublished');await page.keyboard.press('Escape');
 });
 await check('copy changes do not change data or XP or call providers',async()=>{
  assert.equal(JSON.stringify((await api('/tenants/'+tenant.id)).tenant.settings),savedBefore);assert.equal((await api('/game/'+tenant.id)).progress.totalXp,xpBefore);assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);
 });
 fs.writeFileSync(out+'/round7/copy-browser.json',JSON.stringify({passed:true,count:checks.length,checks,screenshots:screens,port:5183,providerCalls:0},null,2));console.log(checks.length+'/'+checks.length+' passed; '+screens.length+' screenshots');
}catch(error){fs.writeFileSync(out+'/round7/copy-browser-failure.json',JSON.stringify({passed:false,completed:checks.length,checks,screenshots:screens,error:error.stack},null,2));throw error;}
finally{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));await runtime.close();}
