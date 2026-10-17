import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {command,probe,hashFile,pool} from './media-tools.mjs';
const archive=process.env.MEDIA_ARCHIVE_ROOT;if(!archive)throw Error('Set MEDIA_ARCHIVE_ROOT.');
const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg',out='docs/build-evidence/MEDIA-RESTORE',file='public/media-quality.json',m=JSON.parse(fs.readFileSync(file)),rows=m.assets;
sharp.cache(false);
const legacy=JSON.parse(fs.readFileSync('docs/release/ASSET-ENCODING.json')),reverse=new Map(Object.entries(legacy.mapping).map(([a,b])=>[b,a]));
for(const a of rows){
 if(a.path.includes('/trade-motion/v4/'))continue;
 const logical=(a.variantOf||a.path).replace('/assets/','');let rel=reverse.get(logical)||logical;
 if(/planning\/.+-(960|1920)\.(mp4|webm)$/.test(rel))rel=rel.replace(/-(960|1920)\.(mp4|webm)$/,'-1920.mp4');
 const candidates=[path.join(archive,'public-assets-originals',rel),path.join(archive,'public-assets-originals',rel.replace('.webm','.mp4')),path.join(archive,'docs/build-evidence/assets/roofing',path.basename(rel).replace('.webm','.mp4'))];
 if(logical.includes('trade-motion/v3/')){const portrait=logical.includes('/mobile');candidates.unshift(path.join(archive,'docs/build-evidence/assets/roofing',logical.includes('-still')?(portrait?'roofing-house-still-9x16-v3.png':'roofing-house-still.png'):'roofing-drone-dive-'+(portrait?'9x16':'16x9')+'-v3.mp4'));}
 if(a.source.file.startsWith('2211ea97/'))candidates.push(out+'/pre-squash/'+a.source.file.slice('2211ea97/'.length));
 const found=candidates.find(f=>fs.existsSync(f)&&hashFile(f)===a.source.sha256);if(!found)throw Error('Original provenance cannot be resolved: '+a.path);
 a.source.file=path.resolve(found).startsWith(path.resolve(archive))?'archive/'+path.relative(archive,found).replaceAll('\\','/'):'2211ea97/'+path.relative(out+'/pre-squash',found).replaceAll('\\','/');
}

