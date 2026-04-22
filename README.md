<p align="center">
  <img src="https://img.shields.io/badge/▶-ArcTube-6C5CE7?style=for-the-badge&labelColor=0F0F1A&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTggNXYxNGwxMS03eiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=" alt="ArcTube" />
</p>

<h1 align="center">ArcTube</h1>

<p align="center">
  <strong>Pay-Per-Second Video Platform on Arc L1 Blockchain</strong>
</p>

<p align="center">
  <code>$0.001 USDC/second</code> · <code>99.9% to creators</code> · <code>~$0.000001 gas/tx</code>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Arc_L1-Testnet-6C5CE7?style=flat-square" alt="Arc L1" />
  <img src="https://img.shields.io/badge/USDC-Native_Gas-00D2D3?style=flat-square" alt="USDC" />
  <img src="https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=flat-square" alt="Turborepo" />
  <img src="https://img.shields.io/badge/Nuxt_3-Frontend-00DC82?style=flat-square" alt="Nuxt 3" />
  <img src="https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square" alt="NestJS" />
  <img src="https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat-square" alt="Supabase" />
  <img src="https://img.shields.io/badge/Circle-Wallets-0066FF?style=flat-square" alt="Circle" />
</p>

---

## 💡 What is ArcTube?

ArcTube is a **Pay-Per-Second (PpS)** video streaming platform built on **Arc L1** — the first blockchain with **native USDC gas**. Viewers pay `$0.001 USDC per second` of video watched, streamed directly to creators with **99.9% margin** and near-zero gas costs.

### Why ArcTube?

| Problem | ArcTube Solution |
|---------|-----------------|
| Subscriptions charge for content you don't watch | **Pay only for seconds watched** |
| Platforms take 30-45% of creator revenue | **99.9% goes directly to creators** |
| Cross-border payments are slow and expensive | **Instant USDC settlement on Arc L1** |
| Viewers don't own content they pay for | **Ownership transfers after reaching price cap** |

---

## 🏗️ Architecture

```
arctube/
├── apps/
│   ├── api/                    # NestJS Backend (Port 3001)
│   │   ├── src/
│   │   │   ├── auth/           # Supabase JWT Auth + Magic Link
│   │   │   ├── wallet/         # Circle Programmable Wallets
│   │   │   ├── payment/        # Heartbeat Engine (PpS Core)
│   │   │   ├── video/          # Video CRUD + HLS Storage
│   │   │   └── analytics/      # Creator Earnings & Stats
│   │   └── ...
│   └── web/                    # Nuxt 3 Frontend (Port 3000)
│       ├── assets/css/         # Design System (Neon Dark)
│       ├── components/         # NavBar, VideoCard, USDCMeter
│       ├── pages/              # 6 Pages (Browse, Watch, Upload, etc.)
│       ├── plugins/            # Supabase Client Plugin
│       └── public/videos/      # HLS Test Manifests
├── packages/
│   ├── supabase/               # Client Factory + SQL Schema + Types
│   ├── types/                  # Shared TypeScript Interfaces
│   └── utils/                  # USDC Formatting + Arc Helpers
├── turbo.json                  # Turborepo Pipeline Config
├── pnpm-workspace.yaml         # Workspace Definition
└── .env.example                # All Environment Variables
```

### System Flow

```
┌──────────┐   Magic Link    ┌──────────┐   JWT Verify    ┌──────────────┐
│  Viewer  │ ──────────────→ │ Supabase │ ──────────────→ │  NestJS API  │
│  (Nuxt)  │                 │   Auth   │                 │   Backend    │
└────┬─────┘                 └──────────┘                 └──────┬───────┘
     │                                                           │
     │  Every 1 Second                                           │
     │  ┌─────────────────────────────────────────────────────┐  │
     │  │                HEARTBEAT ENGINE                     │  │
     │  │  1. Debit viewer wallet    (-$0.001 USDC)          │  │
     │  │  2. Credit creator wallet  (+$0.001 USDC)          │  │
     │  │  3. Record transaction     (Supabase)              │  │
     │  │  4. Settle on Arc L1       (Circle → Blockchain)   │  │
     │  │  5. Check ownership cap    (Transfer if reached)   │  │
     │  │  6. Broadcast via Realtime (Update UI live)        │  │
     │  └─────────────────────────────────────────────────────┘  │
     │                                                           │
     │  ┌──────────────┐                          ┌──────────────┤
     └──│  USDCMeter   │  ←── Supabase Realtime ──│    Circle    │
        │  (Live TX)   │                          │   Wallets    │
        └──────────────┘                          └──────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 9 (`npm install -g pnpm`)
- **Supabase** account ([supabase.com](https://supabase.com))
- **Circle** developer account ([circle.com](https://developers.circle.com))

### 1. Clone & Install

```bash
git clone https://github.com/nabielmada/arctube.git
cd arctube
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your keys:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Circle Programmable Wallets
CIRCLE_API_KEY=your-circle-api-key
CIRCLE_WALLET_SET_ID=your-wallet-set-id
CIRCLE_ENTITY_SECRET=your-entity-secret

