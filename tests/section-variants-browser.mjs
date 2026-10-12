import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import fs from 'node:fs';import assert from 'node:assert/strict';import{createRequire}from'node:module';
import{createRuntime,listen}from'../src/aws/server.js';
import{originalRows,variantSettings,styles,variants,mixedReviews}from'./fixtures/section-variants.mjs';
const root=releaseRepoRoot,out=process.env.BV_028B_EVIDENCE||root+'/docs/build-evidence/028B',base='http://127.0.0.1:8195',smoke=process.argv.includes('--smoke'),captures=process.argv.includes('--captures'),allProcess=process.argv.includes('--all-process');
const{chromium}=createRequire(import.meta.url)('playwright');
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'variant-browser@example.test',APP_ORIGIN:base,LISTEN_HOST:'127.0.0.1',PORT:'8195'}});
Object.assign(runtime.env,{GOOGLE_PLACES_API_KEY:'test-only-mocked'});
const nativeFetch=globalThis.fetch;let mockCalls=0;
globalThis.fetch=async(url,options)=>{if(String(url).startsWith('https://places.googleapis.com/')){mockCalls++;return Response.json({rating:3.5,userRatingCount:4,googleMapsUri:'https://www.google.com/maps?cid=028028',reviews:mixedReviews.map(r=>({...r,text:{text:r.text},authorAttribution:{displayName:r.author},googleMapsUri:r.url}))});}if(new URL(String(url)).hostname==='127.0.0.1')return nativeFetch(url,options);throw Error('External call blocked '+url)};
const report={smoke,states:[],screenshots:[],errors:[],mockedProviderCalls:0},prefix=allProcess?'process-all-kits':smoke?'smoke':captures?'variant-captures':'variants-browser';
const save=()=>fs.writeFileSync(out+'/checks/'+prefix+'.json',JSON.stringify(report,null,2));
const progress=(state,step)=>console.log(new Date().toISOString()+' '+state+' | '+step);
const actionTimeout=30_000,navigationTimeout=45_000;
async function bounded(state,step,operation,timeout=actionTimeout){
 let timer;
 try{return await Promise.race([Promise.resolve().then(operation),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(state+' | '+step+' timed out after '+timeout+'ms')),timeout)})]);}
 catch(error){throw new Error(state+' | '+step+': '+error.message,{cause:error});}
 finally{clearTimeout(timer);}
}
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
 const sections=[...document.querySelectorAll('[data-section-variant]')].filter(el=>!el.hidden).map(el=>({variant:el.dataset.sectionVariant,pattern:el.dataset.sectionPattern,primaries:el.querySelectorAll('.sv-primary,.finance-recalculate').length}));
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

 return{geometry,overflow:document.documentElement.scrollWidth-innerWidth,text,clipped,sections,cls:window.qaCLS||0,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.currentSrc||i.src)};
}
try{
 const fixtures=[];
 for(const{row}of originalRows.filter(({row})=>allProcess||['roofing','patios','hvac'].includes(JSON.parse(row.settings).designKit)))for(const style of smoke||captures?['current']:styles)for(const variant of allProcess?['b','c']:smoke?['b']:variants){
  const s=variantSettings(row,style,variant,true);s.minReviewRating=4;
  const r={...row,id:'variant-'+s.designKit+'-'+style+'-'+variant,slug:'variant-'+s.designKit+'-'+style+'-'+variant,settings:JSON.stringify(s),published:JSON.stringify(s),status:'published'};
  const keys=Object.keys(r);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>r[k])).run();fixtures.push({kit:s.designKit,style,variant,row:r});
 }
 server=await bounded('setup','listen',()=>listen(runtime,8195));browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE,timeout:actionTimeout});
 const widths=allProcess?[1440,1280,768,390]:smoke||captures?[1440,390]:[1440,768,390];
 async function runViewport(width){
  const context=await bounded('viewport-'+width,'create context',()=>browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'})),completed=[];
  context.setDefaultTimeout(actionTimeout);context.setDefaultNavigationTimeout(navigationTimeout);
  try{
  await bounded('viewport-'+width,'init script',()=>context.addInitScript(()=>{window.qaCLS=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.qaCLS+=entry.value}).observe({type:'layout-shift',buffered:true})}));
  await bounded('viewport-'+width,'request route',()=>context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort()));
  const page=await bounded('viewport-'+width,'create page',()=>context.newPage());let current;
  page.on('pageerror',error=>report.errors.push({state:current,type:'pageerror',text:error.message}));
  for(const f of fixtures)for(const kind of allProcess?['home']:['home','financing']){
   current=[f.kit,f.style,f.variant,width,kind].join('-');progress(current,'start');const response=await page.goto(base+'/s/'+f.row.slug+(kind==='home'?'':'/financing'),{waitUntil:'networkidle',timeout:navigationTimeout});assert.equal(response.status(),200,current);progress(current,'page loaded');await bounded(current,'fonts ready',()=>page.evaluate(()=>document.fonts.ready));progress(current,'fonts ready');
   if(kind==='home'){await page.locator('#customer-reviews').scrollIntoViewIfNeeded({timeout:actionTimeout});await page.locator('.source-review-card').first().waitFor({timeout:actionTimeout});assert.equal(await page.locator('.source-review-card').count(),2,current+' filter4');assert.match(await page.locator('.provider-rating-badge').innerText({timeout:actionTimeout}),/3.5 \/ 5[\s\S]*4 reviews/);}
   progress(current,'reviews ready');for(const summary of await page.locator('.sv-service-disclosure>summary').all()){await summary.focus({timeout:actionTimeout});await bounded(current,'open service disclosure',()=>page.keyboard.press('Enter'));}progress(current,'service disclosures opened');
   if(kind==='home'&&f.variant!=='a'){await page.locator('.sv-process-art').scrollIntoViewIfNeeded({timeout:actionTimeout});await bounded(current,'process image decode',()=>page.locator('.sv-process-art img').evaluateAll(images=>Promise.all(images.map(img=>img.decode().catch(()=>{})))));}
   await page.waitForTimeout(180);
   progress(current,'art decoded');const audit=await bounded(current,'inspect',()=>page.evaluate(inspect)),focus=[];
   await bounded(current,'keyboard tab',()=>page.keyboard.press('Tab'));
   for(const control of await page.locator('[data-section-variant] a,[data-section-variant] button,[data-section-variant] summary,[data-section-variant] input,[data-section-variant] select,[data-section-variant] textarea').all()){
    if(!await control.isVisible()||!await control.isEnabled())continue;await control.focus({timeout:actionTimeout});focus.push(await bounded(current,'inspect focused control',()=>control.evaluate(el=>({tag:el.tagName,text:(el.textContent||el.getAttribute('name')||'').trim().slice(0,50),focused:document.activeElement===el,outline:getComputedStyle(el).outlineStyle,width:parseFloat(getComputedStyle(el).outlineWidth)}))));
   }
   const state={name:current,kit:f.kit,style:f.style,variant:f.variant,width,kind,...audit,focus};report.states.push(state);
   progress(current,'controls checked');
   if(f.style==='current'&&(allProcess?['roofing','patios','hvac'].includes(f.kit)&&[1280,768].includes(width):width!==768)){
    const selectors=allProcess?{hero:'#home',process:'.sv-process'}:kind==='home'?{hero:'#home',services:'#services',process:'.roof-next-story,.kit-cta-band,.cx-process,.sv-process',reviews:'#customer-reviews',finalCta:'#contact'}:{financing:'#calculator'};
    for(const[section,selector]of Object.entries(selectors)){
     const target=page.locator(selector).first();assert.equal(await target.count(),1,current+' '+section);
     await target.scrollIntoViewIfNeeded({timeout:actionTimeout});await page.waitForTimeout(50);await bounded(current,'reset screenshot focus',()=>page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0)}));const box=await target.boundingBox();const file='after/'+f.kit+'-'+section+'-'+f.variant+'-'+width+'.png';await page.screenshot({path:out+'/'+file,fullPage:true,timeout:actionTimeout,clip:{x:Math.max(0,box.x),y:Math.max(0,box.y),width:Math.min(width,box.width),height:box.height}});report.screenshots.push({kit:f.kit,section,variant:f.variant,width,file});
    }
   }
   progress(current,'screenshot done');save();console.log(current+': contrast '+audit.text.filter(x=>!x.pass).length+', overflow '+audit.overflow+', CLS '+audit.cls.toFixed(4));completed.push(current);progress(current,'complete (shared page retained until viewport close)');
  }
  }finally{progress('viewport-'+width,'closing');await bounded('viewport-'+width,'close context',()=>context.close());for(const state of completed)progress(state,'closed');progress('viewport-'+width,'closed');}
 }
 // Each viewport has its own browser context, page, event handlers and immutable fixtures.
 const concurrency=process.env.BV_028B_PARALLEL==='2'?2:1;
 for(let index=0;index<widths.length;index+=concurrency)await Promise.all(widths.slice(index,index+concurrency).map(runViewport));
 assert.equal(report.states.length,fixtures.length*widths.length*(allProcess?1:2));
 report.mockedProviderCalls=mockCalls;
 report.failures=report.states.flatMap(s=>[...s.text.filter(x=>!x.pass).map(x=>({state:s.name,check:'contrast',...x})),...s.focus.filter(x=>!x.focused||x.outline==='none'||x.width<2).map(x=>({state:s.name,check:'focus',...x})),...(s.overflow>0?[{state:s.name,check:'overflow',value:s.overflow}]:[]),...(s.cls>.05?[{state:s.name,check:'CLS',value:s.cls}]:[]),...s.sections.filter(x=>['hero','finalCta'].includes(x.variant.split(':')[0])?x.primaries!==1:x.primaries>1).map(x=>({state:s.name,check:'primary',...x})),...s.clipped.map(x=>({state:s.name,check:'content loss',...x})),...s.brokenImages.map(url=>({state:s.name,check:'image load',url})),...s.geometry.filter(x=>!x.pass).map(x=>({state:s.name,check:'review layout geometry',...x}))]);save();
 console.log(JSON.stringify({states:report.states.length,screenshots:report.screenshots.length,failures:report.failures.length,pageErrors:report.errors.length,mockedProviderCalls:mockCalls,actualProviderCalls:0}));
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failures,[]);
}finally{
 globalThis.fetch=nativeFetch;
 try{if(browser)await bounded('teardown','close browser',()=>browser.close());}
 finally{try{if(server){server.closeAllConnections();await bounded('teardown','close server',()=>new Promise(r=>server.close(r)));}}finally{await bounded('teardown','close runtime',()=>runtime.close());}}
}
console.log('PASS '+report.states.length+' section-variant states; assertions and teardown complete.');
