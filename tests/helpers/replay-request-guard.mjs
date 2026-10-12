// Test-only: observe existing routing; never change responses, capture timing or settings.
export function replayRequestGuard(){
 const failures=[],responses=[];
 const fail=value=>{if(!failures.some(x=>JSON.stringify(x)===JSON.stringify(value)))failures.push(value)};
 return {failures,responses,
  observe(page){page.on('response',r=>{if(new URL(r.url()).origin!=='http://review.local')return;const row={url:r.url(),status:r.status(),method:r.request().method()};responses.push(row);if(r.status()<200||r.status()>=300)fail(row)});page.on('requestfailed',r=>{if(new URL(r.url()).origin==='http://review.local'&&r.failure()?.errorText!=='net::ERR_ABORTED')fail({url:r.url(),error:r.failure()?.errorText||'Unhandled request'})})},
  wrap(fetch){return async path=>{try{const response=await fetch(path);if(!response||response.status<200||response.status>=300)fail({url:'http://review.local'+path,status:response?.status||'unhandled'});return response}catch(error){fail({url:'http://review.local'+path,error:String(error.message||error)});throw error}}},
  assertClean(){if(failures.length)throw Error('Replay request guard failed before screenshot comparison: '+JSON.stringify(failures))}
 };
}