# Arc Testnet
ARC_RPC_URL=https://rpc.testnet.arc.network
ARC_CHAIN_ID=5042002
ARC_USDC_CONTRACT=0x3600000000000000000000000000000000000000
```

### 3. Setup Database

Run the SQL schema in Supabase SQL Editor:

```bash
# Copy the schema file content to Supabase Dashboard → SQL Editor
cat packages/supabase/src/schema.sql
```

This creates:
- `profiles` — user wallet mappings
- `videos` — video metadata + HLS URLs
- `transactions` — every PpS payment record
- `ownerships` — content ownership tracking
- `watch_sessions` — viewing analytics

### 4. Run Development

```bash
# Start all apps (Nuxt + NestJS)
pnpm dev

# Or start individually
pnpm --filter @arctube/web dev     # Frontend → http://localhost:3000
pnpm --filter @arctube/api dev     # Backend  → http://localhost:3001
```

---

## 📺 Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| 🏠 **Browse** | `/` | Hero section, trending video grid, how-it-works |
| ▶️ **Watch** | `/watch/[id]` | HLS player, live USDC meter, paywall, TX feed |
| 🎬 **Upload** | `/upload` | Creator upload form with cost preview |
| 📊 **Dashboard** | `/dashboard` | Creator earnings, video stats, activity heatmaps |
| 👛 **Wallet** | `/wallet` | USDC balance, top-up, Arc network info |
| 🔐 **Login** | `/auth/login` | Magic link auth + demo mode |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| **Primary** | `#6C5CE7` (Electric Purple) |
| **Secondary** | `#00D2D3` (Neon Teal) |
| **Accent** | `#FD79A8` (Hot Pink) |
| **Background** | `#0F0F1A` (Deep Space) |
| **Font Sans** | Space Grotesk |
| **Font Mono** | JetBrains Mono |

### Effects
- 🔮 **Glassmorphism** — backdrop-filter blur cards
- ✨ **Micro-animations** — 15+ CSS keyframe animations
- 🌈 **Gradient buttons** — primary, success, warm variants
- 📱 **Fully responsive** — mobile-first breakpoints

---

## ⛓️ Arc L1 Network

| Property | Value |
|----------|-------|
| **Network** | Arc Testnet |
| **Chain ID** | `5042002` |
| **RPC URL** | `https://rpc.testnet.arc.network` |
| **Gas Token** | USDC (native) |
| **Gas/TX** | ~$0.000001 |
| **USDC Contract** | `0x3600000000000000000000000000000000000000` |
| **Explorer** | [testnet.arcscan.app](https://testnet.arcscan.app) |
| **Faucet** | [faucet.circle.com](https://faucet.circle.com) |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/provision-wallet` | Auto-create Circle wallet for new user |

### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/videos` | List all videos (paginated) |
| `GET` | `/api/videos/:id` | Get video details |
| `POST` | `/api/videos` | Create new video (auth required) |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payment/heartbeat` | Process 1-second payment |
| `POST` | `/api/payment/session/start` | Start watch session |
| `POST` | `/api/payment/session/end` | End watch session |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/creator/:id` | Creator earnings summary |
| `GET` | `/api/analytics/video/:id` | Per-video analytics |

---

## 🧩 Shared Packages

### `@arctube/supabase`
- `createSupabaseClient()` — factory supporting both Nuxt & NestJS env prefixes
- `schema.sql` — complete database schema with RLS policies
- `types.ts` — auto-generated database types

### `@arctube/types`
- `Video`, `Transaction`, `WatchSession` interfaces
- `WalletInfo`, `WalletBalance` types
- `HeartbeatPayload`, `HeartbeatResponse` types

### `@arctube/utils`
- `formatUSDC()` — format amounts to 6 decimal places
- `formatDuration()` — seconds to `MM:SS` display
- `calculateOwnershipProgress()` — progress percentage
- `shortenHash()` — truncate blockchain hashes
- `getExplorerTxUrl()` — generate Arc explorer links

---

## 🔒 Security

- **Row Level Security (RLS)** — all Supabase tables have policies
- **JWT validation** — NestJS guard verifies Supabase tokens
- **Server-side wallets** — Circle Programmable Wallets (no private keys exposed)
- **Environment isolation** — `.env` excluded from version control
- **CORS configured** — restricted to frontend origin

---

## 📦 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Monorepo** | Turborepo + pnpm | Build orchestration |
| **Frontend** | Nuxt 3 + Vue 3 | SSR web application |
| **Backend** | NestJS | REST API + payment engine |
| **Database** | Supabase (PostgreSQL) | Data + Auth + Realtime |
| **Payments** | Circle Programmable Wallets | USDC transfers |
| **Blockchain** | Arc L1 (Chain ID: 5042002) | Settlement layer |
| **Streaming** | HLS.js | Adaptive video playback |
| **Language** | TypeScript | End-to-end type safety |

---

## 🛣️ Roadmap

- [ ] Real HLS video encoding pipeline (FFmpeg)
- [ ] Supabase Realtime integration for live TX updates
- [ ] Circle Programmable Wallets production mode
- [ ] Creator payout dashboard with withdrawal
- [ ] Video search and categories
- [ ] Mobile-optimized player experience
- [ ] Content recommendation engine
- [ ] Multi-resolution HLS encoding (360p/720p/1080p)

---

## 📄 License

MIT © [nabielmada](https://github.com/nabielmada)
