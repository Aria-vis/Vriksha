import React, { useState } from 'react';
import { X, Download, ShieldCheck, FileSpreadsheet, Globe, FileCode } from 'lucide-react';
import { PlantSearchResult } from '../../types/plant';

interface OpenDataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plants: PlantSearchResult[];
}

export const OpenDataExportModal: React.FC<OpenDataExportModalProps> = ({
  isOpen,
  onClose,
  plants,
}) => {
  const [includeRestricted, setIncludeRestricted] = useState<boolean>(false);
  const [format, setFormat] = useState<'geojson' | 'csv'>('geojson');

  if (!isOpen) return null;

  // Filter out restricted species if not requested, or strictly ensure fuzzed
  const exportablePlants = plants.filter((p) => {
    if (!includeRestricted && p.is_restricted) return false;
    return true;
  });

  const generateGeoJSON = (): string => {
    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        title: 'Vriksha Open Community Flora Dataset',
        generatedAt: new Date().toISOString(),
        license: 'CC BY-SA 4.0 & ODbL for OSM derived features',
        attribution: 'Vriksha Community Contributors & OpenStreetMap & iNaturalist',
        itemCount: exportablePlants.length,
        privacyNote: 'Coordinates of restricted/vulnerable flora are fuzzed to ~5km centroids',
      },
      features: exportablePlants.map((p) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat],
        },
        properties: {
          id: p.id,
          commonNameEn: p.common_name_en,
          commonNameHi: p.common_name_hi,
          scientificName: p.scientific_name,
          plantType: p.plant_type,
          useTags: p.use_tags,
          partsUsed: p.parts_used,
          landType: p.land_type,
          freshnessStatus: p.status,
          lastVerifiedAt: p.last_verified_at,
          isSacredHeritage: p.is_sacred_heritage,
          isRestricted: p.is_restricted,
          source: p.source,
          license: p.license,
        },
      })),
    };

    return JSON.stringify(geojson, null, 2);
  };

  const generateCSV = (): string => {
    const headers = [
      'id',
      'common_name_en',
      'common_name_hi',
      'scientific_name',
      'plant_type',
      'latitude',
      'longitude',
      'freshness_status',
      'land_type',
      'use_tags',
      'source',
      'license',
    ];

    const rows = exportablePlants.map((p) => [
      p.id,
      `"${p.common_name_en.replace(/"/g, '""')}"`,
      `"${p.common_name_hi.replace(/"/g, '""')}"`,
      `"${p.scientific_name}"`,
      p.plant_type,
      p.lat.toFixed(6),
      p.lng.toFixed(6),
      p.status,
      p.land_type,
      `"${p.use_tags.join(';')}"`,
      p.source,
      p.license,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const handleDownload = () => {
    const isGeo = format === 'geojson';
    const content = isGeo ? generateGeoJSON() : generateCSV();
    const mimeType = isGeo ? 'application/geo+json' : 'text/csv;charset=utf-8;';
    const filename = `vriksha-plants-export-${new Date().toISOString().slice(0, 10)}.${
      isGeo ? 'geojson' : 'csv'
    }`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Open Data Export"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-forest-800 to-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/80 rounded-xl">
              <Download className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif leading-tight">
                Export Open Flora Data
              </h2>
              <p className="text-xs text-emerald-200">
                Community-verified botanical GIS data under CC BY-SA 4.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close export modal"
            className="p-1.5 rounded-full hover:bg-emerald-700/60 text-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto text-xs">
          {/* Format selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 dark:text-stone-300">
              Select Output Data Format:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat('geojson')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all ${
                  format === 'geojson'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <FileCode className="w-5 h-5 text-emerald-700" />
                <div>
                  <div className="font-bold text-sm">GeoJSON</div>
                  <div className="text-[11px] text-stone-500">For QGIS, Leaflet, MapLibre &amp; Python GIS</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all ${
                  format === 'csv'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-teal-700" />
                <div>
                  <div className="font-bold text-sm">CSV Table</div>
                  <div className="text-[11px] text-stone-500">For Excel, Google Sheets, R &amp; Pandas</div>
                </div>
              </button>
            </div>
          </div>

          {/* Privacy & Species Protection Checkbox */}
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800/80 space-y-2">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-purple-900 dark:text-purple-200 leading-tight">
                <strong>Botanical Privacy Shield Active</strong>: Vulnerable species (*Santalum album*, *Pterocarpus santalinus*) never export raw GPS coordinates. They are fuzzed to a ~5 km grid centroid.
              </div>
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRestricted}
                onChange={(e) => setIncludeRestricted(e.target.checked)}
                className="rounded border-purple-400 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-[11px] text-stone-700 dark:text-stone-300 font-medium">
                Include protected species with ~5 km fuzzed coordinates (uncheck to omit entirely)
              </span>
            </label>
          </div>

          {/* Summary Details */}
          <div className="p-3 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1.5 text-stone-600 dark:text-stone-300">
            <div className="flex items-center justify-between">
              <span>Records ready for export:</span>
              <strong className="text-stone-900 dark:text-stone-100">{exportablePlants.length} plants</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Open Licensing:</span>
              <strong className="text-emerald-700">CC BY-SA 4.0 &amp; ODbL</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Free &amp; Open Source:</span>
              <span className="flex items-center gap-1 text-stone-500">
                <Globe className="w-3.5 h-3.5" />
                <span>Zero-Cost Data Initiative</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
          <span className="text-xs text-stone-400">Attribution required upon republication</span>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download {format.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenDataExportModal;
