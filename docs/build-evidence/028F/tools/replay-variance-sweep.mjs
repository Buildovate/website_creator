// Diagnosis only: use the saved-version review capture unchanged, but observe all rasters.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {createReviewCapture} from '../../../../src/aws/review-capture.js';
import {createRuntime} from '../../../../src/aws/server.js';
import worker from '../../../../tests/helpers/qa-source-worker.mjs';
import {replayRequestGuard} from '../../../../tests/helpers/replay-request-guard.mjs';

const root='C:/Users/joe/website_creator';
const out=root+'/docs/build-evidence/028F';
const destination=out+'/checks/replay-variance-sweep.json';
const original=JSON.parse(fs.readFileSync(out+'/frame-initialization/before/qa-packets.json'));
const browserModule='C:/Users/joe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
const require=createRequire(import.meta.url);
const {chromium}=require(browserModule);
const {pixelProof}=require(root+'/tests/helpers/replay-alternate-registry.cjs');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const origin='http://127.0.0.1:8223';
const report={mode:'diagnosis only; no mismatch accepted or saved file changed',samples:[],varyingCaptures:[],pageSummaryLines:[],captureErrors:[],networkErrors:[],consoleErrors:[],totals:{savedPngs:0,attemptsPerSample:3,expectedCaptures:0,observedCaptures:0,fullPageScreenshots:0,varyingCaptures:0,outsideImageCaptures:0},providerCalls:0,credits:0};
const save=()=>fs.writeFileSync(destination,JSON.stringify(report,null,2));

let active=null;
const launch=chromium.launch.bind(chromium);
chromium.launch=async options=>{
  const browser=await launch(options),newContext=browser.newContext.bind(browser),attempt=active;
  browser.newContext=async settings=>{
    const context=await newContext(settings);
    context.on('page',page=>{
      attempt.guard.observe(page);
      const where=()=>{try{return page.url()}catch{return null}};
      page.on('console',message=>{if(message.type()==='error')attempt.events.consoleErrors.push({url:where(),message:message.text()})});
      page.on('pageerror',error=>attempt.events.consoleErrors.push({url:where(),message:String(error.stack||error.message||error)}));
      page.on('requestfailed',request=>attempt.events.failedRequests.push({url:request.url(),error:request.failure()?.errorText||'Request failed'}));
      page.on('response',response=>{if(response.status()>=400)attempt.events.httpErrors.push({url:response.url(),status:response.status()})});
    });
    return context;
  };
  return browser;
};

const capture=createReviewCapture({browserModule,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',onScreenshot:async({path,data,readiness})=>{
  const attempt=active,saved=attempt.baseline.get(path),sha256=hash(data);
  if(!saved){attempt.unexpected.push({path,sha256});return}
  const row={sha256,bytes:data.length};
  if(sha256!==saved.sha256){
    const images=(readiness.before.images||[]).map(img=>({url:img.currentSrc,natural:{width:img.naturalWidth,height:img.naturalHeight},rendered:img.rendered}));
    const rectangles=images.map(img=>img.rendered);
    try{
      const diff=pixelProof(saved.bytes,data,rectangles);
      Object.assign(row,{differingPixels:diff.changed,outsideImagePixels:diff.outside,insideImageRectangles:diff.outside===0,images,rectangles});
    }catch(error){Object.assign(row,{insideImageRectangles:false,diffError:String(error.message||error),images,rectangles})}
  }
  attempt.captures[path]=row;
}});

const runtime=await createRuntime({worker,reviewCapture:async args=>{
  const sample=report.samples.at(-1),baseline=sample.baseline;
  let lastSuccess=null;
  for(let number=1;number<=3;number++){
    const guard=replayRequestGuard(),events={consoleErrors:[],failedRequests:[],httpErrors:[]};
    const attempt={number,baseline,guard,events,captures:{},unexpected:[],status:'running'};
    sample.attempts.push(attempt);active=attempt;
    try{
      const result=await capture({...args,fetch:guard.wrap(args.fetch)});
      attempt.status='Complete';lastSuccess=result;
    }catch(error){
      attempt.status='Capture failed';attempt.error={message:String(error.message||error),stack:String(error.stack||'')};
      report.captureErrors.push({sample:sample.id,attempt:number,...attempt.error});
    }
    attempt.requestGuardFailures=guard.failures;
    attempt.requestGuardResponses=guard.responses;
    for(const item of [...guard.failures,...events.failedRequests,...events.httpErrors])report.networkErrors.push({sample:sample.id,attempt:number,...item});
    for(const item of events.consoleErrors)report.consoleErrors.push({sample:sample.id,attempt:number,...item});
    attempt.observed=Object.keys(attempt.captures).length;
    attempt.missing=[...baseline.keys()].filter(path=>!(path in attempt.captures));
    report.totals.observedCaptures+=attempt.observed;
    console.log('SWEEP',sample.id,number,attempt.status,attempt.observed,'/',baseline.size);
    save();
  }
  active=null;
  if(!lastSuccess)throw Error('All three diagnostic captures failed for '+sample.id);
  return lastSuccess;
},env:{APP_ENV:'local',NODE_ENV:'development',AUTH_MODE:'dev-header',DATABASE_DRIVER:'pglite',PGLITE_DATA_DIR:'',BUCKET_DRIVER:'memory',MIGRATE_ON_BOOT:'1',WORKSPACE_OWNER_EMAIL:'qa-replay@example.test',APP_ORIGIN:origin,OPENAI_API_KEY:'',GOOGLE_PLACES_API_KEY:'',YELP_API_KEY:''}});
const api=async(path,method='GET',body)=>{
  const response=await worker.fetch(new Request(origin+'/api'+path,{method,headers:{origin,'content-type':'application/json','oai-authenticated-user-id':'qa-replay-admin','oai-authenticated-user-email':'qa-replay@example.test'},body:body===undefined?undefined:JSON.stringify(body)}),runtime.env);
  assert.equal(response.status,200,await response.clone().text());return response.json();
};

