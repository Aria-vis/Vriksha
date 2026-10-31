import React from 'react';
import { X, Trees, MapPin, Calendar, BookOpen, ShieldCheck } from 'lucide-react';
import { PlantSearchResult } from '../../types/plant';
import { FAMOUS_HERITAGE_TREES } from '../../data/heritageTreesData';

interface HeritageStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  plant?: PlantSearchResult | null;
}

export const HeritageStoryModal: React.FC<HeritageStoryModalProps> = ({
  isOpen,
  onClose,
  plant,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sacred and Heritage Tree Stories"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600/80 rounded-xl">
              <BookOpen className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif leading-tight">
                Sacred &amp; Heritage Tree Stories
              </h2>
              <p className="text-xs text-amber-200">
                Folklore, centuries-old legends &amp; living sacred monuments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close heritage stories"
            className="p-1.5 rounded-full hover:bg-amber-700/60 text-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {plant?.is_sacred_heritage && plant.heritage_story && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded text-[10px] font-bold uppercase tracking-wider">
                  Selected Tree Lore
                </span>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  {plant.common_name_en} ({plant.common_name_hi})
                </h3>
              </div>
              <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                &ldquo;{plant.heritage_story}&rdquo;
              </p>
              <div className="text-[11px] text-stone-500 italic">
                Attribution: {plant.attribution} • Verified Community Oral History
              </div>
            </div>
          )}

          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
            Revered Heritage Trees of India
          </div>

          <div className="space-y-3">
            {FAMOUS_HERITAGE_TREES.map((tree) => (
              <div
                key={tree.id}
                className="p-3.5 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>{tree.name}</span>
                      <span className="text-amber-700 dark:text-amber-400 text-xs font-normal">
                        ({tree.hindiName})
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-500 italic">{tree.speciesScientific}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-[10px] font-bold rounded-full">
                    <Calendar className="w-3 h-3 text-amber-700" />
                    ~{tree.estimatedAgeYears} Years
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{tree.location}, {tree.city}</span>
                  </span>
                  <span>•</span>
                  <span className="text-[11px] text-stone-400">{tree.sacredTradition}</span>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {tree.story}
                </p>

                <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>State Heritage Protected</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Trees className="w-3.5 h-3.5 text-forest-700" />
                    <span>Community Stewarded</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeritageStoryModal;
