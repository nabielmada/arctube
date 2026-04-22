import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SessionService } from './session.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly sessionService: SessionService,
  ) {}

  /** POST /api/payment/session/start */
  @Post('session/start')
  async startSession(@Req() req: any, @Body() body: { videoId: string }) {
    const userId = req.user?.id || 'viewer-123';
    return this.sessionService.startSession(userId, body.videoId);
  }

  /** POST /api/payment/heartbeat — CORE endpoint */
  @Post('heartbeat')
  async heartbeat(
    @Req() req: any,
    @Body() body: { sessionId: string; videoId: string; second: number },
  ) {
    const userId = req.user?.id || 'viewer-123';
    return this.paymentService.processHeartbeat(userId, body.videoId, body.second);
  }

  /** POST /api/payment/session/stop */
  @Post('session/stop')
  async stopSession(@Req() req: any, @Body() body: { sessionId: string }) {
    const userId = req.user?.id || 'viewer-123';
    return this.sessionService.stopSession(userId, body.sessionId);
  }

  /** GET /api/payment/ownership/:videoId */
  @Get('ownership/:videoId')
  async getOwnership(@Req() req: any, @Param('videoId') videoId: string) {
    return {
      isOwned: false,
      totalPaid: 0,
    };
  }

  /** GET /api/payment/history/:videoId */
  @Get('history/:videoId')
  async getHistory(@Req() req: any, @Param('videoId') videoId: string) {
    return [];
  }
}
