const {spawnSync,spawn}=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
const root=process.env.REPO_ROOT||process.cwd(),out=process.env.EVIDENCE_DIR||__dirname;
const ffmpeg=process.env.FFMPEG||'ffmpeg',ffprobe=process.env.FFPROBE||'ffprobe';
function run(args){const r=spawnSync(ffmpeg,['-y','-hide_banner','-loglevel','error',...args],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);}
function probe(file){const r=spawnSync(ffprobe,['-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=codec_name,pix_fmt,width,height,r_frame_rate,nb_read_frames,duration:format=duration,size','-of','json',file],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);return JSON.parse(r.stdout);}
const jobs=[],report={inputs:{},outputs:{}};
for(const [aspect,width,rate] of [['16x9',1920,3200],['9x16',720,2100]]){
 const src=path.join(root,'docs/build-evidence/assets/roofing',`roofing-drone-dive-${aspect}.mp4`);report.inputs[aspect]=probe(src);const frames=Number(report.inputs[aspect].streams[0].nb_read_frames);if(!Number.isInteger(frames)||frames<2)throw Error("Invalid source frame count");
 for(const [label,n] of [['start',0],['middle',Math.floor((frames-1)/2)],['end',frames-1]])run(['-i',src,'-vf',`select=eq(n\\,${n}),scale=${aspect==='16x9'?960:540}:-2`,'-frames:v','1',path.join(out,`source-${aspect}-${label}.png`)]);
 for(const format of ['mp4','webm']){const dest=path.join(out,`roofing-drone-dive-${aspect}.${format}`);const common=['-i',src,'-map','0:v:0','-an','-vf',`scale=${format==='webm'&&aspect==='16x9'?1440:width}:-2`,'-r','24','-pix_fmt','yuv420p','-g','6'];const encode=format==='mp4'?['-c:v','libx264','-preset','slow','-crf','24','-maxrate',rate+'k','-bufsize',rate+'k','-keyint_min','6','-sc_threshold','0','-movflags','+faststart']:['-c:v','libvpx-vp9','-b:v',(aspect==='16x9'?1600:1000)+'k','-maxrate',aspect==='16x9'?'2200k':'1500k','-bufsize',aspect==='16x9'?'2200k':'1500k','-qmin','0','-qmax','63','-row-mt','1','-cpu-used','4'];jobs.push({aspect,format,dest,args:[...common,...encode,dest]});}
}
fs.writeFileSync(path.join(out,'source-probe.json'),JSON.stringify(report.inputs,null,2));
(async()=>{
 for(const job of jobs){
  if(job.format==='webm'){
   const log=path.join(out,`vp9-${job.aspect}`),args=job.args.slice(0,-1);
   run([...args,'-pass','1','-passlogfile',log,'-f','null','NUL']);
   run([...args,'-pass','2','-passlogfile',log,job.dest]);
   for(const name of fs.readdirSync(out).filter(n=>n.startsWith(`vp9-${job.aspect}`)))fs.unlinkSync(path.join(out,name));
  }else run(job.args);
  const info=probe(job.dest),bytes=fs.statSync(job.dest).size;
  if(bytes>=(job.aspect==='16x9'?4000000:2000000))throw Error('Budget exceeded: '+job.dest+' '+bytes);
  if(+info.streams[0].nb_read_frames!==+report.inputs[job.aspect].streams[0].nb_read_frames)throw Error('Lost source frames');
  report.outputs[path.basename(job.dest)]=info;console.log(path.basename(job.dest)+': '+bytes+' bytes');
 }
 fs.writeFileSync(path.join(out,'media-probe.json'),JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
