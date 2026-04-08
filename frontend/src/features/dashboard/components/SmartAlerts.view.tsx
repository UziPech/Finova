// features/dashboard/components/SmartAlerts.tsx — Tarjetas horizontales de alerta
import { useEffect } from 'react'
import type { Venture, Transaction } from '@backend/_shared/types'
import { useSmartAlerts } from '../hooks/useSmartAlerts'
import { useLoans } from '@/features/loans/hooks/useLoans'

interface SmartAlertsProps {
  ventures: Venture[]
  transactions: Transaction[]
}



export function SmartAlerts({ ventures, transactions }: SmartAlertsProps) {
  const { loans, fetchLoans } = useLoans()

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  const { displayAlerts } = useSmartAlerts(ventures, transactions, loans)

  if (displayAlerts.length === 0) {
    return (
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid #e5e5e5',
          animationDelay: '400ms',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 12px' }}>
          Alertas inteligentes
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#f0fdf4',
            borderRadius: '10px',
          }}
        >
          <svg
            style={{ width: '18px', height: '18px', color: '#16a34a', flexShrink: 0 }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span style={{ fontSize: '14px', color: '#166534', fontWeight: 500 }}>
            Todo en orden. No hay alertas críticas.
          </span>
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
        animationDelay: '400ms',
      }}
    >
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 12px' }}>
        Alertas inteligentes
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        {displayAlerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              borderLeft: `3px solid ${alert.borderColor}`,
              backgroundColor: alert.bgColor,
              borderRadius: '0 10px 10px 0',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: alert.titleColor,
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {alert.title}
            </p>
            <p
              style={{
                fontSize: '12px',
                color: '#525252',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {alert.description}
            </p>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: alert.actionColor,
                marginTop: '4px',
                cursor: 'pointer',
              }}
            >
              {alert.actionLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
