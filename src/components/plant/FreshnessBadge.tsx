import { FreshnessStatus } from '../../types/database.types';
import { FRESHNESS_METADATA } from '../../config/freshness';
import { formatRelativeTime } from '../../lib/formatters';

interface FreshnessBadgeProps {
  status: FreshnessStatus;
  lastVerifiedAt?: string;
  showRelativeTime?: boolean;
  className?: string;
}


export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({
  status,
  lastVerifiedAt,
  showRelativeTime = false,
  className = '',
}) => {
  const meta = FRESHNESS_METADATA[status] || FRESHNESS_METADATA.recently_verified;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} ${className}`}
      title={`${meta.labelEn} (${meta.labelHi})`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor} shrink-0 animate-pulse`} />
      <span className="font-semibold">{meta.labelEn}</span>
      {showRelativeTime && lastVerifiedAt && (
        <span className="text-[10px] opacity-75 font-normal ml-0.5">
          • {formatRelativeTime(lastVerifiedAt)}
        </span>
      )}
    </div>
  );
};

export default FreshnessBadge;
