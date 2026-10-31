import { PlantType, LandType, FreshnessStatus } from './database.types';

export type { PlantType, LandType, FreshnessStatus };

export type UseTag = 
  | 'puja'
  | 'medicinal'
  | 'fruit'
  | 'shade'
  | 'flowers'
  | 'leaves_decoration'
  | 'edible';

export interface SpeciesLocalName {
  language_code: string;
  local_name: string;
  transliteration?: string | null;
  region_notes?: string | null;
}

export interface Species {
  id: string;
  scientific_name: string;
  common_name_en: string;
  common_name_hi: string;
  plant_type: PlantType;
  use_tags: UseTag[];
  parts_used: string[];
  seasonality_flowering: number[]; // 1-12
  seasonality_fruiting: number[];  // 1-12
  seasonality_fresh_leaves: number[]; // 1-12
  is_toxic: boolean;
  toxicity_details: string | null;
  is_restricted: boolean;
  conservation_status: string;
  harvesting_etiquette: string | null;
  needs_review: boolean;
  local_names?: SpeciesLocalName[];
}

export interface PlantSearchResult {
  id: string;
  species_id: string;
  scientific_name: string;
  common_name_en: string;
  common_name_hi: string;
  plant_type: PlantType;
  use_tags: string[];
  parts_used: string[];
  is_toxic: boolean;
  toxicity_details: string | null;
  is_restricted: boolean;
  lat: number;
  lng: number;
  distance_meters: number;
  address_hint: string | null;
  land_type: LandType;
  status: FreshnessStatus;
  last_verified_at: string;
  verification_count: number;
  is_sacred_heritage: boolean;
  heritage_story: string | null;
  primary_photo_url: string | null;
  source: string;
  attribution: string;
  license: string;
}

export interface PlantFilters {
  query?: string;
  use_tags?: UseTag[];
  freshness_statuses?: FreshnessStatus[];
  land_types?: LandType[];
  in_season_only?: boolean;
  radius_meters?: number;
}
