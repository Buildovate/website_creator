import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';
import {clientEntries} from '../scripts/build-client.mjs';

const enhancements=(await Promise.all(['crm-enhancements','control-ui','engagement-ui'].map(name=>readFile(`public/${name}.js`,'utf8')))).join('\n');
const client=await build({entryPoints:clientEntries,outdir:'pay4a-isolated/client',bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',plugins:[{name:'legacy-workspace-features',setup(builder){builder.onLoad({filter:/legacy-workspace\.js$/},async args=>{const source=await readFile(args.path,'utf8');if(source.split('/* CRM_ENHANCEMENTS */').length!==2)throw Error('Expected exactly one legacy feature boundary');return {contents:source.replace('/* CRM_ENHANCEMENTS */',()=>enhancements),loader:'js'};});}}]});
const styles=await build({entryPoints:['src/client/styles/roofing-motion-home.css','src/client/styles/platform/index.css','src/client/styles/app.css'],outdir:'pay4a-isolated/client',bundle:true,write:false,external:['/assets/*'],target:'es2022'});
if(!client.outputFiles.length||styles.outputFiles.length!==3)throw Error('Isolated client build produced incomplete output');
console.log(`PASS isolated client build: ${client.outputFiles.length} client and ${styles.outputFiles.length} style outputs; wrote no files`);
