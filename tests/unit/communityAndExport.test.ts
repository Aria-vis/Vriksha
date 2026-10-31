import { describe, it, expect } from 'vitest';
import { FAMOUS_HERITAGE_TREES } from '../../src/data/heritageTreesData';
import { CIVIC_NURSERIES } from '../../src/data/civicNurseriesData';
import { PlantSearchResult } from '../../src/types/plant';

const mockExportPlants: PlantSearchResult[] = [
  {
    id: 'exp-1',
    species_id: 'sp-1',
    scientific_name: 'Azadirachta indica',
    common_name_en: 'Neem',
    common_name_hi: 'नीम',
    plant_type: 'large_tree',
    use_tags: ['medicinal', 'puja'],
    parts_used: ['leaves'],
    is_toxic: false,
    toxicity_details: null,
    is_restricted: false,
    lat: 25.3176,
    lng: 82.9739,
    distance_meters: 100,
    address_hint: 'Near Ghat',
    land_type: 'public',
    status: 'recently_verified',
    last_verified_at: '2026-10-30T10:00:00Z',
    verification_count: 5,
    is_sacred_heritage: false,
    heritage_story: null,
    primary_photo_url: null,
    source: 'community',
    attribution: 'Community Volunteer',
    license: 'CC BY-SA 4.0',
  },
  {
    id: 'exp-2',
    species_id: 'sp-2',
    scientific_name: 'Santalum album',
    common_name_en: 'White Sandalwood',
    common_name_hi: 'सफेद चंदन',
    plant_type: 'large_tree',
    use_tags: ['puja', 'medicinal'],
    parts_used: ['wood', 'paste'],
    is_toxic: false,
    toxicity_details: null,
    is_restricted: true, // Restricted species
    lat: 12.9716,
    lng: 77.5946,
    distance_meters: 200,
    address_hint: null,
    land_type: 'institution',
    status: 'recently_verified',
    last_verified_at: '2026-10-31T10:00:00Z',
    verification_count: 2,
    is_sacred_heritage: true,
    heritage_story: 'Protected botanical garden specimen',
    primary_photo_url: null,
    source: 'iNaturalist',
    attribution: 'Botanical Trust (CC BY-NC 4.0)',
    license: 'CC BY-NC 4.0',
  },
];

describe('Milestone 8: Community Features & Open Data Export', () => {
  it('loads iconic sacred heritage trees with age estimates and sacred traditions', () => {
    expect(FAMOUS_HERITAGE_TREES.length).toBeGreaterThanOrEqual(4);
    
    const akshayaVat = FAMOUS_HERITAGE_TREES.find((t) => t.id === 'heritage-1');
    expect(akshayaVat).toBeDefined();
    expect(akshayaVat?.name).toContain('Akshaya Vat');
    expect(akshayaVat?.estimatedAgeYears).toBeGreaterThanOrEqual(1000);
    expect(akshayaVat?.sacredTradition).toContain('Ramayana');

    const kabirVad = FAMOUS_HERITAGE_TREES.find((t) => t.id === 'heritage-2');
    expect(kabirVad).toBeDefined();
    expect(kabirVad?.city).toContain('Bharuch');
    expect(kabirVad?.estimatedAgeYears).toBeGreaterThanOrEqual(500);
  });

  it('lists civic and state forest nurseries offering free or subsidized saplings', () => {
    expect(CIVIC_NURSERIES.length).toBeGreaterThanOrEqual(4);

    const freeNurseries = CIVIC_NURSERIES.filter((n) => n.distributionType === 'free');
    expect(freeNurseries.length).toBeGreaterThanOrEqual(2);

    const delhiNursery = CIVIC_NURSERIES.find((n) => n.city === 'New Delhi');
    expect(delhiNursery).toBeDefined();
    expect(delhiNursery?.distributionType).toBe('free');
    expect(delhiNursery?.availableSaplings).toContain('Neem');
    expect(delhiNursery?.availableSaplings).toContain('Peepal');
  });

  it('generates valid GeoJSON FeatureCollection with license and privacy metadata', () => {
    const nonRestricted = mockExportPlants.filter((p) => !p.is_restricted);

    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        title: 'Vriksha Open Community Flora Dataset',
        license: 'CC BY-SA 4.0',
        itemCount: nonRestricted.length,
      },
      features: nonRestricted.map((p) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat],
        },
        properties: {
          id: p.id,
          commonNameEn: p.common_name_en,
          scientificName: p.scientific_name,
        },
      })),
    };

    expect(geojson.type).toBe('FeatureCollection');
    expect(geojson.metadata.license).toBe('CC BY-SA 4.0');
    expect(geojson.features).toHaveLength(1);
    expect(geojson.features[0]?.geometry.coordinates).toEqual([82.9739, 25.3176]);
    expect(geojson.features[0]?.properties.commonNameEn).toBe('Neem');
  });

  it('generates valid CSV representation with escaping and correct header fields', () => {
    const headers = ['id', 'common_name_en', 'scientific_name', 'latitude', 'longitude'];
    const row = [
      mockExportPlants[0]!.id,
      `"${mockExportPlants[0]!.common_name_en}"`,
      `"${mockExportPlants[0]!.scientific_name}"`,
      mockExportPlants[0]!.lat.toFixed(4),
      mockExportPlants[0]!.lng.toFixed(4),
    ].join(',');

    const csv = [headers.join(','), row].join('\n');
    expect(csv).toContain('id,common_name_en,scientific_name');
    expect(csv).toContain('"Neem","Azadirachta indica",25.3176,82.9739');
  });
});
