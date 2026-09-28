/** Browser-only platform checks, never injected into contractor site frames. */
export function inspectPlatformControls(){
 const rgba=s=>{const n=s.match(/[\d.]+/g)?.map(Number)||[0,0,0,0];return n.length===3?[...n,1]:n};
 const over=(a,b)=>a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])).concat(1);
 const lum=c=>c.slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 const background=el=>{let chain=[],bg=[255,255,255,1];while(el){chain.unshift(el);el=el.parentElement}for(const e of chain)bg=over(rgba(getComputedStyle(e).backgroundColor),bg);return bg};
 const borders=[],targets=[];
 const dialog=document.querySelector('dialog[open]');
 for(const el of (dialog||document).querySelectorAll('a[href],button,input,select,textarea,summary,[role=button],[tabindex]')){
  const r=el.getBoundingClientRect(),s=getComputedStyle(el);if(!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})||r.width<=2||r.height<=2||el.closest('[hidden],[aria-hidden=true]')||s.clipPath!=='none')continue;
  const label=el.matches('input[type=radio],input[type=checkbox]')?el.closest('label'):null,hit=label?.getBoundingClientRect()||r;
  targets.push({tag:el.tagName,id:el.id,cls:el.className,text:(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,60),width:hit.width,height:hit.height,disabled:el.matches(':disabled'),tabIndex:el.tabIndex});
  for(const side of ['Top','Right','Bottom','Left']){const color=rgba(s['border'+side+'Color']);if(parseFloat(s['border'+side+'Width'])<1||color[3]===0||s['border'+side+'Style']==='none')continue;const bg=background(el.parentElement),fg=over(color,bg);borders.push({id:el.id,cls:el.className,tag:el.tagName,side,color:s['border'+side+'Color'],background:bg.slice(0,3),ratio:+ratio(fg,bg).toFixed(3),pass:ratio(fg,bg)>=3});}
 }
 return {borders,targets,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>({family:f.family,weight:f.weight,status:f.status})),bodyFont:getComputedStyle(document.body).fontFamily};
}
export async function inspectPlatformKeyboard(page){
 const setup=await page.evaluate(()=>{
  const root=document.querySelector('dialog[open]')||document.body,selector='a[href],button,input,select,textarea,summary,[tabindex]';
  const targets=[...root.querySelectorAll(selector)].filter(el=>el.tabIndex>=0&&!el.matches(':disabled')&&!el.closest('[hidden],[inert],[aria-hidden=true]')&&el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})&&el.getBoundingClientRect().width>2);
  const groups=new Map();for(const e of targets.filter(e=>e.matches('input[type=radio]')&&e.name)){const key=(e.form?.id||'')+e.name;const group=groups.get(key)||[];group.push(e);groups.set(key,group)}
  const expected=targets.filter(e=>!e.matches('input[type=radio]')||!e.name||(groups.get((e.form?.id||'')+e.name)?.find(x=>x.checked)||groups.get((e.form?.id||'')+e.name)?.[0])===e);
  expected.forEach((e,i)=>e.setAttribute('data-bv-qa-tab',String(i)));
  const frames=[...root.querySelectorAll('iframe')].map(e=>{const old=e.getAttribute('tabindex');e.dataset.bvQaFrame=old===null?'absent':old;e.tabIndex=-1;return true});
  const scroll={x:scrollX,y:scrollY};expected[0]?.focus({preventScroll:true});
  return {count:expected.length,dialog:root.tagName==='DIALOG',scroll,frames:frames.length,labels:expected.map(e=>(e.textContent||e.getAttribute('aria-label')||e.id||e.name||e.tagName).trim().slice(0,55))};
 });
 const seen=new Set(),rings=[],escapes=[];
 for(let i=0;i<setup.count*4+8;i++){
  await page.keyboard.press('Tab');
  const active=await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {index:e.getAttribute('data-bv-qa-tab'),tag:e.tagName,ring:parseFloat(s.outlineWidth)>=2&&s.outlineStyle!=='none',color:s.outlineColor,inside:!!e.closest('dialog[open]')}});
  if(active.index!==null){seen.add(Number(active.index));rings.push(active)}
  if(setup.dialog&&!active.inside)escapes.push(active);
  if(seen.size===setup.count&&(!setup.dialog||i>=setup.count))break;
 }
 await page.evaluate(({x,y})=>{for(const el of document.querySelectorAll('[data-bv-qa-tab]'))el.removeAttribute('data-bv-qa-tab');for(const frame of document.querySelectorAll('[data-bv-qa-frame]')){const old=frame.dataset.bvQaFrame;if(old==='absent')frame.removeAttribute('tabindex');else frame.setAttribute('tabindex',old);delete frame.dataset.bvQaFrame}document.activeElement?.blur();scrollTo(x,y)},setup.scroll);
 return {controls:setup.count,reached:seen.size,unreachable:setup.labels.filter((_,i)=>!seen.has(i)),focusFailures:rings.filter(r=>!r.ring),trapFailures:escapes,iframeContentsExcluded:setup.frames};
}
