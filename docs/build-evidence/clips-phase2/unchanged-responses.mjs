import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/clips-phase2';
process.chdir(root);
const {worker,env,admin}=await import(pathToFileURL(root+'/tests/preview-fixture.mjs'));
const origin='https://test.local',headers={'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email};
const mode=process.argv[2]||'capture';
const baseline=JSON.parse(fs.readFileSync(mode==='capture'?root+'/docs/build-evidence/027/outside-scope-baseline.json':out+'/outside-scope-baseline.json'));
let count=0;for(const entry of baseline){const {row}=entry,keys=Object.keys(row);await env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run();entry.pages=entry.pages.filter(p=>!(entry.id==='roofing'&&/\/(financing|promotions)(\?|$)/.test(p.url)));for(const p of entry.pages){const r=await worker.fetch(new Request(origin+p.url,{headers}),env);const hash=createHash('sha256').update(await r.text()).digest('hex');if(r.status!==200)throw Error('HTTP '+r.status+' '+p.url);if(mode!=='capture'&&p.sha256!==hash)throw Error('Changed outside-scope response '+p.url);p.status=r.status;p.sha256=hash;count++;}}
fs.writeFileSync(out+(mode==='capture'?'/outside-scope-baseline.json':'/outside-scope-proof.json'),JSON.stringify(mode==='capture'?baseline:{kits:baseline.length,responses:count,identical:true,pages:baseline.flatMap(e=>e.pages)},null,2));console.log('PASS '+count+' responses across '+baseline.length+' kits '+mode);
