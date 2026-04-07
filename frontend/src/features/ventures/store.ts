// features/ventures/store.ts — Zustand store para ventures
import { create } from 'zustand'
import type { Venture } from './types'

interface VenturesState {
  ventures: Venture[]
  loading: boolean
  error: string | null
  hasFetched: boolean
  setVentures: (ventures: Venture[]) => void
  addVenture: (venture: Venture) => void
  updateVenture: (venture: Venture) => void
  removeVenture: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setHasFetched: (hasFetched: boolean) => void
}

export const useVenturesStore = create<VenturesState>((set) => ({
  ventures: [],
  loading: true,
  error: null,
  hasFetched: false,
  setVentures: (ventures) => set({ ventures, loading: false, error: null, hasFetched: true }),
  addVenture: (venture) => set((s) => ({ ventures: [venture, ...s.ventures] })),
  updateVenture: (venture) =>
    set((s) => ({
      ventures: s.ventures.map((v) => (v.id === venture.id ? venture : v)),
    })),
  removeVenture: (id) =>
    set((s) => ({ ventures: s.ventures.filter((v) => v.id !== id) })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  setHasFetched: (hasFetched) => set({ hasFetched }),
}))
