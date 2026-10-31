import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { SeedFestivalItem } from '../../../scripts/data/festival-data';

interface FestivalCalendarProps {
  onSelectFestival: (festival: SeedFestivalItem) => void;
}

export const FestivalCalendar: React.FC<FestivalCalendarProps> = ({ onSelectFestival }) => {
  const [festivals, setFestivals] = useState<SeedFestivalItem[]>([]);

  useEffect(() => {
    // Dynamic import of master festivals data
    import('../../../scripts/data/festival-data').then((mod) => {
      setFestivals(mod.SEED_FESTIVALS);
    });
  }, []);

  if (festivals.length === 0) return null;

  // Show the top 4 upcoming occasions
  const upcomingFestivals = festivals.slice(0, 4);

  return (
    <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200/80">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Puja &amp; Festival Mode</span>
          <span className="text-[10px] font-normal text-amber-700 bg-amber-200/60 px-1.5 py-0.2 rounded-full">
            Ritual Checklists
          </span>
        </div>
        <span className="text-[11px] text-amber-800 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-amber-600" />
          <span>Select Occasion</span>
        </span>
      </div>

      {/* Horizontal Carousel of Festivals */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {upcomingFestivals.map((fest) => (
          <button
            key={fest.slug}
            type="button"
            onClick={() => onSelectFestival(fest)}
            className="flex-shrink-0 flex items-center gap-2.5 px-3 py-1.5 bg-white hover:bg-amber-100/50 rounded-xl border border-amber-200/90 shadow-sm text-left transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
              🕉️
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                <span>{fest.name_en}</span>
                <span className="text-brand-saffron font-medium text-[11px]">
                  ({fest.name_hi})
                </span>
              </div>
              <div className="text-[10px] text-stone-500 flex items-center gap-1">
                <span>{fest.lunar_tithi_desc.split(' ')[0]}</span>
                <span>•</span>
                <span className="text-amber-800 font-medium">
                  {fest.checklist.length} plants
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700 transition-colors ml-1" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default FestivalCalendar;
