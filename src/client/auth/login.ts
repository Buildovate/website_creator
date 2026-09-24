import {safeReturnPath,rememberReturn,takeReturn} from '../shared/session.js';
const form=document.querySelector<HTMLFormElement>('#local-login');
if(form) {
  const fallback=safeReturnPath(form.dataset.returnTo||'/');
  if(location.hash && (fallback.startsWith('/join')||fallback.startsWith('/team-join'))) {
    rememberReturn(fallback+location.hash);
    history.replaceState(null,'',location.pathname+location.search);
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const button=form.querySelector<HTMLButtonElement>('button')!, status=document.querySelector<HTMLElement>('#login-status')!;
    button.disabled=true;status.textContent='Signing in…';
    try {
      const data=new FormData(form);
      const response=await fetch('/auth/local-session',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({email:data.get('email'),userId:data.get('userId'),returnTo:fallback})});
      const result=await response.json();
      if(!response.ok) throw new Error(result.error||'Unable to sign in.');
      location.assign(takeReturn(result.returnTo));
    }catch(error){status.textContent=error instanceof Error?error.message:'Unable to sign in. Please retry.';button.disabled=false;}
  });
}
