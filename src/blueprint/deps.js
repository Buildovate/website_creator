import * as payments from '../entitlements.js';
import * as domain from '../domain/state.js';
// These files belong to LAUNCH-PAY / 057A. Never create substitutes for them.
const contracts={getPlan:['../entitlements.js',v=>v&&['active','past_due','canceled','none'].includes(v.status)],hasEntitlement:['../entitlements.js',v=>typeof v==='boolean'],getDomainStatus:['../domain/state.js',v=>v&&['none','chosen','verifying','verified','connecting','live','failed'].includes(v.stage)],getSiteScanFacts:['../domain/site-scan.js',v=>Array.isArray(v)||!!(v&&typeof v==='object'&&Array.isArray(v.facts))]};
const disconnected=()=>({state:'not_connected'});
export function createDependencies({load,database}={}){
 return Object.fromEntries(Object.entries(contracts).map(([name,[path,valid]])=>[name,async(...args)=>{
  if(typeof args[0]!=='string'||!args[0].trim())throw new TypeError('A tenant ID is required.');
  const url=load?new URL(path,import.meta.url):null;let owner;
  try{owner=load?await load(url):path==='../entitlements.js'?payments:path==='../domain/state.js'?domain:{};}catch(error){
   // Do not mask a syntax/runtime error or a missing dependency inside an owner.
   if(error.code==='ERR_MODULE_NOT_FOUND'&&url&&error.url===url.href)return disconnected();
   throw error;
  }
  if(typeof owner?.[name]!=='function')return disconnected();
  const value=await owner[name](...args,...(!load&&database?[database]:[]));
  return valid(value)?value:disconnected();
 }]));
}
export const {getPlan,hasEntitlement,getDomainStatus,getSiteScanFacts}=createDependencies();
