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
