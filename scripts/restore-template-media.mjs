// Originals only. Never read staging media as an input to an encode.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {walk,pool,command,probe,hashFile,gitOriginal} from './media-tools.mjs';
const archive=process.env.MEDIA_ARCHIVE_ROOT;if(!archive)throw Error('Set MEDIA_ARCHIVE_ROOT to the original evidence archive.');
const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg',out='docs/build-evidence/MEDIA-RESTORE',assets='public/assets';fs.mkdirSync(out,{recursive:true});fs.mkdirSync('docs/media',{recursive:true});
const old=JSON.parse(fs.readFileSync('docs/release/ASSET-ENCODING.json')),mapping=new Map(Object.entries(old.mapping).map(([a,b])=>[b,a]));
const all=JSON.parse(fs.readFileSync('docs/media/ORIGINAL-ASSETS.json')),missing=[],fallback=[],rows=[];
const prior=fs.existsSync('public/media-quality.json')?new Map(JSON.parse(fs.readFileSync('public/media-quality.json')).assets.map(a=>[a.path,a])):new Map();
const archiveFile=rel=>{const a=path.join(archive,'public-assets-originals',rel);if(fs.existsSync(a))return a;const b=gitOriginal(rel,out+'/pre-squash/'+rel);if(b)fallback.push(rel);else missing.push(rel);return b};
const sourceLabel=file=>path.resolve(file).startsWith(path.resolve(archive))?'archive/'+path.relative(archive,file).replaceAll('\\','/'):'2211ea97/'+file.replaceAll('\\','/').split('/pre-squash/')[1];
const sourceFor=(rel)=>{
 const original=mapping.get(rel)||rel;let candidate=original;
 // Legacy 960 filenames must no longer downsize a source that exists at 1920.
 if(/planning\/.+-(960|1920)\.(mp4|webm)$/.test(candidate))candidate=candidate.replace(/-(960|1920)\.(mp4|webm)$/,'-1920.mp4');
 if(candidate.startsWith('trade-motion/')&&/\.(mp4|webm)$/.test(candidate)){const name=path.basename(candidate).replace('.webm','.mp4'),raw=path.join(archive,'docs/build-evidence/assets/roofing',name);if(fs.existsSync(raw))return raw;}
 if(candidate.endsWith('.webm')&&fs.existsSync(path.join(archive,'public-assets-originals',candidate.replace('.webm','.mp4'))))candidate=candidate.replace('.webm','.mp4');
 return archiveFile(candidate)||archiveFile(original);
};
if(process.argv.includes('--plan')){for(const rel of all)sourceFor(rel);console.log(JSON.stringify({originals:all.length,missing,fallbacks:fallback}));process.exit(missing.length?1:0);}
if(!prior.size&&!fs.existsSync(out+'/before-assets'))fs.cpSync(assets,out+'/before-assets',{recursive:true});
const rasters=all.filter(x=>/\.(webp|avif|png|jpe?g)$/i.test(x)),videos=all.filter(x=>/\.(mp4|webm)$/i.test(x));
sharp.concurrency(2);sharp.cache(false);
await pool(rasters,4,async(rel,i)=>{
 const src=sourceFor(rel);if(!src)return;const target=assets+'/'+rel,meta=await sharp(fs.readFileSync(src)).metadata();fs.mkdirSync(path.dirname(target),{recursive:true});
 const role=/^(platform|domain-guides|owner-roofing|specialties)\//.test(rel)?'detail':'hero';
 const beforeFile=out+'/before-assets/'+rel,before=prior.get('/assets/'+rel)?.before||(fs.existsSync(beforeFile)?{...await sharp(fs.readFileSync(beforeFile)).metadata(),bytes:fs.statSync(beforeFile).size}:null);
 const bytes=await sharp(src).rotate().webp({quality:90,effort:5,smartSubsample:true}).toBuffer();fs.writeFileSync(target+'.restoring',bytes);fs.renameSync(target+'.restoring',target);
 rows.push({path:'/assets/'+rel,kind:'still',role,sha256:hashFile(target),bytes:bytes.length,width:meta.width,height:meta.height,quality:90,source:{file:sourceLabel(src),sha256:hashFile(src),width:meta.width,height:meta.height},before:before?{width:before.width,height:before.height,bytes:before.bytes}:null});
 if((i+1)%100===0)console.log('Restored stills '+(i+1)+'/'+rasters.length);
});
await pool(videos,3,async(rel,i)=>{
 const src=sourceFor(rel);if(!src)return;const target=assets+'/'+rel,scrub=/^(build-films|craft-films|trade-motion)\//.test(rel),source=await probe(src),before=prior.get('/assets/'+rel)?.before||await probe(out+'/before-assets/'+rel);fs.mkdirSync(path.dirname(target),{recursive:true});
 const isWebm=rel.endsWith('.webm'),copy=!isWebm&&source.crf!==null&&source.crf<=20&&(!scrub||source.maxKeyframeGap<=6);
 if(copy)fs.copyFileSync(src,target);else{const temp=target.replace(/\.(mp4|webm)$/,'.restoring.$1');const codec=isWebm?['-c:v','libvpx-vp9','-crf','18','-b:v','0','-deadline','good','-cpu-used','4']:['-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart'];
  await command(ffmpeg,['-v','error','-y','-i',src,'-map','0:v:0','-map','0:a?',...codec,...(scrub?['-g','6','-keyint_min','6','-sc_threshold','0']:[]),'-c:a','copy','-threads','2',temp]);fs.renameSync(temp,target);
 }
 const after=await probe(target);rows.push({path:'/assets/'+rel,kind:'video',role:'hero',scrub,sha256:hashFile(target),bytes:fs.statSync(target).size,...after,crf:after.crf??(copy?source.crf:18),source:{file:sourceLabel(src),sha256:hashFile(src),...source},before,encoding:copy?'original bytes':isWebm?'libvpx-vp9 CRF18':'libx264 CRF18'});
 console.log('Restored video '+(i+1)+'/'+videos.length+' '+rel+' '+after.width+'x'+after.height+' gap='+after.maxKeyframeGap);
});
// Restore non-media files too, without re-encoding fonts, scripts or vector art.
for(const rel of all.filter(x=>!rasters.includes(x)&&!videos.includes(x)&&!x.endsWith('manifest.json'))){const src=archiveFile(rel);if(src){fs.mkdirSync(path.dirname(assets+'/'+rel),{recursive:true});fs.copyFileSync(src,assets+'/'+rel)}}
// Native portrait / v3 masters are separate approved camera takes. Preserve v4 crops.
const rawDir=path.join(archive,'docs/build-evidence/assets/roofing');
for(const mode of ['16x9','9x16']){
 const raw=path.join(rawDir,'roofing-drone-dive-'+mode+'-v3.mp4');if(!fs.existsSync(raw)){missing.push('native drone '+mode);continue;}
 const rel='trade-motion/roofing-drone-dive-'+mode+'-v3.mp4',target=assets+'/'+rel;
 await command(ffmpeg,['-v','error','-y','-i',raw,'-map','0:v:0','-c:v','libx264','-preset','medium','-crf','18','-g','6','-keyint_min','6','-sc_threshold','0','-pix_fmt','yuv420p','-movflags','+faststart','-an','-threads','2',target]);
 rows.push({path:'/assets/'+rel,kind:'video',role:'hero',scrub:true,sha256:hashFile(target),bytes:fs.statSync(target).size,...await probe(target),source:{file:sourceLabel(raw),sha256:hashFile(raw),...await probe(raw)},encoding:'libx264 CRF18'});
}
// Rebuild the high-resolution frame sequence from the native masters at the same times.
const v3=JSON.parse(fs.readFileSync(assets+'/trade-motion/v3/manifest.json'));
for(const sequence of v3){
 const src=path.join(rawDir,sequence.source),still=path.join(rawDir,sequence.still),portrait=sequence.mode==='mobile',width=portrait?1080:1920,height=portrait?1920:1080;
 let previous;
 for(const frame of sequence.files){let image;
  if(frame.time!==null){const png=await command(ffmpeg,['-v','error','-ss',String(frame.time),'-i',src,'-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1']);image=await sharp(png).resize(width,height).png().toBuffer();previous=image;}
  else{image=await sharp(still).resize(width,height,{fit:'cover'}).png().toBuffer();if(frame.frame===sequence.count-2){const overlay=await sharp(image).ensureAlpha(.5).toBuffer();image=await sharp(previous).composite([{input:overlay}]).png().toBuffer();}}
  const rel='trade-motion/v3/'+sequence.mode+'/'+String(frame.frame).padStart(3,'0')+'.webp',target=assets+'/'+rel;await sharp(image).webp({quality:90,effort:5}).toFile(target);
  const row=rows.find(x=>x.path==='/assets/'+rel);Object.assign(row,{width,height,sha256:hashFile(target),bytes:fs.statSync(target).size,source:{file:sourceLabel(src),sha256:hashFile(src),width,height},quality:90});frame.bytes=row.bytes;
 }
 sequence.width=width;sequence.height=height;sequence.quality=90;sequence.bytes=sequence.files.reduce((n,f)=>n+f.bytes,0);delete sequence.ceiling;
 const stillRel='trade-motion/v3/'+sequence.mode+'-still.webp',stillTarget=assets+'/'+stillRel;await sharp(still).webp({quality:90,effort:5}).toFile(stillTarget);const sm=await sharp(still).metadata();Object.assign(rows.find(x=>x.path==='/assets/'+stillRel),{width:sm.width,height:sm.height,bytes:fs.statSync(stillTarget).size,sha256:hashFile(stillTarget),source:{file:sourceLabel(still),sha256:hashFile(still),width:sm.width,height:sm.height}});
}
fs.writeFileSync(assets+'/trade-motion/v3/manifest.json',JSON.stringify(v3,null,2)+'\n');
const v4=JSON.parse(fs.readFileSync(assets+'/trade-motion/v4/manifest.json'));
for(const frame of v4.frames){const src=assets+'/trade-motion/v3/mobile/'+String(frame.frame).padStart(3,'0')+'.webp',rel='trade-motion/v4/mobile/'+String(frame.frame).padStart(3,'0')+'.webp',target=assets+'/'+rel,crop=Object.fromEntries(Object.entries(frame.crop).map(([k,v])=>[k,Math.round(v*1.5)]));await sharp(src).extract(crop).resize(1080,1920).webp({quality:90,effort:5}).toFile(target);Object.assign(rows.find(x=>x.path==='/assets/'+rel),{width:1080,height:1920,bytes:fs.statSync(target).size,sha256:hashFile(target),source:{file:'native portrait frame '+frame.frame,width:1080,height:1920,sha256:hashFile(src)}});frame.bytes=fs.statSync(target).size;}
v4.width=1080;v4.height=1920;v4.quality=90;v4.bytes=v4.frames.reduce((n,f)=>n+f.bytes,0);fs.writeFileSync(assets+'/trade-motion/v4/manifest.json',JSON.stringify(v4,null,2)+'\n');
// Keep the landing still byte-identical to the last frame to avoid a visual jump.
fs.copyFileSync(assets+'/trade-motion/v4/mobile/039.webp',assets+'/trade-motion/v4/mobile-still.webp');Object.assign(rows.find(x=>x.path==='/assets/trade-motion/v4/mobile-still.webp'),{width:1080,height:1920,bytes:fs.statSync(assets+'/trade-motion/v4/mobile-still.webp').size,sha256:hashFile(assets+'/trade-motion/v4/mobile-still.webp')});
for(const row of [...rows].filter(x=>x.kind==='still'&&x.role==='hero'&&x.width>=2880)){
 const rel=row.path.replace('/assets/','').replace('.webp','-2880.webp'),target=assets+'/'+rel;await sharp(assets+'/'+row.path.slice(8)).resize({width:2880}).webp({quality:90,effort:5}).toFile(target);const m=await sharp(target).metadata();rows.push({...row,path:'/assets/'+rel,sha256:hashFile(target),bytes:fs.statSync(target).size,width:m.width,height:m.height,variantOf:row.path});row.hero2880='/assets/'+rel;
}
rows.sort((a,b)=>a.path.localeCompare(b.path));
const manifest={version:1,policy:{videoCRF:18,maximumCRF:20,scrubGOP:6,stillQuality:90,minimumStillQuality:80,neverDownscaleForSpeed:true},sourceCommit:'2211ea97',restoredFiles:all.length,missingOriginals:[...new Set(missing)],preSquashFallbacks:[...new Set(fallback)],assets:rows};
fs.writeFileSync('public/media-quality.json',JSON.stringify(manifest,null,2)+'\n');fs.writeFileSync(out+'/restoration.json',JSON.stringify(manifest,null,2));
console.log('RESTORED '+all.length+' files, '+rows.length+' quality entries; missing originals: '+manifest.missingOriginals.length);if(missing.length)process.exitCode=1;
