// features/dashboard/hooks/useAnomalies.ts
// Hook para consumir anomalías desde la Edge Function analytics
// Regla 10: tipos desde @backend/_shared/types.ts
// Regla 14: JWT manual en Authorization header
// Regla 21: lógica de negocio aislada en hook, no en vista

import { useState, useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/features/auth/store'
import type { AnomalyLog } from '@backend/_shared/types'

export interface AnomaliesState {
  anomalies: AnomalyLog[]
  loading: boolean
  error: string | null
  criticalCount: number
  warningCount: number
}

export function useAnomalies(ventureId?: string) {
  const [anomalies, setAnomalies] = useState<AnomalyLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [criticalCount, setCriticalCount] = useState(0)
  const [warningCount, setWarningCount] = useState(0)
  const { session } = useAuthStore()

  const fetchAnomalies = useCallback(async (overrideVentureId?: string) => {
    if (!session?.access_token) {
      setError('No active session')
      return
    }

    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    const vid = overrideVentureId || ventureId
    if (vid) params.append('venture_id', vid)
    params.append('dismissed', 'false')

    const qs = params.toString()
    const { data, error: invokeError } = await supabase.functions.invoke(
      `analytics/anomalies${qs ? `?${qs}` : ''}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    )

    if (invokeError) {
      setError(invokeError.message)
      setLoading(false)
      return
    }

    setAnomalies(data?.data ?? [])
    setCriticalCount(data?.critical_count ?? 0)
    setWarningCount(data?.warning_count ?? 0)
    setLoading(false)
  }, [ventureId, session])

  const dismissAnomaly = useCallback(async (anomalyId: string) => {
    if (!session?.access_token) return

    const { error: invokeError } = await supabase.functions.invoke(
      `analytics/anomalies/${anomalyId}/dismiss`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    )

    if (invokeError) {
      console.error('[useAnomalies] Dismiss failed:', invokeError.message)
      return
    }

    // Actualizar estado local sin refetch
    setAnomalies(prev => prev.filter(a => a.id !== anomalyId))
    setCriticalCount(prev => {
      const dismissed = anomalies.find(a => a.id === anomalyId)
      return dismissed?.severity === 'critical' ? prev - 1 : prev
    })
    setWarningCount(prev => {
      const dismissed = anomalies.find(a => a.id === anomalyId)
      return dismissed?.severity === 'warning' ? prev - 1 : prev
    })
  }, [session, anomalies])

  const recalculateBaseline = useCallback(async () => {
    if (!session?.access_token) return

    const { error: invokeError } = await supabase.functions.invoke(
      'analytics/baseline/recalculate',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    )

    if (invokeError) {
      console.error('[useAnomalies] Baseline recalculation failed:', invokeError.message)
    }
  }, [session])

  return {
    anomalies,
    loading,
    error,
    criticalCount,
    warningCount,
    fetchAnomalies,
    dismissAnomaly,
    recalculateBaseline,
  }
}
