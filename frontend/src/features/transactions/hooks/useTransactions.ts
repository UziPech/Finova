// features/transactions/hooks/useTransactions.ts — Hook para CRUD de transacciones
import { useState, useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'
import type { Transaction, CreateTransactionInput } from '../types'
import { useAuthStore } from '@/features/auth/store'
import { useVentures } from '@/features/ventures/hooks/useVentures'

export function useTransactions(ventureId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuthStore()
  const { fetchVentures } = useVentures()

  const fetchTransactions = useCallback(async (vid?: string) => {
    const id = vid || ventureId
    setLoading(true)
    setError(null)

    if (!session?.access_token) {
      setError('No active session')
      setLoading(false)
      return
    }

    const { data, error: invokeError } = await supabase.functions.invoke('transactions' + (id ? `?venture_id=${id}` : ''), {
      method: 'GET',
      headers: { Authorization: `Bearer ${session.access_token}` }
    })

    if (invokeError) { setError(invokeError.message); setLoading(false); return }
    setTransactions(data?.data ?? [])
    setLoading(false)
  }, [ventureId, session])

  const createTransaction = async (input: CreateTransactionInput, evidence?: File) => {
    if (!session?.access_token) throw new Error('No active session')

    let responseData
    let invokeError

    if (evidence) {
      const formData = new FormData()
      formData.append('venture_id', input.venture_id)
      formData.append('type', input.type)
      formData.append('amount', String(input.amount))
      formData.append('date', input.date)
      if (input.description) formData.append('description', input.description)
      formData.append('evidence', evidence)

      const { data, error } = await supabase.functions.invoke('transactions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      })
      responseData = data
      invokeError = error
    } else {
      const { data, error } = await supabase.functions.invoke('transactions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: input,
      })
      responseData = data
      invokeError = error
    }

    if (invokeError) throw new Error(invokeError.message || 'Error creating transaction')
    setTransactions((prev) => [responseData.data, ...prev])
    
    // Forzar actualización de ventures para reflejar los nuevos totales (Invertido/Retornado)
    fetchVentures(true)

    return responseData.data
  }

  const deleteTransaction = async (id: string) => {
    if (!session?.access_token) throw new Error('No active session')

    const { error } = await supabase.functions.invoke(`transactions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    
    if (error) {
      throw new Error(error.message || 'Error deleting transaction')
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    
    // Forzar actualización de ventures
    fetchVentures(true)
  }

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    deleteTransaction,
  }
}
