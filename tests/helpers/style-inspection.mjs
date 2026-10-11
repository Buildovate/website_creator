// Computed WCAG contrast, alpha compositing, header geometry and overflow.
export function inspectStylePage(){
 const rgba=s=>{const a=s.match(/[\d.]+/g)?.map(Number)||[0,0,0,0];return a.length===3?[...a,1]:a};
 const over=(a,b)=>a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])).concat(1);
 const lum=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
 const contrasts=[],review=[];
 for(const el of document.querySelectorAll('body *')){if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&!el.matches('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea'))continue;const r=el.getBoundingClientRect(),s=getComputedStyle(el);if(!r.width||!r.height||r.width<=2||r.height<=2||s.visibility==='hidden'||s.opacity==='0'||el.closest('[aria-hidden=true],svg,[hidden]')||s.clipPath!=='none'||s.clip!=='auto'||parseFloat(s.fontSize)===0||!el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})||r.right<0||r.bottom<0)continue;
 let chain=[],parent=el;while(parent){chain.unshift(parent);parent=parent.parentElement}let bg=[255,255,255,1],images=[];for(const node of chain){const cs=getComputedStyle(node),c=rgba(cs.backgroundColor);bg=over(c,bg);if(c[3]===1)images=[];if(cs.backgroundImage!=='none')images.push({cls:String(node.className),image:cs.backgroundImage});}
 const fg=over(rgba(s.color),bg),a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),font=parseFloat(s.fontSize),large=font>=24||font>=18.666&&Number(s.fontWeight)>=700,minimum=large?3:4.5;
 const x={tag:el.tagName,cls:String(el.className),parent:el.parentElement?.className,text:el.textContent.trim().slice(0,75),fg:s.color,bg:bg.slice(0,3).map(Math.round),ratio:+ratio.toFixed(3),minimum,font,pass:ratio>=minimum};
 if(images.length){x.images=images;review.push(x)}else contrasts.push(x);
 }
 const header=document.querySelector('.cx-header,.shared-site-header,.tp-header'),items=header?[...header.querySelectorAll('nav>a,nav>details>summary,:scope>.cx-button,.site-more:not([data-nav-enhanced]) .site-more-list>a')].filter(el=>el.getBoundingClientRect().width).map(el=>{const r=el.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el);const t=range.getBoundingClientRect();return {text:el.textContent.trim(),center:r.y+r.height/2,height:r.height,textCenter:t.y+t.height/2,fontFamily:getComputedStyle(el).fontFamily}}):[];
 return {contrasts,review,header:items,overflow:document.documentElement.scrollWidth-innerWidth};}
