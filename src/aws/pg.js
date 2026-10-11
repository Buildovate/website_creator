import pg from 'pg';

// COUNT(*) is int8, which node-pg returns as a string. The app compares those
// counts with numbers (`n < 3`). Values stay inside the safe integer range.
pg.types.setTypeParser(20, value => {
  const n = Number(value);
  if (!Number.isSafeInteger(n)) throw new Error('int8 value exceeds JS safe integer range');
  return n;
});

export function createPgPool(env) {
  const config = {
    connectionString: env.DATABASE_URL,
    max: Number(env.PG_POOL_MAX || 10),
  };
  if (env.PGSSLMODE === 'require') {
    config.ssl = { rejectUnauthorized: env.PGSSL_REJECT_UNAUTHORIZED !== '0' };
  }
  return new pg.Pool(config);
}

export function createPgExecutor(pool) {
  return {
    async query(sql, params = []) {
      const result = await pool.query(sql, params);
      return { rows: result.rows, rowCount: result.rowCount };
    },
    async transaction(fn) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn(async (sql, params = []) => {
          const query = await client.query(sql, params);
          return { rows: query.rows, rowCount: query.rowCount };
        });
        await client.query('COMMIT');
        return result;
      } catch (error) {
        try { await client.query('ROLLBACK'); } catch { /* connection already lost */ }
        throw error;
      } finally {
        client.release();
      }
    },
    async close() {
      await pool.end();
    },
  };
}
