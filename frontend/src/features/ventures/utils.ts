// apps/web/src/features/ventures/utils.ts
// Cálculos de negocio de ventures — NUNCA persistir ROI en DB
import type { VentureHealth } from './types'

/** ROI en porcentaje. Nunca persistir en DB. */
export const calculateROI = (invested: number, returned: number): number => {
  if (invested === 0 || returned === 0) return 0
  return Number(((returned - invested) / invested * 100).toFixed(2))
}

/** Cuánto falta para recuperar la inversión. */
export const breakEven = (invested: number, returned: number): number => {
  return Math.max(0, invested - returned)
}

/** Estado de salud del venture basado en ROI. */
export const ventureHealth = (roi: number): VentureHealth => {
  if (roi > 0) return 'positive'
  if (roi === 0) return 'neutral'
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
