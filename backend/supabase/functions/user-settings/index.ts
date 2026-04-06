const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}
function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  return null
}

async function checkRateLimit(supabase: any, key: string, max = 30, window = 60) {
  const { data, error } = await supabase.rpc('check_rate_limit', { p_key: key, p_max_requests: max, p_window_seconds: window })
  if (error) return { allowed: true, headers: { 'X-RateLimit-Limit': String(max) } }
  const r = data as { allowed: boolean; remaining: number; reset_at: string }
  const h: Record<string, string> = { 'X-RateLimit-Limit': String(max), 'X-RateLimit-Remaining': String(r.remaining), 'X-RateLimit-Reset': r.reset_at }
  if (!r.allowed) {
    return { allowed: false, headers: h, response: new Response(
      JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED', message: `Try again after ${r.reset_at}` }),
      { status: 429, headers: { ...corsHeaders, ...h, 'Content-Type': 'application/json', 'Retry-After': String(window) } }
    )}
  }
  return { allowed: true, headers: h }
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const cors = handleCors(req)
  if (cors) return cors

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Missing authorization' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const rl = await checkRateLimit(admin, `user:settings:${user.id}`, 30, 60)
    if (!rl.allowed && rl.response) return rl.response

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method
    const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }

    // ================================================================
    // INTEGRATIONS: /user-settings/integrations/whatsapp
    // ================================================================
    if (path.includes('integrations')) {

      // GET — obtener config de WhatsApp del usuario
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('user_integrations')
          .select('id, provider, config, is_active, created_at, updated_at')
          .eq('provider', 'whatsapp')
          .single()

        if (error || !data) {
          return new Response(JSON.stringify({
            data: null,
            message: 'No WhatsApp integration configured',
            webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
          }), { status: 200, headers: rh })
        }

        return new Response(JSON.stringify({
          data: {
            ...data,
            webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
          },
        }), { status: 200, headers: rh })
      }

      // PUT — guardar/actualizar config de WhatsApp
      if (method === 'PUT') {
        const body = await req.json()
        const { phone_number_id, access_token, verify_token, default_venture_id } = body

        if (!phone_number_id || !access_token || !verify_token) {
          return new Response(JSON.stringify({
            code: 'VALIDATION_ERROR',
            message: 'phone_number_id, access_token, and verify_token are required',
          }), { status: 400, headers: rh })
        }

        // Encriptar el access_token
        const encryptionKey = Deno.env.get('ENCRYPTION_KEY') || 'finova-default-key'
        const { data: encrypted } = await admin.rpc('encrypt_token', {
          p_token: access_token,
          p_key: encryptionKey,
        })

        // Upsert: crear o actualizar
        const { data, error } = await admin
          .from('user_integrations')
          .upsert({
            user_id: user.id,
            provider: 'whatsapp',
            config: {
              phone_number_id,
              verify_token,
              default_venture_id: default_venture_id || null,
            },
            encrypted_token: encrypted,
            is_active: true,
          }, { onConflict: 'user_id,provider' })
          .select('id, provider, config, is_active, updated_at')
          .single()

        if (error) {
          return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        }

        return new Response(JSON.stringify({
          data,
          webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
          message: 'WhatsApp integration saved. Use the webhook_url in your Meta Business dashboard.',
        }), { status: 200, headers: rh })
      }

      // DELETE — desactivar integración
      if (method === 'DELETE') {
        const { error } = await supabase
          .from('user_integrations')
          .update({ is_active: false })
          .eq('provider', 'whatsapp')

        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ message: 'WhatsApp integration deactivated' }), { status: 200, headers: rh })
      }
    }

    // ================================================================
    // KEYWORDS: /user-settings/keywords
    // ================================================================
    if (path.includes('keywords')) {
      const parts = path.split('/').filter(Boolean)
      const keywordId = parts[parts.length - 1] !== 'keywords' ? parts[parts.length - 1] : null

      // GET — listar keywords del usuario
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('whatsapp_keywords')
          .select('*')
          .order('maps_to')
          .order('keyword')

        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
      }

      // POST — agregar keyword
      if (method === 'POST') {
        const body = await req.json()
        if (!body.keyword || !body.maps_to) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'keyword and maps_to required' }), { status: 400, headers: rh })
        }
        if (!['income', 'expense'].includes(body.maps_to)) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'maps_to must be income or expense' }), { status: 400, headers: rh })
        }

        const { data, error } = await supabase
          .from('whatsapp_keywords')
          .insert({ user_id: user.id, keyword: body.keyword.toLowerCase().trim(), maps_to: body.maps_to })
          .select()
          .single()

        if (error) {
          if (error.code === '23505') {
            return new Response(JSON.stringify({ code: 'DUPLICATE', message: 'Keyword already exists' }), { status: 409, headers: rh })
          }
          return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        }
        return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
      }

      // DELETE — eliminar keyword
      if (method === 'DELETE') {
        if (!keywordId) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Keyword ID required' }), { status: 400, headers: rh })
        }
        const { error } = await supabase.from('whatsapp_keywords').delete().eq('id', keywordId)
        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ message: 'Keyword deleted' }), { status: 200, headers: rh })
      }
    }

    return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Use /user-settings/integrations or /user-settings/keywords' }), { status: 404, headers: rh })
  } catch (err) {
    console.error('[UserSettings] Error:', err)
    return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
