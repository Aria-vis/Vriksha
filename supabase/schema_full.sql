-- ====================================================================
-- Vriksha Migration 001: Initial Schema (PostgreSQL + PostGIS)
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  points INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Species Master Taxonomy
CREATE TABLE IF NOT EXISTS species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scientific_name TEXT UNIQUE NOT NULL,
  common_name_en TEXT NOT NULL,
  common_name_hi TEXT NOT NULL,
  plant_type TEXT NOT NULL CHECK (plant_type IN ('large_tree', 'shrub', 'herb', 'grass')),
  use_tags TEXT[] NOT NULL DEFAULT '{}',
  parts_used TEXT[] NOT NULL DEFAULT '{}',
  seasonality_flowering INTEGER[] NOT NULL DEFAULT '{}',
  seasonality_fruiting INTEGER[] NOT NULL DEFAULT '{}',
  seasonality_fresh_leaves INTEGER[] NOT NULL DEFAULT '{}',
  is_toxic BOOLEAN NOT NULL DEFAULT false,
  toxicity_details TEXT,
  is_restricted BOOLEAN NOT NULL DEFAULT false,
  conservation_status TEXT NOT NULL DEFAULT 'least_concern',
  harvesting_etiquette TEXT,
  needs_review BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Species Multilingual Local Names
CREATE TABLE IF NOT EXISTS species_local_names (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL CHECK (language_code IN ('hi', 'sa', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'or')),
  local_name TEXT NOT NULL,
  transliteration TEXT,
  region_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_species_lang_name UNIQUE (species_id, language_code, local_name)
);

-- 5. Plants Table (Physical Instances On Ground)
CREATE TABLE IF NOT EXISTS plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE RESTRICT,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  fuzzed_location GEOGRAPHY(Point, 4326) NOT NULL,
  address_hint TEXT,
  land_type TEXT NOT NULL CHECK (land_type IN ('public', 'temple', 'institution', 'private')),
  private_owner_consent BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'community' CHECK (source IN ('community', 'osm', 'inaturalist', 'gbif', 'falling_fruit')),
  source_id TEXT,
  source_url TEXT,
  license TEXT NOT NULL DEFAULT 'CC BY-SA 4.0',
  attribution TEXT NOT NULL DEFAULT 'Community Contributor',
  imported_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verification_count INTEGER NOT NULL DEFAULT 1,
  gone_report_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'recently_verified' CHECK (status IN ('recently_verified', 'needs_recheck', 'possibly_gone', 'reported_gone')),
  is_sacred_heritage BOOLEAN NOT NULL DEFAULT false,
  heritage_story TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT check_private_consent CHECK (land_type != 'private' OR private_owner_consent = true)
);

-- 6. Plant Photos Table (Timeline)
CREATE TABLE IF NOT EXISTS plant_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  license TEXT NOT NULL DEFAULT 'CC BY-SA 4.0',
  attribution TEXT NOT NULL DEFAULT 'Community Contributor',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Verifications Log ("Still Here")
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL DEFAULT 'still_here' CHECK (verification_type IN ('still_here', 'photo_added', 'details_updated')),
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Reports Table (Flagging & Negative Verification)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('gone', 'wrong_species', 'private_property_violation', 'inappropriate_photo', 'spam')),
  details TEXT,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Festivals Master Calendar
CREATE TABLE IF NOT EXISTS festivals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  description_en TEXT,
  description_hi TEXT,
  typical_month INTEGER CHECK (typical_month BETWEEN 1 AND 12),
  lunar_tithi_desc TEXT,
  next_observed_date DATE NOT NULL,
  region TEXT NOT NULL DEFAULT 'All India',
  needs_local_review BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Festival Plant Checklists
CREATE TABLE IF NOT EXISTS festival_plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_id UUID NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
  species_id UUID NOT NULL REFERENCES species(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  part_needed TEXT NOT NULL,
  alternative_species_ids UUID[] DEFAULT '{}',
  is_essential BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  needs_local_review BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_festival_species UNIQUE (festival_id, species_id)
);

-- 11. Badges & User Badges
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  points_required INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id)
);

