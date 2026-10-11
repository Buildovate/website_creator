// Run from the repository root; SHARP_MODULE may point at an installed sharp package.
const path=require('node:path'),fs=require('node:fs'),sharp=require(process.env.SHARP_MODULE||'sharp');
const root=process.env.REPO_ROOT||process.cwd(),out=path.join(root,'public/assets/roofing-fast');
(async()=>{fs.mkdirSync(out,{recursive:true});for(const width of [720,1440])for(const format of ['avif','webp']){
const file=path.join(out,`hero-${width}.${format}`);await sharp(path.join(root,'public/assets/build-films/roofing-finished.webp')).resize(width).toFormat(format,{quality:format==='avif'?48:76,effort:5}).toFile(file);console.log(path.basename(file),fs.statSync(file).size);
}})().catch(e=>{console.error(e);process.exit(1)});
