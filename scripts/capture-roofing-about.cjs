const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const out='docs/build-evidence/007';
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 for(const [device,viewport] of Object.entries({desktop:{width:1440,height:1000},mobile:{width:390,height:844}})) {
  const page=await browser.newPage({viewport});page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:8100/s/about-fallback';
  await page.goto(base+'/about',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('h1').textContent(),'A clear plan. A roof that feels like home.');
  assert.equal(await page.locator('.tp-about-points li').count(),3);
  assert.equal(await page.locator('[data-about-portrait]').count(),0);
  assert.equal(await page.locator('.tp-about-designed').isVisible(),true);
  assert.equal(await page.locator('.tp-brand img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0)),true);
  await page.screenshot({path:`${out}/${device}.png`,fullPage:true});
  await page.screenshot({path:`${out}/${device}-hero.png`});
  await page.locator('#about-story').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${device}-story.png`});
  await page.goto(base+'/about');await page.keyboard.press('Tab');assert.equal(await page.locator('.tp-skip').evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Enter');await page.waitForURL('**/about#about-story');
  if(device==='mobile'){await page.locator('.tp-menu summary').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.tp-menu nav').isVisible(),true);await page.locator('.tp-menu a[href$="/faq"]').click();await page.waitForURL('**/faq');}
  await page.goto(base+'/about');await page.locator('.tp-about-links a').first().click();await page.waitForURL('**/services/roof-repair');
  await page.goto(base+'/about');await page.locator('.tp-about-hero .tp-button').first().click();await page.waitForURL('**/about-fallback#contact');assert.equal(await page.locator('#contact').isVisible(),true);
  for(const mode of ['fallback','standard']) {
   await page.goto('http://127.0.0.1:8100/s/about-'+mode,{waitUntil:'networkidle'});
   if(device==='mobile'&&mode==='fallback')await page.locator('.cx-mobile-menu summary').click();
   let clicked=false;for(const a of await page.locator('header a[href$="/about"]').all())if(await a.isVisible()){await a.click();clicked=true;break;}
   assert.equal(clicked,true);await page.waitForURL('**/about');
  }
  await page.goto('http://127.0.0.1:8100/s/about-uploaded/about',{waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-about-portrait]').evaluate(img=>img.complete&&img.naturalWidth>0),true);
  assert.equal(await page.locator('.tp-about-designed').count(),0);
  await page.locator('#about-story').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${device}-uploaded.png`});
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/about');
  assert.equal(await page.locator('.tp-about-story').isVisible(),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);
  console.log(`PASS ${device} ${viewport.width}x${viewport.height}: confirmed story, three why-us points, uploaded logo and portrait slot, honest no-person fallback, both homepage menus, keyboard skip/menu, service/contact links, reduced motion, loaded images, no overflow or page errors`);
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