-- 12. Requests Board ("Need It / Have It")
CREATE TABLE IF NOT EXISTS requests_board (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('need_it', 'have_it')),
  species_id UUID REFERENCES species(id) ON DELETE SET NULL,
  custom_title TEXT NOT NULL,
  description TEXT,
  fuzzed_location GEOGRAPHY(Point, 4326) NOT NULL,
  locality_name TEXT NOT NULL,
  contact_preference TEXT NOT NULL DEFAULT 'in_app',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Nurseries & Sapling Distribution Points
CREATE TABLE IF NOT EXISTS nurseries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,
  nursery_type TEXT NOT NULL CHECK (nursery_type IN ('commercial', 'free_sapling_point', 'forest_dept', 'ngo')),
  contact_number TEXT,
  available_species_notes TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. Moderation Audit Log
CREATE TABLE IF NOT EXISTS moderation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('plant', 'report', 'festival', 'species', 'photo')),
  target_id UUID NOT NULL,
  reason TEXT,
  previous_state JSONB,
  new_state JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ====================================================================
-- Spatial & Performance Indices
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_plants_location ON plants USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_plants_fuzzed_location ON plants USING GIST (fuzzed_location);
CREATE INDEX IF NOT EXISTS idx_plants_species_id ON plants (species_id);
CREATE INDEX IF NOT EXISTS idx_plants_status ON plants (status);
CREATE INDEX IF NOT EXISTS idx_species_use_tags ON species USING GIN (use_tags);
CREATE INDEX IF NOT EXISTS idx_species_scientific_name ON species (scientific_name);
CREATE INDEX IF NOT EXISTS idx_species_local_names_search ON species_local_names (local_name);
CREATE INDEX IF NOT EXISTS idx_festivals_next_date ON festivals (next_observed_date);
-- ====================================================================
-- Vriksha Migration 002: Freshness Decay Calculation & Spatial Fuzzing
-- ====================================================================

