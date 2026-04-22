import { Module } from '@nestjs/common';
import { CircleWalletService } from './circle-wallet.service';

@Module({
  providers: [CircleWalletService],
  exports: [CircleWalletService],
})
export class WalletModule {}
