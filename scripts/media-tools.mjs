import fs from 'node:fs';
import {spawn,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export const hashFile=file=>sha(fs.readFileSync(file));
export const walk=dir=>fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(dir+'/'+x.name):[dir+'/'+x.name]):[];
export async function pool(items,count,fn){let next=0;await Promise.all(Array.from({length:count},async()=>{while(next<items.length){const i=next++;await fn(items[i],i)}}))}
export function command(exe,args){return new Promise((resolve,reject)=>{const p=spawn(exe,args,{windowsHide:true,stdio:['ignore','pipe','pipe']});const data=[];let error='';p.stdout.on('data',x=>data.push(x));p.stderr.on('data',x=>error+=x);p.on('error',reject);p.on('exit',code=>code===0?resolve(Buffer.concat(data)):reject(Error(exe+' failed: '+error.slice(-1800))))})}
export async function probe(file){
 const p=JSON.parse(await command(process.env.FFPROBE_PATH||'ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height,codec_name,r_frame_rate,duration,bit_rate:format=duration,bit_rate:frame=key_frame','-of','json',file]));
 const v=p.streams[0],keys=(p.frames||[]).flatMap((x,i)=>x.key_frame?[i]:[]),gaps=keys.map((n,i)=>i?n-keys[i-1]:n+1);if(keys.length)gaps.push(p.frames.length-keys.at(-1));
 const audio=JSON.parse(await command(process.env.FFPROBE_PATH||'ffprobe',['-v','error','-select_streams','a','-show_entries','stream=codec_name,sample_rate,channels,channel_layout','-of','json',file])).streams||[];
 const raw=fs.readFileSync(file).toString('latin1'),crf=raw.match(/\bcrf=(\d+(?:\.\d+)?)/)?.[1];
 return {audio,width:v.width,height:v.height,codec:v.codec_name,fps:v.r_frame_rate,duration:Number(v.duration||p.format.duration),bitrate:Number(v.bit_rate||p.format.bit_rate),frames:p.frames?.length,keyframes:keys.length,maxKeyframeGap:Math.max(0,...gaps),crf:crf===undefined?null:Number(crf)};
}
export function gitOriginal(rel,destination){try{const b=execFileSync('git',['show','2211ea97:public/assets/'+rel],{maxBuffer:128*1024*1024,stdio:['ignore','pipe','ignore']});fs.mkdirSync(destination.slice(0,destination.lastIndexOf('/')),{recursive:true});fs.writeFileSync(destination,b);return destination}catch{return null}}
