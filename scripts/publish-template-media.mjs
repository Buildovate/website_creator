import fs from 'node:fs';
import path from 'node:path';
import {S3Client,PutObjectCommand,HeadObjectCommand} from '@aws-sdk/client-s3';
import {STSClient,GetCallerIdentityCommand} from '@aws-sdk/client-sts';
import {pool,hashFile} from './media-tools.mjs';
const manifest=JSON.parse(fs.readFileSync('public/media-quality.json')),bucket='buildovate-website-creator-preview',region='us-west-1';
if(!process.argv.includes('--preview')){console.log('Plan only: '+manifest.assets.length+' immutable objects to the documented preview bucket assets/template-media/ prefix. Use --preview with an authorized AWS role.');process.exit(0)}
const who=await new STSClient({region}).send(new GetCallerIdentityCommand({}));if(who.Account!=='846588355042')throw Error('Refusing a different AWS account.');
const s3=new S3Client({region});let uploaded=0;
const unique=[...new Map(manifest.assets.map(a=>[a.sha256+path.extname(a.path),a])).values()];
await pool(unique,3,async a=>{const file='public'+a.path;if(hashFile(file)!==a.sha256)throw Error('Local media differs from quality attestation: '+a.path);const key='assets/template-media/'+a.sha256+path.extname(a.path);try{const h=await s3.send(new HeadObjectCommand({Bucket:bucket,Key:key}));if(h.Metadata?.sha256===a.sha256&&h.ContentLength===a.bytes)return;throw Error('Existing immutable object differs: '+key)}catch(error){if(!['NotFound','NoSuchKey'].includes(error.name)&&![403,404].includes(error.$metadata?.httpStatusCode))throw error;}
 const type=a.kind==='video'?(a.path.endsWith('.webm')?'video/webm':'video/mp4'):'image/webp';try{await s3.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:fs.readFileSync(file),ContentLength:a.bytes,ContentType:type,CacheControl:'public, max-age=31536000, immutable',ServerSideEncryption:'AES256',Metadata:{sha256:a.sha256,quality:String(a.quality||a.crf)},IfNoneMatch:'*'}));uploaded++;}catch(error){if(error.$metadata?.httpStatusCode!==412)throw error;const existing=await s3.send(new HeadObjectCommand({Bucket:bucket,Key:key}));if(existing.Metadata?.sha256!==a.sha256||existing.ContentLength!==a.bytes)throw Error('Immutable object integrity mismatch: '+key)}
});console.log('Uploaded '+uploaded+' verified preview media objects. No application deployment.');
