// features/dashboard/components/RedVentures.tsx — Monochrome premium
import { formatCurrency } from '@/shared/lib/formatters'
import { calculateROI } from '@/features/ventures/utils'
import type { Venture } from '@backend/_shared/types'

interface RedVenturesProps {
  ventures: Venture[]
}

export function RedVentures({ ventures }: RedVenturesProps) {
  const red = ventures.filter((v) => v.invested > v.returned && v.status !== 'closed')

  if (red.length === 0) {
    return (
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid #e5e5e5',
          animationDelay: '300ms',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 12px' }}>Ventures en rojo</h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px',
          borderRadius: '10px',
          backgroundColor: '#f0fdf4',
          color: '#16a34a',
          fontSize: '13px',
          fontWeight: 500,
        }}>
          <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ¡Todos tus ventures están en positivo!
        </div>
      </div>
    )
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        padding: '20px',
        border: '1px solid #e5e5e5',
        animationDelay: '300ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0 }}>Ventures en rojo</h3>
        <span style={{
          padding: '1px 8px',
          borderRadius: '999px',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          fontSize: '11px',
          fontWeight: 500,
        }}>
          {red.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {red.map((v) => {
          const roi = calculateROI(v.invested, v.returned)
          const loss = v.invested - v.returned
          return (
            <div key={v.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: '#fafafa',
              transition: 'background-color 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#171717', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</p>
                <p style={{ fontSize: '12px', color: '#737373', margin: '2px 0 0' }}>
                  Falta: {formatCurrency(loss)}
                </p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', flexShrink: 0 }}>
                {roi.toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
