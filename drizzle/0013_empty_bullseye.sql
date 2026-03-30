CREATE TABLE "saved_slides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"elements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"background_color" text DEFAULT '#ffffff' NOT NULL,
	"background_image" text,
	"background_gradient" jsonb,
	"thumbnail_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "presentations" ADD COLUMN "recording_url" text;--> statement-breakpoint
ALTER TABLE "presentations" ADD COLUMN "recording_timeline" jsonb;--> statement-breakpoint
ALTER TABLE "presentations" ADD COLUMN "recording_duration" integer;--> statement-breakpoint
ALTER TABLE "saved_slides" ADD CONSTRAINT "saved_slides_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "saved_slides_user_id_idx" ON "saved_slides" USING btree ("user_id");