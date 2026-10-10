// Build only runtime prerequisites into the ticket's private .data directory.
import {build} from 'esbuild';
import {buildClient} from '../scripts/build-client.mjs';
import {mkdir} from 'node:fs/promises';
await mkdir('.data/028G/dist',{recursive:true});
await build({entryPoints:['src/auth/index.ts'],outfile:'.data/028G/dist/auth/index.js',bundle:true,packages:'external',format:'esm',platform:'node',target:'node22'});
await build({entryPoints:['src/worker.js'],outfile:'.data/028G/dist/server/index.js',bundle:true,format:'esm',platform:'neutral',conditions:['workerd','worker'],mainFields:['module','main'],target:'es2022',loader:{'.html':'text','.pdf':'binary'},external:['cloudflare:workers','node:*']});
await buildClient();
console.log('PASS isolated runtime/client prerequisites built under .data/028G; protected dist untouched.');
