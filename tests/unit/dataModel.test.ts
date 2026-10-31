import { describe, it, expect } from 'vitest';
import { SEED_SPECIES } from '../../scripts/data/species-data';
import { SEED_FESTIVALS } from '../../scripts/data/festival-data';
import { SEED_DEMO_PLANTS } from '../../scripts/data/demo-plants-data';

describe('Vriksha Core Data Model & Seed Taxonomy Integrity', () => {
  it('contains 80 curated useful species with unique scientific names', () => {
    expect(SEED_SPECIES.length).toBe(80);
    const scientificNames = SEED_SPECIES.map((s) => s.scientific_name);
    const uniqueNames = new Set(scientificNames);
    expect(uniqueNames.size).toBe(80);
  });

  it('validates plant types and seasonality range (1-12)', () => {
    const validTypes = new Set(['large_tree', 'shrub', 'herb', 'grass']);

    for (const species of SEED_SPECIES) {
      expect(validTypes.has(species.plant_type)).toBe(true);
      expect(species.common_name_en).toBeTruthy();
      expect(species.common_name_hi).toBeTruthy();

      for (const m of species.seasonality_flowering) {
        expect(m).toBeGreaterThanOrEqual(1);
        expect(m).toBeLessThanOrEqual(12);
      }
      for (const m of species.seasonality_fruiting) {
        expect(m).toBeGreaterThanOrEqual(1);
        expect(m).toBeLessThanOrEqual(12);
      }
      for (const m of species.seasonality_fresh_leaves) {
        expect(m).toBeGreaterThanOrEqual(1);
        expect(m).toBeLessThanOrEqual(12);
      }
    }
  });

  it('enforces restricted species flags on sensitive flora', () => {
    const restrictedScientific = [
      'Santalum album',          // Sandalwood
      'Pterocarpus santalinus',  // Red Sanders
      'Rauvolfia serpentina',    // Sarpagandha
      'Swertia chirayita',       // Chirayata
      'Commiphora wightii',      // Guggulu
      'Picrorhiza kurroa',       // Kutki
    ];

    for (const sciName of restrictedScientific) {
      const match = SEED_SPECIES.find((s) => s.scientific_name === sciName);
      expect(match, `Expected species ${sciName} to be in SEED_SPECIES`).toBeDefined();
      expect(match?.is_restricted).toBe(true);
    }
  });

  it('enforces toxicity warnings on poisonous species', () => {
    const toxicSpecies = ['Datura metel', 'Calotropis procera', 'Nerium oleander', 'Ricinus communis'];
    for (const sciName of toxicSpecies) {
      const match = SEED_SPECIES.find((s) => s.scientific_name === sciName);
      expect(match?.is_toxic).toBe(true);
      expect(match?.toxicity_details).toBeTruthy();
      expect(match?.toxicity_details?.length).toBeGreaterThan(15);
    }
  });

  it('verifies multilingual local names exist for all species across Indian languages', () => {
    for (const species of SEED_SPECIES) {
      expect(species.local_names.length).toBeGreaterThanOrEqual(8);
      const languages = species.local_names.map((ln) => ln.language_code);
      expect(languages).toContain('sa'); // Sanskrit
      expect(languages).toContain('bn'); // Bengali
      expect(languages).toContain('ta'); // Tamil
      expect(languages).toContain('te'); // Telugu
    }
  });

  it('verifies festival checklists reference valid species in the taxonomy', () => {
    expect(SEED_FESTIVALS.length).toBeGreaterThanOrEqual(12);
    const validScientificNames = new Set(SEED_SPECIES.map((s) => s.scientific_name));

    for (const fest of SEED_FESTIVALS) {
      expect(fest.needs_local_review).toBe(true);
      expect(fest.checklist.length).toBeGreaterThan(0);

      for (const item of fest.checklist) {
        expect(
          validScientificNames.has(item.species_scientific_name),
          `Festival ${fest.slug} references unknown species: ${item.species_scientific_name}`
        ).toBe(true);
      }
    }
  });

  it('proves spatial fuzzing displacements protect restricted species', () => {
    const restrictedDemo = SEED_DEMO_PLANTS.filter(
      (p) => p.species_scientific_name === 'Santalum album' || p.species_scientific_name === 'Pterocarpus santalinus'
    );
    expect(restrictedDemo.length).toBeGreaterThan(0);

    for (const plant of restrictedDemo) {
      // Coordinate fuzzing must displace the coordinates
      const isExactEqual = plant.lat === plant.fuzzed_lat && plant.lng === plant.fuzzed_lng;
      expect(isExactEqual).toBe(false);

      // Distance between exact and fuzzed should be ~1 to 6 km
      const latDiffDeg = Math.abs(plant.lat - plant.fuzzed_lat);
      const lngDiffDeg = Math.abs(plant.lng - plant.fuzzed_lng);
      // 0.01 deg is ~1.1km, 0.08 deg is ~8.8km
      expect(Math.max(latDiffDeg, lngDiffDeg)).toBeGreaterThanOrEqual(0.005);
      expect(Math.max(latDiffDeg, lngDiffDeg)).toBeLessThanOrEqual(0.08);
    }
  });
});
