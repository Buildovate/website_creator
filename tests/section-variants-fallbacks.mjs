import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import fs from 'node:fs';import assert from 'node:assert/strict';import{createRequire}from'node:module';import{execFileSync}from'node:child_process';
import{createRuntime,listen}from'../src/aws/server.js';
import{originalRows,variantSettings,styles,mixedReviews}from'./fixtures/section-variants.mjs';
import{financingChapter}from'../src/platform/planning-films.ts';
const root=releaseRepoRoot,out=process.env.BV_028B_EVIDENCE||root+'/docs/build-evidence/028B',base='http://127.0.0.1:8196';
const{chromium}=createRequire(import.meta.url)('playwright');
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'fallback-qa@example.test',APP_ORIGIN:base,LISTEN_HOST:'127.0.0.1',PORT:'8196'}});
runtime.env.GOOGLE_PLACES_API_KEY='test-only-mocked';
let mode='mixed',checks=0,requests=0;const eq=(a,b,label)=>{checks++;assert.deepEqual(a,b,label)},ok=(v,label)=>{checks++;assert.ok(v,label)};
const originalFetch=globalThis.fetch;globalThis.fetch=async url=>{if(!String(url).startsWith('https://places.googleapis.com/'))throw Error('External request blocked');requests++;let reviews=mode==='zero'?mixedReviews.slice(0,2):mode==='unrated'?[...mixedReviews,{text:'TEST FIXTURE: unrated feedback.',author:'QA unrated'}]:mixedReviews;return Response.json({...(mode==='no-aggregate'?{}:{rating:3.5,userRatingCount:4}),googleMapsUri:'https://www.google.com/maps?cid=028028',reviews:reviews.map(r=>({...r,text:{text:r.text},authorAttribution:{displayName:r.author},googleMapsUri:r.url}))})};
let server,browser;const report={states:[],screenshots:[]};
async function store(row,s){await runtime.env.DB.prepare('UPDATE tenants SET settings=?,published=? WHERE id=?').bind(JSON.stringify(s),JSON.stringify(s),row.id).run()}
const rows=originalRows.filter(({row})=>['roofing','hvac','patios'].includes(JSON.parse(row.settings).designKit));
try{
 for(const{row}of rows){const keys=Object.keys(row);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run()}
 server=await listen(runtime,8196);browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
 // Native HTML remains usable without any script at every required width/style.
 for(const width of [1440,768,390]){
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width,height:width===390?844:900}}),page=await context.newPage();
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  for(const{row}of rows)for(const style of styles)for(const variant of ['b','c']){
   const s=variantSettings(row,style,variant,true);s.minReviewRating=4;await store(row,s);const r=await page.goto(base+'/s/'+row.slug);eq(r.status(),200);
   eq(await page.locator('#home h1').count(),1);eq(await page.locator('#home video').count(),0,'Static installed poster is complete with JS off');ok(await page.locator('#home img').first().isVisible());
   eq(await page.locator('#contact form').count(),1);eq(await page.locator('#customer-reviews').isVisible(),false,'No fabricated/static filtered review proof');
   if(variant==='c'){const summary=page.locator('.sv-service-disclosure>summary').last();await summary.focus();await page.keyboard.press('Enter');ok(await summary.evaluate(el=>el.parentElement.open),'Native accordion works without JS');}
   eq(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0);
   report.states.push({kind:'no-js',kit:s.designKit,style,variant,width});console.log('no-js '+s.designKit+' '+style+' '+variant+' '+width);
  }
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'}),page=await context.newPage();await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 const{row}=rows.find(({row})=>JSON.parse(row.settings).designKit==='roofing');
 // Every layout receives the same backend filter. Full-source aggregates stay unchanged.
 for(const variant of ['a','b','c'])for(const minimum of ['all',3,4,5]){
  const s=variantSettings(row,'current',variant,true);s.minReviewRating=minimum;await store(row,s);mode='mixed';
  await page.goto(base+'/s/'+row.slug,{waitUntil:'networkidle'});await page.locator('#customer-reviews').scrollIntoViewIfNeeded();
  eq(await page.locator('.source-review-card').count(),minimum==='all'?4:6-minimum);
  const aggregate=await page.locator('.provider-rating-badge').innerText();ok(aggregate.includes('3.5 / 5')&&aggregate.includes('4 reviews'));
  const ratings=await page.locator('.source-review-card .review-stars').evaluateAll(es=>es.map(el=>Number(el.getAttribute('aria-label').split(' ')[0])));
  eq(ratings,minimum==='all'?[2,3,4,5]:[2,3,4,5].filter(x=>x>=minimum));
  report.states.push({kind:'filter',variant,minimum,displayed:ratings,average:3.5,totalCount:4});
 }
 for(const variant of ['a','b','c']){
  const s=variantSettings(row,'current',variant,true);s.minReviewRating=4;await store(row,s);mode='zero';await page.goto(base+'/s/'+row.slug,{waitUntil:'networkidle'});eq(await page.locator('#customer-reviews').count(),0,'Zero after filtering removes the section entirely');report.states.push({kind:'zero-filter',variant});
 }
 const s=variantSettings(row,'current','b',true);s.minReviewRating=4;await store(row,s);mode='unrated';await page.goto(base+'/s/'+row.slug,{waitUntil:'networkidle'});eq(await page.locator('.source-review-card').count(),2,'Unrated review excluded in browser');
 mode='no-aggregate';await page.reload({waitUntil:'networkidle'});eq(await page.locator('.provider-rating-badge').count(),0,'No full-source aggregate means no badge');
 // Compare actual legacy and current review DOM with the optional field absent.
 const legacyJS=execFileSync('git',['-c','safe.directory='+releaseRepoRoot,'-C',root,'show','17e35f0:public/reviews.js'],{encoding:'utf8'});mode='mixed';
 for(const minimum of [0,4]){
  const settings=variantSettings(row,'current','a',true);settings.reviews.minimum=minimum;await store(row,settings);
  await page.route('**/reviews.js',route=>route.fulfill({status:200,contentType:'text/javascript',body:legacyJS}));
  await page.goto(base+'/s/'+row.slug,{waitUntil:'networkidle'});await page.locator('#customer-reviews').scrollIntoViewIfNeeded();await page.locator('.source-review-card').first().waitFor();const before=await page.locator('#customer-reviews').innerHTML();
  await page.unroute('**/reviews.js');await page.reload({waitUntil:'networkidle'});await page.locator('#customer-reviews').scrollIntoViewIfNeeded();await page.locator('.source-review-card').first().waitFor();eq(await page.locator('#customer-reviews').innerHTML(),before,'Absent optional field has byte-identical populated review DOM');
 }
 // Real calculator transport is untouched by rearrangement.
 mode='mixed';for(const variant of ['b','c']){
  const settings=variantSettings(row,'current',variant,true);await store(row,settings);await page.goto(base+'/s/'+row.slug+'/financing',{waitUntil:'networkidle'});
  await page.locator('[name=amount]').fill('10000');await page.locator('.finance-recalculate').click();ok((await page.locator('[data-finance-result]').innerText()).includes('202.76'),'Approved APR/term calculation retained');
  await page.locator('#financing-options>summary').click();eq(await page.locator('.finance-option-link').count(),1);ok((await page.locator('.finance-options-body').innerText()).includes('Hearth'));report.states.push({kind:'calculator',variant});
 }
 // Submit each rearranged final CTA through the unchanged local inquiry endpoint.
 for(const variant of ['b','c']){
  const settings=variantSettings(row,'current',variant,true);await store(row,settings);
  await page.goto(base+'/s/'+row.slug,{waitUntil:'networkidle'});const form=page.locator('#lead-form');
  await form.locator('[name=name]').fill('QA section '+variant);
  await form.locator('[name=phone]').fill(variant==='b'?'8055550281':'8055550282');
  await form.locator('[name=service]').selectOption({index:1});
  await form.locator('[name=message]').fill('Local #028B fixture only; verify unchanged inquiry transport.');
  const city=form.locator('[name=projectCity]');if(await city.count()&&await city.getAttribute('type')!=='hidden')await city.fill('Ventura');
  await form.locator('[name=consent]').check();
  const response=page.waitForResponse(r=>r.url().endsWith('/inquiries')&&r.request().method()==='POST');
  await form.locator('button').click();eq((await response).status(),200,'Final CTA saves through the real local endpoint');await page.waitForURL('**/thank-you');ok(await page.locator('h1').isVisible());report.states.push({kind:'inquiry-submit',variant});
 }

 // Pending media stays a published poster through every financing variant.
 for(const variant of ['a','b','c']){
  const settings=variantSettings(row,'current',variant,true);settings.planningFilms={...settings.planningFilms,financingChapter:{...financingChapter,status:'Pending',clip:''}};await store(row,settings);await page.goto(base+'/s/'+row.slug+'/financing',{waitUntil:'networkidle'});
  eq(await page.locator('#roofing-planning video').count(),0);ok(await page.locator('#roofing-planning img').first().isVisible());ok(!(await page.locator('#roofing-planning').innerText()).includes('Pending'));report.states.push({kind:'pending-film',variant});
 }
 await context.close();
 // Three full homepages mixing independent choices, normal motion.
 for(const width of [1440,390]){
  const c=await browser.newContext({viewport:{width,height:width===390?844:900}}),p=await c.newPage();await c.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  for(const{row}of rows){
   const settings=variantSettings(row,'current','b',true);settings.minReviewRating=4;settings.sectionVariants={hero:'c',services:'b',process:'c',financing:'b',reviews:'c',finalCta:'b'};await store(row,settings);
   await p.goto(base+'/s/'+row.slug,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.locator('#customer-reviews').scrollIntoViewIfNeeded();await p.locator('.source-review-card').first().waitFor();await p.locator('#contact').scrollIntoViewIfNeeded();await p.evaluate(()=>scrollTo(0,0));const file='after/'+settings.designKit+'-mixed-home-'+width+'.png';await p.screenshot({path:out+'/'+file,fullPage:true});report.screenshots.push({kit:settings.designKit,width,file});eq(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0);
  }await c.close();
 }
 report.checks=checks;report.mockedProviderCalls=requests;report.actualProviderCalls=0;report.passed=true;fs.writeFileSync(out+'/checks/variants-fallbacks.json',JSON.stringify(report,null,2));console.log('PASS '+JSON.stringify({checks,states:report.states.length,screenshots:report.screenshots.length,mockedProviderCalls:requests,actualProviderCalls:0}));
}finally{globalThis.fetch=originalFetch;await browser?.close();if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}await runtime.close();}
