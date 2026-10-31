import React from 'react';
import { PlantSearchResult } from '../../types/plant';
import { MapPin, CheckCircle2, XCircle, X } from 'lucide-react';

interface ProximityPromptCardProps {
  plant: PlantSearchResult | null;
  onConfirmStillHere: (plantId: string) => void;
  onReportGone: (plantId: string) => void;
  onDismiss: () => void;
}

export const ProximityPromptCard: React.FC<ProximityPromptCardProps> = ({
  plant,
  onConfirmStillHere,
  onReportGone,
  onDismiss,
}) => {
  if (!plant) return null;

  return (
    <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-amber-300 dark:border-amber-800 p-3.5 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 dark:bg-amber-950/80 rounded-full text-brand-saffron shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
              Nearby Plant Needs Recheck!
            </h4>
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              You are near a <strong>{plant.common_name_en} ({plant.common_name_hi})</strong>. Is it still here?
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          aria-label="Dismiss prompt"
          className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={() => {
            onConfirmStillHere(plant.id);
            onDismiss();
          }}
          className="flex-1 py-1.5 px-2 bg-brand-green hover:bg-brand-green-light text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 shadow-sm transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Still Here</span>
        </button>

        <button
          onClick={() => {
            onReportGone(plant.id);
            onDismiss();
          }}
          className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>It's Gone</span>
        </button>
      </div>
    </div>
  );
};

export default ProximityPromptCard;
