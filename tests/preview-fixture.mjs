
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import worker from '../dist/server/index.js';
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');for(const file of readdirSync('./drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync('./drizzle/'+file,'utf8'));
const DB={prepare(query){let args=[];const statement={bind(...values){args=values;return statement},async first(){return sql.prepare(query).get(...args)||null},async all(){return {results:sql.prepare(query).all(...args)}},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}}}};return statement},async batch(statements){sql.exec('BEGIN');try{const result=[];for(const statement of statements)result.push(await statement.run());sql.exec('COMMIT');return result}catch(error){sql.exec('ROLLBACK');throw error}}};
const objects=new Map();let putHook=null;
const BUCKET={async put(key,value){const raw=value instanceof Uint8Array?value:new Uint8Array(await new Response(value).arrayBuffer());objects.set(key,raw);if(putHook)putHook(key)},async get(key){if(!objects.has(key))return null;const raw=objects.get(key);return {body:raw,text:async()=>new TextDecoder().decode(raw)}},async head(key){return objects.has(key)?{size:objects.get(key).length}:null},async delete(key){objects.delete(key)}};
const env={DB,BUCKET},admin={id:'admin',email:'yoelengel18@gmail.com'},alice={id:'alice',email:'alice@example.test'},bob={id:'bob',email:'bob@example.test'},viewer={id:'viewer',email:'viewer@example.test'};
async function request(path,method='GET',value,user=admin,origin='https://test.local'){return worker.fetch(new Request('https://test.local'+path,{method,headers:{origin,'Content-Type':value instanceof Uint8Array?'image/jpeg':'application/json',...(user?{'oai-authenticated-user-id':user.id,'oai-authenticated-user-email':user.email}:{})},body:value instanceof Uint8Array?value:value?JSON.stringify(value):undefined}),env)}
async function api(path,method='GET',value,user=admin){const r=await request('/api'+path,method,value,user);const d=await r.json();if(!r.ok)throw Error(JSON.stringify(d));return d}

await api('/setup','POST',{});
let tenant=(await api('/tenants','POST',{preset:'robles',slug:'robles-roofing'})).tenant;
await api('/tenants/'+tenant.id+'/publish','POST',{approved:true,version:tenant.version});
for(const [city,service,lat,lng] of [['Oxnard','Roof repair',34.1975,-119.1771],['Ventura','Roof replacement',34.2746,-119.229]]){
 const data={title:'QA example — '+service,city,service,material:'Asphalt shingle',concern:'Leak',property:'Residential',completedAt:'2025-01-01',lat,lng,problem:'Test-only sample documentation, not an actual customer project.',work:'Test-only sample work description, not work attributed to Robles Roofing.',outcome:'Test-only sample outcome for local integration verification.',approved:true};
 const {id}=await api('/tenants/'+tenant.id+'/projects','POST',data);
 const before=await api('/tenants/'+tenant.id+'/photos?projectId='+id+'&stage=before&caption=Test-only%20stock%20photo','POST',new Uint8Array(readFileSync('./public/assets/roofing.jpg')));
 const after=await api('/tenants/'+tenant.id+'/photos?projectId='+id+'&stage=after&caption=Test-only%20stock%20photo','POST',new Uint8Array(readFileSync('./public/assets/finished-roof.jpg')));
 await api('/tenants/'+tenant.id+'/projects/'+id,'PUT',{data:{...data,beforeId:before.id,afterId:after.id},version:1});
 await api('/tenants/'+tenant.id+'/projects/'+id+'/publish','POST',{version:2});
}
export {worker,env,admin};
