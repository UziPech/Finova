import { useState } from 'react'
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

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      padding: '20px'
    }}>
      <div className="animate-scale-in" style={{
        backgroundColor: '#fff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>
            Nuevo Préstamo
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer', padding: '4px',
            display: 'flex', transition: 'color 0.15s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3' }}
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Nombre / Acreedor</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Banco, Inversionista..." className="form-input" style={{ width: '100%' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Principal ($)</label>
              <input type="number" required min="0" step="0.01" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="0.00" className="form-input" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Interés (%)</label>
              <input type="number" min="0" step="0.01" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="0.0" className="form-input" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Fecha de Emisión</label>
            <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="form-input" style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <input 
              type="checkbox" 
              id="generatePayments" 
              checked={generatePayments} 
              onChange={e => setGeneratePayments(e.target.checked)} 
              style={{ width: '16px', height: '16px', accentColor: '#0a0a0a', cursor: 'pointer' }}
            />
            <label htmlFor="generatePayments" style={{ fontSize: '13px', color: '#525252', cursor: 'pointer', userSelect: 'none' }}>
              Generar cronograma de pagos
            </label>
          </div>

          {generatePayments && (
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', backgroundColor: '#fafafa', borderRadius: '10px', border: '1px solid #f5f5f5' }}>
               <div>
                 <label style={{ display: 'block', fontSize: '12px', color: '#737373', marginBottom: '4px' }}>Meses</label>
                 <input type="number" required min="1" value={paymentCount} onChange={e => setPaymentCount(e.target.value)} className="form-input" style={{ width: '100%', padding: '8px' }} />
               </div>
               <div>
                 <label style={{ display: 'block', fontSize: '12px', color: '#737373', marginBottom: '4px' }}>Cuota Mensual ($)</label>
                 <input type="number" required min="0.01" step="0.01" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="form-input" style={{ width: '100%', padding: '8px' }} />
               </div>
             </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} disabled={loading} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5e5e5', backgroundColor: '#fff',
              color: '#525252', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s'
            }}>Cancelar</button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#0a0a0a',
              color: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Guardando...' : 'Crear Préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
