import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/features/auth/store'

export function useWhatsAppSettings() {
  const [phoneNumberId, setPhoneNumberId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [verifyToken, setVerifyToken] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const session = useAuthStore((s) => s.session)

  const fetchSettings = useCallback(async () => {
    if (!session?.access_token) {
      setLoading(false)
      return
    }
    const headers = { Authorization: `Bearer ${session.access_token}` }
    const { data, error: err } = await supabase.functions.invoke('user-settings/integrations', {
      method: 'GET',
      headers,
    })
    if (!err && data) {
      const d = data.data
      if (d) {
        setPhoneNumberId(d.whatsapp_phone_number_id || '')
        setVerifyToken(d.whatsapp_verify_token || '')
        setAccessToken(d.has_access_token ? '••••••••' : '')
      }
    }
    setLoading(false)
  }, [session?.access_token])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)
    try {
      const body: Record<string, string> = {
        phone_number_id: phoneNumberId,
        verify_token: verifyToken,
      }
      if (accessToken && !accessToken.startsWith('•')) {
        body.access_token = accessToken
      }

      const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
      const { error: err } = await supabase.functions.invoke('user-settings/integrations', {
        method: 'PUT',
        body,
        headers,
      })
      
      if (err) {
        throw new Error(err.message || 'Error saving settings')
      }
      setSuccess('Configuración guardada')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return {
    phoneNumberId, setPhoneNumberId,
    accessToken, setAccessToken,
    verifyToken, setVerifyToken,
    saving,
    loading,
    success,
    error,
    saveSettings
  }
}
