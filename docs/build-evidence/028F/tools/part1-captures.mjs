import fs from 'node:fs';import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createRuntime,listen} from '../../../../src/aws/server.js';
import worker from '../../../../dist/server/index.js';
import {mediaSamples} from '../../../../tests/fixtures/media-library.mjs';
const root='C:/Users/joe/website_creator',phase=process.argv.includes('--after')?'after':'before',out=root+'/docs/build-evidence/028F',base='http://127.0.0.1:8210';
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const runtime=await createRuntime({worker,env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'packet@example.test',APP_ORIGIN:base,LISTEN_HOST:'127.0.0.1',PORT:'8210'}});
const samples=mediaSamples(),report=[];let server,browser;
try{
 await worker.fetch(new Request(base+'/api/setup',{method:'POST',headers:{origin:base,'content-type':'application/json','oai-authenticated-user-id':'packet-admin','oai-authenticated-user-email':'packet@example.test'},body:'{}'}),runtime.env);
 for(const f of samples){const keys=Object.keys(f.row);await runtime.env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>f.row[k])).run()}
 server=await listen(runtime,8210);browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const context=await browser.newContext({extraHTTPHeaders:{'x-dev-user-id':'packet-admin','x-dev-user-email':'packet@example.test'},deviceScaleFactor:1});
 await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
 for(const f of samples)for(const width of [1440,390]){
 const page=await context.newPage();await page.setViewportSize({width,height:width===390?844:900});await page.goto(base+'/s/'+f.slug,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(400);
 const name=f.id+'-'+width;await page.screenshot({path:out+'/'+phase+'/'+name+'-hero.png'});
 const data=await page.evaluate(()=>({h1:document.querySelector('h1')?.textContent,intro:document.querySelector('.sv-hero-description,.story-lead,.kit-intro')?.textContent,videos:[...document.querySelectorAll('video')].map(v=>({html:v.outerHTML,controls:v.controls,muted:v.muted,loop:v.loop,inline:v.playsInline,poster:v.poster})),fixed:[...document.querySelectorAll('a,button')].filter(e=>/Ask about your project|Plan your project/i.test(e.textContent)).map(e=>({text:e.textContent,html:e.outerHTML,position:getComputedStyle(e).position,box:e.getBoundingClientRect().toJSON()}))}));
 const clip=page.locator('.cinematic-commercial video').first();if(await clip.count()){await clip.scrollIntoViewIfNeeded();await page.waitForTimeout(500);if(phase==='after'){await page.waitForFunction(()=>document.querySelector('.cinematic-commercial [data-ambient-frame]')?.dataset.ambientState==='playing');assert.equal(await clip.evaluate(v=>v.controls),false);assert.equal(await clip.evaluate(v=>v.muted&&v.loop&&v.playsInline),true);}await page.screenshot({path:out+'/'+phase+'/'+name+'-section-video.png'})}
 if(phase==='after'){await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(180);assert.equal(await clip.evaluate(v=>v.hasAttribute('src')),false,'Reduced motion removes the video source');assert.equal(await page.locator('.cinematic-commercial .commercial-poster').evaluate(e=>getComputedStyle(e).visibility), 'visible');await page.screenshot({path:out+'/'+phase+'/'+name+'-section-video-reduced.png'});}
 report.push({id:f.id,width,...data});await page.close();
 }
 fs.writeFileSync(out+'/checks/part1-'+phase+'.json',JSON.stringify(report,null,2));console.log(phase+': '+report.length+' fixture/viewport states captured');
}finally{await browser?.close();if(server)await new Promise(r=>server.close(r));await runtime.close()}
