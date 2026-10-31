-- ====================================================================
-- Vriksha Migration 003: Row Level Security (RLS) Policies
-- ====================================================================

-- 1. Enable RLS on every table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE species_local_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE festival_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests_board ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurseries ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

-- 2. Helper functions for role checks
CREATE OR REPLACE FUNCTION is_moderator()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  );
$$;

-- 3. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Species & Local Names Policies
CREATE POLICY "Species taxonomy is viewable by everyone"
  ON species FOR SELECT
  USING (true);

CREATE POLICY "Only moderators can insert or modify species"
  ON species FOR ALL
  USING (is_moderator())
  WITH CHECK (is_moderator());

CREATE POLICY "Species local names are viewable by everyone"
  ON species_local_names FOR SELECT
  USING (true);

CREATE POLICY "Only moderators can modify species local names"
  ON species_local_names FOR ALL
  USING (is_moderator())
  WITH CHECK (is_moderator());

-- 5. Plants Table Policies (CRITICAL PRIVACY SHIELD)
-- Standard users can read plants that are NOT restricted.
-- Restricted species exact coordinates can ONLY be read directly by moderators/admins.
-- (Public queries for restricted species use the nearest_plants RPC which returns fuzzed coordinates).
CREATE POLICY "Public read for non-restricted plants"
  ON plants FOR SELECT
  USING (
    status != 'reported_gone'
    AND (
      NOT EXISTS (SELECT 1 FROM species s WHERE s.id = plants.species_id AND s.is_restricted = true)
      OR is_moderator()
    )
  );

CREATE POLICY "Authenticated users can add plants"
  ON plants FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (land_type != 'private' OR private_owner_consent = true)
  );

CREATE POLICY "Creators and moderators can update plants"
  ON plants FOR UPDATE
  USING (auth.uid() = created_by OR is_moderator())
  WITH CHECK (auth.uid() = created_by OR is_moderator());

-- 6. Plant Photos Policies
CREATE POLICY "Plant photos are viewable by everyone"
  ON plant_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload photos"
  ON plant_photos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 7. Verifications Policies
CREATE POLICY "Verifications are viewable by everyone"
  ON verifications FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can verify plants"
  ON verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 8. Reports Policies
CREATE POLICY "Users can view their own reports or moderators view all"
  ON reports FOR SELECT
  USING (auth.uid() = user_id OR is_moderator());

CREATE POLICY "Authenticated users can submit reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Moderators can update reports"
  ON reports FOR UPDATE
  USING (is_moderator())
  WITH CHECK (is_moderator());

-- 9. Festivals & Festival Plants Policies
CREATE POLICY "Festivals are viewable by everyone"
  ON festivals FOR SELECT
  USING (true);

CREATE POLICY "Festival plants are viewable by everyone"
  ON festival_plants FOR SELECT
  USING (true);

CREATE POLICY "Moderators can manage festivals"
  ON festivals FOR ALL
  USING (is_moderator())
  WITH CHECK (is_moderator());

CREATE POLICY "Moderators can manage festival plants"
  ON festival_plants FOR ALL
  USING (is_moderator())
  WITH CHECK (is_moderator());

-- 10. Badges Policies
CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (true);

CREATE POLICY "User badges are viewable by everyone"
  ON user_badges FOR SELECT
  USING (true);

-- 11. Requests Board Policies
CREATE POLICY "Active requests are viewable by everyone"
  ON requests_board FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id OR is_moderator());

CREATE POLICY "Authenticated users can create requests"
  ON requests_board FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests"
  ON requests_board FOR UPDATE
  USING (auth.uid() = user_id OR is_moderator())
  WITH CHECK (auth.uid() = user_id OR is_moderator());

-- 12. Nurseries Policies
CREATE POLICY "Nurseries are viewable by everyone"
  ON nurseries FOR SELECT
  USING (true);

CREATE POLICY "Moderators can manage nurseries"
  ON nurseries FOR ALL
  USING (is_moderator())
  WITH CHECK (is_moderator());

-- 13. Moderation Log Policies
CREATE POLICY "Moderation log is viewable only by moderators"
  ON moderation_log FOR SELECT
  USING (is_moderator());

CREATE POLICY "Moderators can insert moderation logs"
  ON moderation_log FOR INSERT
  WITH CHECK (is_moderator());
