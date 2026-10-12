import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createReviewCapture,REVIEW_BROWSER_ARGS} from '../src/aws/review-capture.js';
import {createAssets} from '../src/aws/s3.js';
import {watchPlatformConsole} from './helpers/platform-console.mjs';
const root=releaseRepoRoot,out=root+'/docs/build-evidence/028F',module='playwright';
const {chromium}=createRequire(import.meta.url)(module),launch=chromium.launch.bind(chromium),records=[],flush=[];
// Observe the real capture's normal page contexts, without changing their settings.
chromium.launch=async options=>{assert.deepEqual(options.args,REVIEW_BROWSER_ARGS);const browser=await launch(options);const newContext=browser.newContext.bind(browser);browser.newContext=async options=>{const context=await newContext(options);context.on('page',page=>flush.push(watchPlatformConsole(page,()=> 'negative-unused-preload-normal-page',records)));return context};return browser};
const summary=JSON.parse(fs.readFileSync(out+'/checks/qa-packets.json')),p=summary.packets[0],folder=out+'/packets/'+p.id+'/'+p.versionHash,packet=JSON.parse(fs.readFileSync(folder+'/packet.json')),source=JSON.parse(fs.readFileSync(folder+'/source.json'));
const first=packet.pages[0],asset='/assets/roofing.webp',html=fs.readFileSync(folder+'/'+first.file,'utf8');
assert.ok(!html.includes(asset),'The negative preload asset must not already appear on this page');
const assets=createAssets(root+'/dist/client');let observed=false;
const capture=createReviewCapture({browserModule:module,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE,onScreenshot:async({path})=>{if(observed||!path.startsWith('screenshots/'))return;const deadline=Date.now()+12000;while(Date.now()<deadline&&!records.some(r=>r.text.includes(asset)&&r.text.includes('was preloaded using link preload but not used'))){await new Promise(resolve=>setTimeout(resolve,100));}observed=true;}});
try{await capture({packet,pages:[{...first,html:html.replace('</head>','<link rel="preload" as="image" href="'+asset+'"></head>')}],source,reviewSnapshot:()=>packet.reviewSnapshot,fetch:path=>assets.fetch(new Request('http://review.local'+path))});for(const f of flush)await f();const warnings=records.filter(r=>r.text.includes(asset)&&r.text.includes('was preloaded using link preload but not used'));assert.ok(warnings.length>0,'A real unused preload must emit Chrome warning');assert.ok(warnings.every(r=>r.allowed===false));assert.ok(warnings.every(r=>r.viewport.width!==960),'Warning must come from a normal page capture');const gatePassed=records.every(r=>r.allowed);assert.equal(gatePassed,false,'Unchanged console gate must reject the negative fixture');fs.writeFileSync(out+'/checks/unused-preload-negative.json',JSON.stringify({passed:true,negativeFixtureConsoleGatePassed:gatePassed,normalPageWarnings:warnings,records,providerCalls:0},null,2));console.log('PASS: actual normal-page unused preload warning remains non-allowlisted and fails the console gate.');}finally{chromium.launch=launch;}
