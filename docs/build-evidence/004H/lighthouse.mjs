const {default:lighthouse}=await import(process.env.LIGHTHOUSE_MODULE||'lighthouse');
import {createRequire} from 'node:module';
import {writeFileSync} from 'node:fs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=new URL('.',import.meta.url).pathname.replace(/^\/(\w:)/,'$1');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--remote-debugging-port=9228']});
try{
 const results=[];
 for(const style of ['bold-industrial','clean-modern']){
  const result=await lighthouse('http://127.0.0.1:8104/s/motion-'+style+'-a',{port:9228,onlyCategories:['performance','accessibility'],output:['json','html'],logLevel:'error'});
  writeFileSync(out+'/lighthouse-'+style+'-mobile.report.json',result.report[0]);writeFileSync(out+'/lighthouse-'+style+'-mobile.report.html',result.report[1]);
  const r={style,performance:result.lhr.categories.performance.score*100,accessibility:result.lhr.categories.accessibility.score*100,cls:result.lhr.audits['cumulative-layout-shift'].numericValue,lcpMs:result.lhr.audits['largest-contentful-paint'].numericValue,version:result.lhr.lighthouseVersion};results.push(r);console.log(JSON.stringify(r));
 }
 writeFileSync(out+'/lighthouse-summary.json',JSON.stringify(results,null,2));
}finally{await browser.close()}
