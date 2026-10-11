// Reviewed advertising rules are supplied by a platform administrator, never inferred from a state name.
export interface ReviewedLegalPolicy {
 id:string; revision:string; status:'needs-review'|'reviewed'; jurisdiction:string; trade:string;
 reviewedBy:string; reviewedAt:string; expiresAt:string; referenceUrl:string;
 requireLicense:boolean; footerDisclosure:string; allowBonded:boolean; allowInsured:boolean;
}
export interface LegalSettings {jurisdiction:string;licenseState:string;policy:ReviewedLegalPolicy|null}
const object=(v:any)=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
const text=(v:any,max=250)=>{if(v==null)return '';if(typeof v!=='string'||v.trim().length>max)throw Error('Legal policy text is invalid or too long.');return v.trim();};
const date=(v:any)=>{const s=text(v,40);if(s&&!Number.isFinite(Date.parse(s)))throw Error('Enter a valid policy review date.');return s?new Date(s).toISOString():'';};
export function normalizeLegal(value:unknown):LegalSettings {
 const v=object(value),licenseState=text(v.licenseState,2).toUpperCase();
 if(licenseState&&!/^[A-Z]{2}$/.test(licenseState))throw Error('Use a two-letter license state.');
 let policy:ReviewedLegalPolicy|null=null;
 if(v.policy!=null){
  const p=object(v.policy),referenceUrl=text(p.referenceUrl,1000);
  if(referenceUrl){let u;try{u=new URL(referenceUrl)}catch{}if(!u||u.protocol!=='https:'||u.username||u.password)throw Error('Use an HTTPS policy review reference.');}
  policy={id:text(p.id,80),revision:text(p.revision,40),status:p.status==='reviewed'?'reviewed':'needs-review',jurisdiction:text(p.jurisdiction,80),trade:text(p.trade,80),reviewedBy:text(p.reviewedBy,150),reviewedAt:date(p.reviewedAt),expiresAt:date(p.expiresAt),referenceUrl,requireLicense:p.requireLicense===true,footerDisclosure:text(p.footerDisclosure,1200),allowBonded:p.allowBonded===true,allowInsured:p.allowInsured===true};
  if(policy.status==='reviewed'&&(!policy.id||!policy.revision||!policy.jurisdiction||!policy.trade||!policy.reviewedBy||!policy.reviewedAt||!policy.referenceUrl))throw Error('A reviewed policy needs its ID, revision, jurisdiction, trade, reviewer, review date and reference.');
  if(policy.expiresAt&&policy.reviewedAt&&Date.parse(policy.expiresAt)<=Date.parse(policy.reviewedAt))throw Error('Policy expiry must follow its review date.');
 }
 return {jurisdiction:text(v.jurisdiction,80),licenseState,policy};
}
export function assessLegalPolicy(settings:any,time=Date.now()) {
 const legal=normalizeLegal(settings.platform?.legal),policy=legal.policy,errors:string[]=[];
 const bound=!!policy&&policy.jurisdiction===legal.jurisdiction&&policy.trade===settings.trade;
 const reviewed=!!policy&&bound&&policy.status==='reviewed'&&Date.parse(policy.reviewedAt)<=time&&(!policy.expiresAt||Date.parse(policy.expiresAt)>time);
 if(policy&&!reviewed)errors.push('Needs review: the policy must be reviewed, current and match this business jurisdiction and trade.');
 if(reviewed&&policy?.requireLicense&&(!String(settings.license||'').trim()||!legal.licenseState))errors.push('The reviewed policy requires a license number and license state before publication.');
 return {state:!reviewed?'needs-review':errors.length?'missing-facts':'reviewed',label:!reviewed?'Needs review':errors.length?'Required facts missing':'Reviewed policy on file',reviewed,errors,requiredLicense:bound&&policy?.status==='reviewed'&&policy.requireLicense===true,footerDisclosure:bound&&policy?.status==='reviewed'?policy.footerDisclosure:'',legal};
}
export function validateLegalPublication(settings:any,time=Date.now()) {const result=assessLegalPolicy(settings,time);if(result.errors.length)throw Error(result.errors.join(' '));return result;}
export function policyChanged(next:any,previous:any) {return JSON.stringify(normalizeLegal(next?.platform?.legal).policy)!==JSON.stringify(normalizeLegal(previous?.platform?.legal).policy);}
// Apply at render time too: expiry must not leave optional structured claims visible.
export function publicLegalSettings(settings:any,time=Date.now()) {
 const result=assessLegalPolicy(settings,time),p=settings.platform||{},f=p.footer||{};
 const bonded=result.reviewed&&result.legal.policy?.allowBonded===true,insured=result.reviewed&&result.legal.policy?.allowInsured===true;
 const visible=f.visible||{},showInsured=insured&&visible.insured!==false;
 return {...settings,platform:{...p,legal:result.legal,footer:{...f,bonded:bonded&&f.bonded===true,insured:showInsured&&f.insured===true,locations:(f.locations||[]).map((l:any)=>({...l,bonded:bonded&&l.bonded===true,insured:insured&&l.insured===true}))}},businessTrust:settings.businessTrust?{...settings.businessTrust,insured:settings.businessTrust.insured===false?false:showInsured?settings.businessTrust.insured:null,confirmed:{...settings.businessTrust.confirmed,insured:(showInsured||settings.businessTrust.insured===false)&&settings.businessTrust.confirmed?.insured===true,license:visible.license!==false&&settings.businessTrust.confirmed?.license===true}}:settings.businessTrust};
}
