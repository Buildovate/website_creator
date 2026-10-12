export const TRUST_GROUPS = ['years','license','insured','crewSize','warranty','certifications','google','jobsCompleted'] as const;
export type TrustGroup = typeof TRUST_GROUPS[number];
export interface BusinessTrust {
 years:number|null; licenseNumber:string; licenseState:string; insured:boolean|null;
 crewSize:number|null; warrantyYears:number|null; certifications:string[];
 googleRating:number|null; googleReviewCount:number|null; googleUrl:string; jobsCompleted:number|null;
 confirmed:Record<TrustGroup,boolean>;
}
export function cleanBusinessTrust(value:any,previous?:BusinessTrust):BusinessTrust {
 if(value===undefined)return cleanBusinessTrust(previous||{});
 if(value===null||typeof value!=='object'||Array.isArray(value))throw Error('Business trust must be an object.');
 const str=(v:any,max:number)=>{if(v==null)return '';if(typeof v!=='string'||v.trim().length>max)throw Error('Trust text is too long or invalid.');return v.trim();};
 const num=(v:any,max:number,decimal=false)=>{if(v===''||v==null)return null;const n=Number(v);if(!['number','string'].includes(typeof v)||!Number.isFinite(n)||n<0||n>max||(!decimal&&!Number.isInteger(n)))throw Error('Enter a valid nonnegative trust number.');return n;};
 const years=num(value.years,200),crewSize=num(value.crewSize,100000),warrantyYears=num(value.warrantyYears,100),jobsCompleted=num(value.jobsCompleted,10000000);
 const googleRating=num(value.googleRating,5,true),googleReviewCount=num(value.googleReviewCount,10000000);
 if(googleRating!==null&&(googleRating<1||Math.round(googleRating*10)!==googleRating*10))throw Error('Google rating must be from 1 to 5 with at most one decimal.');
 const licenseNumber=str(value.licenseNumber,60),licenseState=str(value.licenseState,2).toUpperCase();
 if(licenseState&&!/^[A-Z]{2}$/.test(licenseState))throw Error('Use a two-letter license state.');
 const insured=value.insured??null;if(insured!==null&&typeof insured!=='boolean')throw Error('Choose Yes, No or leave insurance blank.');
 const certifications=value.certifications??[];
 if(!Array.isArray(certifications)||certifications.length>8)throw Error('Use up to eight credentials.');
 const credentials=certifications.map(v=>str(v,120)).filter(Boolean);
 const googleUrl=str(value.googleUrl,500);
 if(googleUrl){let u;try{u=new URL(googleUrl);}catch{throw Error('Enter the Google review source URL.');}if(u.protocol!=='https:'||u.username||u.password||!(['google.com','www.google.com','maps.google.com','g.co','maps.app.goo.gl'].includes(u.hostname)))throw Error('Use an HTTPS Google review source link.');}
 const present={years:years!==null,license:!!licenseNumber&&!!licenseState,insured:insured!==null,crewSize:crewSize!==null,warranty:warrantyYears!==null,certifications:credentials.length>0,google:googleRating!==null&&googleReviewCount!==null&&!!googleUrl,jobsCompleted:jobsCompleted!==null};
 const confirmed=Object.fromEntries(TRUST_GROUPS.map(key=>[key,value.confirmed?.[key]===true&&present[key]])) as Record<TrustGroup,boolean>;
 return {years,licenseNumber,licenseState,insured,crewSize,warrantyYears,certifications:credentials,googleRating,googleReviewCount,googleUrl,jobsCompleted,confirmed};
}
