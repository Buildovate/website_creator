export function homeownerPolish(html){
 if(html.includes('bv-platform')||!html.includes('<body')||!/(?:cinematic-commercial|visitor-chat|kit-mobile-dock)/.test(html))return html;
 return html.replace('</head>','<link rel="stylesheet" href="/homeowner-polish.css"><script defer src="/homeowner-polish.js"></script></head>');
}
