import { FreshnessStatus, PlantType } from '../types/database.types';

/**
 * Single source of truth for freshness decay windows across Vriksha.
 * These thresholds are mirrored directly in PostgreSQL function `calculate_plant_freshness`.
 */
export const FRESHNESS_CONFIG = {
  decayWindowsMonths: {
    large_tree: {
      freshMaxMonths: 18,
      recheckMaxMonths: 36,
    },
    shrub: {
      freshMaxMonths: 6,
      recheckMaxMonths: 12,
    },
    herb: {
      freshMaxMonths: 2,
      recheckMaxMonths: 4,
    },
    grass: {
      freshMaxMonths: 2,
      recheckMaxMonths: 4,
    },
  },
  negativeVerification: {
    minGoneReportsToHide: 2,
  },
  proximityPrompt: {
    radiusMeters: 100,
    cooldownHours: 24,
  },
} as const;

/**
 * Calculates current freshness status given the last verified date, plant type, and gone reports.
 */
export function computeFreshnessStatus(
  lastVerifiedAt: string | Date,
  plantType: PlantType,
  goneReportCount: number = 0,
  referenceNow: Date = new Date()
): FreshnessStatus {
  if (goneReportCount >= FRESHNESS_CONFIG.negativeVerification.minGoneReportsToHide) {
    return 'reported_gone';
  }

  const verifiedDate = typeof lastVerifiedAt === 'string' ? new Date(lastVerifiedAt) : lastVerifiedAt;
  const diffMs = referenceNow.getTime() - verifiedDate.getTime();
  const diffDays = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = diffDays / 30.4375; // average days per month

  const config = FRESHNESS_CONFIG.decayWindowsMonths[plantType] ?? FRESHNESS_CONFIG.decayWindowsMonths.shrub;

  if (diffMonths <= config.freshMaxMonths) {
    return 'recently_verified';
  } else if (diffMonths <= config.recheckMaxMonths) {
    return 'needs_recheck';
  } else {
    return 'possibly_gone';
  }
}

/**
 * Presentation metadata for freshness badges and map markers
 */
export const FRESHNESS_METADATA: Record<FreshnessStatus, {
  labelEn: string;
  labelHi: string;
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}> = {
  recently_verified: {
    labelEn: 'Verified Recently',
    labelHi: 'हाल ही में सत्यापित',
    colorHex: '#10B981',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500',
  },
  needs_recheck: {
    labelEn: 'Needs Recheck',
    labelHi: 'जाँच की आवश्यकता',
    colorHex: '#F59E0B',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
  },
  possibly_gone: {
    labelEn: 'Possibly Gone',
    labelHi: 'शायद कट चुका या अनुपलब्ध',
    colorHex: '#EF4444',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    dotColor: 'bg-rose-500',
  },
  reported_gone: {
    labelEn: 'Reported Gone',
    labelHi: 'हटाया हुआ रिपोर्ट किया गया',
    colorHex: '#6B7280',
    badgeBg: 'bg-stone-100 dark:bg-stone-800',
    badgeText: 'text-stone-600 dark:text-stone-400',
    badgeBorder: 'border-stone-300 dark:border-stone-700',
    dotColor: 'bg-stone-500',
  },
};
