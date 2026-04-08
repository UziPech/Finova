// features/dashboard/components/VentureStatusList.tsx
import type { Venture } from '@backend/_shared/types'
import { formatROI } from '@/shared/lib/formatters'
import { VENTURE_TYPE_LABELS } from '@/shared/lib/constants'
import { useVentureStatus, formatTimeSince, getDotColor } from '../hooks/useVentureStatus'

interface VentureStatusListProps {
  ventures: Venture[]
}

export function VentureStatusList({ ventures }: VentureStatusListProps) {
  const { ventureData, redCount } = useVentureStatus(ventures)

  if (ventureData.length === 0) {
    return (
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          animationDelay: '300ms',
        }}
      >
        <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>
          Sin ventures activos
        </p>
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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0 }}>
          Estado de ventures
        </h3>
        {redCount > 0 && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 12px',
              borderRadius: '999px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            }}
          >
            {redCount} en rojo
          </span>
        )}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {ventureData.map(({ venture, isPersonal, metricValue, health, days, badge }, idx) => (
          <div
            key={venture.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 0',
              borderBottom: idx < ventureData.length - 1 ? '1px solid #f5f5f5' : 'none',
            }}
          >
            {/* Dot */}
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: getDotColor(health),
                flexShrink: 0,
              }}
            />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#171717',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {venture.name}
              </p>
              <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '1px 0 0' }}>
                {VENTURE_TYPE_LABELS[venture.type] || venture.type} · {formatTimeSince(days)}
              </p>
            </div>

            {/* ROI / Health */}
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color:
                  health === 'positive'
                    ? '#16a34a'
                    : health === 'negative'
                      ? '#dc2626'
                      : '#a16207',
                whiteSpace: 'nowrap',
              }}
            >
              {isPersonal ? `${metricValue}%` : formatROI(metricValue)}
            </span>

            {/* Action Badge */}
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 12px',
                borderRadius: '999px',
                backgroundColor: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.border}`,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
