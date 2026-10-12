import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export interface User { id: string; email: string }
export interface Statement {
  bind(...values: unknown[]): Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface Database { prepare(sql: string): Statement; batch(statements: Statement[]): Promise<unknown> }
export interface Session { token_hash: string; user_id: string; email: string; mode: string; csrf_token: string; expires_at: string }
export const COOKIE = 'bv_workspace';
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export function cookieToken(headers: Headers): string {
  const matches = (headers.get('cookie') || '').split(';').map(v => v.trim()).filter(v => v.startsWith(COOKIE + '='));
  if (matches.length !== 1) return '';
  const value = matches[0].slice(COOKIE.length + 1);
  return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : '';
}
export function csrfMatches(expected: string, actual: string | null): boolean {
  if (!actual || actual.length !== expected.length) return false;
  const expectedBytes=Buffer.from(expected), actualBytes=Buffer.from(actual);
  return expectedBytes.length === actualBytes.length && timingSafeEqual(expectedBytes, actualBytes);
}
export class SessionStore {
  private nextCleanup = 0;
  constructor(private db: Database, private ttl: number) {}
  async get(token: string, mode: string): Promise<Session | null> {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    return this.db.prepare('SELECT * FROM auth_sessions WHERE token_hash=? AND mode=? AND expires_at>?')
      .bind(hashToken(token), mode, new Date().toISOString()).first<Session>();
  }
  async revoke(token: string) {
    if (token) await this.db.prepare('DELETE FROM auth_sessions WHERE token_hash=?').bind(hashToken(token)).run();
  }
  async issue(user: User, mode: string, previous = '') {
    const now = new Date().toISOString();
    if (Date.now() > this.nextCleanup) {
      await this.db.prepare('DELETE FROM auth_sessions WHERE token_hash IN (SELECT token_hash FROM auth_sessions WHERE expires_at<=? LIMIT 100)')
        .bind(now).run();
      this.nextCleanup = Date.now() + 60_000;
    }
    const token = randomBytes(32).toString('base64url');
    const csrf = randomBytes(32).toString('base64url');
    const expires = new Date(Date.now() + this.ttl * 1000).toISOString();
    const operations = [this.db.prepare('INSERT INTO auth_sessions (token_hash,user_id,email,mode,csrf_token,created_at,expires_at) VALUES (?,?,?,?,?,?,?)')
      .bind(hashToken(token), user.id, user.email, mode, csrf, now, expires)];
    if (previous) operations.push(this.db.prepare('DELETE FROM auth_sessions WHERE token_hash=?').bind(hashToken(previous)));
    await this.db.batch(operations);
    return { token, session: { token_hash: hashToken(token), user_id: user.id, email: user.email, mode, csrf_token: csrf, expires_at: expires } };
  }
}
export function sessionCookie(token: string, ttl: number, secure: boolean) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ttl}${secure ? '; Secure' : ''}`;
}
