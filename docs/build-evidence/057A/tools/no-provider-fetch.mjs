// Evidence-only preload: keep the existing AWS adapter assertions; mock its final egress probe.
import fs from 'node:fs';
const originalFetch=globalThis.fetch;
let probes=0;
globalThis.fetch=async(input,init)=>{
 const url=new URL(typeof input==='string'?input:input.url);
 if(url.href==='https://api.openai.com/v1/models'){probes++;fs.writeFileSync('C:/Users/joe/website_creator/docs/build-evidence/057A/aws-egress-mock.json',JSON.stringify({mockedProbes:probes,providerCalls:0,status:401},null,2));return new Response(JSON.stringify({error:{message:'Local test: invalid credential',type:'invalid_request_error'}}),{status:401,headers:{'content-type':'application/json'}});}
 if(url.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(url.hostname))return originalFetch(input,init);
 throw Error('External network forbidden in #057A test run: '+url.origin);
};
