CREATE TABLE `workspace_records` (
	`id` text PRIMARY KEY NOT NULL,
	`scope` text NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	`published` text,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `workspace_scope_kind` ON `workspace_records` (`scope`,`kind`);