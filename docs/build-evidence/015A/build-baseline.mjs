// Build the genuine pre-ticket client without replacing working files or interrupting phone QA.
import {build} from 'esbuild';
import {readFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const root='C:/Users/joe/website_creator',baseline='a86a0aea8c4569ffb2451b9f4c08226b6c61b8c8',out=root+'/docs/build-evidence/015A/.baseline-client';
await mkdir(out,{recursive:true});
const replacements=new Set(['src/client/workspace/index.ts','src/client/workspace/legacy-workspace.js','src/client/editor/visual-editor.js','src/client/styles/app.css']);
const enhancements=(await Promise.all(['crm-enhancements','control-ui','engagement-ui'].map(n=>readFile(root+'/public/'+n+'.js','utf8')))).join('\n');
const plugin={name:'pre-ticket-client',setup(b){b.onLoad({filter:/\.(js|ts|css)$/},async a=>{const rel=path.relative(root,a.path).replaceAll('\\','/');if(!replacements.has(rel))return;let contents=execFileSync('git',['-C',root,'-c','safe.directory='+root,'show',baseline+':'+rel],{encoding:'utf8'});if(rel.endsWith('legacy-workspace.js'))contents=contents.replace('/* CRM_ENHANCEMENTS */',()=>enhancements);return {contents,loader:rel.endsWith('.ts')?'ts':rel.endsWith('.css')?'css':'js',resolveDir:path.dirname(a.path)};});}};
await build({entryPoints:[root+'/src/client/workspace/index.ts'],outfile:out+'/app.js',bundle:true,format:'iife',platform:'browser',target:'es2022',plugins:[plugin]});
await build({entryPoints:[root+'/src/client/styles/app.css'],outfile:out+'/app.css',bundle:true,external:['/assets/*'],target:'es2022',plugins:[plugin]});
console.log('Built pre-ticket client '+baseline+' without altering the working tree.');
