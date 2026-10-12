import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {inspectPage,floatingOverlaps} from '../src/aws/qa-browser.js';
import {homeownerPolish} from '../src/homeowner-polish.js';
import {mediaSamples} from './fixtures/media-library.mjs';
const root=releaseRepoRoot,out=root+'/docs/build-evidence/028F',folder=out+'/review-regression/checks/contract-blocker',origin='http://guide-qa.local';
const entry=JSON.parse(fs.readFileSync(out+'/before/round5-guide-source.json'));
const settings=entry.settings;
const original=fs.readFileSync(out+'/before/round5-guide.html','utf8'),longest=mediaSamples().map(f=>f.settings.name).sort((a,b)=>b.length-a.length)[0];
const baseline=original.replace(/(<figcaption><span>THE HOMEOWNER’S FIELD GUIDE<\/span><strong>[^<]+<\/strong><span>)[^<]+/,(_,prefix)=>prefix+longest);
assert.ok(baseline.includes(longest));
const {chromium}=createRequire(import.meta.url)('playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE}),states=[],negative=[],before=[];
let mode='before';
try{
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin)return route.abort();if(u.pathname===entry.path||u.pathname==='/s/fictional/non-guide')return route.fulfill({contentType:'text/html; charset=utf-8',body:mode==='before'?baseline:homeownerPolish(baseline)});const file=root+'/dist/client'+u.pathname;if(!fs.existsSync(file))return route.fulfill({status:404,body:'No installed file'});const type={js:'text/javascript',css:'text/css',webp:'image/webp',jpg:'image/jpeg',png:'image/png',woff2:'font/woff2',ttf:'font/ttf',svg:'image/svg+xml'}[file.split('.').at(-1)]||'application/octet-stream';return route.fulfill({contentType:type,body:fs.readFileSync(file)})});
 const page=await context.newPage();
 const visit=async(width,path=entry.path)=>{await page.setViewportSize({width,height:width===390?844:900});await page.goto(origin+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready)};
 const label=()=>page.evaluate(()=>{const el=document.querySelector('.eg-cover figcaption>span:nth-of-type(2)'),cover=document.querySelector('.eg-cover'),r=document.createRange();r.selectNodeContents(el);const b=cover.getBoundingClientRect(),rects=[...r.getClientRects()].map(x=>x.toJSON());return {text:el.textContent,fontSize:getComputedStyle(el).fontSize,textOverflow:getComputedStyle(el).textOverflow,cover:b.toJSON(),rects,overflowPx:Math.max(0,...rects.flatMap(x=>[x.right-b.right,b.left-x.left,x.bottom-b.bottom,b.top-x.top]))}});
 for(const width of [1440,1280,768,390]){
  mode='before';await visit(width);const oldLabel=await label();const oldImage='before/round5-guide-cover-'+width+'.png';await page.locator('.eg-cover').screenshot({path:out+'/'+oldImage});
  const y=width===1440?818:width===390?998:0;await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(60);const oldOverlap=await page.evaluate(floatingOverlaps),oldHeader='before/round5-guide-header-'+width+'.png';await page.screenshot({path:out+'/'+oldHeader});before.push({width,label:oldLabel,intersections:oldOverlap,images:[oldImage,oldHeader]});
  mode='after';await visit(width);const measured=await label(),checks=await page.evaluate(inspectPage,{sample:true,settings});assert.equal(measured.text,longest);assert.equal(measured.overflowPx,0,'Full guide business name at '+width);assert.notEqual(measured.textOverflow,'ellipsis');assert.equal(checks.filter(c=>c.result==='Fail').length,0,JSON.stringify(checks.filter(c=>c.result==='Fail')));
  const image='after/round5-guide-cover-'+width+'.png';await page.locator('.eg-cover').screenshot({path:out+'/'+image});
  const stops=await page.evaluate(y=>[y,0,...[...document.querySelectorAll('main>section')].flatMap(e=>{const b=e.getBoundingClientRect();return [Math.max(0,b.top+scrollY-110),b.top+scrollY+b.height/2]})],y),samples=[];
  for(const stop of stops){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),stop);await page.waitForTimeout(60);const intersections=await page.evaluate(floatingOverlaps);samples.push({scrollY:await page.evaluate(()=>scrollY),intersections});assert.deepEqual(intersections,[],'Guide clearance '+width+' at '+stop);}
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(60);assert.deepEqual(await page.evaluate(floatingOverlaps),[]);const headerImage='after/round5-guide-header-'+width+'.png';await page.screenshot({path:out+'/'+headerImage});states.push({width,checks,label:measured,samples,images:[image,headerImage]});
  if(width===390){fs.mkdirSync(out+'/recognition',{recursive:true});await page.locator('#ebook-request .eg-consent').screenshot({path:out+'/recognition/guide-consent-390.png'});await page.locator('#ebook-request button.eg-button[type=submit]').screenshot({path:out+'/recognition/guide-primary-390.png'});}
  const cases=[
   {id:'consent-missing',key:'consent',edit:()=>document.querySelector('#ebook-request input[name=consent]').remove()},
   {id:'consent-pre-ticked',key:'consent',edit:()=>document.querySelector('#ebook-request input[name=consent]').setAttribute('checked','')},
   {id:'consent-not-required',key:'consent',edit:()=>document.querySelector('#ebook-request input[name=consent]').required=false},
   {id:'consent-hidden',key:'consent',edit:()=>document.querySelector('#ebook-request input[name=consent]').hidden=true},
   {id:'consent-on-non-guide-page',key:'consent',path:'/s/fictional/non-guide',edit:()=>{}},
   {id:'consent-wrong-wording',key:'consent',edit:()=>document.querySelector('.eg-consent span').textContent='I accept a different request.'},
   {id:'consent-disabled',key:'consent',edit:()=>document.querySelector('#ebook-request input[name=consent]').disabled=true},
   {id:'submit-missing',key:'actions',edit:()=>document.querySelector('#ebook-request button[type=submit]').remove()},
   {id:'submit-hidden',key:'actions',edit:()=>document.querySelector('#ebook-request button[type=submit]').hidden=true},
   {id:'submit-css-hidden',key:'actions',edit:()=>document.querySelector('#ebook-request button[type=submit]').style.display='none'},
   {id:'consent-css-hidden',key:'consent',edit:()=>document.querySelector('#ebook-request input[name=consent]').style.visibility='hidden'},
   {id:'submit-disabled',key:'actions',edit:()=>document.querySelector('#ebook-request button[type=submit]').disabled=true},
   {id:'second-primary',key:'actions',edit:()=>{const b=document.querySelector('#ebook-request button[type=submit]').cloneNode(true);b.textContent='Fictional second primary';b.setAttribute('data-primary','');document.querySelector('#main').append(b)}},
   {id:'submit-wrong-wording',key:'actions',edit:()=>document.querySelector('#ebook-request button[type=submit]').textContent='Different action'}
  ];
  for(const c of cases){await visit(width,c.path);await page.evaluate(c.edit);const result=(await page.evaluate(inspectPage,{sample:true,settings})).find(r=>r.key===c.key);assert.equal(result.result,'Fail',c.id+' at '+width);negative.push({id:c.id,width,result});}
 }
 fs.writeFileSync(out+'/checks/guide-page-browser.json',JSON.stringify({passed:true,providerCalls:0,credits:0,longestSampleName:longest,overlapPx:2,samplingMs:60,states,before,negative},null,2));
 console.log('PASS guide: '+states.length+' widths, '+states.reduce((n,s)=>n+s.samples.length,0)+' 60ms clearance samples, '+negative.length+' required negative checks; full longest Sample name, no clipping or intersections.');
}finally{await browser.close()}
