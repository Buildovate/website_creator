const {default:lighthouse}=await import(process.env.LIGHTHOUSE_MODULE||'file:///C:/Users/joe/OneDrive/Documents/ChatGPT/Buildovate%20-%20Website%20Design/ticket004-work/004H/tools/node_modules/lighthouse/core/index.js');
import {createRequire} from 'node:module';
import {writeFileSync,readFileSync,existsSync} from 'node:fs';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out='C:/Users/joe/website_creator/docs/build-evidence/004I-v2',ledger=out+'/finish-lighthouse-summary.json';
const results=existsSync(ledger)?JSON.parse(readFileSync(ledger)):[];
if(results.length>=6)throw Error('Six-audit limit reached');
const name=process.argv[2]||'bold',url=process.argv[3]||'http://127.0.0.1:8120/s/motion-bold-industrial-a';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--remote-debugging-port=9230']});
try{
 const r=await lighthouse(url,{port:9230,onlyCategories:['performance','accessibility'],output:['json','html'],logLevel:'error'}),n=results.length+1;
 writeFileSync(out+`/finish-attempt-${n}-${name}.report.json`,r.report[0]);writeFileSync(out+`/finish-attempt-${n}-${name}.report.html`,r.report[1]);
 const l=r.lhr,result={attempt:n,name,url,performance:l.categories.performance.score*100,accessibility:l.categories.accessibility.score*100,cls:l.audits['cumulative-layout-shift'].numericValue,lcpMs:l.audits['largest-contentful-paint'].numericValue,tbtMs:l.audits['total-blocking-time'].numericValue,version:l.lighthouseVersion};results.push(result);writeFileSync(ledger,JSON.stringify(results,null,2));console.log(JSON.stringify(result));
}finally{await browser.close()}
