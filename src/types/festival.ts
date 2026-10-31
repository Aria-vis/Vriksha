import { LandType, FreshnessStatus } from './database.types';

export interface Festival {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string;
  description_en: string | null;
  description_hi: string | null;
  typical_month: number | null;
  lunar_tithi_desc: string | null;
  next_observed_date: string;
  region: string;
  needs_local_review: boolean;
}

export interface FestivalChecklistItem {
  id: string;
  festival_id: string;
  species_id: string;
  common_name_en: string;
  common_name_hi: string;
  purpose: string;
  part_needed: string;
  is_essential: boolean;
  notes?: string | null;
  needs_local_review: boolean;
  nearby_plants?: NearbyPlantForChecklist[];
}

export interface NearbyPlantForChecklist {
  plant_id: string;
  lat: number;
  lng: number;
  distance_meters: number;
  land_type: LandType;
  status: FreshnessStatus;
}

export interface TripStop {
  stop_number: number;
  checklist_id: string;
  species_id: string;
  species_name: string;
  purpose: string;
  part_needed: string;
  plant_id: string;
  lat: number;
  lng: number;
  distance_from_previous_meters: number;
  cumulative_distance_meters: number;
}

export interface PlannedTrip {
  festival_id: string;
  festival_name: string;
  stops: TripStop[];
  total_distance_meters: number;
  estimated_duration_minutes: number;
}
