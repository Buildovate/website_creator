import {paymentAvailability} from './lifecycle.js';
export async function paymentSiteAvailable(env,tenantId){return (await paymentAvailability(env,tenantId)).state==='live';}
