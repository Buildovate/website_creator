import {esc} from '../shared/html.ts';
import {posted,priced,cents} from '../../expenses-math.js';
const dollars=n=>(n/100).toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});
const colors=['#2855a1','#66768e','#8499bb','#a5b6ce','#34465f','#c5cfde'];
export function chartRows(groups){return groups.filter(r=>r.count>r.unknown&&Number.isFinite(r.knownCents)).map(r=>({...r,value:r.knownCents}));}
export function expenseSeries(data,from,to){
 const entries=data.entries.filter(e=>posted(e)&&e.date<=to),revenues=data.revenues.filter(r=>r.date<=to);
 const months=[...new Set([...entries,...revenues].map(r=>r.date.slice(0,7)))].sort();
 const total=rows=>rows.some(e=>priced(e,data.vendors)===null)?null:rows.reduce((n,e)=>n+priced(e,data.vendors),0);
 return months.filter(m=>m>=from.slice(0,7)).map(month=>{
  const es=entries.filter(e=>e.date.startsWith(month)&&e.date>=from),rs=revenues.filter(e=>e.date.startsWith(month)&&e.date>=from);
  const revenue=rs.length?rs.reduce((n,r)=>n+cents(r.amount),0):null,op=es.filter(e=>e.classification==='Operating');
  const operating=op.length?total(op):null,margin=revenue===null||total(op)===null?null:revenue-total(op);
  const dev=entries.filter(e=>e.classification==='Development'&&e.date.slice(0,7)<=month);
  return {month,revenue,operating,margin,development:dev.length?total(dev):null};
 });
}
export function sparkline(series,key){
 const points=series.map((r,i)=>({x:i,value:r[key]})),valid=points.filter(p=>p.value!==null);
 if(!valid.length)return '<span class="ex-trend-empty">Trend awaits recorded, priced data</span>';
 const lo=Math.min(...valid.map(p=>p.value)),hi=Math.max(...valid.map(p=>p.value)),x=i=>8+i*144/Math.max(1,points.length-1),y=n=>32-(hi===lo?12:(n-lo)/(hi-lo)*24);
 // Missing observations break the line; a single observation stays a dot.
 const paths=[];let path='';for(const p of points){if(p.value===null){if(path)paths.push(path);path='';}else path+=(path?' L':'M')+x(p.x)+' '+y(p.value);}if(path)paths.push(path);
 return '<svg class="ex-spark" data-chart="spark" viewBox="0 0 160 40" role="img" aria-label="'+esc(key+' recorded monthly trend')+'">'+paths.map(d=>'<path d="'+d+'" fill="none" stroke="currentColor" stroke-width="2"/>').join('')+valid.map(p=>'<circle cx="'+x(p.x)+'" cy="'+y(p.value)+'" r="3"><title>'+esc(series[p.x].month+': '+dollars(p.value))+'</title></circle>').join('')+'</svg><span class="ex-trend-caption">'+valid.length+' recorded month'+(valid.length===1?'':'s')+'</span>';
}
const empty=message=>'<div class="ex-chart-empty"><span aria-hidden="true">—</span><h3>No priced data yet</h3><p>'+message+'</p></div>';
export function bars(rows,title){
 if(!rows.length)return empty('Record a cost or add its rate to see this chart. Unknown amounts are never drawn as zero.');
 const max=Math.max(1,...rows.map(r=>Math.abs(r.value)));
 return '<div class="ex-bars" data-chart="bars" role="group" aria-label="'+esc(title)+'">'+rows.map(r=>'<div class="ex-bar-row"><span>'+esc(r.name||r.id)+'</span><strong>'+dollars(r.value)+'</strong><div class="ex-bar-track"><i style="width:'+Math.abs(r.value)/max*100+'%" class="'+(r.development?'is-development':'')+'"></i></div>'+(r.unknown?'<small>Partial · '+r.unknown+' Rate needed</small>':'')+'</div>').join('')+'</div>';
}
export function monthlyChart(trend){const rows=trend.flatMap(r=>['operating','development'].filter(k=>r[k].count>r[k].unknown).map(k=>({id:r.id+' · '+k,value:r[k].knownCents,unknown:r[k].unknown,development:k==='development'})));return bars(rows,'Monthly Operating versus Development cost');}
export function donut(groups,names){
 const rows=chartRows(groups);
 if(!rows.length)return empty('Vendor costs appear after recorded usage has a supplied rate.');
 if(rows.some(r=>r.value<0))return '<p>Net refunds are shown as signed amounts below.</p>'+bars(rows.map(r=>({...r,name:names(r.id)})),'Vendor net cost');
 const positive=rows.filter(r=>r.value>0),sum=positive.reduce((n,r)=>n+r.value,0);if(!sum)return empty('Recorded costs total $0.00. There is no cost share to plot.');let offset=0;
 return '<div class="ex-donut-layout"><svg data-chart="donut" viewBox="0 0 160 160" role="img" aria-label="Recorded priced cost by vendor"><title>Known costs only; unpriced entries excluded</title>'+positive.map((r,i)=>{const length=r.value/sum*100,svg='<circle cx="80" cy="80" r="58" fill="none" stroke="'+colors[i%colors.length]+'" stroke-width="22" pathLength="100" stroke-dasharray="'+length+' '+(100-length)+'" stroke-dashoffset="'+(-offset)+'" transform="rotate(-90 80 80)"><title>'+esc(names(r.id)+': '+dollars(r.value))+'</title></circle>';offset+=length;return svg;}).join('')+'<text x="80" y="77" text-anchor="middle">'+dollars(sum)+'</text><text class="ex-donut-label" x="80" y="95" text-anchor="middle">priced cost</text></svg><ul>'+positive.map((r,i)=>'<li><span class="ex-dot" style="background:'+colors[i%colors.length]+'"></span><span>'+esc(names(r.id))+'</span><strong>'+dollars(r.value)+'</strong></li>').join('')+'</ul></div>';
}
