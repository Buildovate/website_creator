import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/027A-part1';process.chdir(root);
const {worker,env,admin}=await import(pathToFileURL(root+'/tests/preview-fixture.mjs'));
const entries=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/clips-phase2/outside-scope-baseline.json'));
const headers={'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email};
const mode=process.argv[2]||'after';if(mode==='before')throw Error('The pre-edit baseline is immutable.');fs.mkdirSync(out+'/'+mode,{recursive:true});const records=[];
for(const entry of entries){const {row}=entry,keys=Object.keys(row);await env.DB.prepare('INSERT INTO tenants('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')').bind(...keys.map(k=>row[k])).run();
 const urls=new Set(entry.pages.map(p=>p.url));
 for(const page of ['financing','promotions','faq'])urls.add('/s/'+row.slug+'/'+page+'?preview=1');
 for(const layout of ['immersive','editorial','studio'])urls.add('/design-preview/'+entry.id+'/'+layout);
 for(const url of urls){const response=await worker.fetch(new Request('https://test.local'+url,{headers}),env);const html=await response.text();const name=entry.id+'-'+records.length+'.html';fs.writeFileSync(out+'/'+mode+'/'+name,html);records.push({kit:entry.id,url,name,status:response.status,sha256:createHash('sha256').update(html).digest('hex')});if(response.status!==200)throw Error(url+' '+response.status);}
}
fs.writeFileSync(out+'/'+mode+'-responses.json',JSON.stringify(records,null,2));console.log(JSON.stringify({mode,kits:entries.length,responses:records.length}));
