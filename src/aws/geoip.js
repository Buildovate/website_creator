import {readFile} from 'node:fs/promises';
import {BlockList,isIP} from 'node:net';
import {Reader} from 'mmdb-lib';

function cleanIp(value){
 let ip=typeof value==='string'?value.trim():'';
 if(ip.startsWith('::ffff:')&&isIP(ip.slice(7))===4)ip=ip.slice(7);
 // ALB can append client ports. Never accept arbitrary hostnames or zone IDs.
 const v6=ip.match(/^\[([a-fA-F0-9:]+)\](?::\d{1,5})?$/),v4=ip.match(/^(\d+\.\d+\.\d+\.\d+):\d{1,5}$/);
 if(v6)ip=v6[1];else if(v4)ip=v4[1];
 return !ip.includes('%')&&isIP(ip)?ip:null;
}
export function trustedProxyList(config=''){
 const list=new BlockList();
 for(const raw of String(config).split(',').map(x=>x.trim()).filter(Boolean)){
  const [ip,prefix,...rest]=raw.split('/'),version=isIP(ip),bits=version===4?32:128;
  if(!version||rest.length||prefix!==undefined&&(!/^\d+$/.test(prefix)||Number(prefix)<1||Number(prefix)>bits))throw Error('GEOIP_TRUSTED_PROXIES must contain explicit IP addresses or non-zero CIDR prefixes.');
  list.addSubnet(ip,prefix===undefined?bits:Number(prefix),version===4?'ipv4':'ipv6');
 }
 return list;
}
export function visitorAddress(req,trusted=trustedProxyList()){
 let address=cleanIp(req.socket?.remoteAddress);
 const value=req.headers?.['x-forwarded-for'];
 // Walk only explicitly trusted proxies from the socket toward the visitor.
 // Untrusted peers cannot influence the result with forwarding headers.
 if(!address||typeof value!=='string'||value.length>2048)return address;
 for(const part of value.split(',').reverse()){
  if(!trusted.check(address,isIP(address)===4?'ipv4':'ipv6'))break;
  address=cleanIp(part);if(!address)return null;
 }
 return address;
}
const privateNetworks=new BlockList();
for(const [ip,prefix] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.168.0.0',16],['192.0.0.0',24],['192.0.2.0',24],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]])privateNetworks.addSubnet(ip,prefix,'ipv4');
for(const [ip,prefix] of [['::',128],['::1',128],['fc00::',7],['fe80::',10],['ff00::',8],['2001:db8::',32]])privateNetworks.addSubnet(ip,prefix,'ipv6');
export function cityLookup(reader,address){
 if(!address||!isIP(address)||privateNetworks.check(address,isIP(address)===4?'ipv4':'ipv6'))return null;
 try{const data=reader.get(address),city=data?.city?.names?.en,region=data?.subdivisions?.[0]?.names?.en,country=data?.country?.iso_code;
  if(typeof city!=='string'||city.length>100||/[<>\u0000-\u001f]/.test(city)||!city.trim())return null;
  return {city:city.trim(),region:typeof region==='string'?region.slice(0,100):'',country:typeof country==='string'?country.slice(0,2):'',source:'dbip'};
 }catch{return null;}
}
export async function createGeoLookup(env){
 const trusted=trustedProxyList(env.GEOIP_TRUSTED_PROXIES);
 try{
  const reader=new Reader(await readFile(env.GEOIP_DB_PATH||'aws/geoip/dbip-city-lite.mmdb'));
  // No visitor IP is logged, persisted, sent to another service, or returned.
  return req=>cityLookup(reader,visitorAddress(req,trusted));
 }catch(error){if(error.code!=='ENOENT')console.warn('Local city database unavailable; using city picker.');return ()=>null;}
}
