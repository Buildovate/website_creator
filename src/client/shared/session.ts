export interface SessionUser { id:string; email:string; owner?:boolean; admin:boolean; staff:boolean; platformRole:string|null }
export interface Session {
  user:SessionUser|null; initialized:boolean;
  memberships?:{tenantId:string;role:string}[];
  authMode?:string; loginUrl?:string; logoutUrl?:string; providerLogoutUrl?:string;
  expiresAt?:string|null; csrfToken?:string|null;
}
export function safeReturnPath(value: string): string {
  if (!value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020]/.test(value)) return '/';
  try { const u=new URL(value,'http://return.local');
    if(u.origin!=='http://return.local'||u.pathname==='/login'||u.pathname.startsWith('/auth/')||/^\/sign(in|out)-/.test(u.pathname)) return '/';
    return u.pathname+u.search+u.hash;
  } catch {return '/';}
}
const RETURN_KEY='bv.auth.return';
export function rememberReturn(value:string) { try { sessionStorage.setItem(RETURN_KEY,safeReturnPath(value)); } catch {} }
export function takeReturn(fallback:string) {
  try { const value=sessionStorage.getItem(RETURN_KEY); sessionStorage.removeItem(RETURN_KEY); return safeReturnPath(value||fallback); }
  catch { return safeReturnPath(fallback); }
}
