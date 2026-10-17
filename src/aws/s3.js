import {createHash} from 'node:crypto';
import {mediaByPath,mediaByHash,hashedMediaPath,mediaOrigin} from '../template-media-delivery.js';
import {createReadStream} from 'node:fs';
import {Readable} from 'node:stream';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

async function toBuffer(value) {
  if (value == null) return Buffer.alloc(0);
  if (typeof value === 'string') return Buffer.from(value);
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value.arrayBuffer === 'function' && typeof value.getReader !== 'function') {
    return Buffer.from(await value.arrayBuffer());
  }
  return Buffer.from(await new Response(value).arrayBuffer());
}

function objectFrom(buffer, contentType) {
  const raw = new Uint8Array(buffer);
  return {
    body: raw,
    size: raw.byteLength,
    httpMetadata: { contentType: contentType || 'application/octet-stream' },
    async text() { return new TextDecoder().decode(raw); },
    async arrayBuffer() { return raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength); },
  };
}

export function createMemoryBucket() {
  const objects = new Map();
  return {
    driver: 'memory',
    async put(key, value, options) {
      objects.set(key, { body: await toBuffer(value), type: options?.httpMetadata?.contentType });
    },
    async get(key) {
      const hit = objects.get(key);
      return hit ? objectFrom(hit.body, hit.type) : null;
    },
    async head(key) {
      const hit = objects.get(key);
      return hit ? { size: hit.body.length } : null;
    },
    async delete(key) {
      objects.delete(key);
    },
  };
}

function missing(error) {
  const status = error?.$metadata?.httpStatusCode;
  return error?.name === 'NoSuchKey' || error?.name === 'NotFound' || status === 404;
}

export function createS3Bucket({ bucket, region, client }) {
  if (!bucket) throw new Error('S3_BUCKET is required');
  return {
    driver: 's3',
    bucket,
    region,
    async put(key, value, options) {
      const { PutObjectCommand } = await import('@aws-sdk/client-s3');
      const body = await toBuffer(value);
      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: options?.httpMetadata?.contentType,
        ContentLength: body.length,
      }));
    },
    async get(key) {
      const { GetObjectCommand } = await import('@aws-sdk/client-s3');
      try {
        const out = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        const bytes = await out.Body.transformToByteArray();
        return objectFrom(Buffer.from(bytes), out.ContentType);
      } catch (error) {
        if (missing(error)) return null;
        throw error;
      }
    },
    async head(key) {
      const { HeadObjectCommand } = await import('@aws-sdk/client-s3');
      try {
        const out = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
        return { size: Number(out.ContentLength || 0) };
      } catch (error) {
        if (missing(error)) return null;
        throw error;
      }
    },
    async delete(key) {
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },
  };
}

// Real AWS keeps the SDK defaults (region + instance-role credential chain).
// A custom endpoint is the local MinIO path: path-style URLs, static keys, and
// checksums only when the operation requires them. Recent @aws-sdk/client-s3
// releases add flexible checksum headers by default, which MinIO rejects.
export function s3ClientConfig(env) {
  const config = { region: env.AWS_REGION || 'us-west-1' };
  const endpoint = String(env.S3_ENDPOINT || '').trim();
  if (endpoint) {
    config.endpoint = endpoint;
    const pathStyle = String(env.S3_FORCE_PATH_STYLE || '1').trim().toLowerCase();
    config.forcePathStyle = pathStyle !== '0' && pathStyle !== 'false';
    config.requestChecksumCalculation = 'WHEN_REQUIRED';
    config.responseChecksumValidation = 'WHEN_REQUIRED';
  }
  const accessKeyId = String(env.S3_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = String(env.S3_SECRET_ACCESS_KEY || '').trim();
  if (accessKeyId || secretAccessKey) {
    if (!accessKeyId || !secretAccessKey) throw new Error('S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must both be set');
    config.credentials = { accessKeyId, secretAccessKey };
  }
  return config;
}

export async function createS3Client(env) {
  const { S3Client } = await import('@aws-sdk/client-s3');
  return new S3Client(s3ClientConfig(env));
}

export function createAssets(root,{templateMediaOrigin='',fallbackRoot=''}={}) {
  const cdn=mediaOrigin(templateMediaOrigin);
  const base = path.resolve(root);
  return {
    async fetch(request) {
      const url = new URL(request.url);
      let pathname = decodeURIComponent(url.pathname);
      const entry=mediaByPath.get(pathname)||mediaByHash.get(pathname),hashed=mediaByHash.has(pathname);
      if(entry&&cdn&&url.hostname==='review.local'){
        const result=await fetch(cdn+hashedMediaPath(entry),{method:request.method==='HEAD'?'HEAD':'GET',redirect:'error'});
        if(!result.ok)return new Response(null,{status:result.status});
        if(request.method==='HEAD')return new Response(null,{headers:result.headers});
        const bytes=Buffer.from(await result.arrayBuffer());if(createHash('sha256').update(bytes).digest('hex')!==entry.sha256)throw Error('Template media integrity failure.');
        return new Response(bytes,{headers:{'content-type':result.headers.get('content-type')||'application/octet-stream','cache-control':'private, no-store'}});
      }
      if(entry&&cdn){return new Response(null,{status:308,headers:{location:cdn+hashedMediaPath(entry),'cache-control':hashed?'public, max-age=31536000, immutable':'public, max-age=300','cross-origin-resource-policy':'cross-origin'}})}
      if(hashed)pathname=entry.path;
      if (pathname.endsWith('/')) pathname += 'index.html';
      let file = path.resolve(base, `.${pathname}`);
      if (file !== base && !file.startsWith(base + path.sep)) return new Response('Not found', { status: 404 });
      try {
        let info;try{info=await stat(file)}catch(error){if(!entry||!fallbackRoot)throw error;file=path.resolve(fallbackRoot,`.${entry.path}`);info=await stat(file)}
        if (!info.isFile()) return new Response('Not found', { status: 404 });
        const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
        const headers = {'content-type':type,'cache-control':hashed?'public, max-age=31536000, immutable':'public, max-age=300','x-content-type-options':'nosniff','accept-ranges':'bytes','content-length':String(info.size)};
        // Scroll-controlled MP4s need byte-range responses to seek reliably.
        if(request.method==='HEAD')return new Response(null,{headers});
        const range=request.headers.get('range');
        if(request.method==='GET'&&range&&/^bytes=/.test(range)&&!range.includes(',')){
          const match=range.match(/^bytes=(\d*)-(\d*)$/);
          let start=0,end=info.size-1;
          if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'content-range':'bytes */'+info.size}});
          if(!match[1])start=Math.max(0,info.size-Number(match[2]));
          else {start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}
          if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=info.size||end<start)return new Response(null,{status:416,headers:{'content-range':'bytes */'+info.size}});
          return new Response(Readable.toWeb(createReadStream(file,{start,end})),{status:206,headers:{...headers,'content-length':String(end-start+1),'content-range':`bytes ${start}-${end}/${info.size}`}});
        }
        return new Response(Readable.toWeb(createReadStream(file)),{headers});
      } catch {
        return new Response('Not found', { status: 404 });
      }
    },
  };
}
