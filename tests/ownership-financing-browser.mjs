import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {build} from 'esbuild';
import {paymentHarness} from './helpers/payments-fixture.mjs';import {billingSummary} from '../src/payments/billing.js';import {makeFakeBillingAdapter} from './stripe-fake.mjs';
const root=process.cwd(),out=root+'/docs/build-evidence/LAUNCH-DECISIONS/financing',shots=out+'/screenshots';fs.mkdirSync(shots,{recursive:true});
const {chromium}=createRequire(import.meta.url)('playwright');
const h=paymentHarness();let browser;const contrast=[],checks=[],base='http://127.0.0.1:5197';
async function readable(page,state){
 const png=await page.screenshot(),report=await page.evaluate(async({bytes,state})=>{
  const bitmap=await createImageBitmap(new Blob([new Uint8Array(bytes)],{type:'image/png'})),canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;const c=canvas.getContext('2d');c.drawImage(bitmap,0,0);
  const rgb=v=>v.match(/[\d.]+/g)?.slice(0,3).map(Number),lum=a=>a.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0),ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  const text=[],issues=[],pixels=[];
  for(const el of document.querySelectorAll('body *')){const r=el.getBoundingClientRect(),s=getComputedStyle(el);if(r.width===0||r.height===0||r.bottom<=0||r.top>=innerHeight||el.closest('svg')||!Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()))continue;
   for(let a=el;a;a=a.parentElement)if(Number(getComputedStyle(a).opacity)<1)issues.push('Text opacity: '+el.textContent.slice(0,40));
   let bg=null;for(let a=el;a;a=a.parentElement){const color=getComputedStyle(a).backgroundColor;if(color!=='rgba(0, 0, 0, 0)'&&color!=='transparent'){bg=rgb(color);break;}}bg ||= [255,255,255];
   const n=ratio(rgb(s.color),bg),large=parseFloat(s.fontSize)>=24||(parseFloat(s.fontSize)>=18.66&&Number(s.fontWeight)>=700),threshold=large?3:4.5;text.push({label:el.textContent.trim().slice(0,80),color:s.color,background:bg,ratio:n,threshold});if(n<threshold)issues.push('Contrast '+n.toFixed(2)+': '+el.textContent.slice(0,50));
  }
  for(const el of document.querySelectorAll('.bv-card,.bv-game-quest,.bv-game-payment-lock,#fixture')){const r=el.getBoundingClientRect();if(r.top<0||r.top+20>=innerHeight)continue;const expected=rgb(getComputedStyle(el).backgroundColor);if(!expected)continue;const candidates=[[20,8],[8,20],[25,15],[r.width/2,8]].filter(([x,y])=>el.contains(document.elementFromPoint(r.x+x,r.y+y)));if(!candidates.length){pixels.push({selector:el.className||el.id,occludedByFixture:true});continue;}const matches=candidates.map(([x,y])=>Array.from(c.getImageData(Math.floor(r.x+x),Math.floor(r.y+y),1,1).data).slice(0,3));pixels.push({selector:el.className||el.id,expected,actual:matches});if(!matches.some(a=>a.every((v,i)=>Math.abs(v-expected[i])<=2)))issues.push('Rendered backing differs: '+el.className);}
  return {state,text,pixels,issues};
 },{bytes:[...png],state});assert.deepEqual(report.issues,[]);assert.ok(report.text.length>0);contrast.push(report);
}
try{
 h.env.PAYMENT_BILLING_ADAPTER=makeFakeBillingAdapter();await h.send(h.event('qa-paid','invoice.paid',h.invoice('qa-paid','PLAN-WEBSITE-MONTH',5000,'2026-10-01','2099-11-01')));const data=await billingSummary(h.env,'tenant_123');
 const bundle=await build({stdin:{contents:"import {renderBillingSummary} from './src/client/workspace/billing.ts';window.showBilling=d=>{document.querySelector('#board').innerHTML=renderBillingSummary(d)};",resolveDir:root},bundle:true,write:false,format:'iife',platform:'browser'}),css=fs.readFileSync(root+'/dist/client/platform.css','utf8');
 browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
 for(const [device,width,height]of [['desktop',1440,900],['phone',390,844]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],network=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{const u=new URL(route.request().url());if(u.origin!==base){network.push(u.href);return route.abort();}if(u.pathname==='/')return route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ownership financing — local QA fixture</title><style>'+css+'body{margin:0}#fixture{position:sticky;top:0;z-index:999;background:#172d47;color:#fff;padding:8px 20px;font:14px system-ui}#board{max-width:1120px;margin:0 auto;padding:24px}#board *{scroll-margin-top:56px}@media(max-width:720px){#board{padding:16px}}</style></head><body class="bv-platform"><div id="fixture">Local QA fixture · no live checkout</div><main id="board"></main><script>'+bundle.outputFiles[0].text+'</script></body></html>'});const file=root+'/public'+u.pathname;return fs.existsSync(file)?route.fulfill({body:fs.readFileSync(file),contentType:file.endsWith('.svg')?'image/svg+xml':'application/octet-stream'}):route.fulfill({status:404,body:''});});
  await page.goto(base);await page.evaluate(d=>window.showBilling(d),data);await page.evaluate(()=>document.fonts.ready);
  const own=page.locator('[data-bv-own]'),card=page.locator('article').filter({has:own});await card.scrollIntoViewIfNeeded();
  assert.equal(await own.isDisabled(),false);assert.ok((await own.boundingBox()).height>=44);checks.push('44px enabled ownership action '+device);
  assert.equal(await card.locator('.bv-ownership-financing p').innerText(),'Or pay over time with Klarna or Affirm, subject to approval.');checks.push('Approval-qualified copy below price '+device);
  assert.equal(await page.locator('.bv-ownership-financing').count(),1);assert.equal(await page.locator('.bv-ownership-marks img').count(),2);for(const img of await page.locator('.bv-ownership-marks img').all())assert.equal(await img.evaluate(e=>e.complete&&e.naturalWidth>0),true);checks.push('Both official local marks decoded '+device);
  assert.doesNotMatch(await card.innerText(),/APR|interest.free|monthly installment|\$\d+\.\d+ per month/i);checks.push('No unbacked financing amount or APR '+device);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);checks.push('No horizontal overflow '+device);
  await readable(page,'ownership-financing-'+device);checks.push('Full-opacity AA text on rendered background '+device);
  await page.screenshot({path:shots+'/own-website-'+device+'.png'});await own.focus();assert.equal(await own.evaluate(e=>e===document.activeElement),true);checks.push('Keyboard action reachable '+device);
  assert.deepEqual(errors,[]);assert.deepEqual(network,[]);checks.push('No browser errors or provider requests '+device);await context.close();
 }
 fs.writeFileSync(out+'/browser-results.json',JSON.stringify({passed:checks.length,failed:0,checks,providerCalls:0},null,2));fs.writeFileSync(out+'/contrast-pixels.json',JSON.stringify(contrast,null,2));console.log(checks.length+'/'+checks.length+' ownership financing browser checks pass');
}finally{await browser?.close();h.close();}
