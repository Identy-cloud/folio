CREATE TABLE "fonts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"family" text NOT NULL,
	"url" text NOT NULL,
	"format" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"presentation_id" uuid NOT NULL,
	"reporter_email" text,
	"reason" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "presentations" ADD COLUMN "share_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "presentations" ADD COLUMN "share_token" text;--> statement-breakpoint
ALTER TABLE "fonts" ADD CONSTRAINT "fonts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_presentation_id_presentations_id_fk" FOREIGN KEY ("presentation_id") REFERENCES "public"."presentations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fonts_user_id_idx" ON "fonts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reports_presentation_id_idx" ON "reports" USING btree ("presentation_id");--> statement-breakpoint
CREATE INDEX "reports_status_idx" ON "reports" USING btree ("status");--> statement-breakpoint
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_share_token_unique" UNIQUE("share_token");