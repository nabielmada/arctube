<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="login-orb login-orb-1"></div>
      <div class="login-orb login-orb-2"></div>
    </div>
    <div class="login-card glass-card animate-scale-in">
      <div class="login-logo">
        <span class="logo-icon">▶</span>
        <span class="logo-text">Arc<span class="text-gradient">Tube</span></span>
      </div>
      <h1 class="login-title">Welcome Back</h1>
      <p class="text-muted text-center mb-lg">Sign in to start watching and earning</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input v-model="email" type="email" class="input" placeholder="you@example.com" required />
        </div>
        <button type="submit" class="btn btn-primary btn-lg w-full" :disabled="loading">
          {{ loading ? '⏳ Sending Magic Link...' : '✨ Send Magic Link' }}
        </button>
      </form>
      <div v-if="sent" class="sent-msg animate-slide-up">
        <div class="sent-icon">📧</div>
        <p>Check your email for the magic link!</p>
      </div>
      <div class="login-divider"><span>or</span></div>
      <button class="btn btn-secondary w-full" @click="handleDemoLogin">
        🎮 Demo Mode (No Auth)
      </button>
      <p class="login-footer text-xs text-dim text-center mt-md">
        By signing in, you agree to pay-per-second pricing at $0.001 USDC/sec
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
const email = ref('');
const loading = ref(false);
const sent = ref(false);
const handleLogin = async () => {
  loading.value = true;
  await new Promise(r => setTimeout(r, 1500));
  loading.value = false;
  sent.value = true;
};
const handleDemoLogin = () => {
  const user = useState('user');
  user.value = { id: 'demo-user', email: 'demo@arctube.io' } as any;
  navigateTo('/');
};
useHead({ title: 'Sign In — ArcTube' });
</script>
<style scoped>
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.login-bg { position: absolute; inset: 0; }
.login-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.12; }
.login-orb-1 { width: 500px; height: 500px; background: var(--arc-primary); top: -200px; right: -100px; animation: float 10s infinite; }
.login-orb-2 { width: 400px; height: 400px; background: var(--arc-secondary); bottom: -150px; left: -100px; animation: float 12s infinite reverse; }
.login-card { position: relative; z-index: 2; width: 100%; max-width: 420px; padding: var(--arc-space-2xl); margin: var(--arc-space-lg); }
.login-logo { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: var(--arc-space-lg); }
.logo-icon { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; background: var(--arc-gradient-primary); border-radius: var(--arc-radius-sm); font-size: 1rem; color: white; }
.logo-text { font-size: 1.6rem; font-weight: 800; color: var(--arc-text-bright); }
.login-title { text-align: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
.form-group { margin-bottom: var(--arc-space-md); }
.form-label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; }
.sent-msg { text-align: center; padding: var(--arc-space-md); background: rgba(0,230,118,0.08); border: 1px solid rgba(0,230,118,0.2); border-radius: var(--arc-radius-md); margin-top: var(--arc-space-md); color: var(--arc-success); }
.sent-icon { font-size: 2rem; margin-bottom: 8px; }
.login-divider { display: flex; align-items: center; gap: 12px; margin: var(--arc-space-lg) 0; color: var(--arc-text-dim); font-size: 0.8rem; }
.login-divider::before, .login-divider::after { content: ''; flex: 1; height: 1px; background: var(--arc-border-glass); }
</style>
