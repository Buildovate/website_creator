import {access,must} from '../../core.js';
import {savedSuggestions} from './rules.js';
// No writes, provider calls, credentials, generated copy, or cross-tenant lookups.
export async function autofillApi(req,env,url,tenantId){
 const {tenant}=await access(req,env,tenantId,'write',{readOnly:true});
 must(req.method==='GET','Saved-detail suggestions are read-only.',405);
 const form=url.searchParams.get('form');
 must(['business','questionnaire'].includes(form),'Choose an existing Business or Questionnaire form.',400);
 return {tenantId:tenant.id,version:tenant.version,...savedSuggestions(JSON.parse(tenant.settings),form)};
}
