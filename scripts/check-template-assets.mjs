import fs from 'node:fs';import path from 'node:path';
import {mayOmitLeafletImage} from '../src/leaflet-asset-policy.js';
export function assertTemplateAssets(){
 const refs=new Map(),addRef=(url,source)=>{if(!refs.has(url))refs.set(url,new Set());refs.get(url).add(source);};
 function walk(root){for(const entry of fs.readdirSync(root,{withFileTypes:true})){const file=path.join(root,entry.name);if(entry.isDirectory()){if(entry.name!=='assets')walk(file);continue;}if(!/\.(?:js|ts|json|html|css)$/.test(file))continue;for(const m of fs.readFileSync(file,'utf8').matchAll(/\/assets\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpg|jpeg|svg|gif|mp4|webm|css|js|woff2?)\b/g))addRef(m[0],file);}}
 walk('src');walk('public');
 // Resolve Leaflet's relative CSS URLs so the exporter's existing, referrer-scoped policy applies.
 const leaflet=path.join('public','assets','leaflet.css');
 if(fs.existsSync(leaflet))for(const m of fs.readFileSync(leaflet,'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)){const u=new URL(m[1].trim(),'https://asset-check.invalid/assets/leaflet.css');if(u.origin==='https://asset-check.invalid')addRef(u.pathname,leaflet);}
 const errors=[];for(const [url,sources] of refs){const file='public'+url,missing=!fs.existsSync(file);if(missing&&[...sources].every(source=>source===leaflet&&mayOmitLeafletImage(url,'/assets/leaflet.css')))continue;if(missing||!fs.statSync(file).isFile()||!fs.statSync(file).size)errors.push(url+' (referenced by '+[...sources].join(', ')+')');}
 const kits=JSON.parse(fs.readFileSync('public/design-kits.json'));const trades=JSON.parse(fs.readFileSync('public/trade-library.json'));const art=JSON.parse(fs.readFileSync('public/service-art.json'));for(const [name,services] of Object.entries(trades)){if(!Object.values(kits).some(k=>k.trade===name))errors.push('Missing design kit: '+name);for(const service of services){const url=art[name]?.[service.toLowerCase()];if(!url||!fs.existsSync('public'+url))errors.push('Missing service artwork: '+name+' / '+service);}}
 if(errors.length)throw Error('Template asset integrity failed:\n'+errors.join('\n'));
 console.log('PASS template asset integrity: '+refs.size+' referenced files, '+Object.keys(kits).length+' trade kits.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve('scripts/check-template-assets.mjs'))assertTemplateAssets();
