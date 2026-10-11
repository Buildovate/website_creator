import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='C:/Users/joe/website_creator/docs/build-evidence/028A',phase=process.argv[2];
assert.ok(['before','after'].includes(phase));
fs.mkdirSync(out+'/current-color-fixes',{recursive:true});
const fixtures=JSON.parse(fs.readFileSync(out+'/fixtures.json'));
const cases=[
 {key:'patios-service-text',kit:'patios',path:'',capture:'.kit-services article',target:'.kit-services article:first-child :is(.service-index,p)'},
 ...['windows-doors','solar','concrete','pools','locksmith'].map(kit=>({key:kit+'-hero-button',kit,path:'',capture:'.story-actions',target:'.story-primary'})),
 {key:'roofing-blog-label',kit:'roofing-complete',path:'/blog',capture:'.blog-tools',target:'.blog-tools label'},
 ...['privacy','terms'].map(kind=>({key:'policy-'+kind+'-caption',kit:'roofing-complete',path:'/legal/'+kind,capture:'.welcome-card',target:'.welcome-card>small'}))
];
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),records=[];
try{for(const [device,width,height]of [['desktop',1440,900],['phone',390,844]]){const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage();
for(const spot of cases){const fixture=fixtures.find(f=>f.kit===spot.kit&&f.style==='current');assert.ok(fixture);const response=await page.goto('http://127.0.0.1:8184/s/'+fixture.slug+spot.path,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
await page.evaluate(()=>document.fonts.ready);const element=page.locator(spot.capture).first();await element.scrollIntoViewIfNeeded();await page.waitForTimeout(350);await page.evaluate(async()=>Promise.all([...document.images].filter(i=>i.complete).map(i=>i.decode().catch(()=>{}))));
const values=await page.locator(spot.target).evaluateAll(elements=>elements.map(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return{text:el.textContent.trim(),trade:document.body.dataset.trade||null,color:s.color,backgroundColor:s.backgroundColor,layout:{width:r.width,height:r.height,fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,padding:s.padding,margin:s.margin,borderRadius:s.borderRadius,display:s.display}}}));
assert.ok(values.length,spot.key);const screenshot='current-color-fixes/'+spot.key+'-'+device+'-'+phase+'.png';await element.screenshot({path:out+'/'+screenshot});records.push({key:spot.key,device,selector:spot.target,values,screenshot});
}await context.close();}}
finally{await browser.close();fs.writeFileSync(out+'/current-color-fixes/'+phase+'.json',JSON.stringify(records,null,2));}
if(phase==='after'){const before=JSON.parse(fs.readFileSync(out+'/current-color-fixes/before.json'));const compared=records.map(after=>{const old=before.find(r=>r.key===after.key&&r.device===after.device);assert.ok(old);assert.deepEqual(after.values.map(x=>x.layout),old.values.map(x=>x.layout),'Layout changed '+after.key+' '+after.device);for(const value of after.values){const isButton=after.key.endsWith('hero-button'),expected=after.key.startsWith('patios-')?'rgb(109, 114, 94)':isButton?'rgb(166, 94, 58)':after.key==='roofing-blog-label'?'rgb(98, 109, 96)':'rgb(97, 113, 135)';assert.equal(isButton?value.backgroundColor:value.color,expected,'Approved color not rendered '+after.key)}return{key:after.key,device:after.device,layoutIdentical:true,before:old.values,after:after.values,beforeCapture:old.screenshot,afterCapture:after.screenshot}});fs.writeFileSync(out+'/current-color-fixes/comparison.json',JSON.stringify(compared,null,2));}
console.log(JSON.stringify({phase,spots:records.length,targets:records.reduce((n,r)=>n+r.values.length,0),trades:[...new Set(records.flatMap(r=>r.values.map(v=>v.trade)))]}));
