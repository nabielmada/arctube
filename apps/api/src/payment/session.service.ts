import { Injectable, BadRequestException } from '@nestjs/common';
import { supabaseAdmin } from '@arctube/supabase';

/**
 * Manages watch session lifecycle — start, stop, and query.
 * Sessions track active viewing and link to payment heartbeats.
 */
@Injectable()
export class SessionService {
  /**
   * Start a new watch session for a video
   */
  async startSession(userId: string, videoId: string) {
    // Check if video exists
    const { data: video } = await supabaseAdmin
      .from('videos')
      .select('price_per_second, ownership_price, teaser_seconds')
      .eq('id', videoId)
      .single();

    if (!video) throw new BadRequestException('Video not found');

    // Check existing ownership
    const { data: ownership } = await supabaseAdmin
      .from('ownerships')
      .select('is_complete')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .maybeSingle();

    // Check user balance
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('usdc_balance')
      .eq('id', userId)
      .single();

    // Close any existing active sessions for this user+video
    await supabaseAdmin
      .from('watch_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .eq('is_active', true);

    // Create new session
    const { data: session, error } = await supabaseAdmin
      .from('watch_sessions')
      .insert({
        user_id: userId,
        video_id: videoId,
      })
      .select()
      .single();

    if (error) throw new BadRequestException(`Failed to create session: ${error.message}`);

    return {
      sessionId: session.id,
      isAlreadyOwned: ownership?.is_complete || false,
      balance: parseFloat(String(profile?.usdc_balance || 0)),
      pricePerSecond: parseFloat(String(video.price_per_second)),
      ownershipPrice: parseFloat(String(video.ownership_price)),
    };
  }

  /**
   * Stop an active watch session
   */
  async stopSession(userId: string, sessionId: string) {
    const { error } = await supabaseAdmin
      .from('watch_sessions')
      .update({ is_active: false })
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) throw new BadRequestException(`Failed to stop session: ${error.message}`);

    return { success: true };
  }
}
