import {build} from 'esbuild';
for(const platform of ['neutral','node'])await build({entryPoints:['src/worker.js'],outfile:'.data/release-worker-'+platform+'.js',bundle:true,format:'esm',platform,conditions:['workerd','worker'],mainFields:['module','main'],target:'es2022',loader:{'.html':'text','.pdf':'binary'},external:['cloudflare:workers','node:*']});
console.log('PASS both Worker targets: neutral and Node');
