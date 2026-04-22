// ─── Wallet Types ───────────────────────────────────────────────

export interface CircleWallet {
  walletId: string;
  address: string;
  blockchain: string;
}

export interface WalletBalance {
  usdc: number;
  walletAddress: string;
}

export interface TransferRequest {
  fromWalletId: string;
  toAddress: string;
  amount: string;
}

export interface TransferResult {
  txHash: string;
  blockNumber: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface WalletProvisionResult {
  walletId: string;
  walletAddress: string;
  blockchain: string;
}