const original=a=>a.source.file.startsWith('archive/')?path.join(archive,a.source.file.slice(8)):out+'/pre-squash/'+a.source.file.slice('2211ea97/'.length);
// Ambient story films are also sought by the existing scroll-story controller.
await pool(rows.filter(a=>a.kind==='video'&&a.path.startsWith('/assets/films/')),3,async a=>{
 const src=original(a),target='public'+a.path,temp=target+'.restoring.mp4';
 await command(ffmpeg,['-v','error','-y','-i',src,'-map','0:v:0','-map','0:a?','-c:v','libx264','-preset','medium','-crf','18','-g','6','-keyint_min','6','-sc_threshold','0','-pix_fmt','yuv420p','-movflags','+faststart','-c:a','copy','-threads','2',temp]);fs.renameSync(temp,target);Object.assign(a,await probe(target),{scrub:true,crf:18,sha256:hashFile(target),bytes:fs.statSync(target).size,encoding:'libx264 CRF18'});
});
// Crop from fresh, uncompressed native frames rather than a previously encoded WebP.
const v3=JSON.parse(fs.readFileSync('public/assets/trade-motion/v3/manifest.json')),mobile=v3.find(s=>s.mode==='mobile'),v4=JSON.parse(fs.readFileSync('public/assets/trade-motion/v4/manifest.json'));
const rawDir=path.join(archive,'docs/build-evidence/assets/roofing'),clip=path.join(rawDir,mobile.source),still=path.join(rawDir,mobile.still);let previous;
for(const frame of v4.frames){
 const t=mobile.files[frame.frame].time;let png;
 if(t!==null){png=await command(ffmpeg,['-v','error','-ss',String(t),'-i',clip,'-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1']);png=await sharp(png).resize(1080,1920).png().toBuffer();previous=png;}
 else{png=await sharp(still).resize(1080,1920).png().toBuffer();if(frame.frame===38){const rgb=await sharp(png).removeAlpha().raw().toBuffer();const rgba=Buffer.alloc(1080*1920*4);for(let i=0,j=0;i<rgb.length;i+=3,j+=4){rgba[j]=rgb[i];rgba[j+1]=rgb[i+1];rgba[j+2]=rgb[i+2];rgba[j+3]=128}png=await sharp(previous).composite([{input:rgba,raw:{width:1080,height:1920,channels:4}}]).png().toBuffer();}}
 const rel='/assets/trade-motion/v4/mobile/'+String(frame.frame).padStart(3,'0')+'.webp',target='public'+rel,crop=Object.fromEntries(Object.entries(frame.crop).map(([k,v])=>[k,Math.round(v*1.5)]));
 await sharp(png).extract(crop).resize(1080,1920).webp({quality:90,effort:5}).toFile(target);
 Object.assign(rows.find(a=>a.path===rel),{sha256:hashFile(target),bytes:fs.statSync(target).size,source:{file:'archive/docs/build-evidence/assets/roofing/'+(t===null?mobile.still:mobile.source),sha256:hashFile(t===null?still:clip),width:1080,height:1920},encoding:'native source pixels, original camera crop, WebP quality 90'});frame.bytes=fs.statSync(target).size;
}
v4.bytes=v4.frames.reduce((n,f)=>n+f.bytes,0);fs.writeFileSync('public/assets/trade-motion/v4/manifest.json',JSON.stringify(v4,null,2)+'\n');
fs.copyFileSync('public/assets/trade-motion/v4/mobile/039.webp','public/assets/trade-motion/v4/mobile-still.webp');const final=rows.find(a=>a.path==='/assets/trade-motion/v4/mobile/039.webp');Object.assign(rows.find(a=>a.path==='/assets/trade-motion/v4/mobile-still.webp'),{sha256:final.sha256,bytes:final.bytes,source:final.source});
for(const a of rows.filter(a=>a.variantOf)){const parent=rows.find(x=>x.path===a.variantOf),src=original(parent);await sharp(src).resize({width:2880}).webp({quality:90,effort:5}).toFile('public'+a.path);a.sha256=hashFile('public'+a.path);a.bytes=fs.statSync('public'+a.path).size;}
const catalogFile='public/trade-media-library.json',catalog=JSON.parse(fs.readFileSync(catalogFile));
for(const a of Object.values(catalog.assets)){const q=rows.find(x=>x.path===a.url.split('?')[0]);if(!q)continue;if(a.sha256!==q.sha256)a.encodingRevisions=[...(a.encodingRevisions||[]),{sha256:a.sha256,url:a.url}];a.sha256=q.sha256;a.bytes=q.bytes;a.width=q.width;a.height=q.height;a.qualityRestoration=1;}
fs.writeFileSync(catalogFile,JSON.stringify(catalog,null,2)+'\n');
fs.writeFileSync(file,JSON.stringify(m,null,2)+'\n');fs.writeFileSync(out+'/restoration.json',JSON.stringify(m,null,2));
const csv=value=>'"'+String(value??'').replaceAll('"','""')+'"';
fs.writeFileSync(out+'/ffprobe-assets.csv',['asset,type,source,before_resolution,before_bitrate,before_keyframes,after_resolution,after_bitrate,after_keyframes,max_keyframe_gap,crf,still_quality,bytes',...rows.map(a=>[a.path,a.kind,a.source.file,a.before?a.before.width+'x'+a.before.height:'',a.before?.bitrate,a.before?.keyframes,a.width+'x'+a.height,a.bitrate,a.keyframes,a.maxKeyframeGap,a.crf,a.quality,a.bytes].map(csv).join(','))].join('\n')+'\n');
fs.writeFileSync(out+'/missing-originals.txt',m.missingOriginals.length?m.missingOriginals.join('\n'):'None. All 820 original public assets were found.\n');
console.log('Finalized native-source derivatives, scroll-film GOPs, catalog revisions and per-asset probe table.');
