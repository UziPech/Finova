// ═══════════════════════════════════════════════════════════════════════════════
// Edge Function: analytics
// Detección de anomalías financieras y baseline estadístico
// Endpoints:
//   POST /analytics/baseline/recalculate
//   POST /analytics/detect
//   GET  /analytics/anomalies
//   PUT  /analytics/anomalies/:id/dismiss
// ═══════════════════════════════════════════════════════════════════════════════

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
}

function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  return null
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const cors = handleCors(req)
  if (cors) return cors

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED', message: 'Missing authorization' }),
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
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method
    const rh = { ...corsHeaders, 'Content-Type': 'application/json' }

    // ================================================================
    // POST /analytics/baseline/recalculate
    // Recalcula category_stats para el usuario (últimos 6 meses)
    // ================================================================
    if (method === 'POST' && path.includes('baseline')) {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const sinceDate = sixMonthsAgo.toISOString().split('T')[0]

      // Obtener todas las transacciones de los últimos 6 meses
      const { data: transactions, error: txErr } = await admin
        .from('transactions')
        .select('category_id, venture_id, amount, type')
        .eq('user_id', user.id)
        .gte('date', sinceDate)

      if (txErr) {
        return new Response(JSON.stringify({ code: 'DB_ERROR', message: txErr.message }), { status: 500, headers: rh })
      }

      if (!transactions || transactions.length === 0) {
        return new Response(JSON.stringify({ message: 'No transactions in the last 6 months to analyze', stats_updated: 0 }), { status: 200, headers: rh })
      }

      // Agrupar por (category_id, venture_id)
      const groups = new Map<string, number[]>()
      for (const tx of transactions) {
        if (!tx.category_id) continue
        const key = `${tx.category_id}|${tx.venture_id || 'null'}`
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(Number(tx.amount))
      }

      let statsUpdated = 0
      for (const [key, amounts] of groups) {
        const [categoryId, ventureIdStr] = key.split('|')
        const ventureId = ventureIdStr === 'null' ? null : ventureIdStr

        const n = amounts.length
        const mean = amounts.reduce((s, a) => s + a, 0) / n
        const variance = amounts.reduce((s, a) => s + Math.pow(a - mean, 2), 0) / n
        const stdDev = Math.sqrt(variance)

        // Mediana
        const sorted = [...amounts].sort((a, b) => a - b)
        const median = n % 2 === 0
          ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
          : sorted[Math.floor(n / 2)]

        // Upsert en category_stats
        const { error: upsertErr } = await admin
          .from('category_stats')
          .upsert({
            user_id: user.id,
            category_id: categoryId,
            venture_id: ventureId,
            period_months: 6,
            mean_amount: Math.round(mean * 100) / 100,
            std_dev: Math.round(stdDev * 100) / 100,
            median_amount: Math.round(median * 100) / 100,
            sample_count: n,
            last_calculated: new Date().toISOString(),
          }, { onConflict: 'user_id,category_id,venture_id' })

        if (upsertErr) {
          console.error(`[Analytics] Upsert stats error for ${key}:`, upsertErr.message)
        } else {
          statsUpdated++
        }
      }

      return new Response(
        JSON.stringify({ message: 'Baseline recalculated', stats_updated: statsUpdated }),
        { status: 200, headers: rh }
      )
    }

    // ================================================================
    // POST /analytics/detect
    // Detecta anomalías para una transacción específica
    // Body: { transaction_id: string }
    // ================================================================
    if (method === 'POST' && path.includes('detect')) {
      const body = await req.json()
      const txId = body.transaction_id
      if (!txId) {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'transaction_id required' }), { status: 400, headers: rh })
      }

      // Obtener la transacción
      const { data: tx, error: txErr } = await admin
        .from('transactions')
        .select('*')
        .eq('id', txId)
        .eq('user_id', user.id)
        .single()

      if (txErr || !tx) {
        return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Transaction not found' }), { status: 404, headers: rh })
      }

      const anomalies: Array<{
        anomaly_type: string
        severity: string
        z_score: number | null
        description: string
        related_tx_id: string | null
      }> = []

      // ── 1. Detección de duplicados ────────────────────────
      const { data: duplicateId } = await admin.rpc('find_potential_duplicate', {
        p_user_id: user.id,
        p_venture_id: tx.venture_id,
        p_type: tx.type,
        p_amount: tx.amount,
        p_date: tx.date,
        p_hours_window: 72,
      })

      if (duplicateId && duplicateId !== tx.id) {
        anomalies.push({
          anomaly_type: 'duplicate',
          severity: 'critical',
          z_score: null,
          description: `Posible duplicado: transaccion identica (${tx.type}, $${tx.amount}) registrada en las ultimas 72 horas.`,
          related_tx_id: duplicateId,
        })
      }

      // ── 2. Z-score si hay categoría ───────────────────────
      if (tx.category_id) {
        const { data: zscore } = await admin.rpc('get_transaction_zscore', {
          p_user_id: user.id,
          p_category_id: tx.category_id,
          p_amount: tx.amount,
          p_venture_id: tx.venture_id,
        })

        if (zscore !== null && zscore !== undefined) {
          const zVal = Number(zscore)
          if (zVal > 3.0) {
            anomalies.push({
              anomaly_type: tx.type === 'expense' ? 'high_spend' : 'high_spend',
              severity: 'critical',
              z_score: zVal,
              description: `Monto inusualmente alto (z-score: ${zVal.toFixed(1)}). Este ${tx.type === 'expense' ? 'gasto' : 'ingreso'} es ${zVal.toFixed(1)} desviaciones estandar por encima de tu promedio en esta categoria.`,
              related_tx_id: null,
            })
          } else if (zVal > 2.0) {
            anomalies.push({
              anomaly_type: tx.type === 'expense' ? 'high_spend' : 'high_spend',
              severity: 'warning',
              z_score: zVal,
              description: `Monto elevado (z-score: ${zVal.toFixed(1)}). Este movimiento supera significativamente tu promedio historico en esta categoria.`,
              related_tx_id: null,
            })
          } else if (zVal < -2.0 && tx.type === 'income') {
            anomalies.push({
              anomaly_type: 'low_income',
              severity: 'warning',
              z_score: zVal,
              description: `Ingreso inusualmente bajo (z-score: ${zVal.toFixed(1)}). Verifica que el monto sea correcto.`,
              related_tx_id: null,
            })
          }
        }
      }

      // ── 3. Detección de caída/subida de flujo mensual ─────
      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      // Flujo del mes actual
      const { data: currentTxs } = await admin
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id)
        .eq('venture_id', tx.venture_id)
        .like('date', `${currentMonth}%`)

      const currentFlow = (currentTxs || []).reduce(
        (sum: number, t: { type: string; amount: number }) =>
          sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
        0
      )

      // Mediana de flujo de últimos 6 meses
      const monthlyFlows: number[] = []
      for (let i = 1; i <= 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const { data: mTxs } = await admin
          .from('transactions')
          .select('type, amount')
          .eq('user_id', user.id)
          .eq('venture_id', tx.venture_id)
          .like('date', `${monthKey}%`)

        const flow = (mTxs || []).reduce(
          (sum: number, t: { type: string; amount: number }) =>
            sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
          0
        )
        monthlyFlows.push(flow)
      }

      if (monthlyFlows.length >= 3) {
        const sorted = [...monthlyFlows].sort((a, b) => a - b)
        const median = sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)]

        if (median !== 0) {
          const delta = ((currentFlow - median) / Math.abs(median)) * 100
          if (delta < -40) {
            anomalies.push({
              anomaly_type: 'flow_drop',
              severity: 'warning',
              z_score: null,
              description: `Caida de flujo mensual: ${Math.abs(delta).toFixed(0)}% por debajo de la mediana historica ($${median.toFixed(0)}/mes). Flujo actual: $${currentFlow.toFixed(0)}.`,
              related_tx_id: null,
            })
          } else if (delta > 40) {
            anomalies.push({
              anomaly_type: 'flow_spike',
              severity: 'info',
              z_score: null,
              description: `Subida de flujo mensual: ${delta.toFixed(0)}% por encima de la mediana historica ($${median.toFixed(0)}/mes). Flujo actual: $${currentFlow.toFixed(0)}.`,
              related_tx_id: null,
            })
          }
        }
      }

      // ── Insertar anomalías detectadas en DB ───────────────
      let insertedCount = 0
      for (const a of anomalies) {
        const { error: insertErr } = await admin.from('anomaly_log').insert({
          user_id: user.id,
          transaction_id: txId,
          venture_id: tx.venture_id,
          anomaly_type: a.anomaly_type,
          severity: a.severity,
          z_score: a.z_score,
          description: a.description,
          related_tx_id: a.related_tx_id,
        })
        if (insertErr) {
          console.error('[Analytics] Insert anomaly error:', insertErr.message)
        } else {
          insertedCount++
        }
      }

      return new Response(
        JSON.stringify({ detected: anomalies.length, inserted: insertedCount, anomalies }),
        { status: 200, headers: rh }
      )
    }

    // ================================================================
    // GET /analytics/anomalies
    // Retorna anomalías activas desde la vista active_anomalies
    // Filtros opcionales: venture_id, dismissed
    // ================================================================
    if (method === 'GET' && path.includes('anomalies')) {
      const ventureId = url.searchParams.get('venture_id')
      const dismissed = url.searchParams.get('dismissed')

      let query = admin
        .from('anomaly_log')
        .select('*, venture:ventures(name), transaction:transactions(amount, date, type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (ventureId) query = query.eq('venture_id', ventureId)

      // Por defecto solo mostrar no descartadas
      if (dismissed === 'true') {
        query = query.eq('is_dismissed', true)
      } else {
        query = query.eq('is_dismissed', false)
      }

      const { data, error } = await query.limit(100)
      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })

      // Contar por severidad para el frontend
      const criticalCount = (data || []).filter((a: { severity: string }) => a.severity === 'critical').length
      const warningCount = (data || []).filter((a: { severity: string }) => a.severity === 'warning').length

      return new Response(
        JSON.stringify({ data, critical_count: criticalCount, warning_count: warningCount }),
        { status: 200, headers: rh }
      )
    }

    // ================================================================
    // PUT /analytics/anomalies/:id/dismiss
    // Marca una anomalía como descartada
    // ================================================================
    if (method === 'PUT' && path.includes('dismiss')) {
      const parts = path.split('/').filter(Boolean)
      // Buscar el UUID en la ruta (penúltimo segmento antes de 'dismiss')
      const anomalyId = parts[parts.length - 2]

      if (!anomalyId) {
        return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Anomaly ID required' }), { status: 400, headers: rh })
      }

      const { error } = await admin
        .from('anomaly_log')
        .update({ is_dismissed: true })
        .eq('id', anomalyId)
        .eq('user_id', user.id)

      if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
      return new Response(JSON.stringify({ message: 'Anomaly dismissed' }), { status: 200, headers: rh })
    }

    return new Response(
      JSON.stringify({ code: 'NOT_FOUND', message: 'Use /analytics/baseline/recalculate, /analytics/detect, /analytics/anomalies, or /analytics/anomalies/:id/dismiss' }),
      { status: 404, headers: rh }
    )
  } catch (err) {
    console.error('[Analytics] Error:', err)
    return new Response(
      JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
