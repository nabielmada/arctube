/**
 * Video catalog for demo mode.
 * Maps video IDs to metadata + HLS source URLs.
 * Uses public HLS test streams (Big Buck Bunny, Sintel, etc.)
 */

export interface DemoVideo {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  pricePerSecond: number;
  ownershipPrice: number;
  teaserSeconds: number;
  totalEarned: number;
  creatorUsername: string;
  hlsUrl: string;
  thumbnail: string | null;
}

export const DEMO_VIDEOS: DemoVideo[] = [
  {
    id: 'demo-1',
    title: 'Introduction to Arc L1 Blockchain',
    description: 'Learn about Arc L1 and why USDC-native gas changes everything for micropayments.',
    durationSeconds: 120,
    pricePerSecond: 0.001,
    ownershipPrice: 5.0,
    teaserSeconds: 10,
    totalEarned: 2.45,
    creatorUsername: 'arc_dev',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: null,
  },
  {
    id: 'demo-2',
    title: 'Building Pay-Per-Second dApps',
    description: 'Full tutorial on nanopayment architecture with Circle wallets.',
    durationSeconds: 300,
    pricePerSecond: 0.001,
    ownershipPrice: 12.0,
    teaserSeconds: 10,
    totalEarned: 8.12,
    creatorUsername: 'web3_builder',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: null,
  },
  {
    id: 'demo-3',
    title: 'USDC Streaming: The Future of Payments',
    description: 'Why real-time micropayments will replace subscriptions.',
    durationSeconds: 180,
    pricePerSecond: 0.001,
    ownershipPrice: 7.5,
    teaserSeconds: 10,
    totalEarned: 4.33,
    creatorUsername: 'crypto_sage',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: null,
  },
  {
    id: 'demo-4',
    title: 'Circle Programmable Wallets Deep Dive',
    description: 'Auto-signing, wallet sets, and server-controlled transfers.',
    durationSeconds: 240,
    pricePerSecond: 0.001,
    ownershipPrice: 10.0,
    teaserSeconds: 10,
    totalEarned: 6.78,
    creatorUsername: 'defi_queen',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: null,
  },
];

/** Lookup a demo video by ID */
export function getDemoVideo(id: string): DemoVideo | undefined {
  return DEMO_VIDEOS.find((v) => v.id === id);
}
