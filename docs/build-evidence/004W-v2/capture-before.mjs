import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {writeFileSync, unlinkSync} from 'node:fs';
import {join} from 'node:path';
import {createRequire} from 'node:module';
import {DEFAULT, ROBLES, settings} from '../../../src/core.js';
import {visibleServicePages} from '../../../src/service-registry.js';
import library from '../../../public/trade-library.json' with {type:'json'};

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root='C:/Users/joe/website_creator',out=join(root,'docs/build-evidence/004W-v2');
const temporary=join(root,'src/service-detail-before.mjs');
const temporaryCss=join(root,'public/service-detail-before.css');
const previous=execFileSync('git',['show','555f75f:src/service-detail.js'],{cwd:root,encoding:'utf8'});
const previousCss=execFileSync('git',['show','555f75f:public/service-detail.css'],{cwd:root,encoding:'utf8'});
writeFileSync(temporary,previous);
writeFileSync(temporaryCss,previousCss);
try{
 const {renderUniversalServicePage}=await import('../../../src/service-detail-before.mjs');
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  for(const [trade,slug,service] of [['Roofing','robles-roofing','Storm damage'],['HVAC','hvac-004w-v2','Ductwork'],['Patios','patios-004w-v2','Motorized pergolas']]){
   const s=trade==='Roofing'?settings({...ROBLES}):settings({...DEFAULT,name:trade+' Fixture',trade,phone:'8055550102',area:'Ventura',address:'Ventura, CA 93001',template:'editorial',designKit:trade.toLowerCase(),services:library[trade].map(name=>({name,description:''}))});
   const servicePage=visibleServicePages(s).find(item=>item.serviceName===service);
   assert.ok(servicePage,trade+' '+service);
   for(const [size,viewport] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}]]){
    const page=await browser.newPage({viewport,deviceScaleFactor:1});
    await page.goto('http://127.0.0.1:5173/s/robles-roofing/services/roof-repair',{waitUntil:'domcontentloaded'});
    const html=renderUniversalServicePage(s,servicePage,{slug,origin:'http://127.0.0.1:5173',photos:[],projects:[]}).replace('/service-detail.css','/service-detail-before.css');
    await page.setContent(html,{waitUntil:'load'});
    await page.locator('.sd-hero-art img').evaluate(image=>image.decode?.().catch(()=>{}));
    await page.screenshot({path:join(out,'before-'+trade.toLowerCase()+'-'+size+'-'+servicePage.slug+'.png'),fullPage:true});
    await page.close();
   }
  }
  console.log('PASS #004W-v2 before captures: second service for Roofing, HVAC, and Patios at desktop and phone.');
 }finally{await browser.close()}
}finally{unlinkSync(temporary);unlinkSync(temporaryCss)}
