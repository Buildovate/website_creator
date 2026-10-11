import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadDrizzleStatements, orderMigrationStatements } from './ddl.js';

const COMPAT = path.resolve('aws/postgres/000_sqlite_compat.sql');
const DRIZZLE = path.resolve('drizzle');

export function compatStatements() {
  return readFileSync(COMPAT, 'utf8')
    .split(/^\s*--\s*statement-break\s*$/m)
    .map(sql => sql.trim().replace(/;+\s*$/, ''))
    .filter(sql => sql.replace(/--[^\n]*/g, '').trim());
}

export async function applyMigrations(query) {
  const compat = compatStatements().map((sql, index) => ({ id: `000_sqlite_compat.sql#${index}`, sql }));
  await query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);
  const appliedRows = await query('SELECT id FROM schema_migrations');
  const applied = new Set(appliedRows.rows.map(row => row.id));
  const ordered = [...compat, ...orderMigrationStatements(loadDrizzleStatements(DRIZZLE))];
  let count = 0;
  for (const entry of ordered) {
    if (applied.has(entry.id)) continue;
    try {
      await query(entry.sql);
      await query('INSERT INTO schema_migrations (id) VALUES ($1)', [entry.id]);
    } catch (error) {
      const preview = entry.sql.slice(0, 180).replace(/\s+/g, ' ');
      throw new Error(`Migration ${entry.id} failed: ${error.message}\n${preview}`);
    }
    count += 1;
  }
  return { applied: count, total: ordered.length };
}

async function main() {
  const { loadEnv, assertRuntimeConfig } = await import('./env.js');
  const env = loadEnv(process.env);
  const errors = assertRuntimeConfig(env).filter(error => !error.startsWith('S3_BUCKET') && !error.startsWith('BUCKET_'));
  if (!env.DATABASE_URL && env.DATABASE_DRIVER !== 'pglite') {
    console.error('DATABASE_URL is required to migrate. Refusing to guess a database.');
    process.exit(1);
  }
  if (env.NODE_ENV === 'production' && env.DATABASE_DRIVER === 'pglite') {
    console.error('DATABASE_DRIVER=pglite cannot migrate a production database.');
    process.exit(1);
  }
  for (const error of errors) {
    if (error.includes('DATABASE') || error.includes('pglite') || error.includes('APP_ENV')) {
      console.error(error);
      process.exit(1);
    }
  }
  const executor = env.DATABASE_DRIVER === 'pglite'
    ? await (await import('./pglite.js')).createPgliteExecutor(env.PGLITE_DATA_DIR)
    : (await import('./pg.js')).createPgExecutor((await import('./pg.js')).createPgPool(env));
  try {
    const result = await applyMigrations((sql, params) => executor.query(sql, params));
    console.log(`Migrations applied: ${result.applied} new, ${result.total} known. Database is ${env.DATABASE_DRIVER === 'pglite' ? 'local pglite' : 'Postgres'}.`);
  } finally {
    await executor.close();
  }
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invoked) {
  main().catch(error => {
    console.error(error.message || error);
    process.exit(1);
  });
}
