// features/dashboard/components/RedVentures.tsx — Monochrome premium
import { formatCurrency } from '@/shared/lib/formatters'
import { calculateROI, calculateHealth } from '@/features/ventures/utils'
import type { Venture } from '@backend/_shared/types'

interface RedVenturesProps {
  ventures: Venture[]
}

export function RedVentures({ ventures }: RedVenturesProps) {
  const red = ventures.filter((v) => {
    if (v.status === 'closed') return false
    
    if (v.mode === 'personal') {
      return v.returned > v.invested // Spent more than budget
    }
    
    // Business mode
    return v.invested > v.returned
  })

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
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 12px' }}>Atención Requerida</h3>
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
          ¡Todos tus proyectos y presupuestos están saludables!
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
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0 }}>Atención Requerida</h3>
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
          const isPersonal = v.mode === 'personal'
          const metricValue = isPersonal 
            ? calculateHealth(v.invested, v.returned)
            : calculateROI(v.invested, v.returned)
            
          const loss = isPersonal 
            ? v.returned - v.invested // Overbudget amount
            : v.invested - v.returned // Unrecovered investment
            
          const lossLabel = isPersonal ? 'Excedente:' : 'Falta:'
          
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
                  {lossLabel} {formatCurrency(loss)}
                </p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', flexShrink: 0 }}>
                {isPersonal ? 'Agotado' : `${metricValue.toFixed(1)}%`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
