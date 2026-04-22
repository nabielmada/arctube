<template>
  <div class="page">
    <div class="container watch-layout">
      <!-- Left: Video Player -->
      <div class="watch-main">
        <div class="player-wrapper glass-card">
          <div class="player-container">
            <video ref="videoEl" class="video-player" @timeupdate="onTimeUpdate" @play="onPlay" @pause="onPause" controls></video>
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
            <div v-if="isTeaserPhase" class="teaser-badge badge badge-live">FREE PREVIEW — {{ teaserRemaining }}s left</div>
          </div>
        </div>
        <div class="video-info mt-md">
          <h1 class="video-title">{{ video.title }}</h1>
          <div class="video-meta flex items-center gap-md">
            <span class="text-muted">@{{ video.creatorUsername || 'creator' }}</span>
            <span class="badge badge-price">${{ video.pricePerSecond }}/sec</span>
            <span class="text-muted text-sm">{{ formatDur(video.durationSeconds) }}</span>
          </div>
          <p class="video-desc text-muted mt-sm">{{ video.description }}</p>
        </div>
        <!-- TX History -->
        <div class="tx-history mt-lg glass-card" style="padding:var(--arc-space-lg)">
          <h3 class="mb-md">Live Transaction Feed</h3>
          <div class="tx-list">
            <div v-for="(tx, i) in recentTxs" :key="i" class="tx-row">
              <span class="badge badge-tx">TX</span>
              <span class="text-mono text-sm" style="color:var(--arc-secondary)">{{ shortH(tx.hash) }}</span>
              <span class="text-mono text-sm" style="color:var(--arc-danger)">-${{ tx.amount.toFixed(4) }}</span>
              <span class="text-xs text-dim">{{ tx.ago }}</span>
            </div>
            <div v-if="!recentTxs.length" class="text-center text-muted" style="padding:24px">
              Transactions will appear here when you start watching
            </div>
          </div>
        </div>
      </div>
      <!-- Right: USDC Meter -->
      <div class="watch-sidebar">
        <USDCMeter :totalPaid="totalPaid" :ownershipPrice="video.ownershipPrice" :txCount="txCount" :latestTx="latestTx" :isOwned="isOwned" />
        <div class="sidebar-info glass-card" style="padding:var(--arc-space-lg);margin-top:var(--arc-space-md)">
          <div class="info-row"><span class="text-muted">Balance</span><span class="text-mono font-bold" style="color:var(--arc-secondary)">${{ balance.toFixed(4) }}</span></div>
          <div class="info-row"><span class="text-muted">Session Cost</span><span class="text-mono">${{ totalPaid.toFixed(4) }}</span></div>
          <div class="info-row"><span class="text-muted">Own For</span><span class="text-mono">${{ video.ownershipPrice.toFixed(2) }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const videoId = route.params.id as string;
const videoEl = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const currentSecond = ref(0);
const totalPaid = ref(0);
const txCount = ref(0);
const latestTx = ref<any>(null);
const isOwned = ref(false);
const showPaywall = ref(false);
const balance = ref(25.0);
const recentTxs = ref<{ hash: string; amount: number; ago: string }[]>([]);

const video = ref({
  id: videoId,
  title: 'Introduction to Arc L1 Blockchain',
  description: 'Learn about Arc L1 and why USDC-native gas changes everything for micropayments.',
  durationSeconds: 120,
  pricePerSecond: 0.001,
  ownershipPrice: 5.0,
  teaserSeconds: 10,
  creatorUsername: 'arc_dev',
});

const isTeaserPhase = computed(() => currentSecond.value < video.value.teaserSeconds);
const teaserRemaining = computed(() => Math.max(0, video.value.teaserSeconds - currentSecond.value));

let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

const formatDur = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
const shortH = (h: string) => h ? `${h.slice(0, 8)}...${h.slice(-4)}` : '';

const onTimeUpdate = (e: Event) => {
  const t = (e.target as HTMLVideoElement).currentTime;
  currentSecond.value = Math.floor(t);
};

const onPlay = () => { isPlaying.value = true; startHeartbeat(); };
const onPause = () => { isPlaying.value = false; };

const startHeartbeat = () => {
  if (heartbeatTimer) return;
  heartbeatTimer = setInterval(() => {
    if (!isPlaying.value || isOwned.value || isTeaserPhase.value) return;
    const amt = video.value.pricePerSecond;
    if (balance.value < amt) { showPaywall.value = true; isPlaying.value = false; if (heartbeatTimer) clearInterval(heartbeatTimer); heartbeatTimer = null; return; }
    balance.value -= amt;
    totalPaid.value += amt;
    txCount.value += 1;
    const hash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
    latestTx.value = { arc_tx_hash: hash, amount_usdc: amt };
    recentTxs.value.unshift({ hash, amount: amt, ago: 'just now' });
    if (recentTxs.value.length > 20) recentTxs.value.pop();
    if (totalPaid.value >= video.value.ownershipPrice) { isOwned.value = true; if (heartbeatTimer) clearInterval(heartbeatTimer); heartbeatTimer = null; }
  }, 1000);
};

onUnmounted(() => { if (heartbeatTimer) clearInterval(heartbeatTimer); });
useHead({ title: `${video.value.title} — ArcTube` });
</script>
<style scoped>
.watch-layout { display: grid; grid-template-columns: 1fr 340px; gap: var(--arc-space-xl); align-items: start; }
.player-wrapper { overflow: hidden; padding: 0; }
.player-container { position: relative; aspect-ratio: 16/9; background: #000; }
.video-player { width: 100%; height: 100%; object-fit: contain; background: #000; }
.paywall-overlay { position: absolute; inset: 0; background: rgba(15,15,26,0.92); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; z-index: 10; }
.paywall-content { text-align: center; }
.paywall-icon { font-size: 3rem; margin-bottom: 16px; }
.teaser-badge { position: absolute; top: 12px; left: 12px; z-index: 5; }
.video-title { font-size: 1.4rem; font-weight: 700; color: var(--arc-text-bright); }
.video-meta { margin-top: 8px; }
.tx-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
.tx-row { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--arc-border-glass); }
.info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--arc-border-glass); }
.info-row:last-child { border-bottom: none; }
@media (max-width: 900px) { .watch-layout { grid-template-columns: 1fr; } }
</style>
