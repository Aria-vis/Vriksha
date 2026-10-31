import { describe, it, expect } from 'vitest';
import { fetchNearestPlants } from '../../src/services/plantsApi';
import { findDuplicateCandidates } from '../../src/lib/duplicateDetection';
import { PlantSearchResult } from '../../src/types/plant';

function createMockPlant(
  id: string,
  scientific: string,
  lat: number,
  lng: number,
  isRestricted: boolean = false
): PlantSearchResult {
  return {
    id,
    species_id: `sp-${id}`,
    scientific_name: scientific,
    common_name_en: 'Test Plant',
    common_name_hi: 'परीक्षण पौधा',
    plant_type: 'large_tree',
    use_tags: ['puja'],
    parts_used: ['leaves'],
    is_toxic: false,
    toxicity_details: null,
    is_restricted: isRestricted,
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

describe('Moderation & Privacy Protection Tests', () => {
  describe('Restricted Species Spatial Privacy Shield', () => {
    it('verifies that non-moderator query returns fuzzed coordinates for restricted species', async () => {
      // Query near Varanasi where demo sandalwood exists
      const publicResults = await fetchNearestPlants(25.3176, 82.9739, {}, false);
      const sandalwood = publicResults.find((p) => p.is_restricted);

      if (sandalwood) {
        expect(sandalwood.is_restricted).toBe(true);
        // Coordinate must match fuzzed grid centroid (~0.05 step grid)
        expect(sandalwood.lat).toBe(25.3);
        expect(sandalwood.lng).toBe(82.95);
      }
    });

    it('verifies that moderator query has access to exact coordinates', async () => {
      const modResults = await fetchNearestPlants(25.3176, 82.9739, {}, true);
      const sandalwood = modResults.find((p) => p.is_restricted);

      if (sandalwood) {
        // True coordinate in demo dataset is (25.3190, 82.9720)
        expect(sandalwood.lat).toBe(25.3190);
        expect(sandalwood.lng).toBe(82.9720);
      }
    });
  });

  describe('Duplicate Plant Detection', () => {
    it('detects two plants of the same species within 15 meters', () => {
      const p1 = createMockPlant('p1', 'Azadirachta indica', 25.31760, 82.97390);
      const p2 = createMockPlant('p2', 'Azadirachta indica', 25.31765, 82.97392); // ~6 meters away

      const duplicates = findDuplicateCandidates([p1, p2], 15);
      expect(duplicates).toHaveLength(1);
      expect(duplicates[0]?.distanceMeters).toBeLessThanOrEqual(15);
    });

    it('ignores plants of different species even if close together', () => {
      const p1 = createMockPlant('p1', 'Azadirachta indica', 25.31760, 82.97390);
      const p2 = createMockPlant('p2', 'Aegle marmelos', 25.31762, 82.97391); // ~3 meters away but different species

      const duplicates = findDuplicateCandidates([p1, p2], 15);
      expect(duplicates).toHaveLength(0);
    });

    it('ignores plants of same species if farther than threshold', () => {
      const p1 = createMockPlant('p1', 'Azadirachta indica', 25.3176, 82.9739);
      const p2 = createMockPlant('p2', 'Azadirachta indica', 25.3250, 82.9800); // ~1 km away

      const duplicates = findDuplicateCandidates([p1, p2], 15);
      expect(duplicates).toHaveLength(0);
    });
  });
});
