import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import sharp from 'sharp';
import {createRuntime,listen} from '../src/aws/server.js';
import worker from '../dist/server/index.js';
import {visibleServicePages} from '../src/service-registry.js';
import {DEFAULT} from '../src/core.js';
import {kitDefaults} from '../src/design-kits.js';
import library from '../public/trade-library.json' with {type:'json'};
import kits from '../public/design-kits.json' with {type:'json'};

const root=fileURLToPath(new URL('../',import.meta.url));process.chdir(root);
const mode=process.argv.includes('--before')?'before':'after';
const smoke=process.argv.includes('--smoke');
const routeFilter=process.env.PREVIEW_PAGE_FILTER||'';
const out=path.join(root,'docs/build-evidence/PREVIEW-REAL-PAGES');fs.mkdirSync(path.join(out,mode),{recursive:true});
const origin='http://127.0.0.1:8193',email='preview-pages@example.test',userId='preview-pages-admin';
const runtime=await createRuntime({env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:email,LISTEN_HOST:'127.0.0.1',APP_ORIGIN:origin,PORT:'8193'}});
const headers={origin,'content-type':'application/json','oai-authenticated-user-id':userId,'oai-authenticated-user-email':email};
assert.equal((await worker.fetch(new Request(origin+'/api/setup',{method:'POST',headers,body:'{}'}),runtime.env)).status,200);
const server=await listen(runtime,8193),browser=await chromium.launch({headless:true,executablePath:process.env.REVIEW_BROWSER_EXECUTABLE});
const results=[],errors=[],checks=[];
const check=(value,message)=>{assert.ok(value,message);checks.push(message)};
try{
 for(const kit of ['roofing','patios','landscaping'])for(const width of [1440,390]){
  const ctx=await browser.newContext({viewport:{width,height:width===390?844:900}});
  await ctx.request.post(origin+'/auth/local-session',{headers:{origin},data:{userId,email}});
  const page=await ctx.newPage();let current='';
  page.on('pageerror',e=>errors.push({page:current,error:e.message}));
  page.on('console',e=>{if(e.type()==='error')errors.push({page:current,error:e.text(),location:e.location()})});
  const s={...DEFAULT,...kitDefaults(kit,{name:'Sample',services:library[kits[kit].trade].map(name=>({name,description:''}))})};
  const routes=['services','services/'+visibleServicePages(s)[0].slug,'areas','areas/'+(mode==='before'?'north-ridge':'oxnard'),'about','reviews','faq','contact','financing','promotions','projects','before-after','legal','legal/privacy','legal/terms','blog','pricing'];
  for(const [index,route] of routes.entries()){
   if(routeFilter&&route!==routeFilter)continue;
   current=`${kit}-${width}-${String(index+1).padStart(2,'0')}-${route.replaceAll('/','-')}`;
   const response=await page.goto(origin+'/design-preview/'+kit+'/immersive/'+route,{waitUntil:'load'});
   check(response.status()===200,current+' 200');
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0&&r.width>0&&r.height>0}).map(img=>img.decode().catch(()=>{})))});
   if(!smoke)await page.screenshot({path:path.join(out,mode,current+'-first.png')});
   // Warm below-fold media through the actual page loading strategy.
   if(!smoke){await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,50))}scrollTo(0,0)});
   await page.waitForTimeout(150);
   await page.screenshot({path:path.join(out,mode,current+'-full.png'),fullPage:true});}
   const metrics=await page.evaluate(()=>({title:document.title,heading:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth-innerWidth,height:document.documentElement.scrollHeight}));
   results.push({name:current,kit,width,index,route,...metrics});
   if(mode==='after'){
    check(metrics.overflow<=1,current+' no horizontal overflow');
    check(await page.locator('[data-preview-chrome]').count()===1,current+' one preview note');
    check(await page.locator('main .core-sample,main .sample-tag,main .rs-sample').count()===0,current+' no Sample pills');
    const faded=await page.locator('main :is(h1,h2,h3,p,label,summary)').evaluateAll(nodes=>nodes.filter(node=>{
     if(!node.getClientRects().length)return false;
     for(let el=node;el&&el!==document.body;el=el.parentElement){const style=getComputedStyle(el);if(style.display==='none'||style.visibility==='hidden')return false;if(Number(style.opacity)<.999)return true}return false;
    }).map(node=>node.className+': '+node.textContent.trim().slice(0,70)));
    check(faded.length===0,current+' full-opacity text '+JSON.stringify(faded));
    check(await page.locator('form[data-preview="true"]').evaluateAll(forms=>forms.every(form=>[...form.querySelectorAll('button[type="submit"],button:not([type])')].every(button=>button.disabled))),current+' lead forms disabled');
    const composed=new URL(page.url());composed.pathname=composed.pathname.replace('/immersive','/editorial');composed.searchParams.set('font','editorial');composed.searchParams.set('palette','ocean');composed.searchParams.set('cards','soft');
    await page.goto(composed.href,{waitUntil:'load'});
    const composition=await page.evaluate(()=>({font:getComputedStyle(document.querySelector('h1')).fontFamily,accent:getComputedStyle(document.body).getPropertyValue('--accent').trim(),layout:document.body.classList.contains('layout-editorial')}));
    check(composition.font.includes('Georgia')&&composition.accent==='#295c70'&&composition.layout,current+' regeneration applies computed font, palette and layout');
    check(await page.locator('.shared-site-header a[href^="/design-preview/"]').evaluateAll(links=>links.every(link=>{const url=new URL(link.href);return url.pathname.includes('/editorial')&&url.searchParams.get('font')==='editorial'&&url.searchParams.get('palette')==='ocean'})),current+' navigation retains regenerated look');
   }
   console.log('CAPTURE '+mode+' '+current);
  }
  await ctx.close();
 }
 if(mode==='after'&&!routeFilter)for(const motion of ['reduce','no-js'])for(const kit of ['roofing','patios','landscaping'])for(const width of [1440,390]){
  const ctx=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:motion==='reduce'?'reduce':'no-preference',javaScriptEnabled:motion!=='no-js'});
  await ctx.request.post(origin+'/auth/local-session',{headers:{origin},data:{userId,email}});const page=await ctx.newPage();
  for(const route of ['services','about','faq','financing','promotions','areas/oxnard']){
   await page.goto(origin+'/design-preview/'+kit+'/studio/'+route,{waitUntil:'load'});
   check(await page.locator('h1').isVisible(),kit+' '+route+' '+motion+' '+width+' static heading');
   check(await page.locator('[data-reveal],[data-enter]').evaluateAll(nodes=>nodes.every(node=>getComputedStyle(node).opacity==='1')),kit+' '+route+' '+motion+' '+width+' static content');
  }await ctx.close();
 }
 if(mode==='after')check(errors.length===0,'No browser console or JavaScript errors');
}finally{
 const file=path.join(out,(smoke?'smoke':mode)+'-results.json');
 if(routeFilter&&fs.existsSync(file)){
  const previous=JSON.parse(fs.readFileSync(file));
  fs.writeFileSync(path.join(out,'followup-'+routeFilter.replaceAll('/','-')+'-results.json'),JSON.stringify({results,checks,errors},null,2));
  fs.writeFileSync(file,JSON.stringify({...previous,results:previous.results.map(row=>results.find(next=>next.name===row.name)||row),followup:{route:routeFilter,checks,errors}},null,2));
 }else fs.writeFileSync(file,JSON.stringify({results,checks,errors},null,2));
 await browser.close();await new Promise(r=>server.close(r));await runtime.close();
}
if(!smoke&&!routeFilter&&mode==='after'&&fs.existsSync(path.join(out,'before-results.json'))){
 const before=JSON.parse(fs.readFileSync(path.join(out,'before-results.json'))).results;
 const comparisons=path.join(out,'comparisons');fs.mkdirSync(comparisons,{recursive:true});sharp.cache(false);
 for(const result of results){
  const old=before.find(x=>x.kit===result.kit&&x.width===result.width&&x.index===result.index);
  if(!old)continue;
  const files=await Promise.all([['before',old],['after',result]].map(async([state,row])=>sharp(path.join(out,state,row.name+'-first.png')).resize({width:480}).png().toBuffer()));
  const height=(await sharp(files[0]).metadata()).height;
  await sharp({create:{width:960,height:height+36,channels:3,background:'#ffffff'}}).composite([{input:Buffer.from('<svg width="960" height="36"><rect width="960" height="36" fill="#172c28"/><text x="16" y="24" fill="white" font-family="Arial" font-size="16">BEFORE · '+result.kit+' · '+result.width+'</text><text x="496" y="24" fill="white" font-family="Arial" font-size="16">AFTER · '+result.route+'</text></svg>'),top:0,left:0},...files.map((input,i)=>({input,left:i*480,top:36}))]).png().toFile(path.join(comparisons,result.name+'.png'));
 }
 for(const kit of ['roofing','patios','landscaping'])for(const width of [1440,390]){
  const panels=await Promise.all(results.filter(row=>row.kit===kit&&row.width===width).map(row=>sharp(path.join(comparisons,row.name+'.png')).resize({width:480}).png().toBuffer()));
  const height=(await sharp(panels[0]).metadata()).height;
  await sharp({create:{width:1440,height:Math.ceil(panels.length/3)*height,channels:3,background:'#ffffff'}}).composite(panels.map((input,index)=>({input,left:index%3*480,top:Math.floor(index/3)*height}))).png().toFile(path.join(out,kit+'-'+width+'-contact-sheet.png'));
 }
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Preview real pages — before / after</title><style>body{font:16px/1.5 system-ui;margin:32px;background:#f4f2ea;color:#162d27}h1{margin-bottom:8px}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:24px}article{background:white;padding:16px}img{width:100%;height:auto}a{color:#244c60}nav{display:flex;gap:20px;flex-wrap:wrap;margin-block:24px}</style><h1>Preview real pages</h1><p>Before on the left; live-renderer preview on the right. Fictional sample contractors. Media unchanged.</p><nav>'+['roofing','patios','landscaping'].flatMap(kit=>[1440,390].map(width=>'<a href="'+kit+'-'+width+'-contact-sheet.png">'+kit+' · '+width+' contact sheet</a>')).join('')+'</nav><section>'+results.map(row=>'<article><h2>'+row.kit+' / '+row.width+' / '+row.route+'</h2><a href="comparisons/'+row.name+'.png"><img loading="lazy" src="comparisons/'+row.name+'.png" alt="Before and after '+row.route+'"></a><a href="after/'+row.name+'-full.png">Full page after</a></article>').join('')+'</section></html>');
}
console.log('PASS '+checks.length+' browser checks, '+results.length+' page captures, '+errors.length+' errors ('+mode+').');
