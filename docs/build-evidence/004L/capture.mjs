import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,mkdirSync} from 'node:fs';
import {extname,join,normalize} from 'node:path';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {ROBLES,settings} from '../../../src/core.js';

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='C:/Users/joe/website_creator';
const output=join(root,'docs/build-evidence/004L');
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
await new Promise(resolve=>server.listen(8137,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const errors=[];
try{
 for(const [device,viewport] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}]]){
  for(const [name,path] of [['sample','/'],['uploaded','/?uploaded=1']]){
   const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:device==='phone',reducedMotion:'reduce'});
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto('http://127.0.0.1:8137'+path,{waitUntil:'domcontentloaded'});
   const section=page.locator('#about');
   await section.scrollIntoViewIfNeeded();
   await section.locator('.owner-story-photo img').evaluate(image=>image.decode());
   const state=await section.evaluate(el=>{
    const photo=el.querySelector('.owner-story-photo').getBoundingClientRect(),card=el.querySelector('.owner-story-copy').getBoundingClientRect(),outer=el.getBoundingClientRect();
    return {sample:!!el.querySelector('[data-sample-media]'),overlay:!!el.querySelector('.owner-sample-label'),photo:{x:photo.x,y:photo.y,width:photo.width,height:photo.height},card:{x:card.x,y:card.y,width:card.width,height:card.height},outer:{x:outer.x,y:outer.y,width:outer.width,height:outer.height},scrollWidth:document.documentElement.scrollWidth};
   });
   assert.equal(state.sample,name==='sample');assert.equal(state.overlay,name==='sample');
   assert.ok(state.scrollWidth<=viewport.width+1,JSON.stringify(state));
   assert.ok(state.photo.width>0&&state.card.width>0,JSON.stringify(state));
   if(device==='desktop')assert.ok(state.photo.x>=state.card.x+state.card.width-4,JSON.stringify(state));
   else assert.ok(state.card.y>=state.photo.y+state.photo.height-4,JSON.stringify(state));
   await section.screenshot({path:join(output,`${device}-${name}.png`)});
   if(device==='phone'){
    const top=await section.evaluate(el=>el.getBoundingClientRect().top+scrollY);
    await page.evaluate(y=>scrollTo(0,y),top);
    await page.screenshot({path:join(output,`${device}-${name}-top-390x844.png`)});
    await page.evaluate(y=>scrollTo(0,y),top+400);
    await page.screenshot({path:join(output,`${device}-${name}-bottom-390x844.png`)});
   }
   console.log(`${device}-${name}`,JSON.stringify(state));
   await page.close();
  }
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
