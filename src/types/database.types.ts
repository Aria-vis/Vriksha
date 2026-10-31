export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlantType = 'large_tree' | 'shrub' | 'herb' | 'grass';
export type LandType = 'public' | 'temple' | 'institution' | 'private';
export type FreshnessStatus = 'recently_verified' | 'needs_recheck' | 'possibly_gone' | 'reported_gone';
export type UserRole = 'user' | 'moderator' | 'admin';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          role: UserRole;
          points: number;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          role?: UserRole;
          points?: number;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          role?: UserRole;
          points?: number;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      species: {
        Row: {
          id: string;
          scientific_name: string;
          common_name_en: string;
          common_name_hi: string;
          plant_type: PlantType;
          use_tags: string[];
          parts_used: string[];
          seasonality_flowering: number[];
          seasonality_fruiting: number[];
          seasonality_fresh_leaves: number[];
          is_toxic: boolean;
          toxicity_details: string | null;
          is_restricted: boolean;
          conservation_status: string;
          harvesting_etiquette: string | null;
          needs_review: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scientific_name: string;
          common_name_en: string;
          common_name_hi: string;
          plant_type: PlantType;
          use_tags?: string[];
          parts_used?: string[];
          seasonality_flowering?: number[];
          seasonality_fruiting?: number[];
          seasonality_fresh_leaves?: number[];
          is_toxic?: boolean;
          toxicity_details?: string | null;
          is_restricted?: boolean;
          conservation_status?: string;
          harvesting_etiquette?: string | null;
          needs_review?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          scientific_name?: string;
          common_name_en?: string;
          common_name_hi?: string;
          plant_type?: PlantType;
          use_tags?: string[];
          parts_used?: string[];
          seasonality_flowering?: number[];
          seasonality_fruiting?: number[];
          seasonality_fresh_leaves?: number[];
          is_toxic?: boolean;
          toxicity_details?: string | null;
          is_restricted?: boolean;
          conservation_status?: string;
          harvesting_etiquette?: string | null;
          needs_review?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      species_local_names: {
        Row: {
          id: string;
          species_id: string;
          language_code: string;
          local_name: string;
          transliteration: string | null;
          region_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          species_id: string;
          language_code: string;
          local_name: string;
          transliteration?: string | null;
          region_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          species_id?: string;
          language_code?: string;
          local_name?: string;
          transliteration?: string | null;
          region_notes?: string | null;
          created_at?: string;
        };
      };
      plants: {
        Row: {
          id: string;
          species_id: string;
          address_hint: string | null;
          land_type: LandType;
          private_owner_consent: boolean;
          notes: string | null;
          source: string;
          source_id: string | null;
          source_url: string | null;
          license: string;
          attribution: string;
          imported_at: string | null;
          last_verified_at: string;
          verification_count: number;
          gone_report_count: number;
          status: FreshnessStatus;
          is_sacred_heritage: boolean;
          heritage_story: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          species_id: string;
          address_hint?: string | null;
          land_type: LandType;
          private_owner_consent?: boolean;
          notes?: string | null;
          source?: string;
          source_id?: string | null;
          source_url?: string | null;
          license?: string;
          attribution?: string;
          imported_at?: string | null;
          last_verified_at?: string;
          verification_count?: number;
          gone_report_count?: number;
          status?: FreshnessStatus;
          is_sacred_heritage?: boolean;
          heritage_story?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          species_id?: string;
          address_hint?: string | null;
          land_type?: LandType;
          private_owner_consent?: boolean;
          notes?: string | null;
          source?: string;
          source_id?: string | null;
          source_url?: string | null;
          license?: string;
          attribution?: string;
          imported_at?: string | null;
          last_verified_at?: string;
          verification_count?: number;
          gone_report_count?: number;
          status?: FreshnessStatus;
          is_sacred_heritage?: boolean;
          heritage_story?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      festivals: {
        Row: {
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
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_en: string;
          name_hi: string;
          description_en?: string | null;
          description_hi?: string | null;
          typical_month?: number | null;
          lunar_tithi_desc?: string | null;
          next_observed_date: string;
          region?: string;
          needs_local_review?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_en?: string;
          name_hi?: string;
          description_en?: string | null;
          description_hi?: string | null;
          typical_month?: number | null;
          lunar_tithi_desc?: string | null;
          next_observed_date?: string;
          region?: string;
          needs_local_review?: boolean;
          created_at?: string;
        };
      };
      festival_plants: {
        Row: {
          id: string;
          festival_id: string;
          species_id: string;
          purpose: string;
          part_needed: string;
          alternative_species_ids: string[];
          is_essential: boolean;
          notes: string | null;
          needs_local_review: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          festival_id: string;
          species_id: string;
          purpose: string;
          part_needed: string;
          alternative_species_ids?: string[];
          is_essential?: boolean;
          notes?: string | null;
          needs_local_review?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          festival_id?: string;
          species_id?: string;
          purpose?: string;
          part_needed?: string;
          alternative_species_ids?: string[];
          is_essential?: boolean;
          notes?: string | null;
          needs_local_review?: boolean;
          created_at?: string;
        };
      };
    };
    Functions: {
      nearest_plants: {
        Args: {
          p_lat: number;
          p_lng: number;
          p_radius_meters?: number;
          p_species_id?: string | null;
          p_query?: string | null;
          p_use_tags?: string[] | null;
          p_freshness_statuses?: string[] | null;
          p_land_types?: string[] | null;
          p_in_season_only?: boolean;
          p_limit?: number;
        };
        Returns: {
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
        }[];
      };
      get_festival_plant_locations: {
        Args: {
          p_festival_id: string;
          p_lat: number;
          p_lng: number;
          p_radius_meters?: number;
        };
        Returns: {
          checklist_id: string;
          species_id: string;
          common_name_en: string;
          common_name_hi: string;
          purpose: string;
          part_needed: string;
          is_essential: boolean;
          plant_id: string;
          lat: number;
          lng: number;
          distance_meters: number;
          land_type: LandType;
          status: FreshnessStatus;
        }[];
      };
    };
  };
}
