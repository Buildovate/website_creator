import {privateHtml} from './request-policy.js';
export const workspacePage=(url:URL)=>privateHtml(url)||url.pathname==='/login';
export function responseHeaders(url?:URL,appEnv='local'):Record<string,string>{
  const headers:Record<string,string>={
    'x-content-type-options':'nosniff',
    'referrer-policy':'strict-origin-when-cross-origin',
  };
  if(url&&(workspacePage(url)||url.pathname.startsWith('/auth/')||url.pathname.startsWith('/api/'))){
    headers['cache-control']='no-store';
  }
  if(url&&workspacePage(url)){
    // Allow the same-origin editor iframe, existing scripts, images and styles.
    headers['content-security-policy']="base-uri 'self'; object-src 'none'; frame-ancestors 'self'";
    headers['x-frame-options']='SAMEORIGIN';
    headers['x-robots-tag']='noindex, nofollow';
  }
  if(url?.protocol==='https:'&&appEnv!=='local'){
    headers['strict-transport-security']='max-age=31536000';
  }
  return headers;
}
