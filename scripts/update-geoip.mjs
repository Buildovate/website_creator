import {mkdir,readFile,writeFile,rename,rm} from 'node:fs/promises';
import {createWriteStream} from 'node:fs';
import {Readable,Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {createGunzip} from 'node:zlib';
import {createHash} from 'node:crypto';
import {Reader} from 'mmdb-lib';
const month=process.argv[2]||new Date().toISOString().slice(0,7);
if(!/^20\d{2}-(0[1-9]|1[0-2])$/.test(month))throw Error('Use YYYY-MM.');
const url=`https://download.db-ip.com/free/dbip-city-lite-${month}.mmdb.gz`,dir='aws/geoip',tmp=dir+'/download.mmdb.tmp',target=dir+'/dbip-city-lite.mmdb';
await mkdir(dir,{recursive:true});
try{
 const response=await fetch(url,{signal:AbortSignal.timeout(180000)});if(!response.ok)throw Error('DB-IP download failed: HTTP '+response.status);
 let size=0;const limit=new Transform({transform(chunk,encoding,done){size+=chunk.length;done(size>300*1024*1024?Error('Database exceeds size limit'):null,chunk);}});
 await pipeline(Readable.fromWeb(response.body),createGunzip(),limit,createWriteStream(tmp));
 const data=await readFile(tmp),reader=new Reader(data);if(!reader.metadata.databaseType.toLowerCase().includes('city'))throw Error('Expected a city database.');
 const sha256=createHash('sha256').update(data).digest('hex');await rename(tmp,target);
 await writeFile(dir+'/manifest.json',JSON.stringify({provider:'DB-IP',edition:'City Lite',month,source:url,license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',attribution:'https://db-ip.com',sha256,bytes:size},null,2)+'\n');
 console.log(`Installed DB-IP City Lite ${month}; ${size} bytes; local lookups ready.`);
}finally{await rm(tmp,{force:true});}
