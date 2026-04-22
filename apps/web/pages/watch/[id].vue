<template>
  <div class="page">
    <div class="container watch-layout">
      <!-- Left: Video Player -->
      <div class="watch-main">
        <div class="player-wrapper glass-card">
          <div class="player-container">
            <video
              ref="videoEl"
              class="video-player"
              @timeupdate="onTimeUpdate"
              @play="onPlay"
              @pause="onPause"
              controls
              playsinline
            ></video>

            <!-- Loading indicator -->
            <div v-if="isLoading" class="player-loading">
              <div class="loading-spinner"></div>
              <span class="text-muted text-sm">Loading stream...</span>
            </div>

            <!-- Paywall overlay -->
            <div v-if="showPaywall" class="paywall-overlay">
              <div class="paywall-content animate-scale-in">
                <div class="paywall-icon">💰</div>
                <h3>Insufficient USDC Balance</h3>
                <p class="text-muted">Top up your wallet to continue watching</p>
                <button class="btn btn-primary" @click="navigateTo('/wallet')">Top Up Wallet</button>
              </div>
            </div>

            <!-- Teaser indicator -->
            <div v-if="isTeaserPhase && isPlaying" class="teaser-badge badge badge-live">
              FREE PREVIEW — {{ teaserRemaining }}s left
            </div>

            <!-- Live cost ticker -->
            <div v-if="isPlaying && !isTeaserPhase && !isOwned" class="cost-ticker badge badge-price">
              ⚡ -${{ video.pricePerSecond }}/sec
            </div>
          </div>
        </div>

        <div class="video-info mt-md">
          <h1 class="video-title">{{ video.title }}</h1>
          <div class="video-meta flex items-center gap-md">
            <span class="text-muted">@{{ video.creatorUsername }}</span>
            <span class="badge badge-price">${{ video.pricePerSecond }}/sec</span>
            <span class="text-muted text-sm">{{ formatDur(video.durationSeconds) }}</span>
            <span v-if="isOwned" class="badge badge-owned">OWNED ✓</span>
          </div>
          <p class="video-desc text-muted mt-sm">{{ video.description }}</p>
        </div>

        <!-- TX History -->
        <div class="tx-history mt-lg glass-card" style="padding:var(--arc-space-lg)">
          <h3 class="mb-md">⚡ Live Transaction Feed</h3>
          <div class="tx-list">
            <TransitionGroup name="slide">
              <div v-for="(tx, i) in recentTxs" :key="tx.hash" class="tx-row">
                <span class="badge badge-tx">TX</span>
                <a :href="`${useRuntimeConfig().public.arcExplorer}/tx/${tx.hash}`" target="_blank" rel="noopener noreferrer" class="text-mono text-sm tx-link" style="color:var(--arc-secondary); text-decoration: underline; text-underline-offset: 2px;">{{ shortH(tx.hash) }}</a>
                <span class="text-mono text-sm" style="color:var(--arc-danger)">-${{ tx.amount.toFixed(4) }}</span>
                <span class="text-xs text-dim">{{ tx.ago }}</span>
              </div>
            </TransitionGroup>
            <div v-if="!recentTxs.length" class="text-center text-muted" style="padding:24px">
              Press ▶ play — transactions will appear here in real time
            </div>
          </div>
        </div>
      </div>

      <!-- Right: USDC Meter -->
      <div class="watch-sidebar">
        <USDCMeter
          :totalPaid="totalPaid"
          :ownershipPrice="video.ownershipPrice"
          :txCount="txCount"
          :latestTx="latestTx"
          :isOwned="isOwned"
        />
        <div class="sidebar-info glass-card" style="padding:var(--arc-space-lg);margin-top:var(--arc-space-md)">
          <div class="info-row">
            <span class="text-muted">Your Balance</span>
            <span class="text-mono font-bold" style="color:var(--arc-secondary)">${{ balance.toFixed(4) }}</span>
          </div>
          <div class="info-row">
            <span class="text-muted">Session Cost</span>
            <span class="text-mono">${{ totalPaid.toFixed(4) }}</span>
          </div>
          <div class="info-row">
            <span class="text-muted">Own For</span>
            <span class="text-mono">${{ video.ownershipPrice.toFixed(2) }}</span>
          </div>
          <div class="info-row">
            <span class="text-muted">Watch Time</span>
            <span class="text-mono">{{ formatDur(currentSecond) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Hls from 'hls.js';
import { getDemoVideo, DEMO_VIDEOS } from '~/data/videos';

const route = useRoute();
const videoId = route.params.id as string;

const videoEl = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const isLoading = ref(true);
const currentSecond = ref(0);
const totalPaid = ref(0);
const txCount = ref(0);
const latestTx = ref<any>(null);
const isOwned = ref(false);
const showPaywall = ref(false);
const balance = useState('balance', () => 25.0);
const recentTxs = ref<{ hash: string; amount: number; ago: string }[]>([]);

// Resolve video from catalog (fallback to first demo)
const demoVideo = getDemoVideo(videoId) ?? DEMO_VIDEOS[0];

const video = ref({
  id: demoVideo.id,
  title: demoVideo.title,
  description: demoVideo.description,
  durationSeconds: demoVideo.durationSeconds,
  pricePerSecond: demoVideo.pricePerSecond,
  ownershipPrice: demoVideo.ownershipPrice,
  teaserSeconds: demoVideo.teaserSeconds,
  creatorUsername: demoVideo.creatorUsername,
  hlsUrl: demoVideo.hlsUrl,
});

const isTeaserPhase = computed(() => currentSecond.value < video.value.teaserSeconds);
const teaserRemaining = computed(() => Math.max(0, video.value.teaserSeconds - currentSecond.value));

let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let hlsInstance: Hls | null = null;

const formatDur = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
const shortH = (h: string) => h ? `${h.slice(0, 10)}...${h.slice(-4)}` : '';

// ─── HLS Initialization ────────────────────────────────
const initPlayer = () => {
  const el = videoEl.value;
  if (!el) return;

  const hlsUrl = video.value.hlsUrl;

  if (Hls.isSupported()) {
    hlsInstance = new Hls({
      startLevel: -1,
      debug: false,
    });

    hlsInstance.loadSource(hlsUrl);
    hlsInstance.attachMedia(el);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      isLoading.value = false;
    });

    hlsInstance.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        console.error('HLS fatal error:', data);
        isLoading.value = false;
      }
    });
  } else if (el.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari native HLS
    el.src = hlsUrl;
    el.addEventListener('loadedmetadata', () => {
      isLoading.value = false;
    });
  }
};

