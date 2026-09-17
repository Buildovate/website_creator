import {build} from 'esbuild';
import {mkdir,cp,rm,readFile,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/server',{recursive:true});await mkdir('dist/client',{recursive:true});
await cp('public','dist/client',{recursive:true});
const crmEnhancements=(await readFile('public/crm-enhancements.js','utf8'))+'\n'+(await readFile('public/control-ui.js','utf8'))+'\n'+(await readFile('public/engagement-ui.js','utf8'));
await writeFile('dist/client/app.js',(await readFile('public/app.js','utf8')).replace('/* CRM_ENHANCEMENTS */',()=>crmEnhancements));
await build({entryPoints:['src/excel-reader.js'],outfile:'dist/client/excel-reader.js',bundle:true,format:'iife',globalName:'ExcelReader',platform:'browser',target:'es2022'});
// HTML templates must be rendered by the Worker, never served ahead of it as assets.
await build({entryPoints:['src/worker.js'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',loader:{'.html':'text'},external:['cloudflare:workers']});
await mkdir('dist/.openai',{recursive:true});await cp('.openai/hosting.json','dist/.openai/hosting.json');await cp('drizzle','dist/.openai/drizzle',{recursive:true});
const manifest=JSON.parse(await readFile('dist/.openai/hosting.json','utf8'));if(manifest.static)throw Error('Worker cannot retain static mode');
