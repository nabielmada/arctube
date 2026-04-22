<template>
  <div class="video-card glass-card" @click="$emit('click')">
    <!-- Thumbnail -->
    <div class="card-thumbnail">
      <div class="thumbnail-gradient"></div>
      <div class="thumbnail-play">▶</div>

      <!-- Duration badge -->
      <span class="card-duration text-mono">
        {{ formatDuration(video.durationSeconds) }}
      </span>

      <!-- Price badge -->
      <span class="badge badge-price card-price">
        ${{ video.pricePerSecond }}/sec
      </span>
    </div>

    <!-- Info -->
    <div class="card-body">
      <h3 class="card-title">{{ video.title }}</h3>
      <p class="card-creator text-muted text-sm">
        @{{ video.creatorUsername || 'anonymous' }}
      </p>

      <div class="card-footer">
        <span class="card-earned text-mono">
          <span class="earned-dot"></span>
          ${{ Number(video.totalEarned).toFixed(2) }} earned
        </span>
        <span class="card-own text-xs text-dim">
          Own for ${{ Number(video.ownershipPrice).toFixed(2) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDuration } from '@arctube/utils';

defineProps<{
  video: {
    id: string;
    title: string;
    durationSeconds: number;
    pricePerSecond: number;
    ownershipPrice: number;
    totalEarned: number;
    creatorUsername?: string | null;
    thumbnail?: string | null;
  };
}>();

defineEmits(['click']);
</script>

<style scoped>
.video-card {
  cursor: pointer;
  overflow: hidden;
  padding: 0;
}

.card-thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  background: var(--arc-bg-elevated);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-gradient {
  position: absolute;
  inset: 0;
  background: var(--arc-gradient-hero);
  opacity: 0.6;
}

.thumbnail-play {
  position: relative;
  z-index: 2;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(108, 92, 231, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  font-size: 1.2rem;
  color: white;
  opacity: 0;
  transform: scale(0.8);
  transition: all var(--arc-transition-normal);
}

.video-card:hover .thumbnail-play {
  opacity: 1;
  transform: scale(1);
}

.card-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: var(--arc-radius-sm);
  font-size: 0.72rem;
  color: var(--arc-text);
  z-index: 2;
}

.card-price {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

.card-body {
  padding: var(--arc-space-md);
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--arc-text-bright);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-creator {
  margin-bottom: var(--arc-space-sm);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--arc-space-sm);
  border-top: 1px solid var(--arc-border-glass);
}

.card-earned {
  font-size: 0.78rem;
  color: var(--arc-success);
  display: flex;
  align-items: center;
  gap: 6px;
}

.earned-dot {
  width: 6px;
  height: 6px;
  background: var(--arc-success);
  border-radius: 50%;
  animation: pulse-badge 2s ease-in-out infinite;
}
</style>
