const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const out='docs/build-evidence/009',browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH}),base='http://127.0.0.1:8102/s/trust-sites-';
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'}),errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>{if(new URL(r.request().url()).origin!=='http://127.0.0.1:8102'){external.push(r.request().url());return r.abort()}return r.continue()});
  await page.goto(base+'many');await page.evaluate(()=>document.fonts.ready);const strip=page.locator('[data-trust-strip]'),list=strip.locator('.trust-list');
  await strip.scrollIntoViewIfNeeded();assert.equal(await strip.locator('li').count(),6);assert.equal(await strip.locator('.trust-rating').count(),0);assert.equal(await strip.locator('img').count(),0);assert.equal(await strip.locator('.trust-name').first().textContent(),'Google');
  await page.screenshot({path:out+'/'+name+'.png'});await strip.screenshot({path:out+'/'+name+'-strip.png'});
  await strip.locator('[data-trust-next]').click();await page.waitForFunction(()=>document.querySelector('.trust-list').scrollLeft>0);
  await list.focus();await page.keyboard.press('End');await page.waitForFunction(()=>{const e=document.querySelector('.trust-list');return e.scrollLeft>=e.scrollWidth-e.clientWidth-2});
  const end=await list.evaluate(e=>e.scrollLeft);await strip.locator('[data-trust-prev]').click();assert.ok(await list.evaluate(e=>e.scrollLeft)<end);
  await list.focus();await page.keyboard.press('Home');assert.equal(await list.evaluate(e=>e.scrollLeft),0);
  await strip.locator('[data-trust-index="1"]').click();assert.ok(await list.evaluate(e=>e.scrollLeft)>0);
  assert.ok(!(await page.content()).includes('PRIVATE_DRAFT'));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.goto(base+'row');await page.locator('[data-trust-strip]').scrollIntoViewIfNeeded();assert.equal(await page.locator('[data-trust-mode="row"]').count(),1);assert.equal(await page.locator('[data-trust-controls]').count(),0);await page.screenshot({path:out+'/'+name+'-row.png'});
  await page.goto(base+'empty');assert.equal(await page.locator('[data-trust-strip]').count(),0);await page.screenshot({path:out+'/'+name+'-empty.png'});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);console.log('PASS '+name+': six approved profiles, 3-profile row, source-link fallback/no marks or invented ratings, keyboard Home/End/arrows, prev from end, dots, reduced motion, empty omission, draft privacy, no overflow/errors/external calls');await page.close();
 }
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await context.newPage();await page.goto(base+'many');assert.equal(await page.locator('.trust-card a').count(),6);assert.equal(await page.locator('[data-trust-controls]:visible').count(),0);assert.ok(await page.locator('.trust-list').evaluate(e=>e.scrollWidth>e.clientWidth));console.log('PASS no JavaScript: six usable source links and native horizontal scrolling, no dead controls');await context.close();await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
