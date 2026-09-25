import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createRuntime,listen} from '../../../src/aws/server.js';
import worker from '../../../dist/server/index.js';
import {roofingFixture} from '../../../tests/fixtures/roofing-journey.mjs';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='C:/Users/joe/website_creator/docs/build-evidence/014',base='http://127.0.0.1:8124';
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'inquiry-qa@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8124',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'inquiry-qa','oai-authenticated-user-email':'inquiry-qa@example.test'};
async function api(path,method='GET',value){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json()}
await api('/setup','POST',{});const fixture=structuredClone(roofingFixture);fixture.slug='fictional-inquiry-014';fixture.settings.name='Fictional Roofing Inquiry QA';fixture.settings.websitePages={version:1,pages:[{id:'repair-014',kind:'service',title:'Roof repair',serviceName:'Roof repair',slug:'roof-repair',enabled:true,scope:'Local fictional fixture for inquiry context verification.'}]};
let {tenant}=await api('/tenants','POST',fixture);await api('/tenants/'+tenant.id+'/publish','POST',{version:tenant.version,approved:true});
const server=await listen(runtime,8124),browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results={profiles:[],errors:[]};
try{
 for(const [view,width,height,phone]of[['desktop',1440,900,'8055550301'],['mobile',390,844,'8055550302']]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:view==='mobile'}),page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));let posted;
  page.on('request',r=>{if(r.url().endsWith('/inquiries')&&r.method()==='POST')posted=r.postDataJSON()});
  const path='/s/'+tenant.slug+'/services/roof-repair';await page.goto(base+path+'?utm_source=local-test#contact');const form=page.locator('#lead-form');await page.waitForFunction(()=>typeof document.querySelector('#lead-form')?.onsubmit==='function');await form.scrollIntoViewIfNeeded();
  await form.locator('[name=name]').fill('Local QA Homeowner');await form.locator('[name=phone]').fill(phone);await form.locator('[name=projectCity]').fill('Oxnard');await form.locator('[name=timeframe]').selectOption({label:'Within a month'});await form.locator('[name=message]').fill('Local test: inspect a leak above the porch.');await form.locator('[name=consent]').check();await form.locator('button[type=submit]').click();await page.waitForFunction(()=>{const t=document.querySelector('#lead-status')?.textContent;return t&&t!=='Saving your request…'});console.log('Form status',await page.locator('#lead-status').innerText());assert.match(await page.locator('#lead-status').innerText(),/has been saved/);
  assert.equal(posted.sourcePage,path);assert.equal(posted.message,'Local test: inspect a leak above the porch.');assert.equal(posted.service,'Roof repair');assert.equal(posted.projectCity,'Oxnard');
  const submitted={...posted};const detail=await api('/tenants/'+tenant.id),saved=detail.inquiries.find(r=>r.phone===phone);assert.ok(saved);for(const text of ['Service: Roof repair','Project city: Oxnard','Source page: '+path,'Preferred timing: Within a month',posted.message])assert.ok(saved.message.includes(text));assert.ok(!saved.message.includes('utm_source'));
  await form.screenshot({path:out+'/'+view+'-saved.png'});
  const before=detail.inquiries.length;const login=await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'inquiry-qa',email:'inquiry-qa@example.test'}});assert.equal(login.status(),200);await page.goto(base+path+'?preview=1');await form.scrollIntoViewIfNeeded();assert.equal(await form.locator('button[type=submit]').isDisabled(),true);await form.screenshot({path:out+'/'+view+'-preview-disabled.png'});
  // Even a direct fetch from the authenticated draft is blocked by its referrer.
  const status=await page.evaluate(async({slug,path})=>(await fetch('/api/public/'+slug+'/inquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Preview attempt',phone:'8055550399',consent:true,sourcePage:path})})).status,{slug:tenant.slug,path});assert.equal(status,403);assert.equal((await api('/tenants/'+tenant.id)).inquiries.length,before);
  results.profiles.push({view,width,height,posted:submitted,saved:{tenantId:saved.tenant_id,projectId:saved.project_id,message:saved.message},previewDisabled:true,previewDirectPostStatus:status,passed:true});console.log('PASS '+view+': actual service form → scoped inquiry, preview blocked');await context.close();
 }
 assert.deepEqual(results.errors,[]);writeFileSync(out+'/browser-results.json',JSON.stringify(results,null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));await runtime.close()}
