import assert from 'node:assert/strict';
import {configureEntitlements} from '../../src/entitlements.js';
import {paymentHarness} from './payments-fixture.mjs';
// Offline permission fixture. Real Website settlement comes from Pay's harness;
// higher-tier feature grants below are explicit test permissions, not invoices,
// catalog prices, provider activity or approval of an unapproved plan.
export async function seedWorkspaceEntitlements(DB,tenantId){
 const h=paymentHarness();try{
  const invoice=h.invoice('in_workspace_fixture','PLAN-WEBSITE-MONTH',5000,'2026-10-01T00:00:00.000Z','2099-01-01T00:00:00.000Z');
  assert.equal((await h.send(h.event('evt_workspace_fixture','invoice.paid',invoice))).status,200);
  const rows=await h.DB.prepare('SELECT * FROM payment_entitlements WHERE tenant_id=?').bind('tenant_123').all();
  const paid=(await h.DB.prepare('SELECT * FROM payment_ledger WHERE tenant_id=?').bind('tenant_123').all()).results[0];
  paid.id='fixture-ledger-'+tenantId;paid.tenant_id=tenantId;paid.reference='fixture-payment-'+tenantId;
  const columns=Object.keys(paid);await DB.prepare('INSERT INTO payment_ledger('+columns.join(',')+') VALUES('+columns.map(()=>'?').join(',')+') ON CONFLICT(id) DO NOTHING').bind(...columns.map(k=>paid[k])).run();
  const keys=new Set([...rows.results.map(r=>r.key),'work.project_pages','forms.multi_step','seo.area','blog.seo','sms.inbox']);
  for(const key of keys)await DB.prepare("INSERT INTO payment_entitlements(id,ledger_id,tenant_id,key,quantity,used,period_end,source,status) VALUES(?,?,?,?,NULL,0,?,'offline_permission_fixture','active') ON CONFLICT(id) DO NOTHING").bind('fixture-paid-'+tenantId+'-'+key,paid.id,tenantId,key,'2099-01-01T00:00:00.000Z').run();
 }finally{h.close();configureEntitlements(DB)}
}
