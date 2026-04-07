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
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null)

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  const handleCreate = async (input: any) => {
    await createLoan(input)
  }

  const toggleExpand = (id: string) => {
    setExpandedLoanId((prev) => (prev === id ? null : id))
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
            const isExpanded = expandedLoanId === loan.id;

            return (
              <div
                key={loan.id}
                style={{
                  border: '1px solid #f0f0f0', borderRadius: '12px',
                  backgroundColor: '#fafafa', overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                }}
              >
                {/* Cabecera del préstamo */}
                <div 
                  onClick={() => toggleExpand(loan.id)}
                  style={{
                    padding: '16px 20px', display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 1fr 1fr auto', gap: '24px',
                    alignItems: 'center', cursor: 'pointer', transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fdfdfd' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {loan.name}
                      </p>
                      <span style={{ 
                        fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.04em',
                        backgroundColor: loan.status === 'active' ? '#e0e7ff' : loan.status === 'paid' ? '#dcfce7' : '#fee2e2',
                        color: loan.status === 'active' ? '#4338ca' : loan.status === 'paid' ? '#15803d' : '#b91c1c'
                      }}>
                        {loan.status === 'active' ? 'ACTIVO' : loan.status === 'paid' ? 'PAGADO' : 'MORA'}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#737373', margin: 0 }}>
                      Tasa: {loan.interest_rate}% <span style={{ margin: '0 4px', color: '#e5e5e5' }}>|</span> Inició: {formatDate(loan.start_date)}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: '#a3a3a3', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monto Restante</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>{formatCurrency(loan.principal)}</span>
                  </div>
                  
                  <div>
                    {nextPayment ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '11px', color: '#c2410c', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', backgroundColor: '#f97316', borderRadius: '50%' }} />
                          Próx ({formatDate(nextPayment.due_date)})
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#b45309' }}>{formatCurrency(nextPayment.amount)}</span>
                      </div>
                    ) : hasPayments ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '11px', color: '#16a34a', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%' }} />
                          Al día
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#15803d' }}>Completado</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '11px', color: '#737373', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Estado</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#525252' }}>Sin cuotas</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteLoan(loan.id); }}
                      style={{
                        padding: '6px', borderRadius: '6px', background: 'transparent', border: 'none',
                        cursor: 'pointer', color: '#d4d4d4', transition: 'all 0.15s', display: 'flex', alignItems: 'center',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#d4d4d4'; e.currentTarget.style.backgroundColor = 'transparent' }}
                      title="Eliminar"
                    >
                      <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                    <div style={{ color: '#a3a3a3', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Detalles Expandidos (Cronograma) */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f0f0f0', backgroundColor: '#fff', padding: '16px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#171717', margin: '0 0 12px' }}>
                      Historial y Próximas Cuotas
                    </h4>
                    {hasPayments ? (
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {loan.loan_payments!.map((payment) => (
                          <div key={payment.id} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 12px', border: '1px solid #f5f5f5', borderRadius: '8px',
                            backgroundColor: payment.status === 'paid' ? '#fcfcfc' : payment.status === 'pending' ? '#fff' : '#fef2f2',
                            opacity: payment.status === 'paid' ? 0.7 : 1
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                backgroundColor: payment.status === 'paid' ? '#16a34a' : payment.status === 'pending' ? '#f97316' : '#dc2626'
                              }} />
                              <div>
                                <p style={{ fontSize: '12px', color: '#525252', margin: 0, fontWeight: 500 }}>
                                  {formatDate(payment.due_date)} {payment.payment_date && `(Pagado: ${formatDate(payment.payment_date)})`}
                                </p>
                                <p style={{ fontSize: '11px', color: '#a3a3a3', margin: '2px 0 0' }}>
                                  Monto total: {formatCurrency(payment.amount)}
                                </p>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0 }}>
                                {formatCurrency(payment.amount)}
                              </p>
                              <p style={{ fontSize: '11px', color: payment.status === 'paid' ? '#16a34a' : payment.status === 'pending' ? '#f97316' : '#dc2626', margin: '2px 0 0', fontWeight: 500 }}>
                                {payment.status === 'paid' ? 'Pagado' : payment.status === 'pending' ? 'Pendiente' : 'Atrasado'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#737373', margin: 0, fontStyle: 'italic' }}>
                        No hay cuotas programadas para este préstamo.
                      </p>
                    )}
                  </div>
                )}
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

