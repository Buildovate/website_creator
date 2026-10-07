
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
import worker from './qa-source-worker.mjs';
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');for(const file of readdirSync('./drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('./drizzle/'+file,'utf8'));
const DB={prepare(query){let args=[];const statement={bind(...values){args=values;return statement},async first(){return sql.prepare(query).get(...args)||null},async all(){return {results:sql.prepare(query).all(...args)}},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}}}};return statement},async batch(statements){sql.exec('BEGIN');try{const result=[];for(const statement of statements)result.push(await statement.run());sql.exec('COMMIT');return result}catch(error){sql.exec('ROLLBACK');throw error}}};
const objects=new Map();let putHook=null;
const BUCKET={async put(key,value){const raw=value instanceof Uint8Array?value:new Uint8Array(await new Response(value).arrayBuffer());objects.set(key,raw);if(putHook)putHook(key)},async get(key){if(!objects.has(key))return null;const raw=objects.get(key);return {body:raw,text:async()=>new TextDecoder().decode(raw)}},async head(key){return objects.has(key)?{size:objects.get(key).length}:null},async delete(key){objects.delete(key)}};
const env={DB,BUCKET},admin={id:'admin',email:'yoelengel18@gmail.com'},alice={id:'alice',email:'alice@example.test'},bob={id:'bob',email:'bob@example.test'},viewer={id:'viewer',email:'viewer@example.test'};
async function request(path,method='GET',value,user=admin,origin='https://test.local'){return worker.fetch(new Request('https://test.local'+path,{method,headers:{origin,'Content-Type':value instanceof Uint8Array?'image/jpeg':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value instanceof Uint8Array?value:value?JSON.stringify(value):undefined}),env)}
async function api(path,method='GET',value,user=admin){const r=await request('/api'+path,method,value,user);const d=await r.json();if(!r.ok)throw Error(JSON.stringify(d));return d}

await api('/setup','POST',{});
let tenant=(await api('/tenants','POST',{preset:'robles',slug:'robles-roofing'})).tenant;
// This test exercises filtering, not successful publication. Verify the new gate,
// then seed an already-published baseline so draft/source isolation assertions
// remain unchanged. No approval record or passing QA report is fabricated.
const denied=await request('/api/tenants/'+tenant.id+'/publish','POST',{approved:true,version:tenant.version});
assert.equal(denied.status,409,'Missing QA must block publication');
assert.match((await denied.json()).error,/review packet|QA/i);
await DB.prepare("UPDATE tenants SET published=?,status='published' WHERE id=?").bind(JSON.stringify(tenant.settings),tenant.id).run();
export {worker,env,admin};
