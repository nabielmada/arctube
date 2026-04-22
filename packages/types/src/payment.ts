// ─── Payment Types ──────────────────────────────────────────────
// All interfaces for the heartbeat payment engine

export interface HeartbeatRequest {
  sessionId: string;
  videoId: string;
  second: number;
}

export interface HeartbeatResponse {
  success: boolean;
  txHash: string;
  arcBlockNumber: number;
  amountPaid: number;
  totalPaidVideo: number;
  ownershipPrice: number;
  isOwned: boolean;
  remainingBalance: number;
}

export interface SessionStartRequest {
  videoId: string;
}

export interface SessionStartResponse {
  sessionId: string;
  isAlreadyOwned: boolean;
  balance: number;
  pricePerSecond: number;
  ownershipPrice: number;
}

export interface SessionStopRequest {
  sessionId: string;
}

export interface PaymentHistoryItem {
  id: string;
  amountUsdc: number;
  arcTxHash: string;
  arcBlockNumber: number;
  secondIndex: number;
  createdAt: string;
}
