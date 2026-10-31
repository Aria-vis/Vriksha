import React, { useState } from 'react';
import { PlantSearchResult, Species } from '../../types/plant';
import FreshnessBadge from './FreshnessBadge';
import SeasonalityStrip from './SeasonalityStrip';
import { HarvestingEtiquetteBanner, MedicalDisclaimerBanner, RestrictedConservationBanner } from '../common/DisclaimerBanner';
import ToxicityAlert from '../common/ToxicityAlert';
import {
  X,
  Navigation,
  CheckCircle2,
  Share2,
  Calendar,
  MapPin,
  Trees,
  Check,
  Flag,
  Camera,
} from 'lucide-react';

import { formatDistance } from '../../lib/formatters';


interface PlantDetailSheetProps {
  plant: PlantSearchResult | null;
  speciesDetails?: Species | null;
  onClose: () => void;
  onVerifyStillHere?: (plantId: string) => Promise<void> | void;
  onReportGone?: (plantId: string) => Promise<void> | void;
  onAddPhoto?: (plantId: string) => void;
}

export const PlantDetailSheet: React.FC<PlantDetailSheetProps> = ({
  plant,
  speciesDetails,
  onClose,
  onVerifyStillHere,
  onReportGone,
  onAddPhoto,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [justVerified, setJustVerified] = useState(false);
  const [justReported, setJustReported] = useState(false);

  if (!plant) return null;

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${plant.lat},${plant.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const shareText = `Check out this ${plant.common_name_en} (${plant.common_name_hi}) on Vriksha - only ${formatDistance(
      plant.distance_meters
    )} away: https://vriksha.app/plant/${plant.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vriksha: ${plant.common_name_en} (${plant.common_name_hi})`,
          text: shareText,
          url: `https://vriksha.app/plant/${plant.id}`,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleStillHere = async () => {
    setJustVerified(true);
    await onVerifyStillHere?.(plant.id);
  };

  const handleReportGone = async () => {
    setJustReported(true);
    await onReportGone?.(plant.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 dark:border-stone-800">
        {/* Header Image & Close */}
        <div className="relative h-48 sm:h-56 w-full bg-emerald-900 overflow-hidden shrink-0">
          {plant.primary_photo_url ? (
            <img
              src={plant.primary_photo_url}
              alt={plant.common_name_en}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-emerald-200/70 p-4">
              <Trees className="w-16 h-16 stroke-1 mb-2" />
              <span className="text-xs font-medium">Community Plant Record</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on Image */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <FreshnessBadge status={plant.status} lastVerifiedAt={plant.last_verified_at} showRelativeTime />
              <span className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full font-medium capitalize">
                {plant.plant_type.replace('_', ' ')}
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight flex items-baseline gap-2">
              <span>{plant.common_name_en}</span>
              <span className="text-brand-saffron text-lg font-semibold">({plant.common_name_hi})</span>
            </h2>
            <p className="text-xs text-stone-300 italic font-sans">{plant.scientific_name}</p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 touch-scroll">
          {/* Quick Action Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleDirections}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-green hover:bg-brand-green-light text-white rounded-xl text-xs font-semibold shadow transition-colors"
            >
              <Navigation className="w-4 h-4 rotate-45" />
              <span>Directions</span>
            </button>

            <button
              onClick={handleStillHere}
              disabled={justVerified}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                justVerified
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{justVerified ? 'Confirmed!' : 'Still Here'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold transition-colors"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedShare ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Warnings & Protected Status */}
          {plant.is_toxic && <ToxicityAlert details={plant.toxicity_details} />}
          {plant.is_restricted && <RestrictedConservationBanner />}

          {/* Location & Land Information */}
          <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-earth" />
                <span>Location Details</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">
                {formatDistance(plant.distance_meters)} away
              </span>
            </div>

            <p className="text-stone-600 dark:text-stone-300">{plant.address_hint || 'Exact location pinned on map.'}</p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
              <span>Land: <strong className="capitalize text-stone-700 dark:text-stone-300">{plant.land_type}</strong></span>
              <span>•</span>
              <span>Source: <strong className="text-stone-700 dark:text-stone-300">{plant.source}</strong></span>
            </div>
          </div>

          {/* Seasonality Strip */}
          {speciesDetails && (
            <SeasonalityStrip
              floweringMonths={speciesDetails.seasonality_flowering}
              fruitingMonths={speciesDetails.seasonality_fruiting}
              freshLeavesMonths={speciesDetails.seasonality_fresh_leaves}
            />
          )}

          {/* Uses & Parts Used */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              Traditional Uses & Parts
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {plant.use_tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium rounded-lg capitalize"
                >
                  {tag.replace('_', ' ')}
                </span>
              ))}
              {plant.parts_used.map((part) => (
                <span
                  key={part}
                  className="px-2 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs rounded-lg capitalize"
                >
                  Part: {part.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Regional Vernacular Names */}
          {speciesDetails?.local_names && speciesDetails.local_names.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                Names in Other Languages
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                {speciesDetails.local_names.map((ln) => (
                  <div
                    key={`${ln.language_code}-${ln.local_name}`}
                    className="p-1.5 bg-stone-50 dark:bg-stone-800/40 rounded-lg border border-stone-100 dark:border-stone-800"
                  >
                    <span className="text-[10px] text-stone-400 uppercase font-mono mr-1">
                      {ln.language_code}:
                    </span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {ln.local_name}
                    </span>
                    {ln.transliteration && (
                      <span className="text-[10px] text-stone-500 block">
                        ({ln.transliteration})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Etiquette & Medical Guidelines */}
          <HarvestingEtiquetteBanner />
          <MedicalDisclaimerBanner />

          {/* Verification & Attribution Footer */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Verified {new Date(plant.last_verified_at).toLocaleDateString()}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddPhoto?.(plant.id)}
                className="text-emerald-700 hover:underline flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                <span>Add Photo</span>
              </button>
              <span>•</span>
              <button
                onClick={handleReportGone}
                disabled={justReported}
                className="text-stone-500 hover:text-red-600 flex items-center gap-1"
              >
                <Flag className="w-3 h-3" />
                <span>{justReported ? 'Reported' : 'Report Gone'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailSheet;
