ALTER TABLE "comments" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "slides" ADD COLUMN "transition_duration" integer;--> statement-breakpoint
ALTER TABLE "slides" ADD COLUMN "transition_easing" text;--> statement-breakpoint
CREATE INDEX "comments_parent_id_idx" ON "comments" USING btree ("parent_id");