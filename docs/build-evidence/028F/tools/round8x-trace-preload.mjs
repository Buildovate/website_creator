import fs from 'node:fs';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const file='C:/Users/joe/website_creator/docs/build-evidence/028F/checks/round8x-trace-run'+process.env.BV_TRACE_RUN+'-live.json',captures=[];
function traceInit(){
 const trace=window.__round8x={url:location.href,shifts:[],history:[],fontsReadyAtMs:null,events:[],paint:[]};
 const state=()=>{const header=document.querySelector('.shared-site-header'),r=header?.getBoundingClientRect(),brand=header?.querySelector('.site-brand-name'),b=brand?.getBoundingClientRect(),style=brand?getComputedStyle(brand):null;return {atMs:performance.now(),fontsStatus:document.fonts.status,fontFaces:[...document.fonts].map(f=>({family:f.family,status:f.status})),brand:brand?{text:brand.textContent,width:b.width,height:b.height,fontFamily:style.fontFamily,fontSize:style.fontSize,lineHeight:style.lineHeight}:null,headerNavMode:header?.getAttribute('data-nav-mode')||null,navFitReady:!!header?.querySelector('.site-nav-fit-ready'),headerHeight:r?.height??null,headerHeightVariable:document.documentElement?getComputedStyle(document.documentElement).getPropertyValue('--site-header-height').trim():''};};
 const sample=()=>{const next=state(),last=trace.history.at(-1);if(!last||['fontsStatus','headerNavMode','navFitReady','headerHeight','headerHeightVariable'].some(k=>next[k]!==last[k])||JSON.stringify(next.fontFaces)!==JSON.stringify(last.fontFaces))trace.history.push(next);};
 sample();
 document.fonts.ready.then(()=>{trace.fontsReadyAtMs=performance.now();sample()});
 document.fonts.addEventListener('loading',()=>{trace.fontsReadyAtMs=null;sample()});
 document.fonts.addEventListener('loadingdone',()=>{trace.fontsReadyAtMs=performance.now();sample()});
 const mutations=new MutationObserver(records=>{if(records.some(r=>r.target===document.documentElement||r.target.closest?.('.shared-site-header')))sample()});mutations.observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','data-nav-mode']});
 let resize;
 const onDOM=()=>{sample();const header=document.querySelector('.shared-site-header');if(header){resize=new ResizeObserver(sample);resize.observe(header)}let until=performance.now()+2000;const tick=()=>{sample();if(performance.now()<until)requestAnimationFrame(tick)};requestAnimationFrame(tick)};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onDOM,{once:true});else onDOM();
 new PerformanceObserver(list=>{for(const e of list.getEntries()){
  if(e.hadRecentInput)continue;
  const current=state(),before=trace.history.filter(s=>s.atMs<=e.startTime).at(-1)||null;
  const posters=[...document.querySelectorAll('.planning-scroll-photo img,img')].filter(img=>{const r=img.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight}).map(img=>({currentSrc:img.currentSrc,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,width:img.getBoundingClientRect().width,height:img.getBoundingClientRect().height,inStory:!!img.closest('.planning-scroll')}));
  trace.shifts.push({value:e.value,timeSinceNavigationMs:e.startTime,observedAtMs:performance.now(),sources:e.sources.map(s=>({html:s.node?.outerHTML?.slice(0,500),inStory:!!s.node?.closest?.('.planning-scroll'),previous:s.previousRect.toJSON(),current:s.currentRect.toJSON()})),settledAtShift:{fonts:document.fonts.status==='loaded'&&trace.fontsReadyAtMs!==null&&trace.fontsReadyAtMs<=e.startTime,fontsReadyAtMs:trace.fontsReadyAtMs,posters:posters.every(img=>img.complete&&img.naturalWidth>0),posterImages:posters,headerNavMode:current.headerNavMode,headerNavModeUnchangedSincePreviousSample:!!before&&before.headerNavMode===current.headerNavMode,headerHeightVariable:current.headerHeightVariable,headerHeightVariableUnchangedSincePreviousSample:!!before&&before.headerHeightVariable===current.headerHeightVariable,headerHeight:current.headerHeight,previousSnapshot:before,observedSnapshot:current}});
  sample();
 }}).observe({type:'layout-shift',buffered:true});
 new PerformanceObserver(list=>trace.paint.push(...list.getEntries().map(e=>({name:e.name,atMs:e.startTime})))).observe({type:'paint',buffered:true});
}
const launch=chromium.launch.bind(chromium);
chromium.launch=async(...args)=>{
 const browser=await launch(...args),newContext=browser.newContext.bind(browser);
 browser.newContext=async(...args)=>{
  const context=await newContext(...args),newPage=context.newPage.bind(context);
  context.newPage=async(...args)=>{
   const page=await newPage(...args),init=page.addInitScript.bind(page),evaluate=page.evaluate.bind(page);
   page.addInitScript=async(script,...rest)=>{if(typeof script==='function'&&script.toString().includes('window.__shiftDetails'))await init(traceInit);return init(script,...rest)};
   page.evaluate=async(script,...rest)=>{
    const value=await evaluate(script,...rest);
    if(typeof script==='function'&&script.toString().trim()==='()=>window.__shiftDetails'){
     const trace=await evaluate(()=>({trace:window.__round8x,cls:window.__shifts?.reduce((a,b)=>a+b,0),url:location.href,width:innerWidth,height:innerHeight}));
     captures.push({...trace,detectorDetails:value});fs.writeFileSync(file,JSON.stringify({run:Number(process.env.BV_TRACE_RUN),captures},null,2));
    }
    return value;
   };
   return page;
  };
  return context;
 };
 return browser;
};
