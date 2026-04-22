import { Injectable, BadRequestException } from '@nestjs/common';
import { supabaseAdmin } from '@arctube/supabase';
import { CircleWalletService } from '../wallet/circle-wallet.service';
import type { WalletProvisionResult } from '@arctube/types';

/**
 * Handles post-signup wallet provisioning.
 * Creates a Circle Programmable Wallet for the user and updates their profile.
 */
@Injectable()
export class AuthService {
  constructor(private readonly circleWallet: CircleWalletService) {}

  async provisionWallet(userId: string): Promise<WalletProvisionResult> {
    // Check if user already has a wallet
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('wallet_id, wallet_address')
      .eq('id', userId)
      .single();

    if (profile?.wallet_id && profile?.wallet_address) {
      return {
        walletId: profile.wallet_id,
        walletAddress: profile.wallet_address,
        blockchain: 'ARC',
      };
    }

    // Create new Circle wallet
    const wallet = await this.circleWallet.createWallet(userId);

    // Update profile with wallet info
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        wallet_id: wallet.walletId,
        wallet_address: wallet.address,
      })
      .eq('id', userId);

    if (error) {
      throw new BadRequestException(`Failed to update profile: ${error.message}`);
    }

    return {
      walletId: wallet.walletId,
      walletAddress: wallet.address,
      blockchain: wallet.blockchain,
    };
  }
}
