import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { supabaseAdmin } from '@arctube/supabase';

@Controller('video')
export class VideoController {
  /** GET /api/video/:id — Public: get video metadata */
  @Get(':id')
  async getVideo(@Param('id') id: string) {
    const { data: video, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !video) return { error: 'Video not found' };

    // Also fetch creator info
    const { data: creator } = await supabaseAdmin
      .from('profiles')
      .select('username, wallet_address')
      .eq('id', video.creator_id)
      .single();

    return {
      ...video,
      creator_username: creator?.username,
      creator_wallet: creator?.wallet_address,
    };
  }

  /** GET /api/video — Public: list all active videos */
  @Get()
  async listVideos() {
    const { data } = await supabaseAdmin
      .from('videos')
      .select('*, profiles!videos_creator_id_fkey(username)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    return data || [];
  }

  /** POST /api/video/upload — Creator: upload a new video */
  @Post('upload')
  @UseGuards(SupabaseAuthGuard)
  async uploadVideo(@Req() req: any, @Body() body: any) {
    const userId = req.user.id;

    // Update user role to creator if not already
    await supabaseAdmin
      .from('profiles')
      .update({ role: 'creator' })
      .eq('id', userId)
      .eq('role', 'viewer');

    const { data, error } = await supabaseAdmin
      .from('videos')
      .insert({
        creator_id: userId,
        title: body.title,
        description: body.description || null,
        duration_seconds: body.durationSeconds,
        price_per_second: body.pricePerSecond || 0.001,
        ownership_price: body.ownershipPrice,
        hls_manifest_url: body.hlsManifestUrl,
        teaser_seconds: body.teaserSeconds || 10,
      })
      .select()
      .single();

    if (error) return { error: error.message };
    return data;
  }
}
