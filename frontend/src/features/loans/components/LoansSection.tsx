import { useState, useEffect } from 'react'
import { useLoans } from '../hooks/useLoans'
import { LoanForm } from './LoanForm'
import { formatCurrency, formatDate } from '@/shared/lib/formatters'

interface LoansSectionProps {
  ventureId: string
}

export function LoansSection({ ventureId }: LoansSectionProps) {
  const { loans, loading, fetchLoans, createLoan, deleteLoan } = useLoans(ventureId)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  const handleCreate = async (input: any) => {
    await createLoan(input)
  }

  return (
    <div className="animate-fade-in" style={{
      backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5',
      overflow: 'hidden', animationDelay: '150ms', marginTop: '24px'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid #f5f5f5',
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
          Préstamos & Financiación
          <span style={{ color: '#a3a3a3', fontWeight: 400, marginLeft: '6px' }}>({loans.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '8px',
            backgroundColor: '#f5f5f5', color: '#525252', fontSize: '13px', fontWeight: 500,
            border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e5e5e5'; e.currentTarget.style.color = '#0a0a0a' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = '#525252' }}
        >
          <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Préstamo
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: '64px', borderRadius: '10px' }} />)}
        </div>
      ) : loans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 20px' }}>
          <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>No hay préstamos registrados</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px', padding: '16px' }}>
          {loans.map((loan) => {
            const hasPayments = loan.loan_payments && loan.loan_payments.length > 0;
            const nextPayment = hasPayments ? loan.loan_payments?.find(p => p.status === 'pending') : null;

            return (
              <div
                key={loan.id}
                style={{
                  padding: '16px', transition: 'box-shadow 0.2s',
                  border: '1px solid #f0f0f0', borderRadius: '12px',
                  backgroundColor: '#fafafa',
                  display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <div style={{ flex: '1 1 auto', minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#171717', margin: 0 }}>
                      {loan.name}
                    </p>
                    <span style={{ 
                      fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 500, letterSpacing: '0.02em',
                      backgroundColor: loan.status === 'active' ? '#e0e7ff' : loan.status === 'paid' ? '#dcfce7' : '#fee2e2',
                      color: loan.status === 'active' ? '#4338ca' : loan.status === 'paid' ? '#15803d' : '#b91c1c'
                    }}>
                      {loan.status === 'active' ? 'ACTIVO' : loan.status === 'paid' ? 'PAGADO' : 'MORA'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>
                    Inició: <span style={{ color: '#525252' }}>{formatDate(loan.start_date)}</span>
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100px' }}>
                    <span style={{ fontSize: '11px', color: '#737373', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monto Restante</span>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#171717' }}>{formatCurrency(loan.principal)}</span>
                  </div>
                  
                  {nextPayment ? (
                    <div style={{ backgroundColor: '#fff7ed', padding: '8px 16px', borderRadius: '8px', border: '1px solid #ffedd5', minWidth: '140px' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: '#c2410c', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Próx Cuota ({formatDate(nextPayment.due_date)})</span>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: '#9a3412' }}>{formatCurrency(nextPayment.amount)}</span>
                    </div>
                  ) : hasPayments ? (
                     <div style={{ backgroundColor: '#f0fdf4', padding: '8px 16px', borderRadius: '8px', border: '1px solid #dcfce7', minWidth: '140px' }}>
                       <span style={{ display: 'block', fontSize: '11px', color: '#16a34a', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Al día</span>
                       <span style={{ fontSize: '14px', fontWeight: 500, color: '#15803d' }}>Pagos completos</span>
                     </div>
                  ) : (
                    <div style={{ backgroundColor: '#f5f5f5', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', minWidth: '140px' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: '#737373', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Estado de Pago</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#525252' }}>Sin pagos generados</span>
                    </div>
                  )}

                  <button
                    onClick={() => deleteLoan(loan.id)}
                    style={{
                      padding: '8px', borderRadius: '8px', background: '#fff', border: '1px solid #e5e5e5',
                      cursor: 'pointer', color: '#a3a3a3', transition: 'all 0.15s', display: 'flex', alignItems: 'center'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.backgroundColor = '#fef2f2' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3'; e.currentTarget.style.borderColor = '#e5e5e5'; e.currentTarget.style.backgroundColor = '#fff' }}
                    title="Eliminar"
                  >
                    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <LoanForm 
          ventureId={ventureId} 
          onSubmit={handleCreate} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  )
}
