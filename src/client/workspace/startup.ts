type RunTask=(work:()=>Promise<void>)=>Promise<void>;
/** Initial-load recovery only. Failed saves keep their existing forms and values. */
export function startWorkspace(start:()=>Promise<void>,run:RunTask){
  const content=document.querySelector<HTMLElement>('#content');
  const attempt=()=>run(async()=>{
    content?.setAttribute('aria-busy','true');
    const status=document.querySelector<HTMLElement>('#status');
    if(status){status.textContent='';status.className='status';}
    try{await start();}
    catch(error){
      if(content){
        const panel=document.createElement('section');panel.className='panel workspace-load-error';panel.setAttribute('role','alert');
        const title=document.createElement('h1');title.textContent='Your workspace couldn’t load';
        const message=document.createElement('p');message.textContent='Check your connection and try again. Your saved websites have not been changed.';
        const retry=document.createElement('button');retry.type='button';retry.className='primary';retry.textContent='Try again';retry.onclick=()=>attempt();
        panel.append(title,message,retry);content.replaceChildren(panel);
      }
      throw error;
    }finally{content?.setAttribute('aria-busy','false');}
  });
  return attempt();
}
