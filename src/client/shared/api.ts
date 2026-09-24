import type { Session } from './session.js';
let session:Session|null=null;
let boundUserId:string|undefined;
export const currentSession=()=>session;
export async function loadSession():Promise<Session> {
  let response:Response;
  try {response=await fetch('/api/session',{credentials:'same-origin',cache:'no-store'});}
  catch {throw new Error('Unable to load your session. Check your connection and retry.');}
  if(!response.ok) throw new Error('Unable to load your session. Please retry.');
  try {session=await response.json() as Session;}
  catch {throw new Error('Unable to load your session. Please retry.');}
  if(!boundUserId && session.user) boundUserId=session.user.id;
  return session;
}
export function sessionExpired() {
  if(document.querySelector('#auth-expired')) return;
  const banner=document.createElement('div'); banner.id='auth-expired';banner.className='notice';banner.setAttribute('role','alert');
  banner.append('Your session expired. Your unsaved form is still here. ');
  const link=document.createElement('a');link.href='/login?returnTo=%2F';link.target='_blank';link.rel='noopener';link.textContent='Sign in again in a new tab';
  banner.append(link,document.createTextNode(', then return here and retry.'));
  (document.querySelector('#status')||document.body).before(banner);
}
export async function api(path:string,method='GET',value?:unknown):Promise<any> {
  if(path==='/session' && method==='GET') return loadSession();
  const previousId=boundUserId;
  if(!['GET','HEAD'].includes(method)) {
    const latest=await loadSession();
    if(!latest.user){sessionExpired();throw new Error('Sign in again before saving. Your form has not been cleared.');}
    if(previousId && latest.user.id!==previousId) throw new Error('You signed in as a different user. Reopen this workspace before saving.');
  }
  const headers:Record<string,string>={'Content-Type':value instanceof Blob?'image/jpeg':'application/json'};
  if(session?.csrfToken) headers['x-csrf-token']=session.csrfToken;
  let response:Response;
  try {response=await fetch('/api'+path,{method,credentials:'same-origin',headers,body:value instanceof Blob?value:value===undefined?undefined:JSON.stringify(value)});}
  catch {throw new Error('Unable to reach the platform. Your form is still here; please retry.');}
  if(response.status===401) {sessionExpired();throw new Error('Sign in again before continuing. Your form has not been cleared.');}
  let data:any;try{data=await response.json();}catch{throw new Error('Unable to reach the platform. Your form is still here; please retry.');}
  if(!response.ok) throw new Error(data.error||'Request failed.');
  document.querySelector('#auth-expired')?.remove();
  return data;
}
