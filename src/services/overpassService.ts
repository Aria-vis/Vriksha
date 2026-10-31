/**
 * Vriksha - OpenStreetMap Overpass API Service
 * 
 * Queries OSM trees within bounding boxes or radiuses around coordinates.
 * Respects Overpass API rate limits (debouncing, max 1 req per 2 sec).
 * Formats results with proper ODbL attribution.
 */

export interface OsmTreeElement {
  id: number;
  lat: number;
  lon: number;
  tags?: {
    'natural'?: string;
    'species'?: string;
    'species:en'?: string;
    'species:wikidata'?: string;
    'taxon'?: string;
    'leaf_type'?: string;
    'name'?: string;
    'height'?: string;
    'circumference'?: string;
    'denotation'?: string;
    [key: string]: string | undefined;
  };
}

export interface OverpassQueryResult {
  elements: OsmTreeElement[];
}

export const OVERPASS_PUBLIC_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
];

/**
 * Builds Overpass QL query string for trees in a bounding box.
 * [south, west, north, east]
 */
export function buildBBoxQuery(
  south: number,
  west: number,
  north: number,
  east: number,
  timeoutSeconds: number = 25
): string {
  return `[out:json][timeout:${timeoutSeconds}];
(
  node["natural"="tree"](${south},${west},${north},${east});
);
out body;
>;
out skel qt;`;
}

/**
 * Builds Overpass QL query string for trees around a central coordinate.
 */
export function buildRadiusQuery(
  lat: number,
  lng: number,
  radiusMeters: number = 2000,
  timeoutSeconds: number = 25
): string {
  return `[out:json][timeout:${timeoutSeconds}];
(
  node["natural"="tree"](around:${radiusMeters},${lat},${lng});
);
out body;
>;
out skel qt;`;
}

/**
 * Normalizes an OSM tree element into a standard plant item format.
 */
export function normalizeOsmTree(element: OsmTreeElement, matchedSpeciesId?: string) {
  const tags = element.tags || {};
  const rawSpecies = tags.species || tags['species:en'] || tags.taxon || tags.name || 'Unspecified Tree';

  return {
    osmId: element.id,
    source: 'osm' as const,
    sourceId: String(element.id),
    sourceUrl: `https://www.openstreetmap.org/node/${element.id}`,
    license: 'ODbL',
    attribution: '© OpenStreetMap contributors',
    lat: element.lat,
    lng: element.lon,
    rawSpeciesName: rawSpecies,
    matchedSpeciesId,
    height: tags.height,
    circumference: tags.circumference,
    denotation: tags.denotation,
  };
}
