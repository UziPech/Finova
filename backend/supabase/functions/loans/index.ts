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
      // ── Catálogo de instituciones ─────────────────────────
      if (path.includes('institutions')) {
        const typeFilter = url.searchParams.get('type')
        let query = supabase
          .from('loan_institutions')
          .select('*')
          .eq('is_active', true)
          .order('cat_approx', { ascending: true })

        if (typeFilter) {
          query = query.eq('loan_type', typeFilter)
        }

        const { data, error } = await query
        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
      }

      // ── Detalle de un préstamo (con pagos) ────────────────
      if (loanId && loanId !== 'loans') {
        const { data, error } = await supabase
          .from('loans')
          .select('*, loan_payments(*), institution:loan_institutions(*)')
          .eq('id', loanId)
          .order('due_date', { referencedTable: 'loan_payments', ascending: true })
          .single()
        if (error) return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Loan not found' }), { status: 404, headers: rh })
        return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
      }

      // ── Listado global (SIN pagos para rendimiento) ───────
      let query = supabase
        .from('loans')
        .select('*, institution:loan_institutions(id, name, short_name, loan_type, cat_approx)')
        .order('created_at', { ascending: false })
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
      if (!body.name || !body.principal || !body.start_date) {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'name, principal, and start_date are required' }), { status: 400, headers: rh })
      }

      const amortType = body.amortization_type || 'french'
      const frequency = body.payment_frequency || 'monthly'
      const loanType = body.loan_type || 'personal'

      // Insertar el préstamo
      const { data, error } = await supabase.from('loans').insert({
        user_id: user.id,
        venture_id: body.venture_id || null,
        name: body.name,
        principal: body.principal,
        interest_rate: body.interest_rate || 0,
        start_date: body.start_date,
        end_date: body.end_date || null,
        status: body.status || 'active',
        notes: body.notes || null,
        loan_type: loanType,
        institution_id: body.institution_id || null,
        amortization_type: amortType,
        payment_frequency: frequency,
        minimum_payment_pct: body.minimum_payment_pct || null,
        current_balance: body.current_balance || body.principal,
        credit_limit: body.credit_limit || null,
      }).select().single()

      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })

      let amortizationSummary = null

      // ── Amortización francesa: generar pagos via SQL RPC ──
      if (amortType === 'french' && body.periods && body.periods > 0) {
        const { data: schedule, error: rpcError } = await supabase.rpc('calculate_french_amortization', {
          p_principal: body.principal,
          p_annual_rate: body.interest_rate || 0,
          p_periods: body.periods,
          p_start_date: body.start_date,
          p_frequency: frequency,
        })

        if (rpcError) {
          console.error('[Loans] Amortization RPC error:', rpcError.message)
        } else if (schedule && schedule.length > 0) {
          // Insertar todos los pagos con desglose
          const payments = schedule.map((row: any) => ({
            loan_id: data.id,
            user_id: user.id,
            amount: row.payment_amount,
            due_date: row.due_date,
            status: 'pending',
            principal_portion: row.principal_part,
            interest_portion: row.interest_part,
            balance_after: row.balance_after,
          }))

          const { error: payError } = await supabase.from('loan_payments').insert(payments)
          if (payError) console.error('[Loans] Error inserting amortization payments:', payError.message)

          // Generar resumen
          const totalToPay = schedule.reduce((sum: number, r: any) => sum + r.payment_amount, 0)
          const totalInterest = schedule.reduce((sum: number, r: any) => sum + r.interest_part, 0)
          amortizationSummary = {
            monthly_payment: schedule[0].payment_amount,
            total_to_pay: Math.round(totalToPay * 100) / 100,
            total_interest: Math.round(totalInterest * 100) / 100,
            total_periods: schedule.length,
          }
        }
      }

      // ── Legacy: pagos manuales ────────────────────────────
      if (!body.periods && body.generate_payments && body.payment_count > 0 && body.payment_amount) {
        const payments = []
        let currentDate = new Date(body.start_date)
        for (let i = 0; i < body.payment_count; i++) {
          currentDate.setMonth(currentDate.getMonth() + 1)
          payments.push({
            loan_id: data.id,
            user_id: user.id,
            amount: body.payment_amount,
            due_date: currentDate.toISOString().split('T')[0],
            status: 'pending',
            principal_portion: 0,
            interest_portion: 0,
          })
        }
        const { error: paymentError } = await supabase.from('loan_payments').insert(payments)
        if (paymentError) console.error('[Loans] Error generating legacy payments:', paymentError)
      }

      return new Response(JSON.stringify({ data, amortization_summary: amortizationSummary }), { status: 201, headers: rh })
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
