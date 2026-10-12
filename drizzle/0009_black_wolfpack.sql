CREATE TABLE `payment_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`action` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payment_audit_tenant` ON `payment_audit` (`tenant_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `payment_entitlements` (
	`id` text PRIMARY KEY NOT NULL,
	`ledger_id` text NOT NULL,
	`tenant_id` text NOT NULL,
	`key` text NOT NULL,
	`quantity` integer,
	`used` integer DEFAULT 0 NOT NULL,
	`period_end` text NOT NULL,
	`source` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	FOREIGN KEY (`ledger_id`) REFERENCES `payment_ledger`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_entitlements_ledger_key` ON `payment_entitlements` (`ledger_id`,`key`);
--> statement-breakpoint
CREATE INDEX `payment_entitlements_tenant` ON `payment_entitlements` (`tenant_id`,`key`);
--> statement-breakpoint
CREATE TABLE `payment_events` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`payload` text NOT NULL,
	`tenant_id` text,
	`processed` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payment_events_pending` ON `payment_events` (`processed`,`created_at`);
--> statement-breakpoint
CREATE TABLE `payment_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`sku` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`reference` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payment_ledger_tenant` ON `payment_ledger` (`tenant_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `payment_ledger_reference` ON `payment_ledger` (`reference`);
--> statement-breakpoint
CREATE TABLE `payment_state` (
	`tenant_id` text PRIMARY KEY NOT NULL,
	`customer_id` text,
	`subscription_id` text,
	`plan` text,
	`status` text DEFAULT 'none' NOT NULL,
	`renews_at` text,
	`minimum_ends_at` text,
	`started_at` text,
	`status_event_at` integer DEFAULT 0 NOT NULL,
	`site_owned` integer DEFAULT 0 NOT NULL,
	`hosting_sku` text,
	`hosting_amount_cents` integer,
	`hosting_status` text,
	`site_available` integer DEFAULT 1 NOT NULL,
	`domain_retained` integer DEFAULT 1 NOT NULL,
	`data_hold_until` text
);
