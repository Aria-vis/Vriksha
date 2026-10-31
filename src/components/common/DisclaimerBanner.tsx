import React from 'react';
import { Leaf, Info, ShieldCheck } from 'lucide-react';

export const HarvestingEtiquetteBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 shadow-sm ${className}`}>
      <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <span className="font-semibold block text-emerald-800 dark:text-emerald-300">
          🌿 Harvesting Etiquette (संवेदनशील दोहन)
        </span>
        <p className="leading-relaxed text-[11px] text-emerald-700 dark:text-emerald-300">
          Take only a few leaves, flowers, or fallen twigs. Never strip trunk bark or branches. Always ask respectful permission on temple, institutional, or private grounds.
        </p>
      </div>
    </div>
  );
};

export const MedicalDisclaimerBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-2.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 ${className}`}>
      <Info className="w-4 h-4 text-brand-saffron shrink-0 mt-0.5" />
      <div className="text-[11px] leading-relaxed">
        <span className="font-semibold text-amber-900 dark:text-amber-100">Traditional use only. Not medical advice. </span>
        <span>Information here reflects cultural and Ayurvedic traditions. Always consult a certified healthcare professional before ingesting wild plants.</span>
      </div>
    </div>
  );
};

export const RestrictedConservationBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5 ${className}`}>
      <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold block text-purple-800 dark:text-purple-300">
          🛡️ Protected / Restricted Species (संरक्षित वनस्पति)
        </span>
        <p className="text-[11px] text-purple-700 dark:text-purple-300 leading-relaxed">
          To prevent poaching and unsustainable harvesting of sensitive flora, exact coordinates are protected. An approximate ~5 km grid centroid is displayed.
        </p>
      </div>
    </div>
  );
};
