<template>
  <div class="page">
    <div class="container" style="max-width:640px">
      <div class="animate-slide-up">
        <h1 class="text-2xl font-bold mb-md">🎬 Upload Video</h1>
        <p class="text-muted mb-lg">Share your content and earn $0.001 USDC per second watched</p>
      </div>
      <form class="upload-form glass-card" style="padding:var(--arc-space-xl)" @submit.prevent="handleUpload">
        <div class="form-group">
          <label class="form-label">Video Title *</label>
          <input v-model="form.title" class="input" placeholder="My awesome video" required />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea v-model="form.description" class="input" placeholder="What's this video about?"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Duration (seconds) *</label>
            <input v-model.number="form.durationSeconds" type="number" class="input" min="1" required />
          </div>
          <div class="form-group">
            <label class="form-label">Price per second (USDC)</label>
            <input v-model.number="form.pricePerSecond" type="number" class="input" step="0.001" min="0.001" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Ownership Price (USDC) *</label>
            <input v-model.number="form.ownershipPrice" type="number" class="input" step="0.01" min="0.01" required />
          </div>
          <div class="form-group">
            <label class="form-label">Free Teaser (seconds)</label>
            <input v-model.number="form.teaserSeconds" type="number" class="input" min="0" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">HLS Manifest URL *</label>
          <input v-model="form.hlsManifestUrl" class="input text-mono" placeholder="https://..." required />
        </div>
        <!-- Cost Preview -->
        <div class="cost-preview glass-card" style="padding:var(--arc-space-md);background:rgba(108,92,231,0.08)">
          <div class="flex justify-between mb-sm"><span class="text-muted">Total cost to own</span><span class="text-mono font-bold">${{ form.ownershipPrice.toFixed(2) }}</span></div>
          <div class="flex justify-between mb-sm"><span class="text-muted">Viewer pays per minute</span><span class="text-mono">${{ (form.pricePerSecond * 60).toFixed(3) }}</span></div>
          <div class="flex justify-between"><span class="text-muted">Your margin per tx</span><span class="text-mono" style="color:var(--arc-success)">99.9%</span></div>
        </div>
        <button type="submit" class="btn btn-primary btn-lg w-full" :disabled="uploading">
          {{ uploading ? '⏳ Uploading...' : '🚀 Publish Video' }}
        </button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
const uploading = ref(false);
const form = ref({
  title: '', description: '', durationSeconds: 120, pricePerSecond: 0.001,
  ownershipPrice: 5.0, teaserSeconds: 10, hlsManifestUrl: '',
});
const handleUpload = async () => {
  uploading.value = true;
  // Simulate upload delay
  await new Promise(r => setTimeout(r, 1500));
  uploading.value = false;
  navigateTo('/dashboard');
};
useHead({ title: 'Upload Video — ArcTube' });
</script>
<style scoped>
.form-group { margin-bottom: var(--arc-space-md); }
.form-label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--arc-text); margin-bottom: 6px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--arc-space-md); }
.cost-preview { margin-bottom: var(--arc-space-lg); border: 1px solid var(--arc-border); }
@media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
</style>
