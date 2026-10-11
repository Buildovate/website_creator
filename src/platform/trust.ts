// Owner selections are stable facts, separate from review-provider connections.
export const TRUST_NETWORKS = [
 {id:'google',name:'Google',kind:'review',domains:['google.com','g.co','maps.app.goo.gl']},
 {id:'yelp',name:'Yelp',kind:'review',domains:['yelp.com']},
 {id:'angi',name:'Angi',kind:'review',domains:['angi.com']},
 {id:'homeadvisor',name:'HomeAdvisor',kind:'review',domains:['homeadvisor.com']},
 {id:'houzz',name:'Houzz',kind:'review',domains:['houzz.com']},
 {id:'facebook',name:'Facebook Recommendations',kind:'profile',domains:['facebook.com']},
 {id:'bbb',name:'BBB',kind:'credential',domains:['bbb.org']},
 {id:'thumbtack',name:'Thumbtack',kind:'review',domains:['thumbtack.com']},
 {id:'nextdoor',name:'Nextdoor',kind:'profile',domains:['nextdoor.com']},
 {id:'guildquality',name:'GuildQuality',kind:'review',domains:['guildquality.com']},
 {id:'porch',name:'Porch',kind:'review',domains:['porch.com']},
 {id:'nate',name:'NATE',kind:'credential',domains:['natex.org']},
 {id:'state-license',name:'State license board',kind:'credential',domains:[]},
 {id:'epa',name:'EPA',kind:'credential',domains:['epa.gov']},
 {id:'manufacturer',name:'Manufacturer credential',kind:'credential',domains:[]},
 {id:'custom',name:'Custom',kind:'credential',domains:[]}
] as const;
export type TrustNetworkId=typeof TRUST_NETWORKS[number]['id'];
export const TRUST_PLACEMENTS=['below-hero','above-reviews','services','service-hero','forms','footer'] as const;
export type TrustPlacement=typeof TRUST_PLACEMENTS[number];
export interface TrustSelection {
 id:TrustNetworkId; enabled:boolean; approved:boolean; profileUrl:string; label:string;
 display:'name'|'rating'; rating:number|null; reviewCount:number|null; credential:string;
 evidence:{url:string; note:string; confirmed:boolean; checkedAt:string}; expiresAt:string;
}
export interface TrustSettings {version:1;enabled:boolean;layout:'auto'|'row'|'carousel';placements:TrustPlacement[];showRatings:boolean;networks:TrustSelection[]}
function text(value:unknown,max:number):string {
 if(value==null)return '';if(typeof value!=='string'||value.trim().length>max)throw Error('Trust text is invalid or too long.');return value.trim();
}
function object(value:any,label:string){if(!value||typeof value!=='object'||Array.isArray(value))throw Error(label+' must be an object.');return value;}
function https(value:unknown,domains:readonly string[]=[]):string {
 const s=text(value,600);if(!s)return '';let u:URL;try{u=new URL(s)}catch{throw Error('Use a valid HTTPS trust link.');}
 if(u.protocol!=='https:'||u.username||u.password||u.port||!u.hostname.includes('.')||u.hostname==='localhost'||/^(\d+\.){3}\d+$/.test(u.hostname)||u.hostname.includes(':'))throw Error('Use a public HTTPS trust link without credentials.');
 if(domains.length&&!domains.some(d=>u.hostname===d||u.hostname.endsWith('.'+d)))throw Error('Use this network’s own HTTPS profile URL.');return u.href;
}
function date(value:unknown):string {
 const s=text(value,10);if(s&&(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(Date.parse(s))||new Date(s).toISOString().slice(0,10)!==s))throw Error('Use a valid YYYY-MM-DD evidence date.');return s;
}
function number(value:unknown,max:number,decimal=false):number|null {
 if(value==null||value==='')return null;if(typeof value!=='number'||!Number.isFinite(value)||value<1||value>max||(!decimal&&!Number.isInteger(value))||(decimal&&Math.abs(value*10-Math.round(value*10))>1e-8))throw Error('Trust rating or review count is invalid.');return value;
}
export function cleanTrust(value:any,previous?:TrustSettings):TrustSettings {
 if(value===undefined)return cleanTrust(previous||{});object(value,'Trust selections');
 if(value.version!==undefined&&value.version!==1)throw Error('Unsupported trust version.');
 const layout=value.layout??'auto';if(!['auto','row','carousel'].includes(layout))throw Error('Choose a supported trust layout.');
 const placements=value.placements??['below-hero'];if(!Array.isArray(placements)||placements.length>TRUST_PLACEMENTS.length||placements.some(p=>!TRUST_PLACEMENTS.includes(p))||new Set(placements).size!==placements.length)throw Error('Choose unique trust placements.');
 const entries=value.networks??[];if(!Array.isArray(entries)||entries.length>TRUST_NETWORKS.length)throw Error('Too many trust networks.');
 const seen=new Set();const networks=entries.map((raw:any):TrustSelection=>{
  object(raw,'Trust network');const definition=TRUST_NETWORKS.find(n=>n.id===raw.id);if(!definition||seen.has(raw.id))throw Error('Choose a supported network only once.');seen.add(raw.id);
  const evidence=object(raw.evidence??{},'Trust evidence'),display=raw.display??'name';if(!['name','rating'].includes(display))throw Error('Choose a supported trust display.');
  const rating=number(raw.rating,5,true),reviewCount=number(raw.reviewCount,10000000),credential=text(raw.credential,100);
  if(definition.kind!=='review'&&(rating!==null||reviewCount!==null||display==='rating'))throw Error('This network does not support star ratings.');
  if(definition.kind!=='credential'&&credential)throw Error('Use a credential network for membership claims.');
  return {id:definition.id,enabled:raw.enabled===true,approved:raw.approved===true,profileUrl:https(raw.profileUrl,definition.domains),label:text(raw.label,60),display,rating,reviewCount,credential,evidence:{url:https(evidence.url),note:text(evidence.note,500),confirmed:evidence.confirmed===true,checkedAt:date(evidence.checkedAt)},expiresAt:date(raw.expiresAt)};
 });
 return {version:1,enabled:value.enabled===true,layout,placements,showRatings:value.showRatings===true,networks};
}
export function evidenceCurrent(n:TrustSelection,at=new Date()):boolean {
 const today=at.toISOString().slice(0,10);return !!(n.evidence.confirmed&&n.evidence.url&&n.evidence.checkedAt&&n.evidence.checkedAt<=today&&n.expiresAt&&n.expiresAt>=today&&n.expiresAt>=n.evidence.checkedAt);
}
function hasClaim(n:TrustSelection){return n.display==='rating'||n.rating!==null||n.reviewCount!==null||!!n.credential;}
export function trustClaimReady(n:TrustSelection,business:any={},at=new Date()):boolean {
 if(!n.approved||!n.profileUrl||!evidenceCurrent(n,at))return false;
 if(n.display==='rating'||n.rating!==null||n.reviewCount!==null){if(n.rating===null||n.reviewCount===null)return false;}
 if(n.id==='state-license'&&n.credential&&!(business.confirmed?.license===true&&business.licenseNumber&&business.licenseState))return false;
 return true;
}
export function validateTrustPublication(value:any,business:any={},at=new Date()):void {
 const settings=cleanTrust(value);if(!settings.enabled)return;
 for(const n of settings.networks){if(n.enabled&&hasClaim(n)&&!trustClaimReady(n,business,at))throw Error('Confirm current source evidence, expiry and supporting business facts for '+TRUST_NETWORKS.find(d=>d.id===n.id)!.name+' before publishing its rating or credential.');}
}
// Re-evaluate expiry on every render; publishing cannot freeze an expired claim.
export function publicTrustSelections(value:any,business:any={},at=new Date()):TrustSelection[] {
 let settings:TrustSettings;try{settings=cleanTrust(value)}catch{return [];}if(!settings.enabled)return [];
 const today=at.toISOString().slice(0,10);
 return settings.networks.filter(n=>n.enabled&&n.approved&&!!n.profileUrl&&(!n.expiresAt||n.expiresAt>=today)&&(!hasClaim(n)||trustClaimReady(n,business,at)));
}
