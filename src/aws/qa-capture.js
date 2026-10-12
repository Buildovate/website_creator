import {screenshotWithDiagnostics} from './review-capture-diagnostics.js';
import {waitForCaptureReadiness} from './review-capture-readiness.js';
import {inspectPage,floatingOverlaps} from './qa-browser.js';
import {frameMetrics,morphMetrics} from '../qa-video.js';
import {QA_THRESHOLDS,videoResult} from '../qa-gate.js';
import {FINANCING_DISCLOSURE} from '../platform/constitution.ts';
import {assessLegalPolicy} from '../platform/legal-policy.ts';
export async function capturePageQA(page,{source,packet,snapshot,pageInfo,width,network,files,checks,legalDisclosureAvailable=false,requiresFinanceDisclosure=false,legalPolicyEvidence=null}){
 const settings=source?.settings||{};
 const rows=await page.evaluate(inspectPage,{settings,sample:packet.content.sampleFixture,snapshot:snapshot?.payload||{},financeDisclosure:FINANCING_DISCLOSURE,policy:assessLegalPolicy(settings),legalDisclosureAvailable,requiresFinanceDisclosure,legalPolicyEvidence});
 const floats=[];const stops=await page.evaluate(()=>[0,...[...document.querySelectorAll('main>section')].map(e=>Math.max(0,e.getBoundingClientRect().top+scrollY-110))]);
 for(const y of [...new Set(stops)]){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(40);floats.push(...await page.evaluate(floatingOverlaps));}
 await page.evaluate(()=>scrollTo(0,0));
 rows.push({category:'layout',key:'floating',title:'Floating elements leave text, forms, primary actions and media clear',result:floats.length?'Fail':'Pass',selector:floats[0]?.target||'body',measured:{violations:floats.length,failures:floats.slice(0,24)},threshold:{overlapPx:2},box:floats[0]?.box||{x:0,y:0,width,height:280},evidenceScroll:floats[0]?.scrollY});
 const failures=network.filter(n=>n.status>=400||n.error);
 rows.push({category:'media',key:'requests',title:'Page resources load successfully',result:failures.length?'Fail':'Pass',selector:'body',measured:failures,threshold:{failedRequests:0},box:{x:0,y:0,width,height:280}});
 const cropCache=new Map();
 for(const row of rows){
  // Each result has a bounded screenshot crop. Pass rows share the same page crop;
  // failure crops use the affected element's document box, never a fabricated image.
  if(row.evidenceScroll!==undefined){await page.evaluate(y=>scrollTo(0,y),row.evidenceScroll);await page.waitForTimeout(40);await waitForCaptureReadiness(page);const crop='qa-crops/'+pageInfo.id+'-'+width+'-floating.png';files.push({path:crop,data:await screenshotWithDiagnostics(page,crop,{animations:'disabled'})});const {box,evidenceScroll,...entry}=row;checks.push({...entry,id:pageInfo.id+'-'+width+'-'+row.key,page:pageInfo.path,width,crop,evidenceScroll});await page.evaluate(()=>scrollTo(0,0));continue;}
  const b=row.result==='Pass'?{x:0,y:0,width,height:240}:row.box;
  const size=await page.evaluate(()=>({height:Math.max(document.documentElement.scrollHeight,innerHeight),width:document.documentElement.clientWidth}));
  const clip={x:Math.max(0,Math.min(b.x,size.width-1)),y:Math.max(0,Math.min(b.y,size.height-1)),width:Math.max(1,Math.min(b.width||width,640,size.width-Math.max(0,b.x))),height:Math.max(1,Math.min(b.height||240,280,size.height-Math.max(0,b.y)))};
  const key=JSON.stringify(clip);let crop=cropCache.get(key);
  if(!crop){await waitForCaptureReadiness(page);crop='qa-crops/'+pageInfo.id+'-'+width+'-'+(cropCache.size+1)+'.png';files.push({path:crop,data:await screenshotWithDiagnostics(page,crop,{clip,fullPage:true,animations:'disabled'})});cropCache.set(key,crop);}
  const {box,...entry}=row;checks.push({...entry,id:pageInfo.id+'-'+width+'-'+row.key,page:pageInfo.path,width,crop});
 }
}
export async function framePixels(page,data){return page.evaluate(async base64=>{const img=new Image();img.src='data:image/png;base64,'+base64;await img.decode();const canvas=document.createElement('canvas');canvas.width=96;canvas.height=64;const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(img,img.width*.1,img.height*.1,img.width*.8,img.height*.8,0,0,96,64);return Array.from(c.getImageData(0,0,96,64).data)},Buffer.from(data).toString('base64'));}
export async function captureClipQA(page,clip,files,checks){
 if(clip.decodeError){for(const [category,key,title] of [['video','consistency','Video consistency cannot be assessed: decode failed'],['media','clip-load','Video failed to decode']])checks.push({id:'decode-'+category+'-'+checks.length,category,key,title,result:'Fail',page:clip.locations[0]?.page||'',width:960,selector:clip.locations[0]?.selector||'video',frame:clip.url,measured:{decodeError:clip.decodeError,framesUnavailable:true},threshold:{decodeErrors:0},crop:clip.frames[0]});return;}

 const frames=await Promise.all([0,25,50,75,100].map(p=>framePixels(page,files.find(f=>f.path===clip.frames[p]).data)));
 const measures=[25,50,75,100].map((percent,i)=>({percent,...frameMetrics(frames[0],frames[i+1])}));
 const morph=morphMetrics(frames);
 checks.push({id:'clip-'+checks.filter(c=>c.category==='video').length,category:'video',key:'consistency',title:'Five-frame subject consistency',result:videoResult(measures,morph),page:clip.locations[0]?.page||'',width:960,selector:clip.locations[0]?.selector||'video',frame:clip.url,measured:{frames:measures,morph},threshold:QA_THRESHOLDS.video,crop:clip.frames[measures.reduce((a,b)=>a.ssim<b.ssim?a:b).percent]});
 const boxes=clip.geometry||[],letterbox=boxes.filter(b=>b.letterboxFraction>QA_THRESHOLDS.letterboxFraction);
 checks.push({id:'clip-media-'+checks.filter(c=>c.key==='clip-load').length,category:'media',key:'clip-load',title:'Video decodes, has a poster and fills its frame',result:clip.decodeError||letterbox.length||!clip.poster?'Fail':'Pass',page:clip.locations[0]?.page||'',width:960,selector:clip.locations[0]?.selector||'video',frame:clip.url,measured:{duration:clip.duration,decodeError:clip.decodeError||null,boxes},threshold:{letterboxFraction:QA_THRESHOLDS.letterboxFraction,decodeErrors:0,posterRequired:true},crop:clip.frames[0]});
}