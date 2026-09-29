(()=>{
 const hero=document.querySelector('.sv-hero,[data-section-variant^="hero-"],.scroll-story,.story-scroll,.kit-hero,.cx-hero,#home'),dock=document.querySelector('.kit-mobile-dock'),chat=document.querySelector('.visitor-chat'),contact=document.querySelector('#contact');
 if(!hero||!dock&&!chat)return;
 const phone=matchMedia('(max-width:720px)');let scheduled=false;
 function update(){scheduled=false;const h=hero.getBoundingClientRect(),header=document.querySelector('.shared-site-header,.kit-header'),top=header?.getBoundingClientRect().bottom||0,heroVisible=h.bottom>top&&h.top<innerHeight,c=contact?.getBoundingClientRect(),contactVisible=c&&c.top<innerHeight&&c.bottom>top;
 if(dock)dock.dataset.heroHidden=String(phone.matches&&(heroVisible||contactVisible));
 if(chat){const opened=chat.querySelector('.chat-launcher')?.getAttribute('aria-expanded')==='true';chat.dataset.heroHidden=String(phone.matches&&heroVisible&&!opened);const rect=dock?.getBoundingClientRect();document.body.style.setProperty('--homeowner-dock-clearance',dock?.dataset.heroHidden!=='true'&&rect?.height?(innerHeight-rect.top+12)+'px':'16px');}}
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
 update();document.body.classList.add('homeowner-motion-ready');addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);phone.addEventListener('change',schedule);new ResizeObserver(schedule).observe(hero);if(chat)new MutationObserver(schedule).observe(chat,{subtree:true,attributes:true,attributeFilter:['aria-expanded']});
})();
