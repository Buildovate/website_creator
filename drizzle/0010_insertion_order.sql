ALTER TABLE payment_audit ADD COLUMN insertion_seq INTEGER;
--> statement-breakpoint
UPDATE payment_audit SET insertion_seq = rowid WHERE insertion_seq IS NULL;
--> statement-breakpoint
ALTER TABLE chat_messages ADD COLUMN insertion_seq INTEGER;
--> statement-breakpoint
UPDATE chat_messages SET insertion_seq = rowid WHERE insertion_seq IS NULL;
--> statement-breakpoint
CREATE TABLE insertion_sequences (table_name TEXT PRIMARY KEY NOT NULL, value INTEGER NOT NULL);
--> statement-breakpoint
INSERT INTO insertion_sequences (table_name,value) SELECT 'payment_audit', COALESCE(MAX(insertion_seq),0) FROM payment_audit;
--> statement-breakpoint
CREATE TRIGGER payment_audit_insertion_seq AFTER INSERT ON payment_audit
WHEN NEW.insertion_seq IS NULL
BEGIN
  UPDATE insertion_sequences SET value = MAX(value + 1, NEW.rowid) WHERE table_name = 'payment_audit';
  UPDATE payment_audit SET insertion_seq = (SELECT value FROM insertion_sequences WHERE table_name = 'payment_audit') WHERE rowid = NEW.rowid;
END;
--> statement-breakpoint
CREATE UNIQUE INDEX payment_audit_insertion_seq_unique ON payment_audit (insertion_seq);
--> statement-breakpoint
INSERT INTO insertion_sequences (table_name,value) SELECT 'chat_messages', COALESCE(MAX(insertion_seq),0) FROM chat_messages;
--> statement-breakpoint
CREATE TRIGGER chat_messages_insertion_seq AFTER INSERT ON chat_messages
WHEN NEW.insertion_seq IS NULL
BEGIN
  UPDATE insertion_sequences SET value = MAX(value + 1, NEW.rowid) WHERE table_name = 'chat_messages';
  UPDATE chat_messages SET insertion_seq = (SELECT value FROM insertion_sequences WHERE table_name = 'chat_messages') WHERE rowid = NEW.rowid;
END;
--> statement-breakpoint
CREATE UNIQUE INDEX chat_messages_insertion_seq_unique ON chat_messages (insertion_seq);
--> statement-breakpoint
