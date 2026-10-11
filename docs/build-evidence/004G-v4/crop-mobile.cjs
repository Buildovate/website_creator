// Deterministic editorial crop of the approved source sequence; no generated pixels.
const fs=require('node:fs'),sharp=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root='C:/Users/joe/website_creator',source=root+'/public/assets/trade-motion/v3/mobile',out=root+'/public/assets/trade-motion/v4';
(async()=>{fs.mkdirSync(out+'/mobile',{recursive:true});const frames=[];
// Track the approaching roof, removing the unrelated foreground road/sidewalk.
const keys=[[0,330],[12,548],[24,768],[39,768]];
for(let i=0;i<40;i++){let k=keys.findIndex(v=>v[0]>=i);if(k===0)k=1;const a=keys[k-1],b=keys[k],top=Math.round(a[1]+(b[1]-a[1])*(i-a[0])/(b[0]-a[0]));const file=String(i).padStart(3,'0')+'.webp';await sharp(source+'/'+file).extract({left:216,top,width:288,height:512}).resize(720,1280).webp({quality:i===39?82:76,effort:5}).toFile(out+'/mobile/'+file);frames.push({frame:i,crop:{left:216,top,width:288,height:512},bytes:fs.statSync(out+'/mobile/'+file).size});}
fs.copyFileSync(out+'/mobile/039.webp',out+'/mobile-still.webp');const result={width:720,height:1280,count:40,bytes:frames.reduce((n,f)=>n+f.bytes,0),frames};fs.writeFileSync(out+'/manifest.json',JSON.stringify(result,null,2));fs.copyFileSync(__filename,root+'/docs/build-evidence/004G-v4/crop-mobile.cjs');console.log(JSON.stringify({count:40,bytes:result.bytes}));})().catch(e=>{console.error(e);process.exitCode=1});
