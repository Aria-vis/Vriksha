import { useState, useEffect } from 'react';
import { PlantSearchResult } from '../types/plant';
import { FRESHNESS_CONFIG } from '../config/freshness';
import { calculateDistanceMeters } from '../services/plantsApi';

export function useFreshnessPrompt(
  userCoords: { lat: number; lng: number } | null,
  plants: PlantSearchResult[],
  isUsingGPS: boolean
) {
  const [promptPlant, setPromptPlant] = useState<PlantSearchResult | null>(null);

  useEffect(() => {
    // Only trigger if user granted active GPS permission
    if (!userCoords || !isUsingGPS || plants.length === 0) {
      setPromptPlant(null);
      return;
    }

    const { radiusMeters, cooldownHours } = FRESHNESS_CONFIG.proximityPrompt;
    const now = Date.now();

    for (const plant of plants) {
      // Must be needs_recheck status
      if (plant.status !== 'needs_recheck') continue;

      const distance = calculateDistanceMeters(
        userCoords.lat,
        userCoords.lng,
        plant.lat,
        plant.lng
      );

      if (distance <= radiusMeters) {
        // Check local storage cooldown (max once per plant per day)
        const storageKey = `vriksha_prompt_${plant.id}`;
        const lastPrompted = localStorage.getItem(storageKey);

        if (lastPrompted) {
          const hoursPassed = (now - parseInt(lastPrompted, 10)) / (1000 * 60 * 60);
          if (hoursPassed < cooldownHours) {
            continue; // Skip, cooldown active
          }
        }

        // Trigger prompt
        setPromptPlant(plant);
        localStorage.setItem(storageKey, String(now));
        break; // Only prompt for one at a time
      }
    }
  }, [userCoords, plants, isUsingGPS]);

  const dismissPrompt = () => setPromptPlant(null);

  return {
    promptPlant,
    dismissPrompt,
  };
}
