import { useState, useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/features/auth/store'
import type { Loan, CreateLoanInput } from '../types'

export function useLoans(ventureId?: string) {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { session } = useAuthStore()

  const fetchLoans = useCallback(async (id?: string) => {
    const vId = id || ventureId

    setLoading(true)
    setError(null)

    if (!session?.access_token) {
      setError('No active session')
      setLoading(false)
      return
    }

    const endpoint = vId ? `loans?venture_id=${vId}` : 'loans'
    const { data, error: invokeError } = await supabase.functions.invoke(endpoint, {
      method: 'GET',
      headers: { Authorization: `Bearer ${session.access_token}` }
    })

    if (invokeError) {
      setError(invokeError.message)
      setLoading(false)
      return
    }

    setLoans(data?.data ?? [])
    setLoading(false)
  }, [ventureId, session])

  const createLoan = async (input: CreateLoanInput) => {
    if (!session?.access_token) throw new Error('No active session')

    const { data, error } = await supabase.functions.invoke('loans', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: input,
    })

    if (error) throw new Error(error.message || 'Error creating loan')
    setLoans((prev) => [data.data, ...prev])
    return data.data
  }

  const deleteLoan = async (id: string) => {
    if (!session?.access_token) throw new Error('No active session')

    const { error } = await supabase.functions.invoke(`loans/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    if (error) throw new Error(error.message || 'Error deleting loan')
    setLoans((prev) => prev.filter((l) => l.id !== id))
  }

  return {
    loans,
    loading,
    error,
    fetchLoans,
    createLoan,
    deleteLoan
  }
}
