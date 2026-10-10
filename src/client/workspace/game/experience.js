const tourSteps=[
 ['Your progress','.bv-game-strength','Your site strength is your setup progress out of 100. Complete every step in a quest to earn its points; opening a form earns none.'],
 ['Your current quest','#bv-game-quest','Choose Start to open your existing settings. Back to board returns you here without changing your saved work.'],
 ['Your badges','.bv-game-badges','Badges show completed milestones. A step marked Not connected or Not available yet earns no points.']
];
// Presentation state is local to this mount; the server owns once-only receipts.
export function createGameExperience({request,readPreview=async url=>{const response=await fetch(url,{credentials:'same-origin'});if(!response.ok)throw new Error('The published site could not load. It may have been unpublished.');return response.text();}}){
 let previewListener=null;
 let host=null,tour=-1,celebration=[],timer=null,preview={state:'unpublished'},dialog=null,origin=null,disposed=false,pendingError='';
 function clearHighlight(){host?.querySelectorAll('[data-game-tour-target]').forEach(el=>el.removeAttribute('data-game-tour-target'));}
 function stopCelebration(){celebration=[];clearTimeout(timer);timer=null;paintCelebration();}
 function paintCelebration(){
  const slot=host?.querySelector('[data-game-celebration]');if(!slot)return;slot.replaceChildren();
  if(!celebration.length)return;
  const text=document.createElement('strong');text.textContent=celebration.map(id=>'Level '+id+' complete').join(' · ')+'. Your next quest is ready.';
  const button=document.createElement('button');button.type='button';button.textContent='Continue';button.onclick=stopCelebration;slot.append(text,button);
 }
 async function finishTour(action){
  tour=-1;paintTour();(host?.querySelector('[data-game-chip][aria-selected=true]')||host?.querySelector('[data-game-quest][aria-selected=true]'))?.focus({preventScroll:true});
  try{await request(action);pendingError='';}catch{pendingError='We could not save your tour preference. Your website changes are unaffected.';}
  const status=host?.querySelector('[data-game-tour-status]');if(status)status.textContent=pendingError;
 }
 function paintTour(){
  if(!host)return;clearHighlight();let panel=host.querySelector('[data-game-tour]');
  if(tour<0){panel?.remove();return;}
  if(!panel){panel=document.createElement('aside');panel.className='bv-game-tour';panel.dataset.gameTour='';panel.setAttribute('aria-label','Getting started tour');host.querySelector('.bv-game-layout').before(panel);}
  const [title,selector,copy]=tourSteps[tour];panel.replaceChildren();
  const words=document.createElement('div'),count=document.createElement('small'),heading=document.createElement('h2'),text=document.createElement('p');
  count.textContent='QUICK TOUR · '+(tour+1)+' OF 3';heading.textContent=title;text.textContent=copy;words.append(count,heading,text);
  const next=document.createElement('button');next.type='button';next.textContent=tour===2?'Finish tour':'Next';next.onclick=()=>{if(tour===2)finishTour('finish_tour');else{tour++;paintTour();host.querySelector('[data-game-tour] button')?.focus();}};
  const skip=document.createElement('button');skip.type='button';skip.textContent='Skip tour';skip.onclick=()=>finishTour('skip_tour');
  panel.append(words,next,skip);host.querySelector(selector)?.setAttribute('data-game-tour-target','');host.dispatchEvent(new CustomEvent('bv-game-tour-step',{detail:{index:tour}}));
 }
 function closePreview(){if(!dialog)return;dialog.close();dialog.remove();dialog=null;origin?.focus();}
 async function openPreview(button){
  if(dialog)return;origin=button;dialog=document.createElement('dialog');dialog.className='bv-game-preview';dialog.setAttribute('aria-label','Published site preview');
  const top=document.createElement('div');top.className='bv-game-preview-top';
  const title=document.createElement('h2');title.textContent='Published site preview';
  const close=document.createElement('button');close.type='button';close.textContent='Back to board';close.onclick=closePreview;top.append(title,close);
  const status=document.createElement('p');status.setAttribute('role','status');dialog.append(top,status);document.body.append(dialog);
  dialog.addEventListener('cancel',event=>{event.preventDefault();closePreview();});dialog.showModal();close.focus();
  if(preview.state!=='published'){status.textContent=preview.reason||'Your site isn’t published yet. Publish it when you’re ready, then view it here.';return;}
  status.textContent='Loading your published site…';const active=dialog;
  try{
   const html=await readPreview(preview.url);if(dialog!==active||disposed)return;
   status.textContent='This is your published website. Changes saved as drafts will appear after you publish.';
   const frame=document.createElement('iframe');frame.title='Your published website';frame.setAttribute('sandbox','');frame.dataset.gamePublishedUrl=preview.url;
   const base=document.createElement('base');base.href=new URL(preview.url,location.origin).href;
   frame.srcdoc=html.replace(/<head([^>]*)>/i,match=>match+base.outerHTML);active.append(frame);
  }catch{if(dialog===active){status.setAttribute('role','alert');status.textContent='Your published website could not load. Choose Back to board, check your connection, and try Preview site again.';}}
 }
 return {
  accept(result){preview=result.preview||preview;if(result.showTour)tour=0;
   if(result.completedLevels?.length){celebration=result.completedLevels;clearTimeout(timer);timer=setTimeout(stopCelebration,5000);}
  },
  attach(element){
   if(previewListener&&host)host.removeEventListener('bv-game-preview-open',previewListener);
   host=element;previewListener=event=>openPreview(event.detail.trigger);host.addEventListener('bv-game-preview-open',previewListener);const header=host.querySelector('.bv-game-header');if(!header)return;
   const button=document.createElement('button');button.type='button';button.dataset.gamePreview='';button.textContent='Preview site';button.onclick=()=>openPreview(button);header.querySelector('[data-game-refresh]').after(button);
   const notice=host.querySelector('.bv-game-notice'),slot=document.createElement('div');slot.className='bv-game-confirmation';slot.dataset.gameCelebration='';slot.setAttribute('role','status');notice.after(slot);
   const status=document.createElement('span');status.dataset.gameTourStatus='';status.setAttribute('role','status');status.textContent=pendingError;slot.after(status);
   paintTour();paintCelebration();
  },
  destroy(){if(previewListener&&host)host.removeEventListener('bv-game-preview-open',previewListener);disposed=true;clearTimeout(timer);clearHighlight();closePreview();host=null;}
 };
}
