import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {extname,join,normalize} from 'node:path';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {ROBLES,settings} from '../../../src/core.js';

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='C:/Users/joe/website_creator';
const output=join(root,'docs/build-evidence/004L-v2');
mkdirSync(output,{recursive:true});
await build({entryPoints:[join(root,'src/views.js')],outfile:join(root,'dist/owner-capture-page.js'),bundle:true,platform:'node',format:'esm',target:'node22',loader:{'.html':'text'}});
const {sitePage}=await import('../../../dist/owner-capture-page.js');
const uploaded=readFileSync(join(root,'public/assets/owner-roofing/owner-sample-960.webp'));
const mime={'.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.avif':'image/avif','.mp4':'video/mp4','.webm':'video/webm'};
const server=createServer((request,response)=>{
 const url=new URL(request.url,'http://127.0.0.1');
 if(url.pathname==='/media/owner-upload-qa'){response.writeHead(200,{'content-type':'image/webp'}).end(uploaded);return}
 if(url.pathname==='/'){
  const real=url.searchParams.has('uploaded');
  const data=settings({...ROBLES,template:'cinematic',ownerPhotoId:real?'owner-upload-qa':null});
  const tenant={slug:'robles-roofing',settings:JSON.stringify(data),published:JSON.stringify(data)};
  const html=sitePage(tenant,[],real?[{id:'owner-upload-qa'}]:[]);
  response.writeHead(200,{'content-type':'text/html; charset=utf-8'}).end(html);return;
 }
 const file=normalize(join(root,'public',decodeURIComponent(url.pathname)));
 if(!file.startsWith(join(root,'public'))){response.writeHead(403).end();return}
 try{const body=readFileSync(file);response.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'}).end(body)}catch{response.writeHead(404).end()}
});
await new Promise(resolve=>server.listen(8138,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const errors=[],results=[];
try{
 for(const width of [1440,1280,1024,768,390]){
  for(const name of width===1440||width===390?['sample','uploaded']:['sample']){
   const phone=width===390,viewport={width,height:phone?844:900};
   const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:phone,reducedMotion:'reduce'});
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto('http://127.0.0.1:8138/'+(name==='uploaded'?'?uploaded=1':''),{waitUntil:'domcontentloaded'});
   const section=page.locator('#about');
   await section.scrollIntoViewIfNeeded();
   await section.locator('.owner-story-photo img').evaluate(image=>image.decode());
   const state=await section.evaluate(el=>{
    const rect=node=>{const r=node.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
    const photo=el.querySelector('.owner-story-photo'),card=el.querySelector('.owner-story-copy'),img=photo.querySelector('img'),eyebrow=el.querySelector('.owner-identity .kit-eyebrow');
    return {sample:!!el.querySelector('[data-sample-media]'),badge:!!el.querySelector('.owner-sample-label'),photo:rect(photo),card:rect(card),outer:rect(el),scrollWidth:document.documentElement.scrollWidth,imageFit:getComputedStyle(img).objectFit,eyebrow:{width:eyebrow.clientWidth,scrollWidth:eyebrow.scrollWidth},quote:el.querySelector('blockquote').textContent};
   });
   assert.equal(state.sample,name==='sample');assert.equal(state.badge,name==='sample');
   assert.ok(state.scrollWidth<=width+1,`overflow ${width}-${name}: ${JSON.stringify(state)}`);
   assert.ok(Math.abs(state.photo.height/state.photo.width-1.25)<.015,`ratio ${width}-${name}: ${JSON.stringify(state)}`);
   assert.equal(state.imageFit,'cover');
   assert.ok(state.eyebrow.scrollWidth<=state.eyebrow.width+1,`eyebrow ${width}-${name}: ${JSON.stringify(state)}`);
   assert.equal(state.quote,'I listen before I quote.');
   if(phone)assert.ok(state.card.y>=state.photo.bottom-65&&state.card.y<state.photo.bottom,`phone overlap: ${JSON.stringify(state)}`);
   else{
    assert.ok(state.photo.width>=state.outer.width*.5,`photo width ${width}-${name}: ${JSON.stringify(state)}`);
    assert.ok(state.photo.right>=state.outer.right-width*.08-2,`empty right ${width}-${name}: ${JSON.stringify(state)}`);
    assert.ok(state.card.right>state.photo.x+40&&state.card.x<state.photo.x,`desktop overlap ${width}-${name}: ${JSON.stringify(state)}`);
    assert.ok(state.card.height<state.photo.height,`card drives height ${width}-${name}: ${JSON.stringify(state)}`);
   }
   const captureStyle=await page.addStyleTag({content:'.shared-site-header,.story-nav,.mobile-dock,.kit-mobile-dock{visibility:hidden!important}'});
   await section.screenshot({path:join(output,`${name}-${width}x${viewport.height}.png`)});
   await captureStyle.evaluate(node=>node.remove());
   if(phone){
    await page.locator('#about blockquote').scrollIntoViewIfNeeded();
    await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollBy({top:140,behavior:'instant'})});
    await page.waitForTimeout(150);
    const quoteView=await page.evaluate(()=>({quoteBottom:document.querySelector('#about blockquote').getBoundingClientRect().bottom,dockTop:document.querySelector('.mobile-dock,.kit-mobile-dock')?.getBoundingClientRect().top??innerHeight}));
    assert.ok(quoteView.quoteBottom<=quoteView.dockTop-12,`quote behind call bar: ${JSON.stringify(quoteView)}`);
    await page.screenshot({path:join(output,`${name}-quote-390x844.png`)});
   }
   results.push({width,height:viewport.height,state:name,geometry:state});
   console.log(`${width}-${name}`,JSON.stringify(state));
   await page.close();
  }
 }
 assert.deepEqual(errors,[]);
 writeFileSync(join(output,'browser-results.json'),JSON.stringify({results,errors},null,2));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
