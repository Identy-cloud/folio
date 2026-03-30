CREATE TABLE "presentation_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"presentation_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "slides" ADD COLUMN "background_gradient" jsonb;--> statement-breakpoint
ALTER TABLE "presentation_versions" ADD CONSTRAINT "presentation_versions_presentation_id_presentations_id_fk" FOREIGN KEY ("presentation_id") REFERENCES "public"."presentations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pv_presentation_version_idx" ON "presentation_versions" USING btree ("presentation_id","version");