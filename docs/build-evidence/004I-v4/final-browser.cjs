const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out='C:/Users/joe/website_creator/docs/build-evidence/004I-v4/components',base='http://127.0.0.1:8123';fs.mkdirSync(out,{recursive:true});
const results={profiles:[],screenshots:[],touch:[],errors:[]};
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
async function position(page,selector,p){await page.locator(selector).evaluate((el,p)=>{const header=document.querySelector('.cx-header').getBoundingClientRect().height,top=el.getBoundingClientRect().top+scrollY;scrollTo(0,el.matches('[data-layer-explode]')?top-header+p*(el.offsetHeight-el.querySelector('.mk-layer-stage').offsetHeight):el.matches('[data-kinetic-text=words]')?top-innerHeight*.86+p*innerHeight*.55:top-header-12)},p);await page.waitForTimeout(160);}
async function shot(page,name){await page.screenshot({path:path.join(out,name+'.png')});results.screenshots.push(name+'.png');}
for(const [view,width,height]of [['desktop',1440,900],['mobile',390,844]])for(const style of ['bold-industrial','clean-modern'])for(const variant of ['A','B','C']){
 const name=`${view}-${style}-${variant}`,context=await browser.newContext({viewport:{width,height},hasTouch:view==='mobile'}),page=await context.newPage();page.on('pageerror',e=>results.errors.push({name,error:e.message}));
 await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 await page.goto(`${base}/s/motion-${style}-${variant.toLowerCase()}`);await page.waitForFunction(()=>document.documentElement.dataset.enhancementsReady==='true');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
 assert.match(await page.locator('h1').innerText(),/roof/i);
 for(const [state,time]of [['rest',0],['mid',440],['finished',2000]]){await page.evaluate(time=>document.querySelector('[data-kinetic-text=lines]').getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=time}),time);await shot(page,`${name}-kinetic-headline-${state}`);}
 for(const [state,p]of [['rest',0],['mid',.5],['finished',1]]){await position(page,'[data-kinetic-text=words]',p);await page.waitForFunction(()=>document.querySelector('[data-kinetic-text=words]').dataset.motionProgress!==undefined);await shot(page,`${name}-kinetic-statement-${state}`);}
 for(const [state,p]of [['rest',0],['mid',.5],['finished',1]]){await position(page,'[data-layer-explode]',p);await shot(page,`${name}-layer-${state}`);}
 assert.ok(+await page.locator('[data-layer-explode]').getAttribute('data-motion-progress')>=.998);assert.equal(await page.locator('[data-layer-phase]').innerText(),'Finished roof');
 await position(page,'[data-layer-explode]',.5);const transform=await page.locator('[data-roof-layer="6"]').evaluate(el=>getComputedStyle(el).transform);assert.equal(transform,variant==='C'?'matrix(1, 0, 0, 1, 24, -169)':'matrix(1, 0, 0, 1, 0, -169)');
 await position(page,'[data-reveal-compare]',0);await page.locator('.mk-repair').evaluate(i=>i.decode());
 if(variant==='C'){
  for(const [state,label]of [['rest','Before storm'],['mid','After storm'],['finished','After repair']]){const button=page.getByRole('button',{name:label,exact:true});await button.click();if(label==='After storm')await page.locator('.mk-damage').evaluate(i=>i.decode());assert.equal(await button.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-compare-state][aria-pressed=true]').count(),1);await shot(page,`${name}-compare-${state}`);}
  if(view==='mobile')results.touch.push({name,control:'three-state toggle',passed:true});
 }else{
  const slider=page.locator('[data-compare-range]');for(const [state,value]of [['rest',0],['mid',50],['finished',100]]){await slider.fill(String(value));await shot(page,`${name}-compare-${state}`);}
  await slider.press('Home');assert.equal(await slider.inputValue(),'0');await slider.press('ArrowRight');assert.equal(await slider.inputValue(),'1');await slider.press('End');assert.equal(await slider.inputValue(),'100');
  if(variant==='B'&&view==='mobile'){
   const box=await page.locator('[data-compare-canvas]').boundingBox(),cdp=await context.newCDPSession(page);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+60,y:box.y+100}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+230,y:box.y+103}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   const value=+await slider.inputValue();assert.ok(value>55);await shot(page,`${name}-lens-touch`);results.touch.push({name,control:'horizontal touch lens',value,passed:true});
  }
 }
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);
 for(const [component,selector]of [['kinetic-headline','[data-kinetic-text=lines]'],['kinetic-statement','[data-kinetic-text=words]'],['layer','[data-layer-explode]'],['compare','[data-reveal-compare]']]){await position(page,selector,1);await shot(page,`${name}-${component}-reduced`);}
 assert.equal(await page.locator('.mk-layer-stage').evaluate(el=>getComputedStyle(el).position),'relative');assert.equal(await page.locator('[data-kinetic-text=words] [data-kinetic-part]').first().evaluate(el=>getComputedStyle(el).opacity),'1');
 assert.equal(await page.locator('[data-compare-status]').innerText(),'After repair');
 results.profiles.push({name,width,height,passed:true});console.log('PASS '+name);await context.close();
}
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),p=await nojs.newPage();await p.goto(base+'/s/motion-bold-industrial-a');await p.locator('[data-layer-explode]').scrollIntoViewIfNeeded();await shot(p,'mobile-no-js-layer');assert.equal(await p.locator('.mk-layer-labels li').count(),7);await nojs.close();
const legacy=await browser.newPage();await legacy.goto(base+'/s/motion-legacy');assert.equal(await legacy.locator('[data-layer-explode]').count(),0);assert.equal(await legacy.locator('#inside').count(),1);await legacy.close();
assert.deepEqual(results.errors,[]);fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(results,null,2));await browser.close();console.log('PASS final matrix, touch lens, toggles, keyboard, live reduced motion, no-JS, legacy, overflow and errors.');
})().catch(e=>{console.error(e);process.exit(1)});
