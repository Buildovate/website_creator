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
const root='C:/Users/joe/wc-game',base='http://127.0.0.1:5183',out=root+'/docs/build-evidence/028G',checks=[],screens=[],contrast=[];
fs.mkdirSync(out+'/round4',{recursive:true});fs.mkdirSync(out+'/screenshots',{recursive:true});
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
 await api('/setup','POST',{});const fixture=structuredClone(roofingFixture);fixture.slug='game-g2b-qa';fixture.settings.name='Harbor Roofing · QA fixture';fixture.settings.platform.questionnaire={factsConfirmed:false};const {tenant}=await api('/tenants','POST',fixture);
 for(const user of ['game-owner','game-second'])await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind(user+'-member',tenant.id,user,user+'@example.test','owner',new Date().toISOString()).run();
 server=await listen(runtime,5183);browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),errors=[],blocked=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.hostname!=='127.0.0.1'&&!['data:','blob:'].includes(u.protocol)){blocked.push(u.href);return route.abort();}return route.continue();});
 await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'game-owner',email:'game-owner@example.test'}});
 async function capture(name){await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:out+'/screenshots/'+name+'.png'});screens.push(name+'.png');}
 async function contrastCheck(state,backing){
  const bytes=[...await page.screenshot()];
  const result=await page.evaluate(async ({bytes,backing})=>{
   const image=await createImageBitmap(new Blob([new Uint8Array(bytes)],{type:'image/png'})),canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
   const rgb=x=>x.match(/[\d.]+/g).slice(0,3).map(Number),lum=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
   const failures=[];let count=0;
   for(const el of document.querySelectorAll('.bv-game-tour *, .bv-game-confirmation *, .bv-game-preview>p, .bv-game-preview-top *, [data-game-preview]')){
    const box=el.getBoundingClientRect();if(!box.width||!box.height||![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;
    const style=getComputedStyle(el);let bg;for(let a=el;a;a=a.parentElement){const st=getComputedStyle(a);if(Number(st.opacity)!==1)failures.push('opacity '+el.textContent);if(!bg&&!['transparent','rgba(0, 0, 0, 0)'].includes(st.backgroundColor))bg=rgb(st.backgroundColor);}
    const a=lum(rgb(style.color)),b=lum(bg);const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(ratio<4.5)failures.push({text:el.textContent,ratio});count++;
   }
   const el=document.querySelector(backing),r=el.getBoundingClientRect(),actual=[...ctx.getImageData(Math.floor(r.x+8),Math.floor(r.y+8),1,1).data].slice(0,3),expected=rgb(getComputedStyle(el).backgroundColor);if(actual.some((v,i)=>Math.abs(v-expected[i])>2))failures.push({backing,actual,expected});
   return {count,failures,actual,expected};
  },{bytes,backing});
  assert.deepEqual(result.failures,[]);assert.ok(result.count>0);contrast.push({state,...result});
 }
 await check('first-run tour starts once on the real board without a second view',async()=>{await page.goto(base);await page.locator('[data-game-tour]').waitFor();assert.match(await page.locator('[data-game-tour]').innerText(),/Your progress/);assert.equal(await page.locator('[data-game-tabs],[data-game-entry]').count(),0);assert.equal(await page.locator('#bv-game-quest h1').isVisible(),true);await capture('g2b-tour-progress');await contrastCheck('tour-progress','.bv-game-tour')});
 const before=JSON.stringify((await api('/tenants/'+tenant.id)).tenant.settings);
 await check('Skip saves once and returns to the board',async()=>{const saved=page.waitForResponse(r=>r.url().endsWith('/experience')&&r.request().method()==='POST');await page.getByRole('button',{name:'Skip tour',exact:true}).click();assert.equal((await saved).status(),200);assert.equal(await page.locator('[data-game-tour]').count(),0);await capture('g2b-tour-skipped')});
 await check('skipped tour stays skipped after restart/reload, with settings unchanged',async()=>{await page.reload();await page.locator('.bv-game').waitFor();assert.equal(await page.locator('[data-game-tour]').count(),0);assert.equal(JSON.stringify((await api('/tenants/'+tenant.id)).tenant.settings),before)});
 await check('unpublished preview tells the truth and loads no fake site',async()=>{await page.locator('[data-game-preview]').click();await page.locator('dialog.bv-game-preview[open]').waitFor();assert.equal(await page.locator('dialog.bv-game-preview').count(),1);assert.match(await page.locator('dialog.bv-game-preview').innerText(),/isn’t published yet/);assert.equal(await page.locator('dialog.bv-game-preview iframe').count(),0);await capture('g2b-preview-unpublished');await contrastCheck('unpublished','.bv-game-preview');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-game-preview]').evaluate(el=>el===document.activeElement),true)});
 // Explicit fixture publication: a real local public route, not a provider/QA approval claim.
 await runtime.env.DB.prepare("UPDATE tenants SET status='published',published=settings WHERE id=?").bind(tenant.id).run();
 await check('preview renders the actual published route, isolated from draft edits',async()=>{
  const published=await worker.fetch(new Request(base+'/s/'+fixture.slug),runtime.env);assert.equal(published.status,200);
  await page.locator('[data-game-refresh]').click();await page.getByText('Saved progress is up to date.',{exact:true}).waitFor();
  await page.locator('[data-game-preview]').click();await page.locator('dialog.bv-game-preview iframe').waitFor();
  assert.equal(await page.locator('dialog.bv-game-preview iframe').getAttribute('data-game-published-url'),'/s/'+fixture.slug);assert.equal(await page.locator('dialog.bv-game-preview iframe').getAttribute('sandbox'),'');
  assert.ok((await page.locator('dialog.bv-game-preview iframe').getAttribute('srcdoc')).includes(fixture.settings.name.split(' · ')[0]));
  await page.frameLocator('dialog.bv-game-preview iframe').locator('body').waitFor();await capture('g2b-preview-published');await contrastCheck('published','.bv-game-preview');await page.getByRole('button',{name:'Back to board',exact:true}).click();
 });
 await check('published preview error preserves the board and has a keyboard exit',async()=>{await page.route(base+'/s/'+fixture.slug,route=>route.fulfill({status:503,body:'QA unavailable'}));await page.locator('[data-game-preview]').click();await page.locator('dialog.bv-game-preview [role=alert]').waitFor();assert.equal(await page.locator('dialog.bv-game-preview iframe').count(),0);await capture('g2b-preview-error');await page.keyboard.press('Escape');await page.unroute(base+'/s/'+fixture.slug)});
 await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'game-second',email:'game-second@example.test'}});
 await check('three-step tour works by keyboard and finishes for a separate account',async()=>{
  await page.goto(base);await page.locator('[data-game-tour]').waitFor();await page.getByRole('button',{name:'Next',exact:true}).focus();await page.keyboard.press('Enter');assert.match(await page.locator('[data-game-tour]').innerText(),/Your current quest/);await capture('g2b-tour-quest');await contrastCheck('tour-quest','.bv-game-tour');
  await page.keyboard.press('Space');assert.match(await page.locator('[data-game-tour]').innerText(),/Your badges/);await capture('g2b-tour-badges');await contrastCheck('tour-badges','.bv-game-tour');
  const saved=page.waitForResponse(r=>r.url().endsWith('/experience')&&r.request().method()==='POST');await page.getByRole('button',{name:'Finish tour',exact:true}).click();assert.equal((await saved).status(),200);await page.reload();await page.locator('.bv-game').waitFor();assert.equal(await page.locator('[data-game-tour]').count(),0);
 });
 // Pure display fixtures for level completion (real future evidence is not available at BASE).
 const bundle=await build({stdin:{contents:"import {mountGame} from './src/client/workspace/game/view.js';import {createGameExperience} from './src/client/workspace/game/experience.js';window.showFixture=(data,event)=>{window.exp?.destroy();window.game?.destroy();window.exp=createGameExperience({request:async()=>({})});window.exp.accept(event);window.game=mountGame(document.querySelector('#fixture'),{data,onRendered:el=>window.exp.attach(el)})}",resolveDir:root},bundle:true,write:false,format:'iife',platform:'browser'});
 const css=fs.readFileSync(root+'/.data/028G/dist/client/platform.css','utf8');
 await page.route(base+'/g2b-display-fixture',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>G-2b QA display fixture</title><style>'+css+'</style></head><body class="bv-platform"><div id="fixture"></div><script>'+bundle.outputFiles[0].text+'</script></body></html>'}));
 const sources=complete();for(const id of ['estimator','promotions','financing','leads','launch','marketing'])delete sources[id];
 const data={tenant:{id:'qa',name:'Level completion · QA fixture'},role:'owner',progress:evaluateProgress(sources),sections:[]};
 await page.goto(base+'/g2b-display-fixture');
 await check('level confirmation is brief, non-blocking and automatically returns to board',async()=>{await page.evaluate(({data})=>window.showFixture(data,{completedLevels:[1],showTour:false}),{data});await page.locator('[data-game-celebration] button').waitFor();assert.match(await page.locator('[data-game-celebration]').innerText(),/Level 1 complete/);await capture('g2b-celebration');await contrastCheck('celebration','.bv-game-confirmation');await page.locator('[data-game-quest=promotions]').click();assert.equal(await page.locator('[data-game-quest=promotions]').getAttribute('aria-selected'),'true');await page.locator('[data-game-celebration] button').waitFor({state:'detached',timeout:6500});await capture('g2b-celebration-board')});
 await check('Continue dismisses confirmation immediately without changing progress',async()=>{await page.evaluate(data=>window.showFixture(data,{completedLevels:[1]}),data);await page.getByRole('button',{name:'Continue',exact:true}).click();assert.equal(await page.locator('[data-game-celebration] button').count(),0);assert.match(await page.locator('.bv-game-strength').innerText(),/40% built/)});
 await check('reduced motion has the same tour and celebration with no movement or opacity animation',async()=>{await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(data=>window.showFixture(data,{showTour:true,completedLevels:[1]}),data);assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length),0);assert.equal(await page.locator('[data-game-tour]').isVisible(),true);await capture('g2b-reduced-motion');await contrastCheck('reduced-motion','.bv-game-tour')});
 await check('new controls remain readable at 390px without horizontal scroll',async()=>{await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);const heights=await page.locator('.bv-game-tour button,[data-game-preview]').evaluateAll(xs=>xs.map(el=>el.getBoundingClientRect().height));assert.ok(heights.every(h=>h>=44));await capture('g2b-phone-reflow')});
 await check('no uncaught browser errors; external requests are never forwarded',async()=>assert.deepEqual(errors,[]));
 fs.writeFileSync(out+'/round4/game-experience-browser.json',JSON.stringify({passed:true,count:checks.length,checks,screenshots:screens,contrast,blockedExternalRequests:blocked,port:5183},null,2));console.log(checks.length+'/'+checks.length+' passed; '+screens.length+' screenshots');
}catch(error){fs.writeFileSync(out+'/round4/game-experience-browser-failure.json',JSON.stringify({passed:false,completed:checks.length,checks,screenshots:screens,error:error.stack},null,2));throw error;}
finally{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));await runtime.close();}
