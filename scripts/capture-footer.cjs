const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const out='docs/build-evidence/012',base='http://127.0.0.1:8106',browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH}),metrics=[];
 for(const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  for(const mode of ['single','hidden','required','multiple']){
   await page.goto(base+'/s/footer-'+mode,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);const footer=page.locator('footer.studio-footer');await footer.scrollIntoViewIfNeeded();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
   if(mode==='hidden'||mode==='required'){assert.equal(await footer.locator('.footer-company,.footer-locations').count(),0);assert.ok(!(await footer.textContent()).includes('Empty location heading'));}
   if(mode==='required'){assert.equal(await footer.locator('.footer-required-license').textContent(),'ZZ License QA-LICENSE-001');await footer.locator('.footer-policy-disclosure').waitFor({state:'visible'});}
   if(mode==='multiple'){
    assert.equal(await footer.locator('.footer-location').count(),2);const summary=footer.locator('summary');await summary.focus();await page.keyboard.press('Enter');assert.equal(await footer.locator('details').getAttribute('open'),'');await page.keyboard.press('Enter');assert.equal(await footer.locator('details').getAttribute('open'),null);
   }
   for(const text of ['Privacy policy','Website terms']){const link=footer.getByRole('link',{name:text,exact:true}),href=await link.getAttribute('href');assert.ok(href.endsWith(text==='Privacy policy'?'/legal/privacy':'/legal/terms'));const response=await page.request.get(base+href);assert.equal(response.status(),200);}
   if(width<850&&(mode==='single'||mode==='multiple')){
    const company=await footer.locator('.footer-company').boundingBox(),grid=await footer.locator('.studio-footer-grid').boundingBox();assert.ok(Math.abs(company.width-grid.width)<2,'mobile primary contact spans the full grid');
   }
   if(mode==='required'){
    await footer.locator('.footer-required-license').evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(100);
    assert.ok(await footer.locator('.footer-required-license').evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),'required line is readable with normal sticky chrome');
   }
   await page.evaluate(()=>document.activeElement?.blur());
   // Element captures span more than one mobile screen. Hide fixed page chrome only
   // during capture so it is not duplicated over the stitched footer image.
   await footer.screenshot({path:`${out}/${device}-${mode}.png`,style:'.cx-header,.cx-mobile-action,.cx-skip{visibility:hidden!important}'});metrics.push({device,mode,footer:await footer.boundingBox(),columns:await footer.locator('.studio-footer-grid').evaluate(e=>getComputedStyle(e).gridTemplateColumns)});
  }
  assert.deepEqual(errors,[]);console.log(`PASS ${device}: single/hidden/required/multiple footers; no empty blocks or overflow; required license, keyboard financing disclosure and both legal routes`);await page.close();
 }
 fs.writeFileSync(out+'/browser-metrics.json',JSON.stringify(metrics,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
