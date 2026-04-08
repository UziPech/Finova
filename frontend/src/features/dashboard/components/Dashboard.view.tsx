// features/dashboard/components/DashboardView.tsx — Centro de mando financiero
import { useEffect } from 'react'
import { useVentures } from '@/features/ventures/hooks/useVentures'
import { useTransactions } from '@/features/transactions/hooks/useTransactions'
import { useDashboardMetrics } from '../hooks/useDashboardMetrics'
import { formatCurrency, formatROI } from '@/shared/lib/formatters'
import { MetricCard } from './MetricCard'
import { MonthlyChart } from './MonthlyChart'
import { VentureROIChart } from './VentureROIChart'
import { TypeDistributionChart } from './TypeDistributionChart'
import { VentureStatusList } from './VentureStatusList.view'
import { SmartAlerts } from './SmartAlerts.view'
import { DashboardLoans } from './DashboardLoans'

export function DashboardView() {
  const { ventures, loading: venturesLoading } = useVentures()
  const { transactions, loading: txLoading, fetchTransactions } = useTransactions()

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // — Cálculos de métricas delegados al hook —
  const {
    totalInvested,
    totalReturned,
    activeVenturesCount,
    isPersonalMajority,
    avgMetric,
    metricTitle,
    trendText,
    monthTxCount,
    flujoLibre,
    flujoTrendText,
    capitalActivo
  } = useDashboardMetrics(ventures, transactions)

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
          Resumen Ejecutivo
        </h1>
        <p style={{ fontSize: '15px', color: '#737373', maxWidth: '400px', textAlign: 'center', margin: '0 0 32px 0', lineHeight: 1.6 }}>
          No existen proyectos registrados en el portafolio. Para habilitar las métricas de análisis, registre un nuevo venture.
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


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="animate-fade-in">
        <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>
          Centro de mando
        </h1>
        <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
          {ventures.length} venture{ventures.length !== 1 ? 's' : ''} · {monthTxCount} transacciones este mes
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Flujo libre este mes"
          value={`${flujoLibre >= 0 ? '+' : ''}${formatCurrency(flujoLibre)}`}
          valueColor={flujoLibre >= 0 ? '#16a34a' : '#dc2626'}
          trend={{ value: flujoTrendText, positive: flujoLibre >= 0 }}
          delay={0}
        />
        <MetricCard
          title="Capital total activo"
          value={formatCurrency(capitalActivo)}
          subtitle={`en ${activeVenturesCount} venture${activeVenturesCount !== 1 ? 's' : ''} activo${activeVenturesCount !== 1 ? 's' : ''}`}
          delay={50}
        />
        <MetricCard
          title={metricTitle}
          value={isPersonalMajority ? `${avgMetric.toFixed(0)}%` : formatROI(avgMetric)}
          valueColor={isPersonalMajority ? (avgMetric > 20 ? '#16a34a' : '#dc2626') : (avgMetric > 0 ? '#16a34a' : avgMetric < 0 ? '#dc2626' : undefined)}
          trend={{ value: trendText, positive: isPersonalMajority ? avgMetric > 20 : avgMetric >= 0 }}
          delay={100}
        />
        <MetricCard
          title="Total invertido"
          value={formatCurrency(totalInvested)}
          subtitle={`${formatCurrency(totalReturned)} retornado`}
          delay={150}
        />
      </div>

      {/* Fila A: Charts principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MonthlyChart transactions={transactions} />
        </div>
        <TypeDistributionChart ventures={ventures} />
      </div>

      {/* Fila B: ROI Comparativo + Estado de Ventures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VentureROIChart ventures={ventures} />
        <VentureStatusList ventures={ventures} />
      </div>

      {/* Fila C: Préstamos Globales */}
      <DashboardLoans />

      {/* Fila D: Alertas inteligentes */}
      <SmartAlerts ventures={ventures} transactions={transactions} />

      {/* Guía de colores — UX info */}
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#fafafa',
          borderRadius: '14px',
          padding: '16px 20px',
          border: '1px solid #f0f0f0',
          animationDelay: '500ms',
        }}
      >
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', margin: '0 0 10px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Guía de indicadores
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 28px', fontSize: '12px', color: '#525252' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            Verde = {isPersonalMajority ? 'Presupuesto saludable' : 'ROI positivo o rentable'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
            Amarillo = {isPersonalMajority ? 'Presupuesto ajustado' : 'Neutral, vigilar'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            Rojo = {isPersonalMajority ? 'Presupuesto agotado' : 'En pérdida, revisar'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
            Azul = Informativo
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a3a3a3' }} />
            Gris = Pausado o sin datos
          </span>
        </div>
      </div>
    </div>
  )
}
