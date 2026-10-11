import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {renderConstitutionPage} from '../../../../src/constitution-pages.js';

const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F/checks';
const modules='C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const require=createRequire(import.meta.url),{chromium}=require(modules+'/playwright'),{PNG}=require(modules+'/pngjs');
const sha=b=>createHash('sha256').update(b).digest('hex');
const source=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/outside-scope-baseline.json'));
const archive=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/028F/approved-archived-responses.json'));
const archivedPromotions=archive.filter(x=>x.url.includes('/promotions'));
assert.equal(archivedPromotions.length,17);
const archivedOfferCounts=archivedPromotions.map(x=>{
  const row=source.find(y=>y.row.slug===x.url.match(/^\/s\/([^/]+)/)?.[1]);
  assert.ok(row,x.url);
  const p=JSON.parse(row.row.settings).platform.promotions;
  return {url:x.url,offers:p.enabled?p.offers.filter(o=>o.enabled).length:0};
});
assert.ok(archivedOfferCounts.every(x=>x.offers===0),'Archived promotions section requires separate approval');
const begins=new Date(Date.now()-86400000).toISOString(),ends=new Date(Date.now()+86400000).toISOString();
const offer={id:'proof-one',enabled:true,title:'Test offer one',description:'Visual proof fixture',reward:'Fixture reward',terms:'Fixture only',startsAt:begins,endsAt:ends,question:'What needs work?',choices:['First choice','Second choice'],answer:0,code:'FIXTURE'};
const htmlFor=(row,look,count=2)=>{const s=JSON.parse(row.row.settings);s.siteStyle=look;s.platform.promotions={enabled:true,offers:count===1?[offer]:[offer,{...offer,id:'proof-two',title:'Test offer two'}]};return renderConstitutionPage(s,{slug:'proof-'+row.row.slug,kind:'promotions',preview:false})};
const looks=['current','bold','fresh','classic'],coverage=[];
for(const row of source)for(const look of looks){
  const html=htmlFor(row,look),buttons=[...html.matchAll(/<button class="foundation-button[^\"]*"[^>]*>Unlock my offer/g)].map(x=>x[0]);
  assert.equal(buttons.length,2,row.row.slug+' '+look);
  assert.ok(!buttons[0].includes('secondary')&&!buttons[0].includes('style='));
  assert.ok(buttons[1].includes('secondary')&&buttons[1].includes('look-surface'));
  coverage.push({kit:row.row.slug,look,first:'primary',second:'secondary',controls:2});
  const one=[...htmlFor(row,look,1).matchAll(/<button class="foundation-button[^\"]*"[^>]*>Unlock my offer/g)].map(x=>x[0]);
  assert.equal(one.length,1);assert.ok(!one[0].includes('secondary')&&!one[0].includes('style='));
}
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const pairs=[];
try{for(const look of looks)for(const width of [390,768,1440]){
  const html=htmlFor(source[0],look),context=await browser.newContext({viewport:{width,height:width===390?844:900},deviceScaleFactor:1,reducedMotion:'reduce',javaScriptEnabled:false});
  await context.route('**/*',route=>{
    const u=new URL(route.request().url());
    if(u.pathname.startsWith('/s/'))return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
    const file=root+'/dist/client'+decodeURIComponent(u.pathname);
    if(!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:''});
    const ext=file.split('.').at(-1),type={css:'text/css',js:'text/javascript',webp:'image/webp',png:'image/png',jpg:'image/jpeg',svg:'image/svg+xml',woff2:'font/woff2',mp4:'video/mp4'}[ext]||'application/octet-stream';
    return route.fulfill({status:200,contentType:type,body:fs.readFileSync(file)});
  });
  const page=await context.newPage();await page.goto('http://proof.local/s/proof/promotions',{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(x=>x.decode().catch(()=>{})))});
  const button=page.locator('.foundation-offers [data-promotion-quiz] button').nth(1);
  await button.scrollIntoViewIfNeeded();await page.waitForTimeout(80);
  const original=await button.evaluate(el=>({className:el.className,style:el.getAttribute('style'),text:el.textContent,box:el.getBoundingClientRect().toJSON()}));
  await button.evaluate(el=>{el.className='foundation-button';el.removeAttribute('style')});
  const before=await page.screenshot();
  await button.evaluate((el,s)=>{el.className=s.className;el.setAttribute('style',s.style)},original);
  const after=await page.screenshot();
  const a=PNG.sync.read(before),b=PNG.sync.read(after);assert.equal(a.width,b.width);assert.equal(a.height,b.height);
  let changed=0,outside=0;const box=original.box,mask=new Uint8Array(a.width*a.height);
  for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++){
    const i=(y*a.width+x)*4;if(a.data[i]===b.data[i]&&a.data[i+1]===b.data[i+1]&&a.data[i+2]===b.data[i+2]&&a.data[i+3]===b.data[i+3])continue;
    changed++;mask[y*a.width+x]=1;if(!(x+1>box.x&&x<box.right&&y+1>box.y&&y<box.bottom))outside++;
  }
  const changedRegions=[];
  for(let i=0;i<mask.length;i++)if(mask[i]){
    let left=a.width,right=0,top=a.height,bottom=0,pixels=0,queue=[i];mask[i]=0;
    for(let at=0;at<queue.length;at++){
      const k=queue[at],x=k%a.width,y=Math.floor(k/a.width);pixels++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
      for(const n of [x>0?k-1:-1,x<a.width-1?k+1:-1,y>0?k-a.width:-1,y<a.height-1?k+a.width:-1])if(n>=0&&mask[n]){mask[n]=0;queue.push(n)}
    }
    changedRegions.push({x:left,y:top,width:right-left+1,height:bottom-top+1,pixels});
  }
  assert.ok(changed>0,look+' '+width+' button did not visually change');
  assert.equal(outside,0,look+' '+width+' pixels changed outside second button');
  const state=await button.evaluate(el=>{const c=getComputedStyle(el);return {background:c.backgroundColor,color:c.color,border:c.borderColor,outlineStyle:c.outlineStyle,outlineWidth:c.outlineWidth}});
  pairs.push({page:'/s/proof-ambient-baseline-roofing/promotions',width,look,beforeSha256:sha(before),afterSha256:sha(after),changedPixels:changed,changedRegions,buttonBoxes:[box],outsideButtonPixels:outside,passed:outside===0,state});
  await context.close();
}}finally{await browser.close()}
const report={passed:true,sourceCoverage:coverage,archivedPromotions:archivedOfferCounts,savedBaselinePromotions:0,rebaselinedCaptures:[],visualPairs:pairs,providerCalls:0};
console.log(JSON.stringify(report));
