import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/028A';
const before=JSON.parse(fs.readFileSync(out+'/current-color-fixes/before.json'));
assert.equal(before.length,18,'Capture every spot at both widths before editing');
const expected={text:'rgb(110, 115, 95)',button:'rgb(187, 112, 76)',blog:'rgb(115, 124, 112)',policy:'rgb(100, 116, 139)'};
for(const row of before)for(const value of row.values){const type=row.key.startsWith('patios-')?'text':row.key.endsWith('hero-button')?'button':row.key==='roofing-blog-label'?'blog':'policy';assert.equal(type==='button'?value.backgroundColor:value.color,expected[type],row.key);}
const patches=[
 ['public/design-studio.css','\n/* #028A: Joe-approved minimal Current-only AA color corrections. */\nbody:not([data-site-style])[data-trade="Patios"] .kit-services :is(.service-index,p){color:#6d725e}\nbody:not([data-site-style]):is([data-trade="Windows/Doors"],[data-trade="Solar"],[data-trade="Concrete"],[data-trade="Pools"],[data-trade="Locksmith"]) .story-primary{background-color:#a65e3a}\nbody:not([data-site-style]):has(.trade-graphic-blog[data-trade-art="roofing"]) .blog-tools label{color:#626d60}\n'],
 ['public/flow.css','\n/* #028A: Current policy footer caption only; keep all layout rules in app.css. */\nbody:not([data-site-style]).welcome-page .welcome-card>small{color:#617187}\n']
];
for(const [file,css]of patches){const source=fs.readFileSync(root+'/'+file,'utf8');assert.ok(!source.includes(css),'Already applied '+file);fs.writeFileSync(root+'/'+file,source+css)}
const colors=[{spot:'Patios service text',old:'#6e735f',new:'#6d725e',property:'color',oldRatio:4.486,newRatio:4.552},{spot:'Windows/Doors, Solar, Concrete, Pools, Locksmith hero buttons',old:'#bb704c',new:'#a65e3a',property:'background-color',oldRatio:3.794,newRatio:4.902},{spot:'Roofing Blog label',old:'#737c70',new:'#626d60',property:'color',oldRatio:3.913,newRatio:4.892},{spot:'Policy footer caption',old:'#64748b',new:'#617187',property:'color',oldRatio:4.437,newRatio:4.640}];
fs.writeFileSync(out+'/current-color-fixes/approved-colors.json',JSON.stringify({approval:'Joe explicitly approved only these minimal color-only corrections; no layout, fonts, spacing or other Current colors changed in this approval pass.',colors,files:patches.map(x=>x[0])},null,2));
console.log(JSON.stringify({changed:patches.map(x=>x[0]),colorDeclarations:4}));
