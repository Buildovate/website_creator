import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const digest=v=>createHash('sha256').update(v).digest('hex');
// Uses a locally installed browser automation runtime. No remote browser, image,
// video or AI provider is contacted. The Worker receives this as a host binding.
export function createReviewCapture({browserModule='playwright',executablePath}={}){
 const {chromium}=createRequire(import.meta.url)(browserModule);
 return async function capture({packet,pages,fetch:resource}){
  const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})}),files=[],results=[],clips=new Map(),claims=[];
  const origin='http://review.local',documents=new Map(pages.map(p=>[p.path,p.html]));
  try{
   const context=await browser.newContext({deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-US',timezoneId:'America/Los_Angeles',colorScheme:'light'});
   await context.route('**/*',async route=>{
    const req=route.request(),u=new URL(req.url());
    if(u.origin!==origin||!['GET','HEAD'].includes(req.method()))return route.abort('blockedbyclient');
    const html=documents.get(u.pathname);if(html!==undefined)return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
    try{const response=await resource(u.pathname+u.search);await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())})}catch{return route.fulfill({status:404,body:'Resource unavailable in this review snapshot'})}
   });
   for(const source of pages){
    console.log('Review capture page',packet.slug,source.path);const screenshots={},page=await context.newPage();
    for(const width of [1440,390]){
     await page.setViewportSize({width,height:width===390?844:900});await page.goto(origin+source.path,{waitUntil:'networkidle'});
     await page.evaluate(async()=>{await document.fonts.ready;for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});setTimeout(resolve,4000)})));for(const v of document.querySelectorAll('video'))v.pause();});
     await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.will-enter{opacity:1!important;transform:none!important}'});
     await page.waitForTimeout(120);
     const path='screenshots/'+source.id+'-'+width+'.png',data=await page.screenshot({fullPage:true,animations:'disabled'});files.push({path,data});screenshots[width]=path;
     if(width===1440){
      const inspection=await page.evaluate(()=>{
       const selector=e=>{if(e.id)return '#'+CSS.escape(e.id);const parts=[];while(e&&e!==document.body){const parent=e.parentElement;if(!parent)break;parts.unshift(e.tagName.toLowerCase()+':nth-child('+([...parent.children].indexOf(e)+1)+')');e=parent}return 'body>'+parts.join('>')};
       const rows=[],legal=/\/legal(?:\/|$)/.test(location.pathname),terms=/\b(?:financ\w*|lender|loan|APR|interest|monthly payment|terms|conditions|consent|agree|privacy|disclos\w*|license[ds]?|insured|bonded|guarantee|warrant\w*|credit|permission|TCPA)\b|%|\$\s*\d/i;
       for(const e of document.querySelectorAll('h1,h2,h3,h4,p,li,label,summary,small,figcaption,blockquote,dt,dd,td,th,span,a')){if(e.closest('script,style,svg'))continue;const text=e.textContent.replace(/\s+/g,' ').trim();if(text&&(legal||terms.test(text)))rows.push({text,selector:selector(e),category:/consent|agree|permission|TCPA/i.test(text)?'consent':/financ|lender|loan|APR|interest|monthly payment|credit/i.test(text)?'financing':'legal/disclosure',visible:e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})})}
       for(const e of document.querySelectorAll('script[type="application/ld+json"]'))if(terms.test(e.textContent))rows.push({text:e.textContent,selector:selector(e),category:'structured legal/financing claim',visible:false});
       const clips=[...document.querySelectorAll('video')].map(v=>({url:v.getAttribute('data-src')||v.getAttribute('src')||v.querySelector('source')?.getAttribute('data-src')||v.querySelector('source')?.getAttribute('src'),poster:v.getAttribute('poster'),selector:selector(v)})).filter(v=>v.url);
       return {claims:rows,clips};
      });
      claims.push(...inspection.claims.map(c=>({...c,page:source.path})));
      for(const c of inspection.clips){const existing=clips.get(c.url)||{url:c.url,poster:c.poster,locations:[]};existing.locations.push({page:source.path,selector:c.selector});clips.set(c.url,existing)}
     }
    }
    results.push({...source,html:undefined,screenshots});await page.close();
   }
   const framePage=await context.newPage();await framePage.setViewportSize({width:960,height:540});await framePage.goto(origin+pages[0].path,{waitUntil:'domcontentloaded'});
   for(const clip of clips.values()){
    if(!/^\/(?:assets|media)\/[A-Za-z0-9_./%-]+(?:\?[A-Za-z0-9_=&.%+-]+)?$/.test(clip.url))throw Error('Review clip must be an installed or owned local asset: '+clip.url);
    const id=digest(clip.url).slice(0,16);clip.frames={};
    console.log('Review capture clip',clip.url);await framePage.setContent('<html><body style="margin:0;background:#000"><video id="frame-video" muted playsinline preload="auto" style="width:960px;height:540px;object-fit:contain" src="'+clip.url+'"></video></body></html>');
    await framePage.waitForFunction(()=>{const v=document.querySelector('video');if(v.error)throw Error('Clip could not be decoded');return v.readyState>=2&&Number.isFinite(v.duration)},{},{timeout:30000});
    clip.duration=await framePage.locator('video').evaluate(v=>v.duration);
    for(const pct of [0,25,50,75,100]){
     const time=Math.min(clip.duration*pct/100,Math.max(0,clip.duration-.05));
     await framePage.locator('video').evaluate(async(v,time)=>{v.pause();if(Math.abs(v.currentTime-time)>.00001){await new Promise((resolve,reject)=>{v.addEventListener('seeked',resolve,{once:true});v.addEventListener('error',reject,{once:true});setTimeout(()=>reject(Error('Clip seek timed out at '+time)),15000);v.currentTime=time})}if(v.requestVideoFrameCallback){await Promise.race([new Promise(resolve=>v.requestVideoFrameCallback(resolve)),new Promise(resolve=>setTimeout(resolve,120))])}},time);
     const path='frames/'+id+'-'+pct+'.png';files.push({path,data:await framePage.locator('video').screenshot({animations:'disabled'})});clip.frames[pct]=path;
    }
   }
   const checklist=packet.checklist.map(x=>({...x,result:'Needs staff review',evidence:results.map(p=>p.path)}));
   // These are review results, not an invented automatic quality certification.
   // The remaining visual/content judgments require staff acknowledgement.
   for(const id of ['playbook-17','playbook-21']){const item=checklist.find(x=>x.id===id);item.result='Recorded';item.note=id==='playbook-17'?'Static/reduced-motion screenshots plus five time samples for each used clip.':'Rights, approval and Sample provenance recorded. Contractor-owned photos take priority under #028D, overriding the older playbook-only-AI sentence.'}
   return {pages:results,clips:[...clips.values()],claims,checklist,files};
  }finally{await browser.close()}
 };
}
