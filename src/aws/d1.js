import { translateSql } from './sql.js';

// D1 surface used by src/core.js and a handful of direct prepare/batch calls:
// prepare().bind().first() | all() | run(), and db.batch([...]).run()-shaped results.

function argsOf(values) {
  return values.map(value => value === undefined ? null : value);
}

function normalize(value) {
  if (typeof value === 'bigint') {
    const n = Number(value);
    if (!Number.isSafeInteger(n)) throw new Error('Integer value exceeds JS safe integer range');
    return n;
  }
  return value;
}

function normalizeRow(row) {
  if (!row || typeof row !== 'object') return row ?? null;
  const out = {};
  for (const [key, value] of Object.entries(row)) out[key] = normalize(value);
  return out;
}

function changes(result) {
  const n = result?.rowCount;
  return Number.isFinite(Number(n)) ? Number(n) : 0;
}

export function createD1Adapter(executor) {
  function statement(sql) {
    let args = [];
    const api = {
      bind(...values) {
        args = argsOf(values);
        return api;
      },
      async first() {
        const result = await executor.query(translateSql(sql), args);
        return normalizeRow(result.rows[0] ?? null);
      },
      async all() {
        const result = await executor.query(translateSql(sql), args);
        return { results: result.rows.map(normalizeRow) };
      },
      async run() {
        const result = await executor.query(translateSql(sql), args);
        return { success: true, meta: { changes: changes(result) } };
      },
    };
    Object.defineProperty(api, '_sql', { value: sql });
    Object.defineProperty(api, '_args', { get() { return args; } });
    return api;
  }

  return {
    prepare(sql) {
      return statement(sql);
    },
    async batch(statements) {
      return executor.transaction(async query => {
        const results = [];
        for (const stmt of statements) {
          const result = await query(translateSql(stmt._sql), stmt._args);
          results.push({ success: true, meta: { changes: changes(result) } });
        }
        return results;
      });
    },
  };
}
