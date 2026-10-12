import catalog from '../public/trade-media-library.json' with {type:'json'};
import {libraryDescription} from '../src/media-description.js';
const escapeAlt=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\"','&quot;').replaceAll("'",'&#39;');
function beforeAlt(html){for(const a of Object.values(catalog.assets)){const image=a.kind==='clip'?catalog.assets[a.posterId]:a;if(!image)continue;const prefix='<img class="ml-poster" src="'+image.url+'" alt="',suffix='" width="1280" height="800"';html=html.replaceAll(prefix+escapeAlt(libraryDescription(a,catalog))+suffix,prefix+suffix).replaceAll(prefix+'" data-media-decorative="true" role="presentation" width="1280" height="800"',prefix+suffix);}return html;}

function beforePrimary(html){
 if(!/class="blog-intro"|data-core-page="legal"|<h1>(?:Privacy policy|Website terms)<\/h1>/.test(html))return html;
 const home=html.match(/<a href="([^"]+)" class="kit-brand">/)?.[1]||html.match(/<main class="welcome-card"><a href="([^"]+)">/)?.[1];if(!home)return html;
 const [path,query]=home.split('?'),href=path.startsWith('/s/')?path+'/contact'+(query?'?'+query:''):home+'#contact';
 return html.replace('<p class="qa-page-action"><a class="qa-primary" data-primary href="'+href+'">Get my price</a></p>','');
}
// Only the explicitly authorized #028E and #028F Part 1 markup deltas are normalized.
// Raw and normalized hashes are both retained; no other HTML is ignored.
function beforeMaterials(html){
 const materials=[['shingle','shingles','01','Shingle installation'],['replacement','finished-roof','02','Roof replacement'],['barrier','underlayment','03','Weather barrier'],['flashing','flashing','04','Flashing details'],['metal','metal','05','Metal roofing']];
 for(const [id,file,n,label] of materials)for(const pressed of ['true','false']){
 const before='<button type="button" data-comparison="'+id+'" aria-pressed="'+pressed+'" aria-controls="roof-comparison"><img src="/assets/'+file+'.jpg" alt="" loading="lazy"><span><small>'+n+'</small>'+label+'</span></button>';
 html=html.replace(before.replace('alt="" loading','alt="" data-media-decorative="true" role="presentation" loading'),before);
 }return html;
}
export function beforePart1(html){return beforeMaterials(beforeAlt(beforePrimary(html)))

 .replace('<link rel="stylesheet" href="/review-qa-polish.css">','')
 .replace('<link rel="stylesheet" href="/homeowner-polish.css"><script defer src="/homeowner-polish.js"></script>','')
 .replaceAll('<div class="film-theater" data-ambient-frame data-ambient-state="poster">','<div class="film-theater">')
 .replace(/<img class="commercial-poster" src="([^"]+)" alt="" width="1536" height="1024" loading="lazy"><video loop playsinline muted preload="none" data-src="([^"]+)" poster="\1" aria-label="([^"]+)" tabindex="-1"><\/video><button type="button" class="commercial-motion" data-ambient-toggle hidden aria-pressed="false">Pause ambient clip<\/button>/g,(_,poster,url,label)=>`<video controls autoplay loop playsinline muted preload="none" poster="${poster}" aria-label="${label}"><source src="${url}" type="video/mp4"><p>Your browser cannot play this film.</p></video>`)}
