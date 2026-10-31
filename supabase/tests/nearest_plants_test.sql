-- ====================================================================
-- SQL Test Suite: Spatial Proximity & Freshness Decay Test
-- ====================================================================
BEGIN;

-- 1. Create dummy species: Neem (large tree)
INSERT INTO species (
  id, scientific_name, common_name_en, common_name_hi, plant_type, use_tags
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Azadirachta indica test',
  'Neem Test',
  'नीम टेस्ट',
  'large_tree',
  ARRAY['medicinal', 'puja']
);

-- 2. Insert two plants: One near (500m), one far (25km)
INSERT INTO plants (
  id, species_id, location, fuzzed_location, land_type, last_verified_at, status
) VALUES 
(
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  ST_SetSRID(ST_MakePoint(77.2100, 28.6150), 4326)::geography, -- ~500m away
  ST_SetSRID(ST_MakePoint(77.2000, 28.6000), 4326)::geography,
  'public',
  now(),
  'recently_verified'
),
(
  '55555555-5555-5555-5555-555555555555',
  '33333333-3333-3333-3333-333333333333',
  ST_SetSRID(ST_MakePoint(77.4000, 28.6150), 4326)::geography, -- ~20km away
  ST_SetSRID(ST_MakePoint(77.4000, 28.6000), 4326)::geography,
  'public',
  now(),
  'recently_verified'
);

-- 3. Assert radius filter: A 5km query should return ONLY the near plant
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM nearest_plants(28.6139, 77.2090, 5000, '33333333-3333-3333-3333-333333333333');

  IF v_count != 1 THEN
    RAISE EXCEPTION 'Assertion Failed: Expected 1 plant within 5km radius, found %', v_count;
  END IF;

  RAISE NOTICE 'SUCCESS: Spatial radius filter accurately excluded distant plant.';
END $$;

-- 4. Assert Freshness calculation function
DO $$
BEGIN
  -- Large tree: 5 months old -> recently_verified
  IF calculate_plant_freshness(now() - INTERVAL '5 months', 'large_tree', 0) != 'recently_verified' THEN
    RAISE EXCEPTION 'Assertion Failed: Large tree at 5 months should be recently_verified';
  END IF;

  -- Large tree: 24 months old -> needs_recheck
  IF calculate_plant_freshness(now() - INTERVAL '24 months', 'large_tree', 0) != 'needs_recheck' THEN
    RAISE EXCEPTION 'Assertion Failed: Large tree at 24 months should be needs_recheck';
  END IF;

  -- Large tree: 40 months old -> possibly_gone
  IF calculate_plant_freshness(now() - INTERVAL '40 months', 'large_tree', 0) != 'possibly_gone' THEN
    RAISE EXCEPTION 'Assertion Failed: Large tree at 40 months should be possibly_gone';
  END IF;

  -- Herb/grass: 3 months old -> needs_recheck
  IF calculate_plant_freshness(now() - INTERVAL '3 months', 'grass', 0) != 'needs_recheck' THEN
    RAISE EXCEPTION 'Assertion Failed: Grass at 3 months should be needs_recheck';
  END IF;

  -- Dual gone reports -> reported_gone
  IF calculate_plant_freshness(now(), 'large_tree', 2) != 'reported_gone' THEN
    RAISE EXCEPTION 'Assertion Failed: 2 gone reports should be reported_gone';
  END IF;

  RAISE NOTICE 'SUCCESS: Freshness calculation function passed all decay window assertions.';
END $$;

ROLLBACK;
