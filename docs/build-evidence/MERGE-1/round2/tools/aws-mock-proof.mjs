import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const root='C:/Users/joe/website_creator',out=root+'/docs/build-evidence/MERGE-1/round2';
const mock=root+'/docs/build-evidence/057A/tools/no-provider-fetch.mjs',record=root+'/docs/build-evidence/057A/aws-egress-mock.json';
const before=fs.readFileSync(record),sha=b=>createHash('sha256').update(b).digest('hex');
await import(pathToFileURL(mock).href);
const mockedFetch=globalThis.fetch,interceptions=[];
globalThis.fetch=async(input,init)=>{const url=typeof input==='string'?input:input.url;const response=await mockedFetch(input,init);if(url==='https://api.openai.com/v1/models'){interceptions.push({url,status:response.status,body:await response.clone().text(),local:true});console.log('LOCAL EGRESS MOCK: OpenAI /v1/models intercepted; status '+response.status+'; no network request');}return response;};
let failure=null;
try{await import(pathToFileURL(root+'/tests/aws-adapter.mjs').href);}catch(error){failure={message:error.message,stack:error.stack};throw error;}finally{const after=fs.readFileSync(record);if(!after.equals(before))fs.writeFileSync(record,before);fs.writeFileSync(out+'/mock-proof.json',JSON.stringify({mockPath:mock,mockSha256:sha(fs.readFileSync(mock)),interceptions,providerCalls:0,recordBeforeSha256:sha(before),recordAfterSha256:sha(fs.readFileSync(record)),failure},null,2));}
if(interceptions.length!==1||interceptions[0].status!==401)throw Error('Mock interception not proven');
