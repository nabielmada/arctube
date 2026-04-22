import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { supabaseAdmin } from '@arctube/supabase';

@Controller('analytics')
@UseGuards(SupabaseAuthGuard)
export class AnalyticsController {
  /** GET /api/analytics/creator — Creator earnings dashboard data */
  @Get('creator')
  async getCreatorAnalytics(@Req() req: any) {
    const userId = req.user.id;

    // Get all videos by this creator
    const { data: videos } = await supabaseAdmin
      .from('videos')
      .select('id, title, total_earned, duration_seconds, price_per_second')
      .eq('creator_id', userId);

    if (!videos?.length) return { videos: [], totalEarned: 0, totalTransactions: 0 };

    const videoIds = videos.map((v) => v.id);

    // Get transaction breakdown per video
    const { data: transactions } = await supabaseAdmin
      .from('transactions')
      .select('video_id, second_index, amount_usdc, created_at')
      .in('video_id', videoIds)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
      .limit(500);

    // Calculate per-second heatmap data
    const heatmapData: Record<string, Record<number, number>> = {};
    for (const tx of transactions || []) {
      if (!heatmapData[tx.video_id]) heatmapData[tx.video_id] = {};
      const secondKey = tx.second_index;
      heatmapData[tx.video_id][secondKey] =
        (heatmapData[tx.video_id][secondKey] || 0) + parseFloat(String(tx.amount_usdc));
    }

    const totalEarned = videos.reduce(
      (sum, v) => sum + parseFloat(String(v.total_earned)),
      0,
    );

    return {
      videos: videos.map((v) => ({
        ...v,
        totalEarned: parseFloat(String(v.total_earned)),
        heatmap: heatmapData[v.id] || {},
      })),
      totalEarned,
      totalTransactions: transactions?.length || 0,
    };
  }
}
