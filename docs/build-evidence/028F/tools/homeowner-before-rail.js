(()=>{
 const hero=document.querySelector('.sv-hero,[data-section-variant^="hero-"],.scroll-story,.story-scroll,.kit-hero,.cx-hero,.sd-hero,#home'),dock=document.querySelector('.kit-mobile-dock'),chat=document.querySelector('.visitor-chat'),contact=document.querySelector('#contact,#request'),serviceDock=document.querySelector('.sd-phone-bar'),header=document.querySelector('.shared-site-header,.kit-header');
 if(!dock&&!chat&&!serviceDock&&!header)return;
 const protectedSelector='img,video,h1,h2,h3,.sv-primary,.story-primary,.core-button,.foundation-button,.kit-button,.cx-button,.sd-button,.qa-primary,form label,form legend,form input:not([type=hidden]),form textarea,form select,form button';
 function covers(action){if(!action)return false;const a=action.getBoundingClientRect();return [...document.querySelectorAll(protectedSelector)].some(e=>{if(action.contains(e)||e.closest('.visitor-chat,.kit-mobile-dock,.sd-phone-bar,.shared-site-header')||!e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))return false;const b=e.getBoundingClientRect();return b.width>0&&b.height>0&&Math.min(a.right,b.right,innerWidth)>Math.max(a.left,b.left,0)&&Math.min(a.bottom,b.bottom,innerHeight)>Math.max(a.top,b.top,0)})}
 const phone=matchMedia('(max-width:720px)');let scheduled=false;
 function update(){scheduled=false;const h=hero?.getBoundingClientRect(),top=header?.getBoundingClientRect().bottom||0,heroVisible=h&&h.bottom>top&&h.top<innerHeight,c=contact?.getBoundingClientRect(),contactVisible=c&&c.top<innerHeight&&c.bottom>top;
 if(dock)dock.dataset.heroHidden=String(phone.matches&&(heroVisible||contactVisible));
 if(chat){const opened=chat.querySelector('.chat-launcher')?.getAttribute('aria-expanded')==='true';chat.dataset.heroHidden=String(phone.matches&&heroVisible&&!opened);const rect=dock?.getBoundingClientRect();document.body.style.setProperty('--homeowner-dock-clearance',dock?.dataset.heroHidden!=='true'&&rect?.height?(innerHeight-rect.top+12)+'px':'16px');}
 if(serviceDock)serviceDock.dataset.mediaHidden=String((phone.matches&&(heroVisible||contactVisible))||covers(serviceDock));
 if(dock)dock.dataset.mediaHidden=String(covers(dock));
 if(chat)chat.dataset.mediaHidden=String(chat.querySelector('.chat-launcher')?.getAttribute('aria-expanded')!=='true'&&covers(chat));
 if(header)header.dataset.mediaHidden=String(covers(header));}
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
 update();document.body.classList.add('homeowner-motion-ready');schedule();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);phone.addEventListener('change',schedule);const sizes=new ResizeObserver(schedule);sizes.observe(document.body);if(hero)sizes.observe(hero);document.querySelectorAll('img,video').forEach(e=>e.addEventListener('load',schedule,{once:true}));if(chat)new MutationObserver(schedule).observe(chat,{subtree:true,attributes:true,attributeFilter:['aria-expanded']});
})();
