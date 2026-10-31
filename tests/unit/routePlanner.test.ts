import { describe, it, expect } from 'vitest';
import {
  optimizeCollectionRoute,
  buildGoogleMapsRouteUrl,
  CandidateChecklistItem,
} from '../../src/lib/routePlanner';
import { PlantSearchResult } from '../../src/types/plant';

function createMockPlant(
  id: string,
  scientific: string,
  commonEn: string,
  lat: number,
  lng: number
): PlantSearchResult {
  return {
    id,
    species_id: `sp-${id}`,
    scientific_name: scientific,
    common_name_en: commonEn,
    common_name_hi: commonEn,
    plant_type: 'large_tree',
    use_tags: ['puja'],
    parts_used: ['leaves'],
    is_toxic: false,
    toxicity_details: null,
    is_restricted: false,
    lat,
    lng,
    distance_meters: 100,
    address_hint: null,
    land_type: 'public',
    status: 'recently_verified',
    last_verified_at: new Date().toISOString(),
    verification_count: 1,
    is_sacred_heritage: false,
    heritage_story: null,
    primary_photo_url: null,
    source: 'community',
    attribution: 'Contributor',
    license: 'CC BY-SA 4.0',
  };
}

describe('Festival Route Planner (TSP Optimizer)', () => {
  it('returns empty trip if no checklist items are provided', () => {
    const trip = optimizeCollectionRoute(25.3176, 82.9739, []);
    expect(trip.stops).toHaveLength(0);
    expect(trip.totalDistanceMeters).toBe(0);
  });

  it('orders stops nearest-first to minimize travel distance', () => {
    const plantFar = createMockPlant('p1', 'Aegle marmelos', 'Bael', 25.35, 82.9739); // ~3.6 km north
    const plantClose = createMockPlant('p2', 'Datura metel', 'Dhatura', 25.32, 82.9739); // ~260m north

    const items: CandidateChecklistItem[] = [
      {
        speciesScientificName: 'Aegle marmelos',
        purpose: 'Bilva offering',
        part_needed: 'Leaves',
        is_essential: true,
        availablePlants: [plantFar],
      },
      {
        speciesScientificName: 'Datura metel',
        purpose: 'Neutralize toxins',
        part_needed: 'Fruit',
        is_essential: true,
        availablePlants: [plantClose],
      },
    ];

    const trip = optimizeCollectionRoute(25.3176, 82.9739, items);
    expect(trip.stops).toHaveLength(2);

    // Closest stop (Dhatura) should be first
    expect(trip.stops[0]!.plant.id).toBe('p2');
    expect(trip.stops[0]!.stopIndex).toBe(1);

    // Farther stop (Bael) should be second
    expect(trip.stops[1]!.plant.id).toBe('p1');
    expect(trip.stops[1]!.stopIndex).toBe(2);

    expect(trip.totalDistanceMeters).toBeGreaterThan(0);
    expect(trip.estimatedWalkingMinutes).toBeGreaterThan(0);
    expect(trip.googleMapsUrl).toContain('destination=25.35');
  });

  it('builds valid multi-stop Google Maps URL', () => {
    const p1 = createMockPlant('p1', 'Aegle marmelos', 'Bael', 25.31, 82.97);
    const p2 = createMockPlant('p2', 'Datura metel', 'Dhatura', 25.32, 82.98);
    const p3 = createMockPlant('p3', 'Nerium oleander', 'Kaner', 25.33, 82.99);

    const url = buildGoogleMapsRouteUrl(25.30, 82.96, [p1, p2, p3]);
    expect(url).toContain('https://www.google.com/maps/dir/?api=1');
    expect(url).toContain('origin=25.3%2C82.96');
    expect(url).toContain('destination=25.33%2C82.99');
    expect(url).toContain('waypoints=25.31%2C82.97%7C25.32%2C82.98');
  });
});
