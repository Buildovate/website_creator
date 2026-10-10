// The worker configures its database before using the shared read contract.
let database;
export function configureEntitlements(db){if(!db?.prepare)throw new Error('Payment database is required.');database=db;}
const store=(db=database)=>{if(!db)throw new Error('Payment database is not configured.');return db;};
const first=(sql,...args)=>store().prepare(sql).bind(...args).first();
const rows=async(sql,...args)=>(await store().prepare(sql).bind(...args).all()).results;

export async function getPlan(tenantId,db){
  const state=await store(db).prepare('SELECT plan,status,renews_at,minimum_ends_at FROM payment_state WHERE tenant_id=?').bind(tenantId).first();
  return {plan:state?.plan??null,status:state?.status??'none',renewsAt:state?.renews_at??null,minimumEndsAt:state?.minimum_ends_at??null};
}
export async function listEntitlements(tenantId){
  const now=new Date().toISOString();
  const found=await rows("SELECT key,quantity,used,period_end,source FROM payment_entitlements WHERE tenant_id=? AND status='active' AND period_end>? ORDER BY key,period_end",tenantId,now);
  return found.map(row=>({key:row.key,quantity:row.quantity,used:row.used,periodEnd:row.period_end,source:row.source}));
}
export async function hasEntitlement(tenantId,key,db){
  const row=await store(db).prepare("SELECT 1 AS allowed FROM payment_entitlements WHERE tenant_id=? AND key=? AND status='active' AND period_end>? AND (quantity IS NULL OR used<quantity) LIMIT 1").bind(tenantId,key,new Date().toISOString()).first();
  return !!row;
}
