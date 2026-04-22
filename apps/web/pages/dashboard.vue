<template>
  <div class="page">
    <div class="container">
      <h1 class="text-2xl font-bold mb-lg animate-slide-up">📊 Creator Dashboard</h1>
      <!-- Stats Cards -->
      <div class="stats-grid stagger-children">
        <div class="stat-card glass-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value text-gradient text-mono">${{ totalEarned.toFixed(4) }}</div>
          <div class="stat-label text-muted text-sm">Total Earned</div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon">📺</div>
          <div class="stat-value text-gradient">{{ videoCount }}</div>
          <div class="stat-label text-muted text-sm">Videos</div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-value text-gradient text-mono">{{ totalTxns }}</div>
          <div class="stat-label text-muted text-sm">Transactions</div>
        </div>
        <div class="stat-card glass-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value text-gradient">99.9%</div>
          <div class="stat-label text-muted text-sm">Margin</div>
        </div>
      </div>
      <!-- Video List -->
      <h2 class="text-lg font-semibold mt-xl mb-md">Your Videos</h2>
      <div class="video-list stagger-children">
        <div v-for="v in videos" :key="v.id" class="video-row glass-card">
          <div class="video-row-info">
            <h3 class="font-semibold">{{ v.title }}</h3>
            <span class="text-muted text-sm">{{ v.duration }}s · ${{ v.pricePerSecond }}/sec</span>
          </div>
          <div class="video-row-stats">
            <div class="vr-stat"><span class="text-mono font-bold" style="color:var(--arc-success)">${{ v.earned.toFixed(4) }}</span><span class="text-xs text-muted">earned</span></div>
            <div class="vr-stat"><span class="text-mono font-bold">{{ v.txns }}</span><span class="text-xs text-muted">txns</span></div>
          </div>
          <!-- Mini heatmap -->
          <div class="mini-heatmap">
            <div v-for="(val, i) in v.heatmap" :key="i" class="hm-cell" :style="{ opacity: 0.2 + val * 0.8, background: val > 0.5 ? 'var(--arc-secondary)' : 'var(--arc-primary)' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const totalEarned = ref(21.68);
const videoCount = ref(4);
const totalTxns = ref(2168);
const videos = ref([
  { id: '1', title: 'Introduction to Arc L1 Blockchain', duration: 120, pricePerSecond: 0.001, earned: 8.45, txns: 845, heatmap: Array.from({length:20}, () => Math.random()) },
  { id: '2', title: 'Building Pay-Per-Second dApps', duration: 300, pricePerSecond: 0.001, earned: 6.12, txns: 612, heatmap: Array.from({length:20}, () => Math.random()) },
  { id: '3', title: 'USDC Streaming: The Future', duration: 180, pricePerSecond: 0.001, earned: 4.33, txns: 433, heatmap: Array.from({length:20}, () => Math.random()) },
  { id: '4', title: 'Circle Wallets Deep Dive', duration: 240, pricePerSecond: 0.001, earned: 2.78, txns: 278, heatmap: Array.from({length:20}, () => Math.random()) },
]);
useHead({ title: 'Creator Dashboard — ArcTube' });
</script>
<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--arc-space-md); }
.stat-card { padding: var(--arc-space-xl); text-align: center; }
.stat-icon { font-size: 2rem; margin-bottom: 8px; }
.stat-value { font-size: 1.8rem; font-weight: 800; }
.stat-label { margin-top: 4px; }
.video-list { display: flex; flex-direction: column; gap: var(--arc-space-md); }
.video-row { padding: var(--arc-space-lg); display: grid; grid-template-columns: 1fr auto auto; gap: var(--arc-space-lg); align-items: center; }
.video-row-stats { display: flex; gap: var(--arc-space-lg); }
.vr-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.mini-heatmap { display: flex; gap: 2px; }
.hm-cell { width: 8px; height: 24px; border-radius: 2px; transition: all 0.3s; }
@media (max-width: 768px) { .video-row { grid-template-columns: 1fr; } .mini-heatmap { display: none; } }
</style>
