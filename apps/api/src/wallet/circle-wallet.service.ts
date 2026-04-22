import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { CircleWallet, TransferRequest, TransferResult } from '@arctube/types';

/**
 * Circle Programmable Wallet integration service.
 * In sandbox mode, simulates wallet creation and USDC transfers.
 * Replace with actual Circle SDK calls for production.
 */
@Injectable()
export class CircleWalletService {
  private readonly logger = new Logger(CircleWalletService.name);
  private readonly isSandbox: boolean;

  constructor() {
    this.isSandbox = process.env.CIRCLE_ENVIRONMENT === 'sandbox' || !process.env.CIRCLE_API_KEY;
    if (this.isSandbox) {
      this.logger.warn('Running in SANDBOX mode — Circle transfers are simulated');
    }
  }

  /**
   * Create a new Circle Programmable Wallet for a user
   */
  async createWallet(userId: string): Promise<CircleWallet> {
    if (this.isSandbox) {
      return this.simulateCreateWallet(userId);
    }

    // TODO: Replace with actual Circle SDK call
    // const response = await circleSDK.createWallet({ userId, walletSetId: process.env.CIRCLE_WALLET_SET_ID });
    return this.simulateCreateWallet(userId);
  }

  /**
   * Transfer USDC from one wallet to another on Arc
   */
  async transferUSDC(request: TransferRequest): Promise<TransferResult> {
    if (this.isSandbox) {
      return this.simulateTransfer(request);
    }

    // TODO: Replace with actual Circle SDK call
    // const response = await circleSDK.createTransfer({ ... });
    return this.simulateTransfer(request);
  }

  // ─── Sandbox Simulators ─────────────────────────────────────

  private simulateCreateWallet(userId: string): CircleWallet {
    const walletId = `sim_wallet_${uuidv4().slice(0, 8)}`;
    const address = `0x${Buffer.from(userId).toString('hex').slice(0, 40).padEnd(40, '0')}`;

    this.logger.log(`[SANDBOX] Created wallet ${walletId} → ${address}`);

    return {
      walletId,
      address,
      blockchain: 'ARC-TESTNET',
    };
  }

  private simulateTransfer(request: TransferRequest): TransferResult {
    const txHash = `0x${uuidv4().replace(/-/g, '')}${uuidv4().replace(/-/g, '').slice(0, 32)}`;
    const blockNumber = Math.floor(Date.now() / 1000);

    this.logger.log(
      `[SANDBOX] Transfer ${request.amount} USDC: ${request.fromWalletId} → ${request.toAddress}`,
    );

    return {
      txHash,
      blockNumber,
      status: 'confirmed',
    };
  }
}
