// features/transactions/hooks/useCategories.ts
// Store de categorías con soporte para filtros por contexto y dirección
// Regla 10: tipos desde @backend/_shared/types.ts (NO declarar localmente)
// Regla 14: JWT manual en Authorization header

import { create } from 'zustand'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/features/auth/store'
import type { TransactionCategory } from '@backend/_shared/types'

interface CategoriesState {
  categories: TransactionCategory[]
  loading: boolean
  error: string | null
  fetched: boolean
  fetchCategories: (opts?: { force?: boolean; contextSlug?: string; direction?: string }) => Promise<void>
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  fetched: false,
  fetchCategories: async (opts) => {
    const state = get()
    if (state.fetched && !opts?.force) return

    set({ loading: true, error: null })
    try {
      const session = useAuthStore.getState().session
      if (!session?.access_token) throw new Error('No active session')

      const params = new URLSearchParams()
      if (opts?.contextSlug) params.append('context_slug', opts.contextSlug)
      if (opts?.direction) params.append('direction', opts.direction)

      const qs = params.toString()
      const { data, error } = await supabase.functions.invoke(
        `user-settings/categories${qs ? `?${qs}` : ''}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      )

      if (error) throw new Error(error.message || 'Error fetching categories')

      set({
        categories: (data?.data ?? []) as TransactionCategory[],
        fetched: true,
        loading: false,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[Categories Store] Error fetching categories:', message)
      set({ error: message, loading: false })
    }
  },
}))

export function useCategories() {
  const store = useCategoriesStore()
  return {
    categories: store.categories,
    loading: store.loading,
    error: store.error,
    fetchCategories: store.fetchCategories,
  }
}
