import {e,DEFAULT,identity,access,must} from './core.js';
import {kits,kitDefaults,effectKeys} from './design-kits.js';
import {cleanDesign} from './design-variant.js';
import {cleanJourney} from './platform/conversion.ts';
import {publicLegalSettings} from './platform/legal-policy.ts';
import {websiteHeader,websiteFooter,renderLegalPage} from './site-polish.js';
import {renderCoreSitePage} from './core-site-pages.js';
import {renderServicePage,renderFAQPage,renderAboutPage} from './website-pages.js';
import {renderConstitutionPage} from './constitution-pages.js';
import {visibleServicePages,serviceSlug} from './service-registry.js';
import {roofingCityEditorial} from './city-editorial.js';
import {showcasePage} from './showcase.js';
import {pricingPage} from './pricing.js';
import {renderBlogPage} from './blog.js';
import {applySiteStyle} from './site-style-render.js';
import {STYLE_IDS} from './design-styles.js';
import specialties from '../public/trade-library.json' with {type:'json'};
import faqContent from '../public/faq-content.json' with {type:'json'};

const layouts={immersive:'cinematic',editorial:'editorial',studio:'blueprint'};
const coreKinds=new Set(['services','areas','about','reviews','faq','contact','legal']);
const sampleCities=Object.keys(roofingCityEditorial);
const previewSlug='design-library-sample';
const previewPosts=trade=>[
 {slug:'start-with-a-clear-brief',title:'Your '+trade.toLowerCase()+' project starts with a clear brief',category:'Planning',excerpt:'A few useful details make the first conversation easier.',body:'Start with what you want to change, the location of the work, and the priorities that matter most to you. Take a few clear photos and note any questions you want the contractor to answer.\n\nAsk about the proposed scope, access to the property, material options and how the next steps will be confirmed. Your contractor can explain which choices fit the specific project.'},
 {slug:'compare-the-scope',title:'Look beyond the headline price',category:'Project guides',excerpt:'Use the scope of work to understand what is included.',body:'When reviewing an estimate, look for a clear description of the work, the materials and the responsibilities of each party. Ask about preparation, finishing details and cleanup.\n\nIf something is unclear, discuss it before work begins. A shared understanding of the scope helps you compare options and make a considered decision.'}
];

// Isolated library data: never saved to a tenant or copied into a published snapshot.
export function designPreviewSettings(kitId,layout,params=new URLSearchParams()){
 const kit=kits[kitId];must(kit,'Design not found.',404);
 let journey;try{journey=cleanJourney(params.get('journey'),kit.trade)}catch(error){must(false,error.message)}
 const name=kitId==='roofing'?'Ridgeline Roofing':kit.name.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())+' '+kit.trade;
 const values={name,journey,template:layouts[layout],siteStyle:STYLE_IDS.includes(params.get('siteStyle'))?params.get('siteStyle'):'current',color:/^#[a-f0-9]{6}$/i.test(params.get('color')||'')?params.get('color'):kit.color,
  design:cleanDesign(Object.fromEntries(params)),effects:Object.fromEntries(effectKeys.map(key=>[key,params.get(key)!=='false'])),
  services:specialties[kit.trade].map(name=>({name,description:''})),serviceAreas:sampleCities.map(city=>({city,radiusMiles:0})),area:sampleCities.join(', '),
  generationId:'design-preview-'+kitId+'-'+layout,websitePages:{version:1,pages:kitId==='roofing'?[
   {id:'library-about',kind:'about',enabled:true,title:'Meet the team behind your roof.',portraitMode:'hidden'},
   {id:'library-faq',kind:'faq',enabled:true,...faqContent.Roofing}
  ]:[]}};
 return publicLegalSettings({...DEFAULT,...kitDefaults(kitId,values)});
}

