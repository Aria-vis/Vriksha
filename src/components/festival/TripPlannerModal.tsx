import React from 'react';
import { X, Navigation, Footprints, Car, CheckCircle2, Trees, ExternalLink, Sparkles } from 'lucide-react';
import { OptimizedTrip } from '../../lib/routePlanner';
import { formatDistance } from '../../lib/formatters';

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: OptimizedTrip | null;
  festivalName: string;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  isOpen,
  onClose,
  trip,
  festivalName,
}) => {
  if (!isOpen || !trip) return null;

  const handleOpenGoogleMaps = () => {
    if (trip.googleMapsUrl) {
      window.open(trip.googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-100 dark:border-stone-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-800 to-forest-900 text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400/20 text-amber-200 text-xs font-semibold rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimized Collection Route</span>
            </div>
            <h2 className="text-xl font-bold font-serif">{festivalName} Trip</h2>
            <p className="text-xs text-forest-200">
              Shortest path covering all available items in your checklist
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Summary Stats */}
        <div className="grid grid-cols-3 divide-x divide-stone-200 dark:divide-stone-800 bg-amber-50/60 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 p-3 text-center text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-stone-500">Total Distance</div>
            <div className="text-sm font-bold text-forest-900 dark:text-emerald-400">
              {formatDistance(trip.totalDistanceMeters)}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-[10px] uppercase font-bold text-stone-500 flex items-center gap-1">
              <Footprints className="w-3 h-3 text-stone-600" />
              <span>Walking</span>
            </div>
            <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
              ~{trip.estimatedWalkingMinutes} min
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-[10px] uppercase font-bold text-stone-500 flex items-center gap-1">
              <Car className="w-3 h-3 text-stone-600" />
              <span>Driving</span>
            </div>
            <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
              ~{trip.estimatedDrivingMinutes} min
            </div>
          </div>
        </div>

        {/* Stop by Stop List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {trip.stops.map((stop) => (
            <div
              key={stop.stopIndex}
              className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-emerald-300 transition-colors"
            >
              {/* Stop Number Circle */}
              <div className="w-7 h-7 rounded-full bg-forest-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {stop.stopIndex}
              </div>

              {/* Stop Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-tight">
                      {stop.plant.common_name_en}{' '}
                      <span className="text-brand-saffron font-medium">({stop.plant.common_name_hi})</span>
                    </h4>
                    <p className="text-[11px] text-stone-500 italic font-sans">{stop.plant.scientific_name}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full shrink-0">
                    +{formatDistance(stop.distanceFromPreviousMeters)}
                  </span>
                </div>

                <div className="mt-2 text-xs text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 p-2 rounded-xl border border-stone-100 dark:border-stone-700/60 space-y-0.5">
                  <div className="font-medium text-forest-800 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                    <span>Part: {stop.itemNeeded.part_needed}</span>
                  </div>
                  <p className="text-[11px] text-stone-500">{stop.itemNeeded.purpose}</p>
                  {stop.plant.address_hint && (
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 pt-0.5 border-t border-stone-100 dark:border-stone-700">
                      📍 {stop.plant.address_hint}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {trip.stops.length === 0 && (
            <div className="py-12 text-center text-xs text-stone-500">
              <Trees className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <span>No nearby trees found for the checklist items in this city area.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-800 shrink-0 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100"
          >
            Close
          </button>

          <button
            onClick={handleOpenGoogleMaps}
            disabled={!trip.googleMapsUrl}
            className="flex-1 py-2.5 px-4 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Navigation className="w-4 h-4 rotate-45" />
            <span>Open Multi-Stop in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
