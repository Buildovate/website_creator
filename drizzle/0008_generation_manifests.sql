CREATE TABLE generation_manifests (id TEXT PRIMARY KEY NOT NULL, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, data TEXT NOT NULL, created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX generation_manifests_tenant ON generation_manifests(tenant_id,created_at);
