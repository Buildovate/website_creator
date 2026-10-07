(()=>{
const header=document.querySelector('.shared-site-header,.tp-header,.cx-header,.site-header,body.cinematic>header');if(!header)return;
const fitNav=header.querySelector('[data-nav-fit]');let fitClose=()=>{};
if(fitNav){
 const fallback=fitNav.querySelector('.site-fit-fallback'),cta=fitNav.lastElementChild;
 const links=[...fitNav.querySelectorAll(':scope > a:not(:last-child)'),...fallback.querySelectorAll('a')];
 const overflow=document.createElement('div');overflow.className='site-fit-overflow';
 const trigger=document.createElement('button');trigger.type='button';trigger.className='site-fit-trigger';trigger.textContent='More';trigger.setAttribute('aria-expanded','false');
 const list=document.createElement('div');list.className='site-fit-links';list.id='site-fit-links';list.hidden=true;trigger.setAttribute('aria-controls',list.id);overflow.append(trigger,list);
 fallback.remove();fitNav.insertBefore(overflow,cta);cta.dataset.navCta='';fitNav.classList.add('site-nav-fit-ready');
 fitClose=()=>{list.hidden=true;trigger.setAttribute('aria-expanded','false');};
 trigger.addEventListener('click',()=>{const open=list.hidden;list.hidden=!open;trigger.setAttribute('aria-expanded',String(open));});
 trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();list.hidden=false;trigger.setAttribute('aria-expanded','true');list.querySelector('a')?.focus();}});
 overflow.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();fitClose();trigger.focus();}});
 document.addEventListener('click',event=>{if(!overflow.contains(event.target))fitClose();});
 const brand=header.querySelector('.kit-brand'),phone=header.querySelector('.site-mobile-menu');
 const outerWidth=element=>{const style=getComputedStyle(element);return element.getBoundingClientRect().width+(parseFloat(style.marginLeft)||0)+(parseFloat(style.marginRight)||0);};
 const brandWidth=()=>{
  const probe=brand.cloneNode(true);probe.setAttribute('aria-hidden','true');probe.tabIndex=-1;
  for(const [property,value]of Object.entries({position:'fixed',visibility:'hidden',width:'max-content','max-width':'none','min-width':'0',flex:'none','white-space':'nowrap',transform:'none'}))probe.style.setProperty(property,value,'important');
  const name=probe.querySelector('.site-brand-name');if(name)name.style.setProperty('white-space','nowrap','important');
  header.append(probe);try{return outerWidth(probe);}finally{probe.remove();}
 };
 let queued=false;
 const fit=()=>{
  if(!brand)return;
  const focused=document.activeElement,wasMenu=header.dataset.navMode!=='desktop';
  if(innerWidth<=720){header.dataset.navMode='menu';fitClose();return;}
  header.dataset.navMode='desktop';
  const fullBrand=brandWidth();header.style.setProperty('--site-brand-full-width',fullBrand+'px');
  fitClose();overflow.hidden=false;fitNav.insertBefore(overflow,cta);
  for(const link of links)fitNav.insertBefore(link,overflow);
  const headerStyle=getComputedStyle(header),gap=parseFloat(getComputedStyle(fitNav).columnGap)||0;
  const available=header.clientWidth-(parseFloat(headerStyle.paddingLeft)||0)-(parseFloat(headerStyle.paddingRight)||0)-fullBrand-(parseFloat(headerStyle.columnGap)||0);
  const widths=links.map(outerWidth),ctaWidth=outerWidth(cta),moreWidth=outerWidth(overflow);
  if(moreWidth+ctaWidth+gap>available){header.dataset.navMode='menu';if(fitNav.contains(focused))phone?.querySelector('summary')?.focus();return;}
  if(wasMenu&&phone)phone.open=false;
  const total=widths.reduce((sum,width)=>sum+width,0)+ctaWidth+gap*links.length;
  let count=links.length;
  if(total>available){let used=total+moreWidth+gap;while(count&&used>available){used-=widths[--count]+gap;}}
  for(const link of links.slice(count))list.append(link);
  if(count===links.length)overflow.remove();
  fitNav.dataset.visibleLinks=String(count);fitNav.dataset.overflowLinks=String(links.length-count);
  if(list.contains(focused)){list.hidden=false;trigger.setAttribute('aria-expanded','true');focused.focus();}
  else if(focused===trigger&&!overflow.isConnected)cta.focus();
 };
 const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fit();});};
 if(document.fonts?.status==='loading')document.fonts.ready.then(schedule);else fit();
 document.fonts?.addEventListener('loadingdone',schedule);addEventListener('resize',schedule);
 if('ResizeObserver'in window){const observer=new ResizeObserver(schedule);observer.observe(header);observer.observe(fitNav);if(brand)observer.observe(brand);}
}
const menus=[...header.querySelectorAll('details')];
for(const more of header.querySelectorAll('.site-more')){more.open=false;more.dataset.navEnhanced='';}
const close=()=>{menus.forEach(menu=>menu.open=false);fitClose();};
document.addEventListener('click',event=>{if(!header.contains(event.target))close();});
header.addEventListener('keydown',event=>{if(event.key==='Escape'){const menu=menus.find(menu=>menu.open&&menu.contains(document.activeElement))||menus.find(menu=>menu.open);close();menu?.querySelector('summary')?.focus();}});
const measure=()=>{const height=Math.ceil(header.getBoundingClientRect().height);document.documentElement.style.setProperty('--site-header-height',height+'px');};
measure();if('ResizeObserver'in window)new ResizeObserver(measure).observe(header);else addEventListener('resize',measure);
const revealHash=()=>{let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch{return}if(!target)return;measure();const bottom=header.getBoundingClientRect().bottom,top=target.getBoundingClientRect().top;if(top<bottom+16)target.scrollIntoView({block:'start',behavior:'instant'});};
addEventListener('hashchange',()=>requestAnimationFrame(revealHash));addEventListener('load',revealHash,{once:true});
document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link)return;const url=new URL(link.href,location.href);if(url.pathname===location.pathname&&url.search===location.search&&url.hash){close();requestAnimationFrame(revealHash);}});
})();
