import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ToxicityAlertProps {
  details?: string | null;
  className?: string;
}

export const ToxicityAlert: React.FC<ToxicityAlertProps> = ({ details, className = '' }) => {
  return (
    <div
      className={`p-3 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-xl text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5 shadow-sm ${className}`}
      role="alert"
    >
      <div className="p-1 bg-red-100 dark:bg-red-900/60 rounded-full text-red-600 dark:text-red-400 shrink-0 mt-0.5">
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div className="space-y-0.5">
        <span className="font-bold text-red-700 dark:text-red-300 text-xs uppercase tracking-wider block">
          ⚠️ Toxicity Warning (विषाक्तता चेतावनी)
        </span>
        <p className="text-[11px] leading-relaxed text-red-800 dark:text-red-200">
          {details || 'This species contains toxic compounds. Harmful or fatal if ingested. Keep away from eyes, children, and domestic pets. Traditional external/ritual use only.'}
        </p>
      </div>
    </div>
  );
};

export default ToxicityAlert;
