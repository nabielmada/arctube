<template>
  <nav class="navbar">
    <div class="navbar-inner container">
      <!-- Logo -->
      <NuxtLink to="/" class="navbar-logo">
        <span class="logo-icon">▶</span>
        <span class="logo-text">Arc<span class="logo-accent">Tube</span></span>
      </NuxtLink>

      <!-- Navigation Links -->
      <div class="navbar-links hide-mobile">
        <NuxtLink to="/" class="nav-link">Browse</NuxtLink>
        <NuxtLink to="/upload" class="nav-link">Upload</NuxtLink>
        <NuxtLink to="/dashboard" class="nav-link">Dashboard</NuxtLink>
      </div>

      <!-- Right side -->
      <div class="navbar-actions">
        <NuxtLink v-if="user" to="/wallet" class="wallet-pill">
          <span class="wallet-dot"></span>
          <span class="wallet-amount text-mono">{{ formatBalance }} USDC</span>
        </NuxtLink>

        <button v-if="!user" class="btn btn-primary btn-sm" @click="navigateTo('/auth/login')">
          Sign In
        </button>

        <button v-else class="avatar-btn" @click="handleLogout" title="Sign Out">
          {{ userInitial }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const user = useState('user', () => null as any);
const balance = useState('balance', () => 0);

const formatBalance = computed(() => balance.value.toFixed(4));
const userInitial = computed(() => {
  const email = user.value?.email || 'U';
  return email.charAt(0).toUpperCase();
});

const handleLogout = async () => {
  const { $supabase } = useNuxtApp();
  if ($supabase) {
    await ($supabase as any).auth.signOut();
  }
  user.value = null;
  navigateTo('/');
};
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--arc-bg-glass-strong);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--arc-border-glass);
  height: 72px;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--arc-text-bright);
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--arc-gradient-primary);
  border-radius: var(--arc-radius-sm);
  font-size: 0.9rem;
  color: white;
  box-shadow: var(--arc-shadow-glow-primary);
}

.logo-accent {
  background: var(--arc-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-links {
  display: flex;
  gap: var(--arc-space-lg);
}

.nav-link {
  color: var(--arc-text-muted);
  font-weight: 500;
  font-size: 0.9rem;
  padding: 6px 12px;
  border-radius: var(--arc-radius-sm);
  transition: all var(--arc-transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--arc-text-bright);
  background: rgba(108, 92, 231, 0.1);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--arc-space-md);
}

.wallet-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(0, 210, 211, 0.08);
  border: 1px solid rgba(0, 210, 211, 0.2);
  border-radius: var(--arc-radius-full);
  color: var(--arc-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all var(--arc-transition-fast);
  text-decoration: none;
}

.wallet-pill:hover {
  background: rgba(0, 210, 211, 0.15);
  box-shadow: var(--arc-shadow-glow-secondary);
}

.wallet-dot {
  width: 8px;
  height: 8px;
  background: var(--arc-success);
  border-radius: 50%;
  animation: pulse-badge 2s ease-in-out infinite;
}

.avatar-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--arc-gradient-primary);
  border: none;
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--arc-transition-fast);
}

.avatar-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--arc-shadow-glow-primary);
}
</style>
