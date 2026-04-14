import { useMemo } from 'react'
import type { Venture, Transaction, VPSResult } from '@backend/_shared/types'
import { calculateROI, ventureHealth, calculateHealth } from '@/shared/lib/metrics'
import { calculateVPS } from '@/shared/lib/vps'

export type ActionBadge = {
  label: string
  bg: string
  color: string
  border: string
}

export function getActionBadge(roi: number, diffDays: number, status: string, isPersonal: boolean): ActionBadge {
  if (status === 'paused')
    return { label: 'Pausado', bg: '#f5f5f5', color: '#737373', border: '#e5e5e5' }
    
  if (isPersonal) {
    if (roi < 10) return { label: 'Crítico', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
    if (roi < 30) return { label: 'Cuidado', bg: '#fefce8', color: '#a16207', border: '#fde68a' }
    return { label: 'Saludable', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
  } else {
    if (roi < -30 || (roi < 0 && diffDays > 120))
      return { label: 'Revisar', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
    if (roi < 0)
      return { label: 'En rojo', bg: '#fef2f2', color: '#ef4444', border: '#fecaca' }
    if (roi >= 0 && roi < 15)
      return { label: 'Vigilar', bg: '#fefce8', color: '#a16207', border: '#fde68a' }
    if (roi >= 15 && roi < 40)
      return { label: 'Mantener', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
    return { label: 'Escalar', bg: '#f0fdf4', color: '#15803d', border: '#86efac' }
  }
}

export function getDotColor(health: string): string {
  if (health === 'positive') return '#22c55e'
  if (health === 'negative') return '#ef4444'
  return '#eab308'
}

export function getDaysActive(startDate: string): number {
  const start = new Date(startDate)
  const now = new Date()
  return Math.ceil(Math.abs(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatTimeSince(days: number): string {
  if (days < 30) return `${days} días`
  const months = Math.floor(days / 30)
  return `${months} ${months === 1 ? 'mes' : 'meses'}`
}

export interface VentureStatusData {
  venture: Venture
  isPersonal: boolean
  metricValue: number
  health: string
  days: number
  badge: ActionBadge
  vpsRank: number | null
  vpsScore: number | null
  vpsWarning: string | null
  vpsInterpretation: string | null
}

/**
 * Hook de estado de ventures — ordenado por VPS (Decisión D1).
 * El ROI puro se muestra como información, pero el orden usa VPS.
 */
export function useVentureStatus(ventures: Venture[], transactions: Transaction[] = []) {
  return useMemo(() => {
    const relevantVentures = ventures.filter(
      (v) => v.status === 'active' || v.status === 'paused'
    )

    const redCount = relevantVentures.filter((v) => {
      const isPersonal = v.mode === 'personal'
      if (isPersonal) {
        const health = calculateHealth(v.invested, v.returned)
        return health < 20 && v.status === 'active'
      } else {
        const roi = calculateROI(v.invested, v.returned)
        return roi < 0 && v.status === 'active'
      }
    }).length

    // Calcular VPS para el ordenamiento (Decisión D1)
    const vpsResults = calculateVPS(relevantVentures, transactions)
    const vpsMap = new Map<string, VPSResult>(
      vpsResults.map(r => [r.ventureId, r])
    )

    const ventureData: VentureStatusData[] = relevantVentures
      .map((v) => {
        const isPersonal = v.mode === 'personal'
        const metricValue = isPersonal 
          ? calculateHealth(v.invested, v.returned)
          : calculateROI(v.invested, v.returned)
          
        const health = isPersonal
          ? (metricValue > 20 ? 'positive' : (metricValue > 0 ? 'neutral' : 'negative'))
          : ventureHealth(metricValue)
          
        const days = getDaysActive(v.start_date)
        const badge = getActionBadge(metricValue, days, v.status, isPersonal)
        const vps = vpsMap.get(v.id)

        return {
          venture: v,
          isPersonal,
          metricValue,
          health,
          days,
          badge,
          vpsRank: vps?.rank ?? null,
          vpsScore: vps?.score ?? null,
          vpsWarning: vps?.warningReason ?? null,
          vpsInterpretation: vps?.interpretation ?? null,
        }
      })
      // Ordenar por VPS score (Decisión D1), fallback a metricValue
      .sort((a, b) => {
        if (a.vpsScore !== null && b.vpsScore !== null) {
          return b.vpsScore - a.vpsScore
        }
        return b.metricValue - a.metricValue
      })

    return { ventureData, redCount, vpsResults }
  }, [ventures, transactions])
}

