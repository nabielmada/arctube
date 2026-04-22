import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { PaymentService } from './payment.service';
import { SessionService } from './session.service';
import { supabaseAdmin } from '@arctube/supabase';

@Controller('payment')
@UseGuards(SupabaseAuthGuard)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly sessionService: SessionService,
  ) {}

  /** POST /api/payment/session/start */
  @Post('session/start')
  async startSession(@Req() req: any, @Body() body: { videoId: string }) {
    return this.sessionService.startSession(req.user.id, body.videoId);
  }

  /** POST /api/payment/heartbeat — CORE endpoint */
  @Post('heartbeat')
  async heartbeat(
    @Req() req: any,
    @Body() body: { sessionId: string; videoId: string; second: number },
  ) {
    return this.paymentService.processHeartbeat(req.user.id, body.videoId, body.second);
  }

  /** POST /api/payment/session/stop */
  @Post('session/stop')
  async stopSession(@Req() req: any, @Body() body: { sessionId: string }) {
    return this.sessionService.stopSession(req.user.id, body.sessionId);
  }

  /** GET /api/payment/ownership/:videoId */
  @Get('ownership/:videoId')
  async getOwnership(@Req() req: any, @Param('videoId') videoId: string) {
    const { data } = await supabaseAdmin
      .from('ownerships')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('video_id', videoId)
      .maybeSingle();

    return {
      isOwned: data?.is_complete || false,
      totalPaid: data ? parseFloat(String(data.total_paid)) : 0,
    };
  }

  /** GET /api/payment/history/:videoId */
  @Get('history/:videoId')
  async getHistory(@Req() req: any, @Param('videoId') videoId: string) {
    const { data } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('video_id', videoId)
      .order('created_at', { ascending: false })
      .limit(100);

    return data || [];
  }
}
