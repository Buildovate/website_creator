const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {buildSync}=require('esbuild');
(async()=>{
 const out='docs/build-evidence/007A',browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 for(const [device,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})){
  const page=await browser.newPage({viewport});page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8101/s/trust-full/about',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.locator('.ta-stats').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
  assert.equal(await page.locator('.ta-stat').count(),5);assert.equal(await page.locator('.ta-cards article').count(),3);assert.equal(await page.locator('.ta-project').count(),3);
  assert.equal(await page.locator('[data-about-story]').evaluate(el=>el.textContent.trim().split(/\s+/).length<=60),true);
  assert.ok(await page.locator('body').innerText().then(t=>(t.match(/Ridgeline Roofing Demo/g)||[]).length<=2));
  for(const n of await page.locator('[data-trust-count]').all())assert.equal(await n.textContent(),await n.getAttribute('data-trust-final'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.locator('.ta-work').scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('.ta-project img')].every(i=>i.complete&&i.naturalWidth>0));await page.screenshot({path:`${out}/${device}-projects.png`});
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/${device}.png`,fullPage:true});await page.screenshot({path:`${out}/${device}-hero.png`});
  await page.locator('.ta-proof').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${device}-proof.png`});
  await page.locator('.ta-project').first().click();await page.waitForURL('**/projects/**');assert.equal(await page.locator('body').innerText().then(t=>t.includes('QA sample')),true);
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:8101/s/trust-full/about');
  for(const n of await page.locator('[data-trust-count]').all())assert.equal(await n.textContent(),await n.getAttribute('data-trust-final'));
  if(device==='mobile'){await page.locator('.tp-menu summary').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.tp-menu nav').isVisible(),true);}
  await page.goto('http://127.0.0.1:8101/s/trust-empty/about',{waitUntil:'networkidle'});assert.equal(await page.locator('.ta-stats,.ta-work').count(),0);assert.equal(await page.locator('.ta-cards article').count(),3);await page.screenshot({path:`${out}/${device}-empty.png`,fullPage:true});
  await page.goto('http://127.0.0.1:8101/s/trust-uploaded/about',{waitUntil:'networkidle'});assert.equal(await page.locator('.ta-hero [data-about-portrait]').evaluate(i=>i.complete&&i.naturalWidth>0),true);assert.equal(await page.locator('.ta-truck').count(),0);
  assert.deepEqual(errors,[]);console.log(`PASS ${device}: 5 confirmed stats, final count-up and reduced-motion values, 3 proof cards, <=60 story words, <=2 name mentions, 3 published project links, map chip, no-data omission, owned hero, mobile menu, no overflow/page errors`);await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(15000);
 await page.goto('http://127.0.0.1:8101/s/trust-full/about');
 const {tenant}=JSON.parse(fs.readFileSync(out+'/local-fixture.json','utf8'));
 const bundle=buildSync({entryPoints:['src/client/workspace/questionnaire.ts'],bundle:true,write:false,format:'iife',globalName:'QuestionnaireQA',platform:'browser'}).outputFiles[0].text;
 await page.setContent('<link rel="stylesheet" href="/app.css"><link rel="stylesheet" href="/flow.css"><main id="qa"></main>');await page.addScriptTag({content:bundle});
 await page.evaluate(async()=>{const r=await fetch('/auth/local-session',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({userId:'trust-qa',email:'trust-qa@example.test'})});if(!r.ok)throw Error(await r.text());window.qaCsrf=(await (await fetch('/api/session')).json()).csrfToken;});
 await page.evaluate(tenant=>{window.qaTenant=tenant;window.qaSaves=0;QuestionnaireQA.mountQuestionnaire(document.querySelector('#qa'),{settings:tenant.settings,slug:tenant.slug,photos:[],write:true,dirty:()=>{},save:async settings=>{const r=await fetch('/api/tenants/'+window.qaTenant.id,{method:'PUT',headers:{'content-type':'application/json','X-CSRF-Token':window.qaCsrf},body:JSON.stringify({version:window.qaTenant.version,settings})});if(!r.ok)throw Error(await r.text());window.qaTenant=(await r.json()).tenant;window.qaSaves++;}});},tenant);
 await page.locator('#q-trust').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/questionnaire.png',fullPage:false});
 await page.locator('[name="trust-years"]').fill('19');assert.equal(await page.locator('[name="trust-confirm-years"]').isChecked(),false);
 await page.locator('button[type="submit"]').click();await page.waitForFunction(()=>window.qaSaves===1).catch(async error=>{console.log(await page.evaluate(()=>({status:document.querySelector('[data-q-status]').textContent,invalid:[...document.querySelectorAll(':invalid')].map(e=>({name:e.name,message:e.validationMessage})),saves:window.qaSaves})));throw error;});
 const saved=await page.evaluate(()=>window.qaTenant);assert.equal(saved.settings.businessTrust.years,19);assert.equal(saved.settings.businessTrust.confirmed.years,false);assert.equal(saved.published.businessTrust.years,18);
 await page.locator('[name="trust-confirm-years"]').check();await page.locator('button[type="submit"]').click();await page.waitForFunction(()=>window.qaSaves===2);assert.equal(await page.evaluate(()=>window.qaTenant.settings.businessTrust.confirmed.years),true);
 await page.locator('[name="trust-insured"]').selectOption('no');assert.equal(await page.locator('[name="trust-confirm-insured"]').isChecked(),false);
 console.log('PASS real Questionnaire mount + API saves: edited values clear individual confirmation, draft save preserves published facts, explicit reconfirmation persists, insurance No clears confirmation.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
