// Server-only, one-request smoke test. Run with: npm run hf:example
import { mkdir, open, writeFile } from 'node:fs/promises';
import { loadEnvFile } from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { createHiggsfieldClient } from '@higgsfield/client/v2';

type Result = {
  status?: string;
  request_id?: string;
  video?: { url?: string };
  reason?: unknown;
  message?: unknown;
  detail?: unknown;
  error?: unknown;
  cost?: unknown;
  cost_usd?: unknown;
  credits_used?: unknown;
  currency?: unknown;
};

const root = new URL('../', import.meta.url);
const evidence = new URL('docs/hf-test/', root);
const receipt = new URL('request.json', evidence);
const model = 'bytedance/seedance-2.5/text-to-video';
const input = {
  prompt: 'A cinematic scene at sunset',
  duration: 5,
  resolution: '720p',
  aspect_ratio: '16:9',
};
let credentials = '';
let requestId: string | undefined;
let lastStatus = 'not_submitted';
let receiptCreated = false;
const billing: Record<string, number | string> = {};

function safeReason(value: unknown, fallback: string): string {
  let text = typeof value === 'string' && value.trim() ? value : fallback;
  for (const part of [credentials, ...credentials.split(':')]) {
    if (part) text = text.replaceAll(part, '[redacted]').replaceAll(encodeURIComponent(part), '[redacted]');
  }
  return text.replace(/[\r\n\x00-\x1f]/g, ' ').slice(0, 800);
}

function responseReason(result: Result): string {
  const error = result.error;
  const detail = error && typeof error === 'object'
    ? (error as { reason?: unknown; message?: unknown }).reason
      ?? (error as { message?: unknown }).message
    : error;
  return safeReason(result.reason ?? detail ?? result.message ?? result.detail,
    result.status === 'nsfw' || result.status === 'moderated'
      ? 'Rejected by provider moderation.'
      : 'Provider returned no reason.');
}

async function save(result: Result, reason?: string): Promise<void> {
  for (const key of ['cost', 'cost_usd', 'credits_used'] as const) {
    if (typeof result[key] === 'number') billing[key] = result[key];
  }
  if (typeof result.currency === 'string' && /^[A-Za-z]{3}$/.test(result.currency)) {
    billing.currency = result.currency;
  }
  await writeFile(receipt, JSON.stringify({
    model, input, request_id: requestId, status: result.status,
    video_url: result.video?.url, reason,
    reported_billing: Object.keys(billing).length ? billing : null,
  }, null, 2) + '\n');
}

async function main(): Promise<void> {
  // Load only the ignored file, rather than falling back to inherited credentials.
  delete process.env.HF_CREDENTIALS;
  try {
    loadEnvFile(fileURLToPath(new URL('.env.local', root)));
  } catch {
    throw new Error('Add HF_CREDENTIALS to the gitignored .env.local file.');
  }
  const loadedCredential: unknown = Reflect.get(process.env, 'HF_CREDENTIALS');
  credentials = typeof loadedCredential === 'string' ? loadedCredential.trim() : '';
  if (!credentials) throw new Error('Add HF_CREDENTIALS to the gitignored .env.local file.');
  if (!/^[^:\s]+:[^:\s]+$/.test(credentials)) {
    throw new Error('HF_CREDENTIALS must use key-id:key-secret format.');
  }

  await mkdir(evidence, { recursive: true });
  // A second invocation cannot accidentally purchase a second test.
  const guard = await open(receipt, 'wx').catch(() => {
    throw new Error('An HF test record already exists in docs/hf-test/request.json. No request submitted; review that record before authorizing another test.');
  });
  receiptCreated = true;
  await guard.close();
  await save({ status: 'submitting' });

  const client = createHiggsfieldClient({ credentials, maxRetries: 0, timeout: 120_000 });
  lastStatus = 'submission_unknown';
  // SDK 0.2.6 automatic polling omits canceled/moderated terminal states.
  // Submit once with the SDK; polling below is GET-only and never resubmits.
  let result: Result = await client.subscribe(model, { input, withPolling: false });
  requestId = result.request_id;
  if (!requestId || !/^[A-Za-z0-9_-]+$/.test(requestId)) {
    throw new Error('Provider did not return a usable request id. Do not resubmit automatically.');
  }
  const deadline = Date.now() + 15 * 60_000;
  while (true) {
    lastStatus = result.status ?? 'unknown';
    await save(result);
    if (lastStatus === 'completed') break;
    if (['failed', 'canceled', 'cancelled', 'moderated', 'nsfw'].includes(lastStatus)) {
      const reason = responseReason(result);
      await save(result, reason);
      process.stderr.write(JSON.stringify({ status: lastStatus, reason }) + '\n');
      process.exitCode = 1;
      return;
    }
    if (!['queued', 'in_progress'].includes(lastStatus)) {
      throw new Error('Provider returned an unexpected status: ' + safeReason(lastStatus, 'unknown'));
    }
    if (Date.now() >= deadline) {
      throw new Error('Polling timed out. The accepted request may still finish; do not resubmit.');
    }
    await delay(5_000);
    const response = await fetch('https://api.higgsfield.ai/requests/' + encodeURIComponent(requestId) + '/status', {
      headers: { Authorization: 'Key ' + credentials },
      redirect: 'error',
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      throw new Error('Status check returned HTTP ' + response.status + '. Do not resubmit the accepted request.');
    }
    result = await response.json() as Result;
  }

  let video: URL;
  try { video = new URL(result.video?.url ?? ''); }
  catch { throw new Error('Completed response has no usable video URL.'); }
  if (video.protocol !== 'https:' || video.username || video.password) {
    throw new Error('Completed response has no usable HTTPS video URL.');
  }
  // Success output is deliberately restricted to these two fields.
  process.stdout.write(JSON.stringify({ video_url: video.href, request_id: requestId }) + '\n');
}

main().catch(async (error: unknown) => {
  const reason = safeReason(error instanceof Error ? error.message : undefined, 'Unexpected request failure.');
  const status = lastStatus === 'completed' ? 'failed' : lastStatus;
  if (receiptCreated) await save({ status }, reason).catch(() => {});
  process.stderr.write(JSON.stringify({ status, reason }) + '\n');
  process.exitCode = 1;
});
