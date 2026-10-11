ALTER TABLE payment_state ADD COLUMN past_due_since TEXT;
--> statement-breakpoint
ALTER TABLE payment_state ADD COLUMN hosting_starts_at TEXT;
--> statement-breakpoint
ALTER TABLE payment_state ADD COLUMN hosting_subscription_id TEXT;
--> statement-breakpoint
ALTER TABLE payment_state ADD COLUMN hosting_stop_at TEXT;
--> statement-breakpoint
CREATE TABLE payment_reminders (id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL REFERENCES tenants(id),past_due_since TEXT NOT NULL,day INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'queued_local',recipient TEXT,subject TEXT NOT NULL,message TEXT NOT NULL,created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE payment_plan_changes (id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL REFERENCES tenants(id),subscription_id TEXT NOT NULL,current_sku TEXT NOT NULL,target_sku TEXT NOT NULL,amount_cents INTEGER NOT NULL,line_net_cents INTEGER NOT NULL,tax_cents INTEGER NOT NULL,kind TEXT NOT NULL,period_end TEXT NOT NULL,effective_at TEXT NOT NULL,expires_at TEXT NOT NULL,status TEXT NOT NULL,idempotency_key TEXT,created_at TEXT NOT NULL);
--> statement-breakpoint