// Adapt only preview chrome, links and composition. Bodies come from live renderers.
export function previewChrome(markup,s,{base,path='',layout='immersive'}){
 const root=base.split('?')[0],query=base.includes('?')?base.slice(base.indexOf('?')+1):'',source='/s/'+previewSlug;
 if(markup.includes('class="project-story"'))markup=markup.replace(/<footer class="studio-footer"[\s\S]*?<\/footer>/,websiteFooter(s,root,true).replace('<script defer src="/site-navigation.js"></script>',''));
 const link=href=>{
  const decoded=href.replaceAll('&amp;','&');
  if(/^\/legal\/(privacy|terms)$/.test(decoded))return e(root+decoded+(query?'?'+query:''));
  const prefix=[source,root].find(prefix=>decoded.startsWith(prefix)&&['','/','?','#'].includes(decoded.slice(prefix.length,prefix.length+1)));
  if(!prefix)return href;
  const u=new URL(decoded,'https://preview.invalid'),params=new URLSearchParams(query);
  for(const [key,value] of u.searchParams)if(key!=='preview')params.set(key,value);
  return e(root+u.pathname.slice(prefix.length)+(params.size?'?'+params.toString():'')+u.hash);
 };
 let html=markup.replace(/<script src="\/site-navigation-init.js"><\/script>/g,'')
  .replace(/<header class="[^"]*(?:shared-site-header|tp-header)[^"]*">[\s\S]*?<\/header>/,websiteHeader(s,{base,preview:true,sample:true,project:true,currentPage:path.slice(1),layout}))
  .replace(/<div class="(?:core-preview-banner|foundation-preview|tp-preview|kit-preview|preview-banner|pricing-preview|blog-preview)"[^>]*>[\s\S]*?<\/div>/g,'')
  .replace(/<p class="sd-preview">[\s\S]*?<\/p>/g,'')
  .replace(/<span\b[^>]*>\s*Sample\s*<\/span>/gi,'')
  .replace(/\b(href|action)="([^"]+)"/g,(_,attr,href)=>attr+'="'+link(href)+'"')
  .replace(/<link rel="canonical"[^>]*>/g,'')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
 const d=s.design,classes=`layout-${layout} font-${d.font} cards-${d.cards} rhythm-${d.rhythm} hero-frame-${d.heroFrame} entrance-${d.entrance} palette-${d.palette}`;
 html=html.replace(/<body([^>]*)>/,(_,attrs)=>{
  attrs=attrs.replace(/\sdata-design-preview(?:="[^"]*")?/g,'');
  if(!/\bdata-trade=/.test(attrs))attrs+=' data-trade="'+e(s.trade)+'"';
  attrs=/\bclass="/.test(attrs)?attrs.replace('class="','class="preview-real-page '+classes+' '):attrs+' class="preview-real-page '+classes+'"';
  return '<body data-design-preview'+attrs+'><div class="preview-contractor-note" data-preview-chrome>DESIGN KIT PREVIEW · Sample contractor · '+e(s.name)+' · Forms disabled</div>';
 });
 html=html.replace('</head>','<link rel="stylesheet" href="/design-preview-pages.css"></head>');
 if(!html.includes('rel="icon"'))html=html.replace('</head>','<link rel="icon" href="/favicon.svg"></head>');
 if(!html.includes('src="/site-navigation.js"'))html=html.replace('</body>','<script defer src="/site-navigation.js"></script></body>');
 return applySiteStyle(html,s,{base:root});
}

export function designPreviewPage(s,{base,path,layout='immersive',origin=''}){
 const options={slug:previewSlug,preview:true,origin};
 const [kind,detail]=path.slice(1).split('/');let markup;
 if(kind==='services'&&detail){
  const page=visibleServicePages(s).find(page=>page.slug===detail);if(!page)return null;
  markup=renderServicePage(s,page,options);
 }else if(kind==='legal'&&['privacy','terms'].includes(detail)){
  markup=renderLegalPage(s,{base:'/s/'+previewSlug,preview:true,kind:detail});
 }else if(['financing','promotions'].includes(kind)){
  markup=renderConstitutionPage(s,{...options,kind});
 }else if(s.trade==='Roofing'&&['about','faq'].includes(kind)){
  const page=s.websitePages.pages.find(page=>page.kind===kind);
  markup=(kind==='about'?renderAboutPage:renderFAQPage)(s,page,options);
 }else if(coreKinds.has(kind)){
  const city=detail?s.serviceAreas.find(area=>serviceSlug(area.city)===detail)?.city:null;
  if(detail&&(kind!=='areas'||!city))return null;
  markup=renderCoreSitePage(s,previewSlug,kind,city,true,origin);
 }else if(kind==='pricing'){
  markup=pricingPage(s,{base:base.split('?')[0],preview:true,sample:true,chatEnabled:false});
 }else if(kind==='blog'){
  markup=renderBlogPage(s,base.split('?')[0],previewPosts(s.trade),{preview:true,sample:true});
 }else return null;
 return previewChrome(markup,s,{base,path,layout});
}

export async function designPreviewRoute(req,env,url){
 const match=url.pathname.match(/^\/design-preview\/([a-z-]+)\/(immersive|editorial|studio)(\/(?:pricing|blog|legal(?:\/(?:privacy|terms))?|services(?:\/[a-z0-9-]+)?|areas(?:\/[a-z0-9-]+)?|about|reviews|faq|contact|financing|promotions|projects|before-after))?\/?$/);
 if(!match)return null;
 must(req.method==='GET','Method not allowed.',405);
 const user=await identity(req,env);
 if(!user.staff){must(url.searchParams.get('tenant'),'Choose an authorized website.',403);await access(req,env,url.searchParams.get('tenant'))}
 const [,kitId,layout,path='']=match,s=designPreviewSettings(kitId,layout,url.searchParams);
 const params=new URLSearchParams(url.searchParams);params.delete('project');
 const root='/design-preview/'+kitId+'/'+layout,base=root+(params.size?'?'+params.toString():'');
 // Existing homepage/Project Story surfaces; no standalone live design is invented.
 if(path==='/projects'||path==='/before-after'){
  if(path==='/before-after')params.set('project','example-0');
  return new Response(null,{status:302,headers:{location:root+(params.size?'?'+params.toString():'')+(path==='/projects'?'#projects':''),'cache-control':'private, no-store','x-robots-tag':'noindex, nofollow'}});
 }
 if(!path)return previewChrome(showcasePage(s,{sample:true,preview:true,sampleProject:url.searchParams.get('project')||'',samplePath:root}),s,{base,layout});
 const page=designPreviewPage(s,{base,path,layout,origin:url.origin});must(page,'Preview page not found.',404);return page;
}
