// frontend/src/shared/lib/metrics.ts
// Cálculos de negocio centralizados — NUNCA persistir ROI en DB
import type { VentureHealth } from '@backend/_shared/types'

/** ROI en porcentaje. Nunca persistir en DB. */
export const calculateROI = (invested: number, returned: number): number => {
  if (invested === 0) return 0
  if (returned === 0 && invested > 0) return -100
  return Number(((returned - invested) / invested * 100).toFixed(2))
}

/** Cuánto falta para recuperar la inversión. */
export const breakEven = (invested: number, returned: number): number => {
  return Math.max(0, invested - returned)
}

/** Estado de salud del venture basado en ROI. */
export const ventureHealth = (roi: number): VentureHealth => {
  if (roi > 10) return 'positive'
  if (roi >= 0) return 'neutral'
  return 'negative'
}

/** Ganancia neta del venture. */
export const netProfit = (invested: number, returned: number): number => {
  return returned - invested
}

/** Salud del presupuesto en porcentaje (0 = agotado, 100 = intacto). Solo para modo personal. */
export const calculateHealth = (budget: number, spent: number): number => {
  if (budget <= 0) return 0
  const remaining = budget - spent
  return Math.max(0, Number(((remaining / budget) * 100).toFixed(2)))
}

/**
 * ROI ponderado por capital — uso interno del VPS.
 * Aplica log10 al capital para amortiguar diferencias extremas
 * sin eliminar la importancia del monto invertido.
 */
export const calculateROIWeighted = (invested: number, returned: number): number => {
  const roi = calculateROI(invested, returned)
  return roi * Math.log10(Math.max(invested, 1))
}
