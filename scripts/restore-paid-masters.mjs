import fs from 'node:fs';
import path from 'node:path';
import {command,probe,hashFile,pool} from './media-tools.mjs';
const archive=process.env.MEDIA_ARCHIVE_ROOT;if(!archive)throw Error('Set MEDIA_ARCHIVE_ROOT.');
const m=JSON.parse(fs.readFileSync('public/media-quality.json')),ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
const master=a=>a.path.includes('/027A-part1/')?'027A-part1/trim-review/loop-master.mp4':a.path.includes('/024-')?'clips-phase2/024-take1/master.mp4':a.path.includes('/026-')?'clips-phase2/promotions-take1/026/master.mp4':'clips-phase2/027-take2/master.mp4';
await pool(m.assets.filter(a=>a.kind==='video'&&a.path.includes('/planning/')),3,async a=>{
 const rel=master(a),src=path.join(archive,'docs/build-evidence',rel),source=await probe(src),webm=a.path.endsWith('.webm'),target='public'+a.path,temp=target.replace(/\.(mp4|webm)$/,'.restoring.$1');
 const codec=webm?['-c:v','libvpx-vp9','-crf','18','-b:v','0','-deadline','good','-cpu-used','4']:['-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart'];
 const scrub=a.path.includes('/027-');await command(ffmpeg,['-v','error','-y','-i',src,'-t',String(a.before.duration),'-map','0:v:0','-map','0:a?',...codec,...(scrub?['-g','6','-keyint_min','6','-sc_threshold','0']:[]),'-c:a','copy','-threads','2',temp]);fs.renameSync(temp,target);
 Object.assign(a,await probe(target),{sha256:hashFile(target),bytes:fs.statSync(target).size,crf:18,scrub,source:{file:'archive/docs/build-evidence/'+rel,sha256:hashFile(src),...source},encoding:(webm?'libvpx-vp9':'libx264')+' CRF18 from paid native master'});console.log('Native paid master restored: '+a.path);
});
const f='public/trade-media-library.json',catalog=JSON.parse(fs.readFileSync(f));for(const a of Object.values(catalog.assets)){const q=m.assets.find(x=>x.path===a.url.split('?')[0]);if(!q||a.sha256===q.sha256)continue;a.encodingRevisions=[...(a.encodingRevisions||[]),{sha256:a.sha256,url:a.url}];a.sha256=q.sha256;a.bytes=q.bytes;a.width=q.width;a.height=q.height;}
fs.writeFileSync(f,JSON.stringify(catalog,null,2)+'\n');fs.writeFileSync('public/media-quality.json',JSON.stringify(m,null,2)+'\n');fs.writeFileSync('docs/build-evidence/MEDIA-RESTORE/restoration.json',JSON.stringify(m,null,2));
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';fs.writeFileSync('docs/build-evidence/MEDIA-RESTORE/ffprobe-assets.csv',['asset,type,source,before_resolution,before_bitrate,before_keyframes,after_resolution,after_bitrate,after_keyframes,max_keyframe_gap,crf,still_quality,bytes',...m.assets.map(a=>[a.path,a.kind,a.source.file,a.before?a.before.width+'x'+a.before.height:'',a.before?.bitrate,a.before?.keyframes,a.width+'x'+a.height,a.bitrate,a.keyframes,a.maxKeyframeGap,a.crf,a.quality,a.bytes].map(csv).join(','))].join('\n')+'\n');
