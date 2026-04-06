// @ts-nocheck — archivo Deno/Edge Function, no compatible con el TS del IDE
// apps/api/_shared/supabaseAdmin.ts
// ─────────────────────────────────────────────────────────────────────────────
// Cliente Supabase con service_role key.
// NUNCA importar este archivo desde apps/web/.
// Bypasea RLS completamente — úsalo solo cuando sea estrictamente necesario.
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
