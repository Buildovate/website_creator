// Only the explicitly authorized #028E Part 1 markup delta is normalized.
// Raw and normalized hashes are both retained; no other HTML is ignored.
export function beforePart1(html){return html
 .replace('<link rel="stylesheet" href="/homeowner-polish.css"><script defer src="/homeowner-polish.js"></script>','')
 .replaceAll('<div class="film-theater" data-ambient-frame data-ambient-state="poster">','<div class="film-theater">')
 .replace(/<img class="commercial-poster" src="([^"]+)" alt="" width="1536" height="1024" loading="lazy"><video loop playsinline muted preload="none" data-src="([^"]+)" poster="\1" aria-label="([^"]+)" tabindex="-1"><\/video><button type="button" class="commercial-motion" data-ambient-toggle hidden aria-pressed="false">Pause ambient clip<\/button>/g,(_,poster,url,label)=>`<video controls autoplay loop playsinline muted preload="none" poster="${poster}" aria-label="${label}"><source src="${url}" type="video/mp4"><p>Your browser cannot play this film.</p></video>`)}
