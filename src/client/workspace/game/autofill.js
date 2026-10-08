import {planAutofill,undoAutofill} from '../../../blueprint/autofill/rules.js';
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(className)n.className=className;return n;};
export function mountAutofill(form,{tenantId,role,request}){
 const kind=form.id==='questionnaire-form'?'questionnaire':'business',dirty=new Set(),patches=new Map();
 let result=null,busy=false,disposed=false,applying=false,confirmBefore=null,confirmationTouched=false;
 const panel=el('section',null,'bv-game-autofill');panel.setAttribute('aria-label','Fill from saved details');
 panel.append(el('h2','Reuse your saved business details'),el('p','Check suggested details before adding them to empty fields. Answers you have typed will stay unchanged.'));
 const status=el('p','Confirm adds a detail to this form. Save stores your changes; it does not publish them.');status.setAttribute('role','status');panel.append(status);
 const controls=el('div',null,'bv-game-autofill-actions'),rows=el('div',null,'bv-game-autofill-rows');panel.append(controls,rows);form.before(panel);
 const values=()=>Object.fromEntries([...form.elements].filter(n=>n.name&&['INPUT','TEXTAREA','SELECT'].includes(n.tagName)).map(n=>[n.name,n.value]));
 const button=(text,fn,attr)=>{const b=el('button',text);b.type='button';if(attr)b.dataset[attr]='';b.onclick=fn;return b;};
 const input=field=>form.elements.namedItem(field);
 function change(field,value){const n=input(field);if(!n||n.disabled||n.readOnly)return false;n.value=value;applying=true;n.dispatchEvent(new Event('input',{bubbles:true}));n.dispatchEvent(new Event('change',{bubbles:true}));applying=false;return true;}
 function candidates(){return result?planAutofill(result.items,values(),[...dirty]):[];}
 function apply(fields){
  let count=0;
  for(const row of candidates().filter(r=>r.status==='found'&&fields.includes(r.field))){
   const n=input(row.field);if(!n||n.disabled||n.readOnly)continue;
   if(!patches.size){const c=input('conversion-confirmed');confirmBefore=c?c.checked:null;confirmationTouched=false;}
   const before=n.value;if(change(row.field,row.value)){patches.set(row.field,{field:row.field,before,after:row.value});count++;}
  }
  render();status.textContent=count+' saved '+(count===1?'detail added':'details added')+'. Review the form, then choose Save to store your changes.';status.focus({preventScroll:true});
 }
 function undo(){
  const result=undoAutofill(values(),[...patches.values()]);
  for(const field of result.restored)change(field,result.values[field]);
  if(result.kept.length===0&&!confirmationTouched&&confirmBefore!==null){const c=input('conversion-confirmed');if(c)c.checked=confirmBefore;}
  patches.clear();render();status.textContent='Autofill undone. '+(result.kept.length?'Your later edits were kept.':'Previous field values restored.');status.focus({preventScroll:true});
 }
 async function load(){
  if(busy)return;
  if(!navigator.onLine){status.textContent='You’re offline. Your answers are unchanged. Reconnect and try again.';return;}
  busy=true;panel.setAttribute('aria-busy','true');status.textContent='Checking your saved details…';
  try{const data=await request('/game/'+encodeURIComponent(tenantId)+'/autofill?form='+kind);if(disposed)return;result=data;render();const found=candidates().filter(r=>r.status==='found').length;status.textContent=found?found+' saved '+(found===1?'detail is':'details are')+' ready for review. Nothing has been filled yet.':data.confirmed?'No empty fields match another saved detail. Your current answers were kept.':'Confirm your saved business facts in the questionnaire before reusing them.';}
  catch{if(!disposed)status.textContent='Saved details could not load. Your answers are unchanged. Try again.';}
  finally{busy=false;if(!disposed)panel.setAttribute('aria-busy','false');}
 }
 function render(){
  controls.replaceChildren();rows.replaceChildren();
  if(!['admin','owner','editor'].includes(role)){status.textContent='Read-only access. Ask an owner or editor to fill and save details.';return;}
  controls.append(button(result?'Check saved details again':'Fill from saved details',load,'gameAutofill'));
  if(!result)return;
  const list=candidates(),found=list.filter(r=>r.status==='found'),kept=list.filter(r=>r.status==='kept'&&!patches.has(r.field));
  const summary=el('p',found.length+' ready to confirm · '+patches.size+' added · '+kept.length+' existing answers kept · 0 sections written');summary.dataset.gameAutofillSummary='';rows.append(summary);
  if(found.length)controls.append(button('Confirm all saved details',()=>apply(found.map(r=>r.field)),'gameAutofillConfirmAll'));
  if(patches.size)controls.append(button('Undo autofill',undo,'gameAutofillUndo'));
  for(const row of list.filter(r=>r.status!=='kept'||patches.has(r.field))){
   const added=patches.has(row.field),card=el('article',null,'bv-game-autofill-row '+(added||row.status==='found'?'bv-game-autofill-found':'bv-game-autofill-missing'));card.dataset.autofillField=row.field;
   card.append(el('strong',row.label),el('span',added?'Added · not saved':row.status==='found'?'Found · not final':'Not found'),el('p',row.value||'No saved detail is available to reuse. Enter this answer in the form.'),el('small',row.source));
   if(!added&&row.status==='found'){const actions=el('div',null,'bv-game-autofill-actions');actions.append(button('Confirm',()=>apply([row.field])),button('Edit in form',()=>{input(row.field)?.focus();input(row.field)?.scrollIntoView({block:'center'});}));card.append(actions);}
   rows.append(card);
  }
  const manual=el('div',null,'bv-game-autofill-row bv-game-autofill-needs');manual.append(el('strong','Needs you'),el('p','Prices, financing, warranties, service-area limits, licenses, experience and owner photos are never autofilled.'));rows.append(manual);
  const connections=el('details',null,'bv-game-autofill-connections');connections.append(el('summary','Online sources · Not connected'));
  for(const c of result.connections)connections.append(el('p',c.name+' — Not connected. '+c.reason));rows.append(connections);
 }
 const touched=e=>{if(applying)return;const name=e.target.name;if(name){dirty.add(name);if(name.startsWith('conversion-'))confirmationTouched=true;}};
 form.addEventListener('input',touched);form.addEventListener('change',touched);
 status.tabIndex=-1;render();
 return {destroy(){disposed=true;form.removeEventListener('input',touched);form.removeEventListener('change',touched);panel.remove();}};
}
