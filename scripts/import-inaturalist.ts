/**
 * Vriksha - CLI iNaturalist Research-Grade Data Ingest Script
 * 
 * Usage:
 *   npx tsx scripts/import-inaturalist.ts --species="Azadirachta indica"
 *   npx tsx scripts/import-inaturalist.ts --species="Aegle marmelos"
 */

import {
  buildINatQueryUrl,
  isLicensePermitted,
  normalizeINatObservation,
  INatApiResponse,
} from '../src/services/inaturalistService';

export async function runINatImport(speciesScientificName?: string) {
  const species = speciesScientificName || 'Azadirachta indica';
  const url = buildINatQueryUrl({
    taxonName: species,
    perPage: 25,
  });

  console.log(`[iNaturalist Ingest] Fetching research-grade observations for "${species}" in India...`);
  console.log(`[iNaturalist Ingest] Endpoint: ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Vriksha-Bot/1.0 (https://vriksha.app; contact@vriksha.app)',
      },
    });

    if (!res.ok) {
      console.warn(`[iNaturalist Ingest] API returned HTTP ${res.status}.`);
      return;
    }

    const data: INatApiResponse = await res.json();
    console.log(`[iNaturalist Ingest] Found ${data.total_results} total observations. Processing ${data.results.length}...`);

    let compliantCount = 0;
    const normalized = data.results
      .filter((obs) => {
        const allowed = isLicensePermitted(obs.license_code);
        if (!allowed) {
          console.log(`[iNaturalist Ingest] Skipping observation #${obs.id} due to non-open license: ${obs.license_code}`);
        }
        return allowed;
      })
      .map((obs) => {
        compliantCount++;
        return normalizeINatObservation(obs);
      });

    console.log(`[iNaturalist Ingest] Successfully normalized ${compliantCount} CC-licensed observations.`);
    const first = normalized[0];
    if (first) {
      console.log(`[iNaturalist Ingest] Sample record attribution: "${first.attribution}"`);
      console.log(`[iNaturalist Ingest] Source URL: ${first.sourceUrl}`);
    }
  } catch (err) {
    console.warn(`[iNaturalist Ingest] Network call failed: ${(err as Error).message}`);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  const speciesArg = process.argv.find((a) => a.startsWith('--species='))?.split('=')[1];
  runINatImport(speciesArg);
}
