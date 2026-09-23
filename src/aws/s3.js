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

export function createAssets(root) {
  const base = path.resolve(root);
  return {
    async fetch(request) {
      const url = new URL(request.url);
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = path.resolve(base, `.${pathname}`);
      if (file !== base && !file.startsWith(base + path.sep)) return new Response('Not found', { status: 404 });
      try {
        const info = await stat(file);
        if (!info.isFile()) return new Response('Not found', { status: 404 });
        const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
        const data = await readFile(file);
        return new Response(data, {
          headers: {
            'content-type': type,
            'cache-control': 'public, max-age=300',
            'x-content-type-options': 'nosniff',
          },
        });
      } catch {
        return new Response('Not found', { status: 404 });
      }
    },
  };
}
