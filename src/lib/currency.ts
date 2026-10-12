export const DEFAULT_CURRENCY = 'LKR';

/**
 * Formats a numeric price into standard Sri Lankan Rupee (LKR) currency string.
 * Example: formatLKR(999) => "LKR 999.00"
 */
export function formatLKR(amount: number): string {
  return `LKR ${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatLKRCompact(amount: number): string {
  return `LKR ${Number(amount).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`;
}
