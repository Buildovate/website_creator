import fs from 'node:fs';import {createHash} from 'node:crypto';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/027A-part1';
export function normalizePart1HTML(html){
 return html.replace(/<script src="\/site-navigation-init\.js"><\/script>/g,'').replace(/<header class="(?:kit-header shared-site-header|shared-site-header)[^"]*">[\s\S]*?<\/header>/g,'<header data-part1-navigation></header>')
 .replace(/<script defer src="\/site-navigation\.js"><\/script>/g,'')
 .replace(/<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/g,tag=>/AI.*example/i.test(tag)?tag:'')
 .replace(/<span class="(?:core-sample|rs-sample)"[^>]*>Sample<\/span>\s*/g,'')
 .replace(/<p class="(?:sm-caption|sample-disclosure|cx-film-disclosure)">[\s\S]*?<\/p>/g,'')
 .replace(/<span>Illustrative stock photography<\/span>/g,'')
 .replace(/Illustrative /g,'').replace(/illustrative imagery/g,'imagery')
 .replace(/not this contractor’s work/g,'').replace(/; not a customer project/g,'')
 .replace(/ Illustrative project concept, not completed work by this contractor\./g,'')
 .replace(/ project concept, not completed work by this contractor\./g,'')
 .replace(/ Illustrative project story; no specific project cost or customer outcome is claimed\./g,'')
 .replace(/ project story; no specific project cost or customer outcome is claimed\./g,'')
 .replace('Demo portfolio · illustrative examples, not jobs completed by this business. Explore sample pins in the configured service cities.','Explore sample pins in the configured service cities.')
 .replaceAll('scope in a configured service city. No completed project is claimed.','Sample scope in a configured service city.')
 .replace('Demo portfolio · these are illustrative examples, not completed jobs by this contractor.','Sample portfolio.')
 .replace(/\((\d{3})\) (\d{3})-(\d{4})/g,'$1$2$3');
}
const before=JSON.parse(fs.readFileSync(out+'/before-responses.json')),after=JSON.parse(fs.readFileSync(out+'/after-responses.json')),records=[],residual=[];
for(let i=0;i<before.length;i++){const b=before[i],a=after[i],old=fs.readFileSync(out+'/before/'+b.name,'utf8'),current=fs.readFileSync(out+'/after/'+a.name,'utf8');if(b.url!==a.url)throw Error('URL mismatch');const specific=b.kit==='roofing'&&/\/(faq|financing|promotions)(?:\?|$)/.test(b.url),x=normalizePart1HTML(old),y=normalizePart1HTML(current),same=old===current,allowed=x===y;records.push({url:b.url,kit:b.kit,before:b.sha256,after:a.sha256,identical:same,scope:specific?'Roofing items 2–5':same?'Untouched':'Global items 1, 6, 7',allowed:specific||allowed});if(!specific&&!allowed){let at=0;while(x[at]===y[at]&&at<x.length&&at<y.length)at++;residual.push({url:b.url,before:x.slice(Math.max(0,at-100),at+250),after:y.slice(Math.max(0,at-100),at+250)})}}
fs.writeFileSync(out+'/changed-pages.json',JSON.stringify(records,null,2));fs.writeFileSync(out+'/delta-residuals.json',JSON.stringify(residual,null,2));console.log(JSON.stringify({responses:records.length,identical:records.filter(x=>x.identical).length,allowed:records.filter(x=>x.allowed).length,residual:residual.length,examples:residual.slice(0,4)},null,2));
