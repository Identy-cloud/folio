CREATE INDEX "comments_presentation_id_idx" ON "comments" USING btree ("presentation_id");--> statement-breakpoint
CREATE INDEX "presentation_views_presentation_id_idx" ON "presentation_views" USING btree ("presentation_id");--> statement-breakpoint
CREATE INDEX "presentations_user_id_idx" ON "presentations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "slides_presentation_id_idx" ON "slides" USING btree ("presentation_id");