/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 */
export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diffMs = now.getTime() - pastDate.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return `${diffSecs}秒前`;
  } else if (diffMins < 60) {
    return `${diffMins}分前`;
  } else if (diffHours < 24) {
    return `${diffHours}時間前`;
  } else if (diffDays < 7) {
    return `${diffDays}日前`;
  } else {
    return pastDate.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
