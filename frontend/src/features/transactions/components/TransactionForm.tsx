// features/transactions/components/TransactionForm.tsx — Modal monocromático
import { useState, useRef, type FormEvent } from 'react'

interface TransactionFormProps {
  ventureId: string
  onSubmit: (input: { venture_id: string; type: 'income' | 'expense'; amount: number; description: string; date: string }, evidence?: File) => Promise<void>
  onClose: () => void
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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      }} onClick={onClose} />

      <div className="animate-scale-in" style={{
        position: 'relative', backgroundColor: '#fff', borderRadius: '16px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.12)', width: '100%', maxWidth: '420px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #f5f5f5',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>Nueva transacción</h2>
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

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Type toggle */}
          <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: '#f5f5f5', padding: '3px' }}>
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  backgroundColor: type === t ? '#fff' : 'transparent',
                  color: type === t
                    ? (t === 'expense' ? '#dc2626' : '#16a34a')
                    : '#737373',
                  boxShadow: type === t ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {t === 'expense' ? '💸 Gasto' : '💰 Ingreso'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Monto</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', fontSize: '14px' }}>$</span>
              <input
                type="number" step="0.01" min="0" value={amount}
                onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
                style={{ ...inputStyle, paddingLeft: '28px' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Descripción</label>
            <input
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Pago de servidor, Venta de producto..."
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
            />
          </div>

          {/* Date */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Fecha</label>
            <input
              type="date" value={date} onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
            />
          </div>

          {/* Evidence */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>
              Evidencia <span style={{ color: '#a3a3a3' }}>(opcional)</span>
            </label>
            <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={(e) => setEvidence(e.target.files?.[0] || null)} style={{ display: 'none' }} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px', borderRadius: '8px',
                border: '2px dashed #e5e5e5', backgroundColor: '#fafafa',
                fontSize: '13px', color: '#737373',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a3a3a3'; e.currentTarget.style.color = '#404040' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.color = '#737373' }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              {evidence ? evidence.name : 'Subir foto o PDF'}
            </button>
          </div>

          {error && (
            <div className="animate-fade-in" style={{
              padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2',
              color: '#dc2626', fontSize: '13px', border: '1px solid #fecaca',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
            <button
              type="button" onClick={onClose}
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
              type="submit" disabled={submitting}
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
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
