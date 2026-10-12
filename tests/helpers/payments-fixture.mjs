import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {createHmac} from 'node:crypto';
import {handleWebhook} from '../../src/payments/webhook.js';
import {configureEntitlements} from '../../src/entitlements.js';

export function paymentHarness(){
  const sql=new DatabaseSync(':memory:');
  sql.exec('PRAGMA foreign_keys=ON');
  for(const file of readdirSync('./drizzle').filter(name=>name.endsWith('.sql')).sort())sql.exec(readFileSync(`./drizzle/${file}`,'utf8'));
  sql.prepare("INSERT INTO tenants(id,slug,name,settings,created_at,updated_at) VALUES('tenant_123','pay-test','Pay Test','{}','2026-01-01','2026-01-01')").run();
  sql.prepare("INSERT INTO tenants(id,slug,name,settings,created_at,updated_at) VALUES('tenant_456','pay-other','Other','{}','2026-01-01','2026-01-01')").run();
  const DB={prepare(query){let args=[];const statement={bind(...values){args=values;return statement},async first(){return sql.prepare(query).get(...args)??null},async all(){return {results:sql.prepare(query).all(...args)}},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}}}};return statement;}};
  configureEntitlements(DB);
  const env={DB,STRIPE_SECRET_KEY:'sk_test_offline_fixture',STRIPE_WEBHOOK_SECRET:'whsec_offline_fixture'};
  async function send(event,{signature=true,raw=JSON.stringify(event)}={}){
    const t=Math.floor(Date.now()/1000);
    const digest=createHmac('sha256',env.STRIPE_WEBHOOK_SECRET).update(`${t}.${raw}`).digest('hex');
    const header=signature?{'stripe-signature':`t=${t},v1=${digest}`}:{'stripe-signature':'t=1,v1=bad'};
    return handleWebhook(new Request('http://localhost:5181/api/payments/webhook',{method:'POST',headers:header,body:raw}),env);
  }
  const event=(id,type,object,created=Math.floor(Date.now()/1000))=>({id,type,created,livemode:false,data:{object}});
  const session=(sku,amount,reference='pi_test_1')=>({id:`cs_${reference}`,mode:'payment',payment_status:'paid',amount_total:amount,payment_intent:reference,customer:'cus_test_1',metadata:{tenantId:'tenant_123',skus:sku}});
  const invoice=(id='in_test_1',sku='PLAN-WEBSITE-MONTH',amount=5000,start='2026-01-31T00:00:00.000Z',end='2026-02-28T00:00:00.000Z')=>({id,customer:'cus_test_1',metadata:{tenantId:'tenant_123'},payment_intent:`pi_${id}`,lines:{data:[{amount,period:{start:Math.floor(Date.parse(start)/1000),end:Math.floor(Date.parse(end)/1000)},price:{metadata:{sku}}}]}});
  return {sql,DB,env,send,event,session,invoice,close:()=>sql.close()};
}
