import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createRuntime,listen} from '../../../../src/aws/server.js';
import worker from '../../../../dist/server/index.js';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='docs/build-evidence/057A',base='http://127.0.0.1:8137';fs.mkdirSync(out,{recursive:true});let checks=0;const check=(v,label)=>{assert.ok(v,label);checks++;};
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'domain-admin@example.test',LISTEN_HOST:'127.0.0.1',PORT:'8137',APP_ORIGIN:base,CUSTOM_DOMAIN_CNAME_TARGET:'sites.preview.website.buildovate.com',CLOUDFRONT_ALIAS_ZONE_ID:'Z2FDTNDATAQYW2',CUSTOM_DOMAIN_APEX_IPS:'',DOMAIN_CHECKS:{nameservers:async()=>['ns1.domaincontrol.com'],check:async()=>({ownership:'pending',www:false,bare:false,ssl:false,site:{ok:false}})}}});
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'domain-admin','oai-authenticated-user-email':'domain-admin@example.test'};
async function api(path,method='GET',value){const response=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value?JSON.stringify(value):undefined}),runtime.env);assert.equal(response.status,200,await response.clone().text());return response.json();}
let server,browser;const errors=[],screens=[],external=[];
try{
 await api('/setup','POST',{});const {tenant}=await api('/tenants','POST',{slug:'domain-wizard-qa',settings:{name:'Sample Fictional Domain Wizard Roofing',phone:'8054410199',trade:'Roofing',area:'Ventura'}});
 await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind('domain-owner',tenant.id,'domain-owner','owner@example.test','owner',new Date().toISOString()).run();
 server=await listen(runtime,8137);browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await context.route('**/*',route=>{if(!route.request().url().startsWith(base)){external.push(route.request().url());return route.abort();}return route.continue();});
 await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'domain-owner',email:'owner@example.test'}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});

 await page.locator('[data-platform-screen]').waitFor({state:'attached',timeout:20000});
 const states=[];
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:width===390?844:900});
  const controls=await page.locator('[data-section=domains]').evaluateAll(elements=>elements.map(el=>({outerHTML:el.outerHTML,parent:{tag:el.parentElement.tagName,id:el.parentElement.id,className:el.parentElement.className,outerHTML:el.parentElement.outerHTML},nav:el.closest('nav')?.outerHTML||null,visible:!!(el.getClientRects().length&&el.getBoundingClientRect().width&&el.getBoundingClientRect().height)&&getComputedStyle(el).visibility!=='hidden',rect:el.getBoundingClientRect().toJSON()})));
  states.push({width,height:width===390?844:900,controls});
 }
 fs.writeFileSync(out+'/domains-controls-diagnosis.json',JSON.stringify({states,errors,external,providerCalls:0},null,2));
 console.log(JSON.stringify(states.map(s=>({width:s.width,controls:s.controls.map(x=>({outerHTML:x.outerHTML,parentTag:x.parent.tag,parentClass:x.parent.className,visible:x.visible}))})),null,2));
}finally{await browser?.close();await new Promise(resolve=>server?server.close(resolve):resolve());await runtime.close();}
