import http from 'node:http';
import https from 'node:https';
import {syncBuiltinESMExports} from 'node:module';
for(const key of Object.keys(process.env))if(/API_KEY|TOKEN|SECRET|DATABASE_URL|S3_|AWS_|ZOOM_|TWILIO_|RESEND_|CUSTOM_DOMAINS_LIVE|DOMAIN_CHECKS_ENABLED/.test(key))delete process.env[key];
process.env.APP_ENV='local';process.env.CUSTOM_DOMAINS_LIVE='0';
const local=host=>['127.0.0.1','localhost','[::1]','::1'].includes(host);
const originalFetch=globalThis.fetch;globalThis.fetch=(input,...args)=>{const u=new URL(typeof input==='string'||input instanceof URL?input:input.url);if(!local(u.hostname))throw Error('Offline release gate forbids external fetch: '+u.hostname);return originalFetch(input,...args);};
for(const client of [http,https])for(const name of ['request','get']){const original=client[name];client[name]=function(input,...args){const host=typeof input==='string'||input instanceof URL?new URL(input).hostname:String(input.hostname||input.host||'localhost').replace(/:\d+$/,'');if(!local(host))throw Error('Offline release gate forbids external HTTP: '+host);return original.call(this,input,...args);};}syncBuiltinESMExports();
