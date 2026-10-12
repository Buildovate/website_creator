CREATE TABLE promotion_completions (
 id text PRIMARY KEY NOT NULL,
 tenant_id text NOT NULL REFERENCES tenants(id),
 offer_id text NOT NULL,
 offer_revision text NOT NULL,
 visitor_hash text NOT NULL,
 evidence text NOT NULL,
 completed_at text NOT NULL,
 expires_at text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX promotion_completion_scope ON promotion_completions (tenant_id,offer_id,offer_revision,visitor_hash);
--> statement-breakpoint
CREATE INDEX promotion_completion_tenant ON promotion_completions (tenant_id,completed_at);
--> statement-breakpoint
CREATE TABLE promotion_unlock_limits (id text PRIMARY KEY NOT NULL,attempts integer NOT NULL,expires_at text NOT NULL);
--> statement-breakpoint
CREATE INDEX promotion_unlock_limit_expiry ON promotion_unlock_limits (expires_at);
