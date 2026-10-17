import assert from 'node:assert/strict';
import fs from 'node:fs';
import {worker,env,admin,closePreviewFixture} from './preview-fixture.mjs';
import {designPreviewSettings,designPreviewPage} from '../src/design-preview-pages.js';
import {renderCoreSitePage} from '../src/core-site-pages.js';
import {renderServicePage,renderFAQPage,renderAboutPage} from '../src/website-pages.js';
import {renderConstitutionPage} from '../src/constitution-pages.js';
import {renderLegalPage} from '../src/site-polish.js';
import {visibleServicePages,serviceSlug} from '../src/service-registry.js';
import {kits} from '../src/design-kits.js';
import {designPreviewUrl} from '../src/client/workspace/design-preview-url.js';

const checks=[],check=(value,message)=>{assert.ok(value,message);checks.push(message)};
const headers={'oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email};
const request=(path,user=headers,method='GET')=>worker.fetch(new Request('https://test.local'+path,{method,headers:user}),env);
const main=html=>html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
const normalize=html=>html.replace(/<span\b[^>]*>\s*Sample\s*<\/span>/gi,'').replace(/\b(?:href|action)="[^"]*"/g,'').replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
try{
 for(const path of ['/services/roof-repair','/financing','/areas/oxnard','/legal/privacy']){
  const url=designPreviewUrl({kit:'roofing',layout:'studio',params:{font:'modern',tenant:'owned'},currentUrl:'https://test.local/design-preview/roofing/immersive'+path+'?font=editorial#details',origin:'https://test.local'});
  check(url==='/design-preview/roofing/studio'+path+'?font=modern&tenant=owned#details','Regenerate retains '+path+' and updates layout/query');
 }
 check(designPreviewUrl({kit:'patios',layout:'studio',params:{font:'modern'},currentUrl:'https://test.local/design-preview/roofing/immersive/services/roof-repair',origin:'https://test.local'})==='/design-preview/patios/studio?font=modern','switching kits starts at the matching home');
 check(!designPreviewUrl({kit:'roofing',layout:'studio',params:{},currentUrl:'https://outside.test/design-preview/roofing/immersive/contact',origin:'https://test.local'}).includes('contact'),'foreign origins cannot steer preview page');
 for(const kit of Object.keys(kits))for(const layout of ['immersive','editorial','studio']){
  const params=new URLSearchParams('font=modern&palette=ocean&cards=soft&heroFrame=arch&rhythm=airy&tenant=retained'),s=designPreviewSettings(kit,layout,params);
  const base='/design-preview/'+kit+'/'+layout,services=visibleServicePages(s);
  const paths=['/services','/areas','/about','/reviews','/faq','/contact','/financing','/promotions','/legal','/legal/privacy','/legal/terms','/pricing','/blog',...services.map(p=>'/services/'+p.slug),...s.serviceAreas.map(a=>'/areas/'+serviceSlug(a.city))];
  for(const path of paths){
   const response=await request(base+path+'?'+params),html=await response.text(),label=kit+'/'+layout+path;
   check(response.status===200,label+' available');
   check(response.headers.get('x-robots-tag')==='noindex, nofollow',label+' private');
   check((html.match(/data-preview-chrome/g)||[]).length===1,label+' one chrome note');
   check(!/<span\b[^>]*>\s*Sample\s*<\/span>/i.test(html),label+' no Sample pills');
   check(html.includes('font-modern')&&html.includes('palette-ocean')&&html.includes('layout-'+layout),label+' selected composition');
   check(!html.includes('/s/design-library-sample'),label+' no synthetic live links');
   for(const [,raw] of html.matchAll(/href="([^"]+)"/g)){
    const href=raw.replaceAll('&amp;','&');if(!href.startsWith(base))continue;
    const url=new URL(href,'https://test.local');
    check([...params].every(([key,value])=>url.searchParams.get(key)===value),label+' link retains design and tenant');
   }
   const detail=path.split('/')[2],kind=path.split('/')[1],options={slug:'design-library-sample',preview:true,origin:'https://test.local'};
   let live;
   if(kind==='services'&&detail)live=renderServicePage(s,services.find(p=>p.slug===detail),options);
   else if(['financing','promotions'].includes(kind))live=renderConstitutionPage(s,{...options,kind});
   else if(kind==='legal'&&detail)live=renderLegalPage(s,{base:'/s/design-library-sample',preview:true,kind:detail});
   else if(kit==='roofing'&&['about','faq'].includes(kind))live=(kind==='about'?renderAboutPage:renderFAQPage)(s,s.websitePages.pages.find(p=>p.kind===kind),options);
   else if(!['pricing','blog'].includes(kind))live=renderCoreSitePage(s,options.slug,kind,detail?s.serviceAreas.find(a=>serviceSlug(a.city)===detail).city:null,true,options.origin);
   if(live)check(normalize(main(designPreviewPage(s,{base:base+'?'+params,path,layout,origin:options.origin})))===normalize(main(live)),label+' unchanged live-renderer body');
  }
  for(const alias of ['projects','before-after']){
   const response=await request(base+'/'+alias+'?'+params),location=new URL(response.headers.get('location'),'https://test.local');
   check(response.status===302,kit+' '+alias+' existing surface alias');
   check([...params].every(([key,value])=>location.searchParams.get(key)===value),kit+' '+alias+' keeps query');
   check(alias==='projects'?location.hash==='#projects':location.searchParams.get('project')==='example-0',kit+' '+alias+' correct surface');
  }
 }
 const base='/design-preview/roofing/immersive';
 check((await request(base+'/services',{})).status===401,'anonymous preview denied');
 const outsider={'oai-authenticated-user-id':'outsider','oai-authenticated-user-email':'outsider@example.test'};
 check((await request(base+'/services',outsider)).status===403,'unscoped nonstaff denied');
 check((await request(base+'/services?tenant=missing',outsider)).status===404,'unrelated tenant denied');
 const tenant=await env.DB.prepare('SELECT id FROM tenants WHERE slug=?').bind('robles-roofing').first();
 await env.DB.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').bind('preview-viewer',tenant.id,'preview-viewer','preview-viewer@example.test','viewer',new Date().toISOString()).run();
 const viewer={'oai-authenticated-user-id':'preview-viewer','oai-authenticated-user-email':'preview-viewer@example.test'};
 check((await request(base+'/financing?tenant='+tenant.id,viewer)).status===200,'authorized tenant viewer retains preview access');
 const story=await (await request(base+'?project=example-0&font=modern&palette=ocean')).text();
 check(!/href="\/legal\//.test(story),'Project Story legal links remain in library preview');
 check(story.includes('/legal/privacy?font=modern&amp;palette=ocean'),'Project Story footer preserves composition');
 check((story.match(/src="\/site-navigation.js"/g)||[]).length===1,'Project Story initializes navigation once');
 check((await request(base+'/services/not-a-service')).status===404,'unknown service rejected');
 check((await request(base+'/areas/not-a-city')).status===404,'unknown city rejected');
 check((await request(base+'/contact',headers,'POST')).status===405,'preview cannot receive submissions');
 console.log('PASS '+checks.length+' preview real-page checks across 17 kits and three layouts.');
}finally{fs.mkdirSync('docs/build-evidence/PREVIEW-REAL-PAGES',{recursive:true});fs.writeFileSync('docs/build-evidence/PREVIEW-REAL-PAGES/routes-results.json',JSON.stringify({count:checks.length,checks},null,2));closePreviewFixture();}
