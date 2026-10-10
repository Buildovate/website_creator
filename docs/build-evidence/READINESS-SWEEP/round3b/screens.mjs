import fs from 'node:fs';import {createRequire} from 'node:module';
import {createRuntime,listen} from './snapshot/src/aws/server.js';
import {handleWebhook} from './snapshot/src/payments/webhook.js';
import {createHmac} from 'node:crypto';
import worker from './snapshot/dist/server/index.js';
import {roofingFixture} from './snapshot/tests/fixtures/roofing-journey.mjs';
import assert from 'node:assert/strict';
const out='C:/Users/joe/website_creator/docs/build-evidence/READINESS-SWEEP/round3b',root=out+'/snapshot',base='http://127.0.0.1:5337';
fs.mkdirSync(out+'/screenshots',{recursive:true});
const runtime=await createRuntime({env:{APP_ENV:'local',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'readiness-admin@example.test',PORT:'5337',LISTEN_HOST:'127.0.0.1',APP_ORIGIN:base,ASSETS_ROOT:root+'/dist/client'}});
runtime.env.REVIEW_ISOLATED=true;
const headers={origin:base,'content-type':'application/json','oai-authenticated-user-id':'readiness-admin','oai-authenticated-user-email':'readiness-admin@example.test'};
async function api(path,method='GET',value){const r=await worker.fetch(new Request(base+'/api'+path,{method,headers,body:value===undefined?undefined:JSON.stringify(value)}),runtime.env);assert.equal(r.status,200,await r.clone().text());return r.json();}
let browser,server;const images=[];
try{
 await api('/setup','POST',{});const f=structuredClone(roofingFixture);f.slug='readiness-screens';f.settings.name='Roofing · QA test fixture';const {tenant}=await api('/tenants','POST',f);
 await runtime.env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind('qa-owner',tenant.id,'qa-owner','owner@example.test','owner',new Date().toISOString()).run();
 // Fictional publication fixture; this is not a product publish bypass.
 await runtime.env.DB.prepare("UPDATE tenants SET published=settings,status='published' WHERE id=?").bind(tenant.id).run();
 server=await listen(runtime,5337);const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:900}});await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 await context.request.post(base+'/auth/local-session',{headers:{origin:base},data:{userId:'qa-owner',email:'owner@example.test'}});const page=await context.newPage();
 async function open(section,width){await page.setViewportSize({width,height:width===390?844:900});await page.goto(base);await page.locator('.bv-game').waitFor({state:'visible'});const skip=page.getByRole('button',{name:'Skip tour',exact:true});if(await skip.isVisible())await skip.click();if(width===390){await page.locator('[data-game-phone=settings]').click();await page.locator('[data-game-setting='+section+']').click();}else{await page.locator('[data-game-quest='+(section==='business'?'onboarding':'launch')+']').click();await page.locator('[data-game-open='+section+']').click();}await page.locator('.bv-game-section-shell').waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>scrollTo(0,0));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 async function shot(state,width){if(width===390&&state.startsWith('billing-'))await page.getByRole('heading',{name:'Payment method',exact:true}).locator('..').scrollIntoViewIfNeeded();const name=state+'-'+width+'.png';await page.screenshot({path:out+'/screenshots/'+name,animations:'disabled'});images.push({name,state,width,path:out+'/screenshots/'+name});}
 for(const width of [1440,390]){await open('billing',width);await page.locator('.bv-billing').waitFor();await shot('billing-not-connected',width);}
 runtime.env.STRIPE_WEBHOOK_SECRET='whsec_offline_fixture';runtime.env.STRIPE_SECRET_KEY='sk_test_offline_fixture';runtime.env.STRIPE_PUBLISHABLE_KEY='pk_test_offline_fixture';runtime.env.PAYMENT_BILLING_ADAPTER={portal:async()=>({url:'https://billing.stripe.com/p/never-opened-local-fixture'})};
 async function event(id,type,object){const t=Math.floor(Date.now()/1000),raw=JSON.stringify({id,type,created:t,data:{object}}),sig=createHmac('sha256',runtime.env.STRIPE_WEBHOOK_SECRET).update(t+'.'+raw).digest('hex');const r=await handleWebhook(new Request(base+'/api/payments/webhook',{method:'POST',headers:{'stripe-signature':'t='+t+',v1='+sig},body:raw}),runtime.env);assert.equal(r.status,200,await r.clone().text());}
 await event('ownership','checkout.session.completed',{id:'cs_fixture',mode:'payment',payment_status:'paid',amount_total:150000,payment_intent:'pi_fixture',customer:'cus_fixture',metadata:{tenantId:tenant.id,skus:'SITE-OWN'}});
 for(const width of [1440,390]){await open('billing',width);await page.locator('[data-bv-portal]').waitFor({state:'visible'});await shot('billing-portal-ready',width);await open('business',width);assert.equal(await page.locator('[data-action=download-site]').count(),1);await shot('owner-download-paid',width);}
 await event('refund','charge.refunded',{id:'ch_fixture',payment_intent:'pi_fixture'});
 for(const width of [1440,390]){await open('business',width);assert.equal(await page.locator('[data-action=download-site]').count(),0);await shot('owner-download-refunded',width);}
 fs.writeFileSync(out+'/screenshots.json',JSON.stringify({images,fixture:'Fictional local PostgreSQL tenant; no actual purchase, refund, provider calls or outbound navigation.',providerCalls:0},null,2));console.log(JSON.stringify({screenshots:images.length,providerCalls:0}));
}finally{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));await runtime.close();}
