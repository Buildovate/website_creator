import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
// Test-host adaptation only. Original test files/assertions remain byte-identical.
// Run: node --import ./tests/game-guard-loader.mjs ./tests/<guard>.mjs
import {registerHooks} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)).replaceAll('\\','/').replace(/\/$/,'');
const temporary=root+'/.data/028G/dist';
const evidence=root+'/docs/build-evidence/028G/'+(process.env.GAME_EVIDENCE_ROUND||'round2');
process.chdir(root);
process.env.PLATFORM_MOBILE_EVIDENCE=evidence+'/platform-mobile';
process.env.ROUND_NAV_EVIDENCE=evidence+'/header-nav-fit';
// No inherited provider keys or database endpoints may be used by guard fixtures.
for(const key of Object.keys(process.env))if(/API_KEY|TOKEN|SECRET|DATABASE_URL|S3_|AWS_|ZOOM_|TWILIO_|RESEND_|REVIEW_BROWSER/.test(key))delete process.env[key];
process.env.APP_ENV='local';
process.env.ASSETS_ROOT=root+'/public';
process.env.PGLITE_DATA_DIR=root+'/.data/028G/database';
const networkFetch=globalThis.fetch;
globalThis.fetch=(input,...args)=>{
 const url=new URL(typeof input==='string'||input instanceof URL?input:input.url);
 if(!['127.0.0.1','localhost','[::1]'].includes(url.hostname))throw Error('G-1 guard forbids external network: '+url.hostname);
 return networkFetch(input,...args);
};
registerHooks({
 resolve(specifier,context,next){
  if(specifier.includes('dist/')&&(specifier.startsWith('.')||specifier.startsWith('file:'))){
   const url=new URL(specifier,context.parentURL);
   if(url.href.startsWith(pathToFileURL(root+'/dist/').href))return next(url.href.replace(pathToFileURL(root+'/dist/').href,pathToFileURL(temporary+'/').href),context);
  }
  return next(specifier,context);
 },
 load(url,context,next){
  const result=next(url,context);
  if(!url.startsWith(pathToFileURL(root+'/').href)||!url.endsWith('.mjs')&&!url.endsWith('.js'))return result;
  let source=typeof result.source==='string'?result.source:Buffer.from(result.source||'').toString();
  source=source.replaceAll(releaseRepoRoot,root);
  if(url.endsWith('/tests/header-logo.mjs'))source=source.replace('/docs/build-evidence/028F/checks/round8h-header-logo-regression.json',evidence.slice(root.length)+'/header-logo.json');
  if(url.endsWith('/round8q-nav-capture.mjs'))source=source.replace("server.listen(0,'127.0.0.1'","server.listen(5183,'127.0.0.1'");
  if(url.endsWith('/tests/platform-mobile.mjs'))source=source.replaceAll('8126','5183');
  if(url.endsWith('/src/aws/server.js'))source=source.replaceAll("'dist/server/index.js'",JSON.stringify(temporary+'/server/index.js'));
  if(url.endsWith('/scripts/build-client.mjs'))source=source.replaceAll('dist/client',temporary+'/client');
  if(url.endsWith('/tests/helpers/review-approval-fixture.mjs'))source=source.replaceAll(root+'/docs/build-evidence/028F/',evidence+'/legacy-helper/').replaceAll(root+'/dist/client',temporary+'/client');
  return {...result,source};
 }
});
