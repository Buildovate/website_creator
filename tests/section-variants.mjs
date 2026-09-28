import assert from 'node:assert/strict';
import fs from 'node:fs';
import {showcasePage} from '../src/showcase.js';
import {renderConstitutionPage} from '../src/constitution-pages.js';
import {applySiteStyle} from '../src/site-style-render.js';
import {cleanSectionChoices} from '../src/section-choices.js';
import {assertDistinctPatterns} from './helpers/section-patterns.mjs';
import {originalRows,variantSettings,styles,variants,sectionKeys} from './fixtures/section-variants.mjs';
let checks=0,cases=0;const ok=(value,message)=>{checks++;assert.ok(value,message)},eq=(a,b,message)=>{checks++;assert.deepEqual(a,b,message)};
eq(cleanSectionChoices({},{}),{});
for(const value of ['all',3,4,5])eq(cleanSectionChoices({minReviewRating:value}),{minReviewRating:value});
for(const value of [null,0,1,2,6,'4',true,{},[]]){checks++;assert.throws(()=>cleanSectionChoices({minReviewRating:value}));}
for(const value of [{hero:'d'},{bogus:'a'},null,[]]){checks++;assert.throws(()=>cleanSectionChoices({sectionVariants:value}));}
eq(cleanSectionChoices({}, {sectionVariants:{services:'b'},minReviewRating:4}),{sectionVariants:{services:'b'},minReviewRating:4});
eq(cleanSectionChoices({sectionVariants:{}},{sectionVariants:{hero:'b'}}),{sectionVariants:{}});
for(const {row} of originalRows)for(const style of styles)for(const populated of [false,true]){
 const initial=variantSettings(row,style,'a',populated),base='/s/'+row.slug;
 const inherited={...initial};delete inherited.sectionVariants;
 eq(showcasePage(initial,{base}),showcasePage(inherited,{base}),'Explicit a is byte-identical to absent choices');
 eq(renderConstitutionPage(initial,{slug:row.slug,kind:'financing'}),renderConstitutionPage(inherited,{slug:row.slug,kind:'financing'}),'Financing a identity');
 for(const variant of variants){
  const s=variantSettings(row,style,variant,populated),html=applySiteStyle(showcasePage(s,{base}),s),finance=applySiteStyle(renderConstitutionPage(s,{slug:row.slug,kind:'financing'}),s);
  cases++;
  ok(html.includes('id="services"')&&html.includes('id="contact"'),s.designKit+' required content');
  for(const service of s.services)ok(html.includes(service.name.replaceAll('&','&amp;')),service.name+' remains');
  if(variant==='a'){ok(!html.includes('section-variants.css'),'Default adds no assets');continue;}
  for(const section of ['hero','services','process','finalCta'])ok(html.includes('data-section-variant="'+section+':'+variant+'"'),s.designKit+' '+section+' '+variant);
  eq((html.match(/id="lead-form"/g)||[]).length,1,'Transport form retained once');
  ok(html.includes('name="consent"')&&html.includes('data-preview="false"'),'Consent and public transport retained');
  ok(!html.includes('class="bv-platform"'),'No platform scope');
  if(populated){ok(html.includes('data-section-variant="reviews:'+variant+'"'),'Connected review composition');ok(finance.includes('data-section-variant="financing:'+variant+'"'),'Configured financing composition');ok(finance.includes('QA configured plan')&&finance.includes('Hearth'),'Only actual configured program/lender');ok(!finance.includes('Wisetack'),'Unselected lender omitted');}
  else {ok(!html.includes('id="customer-reviews"'),'No source means omission');ok(!finance.includes('data-financing-calculator'),'No terms means no public calculator');}
  assertDistinctPatterns(html);checks++;
  for(const forbidden of ['all 5-star reviews','countdown'])ok(!html.toLowerCase().includes(forbidden),'No invented review summary or urgency');
 }
}
checks++;assert.throws(()=>assertDistinctPatterns('<section data-section-pattern="vertical-timeline"></section><section data-section-pattern="vertical-timeline"></section>'),/Duplicate/);

for(const [kit,journey]of [['roofing','roof-repair'],['hvac','hvac-replacement'],['patios','patio-design']])for(const variant of ['b','c']){
 const {row}=originalRows.find(({row})=>JSON.parse(row.settings).designKit===kit),settings=variantSettings(row,'current',variant,true);settings.journey=journey;
 const html=showcasePage(settings,{base:'/s/qa-journey'});
 for(const section of ['hero','services','process','reviews','finalCta'])ok(html.includes('data-section-variant="'+section+':'+variant+'"'),journey+' '+section);
 const h1=html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'';
 if(kit==='roofing')eq((h1.match(/A roof concern/g)||[]).length,1,'Kinetic accessible and visual copies become one headline');
 ok(html.indexOf('href="/section-variants.css"')<html.indexOf('</head>'),'Variant CSS is blocking in head');
 eq((html.match(/href="\/section-variants.css"/g)||[]).length,1,'One variant stylesheet');
}


let optionalCases=0;
for(const {row} of originalRows)for(const style of styles)for(const variant of variants){
 const s=variantSettings(row,style,variant,true);
 s.platform.promotions={enabled:true,offers:[{id:'qa-028b',enabled:true,title:'QA contractor-entered project discussion',description:'TEST FIXTURE: entered business offer.',reward:'Discuss the project scope',terms:'QA legal terms.',startsAt:'2020-01-01T00:00:00Z',endsAt:'2099-01-01T00:00:00Z',question:'What defines the work?',choices:['A written scope','A guess'],answer:0,code:'QA-ONLY'}]};
 const promotion=applySiteStyle(renderConstitutionPage(s,{slug:row.slug,kind:'promotions'}),s);
 ok(promotion.includes('QA contractor-entered project discussion'),'Only the configured offer is rendered');
 const home=applySiteStyle(showcasePage(s,{base:'/s/'+row.slug}),s);
 ok(home.includes('id="contact"'),'Final CTA remains complete with configured promotion');
 assertDistinctPatterns(home);checks++;
 optionalCases++;
}

const report={passed:true,checks,cases,optionalCases,kits:originalRows.length,styles:styles.length,variantsPerSection:3,sections:6,optionalStates:2};
fs.mkdirSync('docs/build-evidence/028B/checks',{recursive:true});fs.writeFileSync('docs/build-evidence/028B/checks/section-variants.json',JSON.stringify(report,null,2));console.log('PASS '+JSON.stringify(report));
