import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'

export interface Keyword {
  id: string
  keyword: string
  type: 'income' | 'expense'
}

export function useKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchKeywords = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.functions.invoke('user-settings/keywords', { method: 'GET' })
    if (!error && data) {
      setKeywords(data.data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchKeywords()
  }, [fetchKeywords])

  const addKeyword = async (keyword: string, type: 'income' | 'expense') => {
    if (!keyword.trim()) return false
    setSaving(true)
    const { data, error } = await supabase.functions.invoke('user-settings/keywords', {
      method: 'POST',
      body: { keyword: keyword.trim().toLowerCase(), type },
    })
    setSaving(false)
    if (!error && data) {
      setKeywords((prev) => [...prev, data.data])
      return true
    }
    return false
  }

  const removeKeyword = async (id: string) => {
    await supabase.functions.invoke(`user-settings/keywords/${id}`, { method: 'DELETE' })
    setKeywords((prev) => prev.filter((k) => k.id !== id))
  }

  return {
    keywords,
    incomeKeywords: keywords.filter(k => k.type === 'income'),
    expenseKeywords: keywords.filter(k => k.type === 'expense'),
    loading,
    saving,
    addKeyword,
    removeKeyword
  }
}
