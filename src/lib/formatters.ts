/**
 * Formats a distance in meters into user-friendly units (m / km)
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Formats relative timestamp for verification displays
 */
export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Verified today';
  if (diffDays === 1) return 'Verified yesterday';
  if (diffDays < 30) return `Verified ${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `Verified ${diffMonths}mo ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `Verified ${diffYears}y ago`;
}
