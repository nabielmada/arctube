// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'ArcTube — Pay-Per-Second Video',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Watch videos, pay per second. $0.001 USDC per second streamed directly to creators on Arc L1.',
        },
        { name: 'theme-color', content: '#0F0F1A' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
      arcExplorer: process.env.NUXT_PUBLIC_ARC_EXPLORER || 'https://testnet.arcscan.app',
      pricePerSecond: parseFloat(process.env.NUXT_PUBLIC_PRICE_PER_SECOND || '0.001'),
      freeTeaserSeconds: parseInt(process.env.NUXT_PUBLIC_FREE_TEASER_SECONDS || '10'),
    },
  },
});
