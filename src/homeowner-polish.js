export function homeownerPolish(html){
 if(html.includes('bv-platform')||!html.includes('<body')||!/(?:cinematic-commercial|visitor-chat|kit-mobile-dock|sd-phone-bar|shared-site-header|story-nav|mobile-dock|mobile-call|cx-header)/.test(html))return html;
 // These comparison thumbnails repeat the immediately adjacent material label.
 html=html.replace(/(<button type="button" data-comparison="(?:shingle|replacement|barrier|flashing|metal)" aria-pressed="(?:true|false)" aria-controls="roof-comparison"><img src="\/assets\/(?:shingles|finished-roof|underlayment|flashing|metal)\.jpg" alt="") loading="lazy">(?=<span><small>0[1-5]<\/small>)/g,'$1 data-media-decorative="true" role="presentation" loading="lazy">');
 return html.replace('</head>' ,'<link rel="stylesheet" href="/review-qa-polish.css"><link rel="stylesheet" href="/homeowner-polish.css"><script defer src="/homeowner-polish.js"></script></head>');
}
