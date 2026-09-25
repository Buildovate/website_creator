const {chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/004I-v4',baseline=process.argv.includes('--baseline'),base='http://127.0.0.1:8123';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),results={baseline,profiles:[],errors:[]};
try{for(const [view,width,height]of[['desktop',1440,900],['mobile',390,844]])for(const style of ['bold-industrial','clean-modern'])for(const variant of ['A','B','C']){

const name=`${view}-${style}-${variant}`,context=await browser.newContext({viewport:{width,height},hasTouch:view==='mobile'}),page=await context.newPage();
await page.addInitScript(()=>{window.decodedPhotos=new WeakSet();window.trustChanges=[];const decode=HTMLImageElement.prototype.decode;HTMLImageElement.prototype.decode=async function(){await decode.call(this);if(this.closest('.mk-stats-photo')){await new Promise(r=>setTimeout(r,350));window.decodedPhotos.add(this)}};new MutationObserver(()=>{for(const key of ['rating','reviews']){const el=document.querySelector(`[data-stat-key="${key}"] strong`);if(el){const value=el.textContent.trim();if(value!==(key==='rating'?'4.9 / 5':'212'))window.trustChanges.push({key,value,time:performance.now()})}}}).observe(document,{childList:true,subtree:true,characterData:true})});
page.on('pageerror',e=>results.errors.push({name,error:e.message}));
await page.goto(`${base}/s/motion-${style}-${variant.toLowerCase()}`);await page.locator('[data-sticky-stack]').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('[data-sticky-stack]').classList.contains('mk-stack-ready'));
const result=await page.evaluate(async()=>{
const root=document.querySelector('[data-sticky-stack]'),nav=root.querySelector('.mk-stack-index'),slots=[...root.querySelectorAll('[data-stack-card]')],header=document.querySelector('.cx-header'),stats=document.querySelector('[data-stats-mask]'),failures=[],samples=[];
const opacity=el=>{let v=1;for(let n=el;n instanceof Element;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')return 0;v*=Number(s.opacity)}return v};
const box=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
const intersects=(a,b)=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;
const add=(kind,data)=>{if(failures.filter(f=>f.kind===kind).length<8)failures.push({kind,...data})};
const start=root.getBoundingClientRect().top+scrollY-header.offsetHeight-25,end=stats.getBoundingClientRect().bottom+scrollY-innerHeight*.55;
let initialTabs,initialImages;
function sample(t){const hb=box(header),nb=box(nav),obstacles=[hb,nb],bottom=document.querySelector('.cx-mobile-action')?.getBoundingClientRect().top||innerHeight,viewport={left:0,right:innerWidth,top:hb.bottom,bottom:Math.min(innerHeight,bottom>0?bottom:innerHeight)};
const note=root.querySelector('.mk-stack-outro'),notebox=note&&box(note),cards=slots.map((slot,i)=>{const card=slot.querySelector('.mk-stack-card'),r=box(card),o=opacity(card),heading=card.querySelector('h3'),paragraph=card.querySelector('.mk-stack-copy p'),img=card.querySelector('img'),ir=box(img);let textVisible=false;
for(const el of [heading,paragraph]){const b=box(el);if(opacity(el)>.1&&intersects(b,viewport)){textVisible=true;for(const obstacle of obstacles)if(intersects(b,obstacle))add('text-edge',{i,text:el.textContent,top:b.top,bottom:b.bottom,edge:obstacle.bottom})}}
if(o>.1&&notebox&&intersects(r,notebox))add('step-note',{i});
const visibleHeight=Math.max(0,Math.min(r.bottom,viewport.bottom)-Math.max(r.top,Math.max(hb.bottom,innerWidth<=700||root.dataset.variant==='C'?nb.bottom:hb.bottom)));
const imageVisible=opacity(img)>.1&&Math.min(ir.bottom,viewport.bottom)-Math.max(ir.top,Math.max(hb.bottom,innerWidth<=700||root.dataset.variant==='C'?nb.bottom:hb.bottom))>24;
if(o>.1&&visibleHeight>5&&!textVisible&&!imageVisible)add('empty-shell',{i,visibleHeight});
if(o>.1&&visibleHeight>30&&ir.height<100)add('collapsed-image',{i,height:ir.height});
return {i,opacity:o,rect:r,visibleHeight,score:o*Math.max(0,Math.min(r.bottom,viewport.bottom)-Math.max(r.top,Math.max(hb.bottom,nb.bottom)))};
});
const stage=root.querySelector('.mk-stack-cards'),track=root.querySelector('.mk-stack-track'),sb=box(stage),pin=parseFloat(root.style.getPropertyValue('--stack-pin'))||hb.bottom,peak=Math.max(...cards.map(c=>c.opacity));
const pinned=Math.abs(sb.top-pin)<2&&box(track).top<=pin+1,navPinned=opacity(nav)>.1&&Math.abs(nb.top-parseFloat(getComputedStyle(nav).top))<2&&nb.top>=hb.bottom-1;
if(pinned&&peak<.6-1e-5)add('blank-stage',{peak});
if(navPinned&&peak<.6-1e-5)add('empty-pinned-tabs',{peak});
if(pinned){const visibleCard=cards.slice().sort((a,b)=>b.opacity-a.opacity)[0],gap=viewport.bottom-visibleCard.rect.bottom;if(gap>80)add('stage-gap',{gap});const heights=slots.map(s=>s.querySelector('.mk-stack-card').offsetHeight);if(Math.max(...heights)-Math.min(...heights)>4)add('card-height',{heights});const inside=sb.bottom-visibleCard.rect.bottom;if(inside>80)add('stage-inner-gap',{gap:inside});}
for(let a=0;a<slots.length;a++)for(let b=a+1;b<slots.length;b++)for(const ta of slots[a].querySelectorAll('h3,.mk-stack-copy p'))for(const tb of slots[b].querySelectorAll('h3,.mk-stack-copy p'))if(opacity(ta)>.1&&opacity(tb)>.1&&intersects(box(ta),box(tb))&&intersects(box(ta),viewport))add('double-text',{a,b});
const full=cards.filter(c=>c.opacity>.1&&c.rect.top>=hb.bottom-1&&c.visibleHeight>100).sort((a,b)=>b.score-a.score)[0];
const links=[...nav.querySelectorAll('a')],xs=links.map(l=>box(l).left),active=links.findIndex(l=>l.getAttribute('aria-current')==='step');
if(full){if(!initialTabs)initialTabs=xs;if(xs.some((x,i)=>Math.abs(x-initialTabs[i])>1))add('tab-shift',{xs,initialTabs});if(active!==full.i)add('active-tab',{expected:full.i,active});const a=links[active],s=a&&getComputedStyle(a);if(!a||!((parseFloat(s.borderLeftWidth)>=2&&s.borderLeftColor!==getComputedStyle(nav).backgroundColor)||s.backgroundColor!=='rgba(0, 0, 0, 0)'))add('missing-indicator',{active});}
const photo=stats.querySelector('.mk-stats-photo'),image=photo.querySelector('img'),pr=box(photo);if(opacity(photo)>.1&&intersects(pr,viewport)&&!window.decodedPhotos.has(image))add('undecoded-photo',{complete:image.complete,naturalWidth:image.naturalWidth});
samples.push({time:t,scroll:scrollY,cards:cards.map(({i,opacity,rect})=>({i,opacity,top:rect.top,bottom:rect.bottom})),active});}
scrollTo(0,start);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
for(const [a,b]of[[start,end],[end,start],[start,end]]){await new Promise(resolve=>{const begin=performance.now();function tick(t){const p=Math.min(1,(t-begin)/4500);sample(t);scrollTo(0,a+(b-a)*p);if(p<1)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)})}
const intervals=samples.slice(1).map((s,i)=>s.time-samples[i].time),duration=(samples.at(-1).time-samples[0].time)/1000;
return {samples,failures,trustChanges:window.trustChanges,sampleHz:samples.length/duration,maxSampleGapMs:Math.max(...intervals),notes:root.querySelectorAll('.mk-stack-outro').length,finalStats:[...stats.querySelectorAll('[data-stats-number]')].map(n=>n.textContent)};
});
fs.writeFileSync(`${out}/${baseline?'baseline-':''}${name}-samples.json`,JSON.stringify(result,null,2));
if(!baseline){assert.ok(result.sampleHz>=30,name+' minimum 30 Hz');assert.ok(result.maxSampleGapMs<=100,name+' no >100 ms sampling gaps');assert.deepEqual(result.failures,[],name+' frame geometry/decode');assert.deepEqual(result.trustChanges,[],name+' final rating/review text');assert.equal(result.notes,0,name+' no repeated step note');}
results.profiles.push({name,samples:result.samples.length,sampleHz:result.sampleHz,maxSampleGapMs:result.maxSampleGapMs,failures:result.failures,trustChanges:result.trustChanges.length,passed:!result.failures.length&&!result.trustChanges.length&&!result.notes});console.log(JSON.stringify(results.profiles.at(-1)));await context.close();
}
fs.writeFileSync(out+'/'+(baseline?'baseline-results':'sampled-results')+'.json',JSON.stringify(results,null,2));if(baseline)assert.ok(results.profiles.some(p=>!p.passed),'New checks must fail on 856ec47');else assert.deepEqual(results.errors,[]);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
