import { PlantSearchResult } from '../../types/plant';
import FreshnessBadge from './FreshnessBadge';
import { formatDistance } from '../../lib/formatters';
import { MapPin, Navigation, Trees, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PlantCardProps {
  plant: PlantSearchResult;
  isSelected?: boolean;
  onSelect?: (plant: PlantSearchResult) => void;
  className?: string;
}


export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  return (
    <div
      onClick={() => onSelect?.(plant)}
      className={`p-3.5 bg-white dark:bg-stone-900 rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
        isSelected
          ? 'border-brand-saffron ring-2 ring-brand-saffron/20 bg-amber-50/20'
          : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300'
      } ${className}`}
    >
      <div className="flex gap-3">
        {/* Thumbnail or Botanical Graphic */}
        <div className="w-18 h-18 sm:w-20 sm:h-20 w-[72px] h-[72px] rounded-xl overflow-hidden bg-emerald-50 dark:bg-emerald-950/60 shrink-0 relative flex items-center justify-center border border-emerald-100/80">
          {plant.primary_photo_url ? (
            <img
              src={plant.primary_photo_url}
              alt={plant.common_name_en}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <Trees className="w-8 h-8 text-emerald-700/60" />
          )}

          {/* Toxic Icon Overlay */}
          {plant.is_toxic && (
            <span
              className="absolute top-1 left-1 p-0.5 bg-red-600 text-white rounded-full shadow"
              title="Toxic species"
            >
              <AlertTriangle className="w-3 h-3" />
            </span>
          )}

          {/* Restricted Icon Overlay */}
          {plant.is_restricted && (
            <span
              className="absolute top-1 right-1 p-0.5 bg-purple-700 text-white rounded-full shadow"
              title="Restricted species (fuzzed location)"
            >
              <ShieldCheck className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Plant Meta Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-tight truncate">
                <span>{plant.common_name_en}</span>
                <span className="text-brand-saffron font-medium ml-1.5 text-xs">
                  ({plant.common_name_hi})
                </span>
              </h3>
              
              {/* Distance Pill */}
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-semibold rounded-full shrink-0">
                <Navigation className="w-2.5 h-2.5 text-emerald-600 rotate-45" />
                <span>{formatDistance(plant.distance_meters)}</span>
              </span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 italic truncate font-sans">
              {plant.scientific_name}
            </p>

            {plant.address_hint && (
              <p className="text-[11px] text-stone-600 dark:text-stone-300 flex items-center gap-1 mt-1 truncate">
                <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="truncate">{plant.address_hint}</span>
              </p>
            )}
          </div>

          {/* Badges strip */}
          <div className="flex items-center gap-2 mt-2 pt-1 border-t border-stone-100 dark:border-stone-800">
            <FreshnessBadge status={plant.status} lastVerifiedAt={plant.last_verified_at} />

            <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-md capitalize">
              {plant.land_type}
            </span>

            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-md uppercase font-mono font-medium">
              {plant.source}
            </span>

            {plant.is_sacred_heritage && (
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-900 font-semibold rounded-md">
                Heritage
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
