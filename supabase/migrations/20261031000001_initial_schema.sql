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
