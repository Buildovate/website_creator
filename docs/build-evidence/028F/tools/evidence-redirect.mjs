import fs from 'node:fs';import fsp from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';import {syncBuiltinESMExports} from 'node:module';
// Redirect this run's legacy evidence writes. Original fixtures continue to be read unchanged.
const root='C:/Users/joe/website_creator/docs/build-evidence/',out=root+'028F/legacy/'+process.env.BV_CHECK_LABEL+'/';
const mkdir=fs.mkdirSync.bind(fs),exists=fs.existsSync.bind(fs);
function mapped(p,writing=false){if(!(typeof p==='string'||p instanceof URL))return p;const raw=p instanceof URL?fileURLToPath(p):p,abs=path.resolve(raw).replaceAll('\\','/');if(!abs.toLowerCase().startsWith(root.toLowerCase())||abs.toLowerCase().startsWith((root+'028F/').toLowerCase()))return p;const dest=out+abs.slice(root.length);if(writing){mkdir(path.dirname(dest),{recursive:true});return dest}return exists(dest)?dest:p}
for(const name of ['writeFileSync','appendFileSync','mkdirSync','createWriteStream']){const original=fs[name].bind(fs);fs[name]=(p,...args)=>original(mapped(p,true),...args)}
for(const name of ['readFileSync','existsSync','statSync','readdirSync']){const original=fs[name].bind(fs);fs[name]=(p,...args)=>original(mapped(p),...args)}
for(const name of ['writeFile','appendFile','mkdir']){const original=fsp[name].bind(fsp);fsp[name]=(p,...args)=>original(mapped(p,true),...args);const callback=fs[name].bind(fs);fs[name]=(p,...args)=>callback(mapped(p,true),...args)}
for(const name of ['readFile','stat','readdir','access']){const original=fsp[name].bind(fsp);fsp[name]=(p,...args)=>original(mapped(p),...args)}
// Delete only this run's mapped marker, never the original evidence file.
{const unlink=fs.unlinkSync.bind(fs);fs.unlinkSync=(p,...args)=>unlink(mapped(p,true),...args);const asyncUnlink=fsp.unlink.bind(fsp);fsp.unlink=(p,...args)=>asyncUnlink(mapped(p,true),...args);const callback=fs.unlink.bind(fs);fs.unlink=(p,...args)=>callback(mapped(p,true),...args)}
syncBuiltinESMExports();
await import('./audit-captures.mjs');
