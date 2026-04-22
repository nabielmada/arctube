<template>
  <div class="usdc-meter glass-card">
    <div class="meter-header">
      <div class="meter-label"><span class="meter-dot"></span><span>USDC Streaming</span></div>
      <div class="meter-amount text-mono">
        <span class="amount-paid">{{ totalPaid.toFixed(4) }}</span>
        <span class="amount-sep"> / </span>
        <span class="amount-total">{{ ownershipPrice.toFixed(2) }} USDC</span>
      </div>
    </div>
    <div class="progress-bar"><div class="progress-bar-fill" :style="{ width: pct + '%' }"></div></div>
    <div class="meter-sub flex justify-between"><span class="text-mono text-xs text-muted">{{ pct.toFixed(1) }}%</span><span class="text-mono text-xs text-muted">${{ remaining.toFixed(4) }} left</span></div>
    <div v-if="latestTx" class="tx-latest">
      <span class="badge badge-tx">TX</span>
      <a :href="`https://testnet.arcscan.app/tx/${latestTx.arc_tx_hash}`" target="_blank" class="tx-hash text-mono">{{ shortHash(latestTx.arc_tx_hash) }}</a>
      <span class="tx-amt text-mono">-{{ Number(latestTx.amount_usdc).toFixed(4) }}</span>
    </div>
    <div class="tx-count"><span class="text-gradient text-mono font-bold text-lg">{{ txCount }}</span><span class="text-xs text-muted"> txns on Arc</span></div>
    <Transition name="pop"><div v-if="isOwned" class="owned-banner">🏆 OWNED FOREVER — No more payments</div></Transition>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ totalPaid: number; ownershipPrice: number; txCount: number; latestTx: any; isOwned: boolean }>();
const pct = computed(() => Math.min(100, (props.totalPaid / props.ownershipPrice) * 100));
const remaining = computed(() => Math.max(0, props.ownershipPrice - props.totalPaid));
const shortHash = (h: string) => h ? `${h.slice(0, 6)}...${h.slice(-4)}` : '';
</script>
<style scoped>
.usdc-meter { padding: var(--arc-space-lg); display: flex; flex-direction: column; gap: var(--arc-space-md); }
.meter-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.meter-label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; }
.meter-dot { width: 8px; height: 8px; background: var(--arc-success); border-radius: 50%; animation: pulse-badge 1.5s infinite; }
.amount-paid { color: var(--arc-secondary); font-weight: 700; }
.amount-sep { color: var(--arc-text-dim); }
.amount-total { color: var(--arc-text-muted); font-size: 0.8rem; }
.tx-latest { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(0,210,211,0.05); border: 1px solid rgba(0,210,211,0.1); border-radius: var(--arc-radius-sm); }
.tx-hash { font-size: 0.78rem; color: var(--arc-secondary); flex: 1; }
.tx-amt { font-size: 0.78rem; color: var(--arc-danger); font-weight: 600; }
.tx-count { display: flex; align-items: baseline; gap: 6px; }
.owned-banner { text-align: center; padding: var(--arc-space-lg); background: var(--arc-gradient-success); border-radius: var(--arc-radius-md); font-weight: 900; color: #0F0F1A; font-size: 1.1rem; animation: glow-pulse 2s infinite; }
</style>
