import {openGameSection,mockGameBoard} from './helpers/game-navigation.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
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
 await openGameSection(page,'domains');
 await page.locator('[data-domain-form]').waitFor();await page.locator('[data-domain-form] [name=hostname]').fill('contractor.example');
 for(const [provider,method] of [['Route 53','alias'],['Cloudflare','flatten'],['GoDaddy','forward']]){
 await page.locator('[data-domain-form] [name=provider]').selectOption(provider);await page.locator('[data-domain-form] button').click();await page.locator('.bv-domain-instructions h2').filter({hasText:provider}).waitFor();
 for(const width of [1440,390]){
 await page.setViewportSize({width,height:width===390?844:900});if(width===390){await openGameSection(page,'launchpad');await openGameSection(page,'domains');await page.locator('.bv-domain-instructions').waitFor({state:'visible'});}await page.locator('.bv-domain-instructions').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/'+method+'-'+width+'.png',fullPage:true});screens.push(method+'-'+width+'.png');
 check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),method+' no overflow '+width);
 const targets=await page.locator('.bv-domain button').evaluateAll(nodes=>nodes.filter(x=>x.getBoundingClientRect().width>0).every(x=>x.getBoundingClientRect().height>=44));check(targets,method+' touch targets '+width);
 check(!/\bA records?\b/.test(await page.locator('.bv-domain-instructions').innerText()),'no A text '+width);
 }
 }
 await page.locator('[data-domain-approve]').check();await page.locator('[data-domain-added]').click();await page.locator('[data-domain-message]').filter({hasText:'Records marked added'}).waitFor();
 check((await page.locator('.bv-domain-status').innerText()).includes('Waiting'),'pending status');
 await page.locator('[data-domain-check]').focus();await page.keyboard.press('Enter');await page.locator('[data-domain-message]').filter({hasText:'Check finished'}).waitFor();checks++;
 const jsOff=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});await jsOff.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'domain-owner',email:'owner@example.test'}});const plain=await jsOff.newPage();await plain.goto(base+'/domain-guide/'+tenant.id,{waitUntil:'domcontentloaded',timeout:15000});check(await plain.locator('.bv-domain-instructions').isVisible(),'no-JS saved instructions');await plain.screenshot({path:out+'/no-js-390.png',fullPage:true});await jsOff.close();
 check(errors.length===0,'browser errors '+errors.join(', '));check(external.length===0,'no external requests '+external.join(', '));
 fs.writeFileSync(out+'/browser-results.json',JSON.stringify({result:'PASS',checks,screens,errors,external,providerCalls:0},null,2));console.log('PASS domain browser: '+checks+' checks, 6 method screenshots + no-JS; zero provider calls.');
}finally{await browser?.close();await new Promise(resolve=>server?server.close(resolve):resolve());await runtime.close();}
