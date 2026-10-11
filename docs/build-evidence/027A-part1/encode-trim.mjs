import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const root='C:/Users/joe/website_creator',work='C:/Users/joe/OneDrive/Documents/ChatGPT/Buildovate - Website Design',out=root+'/docs/build-evidence/027A-part1',asset=root+'/public/assets/planning/027A-part1',ff=work+'/phase2-ffmpeg/ffmpeg-9.0.2-essentials_build/bin/ffmpeg.exe';
fs.mkdirSync(asset,{recursive:true});fs.mkdirSync(out+'/trim-review',{recursive:true});
const run=args=>execFileSync(ff,['-hide_banner','-loglevel','error','-n',...args],{stdio:'inherit'});
const input=root+'/docs/build-evidence/clips-phase2/025-take2/master.mp4';
// Six seconds (144 frames). The last twelve frames dissolve to the first image.
const filter="[0:v]trim=end_frame=144,setpts=PTS-STARTPTS,split[main][start];[start]trim=end_frame=1,setpts=PTS-STARTPTS,loop=loop=-1:size=1:start=0,trim=duration=6[first];[main][first]blend=all_expr='A*(1-min(1,max(0,(T-5.5)/(11/24))))+B*min(1,max(0,(T-5.5)/(11/24)))',format=yuv420p[out]";
run(['-i',input,'-filter_complex',filter,'-map','[out]','-t','6','-an','-c:v','libx264','-crf','18','-preset','slow','-movflags','+faststart',out+'/trim-review/loop-master.mp4']);
for(const width of [1920,960])for(const ext of ['mp4','webm']){const codec=ext==='mp4'?['-c:v','libx264','-crf',width===1920?'23':'25','-preset','slow','-movflags','+faststart']:['-c:v','libvpx-vp9','-b:v','0','-crf',width===1920?'33':'35','-row-mt','1','-cpu-used','2'];run(['-i',out+'/trim-review/loop-master.mp4','-an','-vf','scale='+width+':-2',...codec,asset+'/financing-'+width+'.'+ext]);}
for(const width of [1280,720])run(['-i',out+'/trim-review/loop-master.mp4','-frames:v','1','-vf','scale='+width+':-2','-c:v','libwebp','-quality','85',asset+'/financing-poster-'+width+'.webp']);
for(const [pct,frame] of [[0,0],[25,36],[50,72],[75,108],[100,143]])run(['-i',out+'/trim-review/loop-master.mp4','-vf','select=eq(n\\,'+frame+')','-frames:v','1',out+'/trim-review/frame-'+pct+'.png']);
for(const file of fs.readdirSync(work+'/part1-frames'))if(file.startsWith('sheet-'))fs.copyFileSync(work+'/part1-frames/'+file,out+'/trim-review/'+file);
const files=fs.readdirSync(asset).map(name=>({name,bytes:fs.statSync(asset+'/'+name).size,sha256:createHash('sha256').update(fs.readFileSync(asset+'/'+name)).digest('hex')}));
fs.writeFileSync(out+'/trim-review/manifest.json',JSON.stringify({source:input,sourceFrames:144,sourceRange:[0,6],seconds:6,fps:24,crossfadeSeconds:.5,framesReviewed:'All 144, contact sheets 01–12; no digits, text, planner or calendar markings',files,credits:0},null,2));console.log(JSON.stringify(files));
