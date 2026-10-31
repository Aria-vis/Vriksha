-- ====================================================================
-- SQL Test Suite: RLS & Restricted Species Privacy Verification
-- ====================================================================
BEGIN;

-- 1. Create a dummy test species (restricted: Sandalwood)
INSERT INTO species (
  id, scientific_name, common_name_en, common_name_hi, plant_type, is_restricted
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Santalum album test',
  'Sandalwood Test',
  'चंदन टेस्ट',
  'large_tree',
  true
);

-- 2. Insert plant with exact coordinate at New Delhi (28.6139, 77.2090)
INSERT INTO plants (
  id,
  species_id,
  location,
  fuzzed_location,
  land_type,
  source
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326)::geography,
  ST_SnapToGrid(ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326)::geometry, 0.05)::geography,
  'public',
  'community'
);

-- 3. Verify that nearest_plants() returns the FUZZED coordinate, NOT exact coordinate
DO $$
DECLARE
  v_rec RECORD;
  v_exact_lat DOUBLE PRECISION := 28.6139;
  v_exact_lng DOUBLE PRECISION := 77.2090;
BEGIN
  -- Call nearest_plants as anonymous/non-moderator
  SELECT lat, lng, is_restricted
  INTO v_rec
  FROM nearest_plants(28.6139, 77.2090, 50000, '11111111-1111-1111-1111-111111111111');

  -- Assert species is restricted
  IF v_rec.is_restricted IS NOT TRUE THEN
    RAISE EXCEPTION 'Assertion Failed: Species should be restricted';
  END IF;

  -- Assert exact coordinates are NOT returned
  IF (v_rec.lat = v_exact_lat AND v_rec.lng = v_exact_lng) THEN
    RAISE EXCEPTION 'CRITICAL PRIVACY VIOLATION: Exact coordinates of restricted species were returned!';
  END IF;

  RAISE NOTICE 'SUCCESS: Restricted species coordinates are properly fuzzed (lat: %, lng: %)', v_rec.lat, v_rec.lng;
END $$;

-- 4. Verify Private Property constraint prevents insert without explicit consent
DO $$
BEGIN
  BEGIN
    INSERT INTO plants (
      species_id,
      location,
      fuzzed_location,
      land_type,
      private_owner_consent
    ) VALUES (
      '11111111-1111-1111-1111-111111111111',
      ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326)::geography,
      ST_SetSRID(ST_MakePoint(77.2000, 28.6100), 4326)::geography,
      'private',
      false -- Invalid: Private land MUST have consent = true
    );
    RAISE EXCEPTION 'Assertion Failed: Private property without consent was erroneously allowed!';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'SUCCESS: Private property constraint successfully blocked insert without explicit consent.';
  END;
END $$;

ROLLBACK;
