// ─── Video Types ────────────────────────────────────────────────

export type VideoStatus = 'active' | 'draft' | 'removed';

export interface Video {
  id: string;
  creatorId: string;
  title: string;
  description: string | null;
  durationSeconds: number;
  pricePerSecond: number;
  ownershipPrice: number;
  hlsManifestUrl: string;
  teaserSeconds: number;
  totalEarned: number;
  status: VideoStatus;
  createdAt: string;
}

export interface VideoWithCreator extends Video {
  creatorUsername: string | null;
  creatorWalletAddress: string;
}

export interface VideoUploadRequest {
  title: string;
  description?: string;
  durationSeconds: number;
  pricePerSecond?: number;
  ownershipPrice: number;
  teaserSeconds?: number;
}

export interface WatchSession {
  id: string;
  userId: string;
  videoId: string;
  startedAt: string;
  lastHeartbeat: string;
  secondsWatched: number;
  totalPaidUsdc: number;
  isActive: boolean;
}
