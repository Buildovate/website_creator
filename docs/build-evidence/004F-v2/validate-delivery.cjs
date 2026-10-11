const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{spawnSync}=require('node:child_process');
const root=process.cwd(),out=path.join(root,'docs/build-evidence/004F-v2'),ffprobe=process.env.FFPROBE||'ffprobe';
const reports=[];
for(const [aspect,format,width,height,frames,budget] of [['16x9','mp4',1920,1080,181,4000000],['16x9','webm',1440,810,181,4500000],['9x16','mp4',1080,1920,121,2000000],['9x16','webm',720,1280,121,2500000]]){
 const name=`roofing-drone-dive-${aspect}.${format}`,file=path.join(root,'public/assets/trade-motion',name);
 const p=spawnSync(ffprobe,['-v','error','-show_frames','-show_entries','stream=codec_type,codec_name,width,height:frame=key_frame,media_type:format=duration,size','-of','json',file],{encoding:'utf8'});assert.equal(p.status,0,p.stderr);
 const probe=JSON.parse(p.stdout),keys=probe.frames.flatMap((f,i)=>f.key_frame?[i]:[]),maxGap=Math.max(...keys.slice(1).map((k,i)=>k-keys[i]));
 assert.equal(probe.streams.length,1);assert.equal(probe.streams[0].codec_type,'video');assert.equal(probe.streams[0].width,width);assert.equal(probe.streams[0].height,height);assert.equal(probe.frames.length,frames);assert.equal(maxGap,6);assert.ok(Number(probe.format.size)<budget);
 reports.push({file:name,...probe.streams[0],frames,duration:probe.format.duration,bytes:Number(probe.format.size),budget,keyframeIndices:keys,maxKeyframeGap:maxGap});
}
fs.writeFileSync(path.join(out,'delivery-validation.json'),JSON.stringify(reports,null,2)+'\n');console.log('PASS 4 delivery files: exact dimensions, full frame counts, six-frame GOP, no audio and format-specific byte budgets.');
