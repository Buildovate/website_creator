import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Drizzle’s SQLite migrations are the source of truth. This rewrites them into
// PostgreSQL DDL and orders CREATE TABLE statements so forward foreign keys
// (legal in SQLite, rejected by PostgreSQL) are created after their targets.

const BREAK = /-->\s*statement-breakpoint/g;

export function translateDdl(sql) {
  let out = String(sql).replace(/`([^`]+)`/g, '$1');
  out = out.replaceAll("lower(hex(randomblob(16)))", 'md5(gen_random_uuid()::text)');
  out = out.replaceAll(
    "strftime('%Y-%m-%dT%H:%M:%fZ','now')",
    "to_char((clock_timestamp() AT TIME ZONE 'UTC'), 'YYYY-MM-DD\"T\"HH24:MI:SS.MS\"Z\"')"
  );
  if (/^\s*ALTER\s+TABLE\b/i.test(out)) out = out.replace(/\bADD\s+(?!COLUMN\b)/i, 'ADD COLUMN ');
  return out.trim();
}

export function splitStatements(sql) {
  return translateDdl(sql).split(BREAK).map(part => part.trim().replace(/;+\s*$/, '')).filter(Boolean);
}

export function loadDrizzleStatements(dir) {
  const files = readdirSync(dir).filter(name => name.endsWith('.sql')).sort();
  const entries = [];
  for (const file of files) {
    const parts = splitStatements(readFileSync(path.join(dir, file), 'utf8'));
    parts.forEach((sql, index) => {
      entries.push({ id: `${file}#${index}`, file, index, order: entries.length, sql });
    });
  }
  return entries;
}

function tableName(sql) {
  return sql.match(/^\s*CREATE\s+TABLE\s+(\w+)/i)?.[1]?.toLowerCase() || null;
}

function references(sql) {
  return [...sql.matchAll(/\bREFERENCES\s+(\w+)/gi)].map(match => match[1].toLowerCase());
}

export function orderMigrationStatements(entries) {
  const creates = entries.filter(entry => /^\s*CREATE\s+TABLE\b/i.test(entry.sql));
  const rest = entries.filter(entry => !/^\s*CREATE\s+TABLE\b/i.test(entry.sql));
  const byName = new Map(creates.map(entry => [tableName(entry.sql), entry]));
  const indegree = new Map();
  const dependents = new Map();
  for (const name of byName.keys()) {
    indegree.set(name, 0);
    dependents.set(name, []);
  }
  for (const entry of creates) {
    const name = tableName(entry.sql);
    for (const ref of references(entry.sql)) {
      if (!byName.has(ref) || ref === name) continue;
      dependents.get(ref).push(name);
      indegree.set(name, indegree.get(name) + 1);
    }
  }
  const byOrder = (a, b) => byName.get(a).order - byName.get(b).order;
  const queue = [...byName.keys()].filter(name => indegree.get(name) === 0).sort(byOrder);
  const sorted = [];
  while (queue.length) {
    const name = queue.shift();
    sorted.push(byName.get(name));
    for (const dep of dependents.get(name)) {
      indegree.set(dep, indegree.get(dep) - 1);
      if (indegree.get(dep) === 0) queue.push(dep);
    }
    queue.sort(byOrder);
  }
  if (sorted.length !== creates.length) {
    const missing = [...byName.keys()].filter(name => !sorted.includes(byName.get(name)));
    throw new Error(`Could not order CREATE TABLE statements: ${missing.join(', ')}`);
  }
  const alters = rest.filter(entry => /^\s*ALTER\s+TABLE\b/i.test(entry.sql));
  const indexes = rest.filter(entry => /^\s*CREATE\s+(UNIQUE\s+)?INDEX\b/i.test(entry.sql));
  const others = rest.filter(entry => !alters.includes(entry) && !indexes.includes(entry));
  return [...sorted, ...alters, ...indexes, ...others];
}
