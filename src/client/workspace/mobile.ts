// Responsive helpers preserve the existing form handlers and authorization checks.
const phone=matchMedia('(max-width:720px)');
const dock=document.createElement('div');dock.className='platform-action-dock';dock.setAttribute('aria-label','Screen actions');
let targets:HTMLButtonElement[]=[],lastStatus='',raf=0;
const photoUrls=new Map<HTMLInputElement,string[]>();
function sync(){
 raf=0;
 for(const [input,urls]of photoUrls)if(!input.isConnected){urls.forEach(URL.revokeObjectURL);photoUrls.delete(input)}
 for(const table of document.querySelectorAll<HTMLTableElement>('#content table, #dialog table')){
  const headers=[...table.querySelectorAll('thead th')].map(th=>th.textContent?.trim()||'');
  table.querySelectorAll('tbody tr').forEach(row=>[...row.children].forEach((cell,i)=>{if(cell.getAttribute('data-mobile-label')!==(headers[i]||'Details'))cell.setAttribute('data-mobile-label',headers[i]||'Details')}));
 }
 for(const input of document.querySelectorAll<HTMLInputElement>('#content input[type=file],#dialog input[type=file]')){
  if(!input.accept.includes('image')||input.dataset.cameraReady)continue;
  input.dataset.cameraReady='true';
  const controls=document.createElement('div');controls.className='phone-photo-tools';
  const camera=document.createElement('input');camera.type='file';camera.accept='image/*';camera.setAttribute('capture','environment');camera.hidden=true;
  const choose=document.createElement('button');choose.type='button';choose.className='secondary choose-photo';choose.textContent='Choose photographs';choose.disabled=input.disabled;choose.onclick=()=>input.click();
  const take=document.createElement('button');take.type='button';take.className='secondary';take.textContent='Take a photo';take.disabled=input.disabled;take.onclick=()=>camera.click();
  const preview=document.createElement('div');preview.className='phone-photo-preview';preview.setAttribute('aria-live','polite');
  let urls:string[]=[];photoUrls.set(input,urls);
  input.addEventListener('change',()=>{urls.forEach(URL.revokeObjectURL);urls=[];photoUrls.set(input,urls);preview.replaceChildren();for(const file of [...(input.files||[])]){if(!file.type.startsWith('image/'))continue;const img=document.createElement('img');img.alt='Selected photo: '+file.name;img.src=URL.createObjectURL(file);urls.push(img.src);preview.append(img);}const note=document.createElement('p');note.textContent=input.files?.length?'Review your selection, then use the upload or save action.':'No photo selected. You can try again or choose an existing photo.';preview.append(note);});
  camera.addEventListener('change',()=>{if(!camera.files?.length)return;const transfer=new DataTransfer();for(const file of camera.files)transfer.items.add(file);input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));camera.value='';});
  camera.addEventListener('cancel',()=>{let note=preview.querySelector('p');if(!note){note=document.createElement('p');preview.append(note)}note.textContent='Camera closed without a new photo. Any previous selection is unchanged. Choose an existing photo or try again.';});
  controls.append(choose,take,camera,preview);input.closest('label')?.insertAdjacentElement('afterend',controls);
 }
 for(const input of document.querySelectorAll<HTMLInputElement>('input[data-camera-ready=true]')){if(phone.matches){input.tabIndex=-1;input.setAttribute('aria-hidden','true')}else{input.removeAttribute('tabindex');input.removeAttribute('aria-hidden')}}
 const dialog=document.querySelector<HTMLDialogElement>('dialog[open]');
 const root=dialog||document.querySelector('#content');
 const originals=root?[...root.querySelectorAll<HTMLButtonElement>('button')].filter(b=>!dock.contains(b)&&!b.closest('.inline-notes')&&(b.getClientRects().length||b.classList.contains('photo-upload-submit'))&&(/^(save|upload|publish|create|add appointment)/i.test(b.textContent?.trim()||''))):[];
 // One save action for the active screen, plus its existing publish action.
 const save=originals.find(b=>/^save/i.test(b.textContent?.trim()||''))||originals.find(b=>b.form&&b.type==='submit');
 const publish=originals.find(b=>/^publish/i.test(b.textContent?.trim()||''));
 // The prepare form's submit belongs inside its short dialog; cloning it here
 // creates a second action and reserves an empty dock area below the form.
 const next=dialog?.querySelector('#prepare-design')||(!dialog&&document.querySelector('#hero-editor'))?[]:[save,publish].filter((x):x is HTMLButtonElement=>!!x);
 for(const original of document.querySelectorAll<HTMLButtonElement>(".photo-upload-submit")){if(phone.matches){original.tabIndex=-1;original.setAttribute("aria-hidden","true")}else{original.removeAttribute("tabindex");original.removeAttribute("aria-hidden")}}
 const status=(dialog?.querySelector('#dialog-status')||document.querySelector('#status'))?.textContent||'';
 const parent=dialog||document.body;if(dock.parentElement!==parent)parent.append(dock);
 if(next.some((b,i)=>b!==targets[i])||next.length!==targets.length||lastStatus!==status){
  targets=next;lastStatus=status;dock.replaceChildren();
  if(status){const note=document.createElement('p');note.textContent=status;dock.append(note);}
  next.forEach(original=>{const b=document.createElement('button');b.type='button';b.className='primary';b.textContent=original.textContent;b.onclick=()=>original.click();dock.append(b);});
 }
 [...dock.querySelectorAll('button')].forEach((b,i)=>{if(b.disabled!==targets[i].matches(':disabled'))b.disabled=targets[i].matches(':disabled')});
 dock.hidden=!phone.matches||!targets.length;
 document.body.classList.toggle('has-platform-dock',!dock.hidden);
}
function schedule(){if(!raf)raf=requestAnimationFrame(sync)}
const observer=new MutationObserver(schedule);
for(const selector of ['#content','#dialog','#status']){const el=document.querySelector(selector);if(el)observer.observe(el,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','open','hidden']});}
phone.addEventListener('change',schedule);
document.addEventListener('change',e=>{const select=e.target as HTMLSelectElement;if(select.matches('[data-platform-screen]'))document.querySelector<HTMLButtonElement>('nav.tabs [data-section="'+CSS.escape(select.value)+'"]')?.click();});
const viewport=()=>{const v=window.visualViewport;document.documentElement.style.setProperty('--platform-keyboard',Math.max(0,innerHeight-(v?.height||innerHeight)-(v?.offsetTop||0))+'px')};
window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);viewport();schedule();
