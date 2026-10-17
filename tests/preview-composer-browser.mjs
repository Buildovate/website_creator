import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
const origin='http://127.0.0.1:8194',email='composer-preview@example.test',userId='composer-preview';
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:email,LISTEN_HOST:'127.0.0.1',APP_ORIGIN:origin,PORT:'8194'}});
const headers={origin,'content-type':'application/json','oai-authenticated-user-id':userId,'oai-authenticated-user-email':email};
assert.equal((await worker.fetch(new Request(origin+'/api/setup',{method:'POST',headers,body:'{}'}),runtime.env)).status,200);
const server=await listen(runtime,8194),browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
const out='docs/build-evidence/PREVIEW-REAL-PAGES/composer';fs.mkdirSync(out,{recursive:true});const checks=[],errors=[],check=(v,m)=>{assert.ok(v,m);checks.push(m)};
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});
  await context.request.post(origin+'/auth/local-session',{headers:{origin},data:{userId,email}});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin);await page.locator('[data-action="nav"][data-view="tradeLibrary"]').first().evaluate(el=>el.click());
  await page.locator('[data-kit-prompts="roofing"]').first().click();await page.locator('#compose-kit').waitFor();
  if(width===390)await page.locator('#compose-device').selectOption('390');
  const frame=await page.locator('#dialog iframe').elementHandle().then(el=>el.contentFrame());
  for(const route of ['services/roof-repair','areas/oxnard','about','faq','financing','legal/privacy']){
   await frame.goto(origin+'/design-preview/roofing/immersive/'+route+'?font=display&palette=brand');
   await page.locator('[data-design-choice="layout"]').selectOption('editorial');
   await page.locator('[data-design-choice="font"]').selectOption('modern');
   await page.locator('[data-design-choice="palette"]').selectOption('ocean');
   await page.locator('#preview-combination').click();
   await frame.waitForURL(url=>url.pathname.endsWith('/editorial/'+route)&&url.searchParams.get('font')==='modern');
   check((await frame.locator('h1').evaluate(el=>getComputedStyle(el).fontFamily)).includes('Arial'),width+' '+route+' preview choices change actual font');
   await page.locator('[data-randomize]').evaluateAll(inputs=>inputs.forEach(input=>input.checked=input.dataset.randomize==='font'));
   await page.locator('#regenerate-design').click();
   await frame.waitForURL(url=>url.pathname.endsWith('/editorial/'+route)&&url.searchParams.get('font')!=='modern');
   check(new URL(frame.url()).pathname.endsWith(route),width+' '+route+' Regenerate retains page');
   await page.locator('#undo-combination').click();
   await frame.waitForURL(url=>url.pathname.endsWith('/editorial/'+route)&&url.searchParams.get('font')==='modern');
   check(true,width+' '+route+' Previous design retains page');
  }
  await page.locator('#dialog').evaluate(el=>el.scrollTop=0);
  await page.screenshot({path:out+'/'+width+'.png'});
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),width+' composer fits platform viewport');
  await context.close();
 }
 check(errors.length===0,'No composer JavaScript errors');console.log('PASS '+checks.length+' composer browser checks');
}finally{fs.writeFileSync(out+'/results.json',JSON.stringify({checks,errors},null,2));await browser.close();await new Promise(r=>server.close(r));await runtime.close()}
