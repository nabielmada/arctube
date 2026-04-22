import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentModule } from './payment/payment.module';
import { VideoModule } from './video/video.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    AuthModule,
    WalletModule,
    PaymentModule,
    VideoModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
