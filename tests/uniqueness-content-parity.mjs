import{regenerate}from'../src/generation.js';
import fs from 'node:fs';import assert from 'node:assert/strict';import{createRequire}from'node:module';
import{showcasePage}from'../src/showcase.js';import{renderConstitutionPage}from'../src/constitution-pages.js';import{applySiteStyle}from'../src/site-style-render.js';import{originalRows,variantSettings,styles,sectionKeys,fullProvider}from'./fixtures/section-variants.mjs';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028C';
const{chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage();
await page.route('**/*',route=>route.abort());
const clientScript=fs.readFileSync(root+'/public/reviews.js','utf8');
async function hydrateReviewFacts(html,settings,slug){
 if(!settings.reviews.confirmed)return html;
 const section=html.match(/<section\b(?=[^>]*\bid="customer-reviews")[\s\S]*?<\/section>/)?.[0];
 assert.ok(section,'Configured review source has a section');
 const populated=await page.evaluate(async({section,script,provider})=>{
  document.body.innerHTML=section;
  delete window.IntersectionObserver;
  window.fetch=async()=>Response.json({providers:[provider],minimum:0});
  (0,eval)(script);
  for(let attempt=0;attempt<200&&document.querySelector('[data-review-status]')?.textContent.startsWith('Loading');attempt++)await new Promise(resolve=>setTimeout(resolve,5));
  return document.querySelector('#customer-reviews').outerHTML;
 },{section,script:clientScript,provider:fullProvider});
 const hydrated=html.replace(section,populated);
 assert.equal((hydrated.match(/class="source-review-card"/g)||[]).length,4,'Every populated parity fixture includes all four source review facts: '+populated.slice(-600));
 return hydrated;
}

function inventory({html,finance,settings}){
 const parse=s=>new DOMParser().parseFromString(s,'text/html'),home=parse(html),fin=parse(finance);
 const selectors={hero:'#home',services:'#services',process:'.roof-next-story,.kit-cta-band,.cx-process,.sv-process',financing:'#calculator',reviews:'#customer-reviews',finalCta:'#contact'};
 const normalize=s=>s.replace(/[↗↓→]/g,'').replace(/\s+/g,' ').trim();
 const text=el=>{const copy=el.cloneNode(true);copy.querySelectorAll('[aria-hidden=true],.mk-kinetic-visual').forEach(x=>x.remove());copy.querySelectorAll('br').forEach(x=>x.replaceWith(' '));return normalize(copy.textContent)};
 const unique=values=>[...new Set(values.filter(Boolean))].sort(),result={};
 for(const[name,selector]of Object.entries(selectors)){
  const el=(name==='financing'?fin:home).querySelector(selector);if(!el){result[name]=null;continue}
  const rawText=text(el),factText=[];
  if(name==='hero'){
   const heading=el.querySelector('h1');if(heading)factText.push(text(heading));
   const intro=el.querySelector('.story-description,.kit-intro,.cx-intro,.sv-hero-description');if(intro)factText.push(text(intro));
  }else{
   for(const node of el.querySelectorAll('h1,h2,h3,p,strong,label,summary,blockquote,figcaption,option,.review-author,.review-stars,.review-byline small,.provider-rating-badge span,.provider-attribution small')){
    if(node.closest('svg,[aria-hidden=true]')||/eyebrow|kicker/.test(node.className))continue;
    // An accordion summary is the service title; controls and their options stay separate facts.
    if(node.matches('summary')&&node.querySelector('svg')){factText.push(text(node));continue}
    const value=text(node);if(value)factText.push(value);
   }
  }
  const businessFacts=['name','owner','address','hours','license','experience','area','trade'].filter(k=>settings[k]&&rawText.includes(normalize(settings[k]))).map(k=>k+':'+normalize(settings[k]));
  const links=unique([...el.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')));
  const phones=links.filter(h=>h.startsWith('tel:'));
  const media=[...el.querySelectorAll('img,video,svg[role=img]')].filter(e=>e.matches('img,video')||!e.closest('a,button,summary'));
  const mediaSources=unique(media.flatMap(e=>[e.getAttribute('src'),e.getAttribute('poster')]).filter(Boolean));
  const controls=unique([...el.querySelectorAll('input,select,textarea,button')].filter(e=>e.matches('.ml-motion')||!e.closest('.story-chapters,.story-topline')).map(e=>JSON.stringify({tag:e.tagName,name:e.getAttribute('name'),type:e.getAttribute('type'),value:e.getAttribute('value'),placeholder:e.getAttribute('placeholder'),required:e.required||false})));
  result[name]={text:unique(factText),businessFacts:unique(businessFacts),links,phones,mediaPresent:media.length>0,mediaSources,controls};
 }
 return result;
}
const report={baseCommit:'4880c3b',cases:0,comparisons:0,failures:[],boundaries:[]};
function compare(a,b,label){
 for(const key of sectionKeys){
  report.comparisons++;const x=a[key],y=b[key];
  if(!x||!y){if(x!==y)report.failures.push({label,section:key,check:'presence',before:!!x,after:!!y});continue}
  for(const field of ['text','businessFacts','links','phones','mediaPresent','controls',...(key==='hero'?[]:['mediaSources'])])if(JSON.stringify(x[field])!==JSON.stringify(y[field]))report.failures.push({label,section:key,check:field,missing:Array.isArray(x[field])?x[field].filter(v=>!y[field].includes(v)):x[field],extra:Array.isArray(y[field])?y[field].filter(v=>!x[field].includes(v)):y[field]});
  if(y.mediaSources.some(src=>!x.mediaSources.includes(src)))report.failures.push({label,section:key,check:'unrecognized media',sources:y.mediaSources});
 }
}
try{
 for(const{row}of originalRows)for(const style of styles)for(const populated of [false,true]){
  const options={base:'/s/'+row.slug},settings=regenerate(variantSettings(row,style,'a',populated),'parity-'+row.id+'-'+style,row.slug);settings.sectionVariants=Object.fromEntries(sectionKeys.map(key=>[key,'a']));
  const source={html:await hydrateReviewFacts(applySiteStyle(showcasePage(settings,options),settings),settings,row.slug),finance:applySiteStyle(renderConstitutionPage(settings,{slug:row.slug,kind:'financing'}),settings),settings};
  const before=await page.evaluate(inventory,source);
  for(const variant of ['a','b','c']){
   const choice={...settings,sectionVariants:Object.fromEntries(sectionKeys.map(key=>[key,variant]))};
   const after=await page.evaluate(inventory,{html:await hydrateReviewFacts(applySiteStyle(showcasePage(choice,options),choice),choice,row.slug),finance:applySiteStyle(renderConstitutionPage(choice,{slug:row.slug,kind:'financing'}),choice),settings:choice});
   compare(before,after,[settings.designKit,style,populated,variant].join('/'));report.cases++;
  }
 }
 // Negative cases prove that omitted copy, phone, links and artwork fail this gate.
 const{row}=originalRows.find(({row})=>JSON.parse(row.settings).designKit==='hvac'),settings=variantSettings(row,'current','a',true);
 const original=await page.evaluate(inventory,{html:showcasePage(settings,{base:'/s/'+row.slug}),finance:renderConstitutionPage(settings,{slug:row.slug,kind:'financing'}),settings});
 for(const field of ['text','links','phones','mediaPresent']){
  const altered=structuredClone(original);altered.process[field]=field==='mediaPresent'?false:[];const start=report.failures.length,comparisons=report.comparisons;compare(original,altered,'negative-'+field);report.comparisons=comparisons;assert.ok(report.failures.length>start);report.failures.splice(start);report.boundaries.push({removed:field,rejected:true});
 }
 fs.writeFileSync(out+'/checks/generated-content-parity.json',JSON.stringify(report,null,2));
 fs.writeFileSync(out+'/checks/generated-content-parity.log',JSON.stringify({cases:report.cases,comparisons:report.comparisons,boundaries:report.boundaries.length,failures:report.failures.length})+'\n');
 console.log(JSON.stringify({cases:report.cases,comparisons:report.comparisons,boundaries:report.boundaries.length,failures:report.failures.length,firstFailures:report.failures.slice(0,12)},null,2));
 assert.deepEqual(report.failures,[]);
}finally{await browser.close()}
