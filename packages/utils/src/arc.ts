// ─── Arc Blockchain Utilities ───────────────────────────────────
// Pure functions for Arc explorer URLs and hash formatting

const DEFAULT_EXPLORER = 'https://testnet.arcscan.app';

/**
 * Get the Arc explorer base URL from env or default
 */
const getExplorerBase = (): string =>
  (typeof process !== 'undefined' && process.env?.NUXT_PUBLIC_ARC_EXPLORER) ||
  DEFAULT_EXPLORER;

/**
 * Generate Arc explorer URL for a transaction hash
 * @example getExplorerTxUrl('0xabc...') → "https://testnet.arcscan.app/tx/0xabc..."
 */
export const getExplorerTxUrl = (txHash: string): string =>
  `${getExplorerBase()}/tx/${txHash}`;

/**
 * Generate Arc explorer URL for a block number
 */
export const getExplorerBlockUrl = (blockNumber: number): string =>
  `${getExplorerBase()}/block/${blockNumber}`;

/**
 * Generate Arc explorer URL for an address
 */
export const getExplorerAddressUrl = (address: string): string =>
  `${getExplorerBase()}/address/${address}`;

/**
 * Shorten a hex hash for display
 * @example shortenHash('0x1234567890abcdef1234567890abcdef12345678') → "0x1234...5678"
 */
export const shortenHash = (hash: string, chars = 4): string => {
  if (!hash || hash.length < chars * 2 + 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
};

/**
 * Shorten an address for display
 * @example shortenAddress('0x1234567890abcdef1234567890abcdef12345678') → "0x1234...5678"
 */
export const shortenAddress = (address: string): string =>
  shortenHash(address, 4);

/**
 * Arc testnet chain configuration
 */
export const ARC_TESTNET_CONFIG = {
  chainId: 5042002,
  chainName: 'Arc Testnet',
  rpcUrl: 'https://rpc.testnet.arc.network',
  explorerUrl: DEFAULT_EXPLORER,
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  usdcContract: '0x3600000000000000000000000000000000000000',
} as const;
