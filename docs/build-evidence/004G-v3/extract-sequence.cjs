const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const sharp=require(process.env.SHARP_MODULE||'sharp');
const root=process.env.REPO_ROOT||process.cwd(),ffmpeg=process.env.FFMPEG||'ffmpeg';
const incoming=path.join(root,'docs/build-evidence/assets/roofing'),out=path.join(root,'public/assets/trade-motion/v3');
fs.mkdirSync(out,{recursive:true});
async function frame(file,time,width){const r=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-ss',String(time),'-i',file,'-frames:v','1','-vf',`scale=${width}:-2`,'-f','image2pipe','-vcodec','png','pipe:1'],{maxBuffer:20e6});if(r.status!==0)throw Error(String(r.stderr));return r.stdout;}
(async()=>{
 const report=[];
 for(const [mode,aspect,width,count,ceiling,still] of [['desktop','16x9',1440,60,4500000,'roofing-house-still.png'],['mobile','9x16',720,40,2500000,'roofing-house-still-9x16-v3.png']]){
  const height=mode==='desktop'?810:1280,dir=path.join(out,mode);fs.mkdirSync(dir,{recursive:true});
  const times=mode==='desktop'?[...Array.from({length:56},(_,i)=>i*4.917/55),5.5,191/24]:Array.from({length:38},(_,i)=>i*(119/24)/37);
  const source=path.join(incoming,`roofing-drone-dive-${aspect}-v3.mp4`),raw=[];
  for(const t of times)raw.push(await frame(source,t,width));
  const ending=await sharp(path.join(incoming,still)).resize(width,height,{fit:'fill'}).png().toBuffer();
  const overlay=await sharp(ending).ensureAlpha(.5).png().toBuffer();
  raw.push(await sharp(raw.at(-1)).composite([{input:overlay}]).png().toBuffer(),ending);
  let bytes=0,quality=72,files=[];
  do{files=[];bytes=0;for(let i=0;i<raw.length;i++){const file=path.join(dir,`${String(i).padStart(3,'0')}.webp`);await sharp(raw[i]).webp({quality:i===count-1?82:quality,effort:5}).toFile(file);const size=fs.statSync(file).size;files.push({frame:i,time:times[i]??null,bytes:size});bytes+=size;}if(bytes>ceiling)quality-=5;}while(bytes>ceiling&&quality>=42);
  if(bytes>ceiling)throw Error(`${mode} exceeds ceiling: ${bytes}`);
  fs.copyFileSync(path.join(dir,`${count-1}.webp`.padStart(8,'0')),path.join(out,`${mode}-still.webp`));
  report.push({mode,width,height,count,bytes,ceiling,quality,source:path.basename(source),still,files});
  console.log(JSON.stringify({mode,count,bytes,ceiling,quality}));
 }
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
