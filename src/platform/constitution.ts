import {normalizeLegal,type LegalSettings} from './legal-policy.ts';
// Pack 0 contracts shared by server and browser. No provider secrets belong here.
export const CONSTITUTION = Object.freeze({version:1, salesCommission:0.5, videoPackage:'Higgsfield Ultra', upsellDiscount:0.10, upsellWindowSeconds:900, maxServiceCities:5, requireOwnerAdApproval:true});
export const PRICE_BOOK = Object.freeze([
  {id:'ugc-module',name:'UGC upload module',priceCents:0},
  {id:'ugc-standard',name:'AI UGC Pack',priceCents:19700,includedVideos:2},
  {id:'ugc-plus',name:'AI UGC Plus',priceCents:29700},
  {id:'ugc-refresh',name:'AI UGC refresh',priceCents:9700},
]);
export const LENDERS = {sfc:'Service Finance Company',wisetack:'Wisetack',sunbit:'Sunbit'} as const;
export const SOCIALS = {facebook:'Facebook',instagram:'Instagram',youtube:'YouTube',tiktok:'TikTok',googleBusiness:'Google Business',linkedin:'LinkedIn',xTwitter:'X (Twitter)',nextdoor:'Nextdoor'} as const;
export const COMPANY_FIELDS = {name:'Company name',address:'Address',phone:'Phone',email:'Email',hours:'Hours of operation',license:'License number',bonded:'Bonded',insured:'Insured'} as const;
export type CompanyField = keyof typeof COMPANY_FIELDS;
export type Visibility = Record<CompanyField,boolean>;
export interface Location {id:string;name:string;address:string;phone:string;email:string;hours:string;license:string;bonded:boolean;insured:boolean;visible:Visibility}
export interface Lender {id:keyof typeof LENDERS;enabled:boolean;applicationUrl:string;confirmed:boolean}
export interface FinancingProgram {id:string;name:string;lenderId:string;apr:number;months:number;enabled:boolean;confirmed:boolean;deferredInterest:boolean}
export interface ServiceFinanceTerms {lenderId:string;amount:number;downPayment:number;apr:number;months:number;confirmed:boolean}
export interface Promotion {serviceNames:string[];graphic:string;id:string;enabled:boolean;title:string;description:string;reward:string;terms:string;startsAt:string;endsAt:string;question:string;choices:string[];answer:number;code:string}
export interface PlatformSettings {
  legal:LegalSettings;
  version:1;
  neighborhood:{enabled:boolean;country:string;region:string;proofs:{city:string;url:string;confirmed:boolean}[]};
  questionnaire:{story:string;priorities:string;factsConfirmed:boolean};
  footer:{financingDisclosure:string;visible:Visibility;bonded:boolean;insured:boolean;locations:Location[];socials:Record<keyof typeof SOCIALS,{enabled:boolean;url:string}>};
  financing:{enabled:boolean;lenders:Lender[];serviceTerms:ServiceFinanceTerms|null;programs:FinancingProgram[]};
  promotions:{enabled:boolean;offers:Promotion[]};
}
const obj=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const str=(v:unknown,max=250)=>typeof v==='string'?v.trim().slice(0,max):'';
function check(ok:unknown,message:string):asserts ok {if(!ok)throw new Error(message)}
export function safeHttps(value:unknown):string {
  const raw=str(value,2048);if(!raw)return '';
  try {const url=new URL(raw);check(url.protocol==='https:'&&!url.username&&!url.password&&url.hostname.includes('.')&&!/[\u0000-\u0020]/.test(raw),'');return url.href;}
  catch {throw new Error('Use a complete HTTPS link without a username or password.');}
}
const visibility=(value:unknown):Visibility=>Object.fromEntries(Object.keys(COMPANY_FIELDS).map(k=>[k,obj(value)[k]!==false])) as Visibility;
const id=(value:unknown,fallback:string)=>{const v=str(value,80)||fallback;check(/^[a-zA-Z0-9_-]{1,80}$/.test(v),'Use a valid record identifier.');return v;};
function list(value:unknown,maximum:number,label:string):unknown[] {if(value==null)return [];check(Array.isArray(value)&&value.length<=maximum,`${label}: at most ${maximum} entries.`);return value;}
export function normalizePlatform(value:unknown):PlatformSettings {
  const v=obj(value),q=obj(v.questionnaire),f=obj(v.footer),social=obj(f.socials),fin=obj(v.financing),prom=obj(v.promotions);
  check(v.version===undefined||v.version===1,'This questionnaire version is not supported. Reload before saving.');
  const local=obj(v.neighborhood),proofs=list(local.proofs,5,'Neighborhood reviews').map(item=>{const proof=obj(item);return {city:str(proof.city,100),url:safeHttps(proof.url),confirmed:proof.confirmed===true};});
  const neighborhood={enabled:local.enabled!==false,country:str(local.country,2).toUpperCase(),region:str(local.region,100),proofs};
  check(!neighborhood.country||/^[A-Z]{2}$/.test(neighborhood.country),'Use a two-letter country code.');
  check(proofs.every(p=>!p.confirmed||(p.city&&p.url&&neighborhood.country&&neighborhood.region)),'Confirmed local reviews need a city, review link, country and region.');
  check(new Set(proofs.map(p=>p.city.toLowerCase())).size===proofs.length,'List each review city once.');
  const locations=list(f.locations,10,'Locations').map((item,i)=>{const l=obj(item),out={id:id(l.id,'location-'+(i+1)),name:str(l.name),address:str(l.address,500),phone:str(l.phone,40),email:str(l.email),hours:str(l.hours),license:str(l.license),bonded:l.bonded===true,insured:l.insured===true,visible:visibility(l.visible)};check(!!out.name,'Name each business location.');check(!out.email||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email),'Enter a valid location email.');return out;});
  check(new Set(locations.map(l=>l.id)).size===locations.length,'Each location needs a unique identifier.');
  const socials=Object.fromEntries(Object.keys(SOCIALS).map(k=>{const s=obj(social[k]),url=safeHttps(s.url);check(s.enabled!==true||url,'Add a profile link before showing a social button.');return [k,{enabled:s.enabled===true,url}];})) as PlatformSettings['footer']['socials'];
  const incoming=list(fin.lenders,3,'Lenders').map(obj);
  check(incoming.every(l=>typeof l.id==='string'&&Object.hasOwn(LENDERS,l.id)),'Choose a supported financing company.');
  check(new Set(incoming.map(l=>l.id)).size===incoming.length,'Choose each financing company once.');
  const lenders=(Object.keys(LENDERS) as (keyof typeof LENDERS)[]).map(key=>{const l=incoming.find(x=>x.id===key)||{},applicationUrl=safeHttps(l.applicationUrl),enabled=l.enabled===true,confirmed=l.confirmed===true;check(!enabled||(applicationUrl&&confirmed),'Confirm the merchant relationship and approved link before enabling a lender.');return {id:key,enabled,applicationUrl,confirmed};});
  check(fin.enabled!==true||lenders.some(l=>l.enabled),'Enable at least one confirmed lender before showing Financing.');
  const term=obj(fin.serviceTerms);let serviceTerms:ServiceFinanceTerms|null=null;
  if(Object.keys(term).length){
    serviceTerms={lenderId:str(term.lenderId,30),amount:Number(term.amount),downPayment:Number(term.downPayment??0),apr:Number(term.apr),months:Number(term.months),confirmed:term.confirmed===true};
    check(Object.hasOwn(LENDERS,serviceTerms.lenderId),'Choose a configured financing partner for the service example.');
    check(term.amount!==''&&term.apr!==''&&term.months!==''&&term.apr!=null,'Enter the approved example amount, APR and term.');
    financingEstimate(serviceTerms.amount,serviceTerms.downPayment,serviceTerms.apr,serviceTerms.months);
  }
  // Old single-program settings migrate once. An explicit empty list means hide.
  const rawPrograms=fin.programs===undefined&&serviceTerms?[{...serviceTerms,id:'legacy-service',name:'Payment plan',enabled:true}]:fin.programs;
  const programs=list(rawPrograms,24,'Financing programs').map((item,i)=>{
    const p=obj(item);check(p.apr!==''&&p.apr!=null&&p.months!==''&&p.months!=null,'Each program needs its approved APR and term.');
    const out:FinancingProgram={id:id(p.id,'program-'+(i+1)),name:str(p.name,80),lenderId:str(p.lenderId,30),apr:Number(p.apr),months:Number(p.months),enabled:p.enabled!==false,confirmed:p.confirmed===true,deferredInterest:p.deferredInterest===true};
    check(out.name&&Object.hasOwn(LENDERS,out.lenderId),'Name each financing program and choose its configured partner.');
    financingEstimate(1000,0,out.apr,out.months);return out;
  });
  check(new Set(programs.map(p=>p.id)).size===programs.length,'Each financing program needs a unique identifier.');
  const offers=list(prom.offers,12,'Promotions').map((item,i)=>{const p=obj(item),choices=list(p.choices,4,'Quiz choices').map(x=>str(x,160)),enabled=p.enabled===true;
    const out:Promotion={serviceNames:list(p.serviceNames,24,'Promotion services').map(x=>str(x,160)).filter(Boolean),graphic:p.graphic==='roof-repair'?'roof-repair':'',id:id(p.id,'offer-'+(i+1)),enabled,title:str(p.title,100),description:str(p.description,600),reward:str(p.reward,150),terms:str(p.terms,2000),startsAt:str(p.startsAt,40),endsAt:str(p.endsAt,40),question:str(p.question,200),choices,answer:Number(p.answer??0),code:str(p.code,60)};
    check(Number.isInteger(out.answer)&&out.answer>=0&&out.answer<Math.max(choices.length,1),'Choose a valid quiz answer.');
    const start=Date.parse(out.startsAt),end=Date.parse(out.endsAt);
    check((!out.startsAt||Number.isFinite(start))&&(!out.endsAt||Number.isFinite(end)),'Use a valid promotion start and end date.');
    check(!out.startsAt||!out.endsAt||end>start,'Promotion end must be after its start.');
    check(!enabled||(out.title&&out.reward&&out.terms&&out.question&&choices.length>=2&&choices.every(Boolean)&&new Set(choices).size===choices.length&&out.code&&out.startsAt&&out.endsAt),'An active offer needs a title, reward, terms, start/end dates, code and quiz with distinct answers.');
    if(out.startsAt)out.startsAt=new Date(start).toISOString();if(out.endsAt)out.endsAt=new Date(end).toISOString();return out;
  });
  check(new Set(offers.map(p=>p.id)).size===offers.length,'Each promotion needs a unique identifier.');
  return {version:1,legal:normalizeLegal(v.legal),neighborhood,questionnaire:{story:str(q.story,2500),priorities:str(q.priorities,1500),factsConfirmed:q.factsConfirmed===true},footer:{financingDisclosure:str(f.financingDisclosure,3000),visible:visibility(f.visible),bonded:f.bonded===true,insured:f.insured===true,locations,socials},financing:{enabled:fin.enabled===true,lenders,serviceTerms,programs},promotions:{enabled:prom.enabled===true,offers}};
}
export function activeOffers(platform:PlatformSettings,time=Date.now()) {return platform.promotions.enabled?platform.promotions.offers.filter(p=>p.enabled&&Date.parse(p.startsAt)<=time&&Date.parse(p.endsAt)>time):[];}
export const FINANCING_DISCLOSURE='All financing and loan terms are subject to change based on approved credit. Estimate only; partner underwriting applies. Rates, terms and eligibility vary. This is not a loan offer or approval.';
export function financingEstimate(amount:number,downPayment:number,apr:number,months:number) {
  check(Number.isFinite(amount)&&amount>0&&amount<=1000000,'Enter a project cost above $0 and up to $1,000,000.');
  check(Number.isFinite(downPayment)&&downPayment>=0&&downPayment<amount,'Enter a down payment below the project cost.');
  check(Number.isFinite(apr)&&apr>=0&&apr<=100,'Enter an illustrative APR from 0 to 100.');
  check(Number.isInteger(months)&&months>=1&&months<=360,'Enter a term from 1 to 360 whole months.');
  const principal=amount-downPayment,rate=apr/1200;
  const monthly=rate===0?principal/months:principal*rate/(-Math.expm1(-months*Math.log1p(rate)));
  return {principal,monthly,total:monthly*months,interest:Math.max(0,monthly*months-principal),disclosure:FINANCING_DISCLOSURE};
}
