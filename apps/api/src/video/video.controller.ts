import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';

@Controller('video')
export class VideoController {
  /** GET /api/video/:id — Public: get video metadata */
  @Get(':id')
  async getVideo(@Param('id') id: string) {
    // Return a mock video
    return {
      id,
      title: 'Demo Video',
      description: 'A mock video for the hackathon demo',
      creator_id: 'creator-123',
      creator_username: 'demo_creator',
      creator_wallet: process.env.DESTINATION_WALLET_ADDRESS || '0xDemoWallet',
      duration_seconds: 60,
      price_per_second: 0.001,
      ownership_price: 0.1,
      teaser_seconds: 10,
      hls_manifest_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      status: 'active',
      created_at: new Date().toISOString()
    };
  }

  /** GET /api/video — Public: list all active videos */
  @Get()
  async listVideos() {
    return [
      {
        id: 'mock-video-1',
        title: 'Agentic Economy Demo',
        description: 'Demonstrating programmable USDC on Arc Testnet',
        creator_id: 'creator-123',
        duration_seconds: 120,
        price_per_second: 0.001,
        ownership_price: 0.1,
        teaser_seconds: 10,
        hls_manifest_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        status: 'active',
        created_at: new Date().toISOString(),
        profiles: { username: 'demo_creator' }
      }
    ];
  }

  /** POST /api/video/upload — Creator: upload a new video */
  @Post('upload')
  async uploadVideo(@Req() req: any, @Body() body: any) {
    const userId = req.user?.id || 'creator-123';
    
    // Return mock created video
    return {
      id: 'new-mock-video',
      creator_id: userId,
      title: body.title,
      description: body.description || null,
      duration_seconds: body.durationSeconds,
      price_per_second: body.pricePerSecond || 0.001,
      ownership_price: body.ownershipPrice,
      hls_manifest_url: body.hlsManifestUrl,
      teaser_seconds: body.teaserSeconds || 10,
      status: 'active',
      created_at: new Date().toISOString()
    };
  }
}
