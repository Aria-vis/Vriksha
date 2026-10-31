import React, { useState, useEffect, useMemo } from 'react';
import { Search, HelpCircle, Check, Sparkles } from 'lucide-react';
import { Species, UseTag } from '../../types/plant';
import { plantsApi } from '../../services/plantsApi';

interface SpeciesPickerProps {
  selectedSpeciesId?: string | null;
  onSelectSpecies: (species: Species | null) => void;
}

export const SpeciesPicker: React.FC<SpeciesPickerProps> = ({
  selectedSpeciesId,
  onSelectSpecies,
}) => {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    plantsApi.fetchAllSpecies().then((data) => {
      if (mounted) {
        setSpeciesList(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredSpecies = useMemo(() => {
    return speciesList.filter((sp) => {
      // Category filter
      if (activeCategory !== 'all') {
        if (!sp.use_tags.includes(activeCategory as UseTag)) {
          return false;
        }
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchEn = sp.common_name_en.toLowerCase().includes(q);
      const matchHi = sp.common_name_hi.toLowerCase().includes(q);
      const matchSci = sp.scientific_name.toLowerCase().includes(q);
      const matchSynonyms = sp.local_names?.some((ln) =>
        ln.local_name.toLowerCase().includes(q)
      );

      return matchEn || matchHi || matchSci || matchSynonyms;
    });
  }, [speciesList, searchQuery, activeCategory]);

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Neem, नीम, Bael, Tulsi..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-forest-600 focus:ring-1 focus:ring-forest-600 outline-none transition-colors"
        />
      </div>

      {/* Quick Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Plants' },
          { id: 'puja', label: 'Puja / Festival' },
          { id: 'medicinal', label: 'Medicinal' },
          { id: 'fruit', label: 'Fruit' },
          { id: 'shade', label: 'Shade Tree' },
          { id: 'flowers', label: 'Flowers' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-forest-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Species Selection Grid */}
      <div className="max-h-60 overflow-y-auto pr-1 space-y-1.5 border border-gray-100 rounded-xl p-1 bg-gray-50/50">
        {/* "Not sure" identification option */}
        <button
          type="button"
          onClick={() => onSelectSpecies(null)}
          className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
            selectedSpeciesId === null
              ? 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-500'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span>Not Sure / Help Identify</span>
                <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded text-[10px] font-medium">
                  Community ID
                </span>
              </p>
              <p className="text-[11px] text-gray-500">
                Upload photo, community will help identify species
              </p>
            </div>
          </div>
          {selectedSpeciesId === null && <Check className="w-4 h-4 text-amber-600" />}
        </button>

        {loading ? (
          <div className="py-8 text-center text-xs text-gray-500">
            Loading 80 curated Indian species...
          </div>
        ) : filteredSpecies.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No matching species found. Pick &quot;Not Sure / Help Identify&quot; to continue.
          </div>
        ) : (
          filteredSpecies.map((sp) => {
            const isSelected = selectedSpeciesId === sp.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => onSelectSpecies(sp)}
                className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-forest-50 border-forest-600 shadow-sm ring-1 ring-forest-600'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">
                      {sp.common_name_hi} ({sp.common_name_en})
                    </span>
                    {sp.use_tags.includes('puja') && (
                      <Sparkles className="w-3 h-3 text-amber-500 inline-block flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 italic truncate">
                    {sp.scientific_name}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-forest-600 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
