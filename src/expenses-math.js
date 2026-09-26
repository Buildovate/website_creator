// Preserve fractional cents for metered calls; round only for display. Unknown rates never become zero.
export const cents = value => value === null || value === undefined || value === '' ? null : Number((Number(value) * 100).toFixed(8));
export const dollar = value => value === null ? null : value / 100;
export function effectiveRate(vendor, lineId, date) {
  return (vendor?.rates || []).filter(r => r.id === lineId && r.effective <= date).sort((a,b)=>b.effective.localeCompare(a.effective))[0] || null;
}
export function priced(entry, vendors) {
  if(entry.amount !== null && entry.amount !== undefined) return cents(entry.amount);
  const rate = entry.rate ?? effectiveRate(vendors.find(v=>v.id===entry.vendorId),entry.rateLineId,entry.date)?.rate;
  return rate === null || rate === undefined || entry.units === null ? null : Number((entry.units * rate * 100).toFixed(8));
}
export function allocatedShare(amount,sites,site){const n=sites.length,index=sites.indexOf(site);if(!n||index<0)return 0;const whole=Math.trunc(amount);return Math.trunc(whole/n)+(index<Math.abs(whole%n)?Math.sign(whole):0)+(amount-whole)/n;}
export const posted = e => e.status === 'Posted' && !e.linkedTo;
export function summarize(entries, vendors, products, sites, revenues, from, to, activeSiteCount=sites.length) {
  const inRange=e=>e.date>=from&&e.date<=to;
  const costs=entries.filter(e=>posted(e)&&inRange(e));
  const total=rows=>{const values=rows.map(e=>priced(e,vendors));return {knownCents:Number(values.reduce((n,v)=>n+(v??0),0).toFixed(8)),unknown:values.filter(v=>v===null).length,count:rows.length}};
  const operating=costs.filter(e=>e.classification==='Operating'),development=costs.filter(e=>e.classification==='Development');
  const receipts=revenues.filter(inRange),revenueCents=receipts.reduce((n,r)=>n+cents(r.amount),0);
  const op=total(operating),dev=total(development);
  const marginCents=op.unknown||!receipts.length?null:revenueCents-op.knownCents;
  const group=(key,rows=costs)=>[...new Set(rows.map(e=>e[key]||'Unassigned'))].map(id=>({id,...total(rows.filter(e=>(e[key]||'Unassigned')===id))}));
  const economics=(key,items)=>items.map(item=>{const direct=operating.filter(e=>e[key]===item.id&&!e.recurringId),recurring=operating.filter(e=>e.recurringId&&(key==='siteId'?(e.allocatedSites||[]).includes(item.id):e.productId===item.id));const d=total(direct);let allocatedCents=0,unknown=d.unknown;for(const e of recurring){const p=priced(e,vendors);if(p===null)unknown++;else allocatedCents+=key==='siteId'?allocatedShare(p,e.allocatedSites,item.id):p;}const r=receipts.filter(r=>r[key]===item.id),revenueCents=r.reduce((n,r)=>n+cents(r.amount),0);return {id:item.id,name:item.name,directCents:d.knownCents,allocatedCents,unknown,revenueCents,marginCents:unknown||!r.length?null:revenueCents-d.knownCents-allocatedCents,generation:total(direct.filter(e=>e.costType==='Generation')),running:total(direct.filter(e=>e.costType!=='Generation'))}});
  const allDevelopment=total(entries.filter(e=>posted(e)&&e.classification==='Development'&&e.date<=to));
  const allOp=entries.filter(e=>posted(e)&&e.classification==='Operating'&&e.date<=to),allRev=revenues.filter(e=>e.date<=to),allOpTotals=total(allOp);
  const cumulativeMarginCents=allRev.length&&!allOpTotals.unknown?allRev.reduce((n,r)=>n+cents(r.amount),0)-allOpTotals.knownCents:null;
  const elapsedMonths=Math.max(1,(Date.parse(to)-Date.parse(from)+86400000)/86400000/(365.25/12));
  const monthlyMargin=marginCents===null?null:marginCents/elapsedMonths;
  const remaining=cumulativeMarginCents===null?null:Math.max(0,allDevelopment.knownCents-cumulativeMarginCents);
  const payback=allDevelopment.unknown||monthlyMargin===null||monthlyMargin<=0||!activeSiteCount||remaining===null?null:[6,12,24].map(months=>({months,sites:Math.ceil(remaining/(monthlyMargin/activeSiteCount*months))}));
  const months=[...new Set([...entries.filter(e=>e.date<=to).map(e=>e.date.slice(0,7)),...revenues.filter(e=>e.date<=to).map(e=>e.date.slice(0,7))])].sort();
  let accumulated=0,breakEven=null,known=true;for(const month of months){const expenseRows=entries.filter(e=>posted(e)&&e.date.startsWith(month)),ct=total(expenseRows);if(ct.unknown)known=false;accumulated+=revenues.filter(r=>r.date.startsWith(month)).reduce((n,r)=>n+cents(r.amount),0)-ct.knownCents;if(known&&allDevelopment.count&&accumulated>=0&&revenues.some(r=>r.date.slice(0,7)<=month)&&!breakEven)breakEven=month;}
  const trend=months.filter(m=>m>=from.slice(0,7)).map(month=>({id:month,...total(costs.filter(e=>e.date.startsWith(month))),operating:total(operating.filter(e=>e.date.startsWith(month))),development:total(development.filter(e=>e.date.startsWith(month)))}));
  return {from,to,operating:op,development:dev,revenueCents:receipts.length?revenueCents:null,marginCents,marginPercent:marginCents===null||revenueCents<=0?null:100*marginCents/revenueCents,recurring:total(operating.filter(e=>e.recurringId)),direct:total(operating.filter(e=>!e.recurringId)),vendors:group('vendorId'),categories:group('category'),models:group('model',costs.filter(e=>e.model)),products:economics('productId',products),sites:economics('siteId',sites),trend,developmentGroups:{month:group('month',development.map(e=>({...e,month:e.date.slice(0,7)}))),phase:group('phase',development),ticket:group('ticket',development),vendor:group('vendorId',development)},allDevelopment,cumulativeMarginCents,payback,breakEven};
}
export function reconcile(entries,vendors,from,to){const rows=entries.filter(e=>e.date>=from&&e.date<=to);return vendors.flatMap(v=>[...new Set(rows.filter(e=>e.vendorId===v.id).map(e=>e.date.slice(0,7)))].map(month=>{const selected=rows.filter(e=>e.vendorId===v.id&&e.date.startsWith(month));const actual=selected.filter(e=>e.source==='bank/card feed'&&!['Failed','Declined'].includes(e.status));const captured=selected.filter(e=>posted(e)&&e.source!=='bank/card feed');const values=captured.map(e=>priced(e,vendors));const bankCents=actual.length?actual.reduce((n,e)=>n+(priced(e,vendors)??0),0):null;const trackedCents=values.some(v=>v===null)?null:values.reduce((n,v)=>n+v,0);return {vendorId:v.id,month,bankCents,trackedCents,differenceCents:bankCents===null||trackedCents===null?null:bankCents-trackedCents,status:bankCents===null?'Not connected':trackedCents===null?'Rate needed':bankCents===trackedCents?'Matched':'Needs review'}}));}
export function csv(rows){
 if(!rows.length)return '';const keys=[...new Set(rows.flatMap(Object.keys))];
 const quote=v=>{let value=String(v??'');if(typeof v!=='number'&&/^[=+@\-\t\r]/.test(value))value="'"+value;return '"'+value.replaceAll('"','""')+'"'};
 return [keys.map(quote).join(','),...rows.map(r=>keys.map(k=>quote(typeof r[k]==='object'?JSON.stringify(r[k]):r[k])).join(','))].join('\r\n');
}
export function parseCsv(source){source=source.replace(/^\uFEFF/,'');const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<source.length;i++){const c=source[i];if(c==='"'){if(quoted&&source[i+1]==='"'){cell+='"';i++}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&source[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}if(quoted)throw Error('Close the quoted CSV field.');row.push(cell);if(row.some(Boolean))rows.push(row);const keys=rows.shift()||[];if(new Set(keys).size!==keys.length||keys.some(k=>['__proto__','constructor','prototype'].includes(k)))throw Error('Use unique CSV column names.');return rows.map(r=>Object.fromEntries(keys.map((k,i)=>[k,r[i]??''])));}
