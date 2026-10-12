import { SessionStore, cookieToken, csrfMatches, sessionCookie, type Database, type Session, type User } from './session-store.js';
import { AuthError, requireOrigin, loopback, privateHtml, publicApi, safeReturnPath } from './request-policy.js';
import { loginPage } from './views.js';

export interface AuthConfig {
  mode: string; appEnv?: string; nodeEnv?: string; allowDevHeaders?: boolean;
  sessionTtl?: number; logoutUrl?: string; albCookieName?: string;
}
export interface Context { user: User | null; session: Session | null; cookie?: string }
type Resolve = (headers: Headers, config: AuthConfig) => Promise<User | null>;
const json = (data: unknown, status = 200, headers: Record<string,string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type':'application/json', 'cache-control':'no-store', ...headers } });
const html = (data: string) => new Response(data, { headers: { 'content-type':'text/html; charset=utf-8', 'cache-control':'no-store', 'x-robots-tag':'noindex, nofollow' } });
export function createAuthHttp(db: Database, config: AuthConfig, resolve: Resolve) {
  const ttl = config.sessionTtl || 3600;
  const store = new SessionStore(db, ttl);
  const attempts = new Map<string, { until: number; count: number }>();
  const local = config.mode === 'dev-header' && config.appEnv === 'local' &&
    (config.nodeEnv !== 'production' || config.allowDevHeaders === true);
  async function context(request: Request): Promise<Context> {
    const token = cookieToken(request.headers);
    if (local) {
      const session = await store.get(token, config.mode);
      return { session, user: session ? {id:session.user_id,email:session.email} : null };
    }
    if (!['alb-oidc','cognito'].includes(config.mode)) return { user:null, session:null };
    // Shared sessions never substitute for fresh verified provider identity.
    const user = await resolve(request.headers, config);
    const session = user ? await store.get(token, config.mode) : null;
    return { user, session: session && session.user_id === user?.id && session.email === user?.email ? session : null };
  }
  async function route(request: Request, ctx: Context, remoteAddress: string): Promise<Response | null> {
    const url = new URL(request.url), path = url.pathname, method = request.method;
    const returnTo = safeReturnPath(url.searchParams.get('returnTo'));
    const redirect = (location: string) => new Response(null,{status:303,headers:{location,'cache-control':'no-store'}});
    if (path === '/signin-with-chatgpt' && method === 'GET') {
      return redirect('/login?returnTo='+encodeURIComponent(safeReturnPath(url.searchParams.get('return_to'))));
    }
    if (path === '/auth/start' && method === 'GET') {
      // The ALB must require authentication on this exact path. Never trust a query identity.
      if (config.mode !== 'alb-oidc') return redirect('/login?returnTo='+encodeURIComponent(returnTo));
      if (!ctx.user) throw new AuthError('Sign-in is temporarily unavailable. Please try again later.',503);
      return redirect(returnTo);
    }
    if (path === '/login' && method === 'GET') {
      if (ctx.user && !url.searchParams.has('signedOut')) return redirect(returnTo);
      return html(loginPage(local && loopback(url), returnTo, url.searchParams.has('signedOut'), config.mode === 'alb-oidc'));
    }
    if (path === '/auth/local-session') {
      if (!local || !loopback(url)) return json({error:'Local sign-in is unavailable.'},404);
      if (method !== 'POST') return json({error:'Method not supported.'},405, {allow:'POST'});
      requireOrigin(request);
      if (!request.headers.get('content-type')?.startsWith('application/json')) throw new AuthError('Use a JSON sign-in request.',415);
      const time = Date.now();
      for (const [key, value] of attempts) if (value.until <= time) attempts.delete(key);
      const entry = attempts.get(remoteAddress) || {until:time+60_000,count:0};
      if (++entry.count > 20 || (attempts.size >= 1000 && !attempts.has(remoteAddress))) throw new AuthError('Too many sign-in attempts. Please wait a minute.',429);
      attempts.set(remoteAddress,entry);
      const reader = request.body?.getReader(); let size=0; const chunks:Uint8Array[]=[];
      if (!reader) throw new AuthError('Enter your email and user ID.');
      while (true) { const next=await reader.read(); if(next.done) break; size+=next.value.length;
        if(size>4096){ await reader.cancel(); throw new AuthError('Sign-in request is too large.',413); } chunks.push(next.value); }
      let data: {email?:unknown;userId?:unknown;returnTo?:unknown};
      try { data=JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new AuthError('Invalid sign-in request.'); }
      if (!data || typeof data.email !== 'string' || typeof data.userId !== 'string' || data.email.length > 320 || data.userId.length > 200 || /[^\x20-\x7e]/.test(data.email + data.userId)) throw new AuthError('Enter a valid email and user ID.');
      const headers=new Headers();
      // Never read identity from the incoming request headers for local sign-in.
      if (/[\r\n\u0000-\u001f\u007f]/.test(data.email + data.userId)) throw new AuthError('Enter a valid email and user ID.');
      headers.set('x-buildovate-user-id',data.userId.trim());
      headers.set('x-buildovate-user-email',data.email.trim());
      const user=await resolve(headers,config);
      if (!user) throw new AuthError('Enter a valid email and user ID.');
      const issued=await store.issue(user,config.mode,cookieToken(request.headers));
      return json({ok:true,returnTo:safeReturnPath(data.returnTo)},200,{'set-cookie':sessionCookie(issued.token,ttl,url.protocol==='https:')});
    }
    if (path === '/auth/logout') {
      if(method!=='POST') return json({error:'Method not supported.'},405,{allow:'POST'});
      requireOrigin(request);
      if(!ctx.session || !csrfMatches(ctx.session.csrf_token,request.headers.get('x-csrf-token'))) throw new AuthError('Sign in again before signing out.',403);
      await store.revoke(cookieToken(request.headers));
      const response=json({ok:true,logoutUrl:config.logoutUrl || '/login?signedOut=1'},200,{'set-cookie':sessionCookie('',0,url.protocol==='https:')});
      if (config.mode === 'alb-oidc') {
        const name=config.albCookieName || 'AWSELBAuthSessionCookie';
        if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(name)) throw new AuthError('Invalid login cookie configuration.',503);
        // ALB may split its session across four cookies. Clear all possible shards.
        for (const suffix of ['', '-0', '-1', '-2', '-3']) response.headers.append('set-cookie',name+suffix+'=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      }
      return response;
    }
    if (path.startsWith('/auth/')) return json({error:'Not found.'},404);
    if (path === '/api/session' && method !== 'GET') return json({error:'Method not supported.'},405,{allow:'GET'});
    if (path === '/api/session' && ctx.user && !ctx.session && !local) {
      // ALB supplies identity on every request; cookie binds browser CSRF, not identity.
      const issued=await store.issue(ctx.user,config.mode,cookieToken(request.headers));
      ctx.session=issued.session; ctx.cookie=sessionCookie(issued.token,ttl,url.protocol==='https:');
    }
    if (path.startsWith('/api/') && !publicApi(path,method)) {
      if(!ctx.user) return json({error:'Sign in to continue.',loginUrl:'/login'},401);
      if(!['GET','HEAD','OPTIONS'].includes(method)) {
        requireOrigin(request);
        if(!ctx.session || !csrfMatches(ctx.session.csrf_token,request.headers.get('x-csrf-token'))) throw new AuthError('Refresh your session before saving. Your form has not been cleared.',403);
      }
    }
    if(!ctx.user && privateHtml(url)) {
      // Render the sign-in page at invite URLs so fragments remain in this tab only.
      if (path==='/join' || path==='/team-join') return html(loginPage(local && loopback(url),path+url.search,false,config.mode === 'alb-oidc'));
      return new Response(null,{status:303,headers:{location:'/login?returnTo='+encodeURIComponent(safeReturnPath(path+url.search)),'cache-control':'no-store'}});
    }
    return null;
  }
  return {context,route,store};
}
