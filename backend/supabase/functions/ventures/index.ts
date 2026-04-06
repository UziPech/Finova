// ── Inline CORS ──
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  return null
}

// ── Inline Rate Limit ──
interface RateLimitResult { allowed: boolean; remaining: number; reset_at: string }

async function checkRateLimit(
  supabase: any,
  key: string,
  maxRequests = 60,
  windowSeconds = 60
): Promise<{ allowed: boolean; headers: Record<string, string>; response?: Response }> {
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_key: key, p_max_requests: maxRequests, p_window_seconds: windowSeconds,
  })
  if (error) {
    console.error('[RateLimit] Error:', error.message)
    return { allowed: true, headers: { 'X-RateLimit-Limit': String(maxRequests) } }
  }
  const result = data as RateLimitResult
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(maxRequests),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': result.reset_at,
  }
  if (!result.allowed) {
    return {
      allowed: false, headers,
      response: new Response(
        JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED', message: `Try again after ${result.reset_at}` }),
        { status: 429, headers: { ...corsHeaders, ...headers, 'Content-Type': 'application/json', 'Retry-After': String(windowSeconds) } }
      ),
    }
  }
  return { allowed: true, headers }
}

// ── Main Handler ──
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const cors = handleCors(req)
  if (cors) return cors

  try {
    const authHeader = req.headers.get('Authorization')
    console.log('[Ventures] Auth Header present:', !!authHeader)
    if (authHeader) {
      console.log('[Ventures] Auth Header prefix:', authHeader.slice(0, 15))
    }
    if (!authHeader) {
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED', message: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[Ventures] Auth Error:', authError?.message || 'No user found')
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const rl = await checkRateLimit(admin, `user:ventures:${user.id}`, 60, 60)
    if (!rl.allowed && rl.response) return rl.response

    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const ventureId = parts.length > 1 ? parts[parts.length - 1] : null
    const method = req.method
    const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }

    // GET
    if (method === 'GET') {
      if (ventureId && ventureId !== 'ventures') {
        const { data, error } = await supabase.from('ventures').select('*').eq('id', ventureId).single()
        if (error) return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Venture not found' }), { status: 404, headers: rh })
        return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
      }
      const { data, error } = await supabase.from('ventures').select('*').order('created_at', { ascending: false })
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
    }

    // POST
    if (method === 'POST') {
      const body = await req.json()
      if (!body.name || !body.type) {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'name and type are required' }), { status: 400, headers: rh })
      }
      const validTypes = ['software', 'physical', 'investment', 'mixed']
      if (!validTypes.includes(body.type)) {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: `type must be: ${validTypes.join(', ')}` }), { status: 400, headers: rh })
      }
      const { data, error } = await supabase.from('ventures').insert({
        user_id: user.id, name: body.name, type: body.type,
        status: body.status || 'active', invested: body.invested || 0,
        returned: body.returned || 0, currency: body.currency || 'MXN',
        start_date: body.start_date || new Date().toISOString().split('T')[0],
        end_date: body.end_date || null, notes: body.notes || null,
      }).select().single()
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
    }

    // PUT
    if (method === 'PUT') {
      if (!ventureId || ventureId === 'ventures') {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Venture ID required in path' }), { status: 400, headers: rh })
      }
      const body = await req.json()
      const { id: _id, ...fields } = body
      const { data, error } = await supabase.from('ventures').update(fields).eq('id', ventureId).select().single()
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
    }

    // DELETE
    if (method === 'DELETE') {
      if (!ventureId || ventureId === 'ventures') {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Venture ID required in path' }), { status: 400, headers: rh })
      }
      const { error } = await supabase.from('ventures').delete().eq('id', ventureId)
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      return new Response(JSON.stringify({ message: 'Venture deleted' }), { status: 200, headers: rh })
    }

    return new Response(JSON.stringify({ code: 'METHOD_NOT_ALLOWED', message: `${method} not supported` }), { status: 405, headers: rh })
  } catch (err) {
    console.error('[Ventures] Error:', err)
    return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
