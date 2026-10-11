import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';

const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/013';
const require=createRequire(root+'/package.json');
const {build}=require('esbuild');
const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');

mkdirSync(out,{recursive:true});
const built=await build({entryPoints:[root+'/src/site-polish.js'],bundle:true,format:'esm',platform:'node',write:false});
const {websiteFooter}=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].text).toString('base64'));
const css=readFileSync(root+'/public/site-polish.css','utf8')+'\n'+readFileSync(root+'/public/neighborhood.css','utf8');
const links={facebook:'facebook',instagram:'instagram',youtube:'youtube',tiktok:'tiktok',googleBusiness:'google-business',linkedin:'linkedin',xTwitter:'x-twitter',nextdoor:'nextdoor'};
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];
try{
 for(const [view,width,height] of [['desktop',1440,900],['mobile',390,844]])for(const state of ['enabled','disabled']){
  const socials=Object.fromEntries(Object.entries(links).map(([key,slug])=>[key,{enabled:state==='enabled'||!['googleBusiness','xTwitter'].includes(key),url:'https://example.test/'+slug}]));
  const s={name:'Fictional Roofing QA',trade:'Roofing',template:'clean',designKit:'roofing',color:'#90ba63',area:'Ventura County',phone:'805-555-0100',platform:{neighborhood:{enabled:false},footer:{socials}}};
  const footer=websiteFooter(s,'/s/fictional-roofing-qa',false);
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;background:#f3f4ef;color:#14211d;font:16px Arial,sans-serif}.qa-label{padding:20px 6vw;background:#e8efdf;color:#243a2a;font-weight:700;font-size:13px;letter-spacing:.08em}${css}</style></head><body><div class="qa-label">FICTIONAL LOCAL FOOTER QA · ${state.toUpperCase()}</div>${footer}</body></html>`;
  const page=await browser.newPage({viewport:{width,height}});await page.setContent(html);
  const anchors=page.locator('.footer-socials a'),expected=state==='enabled'?8:6;
  assert.equal(await anchors.count(),expected);
  for(const key of Object.keys(links)){
   const anchor=page.locator(`.footer-socials a[data-social-network="${key}"]`),shown=state==='enabled'||!['googleBusiness','xTwitter'].includes(key);
   assert.equal(await anchor.count(),shown?1:0,key+' '+state);
   if(shown){assert.match(await anchor.getAttribute('aria-label'),/profile \(opens a new tab\)/);assert.equal(await anchor.getAttribute('target'),'_blank');assert.match(await anchor.getAttribute('rel'),/noopener noreferrer/);assert.equal(await anchor.locator('svg').getAttribute('aria-hidden'),'true');assert.ok((await anchor.locator('svg').boundingBox()).width>0);}
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
  const file=`${view}-${state}.png`,iconFile=`${view}-${state}-icons.png`;
  await page.screenshot({path:path.join(out,file),fullPage:true});await page.locator('.footer-socials').screenshot({path:path.join(out,iconFile)});
  if(state==='enabled'){
   await page.locator('[data-social-network="xTwitter"]').focus();await page.keyboard.press('Tab');
   assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-social-network')),'nextdoor');
  }
  results.push({view,width,height,state,visibleNetworks:expected,noOverflow:true,keyboard:true,files:[file,iconFile]});
  console.log(`PASS ${view} ${state}: ${expected} labeled, keyboard-accessible profiles`);await page.close();
 }
 const qBuilt=await build({entryPoints:[root+'/src/client/workspace/questionnaire.ts'],bundle:true,format:'iife',globalName:'QuestionnaireQA',platform:'browser',write:false});
 const qCss=readFileSync(root+'/src/client/styles/app.css','utf8')+'\n'+readFileSync(root+'/src/client/styles/questionnaire.css','utf8');
 const page=await browser.newPage({viewport:{width:1100,height:900}});
 await page.setContent(`<html><head><style>${qCss}</style></head><body><main id="qa-root"></main></body></html>`);
 await page.addScriptTag({content:qBuilt.outputFiles[0].text});
 await page.evaluate(()=>{window.lastSaved=null;window.QuestionnaireQA.mountQuestionnaire(document.querySelector('#qa-root'),{settings:{name:'Fictional Roofing QA',trade:'Roofing',template:'clean',services:[{name:'Roof repair',description:'Discuss the concern.'}],platform:{neighborhood:{enabled:false}}},slug:'fictional-roofing-qa',photos:[],serviceLibrary:[],write:true,save:async value=>{window.lastSaved=value},dirty:()=>{}})});
 for(const key of ['googleBusiness','xTwitter']){assert.equal(await page.locator(`[name="social-${key}"]`).count(),1);assert.equal(await page.locator(`[name="social-url-${key}"]`).count(),1)}
 await page.locator('[name="social-url-googleBusiness"]').fill('https://example.test/google-business');await page.locator('[name="social-googleBusiness"]').check();
 await page.locator('[name="social-url-xTwitter"]').fill('https://example.test/x-twitter');await page.locator('[name="social-xTwitter"]').check();
 await page.getByRole('button',{name:'Save questionnaire'}).click();
 await page.waitForFunction(()=>window.lastSaved!==null);
 const saved=await page.evaluate(()=>window.lastSaved.platform.footer.socials);
 assert.equal(saved.googleBusiness.enabled,true);assert.equal(saved.googleBusiness.url,'https://example.test/google-business');
 assert.equal(saved.xTwitter.enabled,true);assert.equal(saved.xTwitter.url,'https://example.test/x-twitter');
 results.push({view:'questionnaire',newControls:2,savedNetworks:['googleBusiness','xTwitter']});
 console.log('PASS Questionnaire: both new toggles and URLs save to draft');await page.close();
}finally{await browser.close()}
writeFileSync(out+'/browser-results.json',JSON.stringify(results,null,2));
