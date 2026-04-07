import { create } from 'zustand'
import { supabase } from '@/shared/lib/supabase'

export interface TransactionCategory {
  id: string
  user_id: string | null
  name: string
  type: 'income' | 'expense' | 'capital'
  icon: string | null
  color: string | null
  is_system: boolean
  created_at: string
}

interface CategoriesState {
  categories: TransactionCategory[]
  loading: boolean
  error: string | null
  fetched: boolean
  fetchCategories: (force?: boolean) => Promise<void>
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  fetched: false,
  fetchCategories: async (force = false) => {
    const state = get()
    if (state.fetched && !force) return // Use cached data if already fetched

    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('transaction_categories')
        .select('*')
        .order('name')

      if (error) throw error

      set({ categories: data as TransactionCategory[], fetched: true, loading: false })
    } catch (err: any) {
      console.error('[Categories Store] Error fetching categories:', err)
      set({ error: err.message, loading: false })
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
