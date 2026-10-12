const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{const out='docs/build-evidence/008',browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8102/s/trust-sites-many');await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('[data-trust-strip]').count(),0);
  assert.equal(await page.locator('.site-brand-logo').evaluate(i=>i.complete&&i.naturalWidth>0),true);
  assert.ok(!(await page.content()).includes('PRIVATE_DRAFT'));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:out+'/'+name+'.png'});assert.deepEqual(errors,[]);await page.close();console.log('PASS '+name+': saved trust contract does not change homeowner claims; logo loads, no draft evidence, no overflow/page errors');
 }await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
