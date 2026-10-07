import assert from 'node:assert/strict';import fs from 'node:fs';
import {filterReviewResult} from '../src/review-filter.js';
import {reviewSection} from '../src/reviews.js';
import {fullProvider} from './fixtures/section-variants.mjs';
import {worker,env,admin} from './helpers/review-filter-fixture.mjs';
let checks=0;const eq=(a,b,label)=>{checks++;assert.deepEqual(a,b,label)},ok=(v,label)=>{checks++;assert.ok(v,label)};
const baseResult={providers:[fullProvider],minimum:0};
eq(filterReviewResult(baseResult,undefined),baseResult,'Absent is literal identity');
for(const [minimum,ratings] of [['all',[2,3,4,5]],[3,[3,4,5]],[4,[4,5]],[5,[5]]]){
 const result=filterReviewResult(baseResult,minimum);eq(result.providers[0].reviews.map(x=>x.rating),ratings);
 eq([result.providers[0].rating,result.providers[0].count],[3.5,4],'Full-source aggregate unchanged');
 const unrated={providers:[{...fullProvider,reviews:[...fullProvider.reviews,{text:'Unrated'},{rating:'5',text:'Invalid numeric string'}]}]};
 eq(filterReviewResult(unrated,minimum).providers[0].reviews.length,minimum==='all'?6:ratings.length,'Numeric minimum excludes unrated/string ratings');
}
eq(filterReviewResult({providers:[{...fullProvider,reviews:fullProvider.reviews.slice(0,2)}]},5).providers[0].reviews,[]);
for(const p of [{reviews:fullProvider.reviews},{rating:3.5,count:0,reviews:fullProvider.reviews},{rating:'3.5',count:4,reviews:fullProvider.reviews}]){
 const result=filterReviewResult({providers:[p]},4).providers[0];ok(!('rating' in result)&&!('count' in result),'No aggregate invented from excerpts');
}
const headers={origin:'https://test.local','content-type':'application/json','oai-authenticated-user-id':admin.id,'oai-authenticated-user-email':admin.email};
async function req(path,method='GET',body){return worker.fetch(new Request('https://test.local'+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)}),env)}
async function api(path,method='GET',body){const r=await req(path,method,body);eq(r.status,200,await r.clone().text());return r.json()}
let tenant=(await api('/api/tenants')).tenants[0];tenant=(await api('/api/tenants/'+tenant.id)).tenant;
const reviews={confirmed:true,minimum:0,googleUrl:fullProvider.url,googlePlaceId:'QA_filter',privacyUrl:'https://example.test/privacy',termsUrl:'https://example.test/terms',yelpUrl:'https://www.yelp.com/biz/qa-filter',yelpBusinessId:'qa-filter'};
tenant=(await api('/api/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,reviews}})).tenant;
const before=await (await req('/s/'+tenant.slug+'?preview=1')).text();
ok(!Object.hasOwn(tenant.settings,'minReviewRating'),'No default key inserted');
const originalFetch=globalThis.fetch;let calls=0;
env.GOOGLE_PLACES_API_KEY='qa-only';env.YELP_API_KEY='qa-only';
globalThis.fetch=async url=>{calls++;const u=String(url);if(u.startsWith('https://places.googleapis.com/'))return Response.json({rating:3.5,userRatingCount:4,googleMapsUri:reviews.googleUrl,reviews:fullProvider.reviews.map(r=>({...r,text:{text:r.text},authorAttribution:{displayName:r.author}}))});if(u==='https://api.yelp.com/v3/businesses/qa-filter/reviews')return Response.json({reviews:fullProvider.reviews.map(r=>({...r,user:{name:r.author}}))});if(u==='https://api.yelp.com/v3/businesses/qa-filter')return Response.json({rating:3.5,review_count:4,url:reviews.yelpUrl});throw Error('Forbidden unexpected provider request: '+u)};
try {
 const old=await api('/api/public/'+tenant.slug+'/reviews?preview=1');ok(!Object.hasOwn(old,'minReviewRating'));
 for(const value of ['all',3,4,5]){
  tenant=(await api('/api/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,minReviewRating:value}})).tenant;
  eq(tenant.settings.minReviewRating,value);
  const data=await api('/api/public/'+tenant.slug+'/reviews?preview=1');
  eq(data.providers[0].reviews.map(r=>r.rating),value==='all'?[2,3,4,5]:[2,3,4,5].filter(n=>n>=value));
  eq(data.providers.map(p=>[p.rating,p.count]),[[3.5,4],[3.5,4]]);
  ok(data.providers.every(p=>p.reviews.every(r=>value==='all'||r.rating>=value)),'Both providers filtered');
 }
 const published=await req('/api/public/'+tenant.slug+'/reviews');eq(published.status,409,'Draft filter/source do not change the unconfirmed public snapshot');
 const without={...tenant.settings};delete without.minReviewRating;
 tenant=(await api('/api/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:without})).tenant;eq(tenant.settings.minReviewRating,5,'Older clients preserve saved field');
 for(const invalid of [2,6,'4',null]){
  const response=await req('/api/tenants/'+tenant.id,'PUT',{version:tenant.version,settings:{...tenant.settings,minReviewRating:invalid}});eq(response.status,400);
 }
 for(const variant of ['a','b','c']){
  const html=reviewSection({...tenant.settings,sectionVariants:{reviews:variant}},tenant.slug,false);ok(html.includes('hidden data-omit-empty-reviews="true"'),'Published filter starts absent until real excerpts arrive');
  const noSource=reviewSection({...tenant.settings,reviews:{}},tenant.slug,false);eq(noSource,'');
 }
 const original={...tenant.settings};delete original.minReviewRating;
 const legacy=reviewSection(original,tenant.slug,true);
 ok(!legacy.includes('omit-empty-reviews'),'Absent filter preserves old markup');
 const defaultWithA=reviewSection({...original,sectionVariants:{reviews:'a'}},tenant.slug,true);eq(legacy,defaultWithA);
}finally{globalThis.fetch=originalFetch;}
const report={passed:true,checks,publicationPrerequisite:'Missing QA blocks publication; existing published baseline seeded only for filter isolation. No synthetic QA report.',mockedProviderCalls:calls,actualProviderCalls:0,fullSetAverage:3.5,fullSetCount:4,values:['all',3,4,5]};
fs.writeFileSync((process.env.BV_028B_EVIDENCE||'docs/build-evidence/028B')+'/checks/review-rating-filter.json',JSON.stringify(report,null,2));console.log('PASS '+JSON.stringify(report));
