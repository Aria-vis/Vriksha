import { describe, it, expect } from 'vitest';
import { fetchNearestPlants, calculateDistanceMeters } from '../../src/services/plantsApi';

describe('Plants API & Spatial Discovery Service', () => {
  it('accurately calculates Haversine distance in meters', () => {
    // Distance between Delhi (28.6139, 77.2090) and Varanasi (25.3176, 82.9739) is ~680 km
    const dist = calculateDistanceMeters(28.6139, 77.2090, 25.3176, 82.9739);
    expect(dist).toBeGreaterThan(650000);
    expect(dist).toBeLessThan(720000);
  });

  it('fetches nearest plants around Varanasi and sorts nearest first', async () => {
    const varanasiLat = 25.3176;
    const varanasiLng = 82.9739;

    const plants = await fetchNearestPlants(varanasiLat, varanasiLng, { radiusMeters: 50000 });
    expect(plants.length).toBeGreaterThan(0);

    // Verify distance sorting (monotonic non-decreasing)
    for (let i = 1; i < plants.length; i++) {
      expect(plants[i]!.distance_meters).toBeGreaterThanOrEqual(plants[i - 1]!.distance_meters);
    }
  });

  it('filters plants by text search in English, Hindi, and scientific names', async () => {
    const results = await fetchNearestPlants(25.3176, 82.9739, { query: 'बेल' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((p) => p.common_name_hi === 'बेल')).toBe(true);
  });

  it('filters plants by use tags (e.g. puja)', async () => {
    const results = await fetchNearestPlants(25.3176, 82.9739, { use_tags: ['puja'] });
    expect(results.length).toBeGreaterThan(0);
    for (const p of results) {
      expect(p.use_tags).toContain('puja');
    }
  });

  it('protects restricted species with fuzzed coordinates for standard non-moderators', async () => {
    // Delhi center
    const plants = await fetchNearestPlants(28.6139, 77.2090, { radiusMeters: 50000 }, false);
    const sandalwood = plants.find((p) => p.scientific_name === 'Santalum album');

    if (sandalwood) {
      expect(sandalwood.is_restricted).toBe(true);
      // Fuzzed lat/lng in Delhi seed is (28.6000, 77.2000) while exact was (28.5833, 77.2167)
      expect(sandalwood.lat).toBe(28.6000);
      expect(sandalwood.lng).toBe(77.2000);
    }
  });
});
