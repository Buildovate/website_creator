import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {inspectPage} from '../src/aws/qa-browser.js';
const root=releaseRepoRoot,out=root+'/docs/build-evidence/028F',origin='http://workspace-recognition.local',path='/s/platform-look-baseline-roofing-current/pages/look-baseline',html=fs.readFileSync(out+'/after-html/public-workspace-document.html','utf8');assert.ok(html.includes('href="tel:+18055550140"'));
const {chromium}=createRequire(import.meta.url)('playwright'),browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE}),results=[];
const cases=[
{id:'missing',edit:()=>document.querySelector('main>a.primary').remove()},
{id:'hidden-attribute',edit:()=>document.querySelector('main>a.primary').hidden=true},
{id:'hidden-css',edit:()=>document.querySelector('main>a.primary').style.display='none'},
{id:'zero-size',edit:()=>document.querySelector('main>a.primary').style.cssText='display:block;width:0;height:0;min-width:0;min-height:0;padding:0;border:0;font-size:0;line-height:0;overflow:hidden'},
{id:'offscreen-left',edit:()=>document.querySelector('main>a.primary').style.cssText='position:absolute;left:-3000px'},
{id:'offscreen-above',edit:()=>document.querySelector('main>a.primary').style.cssText='position:absolute;top:-3000px'},
{id:'href-missing',edit:()=>document.querySelector('main>a.primary').removeAttribute('href')},
{id:'href-empty',edit:()=>document.querySelector('main>a.primary').setAttribute('href','')},
{id:'tel-empty',edit:()=>document.querySelector('main>a.primary').setAttribute('href','tel:')},
{id:'wrong-href',edit:()=>document.querySelector('main>a.primary').setAttribute('href','#contact')},
{id:'second-call-primary',edit:()=>document.querySelector('main').append(document.querySelector('main>a.primary').cloneNode(true))},
{id:'second-generic-primary',edit:()=>{const a=document.createElement('a');a.href='#contact';a.textContent='Fictional second action';a.setAttribute('data-primary','');document.querySelector('main').append(a)}},
{id:'different-page-type',path:'/s/platform-look-baseline-roofing-current/forms/look-baseline',edit:()=>{}},
{id:'wrong-main-type',edit:()=>document.querySelector('main').classList.remove('public-document')},
{id:'not-direct-child',edit:()=>{const div=document.createElement('div');div.append(document.querySelector('main>a.primary'));document.querySelector('main').append(div)}}
];
try{const context=await browser.newContext({reducedMotion:'reduce'});await context.route('**/*',r=>{const u=new URL(r.request().url());if(u.origin!==origin)return r.abort();if(u.pathname===path||u.pathname.includes('/forms/look-baseline'))return r.fulfill({contentType:'text/html; charset=utf-8',body:html});const f=root+'/dist/client'+u.pathname;if(!fs.existsSync(f))return r.fulfill({status:404,body:'No local file'});const type={js:'text/javascript',css:'text/css',ttf:'font/ttf',woff2:'font/woff2'}[f.split('.').at(-1)]||'application/octet-stream';return r.fulfill({contentType:type,body:fs.readFileSync(f)})});const page=await context.newPage();fs.mkdirSync(out+'/recognition',{recursive:true});
for(const width of [1440,1280,768,390]){await page.setViewportSize({width,height:width===390?844:900});const visit=async p=>{await page.goto(origin+(p||path),{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready)};await visit();const positive=(await page.evaluate(inspectPage,{sample:true})).find(c=>c.key==='actions');assert.equal(positive.result,'Pass');assert.equal(positive.measured.primaries,1);const crop='recognition/workspace-call-'+width+'.png';await page.locator('main.public-document').screenshot({path:out+'/'+crop});results.push({entry:'workspace-page-call',case:'positive',width,check:positive,crop});
for(const c of cases){await visit(c.path);await page.evaluate(c.edit);if(c.id==='zero-size')assert.deepEqual(await page.locator('main>a.primary').evaluate(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),{width:0,height:0});const check=(await page.evaluate(inspectPage,{sample:true})).find(c=>c.key==='actions');const crop='recognition/workspace-'+c.id+'-'+width+'.png';await page.screenshot({path:out+'/'+crop});assert.equal(check.result,'Fail',c.id+' '+width);results.push({entry:'workspace-page-call',case:c.id,width,check,crop});}}
fs.writeFileSync(out+'/checks/workspace-recognition.json',JSON.stringify({passed:true,positive:4,negative:cases.length*4,results,providerCalls:0},null,2));console.log('PASS workspace primary recognition: 4 positives, '+cases.length*4+' negative boundaries, generic detector untouched.');}finally{await browser.close()}
