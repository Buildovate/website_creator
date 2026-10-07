import {isLocalMapTile,mapTile,mapTileSha256} from './review-map-fixture.js';
import {registerCaptureDiagnostics,recordImageDecodes,screenshotWithDiagnostics} from './review-capture-diagnostics.js';
import {inspectExistingLegalPolicy} from './qa-browser.js';
import {assessLegalPolicy} from '../platform/legal-policy.ts';
import {waitForCaptureReadiness} from './review-capture-readiness.js';
import {FINANCING_DISCLOSURE} from '../platform/constitution.ts';
import {capturePageQA,captureClipQA} from './qa-capture.js';
import {QA_REVISION,QA_THRESHOLDS} from '../qa-gate.js';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const digest=v=>createHash('sha256').update(v).digest('hex');
// Uses a locally installed browser automation runtime. No remote browser, image,
// video or AI provider is contacted. The Worker receives this as a host binding.
export const REVIEW_BROWSER_ARGS=['--disable-gpu','--disable-accelerated-2d-canvas','--force-color-profile=srgb'];
export function createReviewCapture({browserModule='playwright',executablePath,onScreenshot}={}){
 const {chromium}=createRequire(import.meta.url)(browserModule);let captureSequence=0;
 return async function capture({packet,pages,source,reviewSnapshot,fetch:resource}){
  const browser=await chromium.launch({headless:true,args:REVIEW_BROWSER_ARGS,...(executablePath?{executablePath}:{})}),files=[],results=[],clips=new Map(),claims=[],checks=[];
  const captureNumber=++captureSequence,mapTileRequests=[];let pageOrdinal=0;
  const origin='http://review.local',documents=new Map(pages.map(p=>[p.path,p.html]));
  try{
   const context=await browser.newContext({deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-US',timezoneId:'America/Los_Angeles',colorScheme:'light'});
   let gpu=null;if(onScreenshot){const session=await browser.newBrowserCDPSession();try{const info=await session.send('SystemInfo.getInfo');gpu={devices:info.gpu.devices,featureStatus:info.gpu.featureStatus,auxAttributes:info.gpu.auxAttributes}}finally{await session.detach()}}
   const newCapturePage=async()=>{const page=await context.newPage();await registerCaptureDiagnostics(page,{onScreenshot,captureNumber,packetSlug:packet.slug,versionHash:packet.versionHash,pageOrdinal:++pageOrdinal,browserVersion:browser.version(),browserArgs:REVIEW_BROWSER_ARGS,gpu});return page};
   await context.route('**/*',async route=>{
    const req=route.request(),u=new URL(req.url());
    if(isLocalMapTile(req)){const frame=req.frame(),size=frame.page().viewportSize();mapTileRequests.push({url:req.url(),page:new URL(frame.url()).pathname,width:size?.width,source:'local fixture'});return route.fulfill({status:200,contentType:'image/png',body:mapTile});}
    if(u.origin!==origin||!['GET','HEAD'].includes(req.method()))return route.abort('blockedbyclient');
    const html=documents.get(u.pathname);if(html!==undefined)return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
    try{const response=await resource(u.pathname+u.search);await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())})}catch{return route.fulfill({status:404,body:'Resource unavailable in this review snapshot'})}
   });
   const legalPolicyEvidence=new Map(),policy=assessLegalPolicy(source.settings||{});
   if(policy.requiredLicense||policy.footerDisclosure){
    const legalPath='/s/'+packet.slug+'/legal',legalPage=pages.find(p=>p.path===legalPath);
    if(legalPage){const page=await newCapturePage();for(const width of [1440,390,768]){await page.setViewportSize({width,height:width===390?844:900});await page.goto(origin+legalPath,{waitUntil:'networkidle',timeout:120000});await page.evaluate(()=>document.fonts.ready);await waitForCaptureReadiness(page);const evidence=await page.evaluate(inspectExistingLegalPolicy,{settings:source.settings,policy});legalPolicyEvidence.set(width,evidence);const crop='qa-crops/legal-policy-'+width+'.png';const target=page.locator('main#main > section.core-legal');files.push({path:crop,data:await screenshotWithDiagnostics(page,crop,{animations:'disabled'},await target.count()?target:page)});const failures=[];if(policy.requiredLicense&&!evidence.licenseVisible)failures.push('Existing Legal page license is absent, hidden or does not match');if(policy.footerDisclosure&&!evidence.disclosureVisible)failures.push('Existing Legal page disclosure is absent, hidden or does not match');checks.push({id:'legal-policy-'+width,category:'disclosures',key:'legal-policy-visible',title:'Existing Legal page retains the reviewed policy facts',result:failures.length?'Fail':'Pass',page:legalPath,width,selector:evidence.selector,measured:{...evidence,failures},threshold:{missing:0,source:'src/core-site-pages.js legal section'},crop});console.log('Review capture width',legalPath,width);}await page.close();}
   }
   for(const sourcePage of pages){
    console.log('Review capture page',packet.slug,sourcePage.path);const screenshots={},page=await newCapturePage();let network=[];page.on('response',r=>{if(r.status()>=400)network.push({url:r.url(),status:r.status()})});page.on('requestfailed',r=>{const error=r.failure()?.errorText;if(error!=='net::ERR_ABORTED')network.push({url:r.url(),error})});
    for(const width of [1440,390,768]){
     network=[];
     await page.setViewportSize({width,height:width===390?844:900});await page.goto(origin+sourcePage.path,{waitUntil:'networkidle',timeout:120000});
     const imageDecodes=await page.evaluate(async()=>{await document.fonts.ready;for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});setTimeout(resolve,4000)})));const errors=[],decoded=[];await Promise.all([...document.images].map(async(img,index)=>{let result='decoded';try{await img.decode()}catch{result='decode failed';errors.push({url:img.currentSrc||img.src,error:'Image decoding failed'})}decoded.push({index,currentSrc:img.currentSrc,result,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight})}));for(const v of document.querySelectorAll('video'))v.pause();return {errors,decoded};});
     network.push(...imageDecodes.errors);recordImageDecodes(page,imageDecodes.decoded);
     await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.will-enter{opacity:1!important;transform:none!important}'});
     await page.waitForTimeout(120);
     await waitForCaptureReadiness(page);
     const path='screenshots/'+sourcePage.id+'-'+width+'.png',data=await screenshotWithDiagnostics(page,path,{fullPage:true,animations:'disabled'});files.push({path,data});screenshots[width]=path;
     await capturePageQA(page,{source,packet,snapshot:reviewSnapshot?.(),pageInfo:sourcePage,width,network,files,checks,legalPolicyEvidence:legalPolicyEvidence.get(width)||null,legalDisclosureAvailable:pages.some(p=>/\/legal$/.test(p.path)&&p.html.includes(FINANCING_DISCLOSURE)),requiresFinanceDisclosure:pages.some(p=>p.html.includes('data-financing-calculator'))});
     if(width===1440){
      const inspection=await page.evaluate(()=>{
       const selector=e=>{if(e.id)return '#'+CSS.escape(e.id);const parts=[];while(e&&e!==document.body){const parent=e.parentElement;if(!parent)break;parts.unshift(e.tagName.toLowerCase()+':nth-child('+([...parent.children].indexOf(e)+1)+')');e=parent}return 'body>'+parts.join('>')};
       const rows=[],legal=/\/legal(?:\/|$)/.test(location.pathname),terms=/\b(?:financ\w*|lender|loan|APR|interest|monthly payment|terms|conditions|consent|agree|privacy|disclos\w*|license[ds]?|insured|bonded|guarantee|warrant\w*|credit|permission|TCPA)\b|%|\$\s*\d/i;
       for(const e of document.querySelectorAll('h1,h2,h3,h4,p,li,label,summary,small,figcaption,blockquote,dt,dd,td,th,span,a')){if(e.closest('script,style,svg'))continue;const text=e.textContent.replace(/\s+/g,' ').trim();if(text&&(legal||terms.test(text)))rows.push({text,selector:selector(e),category:/consent|agree|permission|TCPA/i.test(text)?'consent':/financ|lender|loan|APR|interest|monthly payment|credit/i.test(text)?'financing':'legal/disclosure',visible:e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})})}
       for(const e of document.querySelectorAll('script[type="application/ld+json"]'))if(terms.test(e.textContent))rows.push({text:e.textContent,selector:selector(e),category:'structured legal/financing claim',visible:false});
       const clips=[...document.querySelectorAll('video')].map(v=>({url:v.getAttribute('data-src')||v.getAttribute('src')||v.querySelector('source')?.getAttribute('data-src')||v.querySelector('source')?.getAttribute('src'),poster:v.getAttribute('poster'),selector:selector(v)})).filter(v=>v.url);
       return {claims:rows,clips};
      });
      claims.push(...inspection.claims.map(c=>({...c,page:sourcePage.path})));
      for(const c of inspection.clips){const existing=clips.get(c.url)||{url:c.url,poster:c.poster,locations:[]};existing.locations.push({page:sourcePage.path,selector:c.selector});clips.set(c.url,existing)}
     }
     console.log('Review capture width',sourcePage.path,width);
    }
    results.push({...sourcePage,html:undefined,screenshots});await page.close();
   }
   const framePage=await newCapturePage();await framePage.setViewportSize({width:960,height:540});
   // Only the extraction page starts blank; reuse the unchanged same-origin routing.
   const frameDocumentPath='/__review-frame-document';
   if(documents.has(frameDocumentPath))throw Error('Reserved frame initialization path');
   documents.set(frameDocumentPath,'<!doctype html><html><head></head><body></body></html>');
   try{await framePage.goto(origin+frameDocumentPath,{waitUntil:'domcontentloaded',timeout:120000})}finally{documents.delete(frameDocumentPath)}
   for(const clip of clips.values()){
    if(!/^\/(?:assets|media)\/[A-Za-z0-9_./%-]+(?:\?[A-Za-z0-9_=&.%+-]+)?$/.test(clip.url))throw Error('Review clip must be an installed or owned local asset: '+clip.url);
    const id=digest(clip.url).slice(0,16);clip.frames={};
    console.log('Review capture clip',clip.url);await framePage.setContent('<html><body style="margin:0;background:#000"><video id="frame-video" muted playsinline preload="auto" style="width:960px;height:540px;object-fit:contain" src="'+clip.url+'"></video></body></html>');
    try{await framePage.waitForFunction(()=>{const v=document.querySelector('video');if(v.error)throw Error('Clip could not be decoded');return v.readyState>=2&&Number.isFinite(v.duration)},{},{timeout:30000});}
    catch(error){console.error('Review capture video ready failed',clip.url,error.stack||String(error));clip.decodeError=String(error.message||error);clip.duration=null;clip.geometry=[];await waitForCaptureReadiness(framePage);const path='frames/'+id+'-decode-error.png';files.push({path,data:await screenshotWithDiagnostics(framePage,path,{animations:'disabled'},framePage.locator('video'))});clip.frames=Object.fromEntries([0,25,50,75,100].map(p=>[p,path]));continue;}
    clip.duration=await framePage.locator('video').evaluate(v=>v.duration);
    const dimensions=await framePage.locator('video').evaluate(v=>({width:v.videoWidth,height:v.videoHeight}));
    clip.geometry=[];for(const location of clip.locations)for(const width of [390,768,1440]){const geometryPage=await newCapturePage();await geometryPage.setViewportSize({width,height:900});await geometryPage.goto(origin+location.page,{waitUntil:'networkidle',timeout:120000});const geometry=await geometryPage.locator(location.selector).evaluate((v,size)=>{const b=v.getBoundingClientRect(),s=getComputedStyle(v),r=b.width/b.height,n=size.width/size.height;return {frameWidth:b.width,frameHeight:b.height,objectFit:s.objectFit,letterboxFraction:s.objectFit==='contain'?1-Math.min(r/n,n/r):0}},dimensions);clip.geometry.push({page:location.page,width,...geometry});await geometryPage.close();}
    for(const pct of [0,25,50,75,100]){
     console.log('Review capture frame',clip.url,pct);
     const time=Math.min(clip.duration*pct/100,Math.max(0,clip.duration-.05));
     await framePage.locator('video').evaluate(async(v,time)=>{v.pause();if(Math.abs(v.currentTime-time)>.00001){await new Promise((resolve,reject)=>{v.addEventListener('seeked',resolve,{once:true});v.addEventListener('error',reject,{once:true});setTimeout(()=>reject(Error('Clip seek timed out at '+time)),15000);v.currentTime=time})}if(v.requestVideoFrameCallback){await Promise.race([new Promise(resolve=>v.requestVideoFrameCallback(resolve)),new Promise(resolve=>setTimeout(resolve,120))])}},time);
     await waitForCaptureReadiness(framePage);const path='frames/'+id+'-'+pct+'.png';files.push({path,data:await screenshotWithDiagnostics(framePage,path,{animations:'disabled'},framePage.locator('video'))});clip.frames[pct]=path;
    }
   }
   for(const clip of clips.values())await captureClipQA(framePage,clip,files,checks);
   if(!clips.size)checks.push({id:'video-none',category:'video',key:'consistency',title:'No clips used',result:'Pass',page:pages[0].path,width:1440,selector:'body',measured:{clips:0},threshold:{allUsedClips:true},crop:checks[0].crop});
   const checklist=packet.checklist.map(x=>({...x,result:'Needs staff review',evidence:results.map(p=>p.path)}));
   // These are review results, not an invented automatic quality certification.
   // The remaining visual/content judgments require staff acknowledgement.
   for(const id of ['playbook-17','playbook-21']){const item=checklist.find(x=>x.id===id);item.result='Recorded';item.note=id==='playbook-17'?'Static/reduced-motion screenshots plus five time samples for each used clip.':'Rights, approval and Sample provenance recorded. Contractor-owned photos take priority under #028D, overriding the older playbook-only-AI sentence.'}
   return {pages:results,clips:[...clips.values()],claims,checklist,files,qa:{schema:1,revision:QA_REVISION,captureEnvironment:{rendering:'software sRGB',browserArgs:REVIEW_BROWSER_ARGS,deviceScaleFactor:1,mapTiles:{fixture:'src/aws/fixtures/neutral-map-tile.png',sha256:mapTileSha256,servedLocally:mapTileRequests.length,externalRequestsSent:0,requests:mapTileRequests.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))}},versionHash:packet.versionHash,manifestHash:packet.manifestHash,thresholds:QA_THRESHOLDS,checks}};
  }catch(error){console.error('Review capture failed',packet.slug,error.stack||String(error));throw error;}finally{await browser.close()}
 };
}
