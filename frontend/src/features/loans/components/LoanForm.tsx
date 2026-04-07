import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { CreateLoanInput } from '../types'

interface LoanFormProps {
  ventureId: string
  onSubmit: (input: CreateLoanInput) => Promise<any>
  onClose: () => void
}

export function LoanForm({ ventureId, onSubmit, onClose }: LoanFormProps) {
  const [name, setName] = useState('')
  const [principal, setPrincipal] = useState('')
  const [interestRate, setInterestRate] = useState('0')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [generatePayments, setGeneratePayments] = useState(false)
  const [paymentCount, setPaymentCount] = useState('12')
  const [paymentAmount, setPaymentAmount] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), []) // ensure hydration matches

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await onSubmit({
        venture_id: ventureId,
        name,
        principal: parseFloat(principal),
        interest_rate: parseFloat(interestRate || '0'),
        start_date: startDate,
        generate_payments: generatePayments,
        payment_count: generatePayments ? parseInt(paymentCount) : undefined,
        payment_amount: generatePayments ? parseFloat(paymentAmount) : undefined,
      })
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      padding: '20px'
    }}>
      <div className="animate-scale-in" style={{
        backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Nuevo Préstamo
            </h2>
            <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>Registra una nueva obligación financiera o préstamo familiar.</p>
          </div>
          <button onClick={onClose} style={{
            background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: '50%', color: '#737373', cursor: 'pointer', padding: '6px',
            display: 'flex', transition: 'all 0.15s', alignSelf: 'flex-start'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.backgroundColor = '#e5e5e5' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#737373'; e.currentTarget.style.backgroundColor = '#f5f5f5' }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Nombre / Entidad / Acreedor</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Préstamo personal, Tarjeta de Crédito..." className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Principal a deber ($)</label>
              <input type="number" required min="0" step="0.01" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="0.00" className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Tasa de Interés (%)</label>
              <input type="number" min="0" step="0.01" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="0.0" className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Fecha de Emisión</label>
            <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
          </div>

          <div style={{ backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <input 
                type="checkbox" 
                id="generatePayments" 
                checked={generatePayments} 
                onChange={e => setGeneratePayments(e.target.checked)} 
                style={{ width: '18px', height: '18px', accentColor: '#0a0a0a', cursor: 'pointer', marginTop: '2px' }}
              />
              <div>
                <label htmlFor="generatePayments" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#171717', cursor: 'pointer', userSelect: 'none', marginBottom: '4px' }}>
                  Generar cronograma de cuotas
                </label>
                <p style={{ fontSize: '12px', color: '#737373', margin: 0, lineHeight: 1.4 }}>
                  Calcula y agenda automáticamente los pagos futuros para darle seguimiento mes a mes.
                </p>
              </div>
            </div>

            {generatePayments && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e5e5' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Plazo en meses</label>
                  <input type="number" required min="1" value={paymentCount} onChange={e => setPaymentCount(e.target.value)} className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Cuota Mensual Fija ($)</label>
                  <input type="number" required min="0.01" step="0.01" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder="0.00" className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
                  <p style={{ fontSize: '11px', color: '#a3a3a3', margin: '4px 0 0' }}>Cap. + Int.</p>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} disabled={loading} style={{
              flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', backgroundColor: '#fff',
              color: '#525252', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
            }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#0a0a0a',
              color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Procesando...' : 'Guardar Préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
