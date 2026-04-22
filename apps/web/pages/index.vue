<template>
  <div class="page">
    <div class="container">
      <!-- Hero Section -->
      <section class="hero animate-slide-up">
        <div class="hero-content">
          <div class="hero-badge badge badge-price">⚡ Pay-Per-Second</div>
          <h1 class="hero-title">
            Watch Videos,
            <span class="text-gradient">Pay Per Second</span>
          </h1>
          <p class="hero-subtitle">
            $0.001 USDC per second, streamed directly to creators on Arc L1.
            No subscriptions. No middleman. 99.9% goes to creators.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" @click="navigateTo('/auth/login')">
              🚀 Start Watching
            </button>
            <button class="btn btn-secondary btn-lg" @click="navigateTo('/upload')">
              🎬 Upload Content
            </button>
          </div>

          <!-- Stats Row -->
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-value text-gradient">$0.001</span>
              <span class="stat-label">per second</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value text-gradient">99.9%</span>
              <span class="stat-label">to creators</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value text-gradient">~$0.000001</span>
              <span class="stat-label">gas per tx</span>
            </div>
          </div>
        </div>

        <!-- Decorative orbs -->
        <div class="hero-orb hero-orb-1"></div>
        <div class="hero-orb hero-orb-2"></div>
        <div class="hero-orb hero-orb-3"></div>
      </section>

      <!-- Video Grid -->
      <section class="browse-section mt-xl">
        <div class="section-header">
          <h2 class="section-title">🔥 Trending Videos</h2>
          <span class="badge badge-live">● LIVE</span>
        </div>

        <div class="video-grid stagger-children">
          <VideoCard
            v-for="video in videos"
            :key="video.id"
            :video="video"
            @click="navigateTo(`/watch/${video.id}`)"
          />

          <!-- Empty state -->
          <div v-if="!videos.length" class="empty-state">
            <div class="empty-icon">🎬</div>
            <h3>No videos yet</h3>
            <p class="text-muted">Be the first creator to upload content!</p>
            <button class="btn btn-primary mt-md" @click="navigateTo('/upload')">
              Upload Video
            </button>
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section class="how-it-works mt-xl">
        <h2 class="section-title text-center mb-lg">How ArcTube Works</h2>
        <div class="steps-grid stagger-children">
          <div class="step glass-card">
            <div class="step-number">1</div>
            <div class="step-icon">👛</div>
            <h3>Connect Wallet</h3>
            <p class="text-muted">Sign in and get a USDC wallet auto-provisioned via Circle</p>
          </div>
          <div class="step glass-card">
            <div class="step-number">2</div>
            <div class="step-icon">▶️</div>
            <h3>Watch & Pay</h3>
            <p class="text-muted">$0.001 USDC per second — only pay for what you watch</p>
          </div>
          <div class="step glass-card">
            <div class="step-number">3</div>
            <div class="step-icon">🏆</div>
            <h3>Own Forever</h3>
            <p class="text-muted">Reach the cap and own the content permanently. No more payments!</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DEMO_VIDEOS } from '~/data/videos';

// Use centralized video catalog — in production these come from Supabase
const videos = ref(DEMO_VIDEOS);

useHead({
  title: 'ArcTube — Pay-Per-Second Video Platform on Arc L1',
});
</script>

<style scoped>
/* ─── Hero ──────────────────────────────────────────────── */
.hero {
  position: relative;
  padding: var(--arc-space-3xl) 0;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  margin-bottom: var(--arc-space-lg);
  font-size: 0.8rem;
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: var(--arc-space-lg);
  color: var(--arc-text-bright);
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--arc-text-muted);
  max-width: 600px;
  margin: 0 auto var(--arc-space-xl);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: var(--arc-space-md);
  justify-content: center;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--arc-space-xl);
  margin-top: var(--arc-space-2xl);
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--arc-font-mono);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--arc-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--arc-border);
}

/* Decorative orbs */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  pointer-events: none;
}

.hero-orb-1 {
  width: 400px;
  height: 400px;
  background: var(--arc-primary);
  top: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

.hero-orb-2 {
  width: 300px;
  height: 300px;
  background: var(--arc-secondary);
  bottom: -50px;
  right: -50px;
  animation: float 10s ease-in-out infinite reverse;
}

.hero-orb-3 {
  width: 200px;
  height: 200px;
  background: var(--arc-accent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float 12s ease-in-out infinite;
}

/* ─── Section Header ───────────────────────────────────── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--arc-space-lg);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--arc-text-bright);
}

/* ─── Video Grid ───────────────────────────────────────── */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--arc-space-lg);
}

/* ─── Empty State ──────────────────────────────────────── */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--arc-space-3xl);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--arc-space-md);
}

/* ─── How it Works ─────────────────────────────────────── */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--arc-space-lg);
}

.step {
  padding: var(--arc-space-xl);
  text-align: center;
  position: relative;
}

.step-number {
  position: absolute;
  top: 12px;
  left: 16px;
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--arc-primary);
  background: rgba(108, 92, 231, 0.15);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.step-icon {
  font-size: 2.5rem;
  margin-bottom: var(--arc-space-md);
}

.step h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: var(--arc-space-sm);
  color: var(--arc-text-bright);
}

@media (max-width: 768px) {
  .hero {
    padding: var(--arc-space-xl) 0;
  }

  .hero-stats {
    gap: var(--arc-space-md);
  }

  .stat-divider {
    display: none;
  }
}
</style>
