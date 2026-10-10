// Payment state controls canceled rentals, never pending past-due policy or legacy sites.
export async function paymentSiteAvailable(env,tenantId){
 const row=await env.DB.prepare('SELECT status,site_available,site_owned FROM payment_state WHERE tenant_id=?').bind(tenantId).first();
 return !row||row.site_owned===1||row.status!=='canceled'||row.site_available!==0;
}
