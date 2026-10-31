import { supabase, isMockClient } from '../lib/supabase';
import { PlantSearchResult, PlantFilters, Species } from '../types/plant';
import { computeFreshnessStatus } from '../config/freshness';
import type { SeedPlantItem } from '../../scripts/data/demo-plants-data';
import type { SeedFestivalItem } from '../../scripts/data/festival-data';

// In-memory cache for mock database
let mockDbCache: {
  species: Species[];
  plants: SeedPlantItem[];
  festivals: SeedFestivalItem[];
} | null = null;


async function loadMockDb() {
  if (mockDbCache) return mockDbCache;

  // In browser with live origin, load static mock-db.json
  if (typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null') {
    try {
      const res = await fetch('/data/mock-db.json');
      if (res.ok) {
        mockDbCache = await res.json();
        return mockDbCache;
      }
    } catch {
      // Continue to bundled memory seed fallback
    }
  }

  // Node environment or offline fallback: import from scripts/data
  const { SEED_SPECIES } = await import('../../scripts/data/species-data');
  const { SEED_DEMO_PLANTS } = await import('../../scripts/data/demo-plants-data');
  const { SEED_FESTIVALS } = await import('../../scripts/data/festival-data');
  mockDbCache = {
    species: SEED_SPECIES.map((s, index) => ({
      id: `00000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
      ...s,
    })),
    plants: SEED_DEMO_PLANTS,
    festivals: SEED_FESTIVALS,
  };
  return mockDbCache;
}


/**
 * Calculates Haversine distance in meters between two coordinates.
 */
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Fetches nearest plants using Supabase PostGIS RPC, with seamless offline fallback.
 */
export async function fetchNearestPlants(
  lat: number,
  lng: number,
  filters: PlantFilters = {},
  isModerator: boolean = false
): Promise<PlantSearchResult[]> {
  const radiusMeters = filters.radiusMeters ?? filters.radius_meters ?? 25000;
  const currentMonth = new Date().getMonth() + 1;

  if (!isMockClient) {
    try {
      type RpcCaller = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
      const { data, error } = await (supabase.rpc as unknown as RpcCaller)('nearest_plants', {
        p_lat: lat,
        p_lng: lng,
        p_radius_meters: radiusMeters,
        p_query: filters.query || null,
        p_use_tags: filters.use_tags && filters.use_tags.length > 0 ? filters.use_tags : null,
        p_freshness_statuses: filters.freshness_statuses && filters.freshness_statuses.length > 0 ? filters.freshness_statuses : null,
        p_land_types: filters.land_types && filters.land_types.length > 0 ? filters.land_types : null,
        p_in_season_only: filters.in_season_only ?? false,
        p_limit: 60,
      });



      if (!error && data) {
        return data as PlantSearchResult[];
      }
      console.warn('Supabase RPC error, falling back to local dataset:', error);
    } catch (e) {
      console.warn('Supabase RPC exception, using offline dataset:', e);
    }
  }

  // Local/Offline mock dataset filtering
  const db = await loadMockDb();
  if (!db) return [];

  const results: PlantSearchResult[] = [];

  for (const p of db.plants) {
    const sp = db.species.find((s) => s.scientific_name === p.species_scientific_name);
    if (!sp) continue;

    // Distance calculation
    const distance = calculateDistanceMeters(lat, lng, p.lat, p.lng);
    if (distance > radiusMeters) continue;

    // Filter by query (English, Hindi, Scientific, or vernacular synonyms)
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      const matchEn = sp.common_name_en.toLowerCase().includes(q);
      const matchHi = sp.common_name_hi.toLowerCase().includes(q);
      const matchSci = sp.scientific_name.toLowerCase().includes(q);
      const matchLocal = sp.local_names?.some((ln) => ln.local_name.toLowerCase().includes(q));

      if (!matchEn && !matchHi && !matchSci && !matchLocal) {
        continue;
      }
    }

    // Filter by use tags
    if (filters.use_tags && filters.use_tags.length > 0) {
      const hasTag = filters.use_tags.some((t) => sp.use_tags.includes(t));
      if (!hasTag) continue;
    }

    // Filter by freshness status
    const currentStatus = computeFreshnessStatus(p.last_verified_at, sp.plant_type);
    if (currentStatus === 'reported_gone') continue; // Hide reported gone

    if (filters.freshness_statuses && filters.freshness_statuses.length > 0) {
      if (!filters.freshness_statuses.includes(currentStatus)) continue;
    }

    // Filter by land type
    if (filters.land_types && filters.land_types.length > 0) {
      if (!filters.land_types.includes(p.land_type)) continue;
    }

    // Filter by in season
    if (filters.in_season_only) {
      const inSeason =
        sp.seasonality_flowering.includes(currentMonth) ||
        sp.seasonality_fruiting.includes(currentMonth) ||
        sp.seasonality_fresh_leaves.includes(currentMonth);
      if (!inSeason) continue;
    }

    // CRITICAL SPATIAL PRIVACY:
    // If species is restricted and caller is not moderator, return fuzzed coordinate!
    const effectiveLat = sp.is_restricted && !isModerator ? p.fuzzed_lat : p.lat;
    const effectiveLng = sp.is_restricted && !isModerator ? p.fuzzed_lng : p.lng;

    results.push({
      id: p.id,
      species_id: sp.id,
      scientific_name: sp.scientific_name,
      common_name_en: sp.common_name_en,
      common_name_hi: sp.common_name_hi,
      plant_type: sp.plant_type,
      use_tags: sp.use_tags,
      parts_used: sp.parts_used,
      is_toxic: sp.is_toxic,
      toxicity_details: sp.toxicity_details,
      is_restricted: sp.is_restricted,
      lat: effectiveLat,
      lng: effectiveLng,
      distance_meters: distance,
      address_hint: p.address_hint,
      land_type: p.land_type,
      status: currentStatus,
      last_verified_at: p.last_verified_at,
      verification_count: 1,
      is_sacred_heritage: p.is_sacred_heritage,
      heritage_story: p.heritage_story || null,
      primary_photo_url: p.primary_photo_url || null,
      source: p.source,
      attribution: p.attribution,
      license: p.license,
    });
  }

  // Sort nearest first
  results.sort((a, b) => a.distance_meters - b.distance_meters);
  return results;
}

/**
 * Loads the complete master species list for search autocomplete and species picker.
 */
export async function fetchAllSpecies(): Promise<Species[]> {
  const db = await loadMockDb();
  return db?.species ?? [];
}
