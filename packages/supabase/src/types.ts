// ─── Auto-generated Database Types ──────────────────────────────
// Replace this file with output from:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_ID
// ─────────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'viewer' | 'creator' | 'admin';
export type VideoStatus = 'active' | 'draft' | 'removed';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          wallet_id: string;
          wallet_address: string;
          usdc_balance: number;
          role: UserRole;
          username: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          wallet_id?: string;
          wallet_address?: string;
          usdc_balance?: number;
          role?: UserRole;
          username?: string | null;
        };
        Update: {
          wallet_id?: string;
          wallet_address?: string;
          usdc_balance?: number;
          role?: UserRole;
          username?: string | null;
        };
      };
      videos: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          duration_seconds: number;
          price_per_second: number;
          ownership_price: number;
          hls_manifest_url: string;
          teaser_seconds: number;
          total_earned: number;
          status: VideoStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          duration_seconds: number;
          price_per_second?: number;
          ownership_price: number;
          hls_manifest_url: string;
          teaser_seconds?: number;
          total_earned?: number;
          status?: VideoStatus;
        };
        Update: {
          title?: string;
          description?: string | null;
          price_per_second?: number;
          ownership_price?: number;
          hls_manifest_url?: string;
          teaser_seconds?: number;
          total_earned?: number;
          status?: VideoStatus;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          amount_usdc: number;
          arc_tx_hash: string;
          arc_block_number: number;
          second_index: number;
          status: TransactionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          amount_usdc: number;
          arc_tx_hash?: string;
          arc_block_number?: number;
          second_index: number;
          status?: TransactionStatus;
        };
        Update: {
          amount_usdc?: number;
          arc_tx_hash?: string;
          arc_block_number?: number;
          status?: TransactionStatus;
        };
      };
      ownerships: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          total_paid: number;
          is_complete: boolean;
          completed_at: string | null;
          arc_mint_tx_hash: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          total_paid?: number;
          is_complete?: boolean;
          completed_at?: string | null;
          arc_mint_tx_hash?: string | null;
        };
        Update: {
          total_paid?: number;
          is_complete?: boolean;
          completed_at?: string | null;
          arc_mint_tx_hash?: string | null;
        };
      };
      watch_sessions: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          started_at: string;
          last_heartbeat: string;
          seconds_watched: number;
          total_paid_usdc: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          started_at?: string;
          last_heartbeat?: string;
          seconds_watched?: number;
          total_paid_usdc?: number;
          is_active?: boolean;
        };
        Update: {
          last_heartbeat?: string;
          seconds_watched?: number;
          total_paid_usdc?: number;
          is_active?: boolean;
        };
      };
    };
  };
}
