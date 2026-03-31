-- 0018: Enable Row Level Security on all public tables
-- Every table gets RLS enabled + appropriate policies based on ownership model

-- ============================================================
-- 1. ENABLE RLS ON ALL 17 TABLES
-- ============================================================

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workspaces" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workspace_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "folders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "presentations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "slides" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "collaborators" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "presentation_views" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fonts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "presentation_versions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "saved_slides" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. SERVICE ROLE BYPASS
-- The service_role key (used by API routes via Drizzle) bypasses
-- RLS automatically in Supabase, so API routes keep working.
-- These policies govern direct client access (anon / authenticated).
-- ============================================================

-- ============================================================
-- 3. USERS — own row only
-- ============================================================

CREATE POLICY "users_select_own"
  ON "users" FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_update_own"
  ON "users" FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow insert during signup (auth trigger creates the row)
CREATE POLICY "users_insert_own"
  ON "users" FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- ============================================================
-- 4. WORKSPACES — owner or member
-- ============================================================

CREATE POLICY "workspaces_select"
  ON "workspaces" FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR id IN (SELECT workspace_id FROM "workspace_members" WHERE user_id = auth.uid())
  );

CREATE POLICY "workspaces_insert"
  ON "workspaces" FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "workspaces_update"
  ON "workspaces" FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "workspaces_delete"
  ON "workspaces" FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- ============================================================
-- 5. WORKSPACE MEMBERS — owner manages, members read
-- ============================================================

CREATE POLICY "workspace_members_select"
  ON "workspace_members" FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR workspace_id IN (SELECT id FROM "workspaces" WHERE owner_id = auth.uid())
  );

CREATE POLICY "workspace_members_insert"
  ON "workspace_members" FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (SELECT id FROM "workspaces" WHERE owner_id = auth.uid())
  );

CREATE POLICY "workspace_members_delete"
  ON "workspace_members" FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR workspace_id IN (SELECT id FROM "workspaces" WHERE owner_id = auth.uid())
  );

-- ============================================================
-- 6. FOLDERS — own folders only
-- ============================================================

CREATE POLICY "folders_select_own"
  ON "folders" FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "folders_insert_own"
  ON "folders" FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "folders_update_own"
  ON "folders" FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "folders_delete_own"
  ON "folders" FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 7. PRESENTATIONS — owner, collaborator, or public viewer
-- ============================================================

-- Authenticated: owner or collaborator
CREATE POLICY "presentations_select_auth"
  ON "presentations" FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR id IN (SELECT presentation_id FROM "collaborators" WHERE user_id = auth.uid())
  );

-- Anon: public presentations only (viewer page by slug)
CREATE POLICY "presentations_select_public"
  ON "presentations" FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "presentations_insert_own"
  ON "presentations" FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "presentations_update_own"
  ON "presentations" FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR id IN (SELECT presentation_id FROM "collaborators" WHERE user_id = auth.uid() AND role IN ('editor', 'owner'))
  )
  WITH CHECK (
    user_id = auth.uid()
    OR id IN (SELECT presentation_id FROM "collaborators" WHERE user_id = auth.uid() AND role IN ('editor', 'owner'))
  );

CREATE POLICY "presentations_delete_own"
  ON "presentations" FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 8. SLIDES — follows presentation access
-- ============================================================

