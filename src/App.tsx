import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/common/Header';
import FilterChips from './components/map/FilterChips';
import MapContainer from './components/map/MapContainer';
import NearestBottomSheet from './components/map/NearestBottomSheet';
import PlantDetailSheet from './components/plant/PlantDetailSheet';
import ProximityPromptCard from './components/common/ProximityPromptCard';
import { OfflineBadge } from './components/common/OfflineBadge';
import { AddPlantModal } from './components/forms/AddPlantModal';
import { AuthModal } from './components/common/AuthModal';
import { FestivalCalendar } from './components/festival/FestivalCalendar';
import { FestivalChecklist } from './components/festival/FestivalChecklist';
import { useGeolocation } from './hooks/useGeolocation';
import { useFreshnessPrompt } from './hooks/useFreshnessPrompt';
import { useAuth } from './hooks/useAuth';
import { plantsApi } from './services/plantsApi';
import { PlantSearchResult, Species, UseTag, FreshnessStatus } from './types/plant';
import type { SeedFestivalItem } from '../scripts/data/festival-data';

export const App: React.FC = () => {
  const {
    coords,
    activeCityName,
    isUsingGPS,
    isLocating,
    requestGPSLocation,
    selectCityPreset,
  } = useGeolocation();

  const { profile, isAuthenticated, awardPoints } = useAuth();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [selectedFestival, setSelectedFestival] = useState<SeedFestivalItem | null>(null);

  // Filters state
  const [selectedUseTags, setSelectedUseTags] = useState<UseTag[]>([]);
  const [inSeasonOnly, setInSeasonOnly] = useState<boolean>(false);
  const [selectedFreshness, setSelectedFreshness] = useState<FreshnessStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain data state
  const [plants, setPlants] = useState<PlantSearchResult[]>([]);
  const [allSpecies, setAllSpecies] = useState<Species[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load master species catalog
  useEffect(() => {
    plantsApi.fetchAllSpecies().then((species) => {
      setAllSpecies(species);
    });
  }, []);

  // Fetch nearest plants whenever coords or filters change
  const loadPlants = useCallback(async () => {
    if (!coords) return;
    setIsLoading(true);
    try {
      const results = await plantsApi.fetchNearestPlants(coords.lat, coords.lng, {
        query: searchQuery,
        use_tags: selectedUseTags,
        in_season_only: inSeasonOnly,
        freshness_statuses: selectedFreshness,
      });
      setPlants(results);
    } catch (err) {
      console.error('Failed to load nearest plants:', err);
    } finally {
      setIsLoading(false);
    }
  }, [coords, searchQuery, selectedUseTags, inSeasonOnly, selectedFreshness]);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  // Proximity 100m Recheck Prompt hook
  const { promptPlant, dismissPrompt } = useFreshnessPrompt(coords, plants, isUsingGPS);

  // Selected plant's full species record (for local names & seasonality)
  const selectedPlantSpecies = useMemo(() => {
    if (!selectedPlant) return null;
    return allSpecies.find((s) => s.scientific_name === selectedPlant.scientific_name) || null;
  }, [selectedPlant, allSpecies]);

  // Filter toggles
  const handleToggleUseTag = (tag: UseTag) => {
    setSelectedUseTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleFreshness = (status: FreshnessStatus) => {
    setSelectedFreshness((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleClearFilters = () => {
    setSelectedUseTags([]);
    setInSeasonOnly(false);
    setSelectedFreshness([]);
    setSearchQuery('');
  };

  // Handlers for "Still Here" / "Report Gone"
  const handleVerifyStillHere = async (plantId: string) => {
    try {
      await plantsApi.verifyPlant(plantId, 'still_here', coords?.lat, coords?.lng);
      awardPoints(2, 'Verified plant still here');
      setPlants((prev) =>
        prev.map((p) =>
          p.id === plantId
            ? {
                ...p,
                status: 'recently_verified',
                last_verified_at: new Date().toISOString(),
                verification_count: p.verification_count + 1,
              }
            : p
        )
      );
    } catch (e) {
      console.error('Failed to verify plant:', e);
    }
  };

  const handleReportGone = async (plantId: string) => {
    try {
      await plantsApi.reportPlant(plantId, 'gone');
      awardPoints(2, 'Reported plant gone');
      setPlants((prev) => prev.filter((p) => p.id !== plantId));
      if (selectedPlant?.id === plantId) {
        setSelectedPlant(null);
      }
    } catch (e) {
      console.error('Failed to report plant:', e);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-brand-cream text-stone-900 overflow-hidden">
      {/* 1. App Header */}
      <Header
        activeCityName={activeCityName}
        isUsingGPS={isUsingGPS}
        onSelectCityPreset={selectCityPreset}
        onRequestGPS={requestGPSLocation}
        isLocating={isLocating}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        userPoints={profile?.points || 0}
        isAuthenticated={isAuthenticated}
      />

      {/* 2. Upcoming Festivals & Puja Mode Strip */}
      <FestivalCalendar onSelectFestival={(fest) => setSelectedFestival(fest)} />

      {/* 3. Filter Chips Strip */}
      <FilterChips
        selectedUseTags={selectedUseTags}
        onToggleUseTag={handleToggleUseTag}
        inSeasonOnly={inSeasonOnly}
        onToggleInSeason={() => setInSeasonOnly(!inSeasonOnly)}
        selectedFreshness={selectedFreshness}
        onToggleFreshness={handleToggleFreshness}
        onClearAll={handleClearFilters}
      />

      {/* 3. Main Interactive Map Area */}
      <main className="flex-1 relative w-full overflow-hidden">
        <MapContainer
          plants={plants}
          centerCoords={coords}
          selectedPlant={selectedPlant}
          onSelectPlant={(plant) => setSelectedPlant(plant)}
          onRequestGPS={requestGPSLocation}
          isLocating={isLocating}
        />

        {/* 4. 100m Proximity Recheck Prompt */}
        <ProximityPromptCard
          plant={promptPlant}
          onConfirmStillHere={handleVerifyStillHere}
          onReportGone={handleReportGone}
          onDismiss={dismissPrompt}
        />

        {/* 5. Nearest First Bottom Sheet */}
        <NearestBottomSheet
          plants={plants}
          allSpecies={allSpecies}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPlant={selectedPlant}
          onSelectPlant={(plant) => setSelectedPlant(plant)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          activeCityName={activeCityName}
        />

        {/* 6. Offline status badge */}
        <OfflineBadge />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-full shadow border border-stone-200 dark:border-stone-800 animate-pulse">
            Searching nearby flora...
          </div>
        )}
      </main>

      {/* 7. Plant Detail Full Sheet Modal */}
      {selectedPlant && (
        <PlantDetailSheet
          plant={selectedPlant}
          speciesDetails={selectedPlantSpecies}
          onClose={() => setSelectedPlant(null)}
          onVerifyStillHere={handleVerifyStillHere}
          onReportGone={handleReportGone}
          onAddPhoto={() => setIsAddModalOpen(true)}
        />
      )}

      {/* 8. Add Plant Wizard Modal */}
      <AddPlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        currentLat={coords?.lat || 25.3176}
        currentLng={coords?.lng || 82.9739}
        onPlantAdded={loadPlants}
      />

      {/* 9. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 10. Festival & Puja Mode Checklist Drawer */}
      <FestivalChecklist
        festival={selectedFestival}
        nearbyPlants={plants}
        userLat={coords?.lat || 25.3176}
        userLng={coords?.lng || 82.9739}
        onClose={() => setSelectedFestival(null)}
        onSelectPlantOnMap={(plant) => setSelectedPlant(plant)}
      />
    </div>
  );
};

export default App;
