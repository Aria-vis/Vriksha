import React, { useState } from 'react';
import { GitMerge, Check, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { PlantSearchResult } from '../../types/plant';
import { findDuplicateCandidates, DuplicateCandidatePair } from '../../lib/duplicateDetection';

interface DuplicateMergeToolProps {
  plants: PlantSearchResult[];
  onMerge?: (canonicalId: string, duplicateId: string) => void;
}

export const DuplicateMergeTool: React.FC<DuplicateMergeToolProps> = ({
  plants,
  onMerge,
}) => {
  const [candidates] = useState<DuplicateCandidatePair[]>(() =>
    findDuplicateCandidates(plants, 25)
  );
  const [resolvedPairs, setResolvedPairs] = useState<Record<string, boolean>>({});

  const handleMerge = (pairKey: string, canonicalId: string, duplicateId: string) => {
    setResolvedPairs((prev) => ({ ...prev, [pairKey]: true }));
    onMerge?.(canonicalId, duplicateId);
  };

  const activeCandidates = candidates.filter(
    (c) => !resolvedPairs[`${c.plantA.id}-${c.plantB.id}`]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
        <span className="font-semibold flex items-center gap-1.5">
          <GitMerge className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
          <span>Potential Duplicate Plants (&le; 25m apart)</span>
        </span>
        <span className="text-[11px] text-stone-400">{activeCandidates.length} pairs detected</span>
      </div>

      {activeCandidates.length === 0 ? (
        <div className="py-12 text-center text-xs text-stone-500 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-800">
          <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="font-semibold text-stone-800 dark:text-stone-200">No Duplicates Detected</p>
          <p className="text-[11px] text-stone-500 mt-0.5">
            All nearby trees in this area have distinct spatial locations or species.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeCandidates.map((pair) => {
            const pairKey = `${pair.plantA.id}-${pair.plantB.id}`;
            return (
              <div
                key={pairKey}
                className="p-4 bg-white dark:bg-stone-800/70 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span>{pair.plantA.common_name_en} ({pair.plantA.common_name_hi})</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[10px]">
                      {pair.distanceMeters}m apart
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 italic font-sans">
                    {pair.plantA.scientific_name}
                  </span>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Record A */}
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/90 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-700 dark:text-stone-200">Record A</span>
                      <span className="text-[10px] text-stone-400 uppercase font-mono">{pair.plantA.source}</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-stone-600 dark:text-stone-300">
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{pair.plantA.address_hint || 'No address hint'}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{pair.plantA.verification_count} verifications</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMerge(pairKey, pair.plantA.id, pair.plantB.id)}
                      className="w-full py-1.5 px-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-1"
                    >
                      <span>Keep Record A</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Record B */}
                  <div className="p-3 bg-stone-50 dark:bg-stone-800/90 rounded-xl border border-stone-200 dark:border-stone-700/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-700 dark:text-stone-200">Record B</span>
                      <span className="text-[10px] text-stone-400 uppercase font-mono">{pair.plantB.source}</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-stone-600 dark:text-stone-300">
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{pair.plantB.address_hint || 'No address hint'}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{pair.plantB.verification_count} verifications</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMerge(pairKey, pair.plantB.id, pair.plantA.id)}
                      className="w-full py-1.5 px-2 bg-forest-800 hover:bg-forest-900 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-1"
                    >
                      <span>Keep Record B</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DuplicateMergeTool;
