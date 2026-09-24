import fs from 'node:fs';import path from 'node:path';
export function assertTemplateAssets(){
 const refs=new Map();
 function walk(root){for(const entry of fs.readdirSync(root,{withFileTypes:true})){const file=path.join(root,entry.name);if(entry.isDirectory()){if(entry.name!=='assets')walk(file);continue;}if(!/\.(?:js|ts|json|html|css)$/.test(file))continue;for(const m of fs.readFileSync(file,'utf8').matchAll(/\/assets\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpg|jpeg|svg|gif|mp4|webm|css|js|woff2?)\b/g))refs.set(m[0],file);}}
 walk('src');walk('public');
 const errors=[];for(const [url,source] of refs){const file='public'+url;if(!fs.existsSync(file)||!fs.statSync(file).isFile()||!fs.statSync(file).size)errors.push(url+' (referenced by '+source+')');}
 const kits=JSON.parse(fs.readFileSync('public/design-kits.json'));const trades=JSON.parse(fs.readFileSync('public/trade-library.json'));const art=JSON.parse(fs.readFileSync('public/service-art.json'));for(const [name,services] of Object.entries(trades)){if(!Object.values(kits).some(k=>k.trade===name))errors.push('Missing design kit: '+name);for(const service of services){const url=art[name]?.[service.toLowerCase()];if(!url||!fs.existsSync('public'+url))errors.push('Missing service artwork: '+name+' / '+service);}}
 if(errors.length)throw Error('Template asset integrity failed:\n'+errors.join('\n'));
 console.log('PASS template asset integrity: '+refs.size+' referenced files, '+Object.keys(kits).length+' trade kits.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve('scripts/check-template-assets.mjs'))assertTemplateAssets();
