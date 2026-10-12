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
fs.mkdirSync(out+'/round6',{recursive:true});fs.mkdirSync(out+'/screenshots',{recursive:true});
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
 await api('/setup','POST',{});const fixture=structuredClone(roofingFixture);fixture.slug='game-g4-qa';fixture.settings.name='Harbor Roofing · QA fixture';fixture.settings.platform.questionnaire={factsConfirmed:true};fixture.settings.hero='Talk through your roof repair';fixture.settings.intro='We explain the repair scope before work begins.';fixture.settings.conversionBrief={headline:'',intro:'',confirmed:false};const {tenant}=await api('/tenants','POST',fixture);
 for(const user of ['game-owner','game-second'])await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind(user+'-member',tenant.id,user,user+'@example.test','owner',new Date().toISOString()).run();
 server=await listen(runtime,5183);browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
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
 await check('Game power-up opens the existing questionnaire without a second view',async()=>{
  await page.goto(base);await page.locator('[data-game-autofill-open]').waitFor();
  const skip=page.getByRole('button',{name:'Skip tour',exact:true});if(await skip.isVisible())await skip.click();
  await page.locator('[data-game-autofill-open]').click();await panel.waitFor();assert.equal(await form.count(),1);assert.equal(await page.locator('[data-game-tabs]').count(),0);await shot('g4-desktop-ready');
 });
 const before=await formValues(),savedBefore=JSON.stringify((await api('/tenants/'+tenant.id)).tenant.settings),xpBefore=(await api('/game/'+tenant.id)).progress.totalXp;
 const savedSource=JSON.parse(savedBefore);
 await check('saved proposals show real sources and leave form, settings and XP unchanged',async()=>{
  await page.locator('[data-game-autofill]').click();await page.locator('[data-game-autofill-confirm-all]').waitFor();
  assert.equal(await panel.locator('[data-autofill-field=conversion-headline]').count(),1);
  assert.match(await panel.innerText(),/Found · not final/);assert.match(await panel.innerText(),/Confirmed saved business details · hero/);
  assert.deepEqual(await formValues(),before);assert.equal(JSON.stringify((await api('/tenants/'+tenant.id)).tenant.settings),savedBefore);
  assert.equal((await api('/game/'+tenant.id)).progress.totalXp,xpBefore);await shot('g4-desktop-review');
 });
 await check('Confirm adds only saved wording to empty fields, without confirming consent',async()=>{
  await page.locator('[data-game-autofill-confirm-all]').click();
  assert.equal(await form.locator('[name=conversion-headline]').inputValue(),savedSource.hero);assert.equal(await form.locator('[name=conversion-intro]').inputValue(),savedSource.intro);
  assert.equal(await form.locator('[name=conversion-confirmed]').isChecked(),false);
  assert.equal(JSON.stringify((await api('/tenants/'+tenant.id)).tenant.settings),savedBefore);await shot('g4-desktop-confirmed');
 });
 await check('Undo restores the exact form snapshot',async()=>{
  await page.locator('[data-game-autofill-undo]').click();assert.deepEqual(await formValues(),before);await shot('g4-desktop-undo');
 });
 await check('intentional clears and later typed edits survive fill and Undo',async()=>{
  await form.locator('[name=conversion-headline]').fill('Typed heading');await form.locator('[name=conversion-headline]').fill('');
  await page.locator('[data-game-autofill]').click();await page.locator('[data-game-autofill-confirm-all]').waitFor();await page.locator('[data-game-autofill-confirm-all]').click();
  assert.equal(await form.locator('[name=conversion-headline]').inputValue(),'');assert.equal(await form.locator('[name=conversion-intro]').inputValue(),savedSource.intro);
  await form.locator('[name=conversion-intro]').fill('My later wording.');await page.locator('[data-game-autofill-undo]').click();
  assert.equal(await form.locator('[name=conversion-intro]').inputValue(),'My later wording.');assert.match(await panel.innerText(),/later edits were kept/);
 });
 await page.setViewportSize({width:390,height:844});
 await check('phone offline state preserves the answers and existing Save dock',async()=>{
  const draft=await formValues();await context.setOffline(true);await page.locator('[data-game-autofill]').click();assert.match(await panel.innerText(),/offline/);assert.deepEqual(await formValues(),draft);await shot('g4-phone-offline');await context.setOffline(false);
 });
 const matches=url=>url.pathname.endsWith('/autofill');
 await check('phone error state is honest and retry remains available',async()=>{
  await page.route(matches,route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"QA fixture failure"}'}),{times:1});
  await page.locator('[data-game-autofill]').click();await page.getByText('Saved details could not load. Your answers are unchanged. Try again.',{exact:true}).waitFor();await shot('g4-phone-error');
 });
 await check('phone loading then empty state stays usable without creating data',async()=>{
  let release;const gate=new Promise(r=>release=r);
  await page.route(matches,async route=>{await gate;await route.continue();},{times:1});
  await page.locator('[data-game-autofill]').click();await panel.locator('[role=status]').filter({hasText:'Checking your saved details'}).waitFor();await shot('g4-phone-loading');release();
  await page.getByText('No empty fields match another saved detail. Your current answers were kept.',{exact:true}).waitFor();
  await panel.locator('summary').click();await shot('g4-phone-empty');
 });
 await check('keyboard access and reduced motion keep the autofill controls static',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-game-autofill]').focus();await page.keyboard.press('Enter');
  await page.getByText('No empty fields match another saved detail. Your current answers were kept.',{exact:true}).waitFor();
  assert.equal(await panel.evaluate(el=>el.getAnimations({subtree:true}).filter(x=>x.playState==='running').length),0);await shot('g4-phone-reduced-motion');
 });
 await check('existing Save persists confirmed additions to draft only',async()=>{
  await page.setViewportSize({width:1440,height:900});await page.reload();await page.locator('[data-game-autofill-open]').click();await panel.waitFor();
  await page.locator('[data-game-autofill]').click();await page.locator('[data-game-autofill-confirm-all]').click();
  const response=page.waitForResponse(r=>r.url().endsWith('/api/tenants/'+tenant.id)&&r.request().method()==='PUT');
  await form.getByRole('button',{name:'Save questionnaire',exact:true}).click();assert.equal((await response).status(),200);
  const after=(await api('/tenants/'+tenant.id)).tenant;assert.equal(after.settings.conversionBrief.headline,savedSource.hero);assert.equal(after.settings.conversionBrief.intro,savedSource.intro);assert.equal(after.status,'draft');assert.equal(after.published,null);
 });
 await check('viewer sees read-only autofill with no action buttons',async()=>{
  await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind('game-viewer-member',tenant.id,'game-viewer','game-viewer@example.test','viewer',new Date().toISOString()).run();
  await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'game-viewer',email:'game-viewer@example.test'}});
  await page.setViewportSize({width:390,height:844});await page.reload();await page.locator('[data-game-autofill-open]').click();await panel.waitFor();
  assert.match(await panel.innerText(),/Read-only access/);assert.equal(await panel.locator('button').count(),0);await shot('g4-phone-readonly');
 });
 await check('no provider request or uncaught browser error',async()=>{assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);});
 fs.writeFileSync(out+'/round6/autofill-browser.json',JSON.stringify({passed:true,count:checks.length,checks,screenshots:screens,port:5183,providerCalls:0},null,2));console.log(checks.length+'/'+checks.length+' passed; '+screens.length+' screenshots');
}catch(error){fs.writeFileSync(out+'/round6/autofill-browser-failure.json',JSON.stringify({passed:false,completed:checks.length,checks,screenshots:screens,error:error.stack},null,2));throw error;}
finally{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));await runtime.close();}
