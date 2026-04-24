/**
 * iHarvest — Formatting utilities
 * Reusable formatting helpers for currency, dates, and percentages.
 */

/**
 * Format a number as Bangladeshi Taka (BDT).
 * @param {number} amount - The amount in BDT.
 * @returns {string} Formatted currency string, e.g. "৳25,000"
 */
export function formatBDT(amount) {
  if (amount == null || isNaN(amount)) return '৳0';
  return `৳${Number(amount).toLocaleString('en-BD')}`;
}

/**
 * Format a Firestore Timestamp or JS Date to a human-readable date string.
 * @param {import('firebase/firestore').Timestamp | Date | string} timestamp
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp, options = {}) {
  if (!timestamp) return 'N/A';

  let date;
  if (timestamp?.toDate) {
    // Firestore Timestamp
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return date.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format a Firestore Timestamp or JS Date to a datetime string.
 * @param {import('firebase/firestore').Timestamp | Date | string} timestamp
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(timestamp) {
  return formatDate(timestamp, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a number as a percentage.
 * @param {number} value - The percentage value (e.g. 12.5 for 12.5%).
 * @param {number} [decimals=1] - Number of decimal places.
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  if (value == null || isNaN(value)) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
}

/**
 * Truncate a string to a max length, appending "..." if truncated.
 * @param {string} str
 * @param {number} [maxLength=50]
 * @returns {string}
 */
export function truncate(str, maxLength = 50) {
  if (!str) return '';
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a role slug to a readable label.
 * e.g. "cluster_manager" → "Cluster Manager"
 * @param {string} role
 * @returns {string}
 */
export function formatRole(role) {
  if (!role) return '';
  return role
    .split('_')
    .map((word) => capitalize(word))
    .join(' ');
}
