import {api as sessionApi} from './api.js';

/** Sites supplies hosting identity; AWS uses our session and CSRF client. */
export async function api(path:string,method='GET',value?:unknown):Promise<any> {
  if ('BuildovateAuth' in window) return sessionApi(path,method,value);
  const response=await fetch('/api'+path,{
    method,credentials:'same-origin',
    headers:{'Content-Type':value instanceof Blob?'image/jpeg':'application/json'},
    body:value instanceof Blob?value:value?JSON.stringify(value):undefined,
  });
  let data;
  try {data=await response.json();}
  catch {throw new Error('Unable to reach the platform. Your form is still here; please retry.');}
  if(!response.ok) throw new Error(data.error||'Request failed.');
  return data;
}
