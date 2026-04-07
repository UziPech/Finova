// features/dashboard/components/DashboardLoans.tsx — Resumen de Préstamos Activos
import { useEffect } from 'react'
import { useLoans } from '@/features/loans/hooks/useLoans'
import { formatCurrency, formatDate } from '@/shared/lib/formatters'

export function DashboardLoans() {
  const { loans, loading, fetchLoans } = useLoans()

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  // Solo mostrar préstamos activos o en mora
  const activeLoans = loans.filter(l => l.status !== 'paid')

  if (loading) {
    return <div className="skeleton" style={{ height: '320px', borderRadius: '14px', width: '100%' }} />
  }

  if (activeLoans.length === 0) {
    return null // Si no hay préstamos activos, no mostramos la sección para evitar ruido
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        padding: '20px',
        border: '1px solid #e5e5e5',
        width: '100%'
      }}
    >
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 16px' }}>
        Préstamos y Financiación Activa
      </h3>

      <div style={{ display: 'grid', gap: '12px' }}>
        {activeLoans.map((loan) => {
          const hasPayments = loan.loan_payments && loan.loan_payments.length > 0
          const nextPayment = hasPayments ? loan.loan_payments?.find(p => p.status === 'pending') : null

          return (
            <div
              key={loan.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: '#fafafa',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ flex: '1 1 auto', minWidth: '180px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 4px' }}>{loan.name}</p>
                <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>Restante: {formatCurrency(loan.principal)}</p>
              </div>

              {nextPayment && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '11px', color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 2px' }}>Próx. pago ({formatDate(nextPayment.due_date)})</p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#9a3412', margin: 0 }}>{formatCurrency(nextPayment.amount)}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
