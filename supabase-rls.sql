-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Users: can read/update own row
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Presentations: owner can CRUD, collaborators can read
CREATE POLICY "presentations_select_own" ON presentations
  FOR SELECT USING (
    user_id = auth.uid()
    OR is_public = true
    OR id IN (SELECT presentation_id FROM collaborators WHERE user_id = auth.uid())
  );

CREATE POLICY "presentations_insert_own" ON presentations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "presentations_update_own" ON presentations
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "presentations_delete_own" ON presentations
  FOR DELETE USING (user_id = auth.uid());

-- Slides: accessible if user owns the presentation or is collaborator
CREATE POLICY "slides_select" ON slides
  FOR SELECT USING (
    presentation_id IN (
      SELECT id FROM presentations
      WHERE user_id = auth.uid()
        OR is_public = true
        OR id IN (SELECT presentation_id FROM collaborators WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "slides_insert" ON slides
  FOR INSERT WITH CHECK (
    presentation_id IN (SELECT id FROM presentations WHERE user_id = auth.uid())
  );

CREATE POLICY "slides_update" ON slides
  FOR UPDATE USING (
    presentation_id IN (
      SELECT id FROM presentations
      WHERE user_id = auth.uid()
        OR id IN (SELECT presentation_id FROM collaborators WHERE user_id = auth.uid() AND role = 'editor')
    )
  );

CREATE POLICY "slides_delete" ON slides
  FOR DELETE USING (
    presentation_id IN (SELECT id FROM presentations WHERE user_id = auth.uid())
  );

-- Collaborators: owner of presentation can manage
CREATE POLICY "collaborators_select" ON collaborators
  FOR SELECT USING (
    user_id = auth.uid()
    OR presentation_id IN (SELECT id FROM presentations WHERE user_id = auth.uid())
  );

CREATE POLICY "collaborators_insert" ON collaborators
  FOR INSERT WITH CHECK (
    presentation_id IN (SELECT id FROM presentations WHERE user_id = auth.uid())
  );

CREATE POLICY "collaborators_delete" ON collaborators
  FOR DELETE USING (
    presentation_id IN (SELECT id FROM presentations WHERE user_id = auth.uid())
  );
