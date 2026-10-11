CREATE TABLE ebook_receipts (
 id text PRIMARY KEY NOT NULL, tenant_id text NOT NULL REFERENCES tenants(id),
 revision text NOT NULL, mode text NOT NULL, visitor_hash text NOT NULL,
 payload_hash text NOT NULL, email_hash text NOT NULL, evidence text NOT NULL,
 inquiry_id text NOT NULL, created_at text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX ebook_receipt_scope ON ebook_receipts(tenant_id,revision,mode,visitor_hash);
--> statement-breakpoint
CREATE INDEX ebook_receipt_tenant ON ebook_receipts(tenant_id,created_at);
