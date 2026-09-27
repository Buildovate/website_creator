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
