CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`sender` text NOT NULL,
	`body` text NOT NULL,
	`provider_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`thread_id`) REFERENCES `chat_threads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chat_messages_provider_id_unique` ON `chat_messages` (`provider_id`);--> statement-breakpoint
CREATE INDEX `chat_thread_created` ON `chat_messages` (`thread_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `chat_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`human` integer DEFAULT 0 NOT NULL,
	`message_count` integer DEFAULT 0 NOT NULL,
	`ip_hash` text NOT NULL,
	`notification` text DEFAULT 'not_requested' NOT NULL,
	`lock_until` text DEFAULT '' NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chat_threads_reference_unique` ON `chat_threads` (`reference`);--> statement-breakpoint
CREATE INDEX `chat_tenant_updated` ON `chat_threads` (`tenant_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `chat_tenant_ip_created` ON `chat_threads` (`tenant_id`,`ip_hash`,`created_at`);