// frontend/src/shared/lib/vps.ts
// Venture Priority Score — índice compuesto de prioridad
// NUNCA persistir en DB — calcular siempre desde datos crudos (Regla 4, Decisión D6)
// Reemplaza el ordenamiento por ROI puro en toda la app (Decisión D1)

import type { Venture, Transaction, VPSResult, VPSConfig } from '@backend/_shared/types'

const DEFAULT_CONFIG: VPSConfig = {
  weightROI: 0.35,
  weightCapital: 0.30,
  weightFlow: 0.25,
  weightMaturity: 0.10,
}

/** Normaliza un array de números al rango [0, 1]. */
function normalize(values: number[]): number[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (max === min) return values.map(() => 0.5)
  return values.map(v => (v - min) / (max - min))
}

/**
 * Calcula el Venture Priority Score para un portafolio.
 * Ordena por impacto real, no por ROI puro.
 *
 * Componentes:
 *  - ROI ponderado por log10(capital) → 35%
 *  - Peso de capital en el portafolio  → 30%
 *  - Flujo libre promedio (3 meses)    → 25%
 *  - Madurez (saturada a 12 meses)     → 10%
 */
export function calculateVPS(
  ventures: Venture[],
  transactions: Transaction[],
  config: VPSConfig = DEFAULT_CONFIG
): VPSResult[] {
  const activeVentures = ventures.filter(v =>
    v.status === 'active' || v.status === 'paused'
  )

  if (activeVentures.length === 0) return []

  const totalPortfolioCapital = activeVentures.reduce(
    (sum, v) => sum + v.invested, 0
  )

  const now = new Date()

  // ── Componente 1: ROI ponderado por capital ──────────────────────
  const roiWeightedValues = activeVentures.map(v => {
    const roi = v.invested === 0 ? 0
      : ((v.returned - v.invested) / v.invested) * 100
    return roi * Math.log10(Math.max(v.invested, 1))
  })

  // ── Componente 2: Capital score ──────────────────────────────────
  const capitalValues = activeVentures.map(v =>
    totalPortfolioCapital > 0 ? v.invested / totalPortfolioCapital : 0
  )

  // ── Componente 3: Flujo libre promedio (últimos 3 meses) ─────────
  const flowValues = activeVentures.map(v => {
    let totalFlow = 0
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const monthTx = transactions.filter(t =>
        t.venture_id === v.id && t.date.startsWith(key)
      )
      totalFlow += monthTx.reduce(
        (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0
      )
    }
    return totalFlow / 3
  })

  // ── Componente 4: Madurez (satura en 12 meses) ──────────────────
  const maturityValues = activeVentures.map(v => {
    const days = Math.ceil(
      Math.abs(now.getTime() - new Date(v.start_date).getTime())
      / (1000 * 60 * 60 * 24)
    )
    const months = days / 30
    return Math.min(months / 12, 1)
  })

  // ── Normalizar cada componente a [0, 1] ──────────────────────────
  const roiNorm = normalize(roiWeightedValues)
  const capitalNorm = normalize(capitalValues)
  const flowNorm = normalize(flowValues)
  const maturityNorm = normalize(maturityValues)

  // ── Calcular VPS final y ordenar ────────────────────────────────
  const scores = activeVentures.map((v, i) => ({
    ventureId: v.id,
    score: (
      roiNorm[i] * config.weightROI +
      capitalNorm[i] * config.weightCapital +
      flowNorm[i] * config.weightFlow +
      maturityNorm[i] * config.weightMaturity
    ),
    roiWeighted: roiNorm[i],
    capitalScore: capitalNorm[i],
    flowScore: flowNorm[i],
    maturityScore: maturityNorm[i],
    rawCapital: v.invested,
    rawROI: v.invested === 0 ? 0
      : ((v.returned - v.invested) / v.invested) * 100,
  }))
    .sort((a, b) => b.score - a.score)

  // ── Generar interpretación accionable ───────────────────────────
  return scores.map((s, idx) => {
    let interpretation = ''
    let warningReason: string | null = null

    if (s.rawROI > 100 && s.capitalScore < 0.1) {
      warningReason = `ROI alto (${s.rawROI.toFixed(0)}%) pero capital marginal ($${s.rawCapital.toLocaleString('es-MX')}). Impacto real en el portafolio es menor.`
    }

    if (idx === 0) {
      interpretation = 'Venture de mayor impacto real en el portafolio.'
    } else if (s.flowScore < 0.2) {
      interpretation = 'Capital activo pero sin flujo reciente. Revisar actividad.'
    } else if (s.maturityScore < 0.25) {
      interpretation = 'Venture nuevo. Datos insuficientes para evaluacion definitiva.'
    } else {
      interpretation = 'Rendimiento estable. Mantener seguimiento mensual.'
    }

    return {
      ventureId: s.ventureId,
      score: Number(s.score.toFixed(3)),
      rank: idx + 1,
      roiWeighted: Number(s.roiWeighted.toFixed(3)),
      capitalScore: Number(s.capitalScore.toFixed(3)),
      flowScore: Number(s.flowScore.toFixed(3)),
      maturityScore: Number(s.maturityScore.toFixed(3)),
      interpretation,
      warningReason,
    }
  })
}
