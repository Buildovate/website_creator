const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out='C:/Users/joe/website_creator/docs/build-evidence/004I-v2';
const base='http://127.0.0.1:8120',results={profiles:[],screenshots:[],fallbacks:[],errors:[]};
const url=(style,variant)=>`${base}/s/motion-${style}-${variant.toLowerCase()}`;
async function scroll(page,y){await page.evaluate(y=>{scrollTo({top:Math.max(0,y),behavior:'instant'});window.TradeMotionScroll?.request()},y);await page.waitForTimeout(60)}
async function profile(browser,view,width,height,style,variant){
 const name=`${view}-${style}-${variant}`,context=await browser.newContext({viewport:{width,height},hasTouch:view==='mobile'}),page=await context.newPage();
 page.on('pageerror',e=>results.errors.push({name,error:e.message}));
 await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 await page.goto(url(style,variant));await page.locator('[data-sticky-stack]').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('[data-sticky-stack]').classList.contains('mk-stack-ready'));
 assert.equal(await page.locator('[data-stack-card]').count(),3);
 assert.equal(await page.locator('[data-stats-mask] h2').innerText(),'The numbers behind the work.');
 assert.deepEqual(await page.locator('[data-stat-key]').evaluateAll(nodes=>nodes.map(n=>n.dataset.statKey)),['years','jobsCompleted','rating','reviews','license']);
 const layout=await page.evaluate(()=>{scrollTo({top:0,behavior:'instant'});const list=document.querySelector('.mk-stack-cards'),slots=[...list.querySelectorAll('[data-stack-card]')],header=document.querySelector('.cx-header').offsetHeight;return {listTop:list.getBoundingClientRect().top+scrollY,offsets:slots.map(s=>s.offsetTop),slotHeights:slots.map(s=>s.offsetHeight),header}});
 const start=layout.listTop-layout.header-60,end=layout.listTop+layout.offsets[2]+layout.slotHeights[2]-height/2;
 const overlap=await page.evaluate(({start,end})=>{
  const slots=[...document.querySelectorAll('[data-stack-card]')],step=24,failures=[];let pinnedChecks=0,mobileFitChecks=0;
  const rounds=[[start,end],[end,start],[start,end]];
  for(const [a,b] of rounds){const dir=Math.sign(b-a);for(let y=a;dir>0?y<=b:y>=b;y+=dir*step){
   scrollTo({top:y,behavior:'instant'});
   const tabs=document.querySelector('.mk-stack-index').getBoundingClientRect(),bar=document.querySelector('.cx-mobile-action')?.getBoundingClientRect(),usableBottom=bar&&bar.top>0?bar.top:innerHeight;
   for(const [i,slot] of slots.entries()){
    const card=slot.querySelector('.mk-stack-card'),r=card.getBoundingClientRect(),pin=parseFloat(getComputedStyle(card).top);
    if(Math.abs(r.top-pin)>1.5||r.bottom<0||r.top>innerHeight)continue;
    pinnedChecks++;
    if(innerWidth<=700){mobileFitChecks++;if(r.top<tabs.bottom-2||r.bottom>usableBottom-8)failures.push({y,i,reason:'card outside visible mobile area',card:[r.top,r.bottom],tabs:tabs.bottom,bar:usableBottom});}
    for(const el of [card.querySelector('h3'),card.querySelector('.mk-stack-copy p')]){
     const t=el.getBoundingClientRect();if(t.top<tabs.bottom-2||t.bottom>usableBottom-4){failures.push({y,i,reason:'pinned text outside visible area',tag:el.tagName,rect:[t.top,t.bottom]});continue;}
     for(const xx of [.15,.5,.85])for(const yy of [.2,.5,.8]){
      const hit=document.elementFromPoint(t.left+t.width*xx,t.top+t.height*yy)?.closest('[data-stack-card]');
      if(hit!==slot)failures.push({y,i,reason:'another card overlaps pinned text',tag:el.tagName,hit:hit?.dataset.stackCard});
     }
    }
   }
   if(failures.length>4)return {pinnedChecks,mobileFitChecks,failures};
  }}
  return {pinnedChecks,mobileFitChecks,failures};
 },{start,end});
 assert.ok(overlap.pinnedChecks>25,`${name}: sampled pinned cards`);assert.deepEqual(overlap.failures,[],`${name}: pinned text must never be overlapped or hidden`);
 await scroll(page,layout.listTop+layout.offsets[0]-layout.header-16);
 const second=page.locator('.mk-stack-index a').nth(1);await second.focus();await second.press('Enter');await page.waitForTimeout(70);
 assert.equal(await page.locator('[data-sticky-stack]').getAttribute('data-stack-active'),'1',`${name}: keyboard index`);
 if(view==='mobile'){await page.locator('.mk-stack-index a').nth(2).tap();await page.waitForTimeout(70);assert.equal(await page.locator('[data-sticky-stack]').getAttribute('data-stack-active'),'2',`${name}: touch index`);}
 if(view==='mobile'){
  for(let i=0;i<2;i++){
   const target=layout.listTop+layout.offsets[i+1]-height*.69;await scroll(page,target);
   await page.locator(`[data-stack-card="${i+1}"] img`).evaluate(img=>{img.loading='eager';return img.decode()});
   const bounds=await page.evaluate(i=>{const old=document.querySelector(`[data-stack-card="${i}"]`),next=document.querySelector(`[data-stack-card="${i+1}"]`);return {oldTextBottom:old.querySelector('.mk-stack-copy p').getBoundingClientRect().bottom,nextTop:next.querySelector('.mk-stack-card').getBoundingClientRect().top}},i);
   assert.ok(bounds.nextTop>bounds.oldTextBottom,`${name}: arriving card stays below outgoing paragraph`);
   const file=`${name}-card${i+1}-next-enters.png`;await page.evaluate(()=>document.activeElement?.blur());await page.screenshot({path:path.join(out,file)});results.screenshots.push(file);
  }
  await scroll(page,layout.listTop+layout.offsets[2]-layout.header-58);
  const file=`${name}-card3-finished.png`;await page.evaluate(()=>document.activeElement?.blur());await page.screenshot({path:path.join(out,file)});results.screenshots.push(file);
 }
 await page.reload();await page.locator('[data-sticky-stack]').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('[data-sticky-stack]').classList.contains('mk-stack-ready'));await scroll(page,0);
 const gridTop=await page.locator('.mk-stats-grid').evaluate(el=>el.getBoundingClientRect().top+scrollY);
 await scroll(page,gridTop-height*1.2);
 await page.evaluate(()=>{const n=document.querySelector('[data-stat-key="jobsCompleted"] [data-stats-number]');window.firstCountValues=[];window.firstCountObserver=new MutationObserver(()=>window.firstCountValues.push(n.textContent));window.firstCountObserver.observe(n,{childList:true,characterData:true,subtree:true})});
 await scroll(page,gridTop-height*.75);await page.waitForFunction(()=>document.querySelector('[data-stats-mask]').dataset.statsPlayed==='true',null,{timeout:5000});
 const firstValues=await page.evaluate(()=>{window.firstCountObserver.disconnect();return window.firstCountValues});
 assert.ok(firstValues.some(v=>v!=='1,250'),`${name}: counter had intermediate values`);
 assert.equal(await page.locator('[data-stat-key="jobsCompleted"] [data-stats-number]').innerText(),'1,250');
 await page.evaluate(()=>{const n=document.querySelector('[data-stat-key="jobsCompleted"] [data-stats-number]');window.replayValues=[];window.replayObserver=new MutationObserver(()=>window.replayValues.push(n.textContent));window.replayObserver.observe(n,{childList:true,characterData:true,subtree:true})});
 await scroll(page,layout.listTop);await scroll(page,gridTop-height*.75);await scroll(page,layout.listTop);await scroll(page,gridTop-height*.75);
 const replay=await page.evaluate(()=>{window.replayObserver.disconnect();return {mutations:window.replayValues,progress:document.querySelector('[data-stats-mask]').dataset.motionProgress,value:document.querySelector('[data-stat-key="jobsCompleted"] [data-stats-number]').textContent}});
 assert.deepEqual(replay.mutations,[],`${name}: counter must not write/replay after completion`);assert.equal(replay.progress,'1.000');assert.equal(replay.value,'1,250');
 await page.emulateMedia({reducedMotion:'reduce'});await scroll(page,layout.listTop+layout.offsets[1]);
 assert.notEqual(await page.locator('[data-stack-card="1"] .mk-stack-card').evaluate(el=>getComputedStyle(el).position),'sticky');
 assert.equal(await page.locator('[data-stat-key="jobsCompleted"] [data-stats-number]').innerText(),'1,250');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 results.profiles.push({name,width,height,pinnedChecks:overlap.pinnedChecks,mobileFitChecks:overlap.mobileFitChecks,firstCountSamples:firstValues.length,counterReplayMutations:replay.mutations.length,statsShown:['years','jobsCompleted','rating','reviews','license'],hidden:['warranty'],passed:true});
 console.log(`PASS ${name}: ${overlap.pinnedChecks} pinned checks, no overlap, no counter replay`);await context.close();
}
async function fallback(browser,view,width,height){const context=await browser.newContext({viewport:{width,height},javaScriptEnabled:false}),page=await context.newPage();await page.goto(url('bold-industrial','A'));assert.equal(await page.locator('[data-stack-card]').count(),3);assert.notEqual(await page.locator('[data-stack-card="0"] .mk-stack-card').evaluate(el=>getComputedStyle(el).position),'sticky');assert.equal(await page.locator('[data-stat-key="jobsCompleted"] [data-stats-number]').innerText(),'1,250');results.fallbacks.push({view,noJS:true});await context.close()}
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{for(const [view,w,h]of[['desktop',1440,900],['mobile',390,844]])for(const style of ['bold-industrial','clean-modern'])for(const variant of ['A','B','C'])await profile(browser,view,w,h,style,variant);for(const [view,w,h]of[['desktop',1440,900],['mobile',390,844]])await fallback(browser,view,w,h);assert.deepEqual(results.errors,[]);fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(results,null,2));console.log('PASS 12/12 profiles, fallbacks, touch, keyboard, overlap and replay');}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
