const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const out='C:/Users/joe/website_creator/docs/build-evidence/004H/final';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results=[];
for(const [name,url,selector]of [['home','http://127.0.0.1:8104/s/motion-bold-industrial-a','.story-finished'],['service','http://127.0.0.1:8097/s/roofing-service-demo/services/roof-repair','.tm-poster']])for(const reduced of [false,true]){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,reducedMotion:reduced?'reduce':'no-preference'}),page=await context.newPage();
 await page.addInitScript(()=>{window.heroLCP=[];window.shiftTotal=0;new PerformanceObserver(l=>l.getEntries().forEach(e=>window.heroLCP.push({time:e.startTime,element:e.element?.className,url:e.url}))).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.shiftTotal+=e.value})).observe({type:'layout-shift',buffered:true});});
 await page.goto(url);await page.waitForFunction(()=>document.documentElement.dataset.enhancementsReady==='true');if(name==='service'&&!reduced)await page.waitForFunction(()=>document.querySelector('.tm-journey').dataset.framesLoaded==='40');await page.waitForTimeout(250);
 const data=await page.evaluate(selector=>({lcp:window.heroLCP,cls:window.shiftTotal,hero:document.querySelector(selector).currentSrc,paintGate:+document.documentElement.dataset.heroPainted,requests:performance.getEntriesByType('resource').map(e=>({url:e.name,start:e.startTime,bytes:e.transferSize})),overflow:document.documentElement.scrollWidth>innerWidth}),selector);
 const lcp=data.lcp.find(e=>e.element===(name==='home'?'story-finished':'tm-poster'));assert.ok(lcp);assert.ok(data.paintGate>=lcp.time);assert.ok(!data.overflow);
 assert.match(data.hero,name==='home'?/hero-720.avif$/:/mobile-still.webp$/);
 const scripts=data.requests.filter(r=>/trade-motion[^/]*\.js|hero-timelapse[^/]*\.js|conversion\.js|\/v3\/(desktop|mobile)\/\d/.test(r.url));assert.ok(scripts.every(r=>r.start>=lcp.time));
 assert.ok(data.requests.filter(r=>/\.css(?:\?|$)/.test(r.url)).every(r=>r.start>=lcp.time),'No CSS request before hero LCP');
 if(reduced)assert.equal(data.requests.filter(r=>/\/v3\/(desktop|mobile)\/\d|\.mp4(?:\?|$)|\.webm(?:\?|$)/.test(r.url)).length,0);
 results.push({name,reduced,...data});await context.close();console.log('PASS '+name+' '+(reduced?'reduced':'motion')+' LCP and after-paint request order');
}
fs.writeFileSync(out+'/request-chain.json',JSON.stringify(results,null,2));await browser.close()})().catch(e=>{console.error(e);process.exit(1)});