-- 1. Function: calculate_plant_freshness
-- Computes the single source of truth freshness status based on decay windows.
CREATE OR REPLACE FUNCTION calculate_plant_freshness(
  p_last_verified_at TIMESTAMPTZ,
  p_plant_type TEXT,
  p_gone_count INTEGER DEFAULT 0
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_age INTERVAL;
BEGIN
  -- Two independent reports automatically hide the plant
  IF p_gone_count >= 2 THEN
    RETURN 'reported_gone';
  END IF;

  v_age := now() - p_last_verified_at;

  CASE p_plant_type
    WHEN 'large_tree' THEN
      IF v_age <= INTERVAL '18 months' THEN
        RETURN 'recently_verified';
      ELSIF v_age <= INTERVAL '36 months' THEN
        RETURN 'needs_recheck';
      ELSE
        RETURN 'possibly_gone';
      END IF;

    WHEN 'shrub' THEN
      IF v_age <= INTERVAL '6 months' THEN
        RETURN 'recently_verified';
      ELSIF v_age <= INTERVAL '12 months' THEN
        RETURN 'needs_recheck';
      ELSE
        RETURN 'possibly_gone';
      END IF;

    WHEN 'herb', 'grass' THEN
      IF v_age <= INTERVAL '2 months' THEN
        RETURN 'recently_verified';
      ELSIF v_age <= INTERVAL '4 months' THEN
        RETURN 'needs_recheck';
      ELSE
        RETURN 'possibly_gone';
      END IF;

    ELSE
      -- Default fallback for any unspecified plant types
      IF v_age <= INTERVAL '6 months' THEN
        RETURN 'recently_verified';
      ELSIF v_age <= INTERVAL '12 months' THEN
        RETURN 'needs_recheck';
      ELSE
        RETURN 'possibly_gone';
      END IF;
  END CASE;
END;
$$;

-- 2. Trigger Function: auto_fuzz_restricted_location
-- Computes ~5 km grid centroid (0.05 degrees ~ 5.5 km) on insert or location update.
CREATE OR REPLACE FUNCTION trg_auto_fuzz_location()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.location IS NOT NULL THEN
    NEW.fuzzed_location := ST_SnapToGrid(NEW.location::geometry, 0.05)::geography;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_plants_fuzz_location ON plants;
CREATE TRIGGER trg_plants_fuzz_location
BEFORE INSERT OR UPDATE OF location ON plants
FOR EACH ROW
EXECUTE FUNCTION trg_auto_fuzz_location();

-- 3. Trigger Function: handle_new_verification
-- One "still here" confirmation resets the clock and restores recently_verified.
CREATE OR REPLACE FUNCTION trg_handle_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.verification_type = 'still_here' THEN
    UPDATE plants
    SET 
      last_verified_at = NEW.created_at,
      gone_report_count = 0,
      verification_count = verification_count + 1,
      status = 'recently_verified',
      updated_at = now()
    WHERE id = NEW.plant_id;

    -- Award points to user
    UPDATE profiles
    SET points = points + 5
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_verifications_after_insert ON verifications;
CREATE TRIGGER trg_verifications_after_insert
AFTER INSERT ON verifications
FOR EACH ROW
EXECUTE FUNCTION trg_handle_verification();

-- 4. Trigger Function: handle_new_report
-- If 2 distinct users file 'gone' reports, set status = 'reported_gone'.
CREATE OR REPLACE FUNCTION trg_handle_report()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_distinct_gone_reporters INTEGER;
BEGIN
  IF NEW.report_type = 'gone' THEN
    SELECT COUNT(DISTINCT user_id)
    INTO v_distinct_gone_reporters
    FROM reports
    WHERE plant_id = NEW.plant_id AND report_type = 'gone';

    UPDATE plants
    SET 
      gone_report_count = v_distinct_gone_reporters,
      status = CASE 
        WHEN v_distinct_gone_reporters >= 2 THEN 'reported_gone'
        ELSE status
      END,
      updated_at = now()
    WHERE id = NEW.plant_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reports_after_insert ON reports;
CREATE TRIGGER trg_reports_after_insert
AFTER INSERT ON reports
FOR EACH ROW
EXECUTE FUNCTION trg_handle_report();
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
-- ====================================================================
-- Vriksha Migration 004: Spatial PostGIS RPCs & Route Helpers
-- ====================================================================

-- 1. Primary Discovery RPC: nearest_plants
-- Returns plants sorted nearest to farthest, strictly enforcing ~5 km fuzzing for restricted species.
CREATE OR REPLACE FUNCTION nearest_plants(
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_radius_meters DOUBLE PRECISION DEFAULT 15000,
  p_species_id UUID DEFAULT NULL,
  p_query TEXT DEFAULT NULL,
  p_use_tags TEXT[] DEFAULT NULL,
  p_freshness_statuses TEXT[] DEFAULT NULL,
  p_land_types TEXT[] DEFAULT NULL,
  p_in_season_only BOOLEAN DEFAULT FALSE,
  p_limit INTEGER DEFAULT 60
)
RETURNS TABLE (
  id UUID,
  species_id UUID,
  scientific_name TEXT,
  common_name_en TEXT,
  common_name_hi TEXT,
  plant_type TEXT,
  use_tags TEXT[],
  parts_used TEXT[],
  is_toxic BOOLEAN,
  toxicity_details TEXT,
  is_restricted BOOLEAN,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  distance_meters DOUBLE PRECISION,
  address_hint TEXT,
  land_type TEXT,
  status TEXT,
  last_verified_at TIMESTAMPTZ,
  verification_count INTEGER,
  is_sacred_heritage BOOLEAN,
  heritage_story TEXT,
  primary_photo_url TEXT,
  source TEXT,
  attribution TEXT,
  license TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_is_moderator BOOLEAN;
  v_user_pt GEOGRAPHY;
  v_current_month INTEGER;
BEGIN
  -- Verify moderator/admin role via JWT claims
  v_is_moderator := EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  );

  v_user_pt := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography;
  v_current_month := EXTRACT(MONTH FROM now())::INTEGER;

  RETURN QUERY
  SELECT
    p.id,
    p.species_id,
    s.scientific_name,
    s.common_name_en,
    s.common_name_hi,
    s.plant_type,
    s.use_tags,
    s.parts_used,
    s.is_toxic,
    s.toxicity_details,
    s.is_restricted,
    -- CRITICAL PRIVACY: Fuzz coordinates if restricted species unless caller is moderator/admin
    CASE 
      WHEN s.is_restricted AND NOT v_is_moderator THEN ST_Y(p.fuzzed_location::geometry)
      ELSE ST_Y(p.location::geometry)
    END AS lat,
    CASE 
      WHEN s.is_restricted AND NOT v_is_moderator THEN ST_X(p.fuzzed_location::geometry)
      ELSE ST_X(p.location::geometry)
    END AS lng,
    ROUND(ST_Distance(p.location, v_user_pt)::NUMERIC, 1)::DOUBLE PRECISION AS distance_meters,
    p.address_hint,
    p.land_type,
    p.status,
    p.last_verified_at,
    p.verification_count,
    p.is_sacred_heritage,
    p.heritage_story,
    (SELECT ph.photo_url FROM plant_photos ph WHERE ph.plant_id = p.id ORDER BY ph.is_primary DESC, ph.created_at DESC LIMIT 1) AS primary_photo_url,
    p.source,
    p.attribution,
    p.license
  FROM plants p
  JOIN species s ON s.id = p.species_id
  WHERE 
    p.status != 'reported_gone'
    AND ST_DWithin(p.location, v_user_pt, p_radius_meters)
    AND (p_species_id IS NULL OR p.species_id = p_species_id)
    AND (p_freshness_statuses IS NULL OR p.status = ANY(p_freshness_statuses))
    AND (p_land_types IS NULL OR p.land_type = ANY(p_land_types))
    AND (p_use_tags IS NULL OR s.use_tags && p_use_tags)
    AND (
      NOT p_in_season_only OR (
        v_current_month = ANY(s.seasonality_flowering)
        OR v_current_month = ANY(s.seasonality_fruiting)
        OR v_current_month = ANY(s.seasonality_fresh_leaves)
      )
    )
    AND (
      p_query IS NULL 
      OR BTRIM(p_query) = ''
      OR s.common_name_en ILIKE '%' || p_query || '%'
      OR s.common_name_hi ILIKE '%' || p_query || '%'
      OR s.scientific_name ILIKE '%' || p_query || '%'
      OR EXISTS (
        SELECT 1 FROM species_local_names sln 
        WHERE sln.species_id = s.id AND sln.local_name ILIKE '%' || p_query || '%'
      )
    )
  ORDER BY distance_meters ASC
  LIMIT p_limit;
END;
$$;

-- 2. Festival Helper RPC: get_festival_plant_locations
-- For a given festival, returns the top 3 nearest plants for each required checklist species.
CREATE OR REPLACE FUNCTION get_festival_plant_locations(
  p_festival_id UUID,
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION,
  p_radius_meters DOUBLE PRECISION DEFAULT 20000
)
RETURNS TABLE (
  checklist_id UUID,
  species_id UUID,
  common_name_en TEXT,
  common_name_hi TEXT,
  purpose TEXT,
  part_needed TEXT,
  is_essential BOOLEAN,
  plant_id UUID,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  distance_meters DOUBLE PRECISION,
  land_type TEXT,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH RankedPlants AS (
    SELECT
      fp.id AS r_checklist_id,
      fp.species_id AS r_species_id,
      s.common_name_en AS r_common_name_en,
      s.common_name_hi AS r_common_name_hi,
      fp.purpose AS r_purpose,
      fp.part_needed AS r_part_needed,
      fp.is_essential AS r_is_essential,
      p.id AS r_plant_id,
      ST_Y(p.location::geometry) AS r_lat,
      ST_X(p.location::geometry) AS r_lng,
      ROUND(ST_Distance(p.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography)::NUMERIC, 1)::DOUBLE PRECISION AS r_distance_meters,
      p.land_type AS r_land_type,
      p.status AS r_status,
      ROW_NUMBER() OVER(PARTITION BY fp.id ORDER BY ST_Distance(p.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography) ASC) as rank
    FROM festival_plants fp
    JOIN species s ON s.id = fp.species_id
    JOIN plants p ON p.species_id = fp.species_id
    WHERE 
      fp.festival_id = p_festival_id
      AND p.status != 'reported_gone'
      AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography, p_radius_meters)
  )
  SELECT 
    r_checklist_id,
    r_species_id,
    r_common_name_en,
    r_common_name_hi,
    r_purpose,
    r_part_needed,
    r_is_essential,
    r_plant_id,
    r_lat,
    r_lng,
    r_distance_meters,
    r_land_type,
    r_status
  FROM RankedPlants
  WHERE rank <= 3
  ORDER BY r_checklist_id, rank;
END;
$$;
