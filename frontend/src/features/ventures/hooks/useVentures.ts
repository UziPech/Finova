// features/ventures/hooks/useVentures.ts — Hook para CRUD de ventures
import { useEffect, useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { useVenturesStore } from '../store'
import type { CreateVentureInput, UpdateVentureInput } from '../types'

export function useVentures() {
  const store = useVenturesStore()

  const fetchVentures = useCallback(async () => {
    store.setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return store.setError('No session')

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ventures`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const json = await res.json()
    if (!res.ok) return store.setError(json.message || 'Error fetching ventures')
    store.setVentures(json.data)
  }, [store])

  useEffect(() => {
    fetchVentures()
  }, [fetchVentures])

  const createVenture = async (input: CreateVentureInput) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No session')

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ventures`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Error creating venture')
    store.addVenture(json.data)
    return json.data
  }

  const updateVenture = async (id: string, input: Partial<UpdateVentureInput>) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No session')

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ventures/${id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Error updating venture')
    store.updateVenture(json.data)
    return json.data
  }

  const deleteVenture = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No session')

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ventures/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    )
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.message || 'Error deleting venture')
    }
    store.removeVenture(id)
  }

  return {
    ventures: store.ventures,
    loading: store.loading,
    error: store.error,
    fetchVentures,
    createVenture,
    updateVenture,
    deleteVenture,
  }
}
