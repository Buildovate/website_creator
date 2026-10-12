import {request} from 'node:https';
import {publicAddress} from '../domain/checks.js';
import {cleanDomain} from '../domain/guide.js';

// Pin the DNS result used by the check; never resolve again while making the request.
// HTTPS verifies the domain certificate/SNI, and redirects are returned without following them.
export function requestPublicHttps(value,{addresses,requester=request}={}) {
  const url=new URL(value);
  cleanDomain(url.hostname);
  if(url.protocol!=='https:'||url.port||url.username||url.password||!addresses?.length||!addresses.every(publicAddress))throw Error('Unsafe domain probe.');
  return new Promise((resolve,reject)=>{
    const lookup=(_hostname,options,callback)=>options?.all?callback(null,addresses.map(address=>({address,family:4}))):callback(null,addresses[0],4);
    const req=requester(url,{method:'GET',servername:url.hostname,rejectUnauthorized:true,lookup,agent:false,timeout:7000,headers:{accept:'text/html','user-agent':'Buildovate-Domain-Check'}},res=>{
      const headers=new Headers();for(const [key,value] of Object.entries(res.headers)){if(Array.isArray(value))value.forEach(item=>headers.append(key,item));else if(value!==undefined)headers.set(key,String(value));}
      let bytes=0;res.on('data',chunk=>{bytes+=chunk.length;if(bytes>65536)res.destroy();});res.on('error',()=>{});res.resume();
      resolve(new Response(null,{status:res.statusCode,headers}));
    });
    req.on('timeout',()=>req.destroy(Error('HTTPS check timed out.')));req.on('error',reject);req.end();
  });
}
