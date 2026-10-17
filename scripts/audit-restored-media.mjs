import fs from 'node:fs';
import path from 'node:path';
import {probe,pool} from './media-tools.mjs';
const root=process.env.MEDIA_ARCHIVE_ROOT;if(!root)throw Error('Set MEDIA_ARCHIVE_ROOT to verify original audio/timing.');
const file='public/media-quality.json',m=JSON.parse(fs.readFileSync(file));
await pool(m.assets.filter(a=>a.kind==='video'),4,async a=>{
 const crf=a.crf;Object.assign(a,await probe('public'+a.path));a.crf??=crf;
 const original=a.source.file.startsWith('archive/')?path.join(root,a.source.file.slice('archive/'.length)):'docs/build-evidence/MEDIA-RESTORE/pre-squash/'+a.source.file.slice('2211ea97/'.length);Object.assign(a.source,await probe(original));
 if(a.before){const archived='docs/build-evidence/MEDIA-RESTORE/before-assets/'+a.path.slice('/assets/'.length);if(fs.existsSync(archived))Object.assign(a.before,await probe(archived));}
});
fs.writeFileSync(file,JSON.stringify(m,null,2)+'\n');fs.writeFileSync('docs/build-evidence/MEDIA-RESTORE/restoration.json',JSON.stringify(m,null,2));
console.log('Audited native dimensions, frame rates, audio and timing for '+m.assets.filter(a=>a.kind==='video').length+' restored videos.');
