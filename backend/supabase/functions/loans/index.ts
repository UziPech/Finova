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
      console.error('[Loans] Auth Error:', authError?.message || 'No user found')
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const rl = await checkRateLimit(admin, `user:loans:${user.id}`, 60, 60)
    if (!rl.allowed && rl.response) return rl.response

    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const loanId = parts.length > 1 ? parts[parts.length - 1] : null
    const method = req.method
    const ventureIdParams = url.searchParams.get('venture_id')
    const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }

    // GET
    if (method === 'GET') {
      if (loanId && loanId !== 'loans') {
        const { data, error } = await supabase.from('loans').select('*, loan_payments(*)').eq('id', loanId).single()
        if (error) return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Loan not found' }), { status: 404, headers: rh })
        return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
      }
      
      let query = supabase.from('loans').select('*, loan_payments(*)').order('created_at', { ascending: false })
      if (ventureIdParams) {
        query = query.eq('venture_id', ventureIdParams)
      }
      
      const { data, error } = await query
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
    }

    // POST
    if (method === 'POST') {
      const body = await req.json()
      if (!body.name || !body.principal || !body.start_date || !body.venture_id) {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'name, principal, start_date and venture_id are required' }), { status: 400, headers: rh })
      }
      
      const { data, error } = await supabase.from('loans').insert({
        user_id: user.id,
        venture_id: body.venture_id,
        name: body.name,
        principal: body.principal,
        interest_rate: body.interest_rate || 0,
        start_date: body.start_date,
        end_date: body.end_date || null,
        status: body.status || 'active',
        notes: body.notes || null,
      }).select().single()
      
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      
      // Automatic payment generation logic (simplified)
      if (body.generate_payments && body.payment_count > 0 && body.payment_amount) {
          const payments = [];
          let currentDate = new Date(body.start_date);
          for(let i = 0; i < body.payment_count; i++) {
              currentDate.setMonth(currentDate.getMonth() + 1);
              payments.push({
                  loan_id: data.id,
                  user_id: user.id,
                  amount: body.payment_amount,
                  due_date: currentDate.toISOString().split('T')[0],
                  status: 'pending'
              });
          }
          const { error: paymentError } = await supabase.from('loan_payments').insert(payments);
          if (paymentError) {
              console.error("[Loans] Error generating payments:", paymentError);
          }
      }
      
      return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
    }

    // PUT
    if (method === 'PUT') {
      if (!loanId || loanId === 'loans') {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Loan ID required in path' }), { status: 400, headers: rh })
      }
      const body = await req.json()
      const { id: _id, ...fields } = body
      const { data, error } = await supabase.from('loans').update(fields).eq('id', loanId).select().single()
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
    }

    // DELETE
    if (method === 'DELETE') {
      if (!loanId || loanId === 'loans') {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Loan ID required in path' }), { status: 400, headers: rh })
      }
      const { error } = await supabase.from('loans').delete().eq('id', loanId)
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      return new Response(JSON.stringify({ message: 'Loan deleted' }), { status: 200, headers: rh })
    }

    return new Response(JSON.stringify({ code: 'METHOD_NOT_ALLOWED', message: `${method} not supported` }), { status: 405, headers: rh })
  } catch (err) {
    console.error('[Loans] Error:', err)
    return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
