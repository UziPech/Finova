import { useState, useRef, type FormEvent } from 'react'
import { SlidePanel } from '@/shared/components/SlidePanel'

interface TransactionFormProps {
  ventureId: string
  onSubmit: (input: { venture_id: string; type: 'income' | 'expense'; amount: number; description: string; date: string }, evidence?: File) => Promise<void>
  onClose: () => void
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

export function TransactionForm({ ventureId, onSubmit, onClose }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [evidence, setEvidence] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) { setError('Monto inválido'); return }
    if (!date) { setError('Fecha requerida'); return }

    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(
        {
          venture_id: ventureId,
          type,
          amount: numAmount,
          description: description.trim() || `${type === 'income' ? 'Ingreso' : 'Gasto'} manual`,
          date,
        },
        evidence || undefined
      )
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SlidePanel isOpen={true} onClose={onClose} title="Nueva transacción">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Type toggle */}
        <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: '#171717', padding: '4px', border: '1px solid #2a2a2a' }}>
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
                backgroundColor: type === t ? '#262626' : 'transparent',
                color: type === t
                  ? (t === 'expense' ? '#ef4444' : '#22c55e')
                  : '#a3a3a3',
                boxShadow: type === t ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              {t === 'expense' ? '💸 Gasto' : '💰 Ingreso'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Monto</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#737373', fontSize: '14px' }}>$</span>
            <input
              type="number" step="0.01" min="0" value={amount}
              onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
              style={{ ...inputStyle, paddingLeft: '28px' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Descripción</label>
          <input
            value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Pago de servidor, Venta de producto..."
            style={inputStyle}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>

        {/* Date */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Fecha</label>
          <input
            type="date" value={date} onChange={(e) => setDate(e.target.value)}
            style={{...inputStyle, colorScheme: 'dark'}}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>

        {/* Evidence */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
            Evidencia <span style={{ color: '#737373' }}>(opcional)</span>
          </label>
          <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={(e) => setEvidence(e.target.files?.[0] || null)} style={{ display: 'none' }} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 14px', borderRadius: '8px',
              border: '1px dashed #404040', backgroundColor: 'transparent',
              fontSize: '13px', color: '#a3a3a3',
              cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#737373'; e.currentTarget.style.color = '#fafafa' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#404040'; e.currentTarget.style.color = '#a3a3a3' }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            {evidence ? evidence.name : 'Subir foto o PDF'}
          </button>
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
            type="button" onClick={onClose}
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
            type="submit" disabled={submitting}
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
            Registrar transacción
          </button>
        </div>
      </form>
    </SlidePanel>
  )
}
