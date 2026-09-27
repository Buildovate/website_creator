(()=>{
const header=document.querySelector('.shared-site-header,.tp-header,.cx-header,.site-header,body.cinematic>header');if(!header)return;
const menus=[...header.querySelectorAll('details')];
for(const more of header.querySelectorAll('.site-more')){more.open=false;more.dataset.navEnhanced='';}
const close=()=>menus.forEach(menu=>menu.open=false);
document.addEventListener('click',event=>{if(!header.contains(event.target))close();});
header.addEventListener('keydown',event=>{if(event.key==='Escape'){const menu=menus.find(menu=>menu.open&&menu.contains(document.activeElement))||menus.find(menu=>menu.open);close();menu?.querySelector('summary')?.focus();}});
const measure=()=>{const height=Math.ceil(header.getBoundingClientRect().height);document.documentElement.style.setProperty('--site-header-height',height+'px');};
measure();if('ResizeObserver'in window)new ResizeObserver(measure).observe(header);else addEventListener('resize',measure);
const revealHash=()=>{let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch{return}if(!target)return;measure();const bottom=header.getBoundingClientRect().bottom,top=target.getBoundingClientRect().top;if(top<bottom+16)target.scrollIntoView({block:'start',behavior:'instant'});};
addEventListener('hashchange',()=>requestAnimationFrame(revealHash));addEventListener('load',revealHash,{once:true});
document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link)return;const url=new URL(link.href,location.href);if(url.pathname===location.pathname&&url.search===location.search&&url.hash){close();requestAnimationFrame(revealHash);}});
})();