CREATE POLICY "slides_select_auth"
  ON "slides" FOR SELECT
  TO authenticated
  USING (
    presentation_id IN (
      SELECT id FROM "presentations"
      WHERE user_id = auth.uid()
         OR id IN (SELECT presentation_id FROM "collaborators" WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "slides_select_public"
  ON "slides" FOR SELECT
  TO anon
  USING (
    presentation_id IN (SELECT id FROM "presentations" WHERE is_public = true)
  );

CREATE POLICY "slides_insert"
  ON "slides" FOR INSERT
  TO authenticated
  WITH CHECK (
    presentation_id IN (
      SELECT id FROM "presentations"
      WHERE user_id = auth.uid()
         OR id IN (SELECT presentation_id FROM "collaborators" WHERE user_id = auth.uid() AND role IN ('editor', 'owner'))
    )
  );

CREATE POLICY "slides_update"
  ON "slides" FOR UPDATE
  TO authenticated
  USING (
    presentation_id IN (
      SELECT id FROM "presentations"
      WHERE user_id = auth.uid()
         OR id IN (SELECT presentation_id FROM "collaborators" WHERE user_id = auth.uid() AND role IN ('editor', 'owner'))
    )
  );

CREATE POLICY "slides_delete"
  ON "slides" FOR DELETE
  TO authenticated
  USING (
    presentation_id IN (
      SELECT id FROM "presentations" WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- 9. COLLABORATORS — presentation owner manages
-- ============================================================

CREATE POLICY "collaborators_select"
  ON "collaborators" FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR presentation_id IN (SELECT id FROM "presentations" WHERE user_id = auth.uid())
  );

CREATE POLICY "collaborators_insert"
  ON "collaborators" FOR INSERT
  TO authenticated
  WITH CHECK (
    presentation_id IN (SELECT id FROM "presentations" WHERE user_id = auth.uid())
  );

CREATE POLICY "collaborators_delete"
  ON "collaborators" FOR DELETE
  TO authenticated
  USING (
    presentation_id IN (SELECT id FROM "presentations" WHERE user_id = auth.uid())
  );

-- ============================================================
-- 10. SUBSCRIPTIONS — own row only
-- ============================================================

CREATE POLICY "subscriptions_select_own"
  ON "subscriptions" FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insert/update via service_role (Stripe webhook), no client policy needed

-- ============================================================
-- 11. PRESENTATION VIEWS — anon can insert (viewer tracking), owner reads
-- ============================================================

CREATE POLICY "views_select_owner"
  ON "presentation_views" FOR SELECT
  TO authenticated
  USING (
    presentation_id IN (SELECT id FROM "presentations" WHERE user_id = auth.uid())
  );

CREATE POLICY "views_insert_anon"
  ON "presentation_views" FOR INSERT
  TO anon
  WITH CHECK (
    presentation_id IN (SELECT id FROM "presentations" WHERE is_public = true)
  );

CREATE POLICY "views_insert_auth"
  ON "presentation_views" FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================
-- 12. NOTIFICATIONS — own notifications only
-- ============================================================

CREATE POLICY "notifications_select_own"
  ON "notifications" FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own"
  ON "notifications" FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_delete_own"
  ON "notifications" FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 13. REPORTS — anon can insert (anyone can report)
-- ============================================================

CREATE POLICY "reports_insert_anon"
  ON "reports" FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "reports_insert_auth"
  ON "reports" FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Select/update via service_role (admin moderation)

-- ============================================================
-- 14. FONTS — own fonts only
-- ============================================================

CREATE POLICY "fonts_select_own"
  ON "fonts" FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "fonts_insert_own"
  ON "fonts" FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "fonts_delete_own"
  ON "fonts" FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 15. PRESENTATION VERSIONS — follows presentation access
-- ============================================================

CREATE POLICY "versions_select"
  ON "presentation_versions" FOR SELECT
  TO authenticated
  USING (
    presentation_id IN (
      SELECT id FROM "presentations"
      WHERE user_id = auth.uid()
         OR id IN (SELECT presentation_id FROM "collaborators" WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "versions_insert"
  ON "presentation_versions" FOR INSERT
  TO authenticated
  WITH CHECK (
    presentation_id IN (SELECT id FROM "presentations" WHERE user_id = auth.uid())
  );

-- ============================================================
-- 16. SAVED SLIDES — own library only
-- ============================================================

CREATE POLICY "saved_slides_select_own"
  ON "saved_slides" FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "saved_slides_insert_own"
  ON "saved_slides" FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "saved_slides_delete_own"
  ON "saved_slides" FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 17. QUESTIONS — public insert (Q&A), owner reads
-- ============================================================

CREATE POLICY "questions_select"
  ON "questions" FOR SELECT
  TO anon, authenticated
  USING (
    presentation_id IN (SELECT id FROM "presentations" WHERE is_public = true)
  );

CREATE POLICY "questions_insert_anon"
  ON "questions" FOR INSERT
  TO anon
  WITH CHECK (
    presentation_id IN (SELECT id FROM "presentations" WHERE is_public = true)
  );

CREATE POLICY "questions_insert_auth"
  ON "questions" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "questions_update_owner"
  ON "questions" FOR UPDATE
  TO authenticated
  USING (
    presentation_id IN (SELECT id FROM "presentations" WHERE user_id = auth.uid())
  );

-- ============================================================
-- 18. SESSIONS — own sessions only
-- ============================================================

CREATE POLICY "sessions_select_own"
  ON "sessions" FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "sessions_insert_own"
  ON "sessions" FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "sessions_update_own"
  ON "sessions" FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "sessions_delete_own"
  ON "sessions" FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- 19. COMMENTS — public on public presentations
-- ============================================================

CREATE POLICY "comments_select"
  ON "comments" FOR SELECT
  TO anon, authenticated
  USING (
    presentation_id IN (SELECT id FROM "presentations" WHERE is_public = true)
  );

CREATE POLICY "comments_select_owner"
  ON "comments" FOR SELECT
  TO authenticated
  USING (
    presentation_id IN (SELECT id FROM "presentations" WHERE user_id = auth.uid())
  );

CREATE POLICY "comments_insert_anon"
  ON "comments" FOR INSERT
  TO anon
  WITH CHECK (
    presentation_id IN (SELECT id FROM "presentations" WHERE is_public = true)
  );

CREATE POLICY "comments_insert_auth"
  ON "comments" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "comments_update_owner"
  ON "comments" FOR UPDATE
  TO authenticated
  USING (
    presentation_id IN (SELECT id FROM "presentations" WHERE user_id = auth.uid())
  );
