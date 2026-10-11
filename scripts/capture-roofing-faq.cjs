const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const out='docs/build-evidence/006';
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 for(const [device,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
  const page=await browser.newPage({viewport});page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:8099/s/grid-roof-repair';
  await page.goto(base+'/faq',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('#answers details').count(),16);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.screenshot({path:`${out}/${device}.png`,fullPage:true});
  await page.screenshot({path:`${out}/${device}-hero.png`});
  const summary=page.locator('#answers summary').first();await summary.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#answers details').first().getAttribute('open'),'');
  await summary.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-150,behavior:'instant'}));await page.screenshot({path:`${out}/${device}-answer.png`});
  await page.keyboard.press('Space');assert.equal(await page.locator('#answers details').first().getAttribute('open'),null);
  const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());assert.equal(schema.mainEntity.length,16);
  if(device==='mobile') {await page.locator('.tp-menu summary').click();assert.equal(await page.locator('.tp-menu nav').isVisible(),true);}
  await page.locator('.tp-faq-next a').first().click();await page.waitForURL('**/services/offering-0');
  assert.equal(await page.locator('input[name="service"]').inputValue(),'Roof installation');
  await page.goto(base+'/faq');await page.locator('.tp-hero .tp-button').first().click();await page.waitForURL('**/grid-roof-repair#contact');assert.equal(await page.locator('#contact').isVisible(),true);
  for(const journey of ['standard','roof-repair']) {
   await page.goto('http://127.0.0.1:8099/s/grid-'+journey,{waitUntil:'networkidle'});

   if(device==='mobile'&&journey==='roof-repair')await page.locator('.cx-mobile-menu summary').click();
   // Follow the visible header FAQ link in each responsive renderer.
   const links=page.locator('header a[href$="/faq"]');let clicked=false;
   for(const a of await links.all())if(await a.isVisible()){await a.click();clicked=true;break;}
   assert.equal(clicked,true);await page.waitForURL('**/faq');
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/faq');
  assert.equal(await page.locator('#answers summary').first().isVisible(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);
  console.log(`PASS ${device} ${viewport.width}x${viewport.height}: 16 answers, matching schema, keyboard disclosures, navigation from both homepages, service/contact links, mobile menu, reduced motion, no overflow or page errors`);
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
