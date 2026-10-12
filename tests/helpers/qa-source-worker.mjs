import {releaseRepoRoot} from "../../scripts/runtime-paths.mjs";
// Same source-bundle approach as the existing media browser matrix. It avoids
// deleting shared dist assets while independent browser suites are running.
import {build} from 'esbuild';
const bundle=await build({entryPoints:[releaseRepoRoot+"/src/worker.js"],bundle:true,format:'esm',platform:'neutral',conditions:['workerd','worker'],mainFields:['module','main'],target:'es2022',write:false,loader:{'.html':'text','.pdf':'binary'},external:['cloudflare:workers','node:*']});
export default (await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'))).default;
