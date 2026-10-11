import fs from 'node:fs';import{execFileSync}from'node:child_process';import{frameMetrics}from'../../../../src/qa-video.js';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028F',bin=root+'/docs/build-evidence/028P/tools/bin/';
const lib=JSON.parse(fs.readFileSync(root+'/public/trade-media-library.json'));
const approved=Object.values(lib.assets).filter(x=>x.kind==='clip'&&x.approvalStatus==='approved');
const rejected=[['024-rejected',root+'/docs/build-evidence/clips-phase2/024-take1/master.mp4'],['025-rejected',root+'/docs/build-evidence/clips-phase2/025-take1/master.mp4'],['027-rejected',root+'/docs/build-evidence/clips-phase2/promotions-take1/027/master.mp4']].filter(x=>fs.existsSync(x[1]));
const inputs=[...approved.map(a=>({id:a.id,file:root+'/public'+a.url.split('?')[0],accepted:true})),...rejected.map(([id,file])=>({id,file,accepted:false}))];
fs.mkdirSync(out+'/calibration',{recursive:true});const rows=[];
for(const item of inputs){
 const probe=JSON.parse(execFileSync(bin+'ffprobe.exe',['-v','error','-show_entries','format=duration','-of','json',item.file]));const duration=+probe.format.duration,frames=[];
 for(const pct of [0,25,50,75,100]){const time=Math.min(duration*pct/100,duration-.05),args=['-v','error','-threads','1','-ss',String(time),'-i',item.file,'-frames:v','1','-vf','crop=iw*0.8:ih*0.8,scale=96:64','-f','rawvideo','-pix_fmt','rgba','pipe:1'];frames.push(execFileSync(bin+'ffmpeg.exe',args));}
 const measures=[25,50,75,100].map((pct,i)=>({pct,...frameMetrics(frames[0],frames[i+1])}));rows.push({id:item.id,accepted:item.accepted,file:item.file.replace(root+'/',''),duration,measures});
 console.log(item.id,JSON.stringify(measures));
}
fs.writeFileSync(out+'/checks/video-calibration-measures.json',JSON.stringify({method:'8x8 window SSIM grayscale; RGB 4x4x4 histogram total variation; central 80%, 96x64',rows},null,2));