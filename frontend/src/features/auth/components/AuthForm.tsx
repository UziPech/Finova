// features/auth/components/AuthForm.tsx — Rediseño estilo Supabase (monocromático + responsive)
import { useState, useEffect, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

type AuthMode = 'login' | 'register'

const MOTIVATIONAL_QUOTES = [
  {
    text: 'No se trata de cuánto ganas, sino de cuánto conservas y cómo lo haces crecer.',
    author: 'Robert Kiyosaki',
  },
  {
    text: 'El mejor momento para invertir fue ayer. El segundo mejor momento es hoy.',
    author: 'Warren Buffett',
  },
  {
    text: 'Las oportunidades vienen disfrazadas de trabajo duro, por eso la mayoría no las reconoce.',
    author: 'Ann Landers',
  },
  {
    text: 'No pongas todos los huevos en la misma canasta — diversifica tus ventures.',
    author: 'Finova',
  },
  {
    text: 'El ROI más importante es el retorno sobre tu tiempo invertido.',
    author: 'Finova',
  },
]

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [quoteFading, setQuoteFading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteFading(true)
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)
        setQuoteFading(false)
      }, 400)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) {
      setError('Ingresa tu email y contraseña')
      return
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
        setSuccess('¡Cuenta creada! Revisa tu email para confirmar.')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al conectar con Google'
      setError(message)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError(null)
    setSuccess(null)
  }

  const inputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: '#171717',
    border: `1px solid ${focusedField === fieldName ? '#555' : '#2a2a2a'}`,
    color: '#fafafa',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: focusedField === fieldName ? '0 0 0 2px rgba(82,82,82,0.3)' : 'none',
  })

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex]

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#0a0a0a',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: '#fafafa',
    }}>
      {/* ── Left Panel: Auth Form ── */}
      <div style={{
        width: '100%',
        maxWidth: '520px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(24px, 5vw, 48px)',
        minHeight: '100dvh',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fafafa" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em' }}>Finova</span>
        </div>

        {/* Form Area — Centered */}
        <div style={{ maxWidth: '360px', width: '100%' }}>
          <h1 style={{
            fontSize: 'clamp(20px, 3vw, 24px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
          }}>
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: 'clamp(13px, 1.5vw, 14px)', margin: '0 0 32px 0' }}>
            {mode === 'login'
              ? 'Inicia sesión para administrar tus ventures'
              : 'Comienza a controlar tus inversiones'}
          </p>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#fafafa',
              fontSize: '14px',
              fontWeight: 500,
              border: '1px solid #2a2a2a',
              cursor: 'pointer',
              transition: 'background-color 0.15s, border-color 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#171717'
              e.currentTarget.style.borderColor = '#404040'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#2a2a2a'
            }}
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#262626' }} />
            <span style={{ fontSize: '12px', color: '#525252', textTransform: 'uppercase', letterSpacing: '0.08em' }}>o</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#262626' }} />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="auth-email" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                style={inputStyle('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="auth-password" style={{ fontSize: '13px', fontWeight: 500, color: '#a3a3a3' }}>
                  Contraseña
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    style={{ fontSize: '12px', color: '#737373', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fafafa' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ ...inputStyle('password'), paddingRight: '40px' }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#525252',
                    display: 'flex',
                  }}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <div style={{ marginBottom: '16px' }} className="animate-fade-in">
                <label htmlFor="auth-confirm" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
                  Confirmar contraseña
                </label>
                <input
                  id="auth-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={inputStyle('confirm')}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  fontSize: '13px',
                  color: '#f87171',
                  marginBottom: '16px',
                }}
              >
                <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  fontSize: '13px',
                  color: '#34d399',
                  marginBottom: '16px',
                }}
              >
                <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: '#fafafa',
                color: '#0a0a0a',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s, transform 0.1s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: submitting ? 0.4 : 1,
              }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#e5e5e5' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
              onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {submitting && (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          {/* Toggle Mode */}
          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#737373' }}>
            {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#fafafa',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                fontSize: '14px',
                padding: 0,
              }}
            >
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p style={{ fontSize: '11px', color: '#525252' }}>
          © {new Date().getFullYear()} Finova. Gestión financiera inteligente.
        </p>
      </div>

      {/* ── Right Panel: Branding + Motivational Quotes ── */}
      <div
        className="auth-right-panel"
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#111111',
        }}
      >
        {/* Dot pattern background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #111111 0%, transparent 50%, rgba(10,10,10,0.8) 100%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            padding: '0 clamp(40px, 6vw, 80px)',
            maxWidth: '640px',
          }}
        >
          {/* Quote mark */}
          <svg width="48" height="48" fill="#262626" viewBox="0 0 24 24" style={{ marginBottom: '32px' }}>
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
          </svg>

          {/* Motivational Quote */}
          <div
            style={{
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              opacity: quoteFading ? 0 : 1,
              transform: quoteFading ? 'translateY(8px)' : 'translateY(0)',
            }}
          >
            <blockquote
              style={{
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.88)',
                lineHeight: 1.5,
                letterSpacing: '-0.02em',
                margin: 0,
                padding: 0,
              }}
            >
              {currentQuote.text}
            </blockquote>
            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '1px', backgroundColor: '#333' }} />
              <span style={{ fontSize: '14px', color: '#737373', fontWeight: 500 }}>
                {currentQuote.author}
              </span>
            </div>
          </div>

          {/* Quote indicators */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '40px' }}>
            {MOTIVATIONAL_QUOTES.map((_, i) => (
              <div
                key={i}
                style={{
                  height: '3px',
                  borderRadius: '2px',
                  transition: 'all 0.5s ease',
                  width: i === quoteIndex ? '24px' : '8px',
                  backgroundColor: i === quoteIndex ? '#fafafa' : '#333',
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: 'clamp(40px, 6vw, 80px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#333',
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
          </svg>
          <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Finova — Gestión Financiera
          </span>
        </div>
      </div>
    </div>
  )
}
