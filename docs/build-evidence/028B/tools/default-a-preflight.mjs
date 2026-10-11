import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createRuntime,listen} from 'file:///C:/Users/joe/website_creator/src/aws/server.js';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028B',base='http://127.0.0.1:8194';
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const prior=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/028P/baseline-sites.json')),current=JSON.parse(fs.readFileSync(out+'/baseline-sites.json'));
const hashes=['html','stylesheets','protectedCss'].flatMap(group=>prior[group].map(before=>({group,key:before.url||before.path,identical:current[group].some(after=>(after.url||after.path)===(before.url||before.path)&&after.sha256===before.sha256)})));
fs.writeFileSync(out+'/checks/accepted-protected-hashes.json',JSON.stringify({compared:hashes.length,matched:hashes.filter(x=>x.identical).length,failed:hashes.filter(x=>!x.identical),details:hashes},null,2));
assert.equal(hashes.length,279);assert.ok(hashes.every(x=>x.identical));
const homeReviewPresence=current.html.filter(x=>x.page==='home').map(x=>({kit:x.kit,style:x.style,url:x.url,reviewSectionPresent:fs.readFileSync(out+'/'+x.file,'utf8').includes('id="customer-reviews"')}));
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'variants-qa@example.test',APP_ORIGIN:base,LISTEN_HOST:'127.0.0.1',PORT:'8194'}});
let server,browser;
const report={commit:'17e35f0',purpose:'Accepted default a preflight; no product changes',homeReviewPresence,screens:[]};
try {
const rows=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/outside-scope-baseline.json')).filter(({row})=>['roofing','patios'].includes(JSON.parse(row.settings).designKit));
for(const {row} of rows){const keys=Object.keys(row);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run();}
server=await listen(runtime,8194);browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});fs.mkdirSync(out+'/before',{recursive:true});
for(const {row} of rows)for(const width of [1440,768,390]){
 const kit=JSON.parse(row.settings).designKit,context=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'}),page=await context.newPage();
 await context.route('**/*',route=>{const u=new URL(route.request().url());return u.hostname==='127.0.0.1'||u.protocol==='data:'?route.continue():route.abort()});
 const response=await page.goto(base+'/s/'+row.slug,{waitUntil:'networkidle'});assert.equal(response.status(),200);await page.evaluate(()=>document.fonts.ready);await page.locator('#services').scrollIntoViewIfNeeded();await page.waitForTimeout(200);
 const state=await page.evaluate(()=>{const section=document.querySelector('#services');return {reviewSectionPresent:!!document.querySelector('#customer-reviews'),servicesHeading:section.querySelector('h2')?.textContent,primaryButtons:[...section.querySelectorAll('.kit-button,.cx-button,.tp-button,.story-button')].filter(el=>el.checkVisibility({checkVisibilityCSS:true})).map(el=>el.textContent.trim()),controls:[...section.querySelectorAll('a,button')].map(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {text:el.textContent.trim(),class:el.className,background:s.backgroundColor,color:s.color,border:s.border,display:s.display,width:r.width,height:r.height}})}});
 const file='before/'+kit+'-services-a-'+width+'.png';await page.screenshot({path:out+'/'+file});report.screens.push({kit,width,url:base+'/s/'+row.slug,file,...state});await context.close();
}
fs.writeFileSync(out+'/checks/default-a-preflight.json',JSON.stringify(report,null,2));console.log(JSON.stringify({protectedHashes:279,matchedHashes:279,homeStylesInspected:homeReviewPresence.length,homesWithoutReviews:homeReviewPresence.filter(x=>!x.reviewSectionPresent).length,browserStates:report.screens.length,primaryCounts:report.screens.map(x=>({kit:x.kit,width:x.width,primaries:x.primaryButtons.length,links:x.controls.length}))},null,2));
} finally {await browser?.close();if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}await runtime.close();}