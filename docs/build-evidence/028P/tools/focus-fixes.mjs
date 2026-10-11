import fs from 'node:fs';const root='C:/Users/joe/website_creator';let p=root+'/src/client/workspace/platform-look.ts',s=fs.readFileSync(p,'utf8');s=s.replace(" window.addEventListener('resize',schedule);",` document.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const dialog=document.querySelector('dialog[open]');if(!dialog)return;
  const controls=[...dialog.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,summary,[tabindex]')].filter(el=>el.tabIndex>=0&&!el.matches(':disabled')&&visible(el));
  const first=controls[0],last=controls.at(-1);if(!first)return;
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 });
 document.addEventListener('click',event=>{
  const target=(event.target as Element).closest('[data-bv-dismiss]');const offer=target?.closest<HTMLElement>('.bv-offer');if(offer)offer.hidden=true;
 });
 window.addEventListener('resize',schedule);`);fs.writeFileSync(p,s);
p=root+'/tests/helpers/platform-inspection.mjs';s=fs.readFileSync(p,'utf8').replace('setup.count+4','setup.count*4+8').replace("scrollTo(x,y)},setup.scroll)","document.activeElement?.blur();scrollTo(x,y)},setup.scroll)");fs.writeFileSync(p,s);
