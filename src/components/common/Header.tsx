import React, { useState } from 'react';
import { Trees, Compass, Plus, ChevronDown, MapPin, Check } from 'lucide-react';
import { INDIAN_CITY_PRESETS } from '../../hooks/useGeolocation';

interface HeaderProps {
  activeCityName: string;
  isUsingGPS: boolean;
  onSelectCityPreset: (cityKey: string) => void;
  onRequestGPS: () => void;
  isLocating: boolean;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCityName,
  isUsingGPS,
  onSelectCityPreset,
  onRequestGPS,
  isLocating,
  onOpenAddModal,
}) => {
  const [showCityMenu, setShowCityMenu] = useState<boolean>(false);

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-4 bg-brand-green text-white flex items-center justify-between shadow-md z-30 shrink-0 select-none">
      {/* Brand & City Trigger */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="p-1.5 sm:p-2 bg-emerald-600 rounded-xl text-white shadow-inner flex items-center justify-center">
          <Trees className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base sm:text-lg font-bold font-sans tracking-tight leading-none flex items-center gap-1">
              <span>Vriksha</span>
              <span className="text-brand-saffron text-sm font-normal">(वृक्ष)</span>
            </h1>

            {/* City Preset Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCityMenu(!showCityMenu)}
                className="flex items-center gap-1 px-2 py-0.5 bg-emerald-800/80 hover:bg-emerald-700/80 text-[11px] rounded-full font-medium transition-colors border border-emerald-600/50"
              >
                <MapPin className="w-3 h-3 text-brand-saffron" />
                <span className="truncate max-w-[100px] sm:max-w-none">{activeCityName}</span>
                <ChevronDown className="w-3 h-3 text-emerald-300" />
              </button>

              {/* Dropdown Menu */}
              {showCityMenu && (
                <div className="absolute top-full left-0 mt-1.5 w-44 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 py-1.5 z-50 divide-y divide-stone-100 dark:divide-stone-800">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-stone-400">
                    Switch City Area
                  </div>

                  <div className="py-1">
                    {Object.entries(INDIAN_CITY_PRESETS).map(([key, city]) => {
                      const isSelected = activeCityName === city.name && !isUsingGPS;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            onSelectCityPreset(key);
                            setShowCityMenu(false);
                          }}
                          className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/60 ${
                            isSelected ? 'font-bold text-brand-green dark:text-emerald-400' : ''
                          }`}
                        >
                          <span>{city.name} ({city.nameHi})</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        onRequestGPS();
                        setShowCityMenu(false);
                      }}
                      className="w-full py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-brand-green" />
                      <span>Use Exact GPS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-[10px] text-emerald-200 hidden sm:block">Community Map of Useful Plants & Trees</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Locate me quick button */}
        <button
          onClick={onRequestGPS}
          disabled={isLocating}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            isUsingGPS
              ? 'bg-emerald-800 border-emerald-500 text-emerald-200'
              : 'bg-emerald-900/60 hover:bg-emerald-800 border-emerald-700/60 text-white'
          }`}
          title="Locate me via GPS"
        >
          <Compass className={`w-3.5 h-3.5 text-brand-saffron ${isLocating ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
        </button>

        {/* Add Plant Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-3 py-1.5 bg-brand-saffron hover:bg-brand-saffron-light active:scale-95 text-white text-xs font-bold rounded-full shadow-md transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Plant</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
