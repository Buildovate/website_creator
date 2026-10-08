import {createGameExperience} from './experience.js';
import {api} from '../../shared/workspace-api.js';
import {mountGame} from './view.js';
import {sectionLabels} from './sections.js';

// One Game workspace; move the original content node, never clone or rebuild forms.
export function installGameNavigation(){
 if(!document.body.classList.contains('bv-platform'))return;
 const content=document.querySelector('#content'),status=document.querySelector('#status');if(!content)return;
 const phoneMedia=matchMedia('(max-width:720px)');
 const contentHome=content.parentNode,statusHome=status?.parentNode;
 const host=document.createElement('div');host.id='bv-game-shell';host.hidden=true;
 const board=document.createElement('div');board.className='bv-game-board';
 const section=document.createElement('section');section.className='bv-game-section-shell';section.hidden=true;
 section.innerHTML='<div class="bv-game-section-toolbar"><button type="button" data-game-back>Back to board</button><h1 tabindex="-1" data-game-section-title id="bv-game-section-title"></h1><p role="status" data-game-section-status></p></div><div data-game-content></div>';
 host.append(board,section);document.body.append(host);
 let experience=null;
 let activeId=null,data=null,view=null,sequence=0,scheduled=false,opened=null,trigger=null,boardScroll=0,requestAnchor=null;
 const context=()=>{let state;document.dispatchEvent(new CustomEvent('bv-game-context',{detail:s=>state=s}));return state;};
 const available=()=>[...content.querySelectorAll('nav[aria-label="Website settings"] [data-section]')].map(b=>b.dataset.section);
 function show(active){host.hidden=!active;document.body.classList.toggle('bv-game-open',active);const app=document.querySelector('.app-layout');if(app)app.inert=active;}
 function returnContent(){contentHome.append(content);if(status&&statusHome)statusHome.insertBefore(status,content);}
 function frame(open){section.hidden=!open;host.classList.toggle('bv-game-section-open',open);document.body.classList.toggle('bv-game-form-open',open);board.inert=open&&phoneMedia.matches;if(open&&phoneMedia.matches){section.setAttribute('role','dialog');section.setAttribute('aria-modal','true');section.setAttribute('aria-labelledby','bv-game-section-title');}else{section.removeAttribute('role');section.removeAttribute('aria-modal');section.removeAttribute('aria-labelledby');}}
 function draw(){if(!data)return;const selected=view?.selected(),phonePane=view?.phonePane(),focused=board.contains(document.activeElement)?document.activeElement:null,focusKey=focused?.dataset.gameStep?'data-game-step':focused?.dataset.gameOpen?'data-game-open':focused?.dataset.gameQuest?'data-game-quest':focused?.dataset.gameSetting?'data-game-setting':focused?.hasAttribute('data-game-refresh')?'data-game-refresh':null,focusValue=focusKey?focused.getAttribute(focusKey):null;data.sections=available();view?.destroy();view=mountGame(board,{data,selected,phonePane,onOpen:openSection,onRefresh:()=>load(activeId),onRendered:element=>experience?.attach(element)});if(focusKey)board.querySelector('['+focusKey+'="'+CSS.escape(focusValue)+'"]')?.focus({preventScroll:true});}
 function notice(text){const el=board.querySelector('[data-game-message]');if(el)el.textContent=text;}
 function recovery(loading,error){
  const p=document.createElement('section');p.className='bv-game-recovery';p.setAttribute('aria-busy',String(loading));
  const h=document.createElement('h1');h.textContent=loading?'Your next step, all in one place.':navigator.onLine?'Your progress couldn’t load':'You’re offline';
  const note=document.createElement('p');note.setAttribute('role',loading?'status':'alert');note.textContent=loading?'Loading your saved progress…':'Your saved work is unchanged. Reload the board when your connection is ready.';
  const retry=document.createElement('button');retry.type='button';retry.textContent=loading?'Reload board':'Try again';retry.className='primary';retry.onclick=()=>load(activeId);
  p.append(h,note,retry);board.replaceChildren(p);
 }
 async function load(id){if(!id)return;const token=++sequence;activeId=id;show(true);if(data)notice('Refreshing saved progress…');else recovery(true);
  try{const next=await api('/game/'+encodeURIComponent(id));if(token!==sequence)return;data=next;let experienceError=false;try{const result=await api('/game/'+encodeURIComponent(id)+'/experience','POST',{action:'observe'});if(token!==sequence)return;experience?.accept(result);}catch{experienceError=true;}draw();notice(experienceError?'Saved progress loaded. Tour and milestone receipts could not sync. Refresh when your connection is ready.':(data.role==='viewer'?'Read-only website access. ':'')+'Saved progress is up to date.');}
  catch(error){if(token!==sequence)return;if(data){draw();notice(navigator.onLine?'Progress could not refresh. Your last loaded board is still available. Use Refresh progress to try again.':'You’re offline. Your last loaded board and open section are still here.');}else recovery(false,error);}
 }
 function back(){frame(false);window.scrollTo(0,boardScroll);draw();const focus=trigger?.dataset.gameStep?board.querySelector('[data-game-step="'+CSS.escape(trigger.dataset.gameStep)+'"]'):trigger?.dataset.gameSetting?board.querySelector('[data-game-setting="'+CSS.escape(opened||'')+'"][data-game-setting-quest="'+CSS.escape(trigger.dataset.gameSettingQuest)+'"]'):board.querySelector('[data-game-open="'+CSS.escape(opened||'')+'"]');focus?.focus({preventScroll:true});load(activeId);}
 section.querySelector('[data-game-back]').onclick=back;
 function openSection(id,anchor,source){
  const button=content.querySelector('nav[aria-label="Website settings"] [data-section="'+CSS.escape(id||'')+'"]');
  if(!button){notice('This section is not available for your account.');return;}
  trigger=source;boardScroll=window.scrollY;section.querySelector('[data-game-section-title]').textContent=sectionLabels[id]||button.textContent;
  const target=section.querySelector('[data-game-content]');if(status)target.append(status);target.append(content);frame(true);section.scrollTop=0;window.scrollTo(0,0);
  if(opened===id){section.querySelector('[data-game-section-title]').focus();if(anchor)content.querySelector('#'+anchor)?.scrollIntoView();return;}
  opened=id;requestAnchor=anchor;section.querySelector('[data-game-section-status]').textContent='Opening '+(sectionLabels[id]||id)+'…';
  button.click();
 }
 function sync(){scheduled=false;const state=context();if(!state?.user)return;const tenant=state.current?.tenant;
  if(!tenant){if(activeId){sequence++;experience?.destroy();experience=null;activeId=null;data=null;view?.destroy();view=null;opened=null;returnContent();frame(false);show(false);}return;}
  if(activeId!==tenant.id){experience?.destroy();const id=tenant.id;experience=createGameExperience({request:action=>api('/game/'+encodeURIComponent(id)+'/experience','POST',{action})});data=null;opened=null;frame(false);load(id);return;}
  if(!section.hidden){const selected=content.querySelector('nav[aria-label="Website settings"] [data-section].selected');if(selected){opened=selected.dataset.section;section.querySelector('[data-game-section-title]').textContent=sectionLabels[opened]||selected.textContent;section.querySelector('[data-game-section-status]').textContent='';if(requestAnchor){const anchor=content.querySelector('#'+requestAnchor);if(anchor){anchor.tabIndex=-1;anchor.focus();anchor.scrollIntoView();requestAnchor=null;}}else if(!content.contains(document.activeElement)&&!section.querySelector('[data-game-back]').matches(':focus'))section.querySelector('[data-game-section-title]').focus();}}
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(sync);}}
 const observer=new MutationObserver(schedule);observer.observe(content,{childList:true,subtree:true});
 // Keep the existing form and Save dock together in the phone focus loop.
 const trap=event=>{if(event.key!=='Tab'||section.hidden||!phoneMedia.matches||document.querySelector('dialog[open]'))return;const items=[...section.querySelectorAll('button,a[href],input,select,textarea,[tabindex]'),...document.querySelectorAll('.platform-action-dock button')].filter(el=>!el.disabled&&el.tabIndex>=0&&el.getClientRects().length);if(!items.length)return;const first=items[0],last=items.at(-1);if(event.shiftKey&&(document.activeElement===first||!items.includes(document.activeElement))){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}};
 document.addEventListener('keydown',trap);
 const resize=()=>frame(!section.hidden);phoneMedia.addEventListener('change',resize);
 // Existing intra-form links still use their original section action; mirror the active title.
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!section.hidden&&!document.querySelector('dialog[open]')){event.preventDefault();back();}});
 schedule();return ()=>{observer.disconnect();document.removeEventListener('keydown',trap);phoneMedia.removeEventListener('change',resize);experience?.destroy();returnContent();view?.destroy();host.remove();document.body.classList.remove('bv-game-open','bv-game-form-open');const app=document.querySelector('.app-layout');if(app)app.inert=false;};
}
installGameNavigation();
