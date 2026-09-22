-- SQLite helpers used by the existing Worker SQL. Applied before Drizzle migrations.
-- Statements are separated by `-- statement-break` because function bodies contain semicolons.
-- json_extract returns text so the D1 adapter can compare path values the way the app already does.
-- Multi-segment paths (`$.a.b`) are supported. INSERT OR IGNORE is rewritten in the query adapter, not here.

CREATE OR REPLACE FUNCTION json_extract(doc text, path text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN doc IS NULL OR path IS NULL OR btrim(doc) = '' THEN NULL
    ELSE (
      SELECT CASE
        WHEN j IS NULL OR jsonb_typeof(j) = 'null' THEN NULL
        WHEN jsonb_typeof(j) = 'string' THEN j #>> '{}'
        WHEN jsonb_typeof(j) = 'boolean' THEN CASE WHEN j = 'true'::jsonb THEN '1' ELSE '0' END
        ELSE j #>> '{}'
      END
      FROM (
        SELECT jsonb_extract_path(doc::jsonb, VARIADIC string_to_array(substring(path from 3), '.')) AS j
      ) extracted
    )
  END
$$
-- statement-break
CREATE OR REPLACE FUNCTION json_set(doc text, path text, val text)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT jsonb_set(
    CASE WHEN doc IS NULL OR btrim(doc) = '' THEN '{}'::jsonb ELSE doc::jsonb END,
    string_to_array(substring(path from 3), '.'),
    to_jsonb(val),
    true
  )::text
$$
