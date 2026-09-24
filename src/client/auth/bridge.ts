import {confirmSignOut} from '../shared/confirm.js';
import { api,loadSession } from '../shared/api.js';
import {rememberReturn} from '../shared/session.js';
export {api};
export function signIn() {
  rememberReturn(location.pathname+location.search+location.hash);
  location.assign('/login');
}
document.addEventListener('click',async event=>{
  const element=event.target instanceof Element?event.target.closest('[data-auth-signout]'):null;
  if(!element) return;
  event.preventDefault();
  if(!await confirmSignOut()) return;
  try {
    const session=await loadSession();
    if(!session.user){location.assign('/login?signedOut=1');return;}
    const response=await fetch('/auth/logout',{method:'POST',credentials:'same-origin',headers:{'x-csrf-token':session.csrfToken||''}});
    const data=await response.json();
    if(!response.ok) throw new Error(data.error||'Unable to sign out.');
    location.assign(data.logoutUrl);
  }catch(error){const status=document.querySelector('#status');if(status)status.textContent=error instanceof Error?error.message:'Unable to sign out.';}
});
