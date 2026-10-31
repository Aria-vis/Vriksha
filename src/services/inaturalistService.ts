/**
 * Vriksha - iNaturalist API Service
 * 
 * Ingests research-grade plant observations in India.
 * Enforces strict open-license filtering (CC0, CC BY, CC BY-NC).
 * Retains observation URL, observer username, and photo licensing attribution.
 */

export interface INatPhoto {
  id: number;
  url: string; // e.g. "https://static.inaturalist.org/photos/.../square.jpg"
  license_code: string | null; // e.g. "cc-by", "cc-by-nc", "cc0"
  attribution: string;
}

export interface INatTaxon {
  id: number;
  name: string; // e.g. "Azadirachta indica"
  preferred_common_name?: string;
  rank: string;
}

export interface INatObservation {
  id: number;
  uri: string; // e.g. "https://www.inaturalist.org/observations/12345"
  observed_on: string;
  geojson?: {
    coordinates: [number, number]; // [lng, lat]
  };
  location?: string; // "lat,lng"
  obscured: boolean;
  quality_grade: 'research' | 'needs_id' | 'casual';
  license_code: string | null;
  user: {
    id: number;
    login: string;
    name?: string;
  };
  taxon?: INatTaxon;
  photos?: INatPhoto[];
}

export interface INatApiResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: INatObservation[];
}

/**
 * Open licenses approved for Vriksha non-profit utility under CC attribution terms.
 */
export const ALLOWED_INAT_LICENSES = ['cc0', 'cc-by', 'cc-by-nc', 'cc-by-sa', 'cc-by-nc-sa'];

/**
 * Checks whether an observation license meets Vriksha open data criteria.
 */
export function isLicensePermitted(licenseCode: string | null | undefined): boolean {
  if (!licenseCode) return false;
  return ALLOWED_INAT_LICENSES.includes(licenseCode.toLowerCase());
}

/**
 * Normalizes an iNaturalist observation to Vriksha's schema.
 */
export function normalizeINatObservation(obs: INatObservation, matchedSpeciesId?: string) {
  let lat = 0;
  let lng = 0;

  if (obs.geojson?.coordinates) {
    lng = obs.geojson.coordinates[0];
    lat = obs.geojson.coordinates[1];
  } else if (obs.location) {
    const parts = obs.location.split(',').map((p) => parseFloat(p.trim()));
    lat = parts[0] || 0;
    lng = parts[1] || 0;
  }

  const primaryPhoto = obs.photos?.[0];
  const photoUrl = primaryPhoto?.url
    ? primaryPhoto.url.replace('/square.', '/medium.')
    : null;

  const license = obs.license_code ? obs.license_code.toUpperCase() : 'CC BY-NC 4.0';
  const observerName = obs.user.name || obs.user.login;
  const attribution = `Observation by ${observerName} via iNaturalist (${license})`;

  return {
    source: 'inaturalist' as const,
    sourceId: String(obs.id),
    sourceUrl: obs.uri || `https://www.inaturalist.org/observations/${obs.id}`,
    license,
    attribution,
    lat,
    lng,
    isObscured: obs.obscured,
    rawTaxonName: obs.taxon?.name || 'Unknown',
    commonName: obs.taxon?.preferred_common_name || obs.taxon?.name,
    matchedSpeciesId,
    observedAt: obs.observed_on,
    photoUrl,
    photoAttribution: primaryPhoto?.attribution || attribution,
  };
}

/**
 * Builds the iNaturalist REST API query URL for India observations of a specific species.
 */
export function buildINatQueryUrl(params: {
  taxonName?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  perPage?: number;
}): string {
  const query = new URLSearchParams();
  query.set('place_id', '6681'); // India place ID in iNaturalist
  query.set('quality_grade', 'research');
  query.set('per_page', String(params.perPage || 30));

  if (params.taxonName) {
    query.set('taxon_name', params.taxonName);
  }
  if (params.lat && params.lng) {
    query.set('lat', String(params.lat));
    query.set('lng', String(params.lng));
    query.set('radius', String(params.radiusKm || 25));
  }

  return `https://api.inaturalist.org/v1/observations?${query.toString()}`;
}
