import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const user = useState('user', () => null);
  const balance = useState('balance', () => 25.0);

  const url = config.public.supabaseUrl;
  const key = config.public.supabaseAnonKey;

  // Only create client if credentials are available
  if (url && key) {
    const supabase = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
      realtime: { params: { eventsPerSecond: 100 } },
    });

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      user.value = session?.user ?? null;

      if (event === 'SIGNED_IN' && session) {
        try {
          await $fetch(`${config.public.apiBase}/api/auth/provision-wallet`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
        } catch (e) {
          console.warn('Wallet provisioning skipped:', e);
        }
      }
    });

    return { provide: { supabase } };
  }

  // No Supabase credentials — provide null client
  return { provide: { supabase: null } };
});
