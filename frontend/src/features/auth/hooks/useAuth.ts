// features/auth/hooks/useAuth.ts — Hook central de autenticación
import { useEffect } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '../store'

export function useAuth() {
  const { user, session, loading, setAuth, clear } = useAuthStore()

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setAuth(s?.user ?? null, s)
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setAuth(s?.user ?? null, s)
      }
    )

    return () => subscription.unsubscribe()
  }, [setAuth])

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    clear()
  }

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  }
}
