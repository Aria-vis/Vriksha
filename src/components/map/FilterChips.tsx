import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseTag, FreshnessStatus } from '../../types/plant';
import { Sparkles, Flower2, Apple, Umbrella, Sun, HeartPulse, CheckCircle2 } from 'lucide-react';

interface FilterChipsProps {
  selectedUseTags: UseTag[];
  onToggleUseTag: (tag: UseTag) => void;
  inSeasonOnly: boolean;
  onToggleInSeason: () => void;
  selectedFreshness: FreshnessStatus[];
  onToggleFreshness: (status: FreshnessStatus) => void;
  onClearAll: () => void;
}

interface ChipItem {
  id: string;
  label: string;
  labelHi: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedUseTags,
  onToggleUseTag,
  inSeasonOnly,
  onToggleInSeason,
  selectedFreshness,
  onToggleFreshness,
  onClearAll,
}) => {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const chips: ChipItem[] = [
    {
      id: 'in-season',
      label: 'In Season Now',
      labelHi: 'अभी मौसम में',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      isActive: inSeasonOnly,
      onClick: onToggleInSeason,
    },
    {
      id: 'recently-verified',
      label: 'Recently Verified',
      labelHi: 'सत्यापित',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      isActive: selectedFreshness.includes('recently_verified'),
      onClick: () => onToggleFreshness('recently_verified'),
    },
    {
      id: 'puja',
      label: 'Puja & Rituals',
      labelHi: 'पूजा एवं अनुष्ठान',
      icon: <Sun className="w-3.5 h-3.5 text-brand-saffron" />,
      isActive: selectedUseTags.includes('puja'),
      onClick: () => onToggleUseTag('puja'),
    },
    {
      id: 'medicinal',
      label: 'Medicinal / Remedy',
      labelHi: 'औषधीय',
      icon: <HeartPulse className="w-3.5 h-3.5 text-emerald-700" />,
      isActive: selectedUseTags.includes('medicinal'),
      onClick: () => onToggleUseTag('medicinal'),
    },
    {
      id: 'fruit',
      label: 'Fruit',
      labelHi: 'फल',
      icon: <Apple className="w-3.5 h-3.5 text-amber-600" />,
      isActive: selectedUseTags.includes('fruit'),
      onClick: () => onToggleUseTag('fruit'),
    },
    {
      id: 'flowers',
      label: 'Flowers',
      labelHi: 'पुष्प',
      icon: <Flower2 className="w-3.5 h-3.5 text-pink-500" />,
      isActive: selectedUseTags.includes('flowers'),
      onClick: () => onToggleUseTag('flowers'),
    },
    {
      id: 'shade',
      label: 'Cooling Shade',
      labelHi: 'छायादार',
      icon: <Umbrella className="w-3.5 h-3.5 text-blue-500" />,
      isActive: selectedUseTags.includes('shade'),
      onClick: () => onToggleUseTag('shade'),
    },
    {
      id: 'edible',
      label: 'Edible',
      labelHi: 'खाने योग्य',
      isActive: selectedUseTags.includes('edible'),
      onClick: () => onToggleUseTag('edible'),
    },
    {
      id: 'leaves_decoration',
      label: 'Toran / Leaves',
      labelHi: 'तोरण व सजावट',
      isActive: selectedUseTags.includes('leaves_decoration'),
      onClick: () => onToggleUseTag('leaves_decoration'),
    },
  ];

  const totalActive = selectedUseTags.length + (inSeasonOnly ? 1 : 0) + selectedFreshness.length;

  return (
    <div className="w-full flex items-center gap-1.5 overflow-x-auto py-2 px-3 no-scrollbar touch-scroll bg-brand-cream/90 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800">
      {totalActive > 0 && (
        <button
          onClick={onClearAll}
          className="px-2.5 py-1 text-xs font-semibold text-brand-earth hover:text-red-700 bg-brand-earth/10 hover:bg-brand-earth/20 rounded-full shrink-0 transition-colors"
        >
          Reset ({totalActive})
        </button>
      )}

      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={chip.onClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all shadow-sm ${
            chip.isActive
              ? 'bg-brand-green text-white shadow-emerald-900/20'
              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
          }`}
        >
          {chip.icon}
          <span>{isHi ? chip.labelHi : chip.label}</span>
          <span className="text-[10px] opacity-75 hidden sm:inline">
            ({isHi ? chip.label : chip.labelHi})
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterChips;
