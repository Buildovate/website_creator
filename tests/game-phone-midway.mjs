import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {complete} from './game-fixtures.mjs';
import {evaluateProgress} from '../src/blueprint/progress.js';
const root=releaseRepoRoot,out=root+'/docs/build-evidence/028G',base='http://127.0.0.1:5183';
const {chromium}=createRequire(import.meta.url)('playwright');
const bundle=await build({stdin:{contents:"import {mountGame} from './src/client/workspace/game/view.js';import {createGameExperience} from './src/client/workspace/game/experience.js';window.showFixture=data=>{const exp=createGameExperience({request:async()=>({})});exp.accept({});window.game=mountGame(document.querySelector('#fixture'),{data,onRendered:el=>exp.attach(el)})}",resolveDir:root},bundle:true,write:false,format:'iife',platform:'browser'});
const css=fs.readFileSync(root+'/.data/028G/dist/client/platform.css','utf8'),states=[],errors=[],blocked=[];
fs.mkdirSync(out+'/round5d',{recursive:true});
let release;const fontGate=new Promise(resolve=>release=resolve);
const browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true}),page=await context.newPage();
 page.on('pageerror',error=>errors.push(error.message));
 await context.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.origin!==base){blocked.push(url.href);return route.abort();}
  if(url.pathname.startsWith('/assets/platform/fonts/')&&/^[a-z0-9-]+\.woff2$/.test(url.pathname.split('/').at(-1))){await fontGate;return route.fulfill({contentType:'font/woff2',body:fs.readFileSync(root+'/public'+url.pathname)});}
  if(['/assets/platform/favicon.svg','/game-art/house.svg'].includes(url.pathname))return route.fulfill({contentType:'image/svg+xml',body:fs.readFileSync(root+'/public'+url.pathname)});
  if(url.pathname==='/g3-midway-review')return route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>G-3 QA midway review</title><style>'+css+'</style></head><body class="bv-platform"><div id="fixture"></div><script>'+bundle.outputFiles[0].text+'</script></body></html>'});
  return route.fulfill({status:404,body:''});
 });
 const source=complete();for(const id of ['estimator','promotions','financing','leads','launch','marketing'])delete source[id];
 await page.goto(base+'/g3-midway-review',{waitUntil:'domcontentloaded'});
 await page.evaluate(data=>window.showFixture(data),{tenant:{id:'qa',name:'Phone progress · QA fixture'},role:'owner',progress:evaluateProgress(source),sections:[]});
 async function review(name){
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const report=await page.evaluate(()=>{
   const chip=document.querySelector('[data-game-chip=estimator]'),strip=document.querySelector('.bv-game-chips'),label=chip.querySelector('strong'),a=chip.getBoundingClientRect(),b=strip.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(label);
   const c=getComputedStyle(label),bg=getComputedStyle(chip),opacities=[];for(let el=label;el;el=el.parentElement)opacities.push(Number(getComputedStyle(el).opacity));
   const box=r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom});
   return {text:label.textContent,selected:chip.getAttribute('aria-selected'),chip:box(a),clip:{left:b.left+strip.clientLeft,right:b.left+strip.clientLeft+strip.clientWidth,top:b.top,bottom:b.bottom},textBoxes:[...range.getClientRects()].map(box),foreground:c.color,background:bg.backgroundColor,opacities,fonts:document.fonts.status,scrollLeft:strip.scrollLeft,pageWidth:document.documentElement.scrollWidth,viewport:innerWidth};
  });states.push({name,...report});
  assert.equal(report.text,'Virtual estimator');assert.equal(report.selected,'true');
  assert.ok(report.chip.left>=report.clip.left&&report.chip.right<=report.clip.right,'Selected chip must fit entirely in the visible strip');
  for(const rect of report.textBoxes)assert.ok(rect.left>=report.clip.left&&rect.right<=report.clip.right&&rect.top>=report.clip.top&&rect.bottom<=report.clip.bottom,'Every line of the selected label must be visible');
  assert.ok(report.opacities.every(x=>x===1));assert.equal(report.foreground,'rgb(16, 48, 77)');assert.equal(report.background,'rgb(255, 255, 255)');assert.ok(report.pageWidth<=report.viewport);
 }
 await review('before webfonts finish');
 release();await page.evaluate(()=>document.fonts.ready);
 await review('after webfonts finish');
 assert.deepEqual(errors,[]);assert.deepEqual(blocked,[]);
 await page.screenshot({path:out+'/screenshots/g3-phone-midway.png'});
 fs.writeFileSync(out+'/round5d/midway-review.json',JSON.stringify({passed:true,reviews:1,fontStates:states,contrast:13.531126952230803,colorsUnchanged:true,screenshot:'screenshots/g3-phone-midway.png',port:5183,externalRequests:blocked},null,2));
 console.log('PASS midway readability: 1 review, 2 font states, full selected-chip/text visibility, opacity 1, unchanged 13.53:1 pair, no horizontal scroll.');
}catch(error){fs.writeFileSync(out+'/round5d/midway-review-failure.json',JSON.stringify({passed:false,states,error:error.stack},null,2));throw error;}
finally{release();await browser.close();}
