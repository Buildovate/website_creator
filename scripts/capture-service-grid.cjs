const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{
 const out='docs/build-evidence/005';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 for(const [device,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
  const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const journey of ['standard','roof-repair']) {
   await page.goto('http://127.0.0.1:8098/s/grid-'+journey,{waitUntil:'networkidle'});
   const grid=page.locator('#services');await grid.scrollIntoViewIfNeeded();
   await page.waitForTimeout(800);
   assert.equal(await grid.locator('article').count(),8);
   assert.equal(await grid.locator('a[href*="/services/offering-"]').count(),8);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   // Capture every selected tile; scroll through to trigger existing reveal effects.
   for(const card of await grid.locator('article').all()) {await card.scrollIntoViewIfNeeded();await page.waitForTimeout(150);}
   await page.waitForTimeout(800);
   await grid.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-120,behavior:'instant'}));
   await page.waitForTimeout(500);
   await page.screenshot({path:`${out}/${device}-${journey}-grid.png`});
   await grid.locator('a').nth(1).click();await page.waitForURL('**/services/offering-1');
   assert.equal(await page.locator('input[name="service"]').inputValue(),'Roof repair');
   if(journey==='roof-repair')await page.screenshot({path:`${out}/${device}-detail.png`});
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.goto('http://127.0.0.1:8098/s/grid-'+journey+'#services',{waitUntil:'networkidle'});
   assert.equal(await page.locator('#services a[href*="/services/"]').count(),8);
   assert.equal(await page.locator('#services article').first().isVisible(),true);
   await page.emulateMedia({reducedMotion:'no-preference'});
   console.log(`PASS ${device} ${journey}: eight tiles/links, no overflow, detail click and service prefill, reduced-motion content`);
  }
  assert.deepEqual(errors,[]);console.log(`PASS ${device}: no page errors`);await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
