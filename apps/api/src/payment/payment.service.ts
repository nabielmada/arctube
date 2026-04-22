import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { supabaseAdmin } from '@arctube/supabase';
import { CircleWalletService } from '../wallet/circle-wallet.service';
import type { HeartbeatResponse } from '@arctube/types';

/**
 * Core payment engine — processes per-second heartbeats.
 * Each heartbeat = 1 USDC microtransaction from viewer to creator via Arc.
 *
 * Flow: Validate → Check ownership → Debit viewer → Credit creator → Record tx
 */
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly circle: CircleWalletService) {}

  /**
   * Process a single heartbeat payment for one second of video watched.
   * This is the CORE of ArcTube — called every second during playback.
   */
  async processHeartbeat(
    userId: string,
    videoId: string,
    second: number,
  ): Promise<HeartbeatResponse> {
    // ── 1. Fetch video + existing ownership in parallel ──────
    const [videoResult, ownershipResult] = await Promise.all([
      supabaseAdmin.from('videos').select('*').eq('id', videoId).single(),
      supabaseAdmin
        .from('ownerships')
        .select('*')
        .eq('user_id', userId)
        .eq('video_id', videoId)
        .maybeSingle(),
    ]);

    const video = videoResult.data;
    const ownership = ownershipResult.data;

    if (!video) throw new BadRequestException('Video not found');

    // Already fully owned — no payment needed
    if (ownership?.is_complete) {
      return this.buildOwnershipResponse(video);
    }

    // ── 2. Fetch user profile for wallet + balance ───────────
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) throw new BadRequestException('Profile not found');

    const amount = parseFloat(String(video.price_per_second));
    const balance = parseFloat(String(profile.usdc_balance));

    if (balance < amount) {
      throw new BadRequestException('Insufficient USDC balance');
    }

    // ── 3. Execute Circle USDC transfer on Arc ───────────────
    const { data: creator } = await supabaseAdmin
      .from('profiles')
      .select('wallet_address')
      .eq('id', video.creator_id)
      .single();

    const transfer = await this.circle.transferUSDC({
      fromWalletId: profile.wallet_id,
      toAddress: creator!.wallet_address,
      amount: amount.toString(),
    });

    // ── 4. Insert transaction (triggers Supabase Realtime) ───
    await supabaseAdmin.from('transactions').insert({
      user_id: userId,
      video_id: videoId,
      amount_usdc: amount,
      arc_tx_hash: transfer.txHash,
      arc_block_number: transfer.blockNumber,
      second_index: second,
      status: 'confirmed',
    });

    // ── 5. Upsert ownership accumulator ──────────────────────
    const previousPaid = parseFloat(String(ownership?.total_paid || 0));
    const newTotal = previousPaid + amount;
    const ownershipPrice = parseFloat(String(video.ownership_price));
    const isOwned = newTotal >= ownershipPrice;

    await supabaseAdmin.from('ownerships').upsert(
      {
        user_id: userId,
        video_id: videoId,
        total_paid: newTotal,
        is_complete: isOwned,
        ...(isOwned ? { completed_at: new Date().toISOString() } : {}),
      },
      { onConflict: 'user_id,video_id' },
    );

    // ── 6. Deduct from viewer balance ────────────────────────
    await supabaseAdmin
      .from('profiles')
      .update({ usdc_balance: balance - amount })
      .eq('id', userId);

    // ── 7. Credit creator earnings ───────────────────────────
    const videoEarned = parseFloat(String(video.total_earned));
    await supabaseAdmin
      .from('videos')
      .update({ total_earned: videoEarned + amount })
      .eq('id', videoId);

    // ── 8. Update watch session ──────────────────────────────
    await supabaseAdmin
      .from('watch_sessions')
      .update({
        last_heartbeat: new Date().toISOString(),
        seconds_watched: second + 1,
        total_paid_usdc: newTotal,
      })
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .eq('is_active', true);

    this.logger.log(
      `💰 Heartbeat: user=${userId.slice(0, 8)} video=${videoId.slice(0, 8)} ` +
      `second=${second} amount=${amount} total=${newTotal.toFixed(6)} owned=${isOwned}`,
    );

    return {
      success: true,
      txHash: transfer.txHash,
      arcBlockNumber: transfer.blockNumber,
      amountPaid: amount,
      totalPaidVideo: newTotal,
      ownershipPrice,
      isOwned,
      remainingBalance: balance - amount,
    };
  }

  private buildOwnershipResponse(video: any): HeartbeatResponse {
    return {
      success: true,
      txHash: '',
      arcBlockNumber: 0,
      amountPaid: 0,
      totalPaidVideo: parseFloat(String(video.ownership_price)),
      ownershipPrice: parseFloat(String(video.ownership_price)),
      isOwned: true,
      remainingBalance: 0,
    };
  }
}
