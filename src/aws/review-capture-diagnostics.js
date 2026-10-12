// Diagnostic-only screenshot records. No browser settings, DOM, styles, or image pixels are changed.
const pages=new WeakMap();
export async function registerCaptureDiagnostics(page,environment){
 if(!environment.onScreenshot)return;
 const cdp=await page.context().newCDPSession(page),cache={responses:[],servedFromCache:[]},requests=new Map();
 cdp.on('Network.requestWillBeSent',event=>requests.set(event.requestId,event.request.url));
 cdp.on('Network.requestServedFromCache',event=>cache.servedFromCache.push(requests.get(event.requestId)||event.requestId));
 cdp.on('Network.responseReceived',event=>cache.responses.push({url:event.response.url,status:event.response.status,type:event.type,fromDiskCache:!!event.response.fromDiskCache,fromPrefetchCache:!!event.response.fromPrefetchCache,fromServiceWorker:!!event.response.fromServiceWorker}));
 await cdp.send('Network.enable');
 pages.set(page,{...environment,cache,decodeResults:[],navigations:0});
 page.on('framenavigated',frame=>{if(frame===page.mainFrame())pages.get(page).navigations++});
}
export function recordImageDecodes(page,results){const state=pages.get(page);if(state)state.decodeResults=results;}
export async function screenshotWithDiagnostics(page,path,options,target=page){
 const state=pages.get(page);if(!state)return target.screenshot(options);
 const inspect=()=>page.evaluate(({decodeResults})=>{
  const visible=img=>{const b=img.getBoundingClientRect(),s=getComputedStyle(img);return b.width>0&&b.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0&&!img.closest('[hidden]')&&img.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})};
  const images=[...document.images].flatMap((img,index)=>{if(!visible(img))return[];const b=img.getBoundingClientRect(),s=getComputedStyle(img),decoded=decodeResults.find(x=>x.index===index&&x.currentSrc===img.currentSrc);return[{index,id:img.id,alt:img.alt,currentSrc:img.currentSrc,src:img.getAttribute('src'),srcset:img.getAttribute('srcset'),sizes:img.getAttribute('sizes'),naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,rendered:{x:b.x,y:b.y,width:b.width,height:b.height},complete:img.complete,decodeResult:decoded?.result||'not recorded for this candidate',decodeCandidate:decodeResults.find(x=>x.index===index)||null,loading:img.loading,inViewport:b.bottom>0&&b.top<innerHeight&&b.right>0&&b.left<innerWidth,computed:{objectFit:s.objectFit,imageRendering:s.imageRendering,transform:s.transform,opacity:s.opacity,filter:s.filter},hover:img.matches(':hover')} ]});
  return {url:location.href,devicePixelRatio,viewport:{width:innerWidth,height:innerHeight},scroll:{x:scrollX,y:scrollY},documentSize:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},images,runningAnimations:document.getAnimations().filter(a=>a.playState==='running'||a.pending).map(a=>({type:a.constructor.name,playState:a.playState,target:a.effect?.target?.tagName||null})),fontsStatus:document.fonts.status};
 },{decodeResults:state.decodeResults});
 const before=await inspect(),data=await target.screenshot(options),after=await inspect();
 const {onScreenshot,cache,decodeResults,...environment}=state;
 await onScreenshot({path,data,readiness:{environment:{...environment,context:{freshAtPacketStart:true,reusedAcrossPages:true,pageOrdinal:state.pageOrdinal,pageReusedAcrossViewport:state.navigations>1},browserCache:{httpCacheExplicitlyDisabled:false,requestRoutingEnabled:true,responses:cache.responses.slice(),servedFromCache:cache.servedFromCache.slice()}},before,after}});
 return data;
}
