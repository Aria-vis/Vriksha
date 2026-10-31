import React, { useRef } from 'react';
import { X, QrCode, Printer, ShieldCheck, HeartHandshake } from 'lucide-react';
import { PlantSearchResult } from '../../types/plant';

interface PlantQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  plant: PlantSearchResult | null;
}

export const PlantQrModal: React.FC<PlantQrModalProps> = ({
  isOpen,
  onClose,
  plant,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !plant) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vriksha.org';
  const plantShareUrl = `${appUrl}/#plant-${plant.id}`;
  
  // High quality SVG QR code via standard QR code API / SVG generator
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    plantShareUrl
  )}`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Printable Plant QR Code Poster"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-sm">Printable Tree Steward QR Card</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close QR modal"
            className="p-1 rounded-full hover:bg-emerald-700 text-emerald-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview (Printable Container) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50 dark:bg-stone-950 flex flex-col items-center">
          <div
            ref={printRef}
            className="w-full max-w-xs bg-white text-stone-900 p-5 rounded-2xl shadow-md border-2 border-dashed border-emerald-700/80 text-center space-y-3"
          >
            <div className="inline-block px-2.5 py-0.5 bg-emerald-800 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              Vriksha Community Flora Map
            </div>

            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900 leading-tight">
                {plant.common_name_en}
              </h2>
              <p className="text-base font-semibold text-emerald-800">
                {plant.common_name_hi}
              </p>
              <p className="text-xs text-stone-500 italic font-sans">{plant.scientific_name}</p>
            </div>

            {/* QR Image */}
            <div className="p-2 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-center inline-block mx-auto">
              <img
                src={qrCodeApiUrl}
                alt={`QR code for ${plant.common_name_en}`}
                className="w-44 h-44 object-contain"
                crossOrigin="anonymous"
              />
            </div>

            <p className="text-[11px] text-stone-600 font-medium">
              Scan with phone camera to verify this tree or check its seasonal flowering/fruiting on Vriksha.
            </p>

            {/* Harvesting Etiquette on Card */}
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-900 text-left space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-950">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                <span>Sacred Harvesting Etiquette</span>
              </div>
              <p className="leading-tight">
                Please take only a few leaves or fallen twigs needed for today&apos;s puja. Never strip bark, cut branches, or uproot.
              </p>
            </div>

            <div className="pt-1 flex items-center justify-center gap-1 text-[10px] text-stone-400">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>vriksha.org • Free &amp; Non-Profit Community Map</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
          <span className="text-xs text-stone-500">Attach to tree guard or temple board</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print QR Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantQrModal;
