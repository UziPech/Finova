// features/dashboard/components/DashboardView.tsx — Vista principal monochrome
import { useEffect } from 'react'
import { useVentures } from '@/features/ventures/hooks/useVentures'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { calculateROI } from '@/features/ventures/utils'
import { formatCurrency, formatROI } from '@/shared/lib/formatters'
import { MetricCard } from './MetricCard'
import { MonthlyChart } from './MonthlyChart'
import { RedVentures } from './RedVentures'

export function DashboardView() {
  const { ventures, loading: venturesLoading } = useVentures()
  const { transactions, loading: txLoading, fetchTransactions } = useTransactions()

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const loading = venturesLoading || txLoading

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div className="skeleton" style={{ height: '28px', width: '160px', marginBottom: '4px' }} />
          <div className="skeleton" style={{ height: '16px', width: '260px' }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '128px', borderRadius: '14px' }} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }} />
          <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }} />
        </div>
      </div>
    )
  }

  if (ventures.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          backgroundColor: '#171717',
          border: '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <svg style={{ width: '32px', height: '32px', color: '#a3a3a3' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 3vw, 28px)', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', margin: '0 0 12px 0', textAlign: 'center' }}>
          Bienvenido a Finova
        </h1>
        <p style={{ fontSize: '15px', color: '#737373', maxWidth: '400px', textAlign: 'center', margin: '0 0 32px 0', lineHeight: 1.6 }}>
          Aún no tienes ventures registrados. Comienza tu viaje financiero creando tu primer venture para empezar a monitorear tus transacciones.
        </p>
        <button
          onClick={() => window.location.href = '/ventures'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '12px',
            backgroundColor: '#0a0a0a',
            color: '#fafafa',
            fontSize: '15px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#262626' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Crear tu primer venture
        </button>
      </div>
    )
  }

  const totalInvested = ventures.reduce((sum, v) => sum + v.invested, 0)
  const totalReturned = ventures.reduce((sum, v) => sum + v.returned, 0)
  const activeVentures = ventures.filter((v) => v.status === 'active')
  const rois = activeVentures.map((v) => calculateROI(v.invested, v.returned))
  const avgROI = rois.length > 0 ? rois.reduce((a, b) => a + b, 0) / rois.length : 0
  const netProfitVal = totalReturned - totalInvested

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="animate-fade-in">
        <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
          Resumen de {ventures.length} venture{ventures.length !== 1 ? 's' : ''} · {transactions.length} transacciones
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total invertido"
          value={formatCurrency(totalInvested)}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          }
          delay={0}
        />
        <MetricCard
          title="Total retornado"
          value={formatCurrency(totalReturned)}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          delay={50}
        />
        <MetricCard
          title="Ganancia neta"
          value={formatCurrency(netProfitVal)}
          trend={{
            value: formatROI(avgROI),
            positive: netProfitVal >= 0,
          }}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
            </svg>
          }
          delay={100}
        />
        <MetricCard
          title="Ventures activos"
          value={String(activeVentures.length)}
          subtitle={`de ${ventures.length} totales`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          }
          delay={150}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyChart transactions={transactions} />
        <RedVentures ventures={ventures} />
      </div>
    </div>
  )
}

