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
