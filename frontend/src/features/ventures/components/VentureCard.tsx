// features/ventures/components/VentureCard.tsx — Monochrome premium card
import { useNavigate } from 'react-router-dom'
import { formatCurrency, formatROI } from '@/shared/lib/formatters'
import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS, VENTURE_MODE_METRICS } from '@/shared/lib/constants'
import { calculateROI, ventureHealth, calculateHealth } from '../utils'
import type { Venture } from '../types'

interface VentureCardProps {
  venture: Venture
  delay?: number
}

const statusDotColors: Record<string, string> = {
  active: '#22c55e',
  paused: '#eab308',
  closed: '#a3a3a3',
  idea: '#737373',
}

export function VentureCard({ venture, delay = 0 }: VentureCardProps) {
  const navigate = useNavigate()
  const isPersonal = venture.mode === 'personal'
  
  const metricValue = isPersonal 
    ? calculateHealth(venture.invested, venture.returned)
    : calculateROI(venture.invested, venture.returned)
    
  // Para personal, health es positivo si queda mucho presupuesto. Para negocio, depende del ROI.
  // Podríamos reutilizar ventureHealth de utils, o adaptarlo
  const health = isPersonal
    ? (metricValue > 20 ? 'positive' : (metricValue > 0 ? 'neutral' : 'negative'))
    : ventureHealth(metricValue)

  const healthBg = health === 'positive' ? '#f0fdf4' : health === 'negative' ? '#fef2f2' : '#f5f5f5'
  const healthColor = health === 'positive' ? '#16a34a' : health === 'negative' ? '#dc2626' : '#525252'

  const labels = VENTURE_MODE_METRICS[venture.mode || 'business']

  return (
    <button
      onClick={() => navigate(`/ventures/${venture.id}`)}
      className="animate-fade-in"
      style={{
        width: '100%',
        textAlign: 'left',
        backgroundColor: '#fff',
        borderRadius: '14px',
        padding: '20px',
        border: '1px solid #e5e5e5',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        animationDelay: `${delay}ms`,
        display: 'block',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
        e.currentTarget.style.borderColor = '#d4d4d4'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#e5e5e5'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {venture.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusDotColors[venture.status] || '#a3a3a3' }} />
            <span style={{ fontSize: '12px', color: '#737373' }}>{VENTURE_STATUS_LABELS[venture.status]}</span>
            <span style={{ fontSize: '12px', color: '#d4d4d4' }}>·</span>
            <span style={{ fontSize: '12px', color: '#737373' }}>{VENTURE_TYPE_LABELS[venture.type]}</span>
          </div>
        </div>
        <span style={{
          fontSize: '13px',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '8px',
          backgroundColor: healthBg,
          color: healthColor,
        }} title={labels.roi}>
          {isPersonal ? `${metricValue}%` : formatROI(metricValue)}
        </span>
      </div>

      {/* Financials */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 2px' }}>{labels.invested}</p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>{formatCurrency(venture.invested)}</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 2px' }}>{labels.returned}</p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>{formatCurrency(venture.returned)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ height: '4px', backgroundColor: '#f5f5f5', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: '999px',
              transition: 'width 0.5s ease',
              backgroundColor: health === 'positive' ? '#22c55e' : health === 'negative' ? '#ef4444' : '#a3a3a3',
              width: `${Math.min(100, venture.invested > 0 ? (venture.returned / venture.invested) * 100 : 0)}%`,
            }}
          />
        </div>
      </div>
    </button>
  )
}
