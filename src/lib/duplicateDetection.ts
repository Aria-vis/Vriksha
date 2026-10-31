import { PlantSearchResult } from '../types/plant';
import { calculateDistanceMeters } from '../services/plantsApi';

export interface DuplicateCandidatePair {
  plantA: PlantSearchResult;
  plantB: PlantSearchResult;
  distanceMeters: number;
}

/**
 * Finds candidate duplicate plants within maxRadiusMeters (default 15m).
 */
export function findDuplicateCandidates(
  plants: PlantSearchResult[],
  maxRadiusMeters: number = 15
): DuplicateCandidatePair[] {
  const duplicates: DuplicateCandidatePair[] = [];

  for (let i = 0; i < plants.length; i++) {
    for (let j = i + 1; j < plants.length; j++) {
      const p1 = plants[i];
      const p2 = plants[j];
      if (!p1 || !p2) continue;

      if (p1.scientific_name.toLowerCase() === p2.scientific_name.toLowerCase()) {
        const dist = calculateDistanceMeters(p1.lat, p1.lng, p2.lat, p2.lng);
        if (dist <= maxRadiusMeters) {
          duplicates.push({
            plantA: p1,
            plantB: p2,
            distanceMeters: dist,
          });
        }
      }
    }
  }

  return duplicates;
}
