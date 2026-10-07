import fs from 'node:fs';import {syncBuiltinESMExports} from 'node:module';
// Artifact destination only. The existing test, worker, capture settings,
// detector, assertions, and original Sample packets are unchanged.
const out='C:/Users/joe/website_creator/docs/build-evidence/028F',fresh=out+'/checks/round8q-samples';
const mkdir=fs.mkdirSync.bind(fs),write=fs.writeFileSync.bind(fs);mkdir(fresh,{recursive:true});
const mapped=p=>{if(typeof p!=='string')return p;const normalized=p.replaceAll('\\','/');for(const group of ['packets','capture-readiness']){const prefix=out+'/'+group;if(normalized===prefix||normalized.startsWith(prefix+'/'))return fresh+'/'+group+normalized.slice(prefix.length);}return normalized===out+'/checks/qa-packets.json'?fresh+'/qa-packets.json':p;};
fs.mkdirSync=(p,...args)=>mkdir(mapped(p),...args);
fs.writeFileSync=(p,...args)=>write(mapped(p),...args);
syncBuiltinESMExports();
