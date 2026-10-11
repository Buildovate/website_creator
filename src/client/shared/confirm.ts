export function confirmSignOut():Promise<boolean>{
  return new Promise(resolve=>{
    const dialog=document.createElement('dialog');
    dialog.className='auth-confirm';
    dialog.setAttribute('aria-labelledby','signout-title');
    const title=document.createElement('h2');title.id='signout-title';title.textContent='Sign out of your workspace?';
    const message=document.createElement('p');message.textContent='Save any unsaved changes before signing out.';
    const actions=document.createElement('div');actions.className='auth-confirm-actions';
    const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Stay signed in';cancel.autofocus=true;
    const approve=document.createElement('button');approve.type='button';approve.className='primary';approve.textContent='Sign out';
    cancel.onclick=()=>dialog.close('cancel');approve.onclick=()=>dialog.close('confirm');
    actions.append(cancel,approve);dialog.append(title,message,actions);
    dialog.addEventListener('close',()=>{const accepted=dialog.returnValue==='confirm';dialog.remove();resolve(accepted);},{once:true});
    document.body.append(dialog);dialog.showModal();
  });
}
