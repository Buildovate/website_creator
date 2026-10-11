const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const out=__dirname,base='http://127.0.0.1:8104',url=base+'/s/motion-bold-industrial-a';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH}),results={views:[],variants:[],errors:[]};
 async function position(page,selector,p){await page.locator(selector).evaluate((el,p)=>{const header=document.querySelector('.cx-header').getBoundingClientRect().height;
  const top=el.getBoundingClientRect().top+scrollY;
  const y=el.matches('[data-layer-explode]')?top-header+p*(el.offsetHeight-el.querySelector('.mk-layer-stage').offsetHeight):el.matches('[data-kinetic-text=words]')?top-innerHeight*.86+p*innerHeight*.55:top-header-12;
  scrollTo(0,y);
 },p);await page.waitForTimeout(180);}
 async function shot(page,name){await page.screenshot({path:path.join(out,name+'.png')});}
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage();
  page.on('pageerror',e=>results.errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  await page.goto(url);await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('[data-layer-explode]').count(),1);
  for(const [state,time] of [['rest',0],['mid',440],['finished',2000]]){
   await page.evaluate(time=>document.querySelector('[data-kinetic-text=lines]').getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=time}),time);await shot(page,`${name}-kinetic-headline-${state}`);
  }
  for(const [state,p] of [['rest',0],['mid',.5],['finished',1]]){await position(page,'[data-kinetic-text=words]',p);await page.waitForFunction(()=>document.querySelector('[data-kinetic-text=words]').dataset.motionProgress!==undefined);await shot(page,`${name}-kinetic-statement-${state}`);}
  for(const [state,p] of [['rest',0],['mid',.5],['finished',1]]){await position(page,'[data-layer-explode]',p);await shot(page,`${name}-layer-${state}`);}
  const progress=await page.locator('[data-layer-explode]').getAttribute('data-motion-progress');assert.equal(progress,'1.000');
  await position(page,'[data-layer-explode]',.5);assert.equal(await page.locator('[data-roof-layer="6"]').evaluate(el=>getComputedStyle(el).transform),'matrix(1, 0, 0, 1, 0, -169)');
  await position(page,'[data-reveal-compare]',0);const slider=page.getByRole('slider',{name:'After repair revealed'});await slider.focus();
  for(const [state,value] of [['rest',0],['mid',50],['finished',100]]){await slider.fill(String(value));await position(page,'[data-reveal-compare]',0);await shot(page,`${name}-compare-${state}`);}
  await slider.press('Home');assert.equal(await slider.inputValue(),'0');await slider.press('ArrowRight');assert.equal(await slider.inputValue(),'1');await slider.press('End');assert.equal(await slider.inputValue(),'100');
  assert.equal(await page.locator('h1').innerText().then(t=>/roof/i.test(t)),true);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(200);
  for(const [component,selector] of [['kinetic-headline','[data-kinetic-text=lines]'],['kinetic-statement','[data-kinetic-text=words]'],['layer','[data-layer-explode]'],['compare','[data-reveal-compare]']]){await position(page,selector,1);await shot(page,`${name}-${component}-reduced`);}
  assert.equal(await page.locator('.mk-layer-stage').evaluate(el=>getComputedStyle(el).position),'relative');
  assert.equal(await page.locator('[data-kinetic-text=words] [data-kinetic-part]').first().evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await slider.inputValue(),'100');
  await page.emulateMedia({reducedMotion:'no-preference'});
  results.views.push({name,width,height,passed:true});
  await context.close();console.log('PASS '+name+' screenshots, reverse scroll, keyboard slider, live reduced motion, overflow');
 }
 for(const style of ['bold-industrial','clean-modern'])for(const variant of ['A','B','C']){
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true}),page=await context.newPage();await page.goto(base+'/s/motion-'+style+'-'+variant.toLowerCase());
  await position(page,'[data-layer-explode]',.5);await page.waitForFunction(()=>document.querySelector('[data-layer-explode]').dataset.motionProgress!==undefined);await shot(page,`mobile-${style}-${variant}-layer`);
  await position(page,'[data-reveal-compare]',0);await shot(page,`mobile-${style}-${variant}-compare`);
  if(variant==='B'){
   const canvas=page.locator('[data-compare-canvas]'),box=await canvas.boundingBox();const cdp=await context.newCDPSession(page);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+80,y:box.y+100}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+230,y:box.y+103}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   assert.ok(+await page.locator('[data-compare-range]').inputValue()>55);await shot(page,`mobile-${style}-${variant}-lens-drag`);
  }
  if(variant==='C')for(const [i,label] of ['Before storm','After storm','After repair'].entries()){await page.getByRole('button',{name:label,exact:true}).click();assert.equal(await page.getByRole('button',{name:label,exact:true}).getAttribute('aria-pressed'),'true');await shot(page,`mobile-${style}-${variant}-state-${i}`);}
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));results.variants.push({style,variant,passed:true});await context.close();
 }
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),staticPage=await nojs.newPage();await staticPage.goto(url);await staticPage.locator('[data-layer-explode]').scrollIntoViewIfNeeded();await shot(staticPage,'mobile-no-js-layer');assert.equal(await staticPage.locator('.mk-layer-labels li').count(),7);await nojs.close();
 const legacy=await browser.newPage();await legacy.goto(base+'/s/motion-legacy');assert.equal(await legacy.locator('[data-layer-explode]').count(),0);assert.equal(await legacy.locator('#inside').count(),1);await legacy.close();
 assert.deepEqual(results.errors,[]);fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(results,null,2));await browser.close();console.log('PASS six profiles, touch lens, toggles, no-JS content and preserved legacy anatomy.');
})().catch(error=>{console.error(error);process.exit(1)});
