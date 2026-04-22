<template>
  <div class="page">
    <div class="container" style="max-width:640px">
      <h1 class="text-2xl font-bold mb-lg animate-slide-up">👛 Wallet</h1>
      <!-- Balance Card -->
      <div class="balance-card glass-card animate-scale-in">
        <div class="balance-label text-muted">Available Balance</div>
        <div class="balance-amount text-mono">
          <span class="text-gradient">${{ balance.toFixed(6) }}</span>
          <span class="balance-unit">USDC</span>
        </div>
        <div class="balance-address">
          <span class="text-mono text-sm text-muted">{{ walletAddress }}</span>
        </div>
        <div class="balance-actions">
          <button class="btn btn-primary" @click="topUp(10)">+ $10 USDC</button>
          <button class="btn btn-secondary" @click="topUp(50)">+ $50 USDC</button>
          <button class="btn btn-secondary" @click="topUp(100)">+ $100 USDC</button>
        </div>
      </div>
      <!-- Network Info -->
      <div class="network-info glass-card mt-md" style="padding:var(--arc-space-lg)">
        <h3 class="font-semibold mb-md">⛓️ Network</h3>
        <div class="info-row"><span class="text-muted">Chain</span><span class="font-semibold">Arc Testnet</span></div>
        <div class="info-row"><span class="text-muted">Chain ID</span><span class="text-mono">5042002</span></div>
        <div class="info-row"><span class="text-muted">Gas Token</span><span>USDC (native)</span></div>
        <div class="info-row"><span class="text-muted">Gas per TX</span><span class="text-mono" style="color:var(--arc-success)">~$0.000001</span></div>
        <div class="info-row"><span class="text-muted">Explorer</span><a href="https://testnet.arcscan.app" target="_blank">testnet.arcscan.app ↗</a></div>
        <div class="info-row"><span class="text-muted">Faucet</span><a href="https://faucet.circle.com" target="_blank">faucet.circle.com ↗</a></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const balance = useState('balance', () => 25.0);
const walletAddress = ref('0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38');
const topUp = (amount: number) => { balance.value += amount; };
useHead({ title: 'Wallet — ArcTube' });
</script>
<style scoped>
.balance-card { padding: var(--arc-space-2xl); text-align: center; }
.balance-label { font-size: 0.9rem; margin-bottom: 8px; }
.balance-amount { font-size: 2.8rem; font-weight: 900; line-height: 1.2; }
.balance-unit { font-size: 1rem; color: var(--arc-text-muted); margin-left: 8px; }
.balance-address { margin: var(--arc-space-md) 0; padding: 8px 16px; background: var(--arc-bg-card); border-radius: var(--arc-radius-sm); display: inline-block; }
.balance-actions { display: flex; gap: var(--arc-space-sm); justify-content: center; margin-top: var(--arc-space-lg); flex-wrap: wrap; }
.info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--arc-border-glass); }
.info-row:last-child { border-bottom: none; }
</style>
