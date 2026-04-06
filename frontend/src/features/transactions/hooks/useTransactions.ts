// features/transactions/hooks/useTransactions.ts — Hook para CRUD de transacciones
import { useState, useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'
import type { Transaction, CreateTransactionInput } from '../types'

export function useTransactions(ventureId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async (vid?: string) => {
    const id = vid || ventureId
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setError('No session'); setLoading(false); return }

    const url = id
      ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transactions?venture_id=${id}`
      : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transactions`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const json = await res.json()
    if (!res.ok) { setError(json.message); setLoading(false); return }
    setTransactions(json.data)
    setLoading(false)
  }, [ventureId])

  const createTransaction = async (input: CreateTransactionInput, evidence?: File) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No session')

    let res: Response

    if (evidence) {
      const formData = new FormData()
      formData.append('venture_id', input.venture_id)
      formData.append('type', input.type)
      formData.append('amount', String(input.amount))
      formData.append('date', input.date)
      if (input.description) formData.append('description', input.description)
      formData.append('evidence', evidence)

      res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transactions`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: formData,
        }
      )
    } else {
      res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transactions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        }
      )
    }

    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Error creating transaction')
    setTransactions((prev) => [json.data, ...prev])
    return json.data
  }

  const deleteTransaction = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('No session')

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transactions/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    )
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.message || 'Error deleting transaction')
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id))
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
