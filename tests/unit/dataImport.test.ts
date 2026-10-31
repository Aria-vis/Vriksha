import { describe, it, expect } from 'vitest';
import {
  buildBBoxQuery,
  buildRadiusQuery,
  normalizeOsmTree,
  OsmTreeElement,
} from '../../src/services/overpassService';
import {
  isLicensePermitted,
  normalizeINatObservation,
  buildINatQueryUrl,
  INatObservation,
} from '../../src/services/inaturalistService';

describe('Data Import Pipeline & Attribution Tests', () => {
  describe('OpenStreetMap Overpass Service', () => {
    it('generates valid bounding box query with timeout', () => {
      const q = buildBBoxQuery(25.26, 82.94, 25.37, 83.05, 25);
      expect(q).toContain('[out:json][timeout:25];');
      expect(q).toContain('node["natural"="tree"](25.26,82.94,25.37,83.05);');
    });

    it('generates valid radius around query', () => {
      const q = buildRadiusQuery(25.3176, 82.9739, 1500, 30);
      expect(q).toContain('node["natural"="tree"](around:1500,25.3176,82.9739);');
    });

    it('normalizes OSM tree element with ODbL license and attribution', () => {
      const el: OsmTreeElement = {
        id: 12345678,
        lat: 25.312,
        lon: 82.985,
        tags: {
          natural: 'tree',
          species: 'Azadirachta indica',
          height: '12',
        },
      };

      const result = normalizeOsmTree(el, 'Azadirachta indica');
      expect(result.source).toBe('osm');
      expect(result.sourceId).toBe('12345678');
      expect(result.sourceUrl).toBe('https://www.openstreetmap.org/node/12345678');
      expect(result.license).toBe('ODbL');
      expect(result.attribution).toBe('© OpenStreetMap contributors');
      expect(result.rawSpeciesName).toBe('Azadirachta indica');
      expect(result.height).toBe('12');
    });
  });

  describe('iNaturalist Service', () => {
    it('permits open licenses and blocks all rights reserved', () => {
      expect(isLicensePermitted('cc0')).toBe(true);
      expect(isLicensePermitted('cc-by')).toBe(true);
      expect(isLicensePermitted('cc-by-nc')).toBe(true);
      expect(isLicensePermitted('CC-BY-NC')).toBe(true);
      expect(isLicensePermitted('all-rights-reserved')).toBe(false);
      expect(isLicensePermitted(null)).toBe(false);
      expect(isLicensePermitted(undefined)).toBe(false);
    });

    it('builds research-grade iNat query for India', () => {
      const url = buildINatQueryUrl({ taxonName: 'Aegle marmelos', perPage: 20 });
      expect(url).toContain('place_id=6681');
      expect(url).toContain('quality_grade=research');
      expect(url).toContain('taxon_name=Aegle+marmelos');
    });

    it('normalizes iNaturalist observation with observer credit and license', () => {
      const mockObs: INatObservation = {
        id: 998877,
        uri: 'https://www.inaturalist.org/observations/998877',
        observed_on: '2026-08-15',
        geojson: {
          coordinates: [82.975, 25.321],
        },
        obscured: false,
        quality_grade: 'research',
        license_code: 'cc-by',
        user: {
          id: 543,
          login: 'botany_explorer',
          name: 'Flora Mitra',
        },
        taxon: {
          id: 1122,
          name: 'Azadirachta indica',
          preferred_common_name: 'Neem',
          rank: 'species',
        },
        photos: [
          {
            id: 4455,
            url: 'https://static.inaturalist.org/photos/4455/square.jpg',
            license_code: 'cc-by',
            attribution: '(c) Flora Mitra, some rights reserved (CC BY)',
          },
        ],
      };

      const result = normalizeINatObservation(mockObs, 'sp-neem-id');
      expect(result.source).toBe('inaturalist');
      expect(result.sourceId).toBe('998877');
      expect(result.sourceUrl).toBe('https://www.inaturalist.org/observations/998877');
      expect(result.license).toBe('CC-BY');
      expect(result.attribution).toContain('Flora Mitra');
      expect(result.attribution).toContain('iNaturalist');
      expect(result.photoUrl).toBe('https://static.inaturalist.org/photos/4455/medium.jpg');
      expect(result.lat).toBe(25.321);
      expect(result.lng).toBe(82.975);
    });
  });
});
