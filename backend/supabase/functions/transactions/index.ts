// ── Inline CORS ──
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
}
function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  return null
}

// ── Inline Rate Limit ──
async function checkRateLimit(supabase: any, key: string, max = 60, window = 60) {
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
    const rl = await checkRateLimit(admin, `user:tx:${user.id}`, 60, 60)
    if (!rl.allowed && rl.response) return rl.response

    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const txId = parts.length > 1 ? parts[parts.length - 1] : null
    const method = req.method
    const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }

    // GET — listar transacciones
    // Sin paginación: retorna todo (Dashboard, resúmenes)
    // Con page + page_size: paginado (VentureDetail con búsqueda)
    if (method === 'GET') {
      const ventureId = url.searchParams.get('venture_id')
      const search = url.searchParams.get('search')?.trim()
      const categoryId = url.searchParams.get('category_id')
      const pageParam = url.searchParams.get('page')
      const pageSizeParam = url.searchParams.get('page_size')
      const isPaginated = pageParam !== null && pageSizeParam !== null

      // Siempre unir con categoría para enriquecer la respuesta
      let query = supabase
        .from('transactions')
        .select('*, category:transaction_categories(id, name, accounting_type, icon, color)', { count: isPaginated ? 'exact' : undefined })
        .order('date', { ascending: false })

      if (ventureId) query = query.eq('venture_id', ventureId)
      if (search) query = query.ilike('description', `%${search}%`)
      if (categoryId) query = query.eq('category_id', categoryId)

      if (isPaginated) {
        const page = Math.max(1, parseInt(pageParam!))
        const pageSize = Math.min(100, Math.max(1, parseInt(pageSizeParam!)))
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)
        const { data, error, count } = await query
        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ data, total: count ?? 0, page, page_size: pageSize }), { status: 200, headers: rh })
      }

      // Sin paginación — retorna todo (no rompe Dashboard)
      const { data, error } = await query
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
    }


    // POST — crear transacción
    if (method === 'POST') {
      const contentType = req.headers.get('content-type') || ''
      let body: { venture_id: string; type: string; amount: number; description?: string; date: string; evidence_url?: string; category_id?: string }
      let evidenceUrl: string | null = null

      if (contentType.includes('multipart/form-data')) {
        const fd = await req.formData()
        body = {
          venture_id: fd.get('venture_id') as string,
          type: fd.get('type') as string,
          amount: parseFloat(fd.get('amount') as string),
          description: (fd.get('description') as string) || undefined,
          date: fd.get('date') as string,
          category_id: (fd.get('category_id') as string) || undefined,
        }
        const file = fd.get('evidence') as File | null
        if (file) {
          const ext = file.name.split('.').pop() || 'jpg'
          const path = `${user.id}/${body.venture_id}/${crypto.randomUUID()}.${ext}`
          const { error: upErr } = await supabase.storage.from('evidence').upload(path, file, { contentType: file.type })
          if (!upErr) evidenceUrl = path
          else console.error('[Tx] Upload error:', upErr.message)
        }
      } else {
        body = await req.json()
      }

      if (!body.venture_id || !body.type || !body.amount || !body.date) {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'venture_id, type, amount, date required' }), { status: 400, headers: rh })
      }
      if (!['income', 'expense'].includes(body.type)) {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'type must be income or expense' }), { status: 400, headers: rh })
      }
      if (body.amount <= 0) {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'amount must be > 0' }), { status: 400, headers: rh })
      }

      // Verificar que el venture pertenece al usuario
      const { data: v, error: vErr } = await supabase.from('ventures').select('id').eq('id', body.venture_id).single()
      if (vErr || !v) {
        return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Venture not found' }), { status: 404, headers: rh })
      }

      const { data, error } = await supabase.from('transactions').insert({
        venture_id: body.venture_id, user_id: user.id, type: body.type,
        amount: body.amount, description: body.description || null,
        date: body.date, evidence_url: evidenceUrl || body.evidence_url || null,
        category_id: body.category_id || null,
      }).select().single()

      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })

      // Recalcular totales del venture
      const { data: totals } = await admin.from('transactions').select('type, amount').eq('venture_id', body.venture_id)
      if (totals) {
        const invested = totals.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
        const returned = totals.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
        await admin.from('ventures').update({ invested, returned }).eq('id', body.venture_id)
      }

      return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
    }

    // DELETE — eliminar transacción
    if (method === 'DELETE') {
      if (!txId || txId === 'transactions') {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Transaction ID required' }), { status: 400, headers: rh })
      }

      const { data: existing } = await supabase.from('transactions').select('evidence_url, venture_id').eq('id', txId).single()
      const { error } = await supabase.from('transactions').delete().eq('id', txId)
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })

      // Limpiar evidencia de Storage
      if (existing?.evidence_url) {
        await supabase.storage.from('evidence').remove([existing.evidence_url]).catch(() => {})
      }

      // Recalcular totales del venture
      if (existing?.venture_id) {
        const { data: totals } = await admin.from('transactions').select('type, amount').eq('venture_id', existing.venture_id)
        if (totals) {
          const invested = totals.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
          const returned = totals.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
          await admin.from('ventures').update({ invested, returned }).eq('id', existing.venture_id)
        }
      }

      return new Response(JSON.stringify({ message: 'Transaction deleted' }), { status: 200, headers: rh })
    }

    return new Response(JSON.stringify({ code: 'METHOD_NOT_ALLOWED' }), { status: 405, headers: rh })
  } catch (err) {
    console.error('[Transactions] Error:', err)
    return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
