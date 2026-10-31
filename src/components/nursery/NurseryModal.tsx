import React, { useState } from 'react';
import { X, Sprout, MapPin, Phone, ExternalLink, CheckCircle } from 'lucide-react';
import { CIVIC_NURSERIES } from '../../data/civicNurseriesData';

interface NurseryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCityName?: string;
}

export const NurseryModal: React.FC<NurseryModalProps> = ({
  isOpen,
  onClose,
  activeCityName,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'free' | 'subsidized'>('all');

  if (!isOpen) return null;

  const filtered = CIVIC_NURSERIES.filter((n) => {
    if (filterType === 'all') return true;
    return n.distributionType === filterType;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Civic Nurseries and Free Sapling Distribution"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/80 rounded-xl">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif leading-tight">
                Civic Nurseries &amp; Free Sapling Banks
              </h2>
              <p className="text-xs text-emerald-200">
                Official state forest counters &amp; community sapling distribution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close nurseries modal"
            className="p-1.5 rounded-full hover:bg-emerald-700/60 text-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              All Centers ({CIVIC_NURSERIES.length})
            </button>
            <button
              onClick={() => setFilterType('free')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filterType === 'free'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              🌱 Free Government Schemes
            </button>
            <button
              onClick={() => setFilterType('subsidized')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filterType === 'subsidized'
                  ? 'bg-teal-700 text-white'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
              }`}
            >
              🏷️ Nominal Subsidized (₹15–₹30)
            </button>
          </div>
        </div>

        {/* Nursery List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            🌿 <strong>Vriksha Community Mission</strong>: Encourage planting sacred, medicinal, and native shade trees in community parks, school compounds, and neighborhood lanes.
          </div>

          {filtered.map((nur) => {
            const isCityMatch = activeCityName && nur.city.toLowerCase().includes(activeCityName.toLowerCase());
            return (
              <div
                key={nur.id}
                className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  isCityMatch
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 shadow-sm'
                    : 'bg-stone-50/70 dark:bg-stone-800/40 border-stone-200/80 dark:border-stone-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">{nur.name}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          nur.distributionType === 'free'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                        }`}
                      >
                        {nur.distributionType === 'free' ? 'Free Scheme' : 'Subsidized'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium">{nur.agency}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{nur.address}, <strong>{nur.city}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{nur.phone}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200/60 dark:border-stone-700 space-y-1 text-xs">
                  <div className="text-[10px] uppercase font-bold text-stone-400">
                    Popular Useful Saplings Available:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {nur.availableSaplings.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-[11px] rounded-md font-medium flex items-center gap-1"
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{s}</span>
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 pt-1">
                    🕒 {nur.seasonalTiming}
                  </div>
                </div>

                {nur.websiteUrl && (
                  <div className="text-right">
                    <a
                      href={nur.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-forest-700 hover:text-forest-800 font-bold"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NurseryModal;
