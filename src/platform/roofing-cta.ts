// #018: one saved Roofing placement; prices are explicitly approved book entries.
export const ROOFING_SLOTS = {'after-services':'Homepage — after services','after-story':'Homepage — after roof layers'} as const;
export function cleanRoofingCta(value:any={},previous:any={},generation='') {
 const v=value&&typeof value==='object'?value:{};
 const locked=v.locked===undefined?previous.locked===true:v.locked===true;
 const changed=!!previous.generation&&generation!==previous.generation;
 const seed=String(generation||'roofing');let hash=0;for(const c of seed)hash=(hash*31+c.charCodeAt(0))>>>0;
 const slot=changed&&!locked?Object.keys(ROOFING_SLOTS)[hash%2]:Object.hasOwn(ROOFING_SLOTS,v.slot)?v.slot:Object.hasOwn(ROOFING_SLOTS,previous.slot)?previous.slot:Object.keys(ROOFING_SLOTS)[hash%2];
 return {slot,locked,generation,burst:v.burst!==false,priceItemId:typeof v.priceItemId==='string'?v.priceItemId.slice(0,100):''};
}
export function cleanRoofingPriceBook(value:any={}) {
 return {items:(Array.isArray(value?.items)?value.items:[]).slice(0,100).filter((x:any)=>x&&typeof x==='object').map((x:any,i:number)=>({id:String(x.id||'roof-price-'+i).slice(0,100),service:String(x.service||'').trim().slice(0,100),tier:String(x.tier||'').slice(0,60),label:String(x.label||x.service||'').trim().slice(0,160),scope:String(x.scope||'').trim().slice(0,500),priceCents:typeof x.priceCents==='number'&&Number.isSafeInteger(x.priceCents)&&x.priceCents>0?x.priceCents:null,approved:x.approved===true&&!x.isSample&&!x.sample,enabled:x.enabled!==false}))};
}
export function roofingPrice(s:any) {
 const selected=s.roofingCta?.priceItemId;
 return cleanRoofingPriceBook(s.priceBook).items.find((x:any)=>(!selected||x.id===selected)&&x.approved&&x.enabled&&x.priceCents!==null&&(s.services||[]).some((service:any)=>service.name.toLowerCase()===x.service.toLowerCase()));
}
