// WhatsApp Webhook — Multi-tenant receiver
// JWT deshabilitado: Meta no envía JWT, usa HMAC signature

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature-256',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

// HMAC verification
async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  if (!signature || !signature.startsWith('sha256=')) return false
  const expected = signature.slice(7)
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  const computed = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return computed === expected
}

// Parse keywords from message
function parseMessage(
  text: string,
  keywords: Array<{ keyword: string; maps_to: 'income' | 'expense' }>
): { type: 'income' | 'expense'; amount: number; description: string } | null {
  const msg = text.trim().toLowerCase()
  for (const kw of keywords) {
    if (msg.startsWith(kw.keyword.toLowerCase())) {
      const rest = msg.slice(kw.keyword.length).trim()
      const match = rest.match(/^(\d+(?:\.\d{1,2})?)/)
      if (!match) continue
      const amount = parseFloat(match[1])
      if (isNaN(amount) || amount <= 0) continue
      const desc = rest.slice(match[0].length).trim()
      return { type: kw.maps_to, amount, description: desc || `${kw.keyword} via WhatsApp` }
    }
  }
  return null
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const rh = { ...corsHeaders, 'Content-Type': 'application/json' }

  try {
    // ============================================================
    // GET: Webhook verification challenge (Meta setup)
    // ============================================================
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      if (mode !== 'subscribe' || !token || !challenge) {
        return new Response('Invalid verification request', { status: 400 })
      }

      // Buscar un usuario con este verify_token
      const { data: integration } = await admin
        .from('user_integrations')
        .select('id')
        .eq('provider', 'whatsapp')
        .eq('is_active', true)
        .filter('config->>verify_token', 'eq', token)
        .single()

      if (!integration) {
        return new Response('Verification token not found', { status: 403 })
      }

      // Meta espera el challenge en texto plano
      return new Response(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } })
    }

    // ============================================================
    // POST: Recibir mensajes de WhatsApp
    // ============================================================
    if (req.method === 'POST') {
      const rawBody = await req.text()

      // Rate limit por IP (webhooks no tienen user auth)
      const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const { data: rlData } = await admin.rpc('check_rate_limit', {
        p_key: `webhook:${clientIP}`,
        p_max_requests: 30,
        p_window_seconds: 60,
      })
      if (rlData && !rlData.allowed) {
        return new Response(JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED' }), { status: 429, headers: rh })
      }

      // Parsear payload
      let payload: any
      try {
        payload = JSON.parse(rawBody)
      } catch {
        return new Response('Invalid JSON', { status: 400 })
      }

      // Verificar que es un evento de mensajes de WhatsApp
      if (payload.object !== 'whatsapp_business_account') {
        return new Response('OK', { status: 200 })
      }

      // Responder 200 inmediatamente (Meta espera respuesta rápida)
      // y procesar en background
      const entry = payload.entry?.[0]
      const change = entry?.changes?.[0]
      const value = change?.value

      if (!value?.messages?.[0]) {
        // Status update, no message — acknowledge
        return new Response('OK', { status: 200 })
      }

      const message = value.messages[0]
      const phoneNumberId = value.metadata?.phone_number_id

      if (!phoneNumberId) {
        return new Response('OK', { status: 200 })
      }

      // Identify tenant by phone_number_id
      const { data: integration } = await admin
        .from('user_integrations')
        .select('id, user_id, config, encrypted_token')
        .eq('provider', 'whatsapp')
        .eq('is_active', true)
        .filter('config->>phone_number_id', 'eq', phoneNumberId)
        .single()

      if (!integration) {
        console.warn(`[WA] No integration found for phone_number_id: ${phoneNumberId}`)
        return new Response('OK', { status: 200 })
      }

      // Verify HMAC if app secret is configured
      const appSecret = Deno.env.get('WHATSAPP_APP_SECRET')
      if (appSecret) {
        const signature = req.headers.get('x-hub-signature-256') || ''
        const valid = await verifySignature(rawBody, signature, appSecret)
        if (!valid) {
          console.error('[WA] Invalid HMAC signature')
          return new Response('Invalid signature', { status: 403 })
        }
      }

      const userId = integration.user_id
      const config = integration.config as { phone_number_id: string; verify_token: string; default_venture_id?: string }

      // Get user's keywords
      const { data: keywords } = await admin
        .from('whatsapp_keywords')
        .select('keyword, maps_to')
        .eq('user_id', userId)

      if (!keywords || keywords.length === 0) {
        console.warn(`[WA] No keywords for user ${userId}`)
        return new Response('OK', { status: 200 })
      }

      // Extract text from message
      let textContent = ''
      if (message.type === 'text' && message.text?.body) {
        textContent = message.text.body
      } else if (message.type === 'image' && message.image?.caption) {
        textContent = message.image.caption
      } else {
        // Unsupported message type, skip
        return new Response('OK', { status: 200 })
      }

      // Parse with keywords
      const parsed = parseMessage(textContent, keywords as Array<{ keyword: string; maps_to: 'income' | 'expense' }>)
      if (!parsed) {
        console.log(`[WA] No keyword match for: "${textContent}"`)
        return new Response('OK', { status: 200 })
      }

      // Determine venture
      let ventureId = config.default_venture_id
      if (!ventureId) {
        // Find first active venture of the user
        const { data: venture } = await admin
          .from('ventures')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (!venture) {
          console.warn(`[WA] No active venture for user ${userId}`)
          return new Response('OK', { status: 200 })
        }
        ventureId = venture.id
      }

      // Handle image if present
      let evidenceUrl: string | null = null
      if (message.type === 'image' && message.image?.id) {
        try {
          // Decrypt access token
          const encKey = Deno.env.get('ENCRYPTION_KEY') || 'finova-default-key'
          const { data: token } = await admin.rpc('decrypt_token', {
            p_encrypted: integration.encrypted_token,
            p_key: encKey,
          })

          if (token) {
            // Get media URL
            const mediaRes = await fetch(`https://graph.facebook.com/v21.0/${message.image.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (mediaRes.ok) {
              const { url } = await mediaRes.json()
              // Download image
              const imgRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
              if (imgRes.ok) {
                const buffer = await imgRes.arrayBuffer()
                const ext = (message.image.mime_type || 'image/jpeg').split('/')[1] || 'jpg'
                const filePath = `${userId}/${ventureId}/${crypto.randomUUID()}.${ext}`
                const { error: upErr } = await admin.storage.from('evidence').upload(filePath, buffer, {
                  contentType: message.image.mime_type || 'image/jpeg',
                })
                if (!upErr) evidenceUrl = filePath
              }
            }
          }
        } catch (err) {
          console.error('[WA] Image processing error:', err)
          // Don't block transaction creation if image fails
        }
      }

      // Create transaction
      const { data: tx, error: txError } = await admin
        .from('transactions')
        .insert({
          venture_id: ventureId,
          user_id: userId,
          type: parsed.type,
          amount: parsed.amount,
          description: parsed.description,
          date: new Date().toISOString().split('T')[0],
          evidence_url: evidenceUrl,
        })
        .select()
        .single()

      if (txError) {
        console.error('[WA] Transaction insert error:', txError.message)
        return new Response('OK', { status: 200 })
      }

      // Recalculate venture totals
      const { data: totals } = await admin.from('transactions').select('type, amount').eq('venture_id', ventureId)
      if (totals) {
        const invested = totals.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
        const returned = totals.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
        await admin.from('ventures').update({ invested, returned }).eq('id', ventureId)
      }

      console.log(`[WA] Transaction created: ${parsed.type} $${parsed.amount} - ${parsed.description}`)
      return new Response('OK', { status: 200 })
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (err) {
    console.error('[WA Webhook] Error:', err)
    return new Response('OK', { status: 200 }) // Always 200 for Meta
  }
})
