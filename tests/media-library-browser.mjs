import {inspectStylePage} from './helpers/style-inspection.mjs';
import {build} from 'esbuild';
import fs from 'node:fs';import assert from 'node:assert/strict';import{createRequire}from'node:module';
import{regenerate}from'../src/generation.js';
import{mediaSamples}from'./fixtures/media-library.mjs';
import{pickDistance}from'../src/uniqueness.js';
import{createRuntime,listen}from'../src/aws/server.js';
import{originalRows,variantSettings,styles,variants,mixedReviews}from'./fixtures/section-variants.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028D',base='http://127.0.0.1:'+(process.argv.includes('--current-final')?'8200':process.argv.includes('--smoke')?'8199':'8198'),smoke=process.argv.includes('--smoke'),captures=process.argv.includes('--captures'),allProcess=false,motionOnly=process.argv.includes('--motion-only'),mediaOnly=process.argv.includes('--media-only');
const finalCurrent=process.argv.includes('--current-final');
const{chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const bundle=await build({entryPoints:[root+'/src/worker.js'],bundle:true,format:'esm',platform:'neutral',conditions:['workerd','worker'],mainFields:['module','main'],target:'es2022',write:false,loader:{'.html':'text','.pdf':'binary'},external:['cloudflare:workers','node:*']});
const worker=(await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'))).default;
const runtime=await createRuntime({worker,env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'variant-browser@example.test',APP_ORIGIN:base,LISTEN_HOST:'127.0.0.1',PORT:new URL(base).port}});
Object.assign(runtime.env,{GOOGLE_PLACES_API_KEY:'test-only-mocked'});
const originalAssets=runtime.env.ASSETS;runtime.env.ASSETS={fetch:req=>new URL(req.url).pathname==='/generated-site.css'?new Response(fs.readFileSync(root+'/public/generated-site.css'),{headers:{'content-type':'text/css'}}):originalAssets.fetch(req)};
const nativeFetch=globalThis.fetch;let mockCalls=0;
globalThis.fetch=async(url,options)=>{if(String(url).startsWith('https://places.googleapis.com/')){mockCalls++;return Response.json({rating:3.5,userRatingCount:4,googleMapsUri:'https://www.google.com/maps?cid=028028',reviews:mixedReviews.map(r=>({...r,text:{text:r.text},authorAttribution:{displayName:r.author},googleMapsUri:r.url}))});}if(new URL(String(url)).hostname==='127.0.0.1')return nativeFetch(url,options);throw Error('External call blocked '+url)};
const report={smoke,states:[],screenshots:[],errors:[],mockedProviderCalls:0},prefix=finalCurrent?'media-current-final':mediaOnly?'media-interactions':motionOnly?'media-motion':smoke?'media-smoke':'media-browser';
const save=()=>fs.writeFileSync(out+'/checks/'+prefix+'.json',JSON.stringify(report,null,2));
let server,browser;
function inspect(){
 const rgba=s=>{const x=s.match(/[\d.]+/g)?.map(Number)||[0,0,0,0];return x.length===3?[...x,1]:x},over=(a,b)=>a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])).concat(1),lum=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
 const text=[],clipped=[];
 for(const el of document.querySelectorAll('[data-section-variant] *')){
  if(!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})||el.closest('[aria-hidden=true],svg,[hidden]'))continue;
  const s=getComputedStyle(el),r=el.getBoundingClientRect();if(!r.width||!r.height)continue;
  if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&!el.matches('input,select,textarea'))continue;
  if(el.scrollWidth>el.clientWidth+2&&!el.matches('input,select,textarea')&&['hidden','clip'].includes(s.overflowX))clipped.push({tag:el.tagName,cls:el.className,text:el.textContent.slice(0,60)});
  let chain=[],p=el;while(p){chain.unshift(p);p=p.parentElement}let bg=[255,255,255,1];for(const node of chain)bg=over(rgba(getComputedStyle(node).backgroundColor),bg);
  const fg=over(rgba(s.color),bg),a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),font=parseFloat(s.fontSize),minimum=font>=24||font>=18.666&&Number(s.fontWeight)>=700?3:4.5;
  text.push({section:el.closest('[data-section-variant]').dataset.sectionVariant,tag:el.tagName,cls:el.className,text:el.textContent.trim().slice(0,60),fg:s.color,bg,ratio,minimum,pass:ratio>=minimum});
 }
 const sections=[...document.querySelectorAll('[data-section-variant]')].filter(el=>!el.hidden).map(el=>({variant:el.dataset.sectionVariant,pattern:el.dataset.sectionPattern,primaries:el.querySelectorAll('.sv-primary,.finance-recalculate,.story-primary,.kit-hero-actions>.kit-button,.cx-actions>.cx-button,form>.kit-button,form>.cx-button,.kit-cta-band .kit-button,.roof-next-contact a').length}));
  const geometry=[];
 for(const section of document.querySelectorAll('.sv-reviews')){
  if(section.hidden)continue;
  const h=section.querySelector('.sv-review-heading').getBoundingClientRect(),b=section.querySelector('.sv-review-body').getBoundingClientRect(),r=section.getBoundingClientRect(),s=getComputedStyle(section);
  const split=section.classList.contains('sv-reviews-b')&&innerWidth>768;
  const columns=getComputedStyle(section.querySelector('.source-review-grid')).gridTemplateColumns.split(' ').length,expectedColumns=section.classList.contains('sv-reviews-c')&&innerWidth>768?2:1;
  const pass=columns===expectedColumns&&(split?b.x>=h.right&&Math.abs(b.y-h.y)<2:b.width>=r.width-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight)-2);
  geometry.push({variant:section.dataset.sectionVariant,split,columns,expectedColumns,heading:{x:h.x,y:h.y,width:h.width},body:{x:b.x,y:b.y,width:b.width},pass});
 }

 const process=document.querySelector('.sv-process');
 if(process){
  const intro=process.querySelector('.sv-process-intro').getBoundingClientRect(),steps=process.querySelector('.sv-process-steps').getBoundingClientRect(),art=process.querySelector('.sv-process-art'),r=process.getBoundingClientRect(),style=getComputedStyle(process),ar=art?.getBoundingClientRect();
  const contentBottom=Math.max(intro.bottom,steps.bottom),emptyTail=r.bottom-parseFloat(style.paddingBottom)-contentBottom;
  geometry.push({variant:process.dataset.sectionVariant,mediaWidth:ar?.width||0,mediaHeight:ar?.height||0,emptyTail,pass:!!art&&ar.width>=180&&ar.height>=60&&emptyTail<=2});
 }
 const hero=document.querySelector('.sv-hero'),rail=document.querySelector('.kit-chapter-rail');
 if(hero&&rail&&rail.checkVisibility({checkVisibilityCSS:true,checkOpacity:true})){
  const h=hero.querySelector('h1').getBoundingClientRect(),r=rail.getBoundingClientRect(),gap=r.left-h.right;
  geometry.push({variant:hero.dataset.sectionVariant,railGap:gap,minimum:24,pass:gap>=24});
 }

 const borders=[];
 for(const el of document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea')){
  if(!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})||el.closest('[hidden],.hp,.foundation-hp'))continue;
  const s=getComputedStyle(el);if(!parseFloat(s.borderTopWidth)||s.borderTopStyle==='none')continue;
  let chain=[],p=el;while(p){chain.unshift(p);p=p.parentElement}let bg=[255,255,255,1];for(const node of chain)bg=over(rgba(getComputedStyle(node).backgroundColor),bg);
  const a=lum(over(rgba(s.borderTopColor),bg)),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);borders.push({name:el.name,tag:el.tagName,color:s.borderTopColor,background:bg,ratio,minimum:3,pass:ratio>=3});
 }
 return{outOfBounds:[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2&&e.checkVisibility()).slice(0,20).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})),borders,geometry,overflow:document.documentElement.scrollWidth-innerWidth,text,clipped,sections,cls:window.qaCLS||0,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc||i.src)};
}
try{
 if(!smoke)fs.writeFileSync(out+'/checks/uniqueness-browser-active.json',JSON.stringify({pid:process.pid}));
 const fixtures=[];
 for(const{row}of originalRows.filter(({row})=>(!smoke||['roofing','patios','hvac'].includes(JSON.parse(row.settings).designKit))&&(!process.argv.includes('--patios-only')||JSON.parse(row.settings).designKit==='patios')))for(const style of smoke?[process.argv.find(x=>x.startsWith('--style='))?.split('=')[1]||'current']:finalCurrent?['current']:styles){
  const input=variantSettings(row,style,'a',true);input.minReviewRating=4;input.name='Sample Fictional '+input.trade;input.experience='';input.license='';
  const id='generated-'+input.designKit+'-'+style,s=regenerate(input,id,id),r={...row,id,slug:id,settings:JSON.stringify(s),published:JSON.stringify(s),status:'published'};
  const keys=Object.keys(r);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>r[k])).run();fixtures.push({kit:s.designKit,style,variant:'generated',settings:s,row:r});
 }
 const samples=mediaSamples();
 for(let i=0;i<3;i++)for(let j=0;j<i;j++){
  const a=samples[i].settings.uniqueness,b=samples[j].settings.uniqueness;
  assert.ok(a.style!==b.style||a.sections.hero!==b.sections.hero,'Sample style or hero differs');
  assert.ok(Object.keys(a.sections).filter(k=>a.sections[k]!==b.sections[k]).length>=3,'Samples differ in three section layouts');
 }
 for(const sample of samples){const r=sample.row,keys=Object.keys(r);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>r[k])).run();fixtures.push({kit:sample.settings.designKit,style:sample.settings.uniqueness.style,variant:'sample',settings:sample.settings,row:r,sample:true});}
 const videoFixtures=[];
 for(const style of styles)for(const variant of ['a','b','c']){
  const row=originalRows.find(x=>JSON.parse(x.row.settings).designKit==='patios').row;
  const id='media-video-'+style+'-'+variant,settings=regenerate(variantSettings(row,style,'a',false),id,id,{overrides:{sections:{hero:variant}},actor:{id:'media-staff-fixture',role:'admin'}});
  const r={...row,id,slug:id,settings:JSON.stringify(settings),published:JSON.stringify(settings),status:'published'},keys=Object.keys(r);
  await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>r[k])).run();videoFixtures.push({id,settings,style,variant});
 }
 for(const mode of ['chapters','static']){
  const row=originalRows.find(x=>JSON.parse(x.row.settings).designKit==='patios').row,input=variantSettings(row,'current','a',false),id='media-video-mode-'+mode;
  input.scrollStory={...input.scrollStory,mode:'chapters'};if(mode==='static')input.effects={...input.effects,scrollStory:false};
  const settings=regenerate(input,id,id,{overrides:{sections:{hero:'a'}},actor:{id:'media-staff-fixture',role:'admin'}}),r={...row,id,slug:id,settings:JSON.stringify(settings),published:JSON.stringify(settings),status:'published'},keys=Object.keys(r);
  await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>r[k])).run();videoFixtures.push({id,settings,style:'current',variant:'a',mode});
 }
 fs.writeFileSync(out+'/sample-fixtures.json',JSON.stringify(samples.map(({row,...sample})=>sample),null,2));
 server=await listen(runtime,Number(new URL(base).port));browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const widths=motionOnly||mediaOnly?[]:allProcess?[1440,1280,768,390]:smoke||captures?[1440,390]:[1440,768,390];
 async function runViewport(width){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});
  await context.addInitScript(()=>{window.qaCLS=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.qaCLS+=entry.value}).observe({type:'layout-shift',buffered:true})});
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const page=await context.newPage();let current;
  page.on('pageerror',error=>report.errors.push({state:current,type:'pageerror',text:error.message}));
  for(const f of fixtures)for(const kind of f.sample?['home']:['home','financing']){
   current=[f.row.id,width,kind].join('-');const response=await page.goto(base+'/s/'+f.row.slug+(kind==='home'?'':'/financing'),{waitUntil:'networkidle'});assert.equal(response.status(),200,current);await page.evaluate(()=>document.fonts.ready);
   if(kind==='home'&&f.settings.reviews.confirmed){await page.locator('#customer-reviews').scrollIntoViewIfNeeded();await page.locator('.source-review-card').first().waitFor();assert.equal(await page.locator('.source-review-card').count(),f.sample?4:2,current+' filter4');assert.match(await page.locator('.provider-rating-badge').innerText(),/3.5 \/ 5[\s\S]*4 reviews/);}
   for(const summary of await page.locator('.sv-service-disclosure>summary').all()){await summary.focus();await page.keyboard.press('Enter');}
   if(kind==='home'&&f.settings.sectionVariants.process!=='a'){await page.locator('.sv-process-art').scrollIntoViewIfNeeded();await page.locator('.sv-process-art img').evaluateAll(images=>Promise.all(images.map(img=>img.decode().catch(()=>{}))));}
   await page.waitForTimeout(180);
   await page.evaluate(({settings,kind})=>{
    const selectors=kind==='home'?{hero:'#home',services:'#services',process:'.roof-next-story,.kit-cta-band,.cx-process,.sv-process',reviews:'#customer-reviews',finalCta:'#contact'}:{financing:'#calculator'};
    for(const[key,selector]of Object.entries(selectors)){const el=document.querySelector(selector);if(el&&!el.dataset.sectionVariant){el.dataset.sectionVariant=key+':a';el.dataset.sectionPattern=settings.uniqueness.rules.patterns[key];}}
   },{settings:f.settings,kind});
   const audit=await page.evaluate(inspect),whole=await page.evaluate(inspectStylePage),focus=[];audit.wholePageContrast=whole;for(const x of whole.contrasts)if(!audit.text.some(y=>y.tag===x.tag&&y.cls===x.cls&&y.text===x.text&&y.fg===x.fg))audit.text.push({...x,section:'page chrome'});
   await page.keyboard.press('Tab');
   for(const control of await page.locator('[data-section-variant] a,[data-section-variant] button,[data-section-variant] summary,[data-section-variant] input,[data-section-variant] select,[data-section-variant] textarea').all()){
    if(!await control.isVisible()||!await control.isEnabled())continue;await control.focus();focus.push(await control.evaluate(el=>({tag:el.tagName,text:(el.textContent||el.getAttribute('name')||'').trim().slice(0,50),focused:document.activeElement===el,outline:getComputedStyle(el).outlineStyle,width:parseFloat(getComputedStyle(el).outlineWidth)})));
   }
   const state={name:current,kit:f.kit,style:f.style,variant:f.variant,width,kind,...audit,focus};report.states.push(state);
   if(f.sample&&width!==768){
    for(const target of await page.locator('main>section,main>aside').all()){await target.scrollIntoViewIfNeeded();await page.waitForTimeout(60);}
    await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)});await page.waitForTimeout(180);
    const file='after/'+f.row.id+'-'+width+'.png';await page.screenshot({path:out+'/'+file,fullPage:true});report.screenshots.push({name:f.row.id,width,file});
   }
   save();console.log(current+': contrast '+audit.text.filter(x=>!x.pass).length+', overflow '+audit.overflow+', CLS '+audit.cls.toFixed(4));
  }
  await context.close();
 }
 // Each viewport has its own browser context, page, event handlers and immutable fixtures.
 const concurrency=process.env.BV_028B_PARALLEL==='2'?2:1;
 for(let index=0;index<widths.length;index+=concurrency)await Promise.all(widths.slice(index,index+concurrency).map(runViewport));
 assert.equal(report.states.length,(fixtures.filter(f=>!f.sample).length*2+samples.length)*widths.length);
 report.motionStates=[];
 if(!smoke&&!mediaOnly)for(const mode of ['normal','no-js'])for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},javaScriptEnabled:mode!=='no-js',reducedMotion:'no-preference'});
  await context.addInitScript(()=>{window.qaCLS=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.qaCLS+=entry.value}).observe({type:'layout-shift',buffered:true})});
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const page=await context.newPage();page.on('pageerror',error=>report.errors.push({mode,width,text:error.message}));
  for(const sample of samples){const response=await page.goto(base+'/s/'+sample.slug,{waitUntil:'networkidle'});assert.equal(response.status(),200);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(750);
   const audit=await page.evaluate(inspectStylePage),text=await page.locator('main').innerText(),cls=mode==='no-js'?null:await page.evaluate(()=>window.qaCLS||0);
   const heroTitle=page.locator('#home h1');assert.equal((await heroTitle.textContent()).trim(),sample.settings.uniqueness.copy.hero.heading,sample.id+' '+mode+' saved heading');assert.ok(await heroTitle.isVisible(),sample.id+' '+mode+' visible heading');assert.ok(await page.locator('#home img').first().evaluate(img=>img.complete&&img.naturalWidth>0));
   if(mode==='no-js'||!sample.settings.reviews.confirmed)assert.equal(await page.locator('.source-review-card:visible').count(),0);
   report.motionStates.push({name:sample.id+'-'+width+'-'+mode,mode,width,cls,clsMeasured:mode!=='no-js',overflow:audit.overflow,contrast:audit.contrasts,failures:audit.contrasts.filter(x=>!x.pass)});
  }
  await context.close();
 }

 report.mediaStates=[];
 if(!smoke&&!motionOnly&&!finalCurrent)for(const mode of process.argv.includes('--interaction-smoke')?['normal']:['reduce','normal','no-js'])for(const width of process.argv.includes('--interaction-smoke')?[390]:[1440,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduce'?'reduce':'no-preference'});
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push({mode,width,type:'pageerror',text:e.message}));
  for(const f of process.argv.includes('--interaction-smoke')?videoFixtures.slice(0,1):videoFixtures){
   const name=f.id+'-'+width+'-'+mode,requested=[];const onRequest=req=>{if(/\.mp4(?:[?]|$)/.test(req.url()))requested.push(req.url())};page.on('request',onRequest);
   const response=await page.goto(base+'/s/'+f.id,{waitUntil:'networkidle'});assert.equal(response.status(),200,name);
   const box=page.locator('[data-media-slot=hero]'),video=box.locator('video'),button=page.locator('.ml-motion').first();
   await box.scrollIntoViewIfNeeded();await page.waitForTimeout(250);const original=await box.boundingBox();
   assert.ok(await box.locator('img').evaluate(i=>i.complete&&i.naturalWidth>0),name+' poster loaded');
   if(mode==='normal'){
    await video.evaluate(v=>new Promise((resolve,reject)=>{const end=Date.now()+8000;const tick=()=>v.currentTime>0&&!v.paused?resolve():Date.now()>end?reject(Error('Clip did not play')):setTimeout(tick,50);tick()}));
    await button.click({timeout:5000}).catch(async error=>{fs.writeFileSync(out+'/checks/media-control-debug.json',JSON.stringify(await page.evaluate(()=>({scrollY,viewport:{width:innerWidth,height:innerHeight},height:getComputedStyle(document.body).getPropertyValue('--ml-header-height'),elements:[...document.querySelectorAll('.shared-site-header,#home,.story-stage,.story-topline,.ml-motion')].map(e=>({cls:e.className,rect:e.getBoundingClientRect().toJSON(),top:getComputedStyle(e).top,position:getComputedStyle(e).position,transform:getComputedStyle(e).transform,z:getComputedStyle(e).zIndex}))})),null,2));await page.screenshot({path:out+'/after/media-control-debug.png'});throw error});assert.ok(await video.evaluate(v=>v.paused),name+' pointer pause');await button.click();await page.waitForTimeout(150);assert.ok(await video.evaluate(v=>!v.paused),name+' pointer resume');
    await button.focus();assert.ok(await button.evaluate(e=>document.activeElement===e&&!e.closest('[aria-hidden=true]')),name+' accessible control');
    await page.keyboard.press('Enter');assert.ok(await video.evaluate(v=>v.paused),name+' keyboard pause');
    await page.keyboard.press('Enter');await page.waitForTimeout(150);assert.ok(await video.evaluate(v=>!v.paused),name+' keyboard resume');
    await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(200);assert.ok(await video.evaluate(v=>v.paused),name+' offscreen pause');
    await box.scrollIntoViewIfNeeded();await page.waitForTimeout(200);
   }else{
    assert.equal(await video.locator('source[src]').count(),0,name+' no video source fetched');
    assert.ok(await video.evaluate(v=>v.paused&&v.currentTime===0),name+' static fallback');
    assert.equal(requested.filter(url=>url.includes(f.settings.mediaPicks.slots.hero.url.split('?')[0])).length,0,name+' lazy request absent');
    assert.equal(await button.isVisible(),false,name+' static mode has no play control');
   }
   const after=await box.boundingBox();assert.ok(Math.abs(original.height-after.height)<1,name+' reserved media height');
   const audit=await page.evaluate(inspectStylePage);assert.equal(audit.overflow,0,name+' overflow');assert.deepEqual(audit.contrasts.filter(x=>!x.pass),[],name+' AA');
   const planes=await page.locator('#home .story-content,#home .story-topline,#home .story-bottom').evaluateAll(es=>es.map(e=>({class:e.className,background:getComputedStyle(e).backgroundColor})));
   assert.ok(planes.every(x=>!x.background.includes('rgba')&&!x.background.includes('transparent')),name+' overlaid text has an opaque contrast plane');
   report.mediaStates.push({name,mode,width,style:f.style,variant:f.variant,requested,mediaHeight:after.height,contrast:audit.contrasts,opaqueTextPlanes:planes,passed:true});page.off('request',onRequest);save();
  }
  await context.close();
 }
 report.mockedProviderCalls=mockCalls;
 report.failures=report.states.flatMap(s=>[...s.text.filter(x=>!x.pass).map(x=>({state:s.name,check:'contrast',...x})),...s.borders.filter(x=>!x.pass).map(x=>({state:s.name,check:'control border',...x})),...s.focus.filter(x=>!x.focused||x.outline==='none'||x.width<2).map(x=>({state:s.name,check:'focus',...x})),...(s.overflow>0?[{state:s.name,check:'overflow',value:s.overflow}]:[]),...(s.cls>.05?[{state:s.name,check:'CLS',value:s.cls}]:[]),...s.sections.filter(x=>['hero','finalCta'].includes(x.variant.split(':')[0])?x.primaries!==1:x.primaries>1).map(x=>({state:s.name,check:'primary',...x})),...s.clipped.map(x=>({state:s.name,check:'content loss',...x})),...s.brokenImages.map(url=>({state:s.name,check:'image load',url})),...s.geometry.filter(x=>!x.pass).map(x=>({state:s.name,check:'review layout geometry',...x}))]);report.failures.push(...report.motionStates.flatMap(s=>[...s.failures.map(x=>({state:s.name,check:'contrast',...x})),...(s.overflow>0?[{state:s.name,check:'overflow',value:s.overflow}]:[]),...(s.cls!==null&&s.cls>.05?[{state:s.name,check:'CLS',value:s.cls}]:[])]));save();
 console.log(JSON.stringify({states:report.states.length,screenshots:report.screenshots.length,failures:report.failures.length,pageErrors:report.errors.length,mockedProviderCalls:mockCalls,actualProviderCalls:0}));
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failures,[]);
}finally{if(!smoke&&fs.existsSync(out+'/checks/uniqueness-browser-active.json'))fs.unlinkSync(out+'/checks/uniqueness-browser-active.json');globalThis.fetch=nativeFetch;await browser?.close();if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}await runtime.close();}
