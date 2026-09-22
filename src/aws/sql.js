// Translate the Worker’s SQLite/D1 statements into PostgreSQL.
// The application keeps `?` placeholders, json_extract/json_set, and INSERT OR IGNORE.

const SQL_TYPES = new Set(['integer', 'int', 'text', 'boolean', 'numeric', 'bigint', 'real', 'float', 'double', 'json', 'jsonb', 'bytea', 'timestamptz']);

export function translateSql(sql) {
  let out = String(sql);
  const ignore = /^\s*INSERT\s+OR\s+IGNORE\s+INTO\b/i.test(out);
  if (ignore) out = out.replace(/^\s*INSERT\s+OR\s+IGNORE\s+INTO\b/i, 'INSERT INTO');
  out = quoteJsonExtractNumbers(out);
  out = quoteAliases(out);
  out = replacePlaceholders(out);
  if (ignore && !/\bON\s+CONFLICT\b/i.test(out)) {
    out = out.replace(/;\s*$/, '');
    out += ' ON CONFLICT DO NOTHING';
  }
  return out;
}

// PostgreSQL folds unquoted aliases to lowercase. SQLite keeps `AS displayName`.
function quoteAliases(sql) {
  let out = '';
  let i = 0;
  while (i < sql.length) {
    if (sql[i] === "'") {
      const start = i;
      i++;
      while (i < sql.length) {
        if (sql[i] === "'") {
          if (sql[i + 1] === "'") { i += 2; continue; }
          i++;
          break;
        }
        i++;
      }
      out += sql.slice(start, i);
      continue;
    }
    const match = /^AS\s+("?)([A-Za-z_][A-Za-z0-9_]*)\1/i.exec(sql.slice(i));
    const boundary = i === 0 || /[^A-Za-z0-9_]/.test(sql[i - 1]);
    if (match && boundary && !match[1] && !SQL_TYPES.has(match[2].toLowerCase())) {
      out += `AS "${match[2]}"`;
      i += match[0].length;
      continue;
    }
    out += sql[i];
    i++;
  }
  return out;
}

// json_extract() is defined to return text. SQLite compared that result to bare
// integers (`= 0`); PostgreSQL will not compare text with integer.
function quoteJsonExtractNumbers(sql) {
  return sql.replace(/json_extract\([^)]*\)(\s*(?:=|<>|!=)\s*)(\d+)/gi, (full, _op, num) => {
    return full.slice(0, full.length - num.length) + `'${num}'`;
  });
}

export function replacePlaceholders(sql) {
  let out = '';
  let n = 0;
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (c === "'") {
      const start = i;
      i++;
      while (i < sql.length) {
        if (sql[i] === "'") {
          if (sql[i + 1] === "'") { i += 2; continue; }
          i++;
          break;
        }
        i++;
      }
      out += sql.slice(start, i);
      continue;
    }
    if (c === '?') {
      n += 1;
      out += `$${n}`;
      i++;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}
