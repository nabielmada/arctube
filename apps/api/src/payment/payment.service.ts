import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CircleWalletService } from '../wallet/circle-wallet.service';
import type { HeartbeatResponse } from '@arctube/types';

/**
 * DB-Less Payment Engine
 * Executes real Nanopayments on Arc Testnet via Circle Programmable Wallets.
 */
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  // In a DB-less demo, we use configured wallets
  private readonly sourceWalletId = process.env.SOURCE_WALLET_ID;
  private readonly destinationWalletAddress = process.env.DESTINATION_WALLET_ADDRESS;

  constructor(private readonly circle: CircleWalletService) {
    if (!this.sourceWalletId || !this.destinationWalletAddress) {
      this.logger.warn('⚠️ Missing SOURCE_WALLET_ID or DESTINATION_WALLET_ADDRESS in .env');
    }
  }

  async processHeartbeat(
    userId: string,
    videoId: string,
    second: number,
  ): Promise<HeartbeatResponse> {
    const amount = 0.001; // $0.001 per second

    if (!this.sourceWalletId || !this.destinationWalletAddress) {
      throw new BadRequestException('Wallets not configured for demo');
    }

    // 1. Execute Circle USDC transfer on Arc Testnet
    try {
      const transfer = await this.circle.transferUSDC({
        fromWalletId: this.sourceWalletId,
        toAddress: this.destinationWalletAddress,
        amount: amount.toString(),
      });

      this.logger.log(
        `💰 [DB-Less] Heartbeat: second=${second} amount=${amount} txHash=${transfer.txHash}`,
      );

      // In a stateless demo, totalPaid is tracked on the client or mocked
      const totalPaid = (second + 1) * amount;
      const ownershipPrice = 2.0; 
      const isOwned = totalPaid >= ownershipPrice;

      return {
        success: true,
        txHash: transfer.txHash,
        arcBlockNumber: transfer.blockNumber || 0,
        amountPaid: amount,
        totalPaidVideo: totalPaid,
        ownershipPrice,
        isOwned,
        remainingBalance: 99.99, // Mock remaining balance
      };
    } catch (error: any) {
      this.logger.error(`Failed to process payment: ${error.message}`);
      throw new BadRequestException('Payment transfer failed on Arc Testnet');
    }
  }
}
