import React, { useState, useEffect } from 'react';
import {
  Trees,
  Compass,
  Plus,
  ChevronDown,
  MapPin,
  Check,
  ShieldCheck,
  ShieldAlert,
  Languages,
  SunMedium,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { INDIAN_CITY_PRESETS } from '../../hooks/useGeolocation';
import { SUPPORTED_LANGUAGES, setLanguage, LanguageOption } from '../../i18n';

interface HeaderProps {
  activeCityName: string;
  isUsingGPS: boolean;
  onSelectCityPreset: (cityKey: string) => void;
  onRequestGPS: () => void;
  isLocating: boolean;
  onOpenAddModal: () => void;
  onOpenAuthModal?: () => void;
  onOpenPrivacyModal?: () => void;
  onOpenModerationModal?: () => void;
  userPoints?: number;
  isAuthenticated?: boolean;
  isModerator?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeCityName,
  isUsingGPS,
  onSelectCityPreset,
  onRequestGPS,
  isLocating,
  onOpenAddModal,
  onOpenAuthModal,
  onOpenPrivacyModal,
  onOpenModerationModal,
  userPoints = 0,
  isAuthenticated = false,
  isModerator = false,
}) => {
  const { t, i18n } = useTranslation();
  const [showCityMenu, setShowCityMenu] = useState<boolean>(false);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);
  const [isOutdoorMode, setIsOutdoorMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vriksha_outdoor_mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOutdoorMode) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      localStorage.setItem('vriksha_outdoor_mode', String(isOutdoorMode));
    }
  }, [isOutdoorMode]);

  const fallbackLang: LanguageOption = { code: 'en', name: 'English', nativeName: 'English', script: 'Latin' };
  const currentLang: LanguageOption = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? fallbackLang;

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
          <p className="text-[10px] text-emerald-200 hidden sm:block">
            {t('app.subtitle', 'Community Flora Map')}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowCityMenu(false);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-white rounded-full text-xs font-medium border border-emerald-700/60 transition-colors"
            title="Change Display Language"
            aria-label="Change Display Language"
            aria-expanded={showLangMenu}
            aria-haspopup="listbox"
          >
            <Languages className="w-3.5 h-3.5 text-brand-saffron" />
            <span className="text-[11px] font-bold">{currentLang.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-emerald-300" />
          </button>

          {showLangMenu && (
            <div
              role="listbox"
              className="absolute top-full right-0 mt-1.5 w-48 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 py-1.5 z-50 max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800"
            >
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-stone-400">
                Select Indian Language
              </div>
              <div className="py-1">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors ${
                        isSelected ? 'font-bold text-brand-green dark:text-emerald-400' : ''
                      }`}
                    >
                      <div>
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-[10px] text-stone-400 ml-1.5">({lang.name})</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Outdoor High Contrast Toggle */}
        <button
          onClick={() => setIsOutdoorMode(!isOutdoorMode)}
          className={`p-1.5 rounded-full border transition-colors ${
            isOutdoorMode
              ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-sm'
              : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border-emerald-700/60'
          }`}
          title={isOutdoorMode ? 'Outdoor high-contrast enabled' : 'Toggle Outdoor High-Contrast Mode for bright sunlight'}
          aria-label="Toggle Outdoor High-Contrast Mode"
        >
          <SunMedium className="w-4 h-4" />
        </button>

        {/* User Points / Auth Trigger */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-900/80 hover:bg-emerald-800/90 text-white rounded-full text-xs font-semibold border border-emerald-700/60 transition-colors"
          title={isAuthenticated ? 'Contributor Profile' : 'Sign in to sync points'}
          aria-label="Contributor profile and points"
        >
          <span className="text-amber-300">🌿</span>
          <span className="font-mono">{userPoints} pts</span>
        </button>

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
          aria-label="Locate me using GPS"
        >
          <Compass className={`w-3.5 h-3.5 text-brand-saffron ${isLocating ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
        </button>

        {/* Privacy Policy Trigger */}
        <button
          onClick={onOpenPrivacyModal}
          className="p-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 rounded-full border border-emerald-700/60 transition-colors"
          title="Privacy & Safety Policy (Protected Species Shield)"
          aria-label="Privacy and Safety Policy"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
        </button>

        {/* Moderation Dashboard Trigger (for moderators or admins) */}
        {isModerator && (
          <button
            onClick={onOpenModerationModal}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 rounded-full text-xs font-semibold border border-purple-600 transition-colors"
            title="Open Community Moderation Dashboard"
            aria-label="Moderation dashboard"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Mod</span>
          </button>
        )}

        {/* Add Plant Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-3 py-1.5 bg-brand-saffron hover:bg-brand-saffron-light active:scale-95 text-white text-xs font-bold rounded-full shadow-md transition-all"
          aria-label="Add a plant"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('app.addPlant', 'Add Plant')}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
