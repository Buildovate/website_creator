export class AuthError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function safeReturnPath(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020]/.test(value)) return '/';
  try {
    const u = new URL(value, 'http://return.local');
    if (u.origin !== 'http://return.local' || u.pathname === '/login' || u.pathname.startsWith('/auth/') || u.pathname.startsWith('/signin-') || u.pathname.startsWith('/signout-')) return '/';
    return u.pathname + u.search + u.hash;
  } catch { return '/'; }
}
export function publicApi(path: string, method: string): boolean {
  // Ebook requests retain their own origin, consent, cookie and preview-access checks.
  if(method==='POST' && /^\/api\/public\/[^/]+\/ebook$/.test(path)) return true;
  return (path === '/api/session' && method === 'GET') ||
    /^\/api\/public\/[^/]+\/(inquiries|reviews|pricing-inquiry|promotion-unlock|location|chat(?:\/(start|message|handoff))?)$/.test(path) ||
    (path === '/api/chat/sms' && method === 'POST');
}
export function privateHtml(url: URL) {
  return ['/', '/join', '/team-join', '/admin/expenses'].includes(url.pathname) ||
    url.pathname.startsWith('/admin/review-packets/') || url.pathname.startsWith('/preview/') || url.pathname.startsWith('/design-preview/') ||
    url.searchParams.get('preview') === '1';
}
export function requireOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin ||
      request.headers.get('sec-fetch-site') === 'cross-site') {
    throw new AuthError('Request must originate from this website.', 403);
  }
}
export function loopback(url: URL) {
  return ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
}
