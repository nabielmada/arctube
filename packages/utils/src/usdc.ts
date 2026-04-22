// ─── USDC Formatting Utilities ──────────────────────────────────
// Pure functions for USDC display and conversion (6 decimals on Arc)

const USDC_DECIMALS = 6;

/**
 * Format a USDC amount with specified decimal places
 * @example formatUSDC(0.001234) → "$0.0012"
 */
export const formatUSDC = (amount: number, decimals = 4): string => {
  const formatted = Math.abs(amount).toFixed(decimals);
  const sign = amount < 0 ? '-' : '';
  return `${sign}$${formatted}`;
};

/**
 * Format USDC with full precision
 * @example formatUSDCFull(0.00123456) → "$0.00123456"
 */
export const formatUSDCFull = (amount: number): string =>
  formatUSDC(amount, USDC_DECIMALS);

/**
 * Convert USDC display amount to smallest unit (6 decimals)
 * @example toSmallestUnit(1.5) → 1500000n
 */
export const toSmallestUnit = (amount: number): bigint =>
  BigInt(Math.round(amount * 10 ** USDC_DECIMALS));

/**
 * Convert smallest unit back to USDC display amount
 * @example fromSmallestUnit(1500000n) → 1.5
 */
export const fromSmallestUnit = (amount: bigint): number =>
  Number(amount) / 10 ** USDC_DECIMALS;

/**
 * Calculate ownership percentage
 * @example ownershipPercent(2.5, 10) → 25
 */
export const ownershipPercent = (totalPaid: number, ownershipPrice: number): number =>
  Math.min(100, (totalPaid / ownershipPrice) * 100);

/**
 * Calculate estimated cost for remaining seconds
 */
export const estimateCost = (secondsRemaining: number, pricePerSecond: number): number =>
  secondsRemaining * pricePerSecond;

/**
 * Format duration in human-readable form
 * @example formatDuration(125) → "2:05"
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
