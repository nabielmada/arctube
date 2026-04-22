import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ─── Environment Resolution ─────────────────────────────────────
// Supports both Nuxt (NUXT_PUBLIC_) and NestJS (plain) env prefixes
const resolveUrl = (): string =>
  process.env.NUXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';

const resolveAnonKey = (): string =>
  process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

const resolveServiceKey = (): string =>
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ─── Public Client (respects RLS) ───────────────────────────────
// Used by frontend and for user-scoped operations
export const createSupabaseClient = (): SupabaseClient<Database> =>
  createClient<Database>(resolveUrl(), resolveAnonKey(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: { eventsPerSecond: 100 },
    },
  });

// ─── Admin Client (bypasses RLS) ────────────────────────────────
// Used by backend services for privileged operations
export const createSupabaseAdmin = (): SupabaseClient<Database> =>
  createClient<Database>(resolveUrl(), resolveServiceKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

// Singleton instances for convenience
export const supabase = createSupabaseClient();
export const supabaseAdmin = createSupabaseAdmin();
