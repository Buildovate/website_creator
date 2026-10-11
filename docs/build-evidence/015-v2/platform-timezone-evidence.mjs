import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createRuntime,listen} from '../../../src/aws/server.js';
import worker from '../../../dist/server/index.js';
import {roofingFixture} from '../../../tests/fixtures/roofing-journey.mjs';

const require=createRequire(import.meta.url),{chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='C:/Users/joe/website_creator/docs/build-evidence/015-v2',base='http://127.0.0.1:8127';
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'zone-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8127',APP_ORIGIN:base}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'zone-admin','oai-authenticated-user-email':'zone-admin@example.test'};
async function api(path,method='GET',value){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json()}
await api('/setup','POST',{});
const fixture=structuredClone(roofingFixture);fixture.slug='zone-platform-qa';fixture.settings.name='Fictional Roofing Zone QA';
const {tenant}=await api('/tenants','POST',fixture);
await runtime.env.DB.prepare('INSERT INTO members (id,tenant_id,user_id,email,role,active,created_at) VALUES (?,?,?,?,?,1,?)').bind(crypto.randomUUID(),tenant.id,'zone-owner','zone-owner@example.test','owner',new Date().toISOString()).run();
const server=await listen(runtime,8127),browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results={errors:[],checks:[]};
try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage();
 page.on('pageerror',error=>results.errors.push(error.message));
 await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'zone-owner',email:'zone-owner@example.test'}});
 await page.goto(base);await page.waitForSelector('[data-platform-screen]');await page.locator('[data-platform-screen]').selectOption('questionnaire');
 const field=page.locator('#questionnaire-form [name="business-time-zone"]');await field.waitFor();assert.equal(await field.inputValue(),'America/Los_Angeles');
 await field.fill('America/New_York');await page.locator('.platform-action-dock button').filter({hasText:'Save questionnaire'}).click();
 await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('Questionnaire saved'));
 const saved=await api('/tenants/'+tenant.id);assert.equal(saved.tenant.settings.platform.timeZone,'America/New_York');
 await page.reload();await page.waitForSelector('[data-platform-screen]');await page.locator('[data-platform-screen]').selectOption('questionnaire');
 const reopened=page.locator('#questionnaire-form [name="business-time-zone"]');assert.equal(await reopened.inputValue(),'America/New_York');
 await reopened.scrollIntoViewIfNeeded();await page.evaluate(()=>scrollBy(0,-150));
 const phone=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,fieldFont:getComputedStyle(document.querySelector('[name="business-time-zone"]')).fontSize,fieldHeight:document.querySelector('[name="business-time-zone"]').getBoundingClientRect().height}));
 assert.equal(phone.overflow,false);assert.ok(parseFloat(phone.fieldFont)>=16);assert.ok(phone.fieldHeight>=44);
 await page.screenshot({path:out+'/mobile-business-timezone-setting.png'});results.checks.push({view:'mobile',width:390,height:844,...phone,savedAndReopened:true});
 await page.setViewportSize({width:1440,height:900});await reopened.scrollIntoViewIfNeeded();await page.screenshot({path:out+'/desktop-business-timezone-setting.png'});results.checks.push({view:'desktop',width:1440,height:900,savedAndReopened:true});
 await context.close();assert.deepEqual(results.errors,[]);writeFileSync(out+'/platform-timezone-results.json',JSON.stringify(results,null,2));
 console.log('PASS platform questionnaire: business zone saves and reopens, phone field fits and remains readable, desktop capture');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));await runtime.close()}
