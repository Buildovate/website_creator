/** Test-only console gates. Expectations originate in fixtures, never observed diagnostics. */
export const EDITOR_WARNING="An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing.";
export const isPlatformConsoleFailure=record=>record.platform!==false&&!record.allowed;
const declarations=new WeakMap(),requestFixtures=new WeakMap(),contextOffline=new WeakMap(),instrumented=new WeakSet();
const fixtureMessages=new Map([[503,'Failed to load resource: the server responded with a status of 503 (Service Unavailable)'],[403,'Failed to load resource: the server responded with a status of 403 (Forbidden)'],['offline','Failed to load resource: net::ERR_INTERNET_DISCONNECTED']]);
function source(){return new Error().stack.split('\n').find(line=>/[/\\]tests[/\\]/.test(line)&&!line.includes('platform-console.mjs'))?.trim()||'test fixture'}
export function declareFailureFixture(page,{url,method='GET',status,state}){
 if(!['offline',403].includes(status)||!state||/[\*]/.test(url)||!/^https?:/.test(url))throw Error('Fixture requires an exact URL, method, state and approved status');
 const entry={url,method,status,state,source:source(),kind:status==='offline'?'offline-injection':'permission-state',active:true};const list=declarations.get(page)||[];list.push(entry);declarations.set(page,list);page.__bvFixtureLog?.(entry);return()=>{entry.active=false};
}
export function allowProtectedLookMessage({type,text,location,state,frames=[]}){
 if(type!=='error'||!state.endsWith('-look-picker')||frames.length!==4)return false;
 if(frames.map(f=>f.style).sort().join(',')!=='bold,classic,current,fresh'||frames.some(f=>f.allowScripts||!f.visible))return false;
 return frames.some(f=>location.url===f.src&&text==="Blocked script execution in '"+f.src+"' because the document's frame is sandboxed and the 'allow-scripts' permission is not set.");
}
export function allowEditorMessage({type,text,location,state,editor}){
 return type==='warning'&&text===EDITOR_WARNING&&state.endsWith('-editor')&&!!editor&&editor.id==='editor-frame'&&editor.title==='Contractor website draft preview'&&editor.section==='editor'&&editor.visible&&editor.sandbox==='allow-same-origin allow-scripts'&&location.url===editor.src;
}
export function allowFixtureMessage({type,text,location,network}){
 const f=network?.fixture;return type==='error'&&!!f&&!network.used&&f.url===location.url&&network.url===f.url&&network.method===f.method&&network.status===f.status&&text===fixtureMessages.get(f.status)&&['route-fulfill','offline-injection','permission-state'].includes(f.kind);
}
function instrumentFixtures(page,onFixture){
 page.__bvFixtureLog=entry=>onFixture?.({...entry});if(instrumented.has(page))return;instrumented.add(page);
 const context=page.context();if(!contextOffline.has(context)){contextOffline.set(context,false);const offline=context.setOffline.bind(context);context.setOffline=async value=>{await offline(value);contextOffline.set(context,value)}}
 page.on('request',request=>{const f=(declarations.get(page)||[]).find(f=>f.active&&f.url===request.url()&&f.method===request.method()&&(f.status!=='offline'||contextOffline.get(context)));if(f)requestFixtures.set(request,{...f})});
 const route=page.route.bind(page),unroute=page.unroute.bind(page),handlers=new WeakMap();
 page.route=async(pattern,handler,options)=>{const wrapped=(r,request)=>handler(new Proxy(r,{get(target,key){if(key==='fulfill')return async value=>{if([503,403].includes(value?.status)){const f={url:request.url(),method:request.method(),status:value.status,state:'injected-route-failure',kind:'route-fulfill',source:source()};requestFixtures.set(request,f);onFixture?.(f)}return target.fulfill(value)};const v=Reflect.get(target,key);return typeof v==='function'?v.bind(target):v}}),request);handlers.set(handler,wrapped);return route(pattern,wrapped,options)};
 page.unroute=(pattern,handler)=>unroute(pattern,handler?handlers.get(handler)||handler:undefined);
}
export function watchPlatformConsole(page,getState,records,{onRecord,onFixture,platformOnly=false}={}){
 const pending=new Set(),network=[];instrumentFixtures(page,onFixture);
 page.on('response',response=>{const request=response.request();network.push({url:request.url(),method:request.method(),status:response.status(),fixture:requestFixtures.get(request),used:false})});
 page.on('requestfailed',request=>network.push({url:request.url(),method:request.method(),status:request.failure()?.errorText==='net::ERR_INTERNET_DISCONNECTED'?'offline':request.failure()?.errorText,fixture:requestFixtures.get(request),used:false}));
 function queue(job){pending.add(job);job.finally(()=>pending.delete(job))}
 page.on('console',message=>{if(!['error','warning','warn'].includes(message.type()))return;const record={state:getState(),type:message.type(),text:message.text(),location:message.location(),viewport:page.viewportSize(),pageUrl:page.url()};
 queue((async()=>{let context={frames:[],editor:null,platform:null};try{context=await page.evaluate(()=>{const e=document.querySelector('#editor-frame');return {platform:document.body?.classList.contains('bv-platform'),section:document.querySelector('nav.tabs .selected')?.getAttribute('data-section'),frames:[...document.querySelectorAll('#site-look-panel iframe')].map(f=>({src:f.src,style:new URL(f.src).searchParams.get('siteStyle'),allowScripts:f.sandbox.contains('allow-scripts'),visible:f.checkVisibility({checkVisibilityCSS:true})})),editor:e?{id:e.id,title:e.title,src:e.src,visible:e.checkVisibility({checkVisibilityCSS:true}),sandbox:[...e.sandbox].sort().join(' '),section:document.querySelector('nav.tabs .selected')?.getAttribute('data-section')}:null}})}catch{}
 record.platform=context.platform;
 if(!record.state)record.state='legacy-'+(context.section||'workspace');
 if(allowProtectedLookMessage({...record,frames:context.frames})){record.allowed=true;record.exception='protected-look-frame'}else if(allowEditorMessage({...record,editor:context.editor})){record.allowed=true;record.exception='pre-existing-editor-frame'}else{await new Promise(r=>setTimeout(r,20));const match=network.find(n=>allowFixtureMessage({...record,network:n}));record.allowed=!!match;if(match){match.used=true;record.exception='deliberate-failure-fixture';record.fixture=match.fixture;record.network={url:match.url,method:match.method,status:match.status};record.state=match.fixture.state}}
 records.push(record);onRecord?.();})());
 });
 page.on('pageerror',error=>{queue((async()=>{let platform=null;try{platform=await page.evaluate(()=>document.body?.classList.contains('bv-platform'))}catch{}records.push({state:getState(),type:'pageexception',text:error.message,allowed:false,platform,pageUrl:page.url()});onRecord?.()})())});
 return async()=>{while(pending.size)await Promise.all([...pending])};
}
