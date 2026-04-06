// features/ventures/components/VentureForm.tsx — Modal monocromático
import { useState, type FormEvent } from 'react'
import type { CreateVentureInput, VentureType, VentureStatus, Venture } from '../types'
import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS } from '@/shared/lib/constants'

interface VentureFormProps {
  onSubmit: (input: CreateVentureInput) => Promise<void>
  onClose: () => void
  venture?: Venture
  title?: string
}

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

export function VentureForm({ onSubmit, onClose, venture, title }: VentureFormProps) {
  const formTitle = title || (venture ? 'Editar venture' : 'Nuevo venture')
  const [name, setName] = useState(venture?.name || '')
  const [type, setType] = useState<VentureType>(venture?.type || 'software')
  const [status, setStatus] = useState<VentureStatus>(venture?.status || 'idea')
  const [invested, setInvested] = useState(venture?.invested?.toString() || '0')
  const [returned, setReturned] = useState(venture?.returned?.toString() || '0')
  const [notes, setNotes] = useState(venture?.notes || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Nombre es requerido'); return }
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        type,
        status,
        invested: parseFloat(invested) || 0,
        returned: parseFloat(returned) || 0,
        notes: notes.trim() || undefined,
      })
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }} onClick={onClose} />

      <div className="animate-scale-in" style={{
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90dvh',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>{formTitle}</h2>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a3a3', display: 'flex', transition: 'color 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#171717' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3' }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Mi tienda online"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VentureType)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {Object.entries(VENTURE_TYPE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VentureStatus)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {Object.entries(VENTURE_STATUS_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Invertido ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={invested}
                onChange={(e) => setInvested(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Retornado ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={returned}
                onChange={(e) => setReturned(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>
              Notas <span style={{ color: '#a3a3a3' }}>(opcional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas sobre este venture..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
            />
          </div>

          {error && (
            <div className="animate-fade-in" style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              fontSize: '13px',
              border: '1px solid #fecaca',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #e5e5e5',
                backgroundColor: '#fff', color: '#525252', fontSize: '14px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
                backgroundColor: '#0a0a0a', color: '#fafafa', fontSize: '14px', fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                opacity: submitting ? 0.5 : 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#262626' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
            >
              {submitting && (
                <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
