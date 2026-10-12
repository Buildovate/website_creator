import {configureEntitlements,hasEntitlement} from '../entitlements.js';

// These are the gated features with routes in the current workspace.
export const WORKSPACE_FEATURES=Object.freeze({
  pages:{key:'work.project_pages',plan:'all_in'},
  forms:{key:'forms.multi_step',plan:'growth'},
  followups:{key:'sms.inbox',plan:'growth'},
  visibility:{key:'seo.area',plan:'growth'},
  blog:{key:'blog.seo',plan:'all_in'},
  ai:{key:'site.base',plan:'website'}
});

export async function paidFeatureEnabled(env,tenantId,feature){
  const requirement=WORKSPACE_FEATURES[feature];
  if(!requirement||!tenantId||!env?.DB)return false;
  configureEntitlements(env.DB);
  return hasEntitlement(tenantId,requirement.key);
}
