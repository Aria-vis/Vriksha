import React, { useState } from 'react';
import { Search, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { Species } from '../../types/plant';

interface SpeciesManagementProps {
  speciesList: Species[];
  onToggleRestricted?: (speciesId: string, isRestricted: boolean) => void;
}

export const SpeciesManagement: React.FC<SpeciesManagementProps> = ({
  speciesList,
  onToggleRestricted,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localRestrictedMap, setLocalRestrictedMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    speciesList.forEach((s) => {
      map[s.id] = s.is_restricted;
    });
    return map;
  });

  const handleToggle = (id: string) => {
    const newVal = !localRestrictedMap[id];
    setLocalRestrictedMap((prev) => ({ ...prev, [id]: newVal }));
    onToggleRestricted?.(id, newVal);
  };

  const filtered = speciesList.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.common_name_en.toLowerCase().includes(q) ||
      s.common_name_hi.includes(q) ||
      s.scientific_name.toLowerCase().includes(q)
    );
  });

  const restrictedCount = Object.values(localRestrictedMap).filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Privacy Shield Banner */}
      <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200/80 dark:border-purple-900/60 flex items-start gap-2.5 text-xs text-purple-900 dark:text-purple-200">
        <Lock className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="leading-tight">
          <span className="font-bold">Restricted Species Shield Active: </span>
          <span>
            {restrictedCount} species currently protected. Exact GPS coordinates are masked to a ~5 km grid centroid for standard users to prevent illicit harvesting.
          </span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter species to manage protection..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl outline-none focus:border-forest-600"
        />
      </div>

      {/* Species Table / List */}
      <div className="max-h-80 overflow-y-auto space-y-1.5 border border-stone-200 dark:border-stone-800 rounded-2xl p-2 bg-stone-50/50 dark:bg-stone-900/40">
        {filtered.map((sp) => {
          const isRestricted = !!localRestrictedMap[sp.id];
          return (
            <div
              key={sp.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                isRestricted
                  ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {sp.common_name_en} ({sp.common_name_hi})
                  </span>
                  {isRestricted && (
                    <span className="px-1.5 py-0.2 bg-purple-200 text-purple-900 text-[10px] font-bold rounded">
                      Protected (~5km Fuzzed)
                    </span>
                  )}
                  {sp.is_toxic && (
                    <span className="px-1.5 py-0.2 bg-red-100 text-red-800 text-[10px] font-bold rounded flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Toxic
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 italic truncate font-sans">
                  {sp.scientific_name} • {sp.plant_type.replace('_', ' ')}
                </p>
              </div>

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => handleToggle(sp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                  isRestricted
                    ? 'bg-purple-700 text-white hover:bg-purple-800 shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {isRestricted ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Protected</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Public</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpeciesManagement;