try{
  await api('/setup','POST',{});
  for(const p of original.packets){
    const folder=out+'/packets/'+p.id+'/'+p.versionHash;
    const packet=JSON.parse(fs.readFileSync(folder+'/packet.json'));
    const source=JSON.parse(fs.readFileSync(folder+'/source.json'));
    const prefix='review-packets/'+p.id+'/'+p.versionHash+'/';
    const baseline=new Map(packet.files.filter(file=>file.path.endsWith('.png')).map(file=>{
      const bytes=fs.readFileSync(folder+'/'+file.path);
      return [file.path,{sha256:hash(bytes),bytes}];
    }));
    report.totals.savedPngs+=baseline.size;
    report.totals.expectedCaptures+=baseline.size*3;
    report.totals.fullPageScreenshots+=packet.pages.length*3;
    const sample={id:p.id,versionHash:p.versionHash,pages:packet.pages.map(page=>({path:page.path,screenshots:page.screenshots})),savedPngs:baseline.size,attempts:[],baseline};
    report.samples.push(sample);
    await runtime.env.DB.prepare("INSERT INTO tenants(id,slug,name,settings,version,status,created_at,updated_at) VALUES(?,?,?,?,1,'draft',?,?)")
      .bind(source.siteId,source.slug,source.settings.name,JSON.stringify(source.settings),'2026-09-29T00:00:00Z','2026-09-29T00:00:00Z').run();
    for(const file of ['packet.json','source.json',...packet.files.map(item=>item.path)])await runtime.env.BUCKET.put(prefix+file,fs.readFileSync(folder+'/'+file));
    const base='/tenants/'+p.id+'/review-packet';
    await api(base,'POST',{versionHash:p.versionHash});
    let current,deadline=Date.now()+60*60*1000;
    do{await new Promise(resolve=>setTimeout(resolve,1000));current=await api(base);if(Date.now()>deadline)throw Error('Diagnostic capture timeout for '+p.id)}while(!['Complete','Capture failed'].includes(current.packet.status));
    sample.packetStatus=current.packet.status;
    sample.packetMessage=current.packet.captureMessage;
    if(current.packet.status==='Capture failed')report.captureErrors.push({sample:p.id,packet:true,message:current.packet.captureMessage});
    // The baseline PNG buffers are private to this diagnostic run, not JSON evidence.
    delete sample.baseline;
    save();
  }
  const pageByCapture=new Map(report.samples.flatMap(sample=>sample.pages.flatMap(page=>Object.values(page.screenshots).map(file=>[sample.id+'|'+file,page.path]))));
  for(const sample of report.samples){
    const folder=out+'/packets/'+sample.id+'/'+sample.versionHash;
    const packet=JSON.parse(fs.readFileSync(folder+'/packet.json'));
    for(const file of packet.files.filter(item=>item.path.endsWith('.png'))){
      const captures=sample.attempts.map(attempt=>attempt.captures[file.path]).filter(Boolean);
      const counts=new Map();for(const capture of captures)counts.set(capture.sha256,(counts.get(capture.sha256)||0)+1);
      const differing=captures.filter(capture=>capture.sha256!==file.sha256);
      if(!differing.length)continue;
      const distinct=[...counts].map(([sha256,count])=>({sha256,count,proof:captures.find(capture=>capture.sha256===sha256&&sha256!==file.sha256)||null}));
      report.varyingCaptures.push({sample:sample.id,page:pageByCapture.get(sample.id+'|'+file.path)||null,file:file.path,savedSha256:file.sha256,distinctCapturedShaCounts:distinct,observedRuns:captures.length,allDifferencesInsideImages:differing.every(capture=>capture.insideImageRectangles===true)});
    }
    for(const page of sample.pages){
      const variants=report.varyingCaptures.filter(row=>row.sample===sample.id&&row.page===page.path);
      report.pageSummaryLines.push(sample.id+' '+page.path+': '+variants.length+'/3 widths varied'+(variants.length?' ('+variants.map(row=>row.file.split('-').at(-1).replace('.png','')+'px '+row.distinctCapturedShaCounts.map(v=>v.count+'/3 '+v.sha256.slice(0,8)).join(', ')).join('; ')+')':''));
    }
  }
  report.totals.varyingCaptures=report.varyingCaptures.length;
  report.totals.outsideImageCaptures=report.varyingCaptures.filter(row=>!row.allDifferencesInsideImages).length;
  save();
  console.log('SWEEP COMPLETE',JSON.stringify(report.totals));
}finally{
  chromium.launch=launch;
  await runtime.close();
}
