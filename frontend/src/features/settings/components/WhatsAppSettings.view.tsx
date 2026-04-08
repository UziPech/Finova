import { useWhatsAppSettings } from '../hooks/useWhatsAppSettings'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
  border: '1px solid #e5e5e5',
  color: '#171717',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s',
}

export function WhatsAppSettings() {
  const {
    phoneNumberId, setPhoneNumberId,
    accessToken, setAccessToken,
    verifyToken, setVerifyToken,
    saving,
    loading,
    success,
    error,
    saveSettings
  } = useWhatsAppSettings()

  if (loading) {
    return (
      <div style={{ maxWidth: '480px' }}>
        <div className="skeleton" style={{ height: '28px', width: '180px', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '280px', borderRadius: '14px' }} />
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <button
          onClick={() => window.history.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#737373',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '4px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
        >
          <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Atrás
        </button>
        <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>API de WhatsApp</h1>
        <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
          Conecta tu número de Meta Business para recibir transacciones vía WhatsApp
        </p>
      </div>

      {/* Form card */}
      <div style={{
        backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '24px',
      }}>
        <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="wa-phone-id" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Phone Number ID</label>
            <input
              id="wa-phone-id" value={phoneNumberId} onChange={(e) => setPhoneNumberId(e.target.value)}
              placeholder="1234567890" style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
            />
          </div>
          <div>
            <label htmlFor="wa-token" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Access Token</label>
            <input
              id="wa-token" type="password" value={accessToken}
              onFocus={() => { if (accessToken.startsWith('•')) setAccessToken('') }}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="EAAxxxxxxx..." style={inputStyle}
            />
            <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '4px 0 0' }}>Se almacena encriptado en la base de datos</p>
          </div>
          <div>
            <label htmlFor="wa-verify" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Verify Token</label>
            <input
              id="wa-verify" value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)}
              placeholder="mi_token_secreto" style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
            />
            <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '4px 0 0' }}>Usado por Meta para verificar tu webhook</p>
          </div>

          {error && (
            <div className="animate-fade-in" style={{
              padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2',
              color: '#dc2626', fontSize: '13px', border: '1px solid #fecaca',
            }}>
              {error}
            </div>
          )}
          {success && (
            <div className="animate-fade-in" style={{
              padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4',
              color: '#16a34a', fontSize: '13px', border: '1px solid #bbf7d0',
            }}>
              {success}
            </div>
          )}

          <button
            type="submit" disabled={saving}
            style={{
              width: '100%', padding: '10px 16px', borderRadius: '10px', border: 'none',
              backgroundColor: '#0a0a0a', color: '#fafafa', fontSize: '14px', fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
              opacity: saving ? 0.5 : 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#262626' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
          >
            {saving && (
              <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Guardar configuración
          </button>
        </form>
      </div>

      {/* Webhook URL info */}
      <div style={{
        backgroundColor: '#f5f5f5', borderRadius: '14px', padding: '20px',
        border: '1px solid #e5e5e5',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 8px' }}>URL del Webhook</h3>
        <code style={{
          display: 'block', padding: '10px 14px', borderRadius: '8px',
          backgroundColor: '#fff', border: '1px solid #e5e5e5',
          fontSize: '12px', color: '#525252', wordBreak: 'break-all',
          fontFamily: 'monospace',
        }}>
          {import.meta.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-webhook
        </code>
        <p style={{ fontSize: '12px', color: '#737373', margin: '8px 0 0' }}>
          Configura esta URL en tu app de Meta Business como endpoint del webhook de WhatsApp.
        </p>
      </div>
    </div>
  )
}
