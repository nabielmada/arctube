import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/provision-wallet
   * Called after Supabase sign-up to create a Circle wallet for the user
   */
  @Post('provision-wallet')
  @UseGuards(SupabaseAuthGuard)
  async provisionWallet(@Req() req: any) {
    const userId = req.user.id;
    return this.authService.provisionWallet(userId);
  }
}