// ─── Playback Events ────────────────────────────────────
const onTimeUpdate = (e: Event) => {
  const t = (e.target as HTMLVideoElement).currentTime;
  currentSecond.value = Math.floor(t);
};

const onPlay = () => {
  isPlaying.value = true;
  startHeartbeat();
};

const onPause = () => {
  isPlaying.value = false;
};

// ─── Heartbeat Engine ───────────────────────────────────
let isHeartbeatProcessing = false;

const startHeartbeat = () => {
  if (heartbeatTimer) return;

  heartbeatTimer = setInterval(async () => {
    if (!isPlaying.value || isOwned.value || isTeaserPhase.value) return;
    if (isHeartbeatProcessing) return;

    const amt = video.value.pricePerSecond;

    // Check balance
    if (balance.value < amt) {
      showPaywall.value = true;
      isPlaying.value = false;
      videoEl.value?.pause();
      clearHeartbeat();
      return;
    }

    try {
      isHeartbeatProcessing = true;
      
      const config = useRuntimeConfig();
      const res = await $fetch(`${config.public.apiBase}/payment/heartbeat`, {
        method: 'POST',
        body: {
          sessionId: 'session-123',
          videoId: video.value.id,
          second: currentSecond.value
        }
      });

      if (res && res.txHash) {
        // Process payment locally for UI after success
        balance.value -= amt;
        totalPaid.value += amt;
        txCount.value += 1;

        const hash = res.txHash;
        latestTx.value = { arc_tx_hash: hash, amount_usdc: amt };
        recentTxs.value.unshift({ hash, amount: amt, ago: 'just now' });
        if (recentTxs.value.length > 30) recentTxs.value.pop();

        // Check ownership threshold
        if (totalPaid.value >= video.value.ownershipPrice) {
          isOwned.value = true;
          clearHeartbeat();
        }
      }
    } catch (err) {
      console.error('Heartbeat failed:', err);
    } finally {
      isHeartbeatProcessing = false;
    }
  }, 1000); // Wait 1 second between heartbeats (per-second billing)
};

const clearHeartbeat = () => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
};

// ─── Lifecycle ──────────────────────────────────────────
onMounted(() => {
  initPlayer();
});

onUnmounted(() => {
  clearHeartbeat();
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
});

useHead({ title: `${video.value.title} — ArcTube` });
</script>

<style scoped>
.watch-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: var(--arc-space-xl);
  align-items: start;
}

.player-wrapper {
  overflow: hidden;
  padding: 0;
}

.player-container {
  position: relative;
  aspect-ratio: 16/9;
  background: #000;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

/* Loading spinner */
.player-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 3;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(108, 92, 231, 0.3);
  border-top-color: var(--arc-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Paywall overlay */
.paywall-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 15, 26, 0.92);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.paywall-content {
  text-align: center;
}

.paywall-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

/* Badges on video */
.teaser-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 5;
}

.cost-ticker {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
  animation: pulse-badge 1s ease-in-out infinite;
}

/* Video info */
.video-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--arc-text-bright);
}

.video-meta {
  margin-top: 8px;
}

/* TX list */
.tx-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.tx-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--arc-border-glass);
}

/* Sidebar info */
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--arc-border-glass);
}

.info-row:last-child {
  border-bottom: none;
}

@media (max-width: 900px) {
  .watch-layout {
    grid-template-columns: 1fr;
  }
}
</style>
