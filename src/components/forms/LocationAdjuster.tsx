import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface LocationAdjusterProps {
  lat: number;
  lng: number;
  accuracyMeters?: number | null;
  addressHint: string;
  onCoordinatesChange: (lat: number, lng: number) => void;
  onAddressHintChange: (hint: string) => void;
  onRefreshGps?: () => void;
}

export const LocationAdjuster: React.FC<LocationAdjusterProps> = ({
  lat,
  lng,
  accuracyMeters,
  addressHint,
  onCoordinatesChange,
  onAddressHintChange,
  onRefreshGps,
}) => {
  // Nudge coordinates by ~10 meters (0.0001 deg) for pin fine-tuning
  const nudge = (dLat: number, dLng: number) => {
    onCoordinatesChange(
      Math.round((lat + dLat) * 100000) / 100000,
      Math.round((lng + dLng) * 100000) / 100000
    );
  };

  return (
    <div className="space-y-3">
      {/* Coordinates & Accuracy Header */}
      <div className="flex items-center justify-between p-3 bg-forest-50/70 border border-forest-100 rounded-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-forest-800 text-white flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-mono font-semibold text-gray-900">
              {lat.toFixed(5)}° N, {lng.toFixed(5)}° E
            </div>
            <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <span>GPS Precision</span>
              {accuracyMeters && (
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-medium">
                  ±{Math.round(accuracyMeters)}m
                </span>
              )}
            </div>
          </div>
        </div>

        {onRefreshGps && (
          <button
            type="button"
            onClick={onRefreshGps}
            className="p-2 rounded-lg bg-white border border-forest-200 text-forest-800 hover:bg-forest-50 transition-colors shadow-sm"
            title="Update to current GPS location"
          >
            <Navigation className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pin Micro-Adjustment Controls */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-forest-700" />
            Fine-tune Pin Position
          </span>
          <span className="text-[11px] text-gray-500">1 tap ≈ 10 meters</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 max-w-[180px] mx-auto pt-1">
          <div />
          <button
            type="button"
            onClick={() => nudge(0.0001, 0)}
            className="py-1 px-2 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-forest-50 active:scale-95"
          >
            ↑ N
          </button>
          <div />
          <button
            type="button"
            onClick={() => nudge(0, -0.0001)}
            className="py-1 px-2 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-forest-50 active:scale-95"
          >
            ← W
          </button>
          <div className="flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-forest-600" />
          </div>
          <button
            type="button"
            onClick={() => nudge(0, 0.0001)}
            className="py-1 px-2 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-forest-50 active:scale-95"
          >
            E →
          </button>
          <div />
          <button
            type="button"
            onClick={() => nudge(-0.0001, 0)}
            className="py-1 px-2 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-forest-50 active:scale-95"
          >
            ↓ S
          </button>
          <div />
        </div>
      </div>

      {/* Address / Landmark Hint */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
          Landmark or Location Hint
        </label>
        <input
          type="text"
          value={addressHint}
          onChange={(e) => onAddressHintChange(e.target.value)}
          placeholder="e.g., Outside Sector 4 Hanuman Mandir, east gate"
          className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:border-forest-600 focus:ring-1 focus:ring-forest-600 outline-none"
        />
        <p className="text-[11px] text-gray-500 mt-1">
          Helps community members locate the exact tree in busy areas or parks.
        </p>
      </div>
    </div>
  );
};
