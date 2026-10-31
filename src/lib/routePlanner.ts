/**
 * Vriksha - Festival Route Optimizer ("Plan My Trip")
 * 
 * Uses a Greedy Nearest-Neighbor Traveling Salesperson Problem (TSP) solver
 * to order plant collection waypoints with minimum travel distance from user's start location.
 * Generates Google Maps multi-stop direction URLs.
 */

import { PlantSearchResult } from '../types/plant';
import { calculateDistanceMeters } from '../services/plantsApi';

export interface RouteStop {
  stopIndex: number;
  plant: PlantSearchResult;
  itemNeeded: {
    purpose: string;
    part_needed: string;
    is_essential: boolean;
  };
  distanceFromPreviousMeters: number;
  cumulativeDistanceMeters: number;
}

export interface OptimizedTrip {
  stops: RouteStop[];
  totalDistanceMeters: number;
  estimatedWalkingMinutes: number;
  estimatedDrivingMinutes: number;
  googleMapsUrl: string;
}

export interface CandidateChecklistItem {
  speciesScientificName: string;
  purpose: string;
  part_needed: string;
  is_essential: boolean;
  availablePlants: PlantSearchResult[];
}

/**
 * Optimizes collection order for a list of checklist items.
 * For each item, picks the best available candidate plant that minimizes cumulative detour.
 */
export function optimizeCollectionRoute(
  startLat: number,
  startLng: number,
  items: CandidateChecklistItem[]
): OptimizedTrip {
  // Only consider items that have at least one plant available nearby
  const solvableItems = items.filter((item) => item.availablePlants.length > 0);

  if (solvableItems.length === 0) {
    return {
      stops: [],
      totalDistanceMeters: 0,
      estimatedWalkingMinutes: 0,
      estimatedDrivingMinutes: 0,
      googleMapsUrl: '',
    };
  }

  const unvisited = [...solvableItems];
  const stops: RouteStop[] = [];
  let currentLat = startLat;
  let currentLng = startLng;
  let cumulativeDistance = 0;

  let stopIndex = 1;
  while (unvisited.length > 0) {
    let bestItemIndex = -1;
    let bestPlant: PlantSearchResult | null = null;
    let shortestDistance = Infinity;

    // Find the item and plant closest to current position
    for (let i = 0; i < unvisited.length; i++) {
      const candidateItem = unvisited[i];
      if (!candidateItem) continue;
      for (const plant of candidateItem.availablePlants) {
        const dist = calculateDistanceMeters(currentLat, currentLng, plant.lat, plant.lng);
        if (dist < shortestDistance) {
          shortestDistance = dist;
          bestItemIndex = i;
          bestPlant = plant;
        }
      }
    }

    if (bestItemIndex === -1 || !bestPlant) {
      break;
    }

    const chosenItem = unvisited[bestItemIndex];
    if (!chosenItem) break;
    cumulativeDistance += shortestDistance;

    stops.push({
      stopIndex,
      plant: bestPlant,
      itemNeeded: {
        purpose: chosenItem.purpose,
        part_needed: chosenItem.part_needed,
        is_essential: chosenItem.is_essential,
      },
      distanceFromPreviousMeters: shortestDistance,
      cumulativeDistanceMeters: cumulativeDistance,
    });

    // Advance current position to the selected plant
    currentLat = bestPlant.lat;
    currentLng = bestPlant.lng;
    unvisited.splice(bestItemIndex, 1);
    stopIndex++;
  }

  // Estimated travel times: walking ~ 4.5 km/h (~75 m/min), driving in city ~ 20 km/h (~330 m/min)
  const estimatedWalkingMinutes = Math.max(1, Math.round(cumulativeDistance / 75));
  const estimatedDrivingMinutes = Math.max(1, Math.round(cumulativeDistance / 330));

  // Build Google Maps multi-stop URL
  const googleMapsUrl = buildGoogleMapsRouteUrl(startLat, startLng, stops.map((s) => s.plant));

  return {
    stops,
    totalDistanceMeters: cumulativeDistance,
    estimatedWalkingMinutes,
    estimatedDrivingMinutes,
    googleMapsUrl,
  };
}

/**
 * Builds Google Maps Multi-Stop Directions URL.
 * https://www.google.com/maps/dir/?api=1&origin=...&destination=...&waypoints=...
 */
export function buildGoogleMapsRouteUrl(
  startLat: number,
  startLng: number,
  plants: PlantSearchResult[]
): string {
  if (plants.length === 0) return '';

  const origin = `${startLat},${startLng}`;
  const lastPlant = plants[plants.length - 1];
  if (!lastPlant) return '';
  const destination = `${lastPlant.lat},${lastPlant.lng}`;

  // Intermediate waypoints
  const waypoints = plants
    .slice(0, plants.length - 1)
    .map((p) => `${p.lat},${p.lng}`)
    .join('|');

  let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  if (waypoints) {
    url += `&waypoints=${encodeURIComponent(waypoints)}`;
  }

  return url;
}
