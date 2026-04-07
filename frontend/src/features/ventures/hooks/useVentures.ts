// features/ventures/hooks/useVentures.ts — Hook para CRUD de ventures
import { useEffect, useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { useVenturesStore } from '../store'
import { useAuthStore } from '@/features/auth/store'
import type { CreateVentureInput, UpdateVentureInput } from '../types'

export function useVentures() {
  const ventures = useVenturesStore((s) => s.ventures)
  const loading = useVenturesStore((s) => s.loading)
  const error = useVenturesStore((s) => s.error)
  const hasFetched = useVenturesStore((s) => s.hasFetched)
  const setVentures = useVenturesStore((s) => s.setVentures)
  const addVentureAction = useVenturesStore((s) => s.addVenture)
  const updateVentureAction = useVenturesStore((s) => s.updateVenture)
  const removeVentureAction = useVenturesStore((s) => s.removeVenture)
  const setLoading = useVenturesStore((s) => s.setLoading)
  const setError = useVenturesStore((s) => s.setError)

  // Observar sesión del auth store para saber cuándo está lista
  const session = useAuthStore((s) => s.session)

  const fetchVentures = useCallback(async (force = false) => {
    if (hasFetched && !force) return
    setLoading(true)
    setError(null)

    const headers = session?.access_token 
      ? { Authorization: `Bearer ${session.access_token}` }
      : undefined

    const { data, error: invokeError } = await supabase.functions.invoke('ventures', {
      method: 'GET',
      headers,
    })

    if (invokeError) {
      setError(invokeError.message || 'Error fetching ventures')
      setLoading(false)
      return
    }
    setVentures(data?.data ?? [])
    setLoading(false)
  }, [session, setLoading, setError, setVentures, hasFetched])

  // Solo hacer fetch cuando la sesión esté disponible y no tengamos datos
  useEffect(() => {
    if (session?.access_token && !hasFetched) {
      fetchVentures()
    }
  }, [session?.access_token, hasFetched, fetchVentures])

  const createVenture = async (input: CreateVentureInput) => {
    const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
    const { data, error } = await supabase.functions.invoke('ventures', {
      method: 'POST',
      body: input,
      headers,
    })

    if (error) throw new Error(error.message || 'Error creating venture')
    addVentureAction(data.data)
    return data.data
  }

  const updateVenture = async (id: string, input: Partial<UpdateVentureInput>) => {
    const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
    const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
      method: 'PUT',
      body: input,
      headers,
    })

    if (error) throw new Error(error.message || 'Error updating venture')
    updateVentureAction(data.data)
    return data.data
  }

  const deleteVenture = async (id: string) => {
    const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
    const { error } = await supabase.functions.invoke(`ventures/${id}`, {
      method: 'DELETE',
      headers,
    })

    if (error) {
      throw new Error(error.message || 'Error deleting venture')
    }
    removeVentureAction(id)
  }

  return {
    ventures,
    loading,
    error,
    fetchVentures,
    createVenture,
    updateVenture,
    deleteVenture,
  }
}
