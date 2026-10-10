import {questSections,sectionLabels} from './sections.js';

// Phone presentation only. Existing quest controls and form handlers stay authoritative.
export function mountPhoneBoard(host,{data,selected,labels,pane='quests',onPane,select,onOpen}){
 if(!matchMedia('(max-width:720px)').matches)return null;
 const root=host.querySelector('.bv-game'),layout=root.querySelector('.bv-game-layout'),rail=root.querySelector('.bv-game-rail');
 let sheet=null;
 const strip=document.createElement('nav');strip.className='bv-game-phone-quests';strip.setAttribute('aria-label','Quest shortcuts');
 const all=document.createElement('button');all.type='button';all.textContent='All';all.dataset.gameAll='';all.setAttribute('aria-haspopup','dialog');
 const chips=document.createElement('div');chips.className='bv-game-chips';chips.setAttribute('role','tablist');chips.setAttribute('aria-label','Quests');chips.setAttribute('aria-orientation','horizontal');
 for(const q of data.progress.quests){
  const button=document.createElement('button');button.type='button';button.dataset.gameChip=q.id;button.setAttribute('role','tab');button.setAttribute('aria-selected',String(q.id===selected));button.setAttribute('aria-controls','bv-game-quest');button.tabIndex=q.id===selected?0:-1;
  const label=document.createElement('strong');label.textContent=labels[q.id][0];
  const status=document.createElement('small');status.textContent=(q.done?'Done':q.level>data.progress.currentLevel?'Locked':q.status)+' · '+q.xpEarned+'/'+q.xpMax+' XP';
  button.append(label,status);button.onclick=()=>select(q.id);chips.append(button);
 }
 const chipButtons=[...chips.children];
 chipButtons.forEach((button,index)=>button.onkeydown=event=>{let next;if(event.key==='ArrowRight')next=(index+1)%chipButtons.length;if(event.key==='ArrowLeft')next=(index+chipButtons.length-1)%chipButtons.length;if(event.key==='Home')next=0;if(event.key==='End')next=chipButtons.length-1;if(next!==undefined){event.preventDefault();select(chipButtons[next].dataset.gameChip);}});
 strip.append(all,chips);layout.before(strip);
 const settings=document.createElement('section');settings.className='bv-game-phone-settings';settings.setAttribute('aria-label','Game settings');
 const heading=document.createElement('h1');heading.textContent='Your website settings';settings.append(heading);
 const refresh=document.createElement('button');refresh.type='button';refresh.textContent='Refresh progress';refresh.onclick=()=>root.querySelector('[data-game-refresh]').click();settings.append(refresh);
 for(const [quest,ids] of Object.entries(questSections)){
  const permitted=ids.filter(id=>data.sections?.includes(id));if(!permitted.length)continue;
  const group=document.createElement('section'),title=document.createElement('h2');title.textContent=labels[quest][0];group.append(title);
  for(const id of permitted){const button=document.createElement('button');button.type='button';button.dataset.gameSetting=id;button.dataset.gameSettingQuest=quest;button.textContent=sectionLabels[id];button.onclick=()=>onOpen(id,quest==='promotions'?'q-promotions':quest==='financing'?'q-financing':null,button);group.append(button);}
  settings.append(group);
 }
 layout.append(settings);
 const bottom=document.createElement('nav');bottom.className='bv-game-phone-nav';bottom.setAttribute('aria-label','Game navigation');
 function setPane(next,focus=false){pane=next;root.dataset.gamePhonePane=next;onPane(next);for(const button of bottom.children)button.setAttribute('aria-current',button.dataset.gamePhone===next?'page':'false');if(focus){window.scrollTo(0,0);const heading=next==='badges'?root.querySelector('.bv-game-badges h2'):next==='settings'?settings.querySelector('h1'):root.querySelector('#bv-game-quest');heading.tabIndex=-1;heading.focus({preventScroll:true});}}
 for(const [id,label] of [['quests','Quests'],['badges','Badges'],['preview','Preview site'],['settings','Settings']]){
  const button=document.createElement('button');button.type='button';button.dataset.gamePhone=id;button.textContent=label;
  button.onclick=()=>id==='preview'?host.dispatchEvent(new CustomEvent('bv-game-preview-open',{detail:{trigger:button}})):setPane(id,true);
  bottom.append(button);
 }
 root.append(bottom);
 const railHome=rail.parentNode,railNext=rail.nextSibling;
 function closeAll(returnFocus=true){if(!sheet)return;railHome.insertBefore(rail,railNext);sheet.close();sheet.remove();sheet=null;if(returnFocus)all.focus();}
 all.onclick=()=>{
  sheet=document.createElement('dialog');sheet.className='bv-game-all';sheet.setAttribute('aria-label','All quests');
  const top=document.createElement('div');top.className='bv-game-all-top';const title=document.createElement('h2');title.textContent='All quests';const close=document.createElement('button');close.type='button';close.textContent='Close';close.onclick=()=>closeAll();top.append(title,close);
  sheet.append(top,rail);document.body.append(sheet);sheet.addEventListener('cancel',event=>{event.preventDefault();closeAll();});sheet.showModal();close.focus();
 };
 const onTour=event=>setPane(event.detail.index===2?'badges':'quests');
 host.addEventListener('bv-game-tour-step',onTour);
 setPane(host.querySelector('.bv-game-badges[data-game-tour-target]')?'badges':pane);
 let activeChip=selected;
 function revealChip(id,focus=false){activeChip=id;const chip=chips.querySelector('[data-game-chip="'+id+'"]');if(!chip)return;const bounds=chip.getBoundingClientRect(),viewport=chips.getBoundingClientRect();chips.scrollLeft=Math.max(0,chips.scrollLeft+bounds.left-viewport.left-8);if(focus)chip.focus({preventScroll:true});}
 // Font swaps can change widths after the initial scroll. Re-align before paint;
 // observe sizes, not scrolling, so a homeowner can still swipe the quest strip.
 const chipSizes=new ResizeObserver(()=>{if(root.isConnected)revealChip(activeChip);});
 [chips,...chipButtons].forEach(el=>chipSizes.observe(el));
 revealChip(selected);
 return {focusQuest:id=>revealChip(id,true),destroy(){chipSizes.disconnect();host.removeEventListener('bv-game-tour-step',onTour);closeAll(false);}};
}
