import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Navigation,
  Compass,
  AlertCircle,
  Trees,
} from 'lucide-react';
import { SeedFestivalItem } from '../../../scripts/data/festival-data';
import { PlantSearchResult } from '../../types/plant';
import { formatDistance } from '../../lib/formatters';
import { optimizeCollectionRoute, OptimizedTrip, CandidateChecklistItem } from '../../lib/routePlanner';
import { TripPlannerModal } from './TripPlannerModal';

interface FestivalChecklistProps {
  festival: SeedFestivalItem | null;
  nearbyPlants: PlantSearchResult[];
  userLat: number;
  userLng: number;
  onClose: () => void;
  onSelectPlantOnMap?: (plant: PlantSearchResult) => void;
}

export const FestivalChecklist: React.FC<FestivalChecklistProps> = ({
  festival,
  nearbyPlants,
  userLat,
  userLng,
  onClose,
  onSelectPlantOnMap,
}) => {
  // Set of checked-off species
  const [collectedSpecies, setCollectedSpecies] = useState<Record<string, boolean>>({});
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState<boolean>(false);
  const [optimizedTrip, setOptimizedTrip] = useState<OptimizedTrip | null>(null);

  // Toggle item in basket
  const toggleCollected = (scientificName: string) => {
    setCollectedSpecies((prev) => ({
      ...prev,
      [scientificName]: !prev[scientificName],
    }));
  };

  // Match nearby plants for each checklist item
  const checklistWithAvailability = useMemo(() => {
    if (!festival) return [];
    return festival.checklist.map((item) => {
      const matchingPlants = nearbyPlants.filter(
        (p) => p.scientific_name.toLowerCase() === item.species_scientific_name.toLowerCase()
      );
      return {
        ...item,
        availablePlants: matchingPlants,
        nearestPlant: matchingPlants[0] || null,
        isCollected: !!collectedSpecies[item.species_scientific_name],
      };
    });
  }, [festival, nearbyPlants, collectedSpecies]);

  if (!festival) return null;

  // Handle Plan My Trip
  const handlePlanTrip = () => {
    const candidates: CandidateChecklistItem[] = checklistWithAvailability
      .filter((item) => !item.isCollected && item.availablePlants.length > 0)
      .map((item) => ({
        speciesScientificName: item.species_scientific_name,
        purpose: item.purpose,
        part_needed: item.part_needed,
        is_essential: item.is_essential,
        availablePlants: item.availablePlants,
      }));

    // If all collected, plan for all available
    const itemsToPlan = candidates.length > 0
      ? candidates
      : checklistWithAvailability
          .filter((item) => item.availablePlants.length > 0)
          .map((item) => ({
            speciesScientificName: item.species_scientific_name,
            purpose: item.purpose,
            part_needed: item.part_needed,
            is_essential: item.is_essential,
            availablePlants: item.availablePlants,
          }));

    const trip = optimizeCollectionRoute(userLat, userLng, itemsToPlan);
    setOptimizedTrip(trip);
    setIsTripPlannerOpen(true);
  };

  const collectedCount = Object.values(collectedSpecies).filter(Boolean).length;
  const totalItems = festival.checklist.length;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
        <div className="w-full sm:max-w-xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-200 dark:border-stone-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 text-white p-5 flex items-start justify-between shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 text-amber-100 text-xs font-semibold rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ritual Plant Checklist</span>
              </div>
              <h2 className="text-2xl font-bold font-serif flex items-baseline gap-2">
                <span>{festival.name_en}</span>
                <span className="text-amber-200 text-lg font-normal">({festival.name_hi})</span>
              </h2>
              <p className="text-xs text-amber-100 mt-1">{festival.description_en}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Regional Variation Disclaimer Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3 border-b border-amber-200/80 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="font-bold">Regional Ritual Traditions: </span>
              <span>
                Ritual practices and required plants vary by sampradaya, region, and family custom.
                All checklists are community-maintained and open to local edits.
              </span>
            </div>
          </div>

          {/* Progress Strip */}
          <div className="px-5 py-2.5 bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                Puja Basket: {collectedCount} of {totalItems} items collected
              </span>
            </div>
            <div className="w-24 h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${(collectedCount / totalItems) * 100}%` }}
              />
            </div>
          </div>

          {/* Checklist Items Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
            {checklistWithAvailability.map((item) => {
              return (
                <div
                  key={item.species_scientific_name}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.isCollected
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/60 opacity-80'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700/80 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={item.isCollected}
                      onChange={() => toggleCollected(item.species_scientific_name)}
                      className="mt-1 h-5 w-5 rounded border-stone-300 text-forest-700 focus:ring-forest-600 cursor-pointer"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4
                              className={`font-bold text-sm leading-tight ${
                                item.isCollected ? 'line-through text-stone-500' : 'text-stone-900 dark:text-stone-100'
                              }`}
                            >
                              {item.part_needed}
                            </h4>
                            {item.is_essential && (
                              <span className="px-1.5 py-0.2 bg-red-100 text-red-800 text-[10px] font-bold rounded">
                                Essential
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 italic font-sans">{item.species_scientific_name}</p>
                        </div>

                        {/* Availability Pill */}
                        {item.nearestPlant ? (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectPlantOnMap?.(item.nearestPlant!);
                              onClose();
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-full hover:bg-emerald-200 transition-colors shrink-0"
                            title="View on Map"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>{formatDistance(item.nearestPlant.distance_meters)}</span>
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-500 text-[11px] rounded-full shrink-0">
                            None nearby
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">{item.purpose}</p>

                      {item.notes && (
                        <p className="text-[11px] text-amber-800 dark:text-amber-400 mt-1 font-medium bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200/50">
                          ℹ️ {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer with "Plan My Trip" Route Optimizer */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 shrink-0 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100"
            >
              Back to Map
            </button>

            <button
              onClick={handlePlanTrip}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-forest-800 to-forest-900 hover:from-forest-900 hover:to-forest-950 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Navigation className="w-4 h-4 rotate-45 text-amber-300" />
              <span>Plan My Trip (Route Optimizer)</span>
              <Trees className="w-4 h-4 text-emerald-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Trip Planner Modal */}
      <TripPlannerModal
        isOpen={isTripPlannerOpen}
        onClose={() => setIsTripPlannerOpen(false)}
        trip={optimizedTrip}
        festivalName={festival.name_en}
      />
    </>
  );
};

export default FestivalChecklist;
