// features/transactions/hooks/useTransactions.ts — Hook para CRUD de transacciones
import { useState, useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'
import type { Transaction, CreateTransactionInput } from '../types'
import { useAuthStore } from '@/features/auth/store'
import { useVentures } from '@/features/ventures/hooks/useVentures'

export interface TransactionsFetchOptions {
  ventureId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
}

export function useTransactions(ventureId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const { session } = useAuthStore()
  const { fetchVentures } = useVentures()

  const fetchTransactions = useCallback(async (opts?: string | TransactionsFetchOptions) => {
    const isString = typeof opts === 'string'
    const id = (isString ? opts : opts?.ventureId) || ventureId
    
    setLoading(true)
    setError(null)

    if (!session?.access_token) {
      setError('No active session')
      setLoading(false)
      return
    }

    const params = new URLSearchParams()
    if (id) params.append('venture_id', id)
    
    if (!isString && opts) {
      if (opts.page) {
        params.append('page', opts.page.toString())
        setPage(opts.page)
      }
      if (opts.pageSize) {
        params.append('page_size', opts.pageSize.toString())
        setPageSize(opts.pageSize)
      }
      if (opts.search) params.append('search', opts.search)
      if (opts.categoryId) params.append('category_id', opts.categoryId)
    }

    const qs = params.toString()
    const { data, error: invokeError } = await supabase.functions.invoke('transactions' + (qs ? `?${qs}` : ''), {
      method: 'GET',
      headers: { Authorization: `Bearer ${session.access_token}` }
    })

    if (invokeError) { setError(invokeError.message); setLoading(false); return }
    setTransactions(data?.data ?? [])
    if (data?.total !== undefined) setTotal(data.total)
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
      if (input.category_id) formData.append('category_id', input.category_id)
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
    total,
    page,
    pageSize,
    fetchTransactions,
    createTransaction,
    deleteTransaction,
  }
}
