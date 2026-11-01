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
    if (p.status === 'reported_gone') continue; // Hide reported gone
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

export interface AddPlantInput {
  species_id?: string;
  lat: number;
  lng: number;
  land_type: 'public' | 'temple' | 'institution' | 'private';
  address_hint?: string;
  notes?: string;
  private_owner_consent?: boolean;
  photo_data_url?: string;
}

/**
 * Adds a new plant submission to Supabase or the local mock database.
 */
export async function addPlant(input: AddPlantInput): Promise<PlantSearchResult> {
  const db = await loadMockDb();
  const speciesList = db?.species ?? [];
  const fallbackSpecies: Species = speciesList[0] || {
    id: '00000000-0000-0000-0000-000000000001',
    scientific_name: 'Azadirachta indica',
    common_name_en: 'Neem',
    common_name_hi: 'नीम',
    plant_type: 'large_tree',
    use_tags: ['puja', 'medicinal', 'shade'],
    parts_used: ['leaves', 'twigs', 'bark'],
    is_toxic: false,
    toxicity_details: null,
    is_restricted: false,
    conservation_status: 'least_concern',
    harvesting_etiquette: null,
    needs_review: false,
    seasonality_flowering: [3, 4, 5],
    seasonality_fruiting: [5, 6, 7],
    seasonality_fresh_leaves: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  };

  const matchedSpecies = (input.species_id ? speciesList.find((s) => s.id === input.species_id) : undefined) || fallbackSpecies;

  // In production Supabase
  if (!isMockClient) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('plants') as any)
        .insert({
          species_id: matchedSpecies.id,
          location: `POINT(${input.lng} ${input.lat})`,
          land_type: input.land_type,
          address_hint: input.address_hint || null,
          private_owner_consent: input.land_type === 'private' ? (input.private_owner_consent ?? false) : false,
          notes: input.notes || null,
          source: 'community',
          attribution: 'Community Contributor',
          license: 'CC BY-SA 4.0',
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          species_id: matchedSpecies.id,
          scientific_name: matchedSpecies.scientific_name,
          common_name_en: matchedSpecies.common_name_en,
          common_name_hi: matchedSpecies.common_name_hi,
          plant_type: matchedSpecies.plant_type,
          use_tags: matchedSpecies.use_tags,
          parts_used: matchedSpecies.parts_used,
          is_toxic: matchedSpecies.is_toxic,
          toxicity_details: matchedSpecies.toxicity_details,
          lat: input.lat,
          lng: input.lng,
          distance_meters: 0,
          address_hint: input.address_hint || null,
          land_type: input.land_type,
          status: 'recently_verified',
          last_verified_at: new Date().toISOString(),
          verification_count: 1,
          is_sacred_heritage: false,
          heritage_story: null,
          is_restricted: matchedSpecies.is_restricted,
          primary_photo_url: input.photo_data_url || null,
          source: 'community',
          attribution: 'Community Contributor',
          license: 'CC BY-SA 4.0',
        };
      }
    } catch (e) {
      console.warn('Supabase insert failed, applying to local store:', e);
    }
  }

  // Local/Offline fallback:
  const newPlantId = `pl-usr-${Date.now()}`;
  const fuzzedLat = Math.round(input.lat * 20) / 20;
  const fuzzedLng = Math.round(input.lng * 20) / 20;

  const newSeedPlant: SeedPlantItem = {
    id: newPlantId,
    species_scientific_name: matchedSpecies.scientific_name,
    cityName: 'Varanasi',
    lat: input.lat,
    lng: input.lng,
    fuzzed_lat: fuzzedLat,
    fuzzed_lng: fuzzedLng,
    land_type: input.land_type,
    private_owner_consent: input.land_type === 'private' ? (input.private_owner_consent ?? false) : false,
    notes: input.notes || '',
    address_hint: input.address_hint || 'Community added plant',
    last_verified_at: new Date().toISOString(),
    status: 'recently_verified',
    primary_photo_url: input.photo_data_url || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop',
    source: 'community',
    attribution: 'Community Contributor',
    license: 'CC BY-SA 4.0',
    is_sacred_heritage: false,
    heritage_story: undefined,
  };

  if (db) {
    db.plants.unshift(newSeedPlant);
  }

  return {
    id: newPlantId,
    species_id: matchedSpecies.id,
    scientific_name: matchedSpecies.scientific_name,
    common_name_en: matchedSpecies.common_name_en,
    common_name_hi: matchedSpecies.common_name_hi,
    plant_type: matchedSpecies.plant_type,
    use_tags: matchedSpecies.use_tags,
    parts_used: matchedSpecies.parts_used,
    is_toxic: matchedSpecies.is_toxic,
    toxicity_details: matchedSpecies.toxicity_details,
    lat: input.lat,
    lng: input.lng,
    distance_meters: 0,
    address_hint: input.address_hint || null,
    land_type: input.land_type,
    status: 'recently_verified',
    last_verified_at: new Date().toISOString(),
    verification_count: 1,
    is_sacred_heritage: false,
    heritage_story: null,
    is_restricted: matchedSpecies.is_restricted,
    primary_photo_url: newSeedPlant.primary_photo_url || null,
    source: 'community',
    attribution: 'Community Contributor',
    license: 'CC BY-SA 4.0',
  };
}

/**
 * Records a "still here" ground truth verification.
 */
export async function verifyPlant(
  plantId: string,
  verificationType: 'still_here',
  userLat?: number,
  userLng?: number
): Promise<{ success: boolean }> {
  if (!isMockClient) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('verifications') as any).insert({
        plant_id: plantId,
        verification_type: verificationType,
        user_lat: userLat || null,
        user_lng: userLng || null,
      });
      return { success: true };
    } catch (e) {
      console.warn('Supabase verification insert error:', e);
    }
  }

  const db = await loadMockDb();
  if (db) {
    const p = db.plants.find((plant) => plant.id === plantId);
    if (p) {
      p.last_verified_at = new Date().toISOString();
    }
  }
  return { success: true };
}

/**
 * Records a report (such as "it's gone", "wrong species", etc.).
 */
export async function reportPlant(
  plantId: string,
  reportType: 'gone' | 'wrong_species' | 'spam' | 'private_property_violation',
  details?: string
): Promise<{ success: boolean; newStatus?: string }> {
  if (!isMockClient) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('reports') as any).insert({
        plant_id: plantId,
        report_type: reportType,
        details: details || null,
      });
      return { success: true };
    } catch (e) {
      console.warn('Supabase report error:', e);
    }
  }

  const db = await loadMockDb();
  if (db) {
    const p = db.plants.find((plant) => plant.id === plantId);
    if (p && reportType === 'gone') {
      // Mock negative verification: mark as reported_gone
      p.status = 'reported_gone';
      p.last_verified_at = '2020-01-01T00:00:00Z';
      return { success: true, newStatus: 'reported_gone' };
    }
  }
  return { success: true };
}

export const plantsApi = {
  fetchNearestPlants,
  fetchAllSpecies,
  addPlant,
  verifyPlant,
  reportPlant,
  calculateDistanceMeters,
};
