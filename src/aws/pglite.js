// Local-only Postgres (in-process). Production uses src/aws/pg.js and RDS.
// The package is a devDependency and is imported only when this driver is selected.

function rowCount(result) {
  if (typeof result?.affectedRows === 'number') return result.affectedRows;
  return result?.rows?.length ?? 0;
}

export async function createPgliteExecutor(dataDir) {
  const { PGlite } = await import('@electric-sql/pglite');
  const db = new PGlite(dataDir || undefined);

  async function query(sql, params = []) {
    if (params.length) {
      const result = await db.query(sql, params);
      return { rows: result.rows, rowCount: rowCount(result) };
    }
    const results = await db.exec(sql);
    const last = results.at(-1) || { rows: [], affectedRows: 0 };
    return { rows: last.rows || [], rowCount: rowCount(last) };
  }

  return {
    query,
    async transaction(fn) {
      await db.exec('BEGIN');
      try {
        const result = await fn(query);
        await db.exec('COMMIT');
        return result;
      } catch (error) {
        try { await db.exec('ROLLBACK'); } catch { /* already aborted */ }
        throw error;
      }
    },
    async close() {
      await db.close();
    },
  };
}
