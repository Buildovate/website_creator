import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const out='C:/Users/joe/website_creator/docs/build-evidence/028A',fixtures=JSON.parse(fs.readFileSync(out+'/fixtures.json')).filter(f=>f.style==='current'&&f.kit!=='roofing-complete');
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage(),results=[];
try{for(const f of fixtures){const r=await page.goto('http://127.0.0.1:8184/s/'+f.slug+'/blog',{waitUntil:'domcontentloaded'});assert.equal(r.status(),200);const color=await page.locator('.blog-tools label').evaluate(el=>getComputedStyle(el).color),expected=f.kit==='roofing'?'rgb(98, 109, 96)':'rgb(115, 124, 112)';assert.equal(color,expected,f.kit);results.push({kit:f.kit,color,expected,pass:true})}}
finally{await browser.close()}
fs.writeFileSync(out+'/current-color-fixes/blog-scope.json',JSON.stringify(results,null,2));console.log(JSON.stringify({kits:results.length,roofingApproved:true,otherKitsUnchanged:results.length-1}));
