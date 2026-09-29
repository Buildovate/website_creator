import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectUnique,applyUniqueChoices,replayUniqueChoices,pickDistance,pageRuleFailures,PICK_KEYS,canonical,refreshGeneratedCopy} from '../src/uniqueness.js';
import {copyCatalog,chooseCopy} from '../src/generation-copy.js';
import {stableSiteStyleSeed,selectedSiteStyle} from '../src/design-styles.js';
import {regenerate,adoptGeneration} from '../src/generation.js';
import {validateManifest} from '../src/platform/generation.ts';
import {showcasePage} from '../src/showcase.js';
import {applySiteStyle} from '../src/site-style-render.js';
import {renderConstitutionPage} from '../src/constitution-pages.js';
import {originalRows,variantSettings,styles,sectionKeys} from './fixtures/section-variants.mjs';
const out='C:/Users/joe/website_creator/docs/build-evidence/028C',report={checks:0,cases:0,kits:17,styles:4,catalogEntries:0,failures:[]};
const ok=(v,label)=>{report.checks++;assert.ok(v,label)},eq=(a,b,label)=>{report.checks++;assert.deepEqual(a,b,label)},throws=(f,label)=>{report.checks++;assert.throws(f,undefined,label)};
const html=s=>applySiteStyle(showcasePage(s,{base:'/s/sample-uniqueness'}),s);
const actor={id:'sample-staff',role:'admin'};
const claims=/\$\s*\d|\d+(?:\.\d+)?\s*%|\b\d+\s*(?:years?|reviews?|days?|hours?|projects?)\b|\b(?:today only|hurry|limited time|award-winning|licensed|guaranteed)\b/gi;
for(const slots of Object.values(copyCatalog))for(const entries of Object.values(slots)){ok(entries.length>=3,'at least three authored choices per slot');report.catalogEntries+=entries.length;}
for(const {row}of originalRows)for(const style of styles){
 const s=variantSettings(row,style,'a',false);delete s.siteStyleSeed;delete s.uniqueness;
 s.name='Sample Fictional '+s.trade;s.phone='8055550199';s.area='Ventura';s.serviceAreas=[{city:'Ventura',radiusMiles:null}];s.experience='';s.license='';s.hero='Existing accepted headline';s.intro='Existing accepted introduction';
 const id='sample-'+s.designKit+'-'+style,seed=stableSiteStyleSeed(id),first=regenerate(s,id,'sample-uniqueness'),second=regenerate(s,id,'sample-uniqueness');report.cases++;
 eq(first.uniqueness.seed,seed,'seed derived only from ID');eq(first.uniqueness,second.uniqueness,'same inputs and seed choose identical record');eq(html(first),html(second),'same inputs and seed render identical HTML despite audit UUID');
 eq(first.uniqueness.style,style,'chosen Look wins');eq(first.uniqueness.copyStatus,'AI copy not connected');
 eq(first.hero,s.hero,'a renderer headline input untouched');eq(first.intro,s.intro,'legacy intro input untouched');
 validateManifest(first.generationManifest,first,id,'sample-uniqueness');report.checks++;
 const replay=replayUniqueChoices(s,JSON.parse(JSON.stringify(first.generationManifest)));eq(html(replay),html(first),'manifest round trip');
 const repeat=regenerate(first,id,'sample-uniqueness');eq(html(repeat),html(first),'saved seed regeneration does not rotate secondary design choices');
 eq(pageRuleFailures({style,...first.sectionVariants},first),[],'page rules');
 for(const [key,copy]of Object.entries(first.uniqueness.copy)){ok(copy.id.startsWith(s.designKit+'.'+key+'.v1.'),'versioned per-trade copy ID');ok(copy.heading&&copy.body,'no empty copy slot');ok(!/undefined|null|\{\{|\[insert|TBD|lorem ipsum/i.test(copy.heading+' '+copy.body),'no unresolved placeholders');ok(!claims.test(copy.heading+' '+copy.body+' '+(copy.action||'')),'no unprovided numeric or credential claim');claims.lastIndex=0;}
 const rendered=html(first);ok(first.sectionVariants.services!=='a'||first.sectionVariants.reviews!=='a','omitted reviews reserve a non-duplicated future layout');ok(rendered.includes(first.uniqueness.copy.hero.heading.replaceAll('&','&amp;')),'saved hero copy rendered');ok(!rendered.includes('id="customer-reviews"'),'no-source reviews omitted');const visible=rendered.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' ');ok(!claims.test(visible),'rendered homepage has no unprovided prices, percentages, years, counts or urgency');claims.lastIndex=0;ok(!/\{\{|\[insert|TBD|lorem ipsum|undefined/.test(visible),'rendered page has no copy placeholders');
 for(const key of ['hero','services','process','finalCta'])ok(rendered.includes(first.uniqueness.copy[key].heading.replaceAll('&','&amp;')),'section copy applied: '+key);
 const minimal=regenerate({...s,hero:'',intro:'',area:'',serviceAreas:[],experience:'',license:'',services:[]},id+'-minimal','sample-uniqueness');const minimalHtml=html(minimal);ok(minimalHtml.includes(minimal.uniqueness.copy.hero.body.replaceAll('&','&amp;')),'missing original intro still renders complete authored support');
 const legacy=adoptGeneration(s,id,'sample-uniqueness');eq(html(legacy),html(s),'adoption without regeneration remains byte-identical');
 const alternate=selectUnique(s,id,{overrides:{seed:seed+1},actor});ok(canonical(alternate.sections)!==canonical(first.uniqueness.sections)||alternate.style!==first.uniqueness.style,'different seed changes picks');
 const supplied=selectUnique(s,id,{overrides:{seed:42,style:'bold',sections:{hero:'c',process:'b',reviews:'b'}},actor});eq(supplied.seed,42,'staff seed');eq(supplied.style,style,'Look over staff and seed');eq(supplied.sections.hero,'c','staff hero override');eq(supplied.sections.process,'b','staff process override');eq(supplied.overrides.history[0].by,actor,'server actor provenance');
 const changed=refreshGeneratedCopy({...first,name:'Sample Renamed '+s.trade});ok(canonical(changed.uniqueness.copy)!==canonical(first.uniqueness.copy),'factual rename refreshes local copy');eq(changed.sectionVariants,first.sectionVariants,'fact save keeps layouts');
 const finance=applySiteStyle(renderConstitutionPage(first,{slug:'sample-uniqueness',kind:'financing'}),first);ok(!finance.includes('data-financing-calculator'),'missing lending terms stay omitted');
}
const base=variantSettings(originalRows[0].row,'current','a',true);delete base.siteStyle;delete base.siteStyleSeed;
const first=selectUnique(base,'same-trade-one'),existing=[{id:'same-trade-one',settings:applyUniqueChoices(base,first)}];
const second=selectUnique(base,'same-trade-two',{existing,overrides:{seed:first.seed},actor});ok(pickDistance({style:first.style,...first.sections},{style:second.style,...second.sections})>=3,'same seed with existing neighbour reserves distant combination');ok(second.fallbacks.length>0,'uniqueness fallback recorded');
eq(second,selectUnique(base,'same-trade-two',{existing:[...existing].reverse(),overrides:{seed:first.seed},actor}),'reservation order deterministic');
const ignored=selectUnique(base,'same-trade-two',{existing:[{id:'other-trade',settings:{...existing[0].settings,trade:'HVAC'}}],overrides:{seed:first.seed},actor});eq(ignored.sections,first.sections,'other trade excluded');
const impossible=selectUnique(base,'exhausted',{existing,overrides:{seed:first.seed,style:first.style,sections:first.sections},actor});eq(impossible.uniqueness.status,'pool exhausted','finite fixed pool reports exhaustion');eq(impossible.uniqueness.minimumDistance,0,'honest exhausted distance');
throws(()=>selectUnique(base,'invalid',{overrides:{sections:{services:'a',reviews:'a'}},actor}),'invalid fixed repeated patterns cannot bypass rules');
throws(()=>selectUnique({...base,sections:[{id:'contact',enabled:false}]},'no-contact'),'missing mandatory final CTA fails rather than guessing');
for(const overrides of [{seed:-1},{seed:1.5},{style:'neon'},{sections:{hero:'d'}},{copy:'Invent facts'}])throws(()=>selectUnique(base,'invalid',{overrides,actor}),'invalid overrides');
throws(()=>selectUnique(base,'forged',{overrides:{seed:1},actor:{id:'owner',role:'owner'}}),'owner cannot forge staff override');
const copy=chooseCopy({...base,name:'<script>sample</script>',area:'',serviceAreas:[],services:[]},0);ok(Object.values(copy).every(x=>x.heading&&x.body),'minimal facts never leave blanks');
let fallback;
for(let seed=0;seed<100;seed++){const r=selectUnique(base,'pattern',{overrides:{seed},actor});if(r.fallbacks.some(x=>x.reason.includes('Repeated section structure'))){fallback=r;break}}
ok(fallback,'page rules force deterministic fallback');eq(fallback,selectUnique(base,'pattern',{overrides:{seed:fallback.seed},actor}),'rule fallback stable');
report.passed=true;fs.mkdirSync(out+'/checks',{recursive:true});fs.writeFileSync(out+'/checks/uniqueness.json',JSON.stringify(report,null,2));console.log('PASS '+JSON.stringify(report));
