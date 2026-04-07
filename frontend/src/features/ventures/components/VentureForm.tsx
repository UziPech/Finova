import { useState, type FormEvent } from 'react'
import type { CreateVentureInput, VentureType, VentureStatus, Venture } from '../types'
import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS } from '@/shared/lib/constants'
import { SlidePanel } from '@/shared/components/SlidePanel'

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
  backgroundColor: '#171717',
  border: '1px solid #2a2a2a',
  color: '#fafafa',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
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
    <SlidePanel isOpen={true} onClose={onClose} title={formTitle}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Mi tienda online"
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as VentureType)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {Object.entries(VENTURE_TYPE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as VentureStatus)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
            >
              {Object.entries(VENTURE_STATUS_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Invertido ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={invested}
              onChange={(e) => setInvested(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Retornado ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={returned}
              onChange={(e) => setReturned(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
            Notas <span style={{ color: '#737373' }}>(opcional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas sobre este venture..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>

        {error && (
          <div className="animate-fade-in" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            fontSize: '13px',
            color: '#f87171',
          }}>
            <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #2a2a2a',
              backgroundColor: 'transparent', color: '#a3a3a3', fontSize: '14px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#171717'; e.currentTarget.style.color = '#fafafa' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
              backgroundColor: '#fafafa', color: '#0a0a0a', fontSize: '14px', fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
              opacity: submitting ? 0.5 : 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#e5e5e5' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
            onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = 'scale(0.98)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            {submitting && (
              <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Guardar venture
          </button>
        </div>
      </form>
    </SlidePanel>
  )
}
