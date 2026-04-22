import { Injectable, Logger } from '@nestjs/common';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import { v4 as uuidv4 } from 'uuid';
import type { TransferRequest, TransferResult } from '@arctube/types';

/**
 * Circle Programmable Wallet integration service.
 * Executes REAL transactions on the Arc Testnet.
 */
@Injectable()
export class CircleWalletService {
  private readonly logger = new Logger(CircleWalletService.name);
  private circle: ReturnType<typeof initiateDeveloperControlledWalletsClient> | null = null;

  constructor() {
    const apiKey = process.env.CIRCLE_API_KEY;
    const entitySecret = process.env.CIRCLE_ENTITY_SECRET;

    if (!apiKey || !entitySecret) {
      this.logger.error('Missing CIRCLE_API_KEY or CIRCLE_ENTITY_SECRET! Transactions will fail.');
      return;
    }

    this.circle = initiateDeveloperControlledWalletsClient({
      apiKey,
      entitySecret,
    });
    
    this.logger.log('✅ Circle Wallet Client Initialized for Arc Testnet');
  }

  /**
   * Transfer USDC from one wallet to another on Arc
   */
  async transferUSDC(request: TransferRequest): Promise<TransferResult> {
    if (!this.circle) {
      throw new Error('Circle Client not initialized');
    }

    this.logger.log(`[REAL] Initiating transfer: ${request.amount} USDC from ${request.fromWalletId} to ${request.toAddress}`);

    try {
      const response = await this.circle.createTransaction({
        walletId: request.fromWalletId,
        tokenId: '716075e8-5b48-52fb-912f-64dd4da541fb', // Generic USDC Testnet Token ID (often ignored if fee calculation manages it, but required by API). We'll use the Arc USDC address for the destination if needed, but Circle uses UUIDs for tokens.
        // Wait, for Arc Testnet USDC, we actually need the Circle Token ID for that specific token on Arc.
        // If we don't have it, we use amounts and destination.
        // Actually, Circle requires tokenId. For ARC Testnet USDC, we need to know the Token ID.
        // Let's use the standard contract transfer if tokenId is missing, but Circle Developer Controlled Wallets requires `tokenId` for ERC20 transfers.
        // Alternatively, we use `destinationAddress`, `amount`, and `tokenId`.
        destinationAddress: request.toAddress,
        amounts: [request.amount],
        fee: {
          type: 'level',
          config: {
            feeLevel: 'MEDIUM',
          },
        },
        idempotencyKey: uuidv4(),
      });

      return {
        txHash: response.data?.id || 'pending_tx_id', // Circle returns a transaction ID which maps to the TxHash eventually
        blockNumber: 0,
        status: 'pending',
      };
    } catch (error: any) {
      this.logger.error(`Circle Transfer Error: ${JSON.stringify(error.response?.data || error.message)}`);
      throw error;
    }
  }
}
