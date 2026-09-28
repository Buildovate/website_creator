import {stylesFor,selectedSiteStyle,STYLE_IDS} from './design-styles.js';
// Current is a literal identity operation, including whitespace and asset links.
export function applySiteStyle(markup,settings,{previewStyle='',base=''}={}){
 const id=STYLE_IDS.includes(previewStyle)?previewStyle:selectedSiteStyle(settings),style=stylesFor(settings).find(s=>s.id===id);
 let html=markup;
 if(!style.inherit){const p=style.palette,vars={'heading':style.headingFont,'body':style.bodyFont,'background':p.background,'surface':p.surface,'text':p.text,'muted':p.muted,'accent':p.accent,'cta':p.cta,'cta-text':p.ctaText,'deep':p.deep,'deep-text':p.deepText,'line':p.line,'radius':style.radius,'section':style.spacing.section,'gap':style.spacing.gap};
 html=html.replace('<head>','<head><link rel="preload" href="/assets/dm-sans.ttf" as="font" type="font/ttf" crossorigin>'+ (id==='bold'?'<link rel="preload" href="/assets/barlow-bold.ttf" as="font" type="font/ttf" crossorigin>':''));
 html=html.replace('<body','<body data-site-style="'+id+'"').replace('</head>','<link rel="stylesheet" href="/site-styles.css"><style>body[data-site-style]{'+Object.entries(vars).map(([key,value])=>'--look-'+key+':'+value+';').join('')+'}</style></head>');}
 // Keep an unsaved full-site preview private as the contractor follows page links.
 if(STYLE_IDS.includes(previewStyle)&&base){html=html.replace(/href="([^"<>]+)"/g,(match,href)=>{if(!href.startsWith(base)||!['','/','?','#'].includes(href.slice(base.length,base.length+1)))return match;const u=new URL(href.replaceAll('&amp;','&'),'https://preview.local');u.searchParams.set('preview','1');u.searchParams.set('siteStyle',previewStyle);return 'href="'+(u.pathname+u.search+u.hash).replaceAll('&','&amp;')+'"'})}
 return html;
}
