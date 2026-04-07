// pages/AuthPage.tsx — shell de auth
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthForm } from '@/features/auth/components/AuthForm'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function AuthPage() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  return <AuthForm />
}
