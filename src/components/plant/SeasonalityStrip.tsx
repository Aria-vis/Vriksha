import React from 'react';

interface SeasonalityStripProps {
  floweringMonths: number[];
  fruitingMonths: number[];
  freshLeavesMonths: number[];
  className?: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const SeasonalityStrip: React.FC<SeasonalityStripProps> = ({
  floweringMonths = [],
  fruitingMonths = [],
  freshLeavesMonths = [],
  className = '',
}) => {
  const currentMonth = new Date().getMonth() + 1; // 1 to 12

  const isCurrentInSeason =
    floweringMonths.includes(currentMonth) ||
    fruitingMonths.includes(currentMonth) ||
    freshLeavesMonths.includes(currentMonth);

  return (
    <div className={`space-y-2 p-3 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-stone-200 dark:border-stone-800 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
          <span>12-Month Seasonality</span>
          {isCurrentInSeason ? (
            <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-md">
              In Season Now
            </span>
          ) : (
            <span className="px-1.5 py-0.5 bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[10px] rounded-md">
              Off Season
            </span>
          )}
        </span>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] text-stone-500">
          <span className="flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            <span>Flowers</span>
          </span>
          <span className="flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Fruit</span>
          </span>
          <span className="flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Leaves</span>
          </span>
        </div>
      </div>

      {/* Grid of 12 Months */}
      <div className="grid grid-cols-12 gap-1 text-center">
        {MONTH_NAMES.map((monthName, idx) => {
          const monthNum = idx + 1;
          const isCurrent = monthNum === currentMonth;
          const hasFlowers = floweringMonths.includes(monthNum);
          const hasFruit = fruitingMonths.includes(monthNum);
          const hasLeaves = freshLeavesMonths.includes(monthNum);

          return (
            <div
              key={monthName}
              className={`flex flex-col items-center py-1 rounded transition-colors ${
                isCurrent
                  ? 'bg-brand-saffron/15 ring-1 ring-brand-saffron font-bold text-brand-saffron-dark'
                  : 'bg-white dark:bg-stone-800/80 text-stone-600 dark:text-stone-300'
              }`}
            >
              <span className="text-[10px] uppercase font-sans mb-1">{monthName[0]}</span>

              {/* Activity Indicators */}
              <div className="flex flex-col gap-0.5 h-4 justify-center items-center">
                {hasFlowers && <span className="w-1.5 h-1.5 rounded-full bg-pink-500" title="Flowering" />}
                {hasFruit && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Fruiting" />}
                {hasLeaves && !hasFlowers && !hasFruit && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Fresh Leaves" />
                )}
                {!hasFlowers && !hasFruit && !hasLeaves && (
                  <span className="w-1 h-1 rounded-full bg-stone-200 dark:bg-stone-700" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonalityStrip;
