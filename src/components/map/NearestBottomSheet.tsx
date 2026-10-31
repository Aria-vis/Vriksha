import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlantSearchResult, Species } from '../../types/plant';
import PlantCard from '../plant/PlantCard';
import {
  ChevronUp,
  ChevronDown,
  Search,
  X,
  PlusCircle,
  Trees,
  Mic,
  Sparkles,
  BookOpen,
  Sprout,
  Download,
} from 'lucide-react';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

interface NearestBottomSheetProps {
  plants: PlantSearchResult[];
  allSpecies: Species[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPlant: PlantSearchResult | null;
  onSelectPlant: (plant: PlantSearchResult) => void;
  onOpenAddModal: () => void;
  activeCityName: string;
  onOpenCommunityBoard?: () => void;
  onOpenHeritageStories?: () => void;
  onOpenNurseries?: () => void;
  onOpenExport?: () => void;
}

export const NearestBottomSheet: React.FC<NearestBottomSheetProps> = ({
  plants,
  allSpecies,
  searchQuery,
  onSearchChange,
  selectedPlant,
  onSelectPlant,
  onOpenAddModal,
  activeCityName,
  onOpenCommunityBoard,
  onOpenHeritageStories,
  onOpenNurseries,
  onOpenExport,
}) => {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const { isListening, isSupported, startListening } = useVoiceSearch(
    (text) => {
      onSearchChange(text);
      setShowSuggestions(false);
    },
    i18n.language === 'hi' ? 'hi' : 'en'
  );

  // Suggestions for autocomplete
  const suggestions = searchQuery.trim().length >= 1
    ? allSpecies
        .filter((s) => {
          const q = searchQuery.toLowerCase();
          return (
            s.common_name_en.toLowerCase().includes(q) ||
            s.common_name_hi.toLowerCase().includes(q) ||
            s.scientific_name.toLowerCase().includes(q) ||
            s.local_names?.some((ln) => ln.local_name.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-t-3xl shadow-2xl border-t border-stone-200 dark:border-stone-800 transition-all duration-300 flex flex-col ${
        isExpanded ? 'h-[75vh]' : 'h-[230px] sm:h-[260px]'
      }`}
    >
      {/* Drag handle & header bar */}
      <div
        className="w-full pt-2 pb-1.5 px-4 flex flex-col items-center cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-12 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mb-1.5" />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              Nearest Plants ({plants.length})
            </span>
            <span className="text-xs text-stone-500">around {activeCityName}</span>
          </div>

          <button
            aria-label={isExpanded ? 'Collapse list' : 'Expand list'}
            className="p-1 text-stone-500 hover:text-stone-900"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search Input Bar with Autocomplete & Voice Search */}
      <div className="px-4 pb-2 relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={
              isListening
                ? 'Listening... Speak now (Hindi or English)'
                : t('app.searchPlaceholder', 'Search neem, bael, tulsi, durva, shami...')
            }
            className={`w-full py-2 pl-9 pr-16 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-500 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-green border-none transition-all ${
              isListening ? 'ring-2 ring-red-500 bg-red-50/40 dark:bg-red-950/30' : ''
            }`}
          />

          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSuggestions(false);
                }}
                aria-label="Clear search query"
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Voice Search Button */}
            {isSupported && (
              <button
                type="button"
                onClick={startListening}
                aria-label="Search by voice in Hindi or English"
                title="Speak to search (Hindi or English)"
                className={`p-1 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-stone-400 hover:text-forest-700 hover:bg-stone-200/60 dark:hover:bg-stone-700'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Utility Action Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 no-scrollbar text-[11px]">
          {onOpenCommunityBoard && (
            <button
              onClick={onOpenCommunityBoard}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-900 rounded-full shrink-0 font-medium transition-colors"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Community Board</span>
            </button>
          )}

          {onOpenHeritageStories && (
            <button
              onClick={onOpenHeritageStories}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-900 rounded-full shrink-0 font-medium transition-colors"
            >
              <BookOpen className="w-3 h-3 text-emerald-600" />
              <span>Heritage Lore</span>
            </button>
          )}

          {onOpenNurseries && (
            <button
              onClick={onOpenNurseries}
              className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-900 dark:text-teal-200 border border-teal-200/80 dark:border-teal-900 rounded-full shrink-0 font-medium transition-colors"
            >
              <Sprout className="w-3 h-3 text-teal-600" />
              <span>Sapling Banks</span>
            </button>
          )}

          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-full shrink-0 font-medium transition-colors"
            >
              <Download className="w-3 h-3 text-stone-500" />
              <span>Export GIS</span>
            </button>
          )}
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-4 right-4 z-50 mt-1 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden divide-y divide-stone-100 dark:divide-stone-700">
            {suggestions.map((sp) => (
              <div
                key={sp.scientific_name}
                onClick={() => {
                  onSearchChange(sp.common_name_en);
                  setShowSuggestions(false);
                }}
                className="px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 cursor-pointer flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{sp.common_name_en}</span>
                  <span className="text-brand-saffron ml-1.5 font-medium">({sp.common_name_hi})</span>
                  <span className="text-[11px] text-stone-400 italic block">{sp.scientific_name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 dark:bg-stone-700 text-stone-600 rounded">
                  {sp.plant_type.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plant Cards Scroll List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2.5 touch-scroll">
        {plants.length > 0 ? (
          plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              isSelected={selectedPlant?.id === plant.id}
              onSelect={onSelectPlant}
            />
          ))
        ) : (
          <div className="p-6 text-center flex flex-col items-center justify-center text-stone-500 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center">
              <Trees className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                No matching plants found nearby
              </p>
              <p className="text-xs text-stone-500 mt-0.5 max-w-xs mx-auto">
                No {searchQuery ? `"${searchQuery}"` : 'plants'} marked in this area yet. Be the first to add one for your neighborhood!
              </p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-green hover:bg-brand-green-light text-white text-xs font-semibold rounded-xl shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add a Plant Here</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearestBottomSheet;
