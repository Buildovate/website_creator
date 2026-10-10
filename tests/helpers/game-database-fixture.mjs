import {DatabaseSync} from 'node:sqlite';
import {paymentHarness} from './payments-fixture.mjs';
export function isPostgresGameFixture(){return typeof DatabaseSync.prototype.call==='function';}
export function gameDatabaseFixture(){return paymentHarness().sql;}
const stamp='2026-01-01T00:00:00.000Z';
export function seedGameTenant(db,id,name,{settings='{}',published=null,status='draft',version=1}={}){
 db.prepare('INSERT INTO tenants(id,slug,name,settings,published,status,version,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)').run(id,'game-fixture-'+id,name,settings,published,status,version,stamp,stamp);
}
export function seedGameMember(db,tenant,user,role){db.prepare('INSERT INTO members(id,tenant_id,user_id,email,role,active,created_at) VALUES(?,?,?,?,?,1,?)').run('member-'+tenant+'-'+user,tenant,user,user+'@example.test',role,stamp);}
export function seedGameAdmin(db,user){db.prepare('INSERT INTO admins(user_id,email,created_at,role) VALUES(?,?,?,?)').run(user,user+'@example.test',stamp,'admin');}
