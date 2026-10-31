import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, MapPin, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-100 dark:border-stone-800 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-forest-800 to-forest-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">Privacy &amp; Safety Policy</h2>
              <p className="text-xs text-forest-200">Our non-negotiable community ethical charter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
          {/* 1. Restricted Species Shield */}
          <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
              <Lock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>1. Restricted Species Shield (~5 km Fuzzing)</span>
            </div>
            <p>
              To protect vulnerable, endangered, or commercially sensitive species (such as <em>Santalum album</em> / White Sandalwood and <em>Pterocarpus santalinus</em> / Red Sanders) from poaching or vandalism, <strong>exact GPS coordinates are never exposed</strong> to public users, search APIs, or open data exports.
            </p>
            <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
              Coordinates for restricted species are automatically displaced to a ~5 km grid centroid. Full coordinates are strictly restricted to verified moderators and research administrators.
            </p>
          </div>

          {/* 2. Zero Contributor Tracking */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
              <EyeOff className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>2. Zero Contributor Location Tracking</span>
            </div>
            <p>
              We believe in true digital privacy. Contributor home addresses, real-time location histories, and IP locations are <strong>never stored, tracked, or shared</strong>. Your GPS is used strictly on-device in real-time to calculate distance to nearby flora.
            </p>
          </div>

          {/* 3. Private Property & Landowner Consent */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
              <MapPin className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>3. Private Property &amp; Landowner Consent</span>
            </div>
            <p>
              Plants located on private property strictly require explicit confirmation of owner consent before they can be added to Vriksha. Trespassing is forbidden. If a property owner requests removal, community moderators immediately take down or mask the entry.
            </p>
          </div>

          {/* 4. Harvesting Etiquette & Medical Disclaimer */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1.5">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
              <HeartHandshake className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>4. Harvesting Etiquette &amp; Traditional Use</span>
            </div>
            <p>
              All foragers must practice sacred respect: take only a few fallen twigs or leaves, never strip bark or branches, and never damage roots. All medicinal tags represent traditional cultural use and are <strong>not medical advice</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 shrink-0 flex items-center justify-between">
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free • Non-Profit • Open Commons</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-semibold shadow-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
