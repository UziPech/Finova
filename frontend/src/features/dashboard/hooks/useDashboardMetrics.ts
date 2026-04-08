import { useMemo } from 'react'
import type { Venture, Transaction } from '@backend/_shared/types'
import { calculateHealth, calculateROI } from '@/shared/lib/metrics'

export function useDashboardMetrics(ventures: Venture[], transactions: Transaction[]) {
  return useMemo(() => {
    const totalInvested = ventures.reduce((sum, v) => sum + v.invested, 0)
    const totalReturned = ventures.reduce((sum, v) => sum + v.returned, 0)
    const activeVentures = ventures.filter((v) => v.status === 'active')
    const businessVentures = activeVentures.filter(v => v.mode === 'business')
    const personalVentures = activeVentures.filter(v => v.mode === 'personal')

    const isPersonalMajority = personalVentures.length > businessVentures.length

    let avgMetric = 0
    let positiveCount = 0
    let metricTitle = 'ROI promedio'
    let trendText = ''

    if (isPersonalMajority) {
      const healths = personalVentures.map(v => calculateHealth(v.invested, v.returned))
      avgMetric = healths.length > 0 ? healths.reduce((a, b) => a + b, 0) / healths.length : 0
      positiveCount = healths.filter(h => h > 20).length
      metricTitle = 'Salud Promedio'
      trendText = `${positiveCount} proyecto${positiveCount !== 1 ? 's' : ''} saludable${positiveCount !== 1 ? 's' : ''}`
    } else {
      const rois = businessVentures.map(v => calculateROI(v.invested, v.returned))
      avgMetric = rois.length > 0 ? rois.reduce((a, b) => a + b, 0) / rois.length : 0
      positiveCount = rois.filter((r) => r > 0).length
      metricTitle = 'ROI Promedio'
      trendText = `${positiveCount} venture${positiveCount !== 1 ? 's' : ''} positivo${positiveCount !== 1 ? 's' : ''}`
    }

    const today = new Date()
    const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
    const monthTx = transactions.filter((t) => t.date.startsWith(currentMonthKey))
    const flujoLibre = monthTx.reduce(
      (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
      0
    )

    const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const prevMonthKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`
    const prevFlujo = transactions
      .filter((t) => t.date.startsWith(prevMonthKey))
      .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)

    const flujoTrendText =
      prevFlujo !== 0
        ? `${flujoLibre >= prevFlujo ? '+' : ''}${(((flujoLibre - prevFlujo) / Math.abs(prevFlujo)) * 100).toFixed(0)}% vs mes anterior`
        : flujoLibre >= 0
          ? 'Positivo'
          : 'Negativo'

    const capitalActivo = activeVentures.reduce((sum, v) => sum + v.invested, 0)

    return {
      totalInvested,
      totalReturned,
      activeVenturesCount: activeVentures.length,
      isPersonalMajority,
      avgMetric,
      metricTitle,
      trendText,
      monthTxCount: monthTx.length,
      flujoLibre,
      flujoTrendText,
      capitalActivo
    }
  }, [ventures, transactions])
}
