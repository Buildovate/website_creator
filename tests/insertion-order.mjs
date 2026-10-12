import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createPgliteExecutor} from '../src/aws/pglite.js';
import {applyMigrations} from '../src/aws/migrate.js';
import {loadDrizzleStatements} from '../src/aws/ddl.js';
const newer=loadDrizzleStatements('drizzle').filter(x=>x.file==='0010_insertion_order.sql');
const timestamp='2026-01-01T00:00:00.000Z',oldIds=['z-old','a-old','m-old'];let checks=0;
const same=(a,b)=>{assert.deepEqual(a,b);checks++};
const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');
for(const file of fs.readdirSync('drizzle').filter(x=>x.endsWith('.sql')&&x!=='0010_insertion_order.sql').sort())sqlite.exec(fs.readFileSync('drizzle/'+file,'utf8'));
const pg=await createPgliteExecutor('');
try{
 // A populated pre-migration database; replay the real migration runner on upgrade.
 await pg.query('CREATE TABLE schema_migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
 for(const entry of newer)await pg.query('INSERT INTO schema_migrations(id) VALUES($1)',[entry.id]);
 await applyMigrations(pg.query);
 const seed=["INSERT INTO tenants(id,slug,name,settings,created_at,updated_at) VALUES('order-tenant','order-tenant','Order fixture','{}','2026-01-01','2026-01-01')", "INSERT INTO chat_threads(id,tenant_id,token_hash,reference,name,ip_hash,expires_at,created_at,updated_at) VALUES('order-thread','order-tenant','fixture','ORDERTEST','Fixture','fixture','2099-01-01','2026-01-01','2026-01-01')"];
 for(const sql of seed){sqlite.exec(sql);await pg.query(sql)}
 async function insert(table,id){const sql=table==='payment_audit'?`INSERT INTO payment_audit(id,tenant_id,action,detail,created_at) VALUES('${id}','order-tenant','addon.delivery.delivered','fixture','${timestamp}')`:`INSERT INTO chat_messages(id,thread_id,sender,body,created_at) VALUES('${id}','order-thread','visitor','fixture','${timestamp}')`;sqlite.exec(sql);await pg.query(sql)}
 for(const table of ['payment_audit','chat_messages'])for(const id of oldIds)await insert(table,id);
 const before={};for(const table of ['payment_audit','chat_messages'])before[table]=sqlite.prepare('SELECT id,rowid FROM '+table+' ORDER BY rowid').all().map(x=>({id:x.id,rowid:Number(x.rowid)}));
 sqlite.exec(fs.readFileSync('drizzle/0010_insertion_order.sql','utf8'));
 for(const entry of newer)await pg.query('DELETE FROM schema_migrations WHERE id=$1',[entry.id]);
 same((await applyMigrations(pg.query)).applied,newer.length);
 for(const table of ['payment_audit','chat_messages']){
  same(sqlite.prepare('SELECT id,insertion_seq FROM '+table+' ORDER BY insertion_seq,id').all().map(x=>({id:x.id,rowid:Number(x.insertion_seq)})),before[table]);
  same((await pg.query('SELECT id FROM '+table+' ORDER BY insertion_seq,id')).rows.map(x=>x.id),oldIds);
  await insert(table,'b-new');await insert(table,'0-last');
  const ids=[...oldIds,'b-new','0-last'];
  same(sqlite.prepare('SELECT id FROM '+table+' ORDER BY insertion_seq,id').all().map(x=>x.id),ids);
  same((await pg.query('SELECT id FROM '+table+' ORDER BY insertion_seq,id')).rows.map(x=>x.id),ids);
  const oldMax=Number(sqlite.prepare('SELECT MAX(insertion_seq) AS n FROM '+table).get().n),pgMax=Number((await pg.query('SELECT MAX(insertion_seq) AS n FROM '+table)).rows[0].n);
  sqlite.exec(`DELETE FROM ${table} WHERE id='0-last'`);await pg.query(`DELETE FROM ${table} WHERE id='0-last'`);await insert(table,'delete-retry');
  assert.ok(Number(sqlite.prepare(`SELECT insertion_seq FROM ${table} WHERE id='delete-retry'`).get().insertion_seq)>oldMax);checks++;
  assert.ok(Number((await pg.query(`SELECT insertion_seq FROM ${table} WHERE id='delete-retry'`)).rows[0].insertion_seq)>pgMax);checks++;
  same((await pg.query(`SELECT data_type,is_identity FROM information_schema.columns WHERE table_name='${table}' AND column_name='insertion_seq'`)).rows,[{data_type:'bigint',is_identity:'YES'}]);
 }
 same((await applyMigrations(pg.query)).applied,0);
 console.log(`PASS insertion-order: ${checks} checks; PostgreSQL identity upgrade and identical-timestamp ordering, SQLite exact rowid backfill, monotonic inserts after delete, idempotent PostgreSQL migration.`);
}finally{sqlite.close();await pg.close()}
