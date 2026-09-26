import fs from 'node:fs';import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import worker from '../../../dist/server/index.js';
const out='docs/build-evidence/004W-v4/media-audit';fs.mkdirSync(out,{recursive:true});
const refs=new Map();
function add(url,source){if(!url.startsWith('/')||url.startsWith('//'))return;url=url.split(/[?#]/)[0];if(!/\.(jpg|jpeg|png|webp|gif|svg|mp4|webm|avif|woff2?|css|js)$/i.test(url))return;if(!refs.has(url))refs.set(url,new Set());refs.get(url).add(source);}
function scan(text,source){for(const m of text.matchAll(/\/(?:[a-zA-Z0-9_@.-]+\/)*[a-zA-Z0-9_@.-]+\.(?:jpg|jpeg|png|webp|gif|svg|mp4|webm|avif|woff2?|css|js)\b/g))add(m[0],source);}
function walk(root){for(const f of fs.readdirSync(root,{withFileTypes:true})){const p=path.join(root,f.name);if(f.isDirectory())walk(p);else if(/\.(js|ts|json|html|css)$/.test(p))scan(fs.readFileSync(p,'utf8'),p.replaceAll('\\','/'));}}
walk('src');walk('public');
const sql=new DatabaseSync(':memory:');for(const f of fs.readdirSync('drizzle').filter(x=>x.endsWith('.sql')).sort())sql.exec(fs.readFileSync('drizzle/'+f,'utf8'));
sql.prepare('INSERT INTO admins(user_id,email,role,created_at) VALUES(?,?,?,?)').run('audit-owner','audit@example.test','admin',new Date().toISOString());
const DB={prepare(q){let args=[];return {bind(...a){args=a;return this},async first(){return sql.prepare(q).get(...args)||null},async all(){return {results:sql.prepare(q).all(...args)}},async run(){return {meta:{changes:Number(sql.prepare(q).run(...args).changes)}}}}}};
const kits=JSON.parse(fs.readFileSync('public/design-kits.json'));const rendered=[];
const recipes=JSON.parse(fs.readFileSync('public/design-recipes.json')).recipes;
for(const [id,kit]of Object.entries(kits))for(const layout of ['immersive','editorial','studio'])for(const variant of ['',...new Set(recipes.map(r=>r.query))]){
 const url='/design-preview/'+id+'/'+layout+variant;const response=await worker.fetch(new Request('https://audit.local'+url,{headers:{'oai-authenticated-user-id':'audit-owner','oai-authenticated-user-email':'audit@example.test'}}),{DB});const html=await response.text();scan(html,'render:'+url);
 const media=[...new Set(html.match(/\/assets\/[a-zA-Z0-9_./-]+\.(?:jpg|jpeg|png|webp|svg|mp4|webm)/g)||[])];rendered.push({trade:kit.trade,layout,variant,status:response.status,mediaCount:media.length,missing:media.filter(u=>!fs.existsSync('public'+u)),videoCount:(html.match(/<video\b/g)||[]).length,svgCount:(html.match(/<svg\b/g)||[]).length});
}
sql.close();
const inventory=[...refs].map(([url,sources])=>({url,sources:[...sources],local:fs.existsSync('public'+url),built:fs.existsSync('dist/client'+url)})).sort((a,b)=>a.url.localeCompare(b.url));
let next=0;async function check(){while(next<inventory.length){const item=inventory[next++];if(!item.url.startsWith('/assets/')&&!item.built)continue;try{const r=await fetch('https://preview.website.buildovate.com'+item.url,{headers:{Range:'bytes=0-0'},redirect:'manual',signal:AbortSignal.timeout(12000)});item.stagingStatus=r.status;item.contentType=r.headers.get('content-type');await r.body?.cancel();}catch(e){item.error=e.name;}}}
if(!process.argv.includes('--local'))await Promise.all(Array.from({length:5},check));
fs.writeFileSync(out+'/inventory.json',JSON.stringify(inventory,null,2));fs.writeFileSync(out+'/templates.json',JSON.stringify(rendered,null,2));
const summary={templates:rendered.length,renderErrors:rendered.filter(x=>x.status!==200).length,assets:inventory.filter(x=>x.url.startsWith('/assets/')).length,missingAssets:inventory.filter(x=>x.url.startsWith('/assets/')&&!x.local).length,stagingStatuses:inventory.reduce((a,x)=>(a[x.stagingStatus??'not checked']=(a[x.stagingStatus??'not checked']||0)+1,a),{}),missingByExtension:inventory.filter(x=>x.url.startsWith('/assets/')&&!x.local).reduce((a,x)=>(a[path.extname(x.url)]=(a[path.extname(x.url)]||0)+1,a),{}),rendered};
fs.writeFileSync(out+'/summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify({...summary,rendered:undefined}));
