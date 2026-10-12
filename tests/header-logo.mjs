import {releaseRepoRoot} from "../scripts/runtime-paths.mjs";
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const root=releaseRepoRoot,out=root+'/docs/build-evidence/028F/checks/round8h-header-logo-regression.json';
const bundle=await build({stdin:{contents:"export {sitePage} from './src/views.js';export {websiteBrand,websiteHeader} from './src/site-polish.js';export {settings,DEFAULT} from './src/core.js';export {kits} from './src/design-kits.js';",resolveDir:root},bundle:true,platform:'node',format:'esm',write:false,loader:{'.html':'text','.pdf':'binary'}});
const {sitePage,websiteBrand,websiteHeader,settings,DEFAULT,kits}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const library=JSON.parse(fs.readFileSync(root+'/public/trade-library.json'));
const checks=[];
for(const [kitId,kit] of Object.entries(kits))for(const look of ['current','bold','fresh','classic'])for(const template of ['craft','cinematic','clean','editorial','blueprint']){
 const name='Header Logo QA '+kit.trade,s=settings({...DEFAULT,name,designKit:kitId,trade:kit.trade,color:kit.color,journey:'standard',template,siteStyle:look,phone:'8054410199',area:'Ventura',services:[{name:library[kit.trade][0]}],logoId:'header-logo-qa',logoContainsName:true,showOwner:false,showProjects:false});
 const row={id:'header-logo-qa',slug:'header-logo-qa',settings:JSON.stringify(s),published:JSON.stringify(s),status:'published'},html=sitePage(row,[],[{id:s.logoId,caption:'Fixture logo',project_id:null}],{preview:false});
 const header=html.match(/<header\b[\s\S]*?<\/header>/)?.[0];assert.ok(header,kitId+' '+look+' '+template+' has header');
 assert.ok(header.includes('alt="'+name+'"'),kitId+' '+look+' '+template+' logo names business');
 assert.match(header,/<span class="site-brand-name site-brand-name-hidden" hidden style="display:none!important">/);
 assert.ok(!header.includes('class="site-brand-logo" src="/media/header-logo-qa" alt=""'));
 checks.push({kit:kitId,look,template});
}
const name='Roof & Home "QA"',marked={name,logoId:'filename.jpg',logoContainsName:true};
assert.ok(websiteBrand(marked).includes('alt="Roof &amp; Home &quot;QA&quot;"'));
assert.ok(!websiteBrand(marked,{decorativeLogo:true}).includes('aria-hidden="true"'));
assert.ok(!websiteBrand({...marked,logoContainsName:false}).includes('site-brand-name-hidden'));
assert.ok(!websiteBrand({...marked,logoId:null}).includes('site-brand-name-hidden'));
assert.ok(websiteBrand({...marked,name:''}).includes('alt="Business logo"'));
assert.ok(websiteHeader(marked,{base:'/s/header-logo-qa'}).includes('hidden style="display:none!important"'));
const result={passed:true,renderedHeaders:checks.length,kits:Object.keys(kits).length,looks:4,templates:5,edgeCases:6,checks};
fs.writeFileSync(out,JSON.stringify(result,null,2));console.log('PASS header logo: '+checks.length+' rendered headers, 6 edge cases');
