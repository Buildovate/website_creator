import fs from 'node:fs';
const root='C:/Users/joe/website_creator',base='http://127.0.0.1:5173';
const old=JSON.parse(fs.readFileSync(root+'/docs/build-evidence/027A-part2/qa-urls.json'));
const transient=/\/s\/(?:roofing-clips-phase2-qa|roofing-part1-qa|hvac-part1-qa|roofing-part2-qa|roofing-part2-frames)(?:\/|$)/;
const urls=[...new Set([...old.map(x=>x.url).filter(x=>!transient.test(x)),...['/services','/areas','/about','/faq','/contact','/legal','/thank-you','/services/roof-repair'].map(x=>base+'/s/robles-roofing'+x)])];
const result=[];
for(const url of urls){try{const r=await fetch(url,{redirect:'manual'});result.push({url,status:r.status})}catch(error){result.push({url,status:0,error:String(error)})}}
fs.writeFileSync(root+'/docs/build-evidence/028A/qa-current-urls.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({total:result.length,passed:result.filter(x=>x.status===200).length,failed:result.filter(x=>x.status!==200)}));
if(result.some(x=>x.status!==200))process.exitCode=1;
