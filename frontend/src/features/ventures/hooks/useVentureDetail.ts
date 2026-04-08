import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/features/auth/store'
import { calculateROI, breakEven, netProfit, ventureHealth, calculateHealth } from '@/shared/lib/metrics'
import { VENTURE_MODE_METRICS } from '@/shared/lib/constants'
import type { Venture, CreateVentureInput } from '../types'

export function useVentureDetail(id: string | undefined) {
  const navigate = useNavigate()
  const [venture, setVenture] = useState<Venture | null>(null)
  const [loading, setLoading] = useState(true)
  const session = useAuthStore((s) => s.session)

  const fetchVenture = useCallback(async () => {
    if (!id || !session?.access_token) return
    setLoading(true)
    const headers = { Authorization: `Bearer ${session.access_token}` }
    const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
      method: 'GET',
      headers,
    })
    if (error || !data) { navigate('/ventures'); return }
    setVenture(data.data)
    setLoading(false)
  }, [id, session?.access_token, navigate])

  useEffect(() => {
    fetchVenture()
  }, [fetchVenture])

  const handleEditVenture = async (input: CreateVentureInput) => {
    if (!id) return
    const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
    const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
      method: 'PUT',
      body: input,
      headers,
    })
    if (error) throw new Error(error.message || 'Error updating venture')
    setVenture(data.data)
  }

  const handleDeleteVenture = async () => {
    if (!id || !confirm('¿Eliminar este venture y todas sus transacciones?')) return
    const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
    await supabase.functions.invoke(`ventures/${id}`, {
      method: 'DELETE',
      headers,
    })
    navigate('/ventures')
  }

  const metrics = useMemo(() => {
    if (!venture) return null

    const isPersonal = venture.mode === 'personal'
    const metricValue = isPersonal 
      ? calculateHealth(venture.invested, venture.returned)
      : calculateROI(venture.invested, venture.returned)
      
    const health = isPersonal
      ? (metricValue > 20 ? 'positive' : (metricValue > 0 ? 'neutral' : 'negative'))
      : ventureHealth(metricValue)
      
    const net = netProfit(venture.invested, venture.returned)
    const remaining = breakEven(venture.invested, venture.returned)

    const healthColor = health === 'positive' ? '#16a34a' : health === 'negative' ? '#dc2626' : '#525252'
    const netColor = isPersonal 
      ? (venture.returned > venture.invested ? '#dc2626' : '#16a34a')
      : (net >= 0 ? '#16a34a' : '#dc2626')

    const labels = VENTURE_MODE_METRICS[venture.mode || 'business']

    return {
      isPersonal,
      metricValue,
      health,
      net,
      remaining,
      healthColor,
      netColor,
      labels
    }
  }, [venture])

  return {
    venture,
    loading,
    metrics,
    handleEditVenture,
    handleDeleteVenture
  }
}
