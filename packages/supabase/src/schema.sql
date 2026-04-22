-- ═══════════════════════════════════════════════════════════════
-- ArcTube Database Schema v2.0
-- Pay-Per-Second Video Platform on Arc L1
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ─── Users (extends Supabase auth.users) ─────────────────────
CREATE TABLE public.profiles (
  id              UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  wallet_id       TEXT UNIQUE,
  wallet_address  TEXT UNIQUE,
  usdc_balance    NUMERIC(18,8) DEFAULT 0,
  role            TEXT DEFAULT 'viewer' CHECK (role IN ('viewer','creator','admin')),
  username        TEXT UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT now()
);


-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (new.id);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ─── Videos ──────────────────────────────────────────────────
CREATE TABLE public.videos (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  duration_seconds INT  NOT NULL,
  price_per_second NUMERIC(18,8) DEFAULT 0.001,
  ownership_price  NUMERIC(18,8) NOT NULL,
  hls_manifest_url TEXT NOT NULL,
  teaser_seconds   INT  DEFAULT 10,
  total_earned     NUMERIC(18,8) DEFAULT 0,
  status           TEXT DEFAULT 'active' CHECK (status IN ('active','draft','removed')),
  created_at       TIMESTAMPTZ DEFAULT now()
);


-- ─── Transactions ────────────────────────────────────────────
CREATE TABLE public.transactions (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id          UUID REFERENCES public.profiles(id),
  video_id         UUID REFERENCES public.videos(id),
  amount_usdc      NUMERIC(18,8) NOT NULL,
  arc_tx_hash      TEXT UNIQUE,
  arc_block_number BIGINT,
  second_index     INT NOT NULL,
  status           TEXT DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','failed')),
  created_at       TIMESTAMPTZ DEFAULT now()
);


-- ─── Ownership ───────────────────────────────────────────────
CREATE TABLE public.ownerships (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id          UUID REFERENCES public.profiles(id),
  video_id         UUID REFERENCES public.videos(id),
  total_paid       NUMERIC(18,8) DEFAULT 0,
  is_complete      BOOLEAN DEFAULT false,
  completed_at     TIMESTAMPTZ,
  arc_mint_tx_hash TEXT,
  UNIQUE(user_id, video_id)
);


-- ─── Watch Sessions ─────────────────────────────────────────
CREATE TABLE public.watch_sessions (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id          UUID REFERENCES public.profiles(id),
  video_id         UUID REFERENCES public.videos(id),
  started_at       TIMESTAMPTZ DEFAULT now(),
  last_heartbeat   TIMESTAMPTZ DEFAULT now(),
  seconds_watched  INT DEFAULT 0,
  total_paid_usdc  NUMERIC(18,8) DEFAULT 0,
  is_active        BOOLEAN DEFAULT true
);


-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_transactions_user_video ON public.transactions(user_id, video_id);
CREATE INDEX idx_transactions_tx_hash    ON public.transactions(arc_tx_hash);
CREATE INDEX idx_ownerships_user_video   ON public.ownerships(user_id, video_id);
CREATE INDEX idx_sessions_user_active    ON public.watch_sessions(user_id, is_active);


-- ─── Row Level Security ─────────────────────────────────────
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ownerships     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, self-update only
CREATE POLICY "Public profiles"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Own profile edit" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Videos: public read, creator write
CREATE POLICY "Public videos"    ON public.videos FOR SELECT USING (true);
CREATE POLICY "Creator insert"   ON public.videos FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Transactions: users see own only, service can insert
CREATE POLICY "Own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service inserts"  ON public.transactions FOR INSERT WITH CHECK (true);

-- Ownerships: users see own only
CREATE POLICY "Own ownerships"   ON public.ownerships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service upserts"  ON public.ownerships FOR INSERT WITH CHECK (true);
CREATE POLICY "Service updates"  ON public.ownerships FOR UPDATE USING (true);

-- Watch sessions: users see own only
CREATE POLICY "Own sessions"     ON public.watch_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Session inserts"  ON public.watch_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Session updates"  ON public.watch_sessions FOR UPDATE USING (auth.uid() = user_id);
