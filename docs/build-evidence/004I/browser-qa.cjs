const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out='C:/Users/joe/website_creator/docs/build-evidence/004I',base='http://127.0.0.1:8120';
const results={profiles:[],screenshots:[],recordings:[],fallbacks:[],errors:[]};
const url=(style,variant)=>`${base}/s/motion-${style}-${variant.toLowerCase()}`;
async function scroll(page,y){await page.evaluate(y=>scrollTo(0,Math.max(0,y)),y);await page.waitForTimeout(180)}
async function positions(page){await scroll(page,0);return page.evaluate(()=>{const top=s=>document.querySelector(s).getBoundingClientRect().top+scrollY;return {stack:top('[data-sticky-stack]'),cards:[0,1,2].map(i=>top(`[data-stack-card="${i}"]`)),stats:top('[data-stats-mask]'),statsHeight:document.querySelector('[data-stats-mask]').offsetHeight,header:document.querySelector('.cx-header').getBoundingClientRect().height}})}
async function shot(page,name){await page.screenshot({path:path.join(out,name+'.png')});results.screenshots.push(name+'.png')}
async function prepare(page){await page.waitForFunction(()=>document.documentElement.dataset.enhancementsReady==='true');await page.evaluate(()=>document.fonts.ready);}
async function profile(browser,view,width,height,style,variant){
 const name=`${view}-${style}-${variant}`,context=await browser.newContext({viewport:{width,height},hasTouch:view==='mobile'}),page=await context.newPage();
 page.on('pageerror',e=>results.errors.push({name,error:e.message}));await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 await page.goto(url(style,variant));await prepare(page);
 assert.equal(await page.locator('[data-stack-card]').count(),3);assert.equal(await page.locator('[data-stat-key]').count(),5);
 assert.deepEqual(await page.locator('[data-stat-key]').evaluateAll(nodes=>nodes.map(n=>n.dataset.statKey)),['years','jobsCompleted','rating','reviews','license']);
 assert.equal(await page.locator('[data-stat-key="warranty"]').count(),0);
 let pos=await positions(page);const head=pos.header;
 await scroll(page,pos.cards[0]-head-16);await page.locator('[data-stack-card="0"] img').evaluate(i=>i.decode());await page.waitForFunction(()=>document.querySelector('[data-sticky-stack]').classList.contains('mk-stack-ready'));
 await shot(page,`${name}-stack-rest`);
 await scroll(page,pos.cards[1]-head-height*.5);await page.locator('[data-stack-card="1"] img').evaluate(i=>i.decode());await shot(page,`${name}-stack-mid`);
 await scroll(page,pos.cards[2]-head-16);await page.locator('[data-stack-card="2"] img').evaluate(i=>i.decode());await shot(page,`${name}-stack-finished`);
 assert.equal(await page.locator('[data-sticky-stack]').getAttribute('data-stack-active'),'2');
 const cardRead=await page.locator('[data-stack-card="2"] .mk-stack-copy').evaluate(el=>{const r=el.getBoundingClientRect(),action=document.querySelector('.cx-mobile-action')?.getBoundingClientRect();return {top:r.top,bottom:r.bottom,actionTop:action?.top||innerHeight}});
 assert.ok(cardRead.top>=0&&cardRead.bottom<=Math.max(cardRead.actionTop+4,height+4),'Top card copy is fully readable');
 const index=page.locator('.mk-stack-index a').nth(1);await index.focus();await index.press('Enter');await page.waitForTimeout(250);assert.equal(await page.locator('[data-sticky-stack]').getAttribute('data-stack-active'),'1');
 if(view==='mobile'){await page.locator('.mk-stack-index a').nth(2).tap();await page.waitForTimeout(250);assert.equal(await page.locator('[data-sticky-stack]').getAttribute('data-stack-active'),'2');}
 const statPos=await page.evaluate(()=>{const top=s=>document.querySelector(s).getBoundingClientRect().top+scrollY;return {root:top('[data-stats-mask]'),grid:top('.mk-stats-grid')}});
 await scroll(page,statPos.root-height*.75);await page.locator('.mk-stats-photo img').evaluate(i=>{i.loading='eager';return i.decode()});await shot(page,`${name}-stats-rest`);
 await scroll(page,statPos.grid-height*.6);await shot(page,`${name}-stats-mid`);
 const midProgress=Number(await page.locator('[data-stats-mask]').getAttribute('data-motion-progress'));assert.ok(midProgress>.2&&midProgress<.9,'Numeric reveal has a visible intermediate state');
 await scroll(page,statPos.root-head+120);await shot(page,`${name}-stats-finished`);
 const progress=Number(await page.locator('[data-stats-mask]').getAttribute('data-motion-progress'));assert.ok(progress>.95);
 assert.equal(await page.locator('[data-stat-key="jobsCompleted"] [data-stats-number]').innerText(),'1,250');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.emulateMedia({reducedMotion:'reduce'});pos=await positions(page);await scroll(page,pos.cards[1]-pos.header-16);await shot(page,`${name}-stack-reduced`);
 assert.notEqual(await page.locator('[data-stack-card="1"]').evaluate(el=>getComputedStyle(el).position),'sticky');
 await scroll(page,pos.stats-pos.header-6);await shot(page,`${name}-stats-reduced`);
 assert.equal(await page.locator('[data-stat-key="jobsCompleted"] [data-stats-number]').innerText(),'1,250');
 assert.equal(await page.locator('.mk-stats-photo img').evaluate(el=>getComputedStyle(el).clipPath),'none');
 results.profiles.push({name,width,height,cardRead,statsShown:['years','jobsCompleted','rating','reviews','license'],hidden:['warranty'],passed:true});console.log('PASS '+name);await context.close();
}
async function fallback(browser,view,width,height){const context=await browser.newContext({viewport:{width,height},javaScriptEnabled:false}),page=await context.newPage();await page.goto(url('bold-industrial','A'));assert.equal(await page.locator('[data-stack-card]').count(),3);assert.equal(await page.locator('[data-stat-key]').count(),5);assert.equal(await page.locator('[data-sticky-stack]').evaluate(el=>getComputedStyle(el.querySelector('[data-stack-card]')).position),'static');assert.equal(await page.locator('[data-stat-key="jobsCompleted"] [data-stats-number]').innerText(),'1,250');await page.locator('[data-stack-card="0"]').scrollIntoViewIfNeeded();await page.locator('[data-stack-card="0"] img').evaluate(i=>{i.loading='eager';return i.decode()});await shot(page,`${view}-no-js-stack`);await page.locator('[data-stats-mask]').scrollIntoViewIfNeeded();await page.locator('.mk-stats-photo img').evaluate(i=>{i.loading='eager';return i.decode()});await shot(page,`${view}-no-js-stats`);results.fallbacks.push({view,noJS:true});await context.close()}
async function record(browser,view,width,height){const context=await browser.newContext({viewport:{width,height},hasTouch:view==='mobile',recordVideo:{dir:out,size:{width,height}}}),page=await context.newPage();await page.goto(url('bold-industrial','A'));await prepare(page);const pos=await positions(page);await scroll(page,pos.stats-pos.header);await page.locator('.mk-stats-photo img').evaluate(i=>i.decode());await scroll(page,pos.cards[0]-pos.header);await page.locator('[data-stack-card="0"] img').evaluate(i=>i.decode());const start=pos.stack-pos.header-15,end=pos.stats+pos.statsHeight-height*.75;await scroll(page,start);await page.evaluate(async({start,end})=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));async function glide(a,b,ms){await new Promise(done=>{const t0=performance.now();function step(t){const p=Math.min(1,(t-t0)/ms);scrollTo(0,a+(b-a)*p);p<1?requestAnimationFrame(step):done()}requestAnimationFrame(step)})}await wait(250);await glide(start,end,6500);await wait(500);await glide(end,start,5000);await wait(400);await glide(start,end,6500);await wait(400)},{start,end});const video=page.video();await context.close();const dest=path.join(out,`${view}-down-up-down.webm`);fs.renameSync(await video.path(),dest);results.recordings.push({view,width,height,file:path.basename(dest),bytes:fs.statSync(dest).size});}
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{for(const [view,width,height] of [['desktop',1440,900],['mobile',390,844]])for(const style of ['bold-industrial','clean-modern'])for(const variant of ['A','B','C'])await profile(browser,view,width,height,style,variant);for(const [view,width,height] of [['desktop',1440,900],['mobile',390,844]])await fallback(browser,view,width,height);assert.deepEqual(results.errors,[]);fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(results,null,2));console.log('PASS 12/12 profiles, screenshots, keyboard/touch, fallbacks and no page errors');}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
