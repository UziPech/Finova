// features/dashboard/components/VentureStatusList.tsx
import type { Venture } from '@backend/_shared/types'
import { calculateROI, ventureHealth } from '@/features/ventures/utils'
import { formatROI } from '@/shared/lib/formatters'
import { VENTURE_TYPE_LABELS } from '@/shared/lib/constants'

interface VentureStatusListProps {
  ventures: Venture[]
}

type ActionBadge = {
  label: string
  bg: string
  color: string
  border: string
}

function getActionBadge(roi: number, diffDays: number, status: string): ActionBadge {
  if (status === 'paused')
    return { label: 'Pausado', bg: '#f5f5f5', color: '#737373', border: '#e5e5e5' }
  if (roi < -30 || (roi < 0 && diffDays > 120))
    return { label: 'Revisar', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
  if (roi < 0)
    return { label: 'En rojo', bg: '#fef2f2', color: '#ef4444', border: '#fecaca' }
  if (roi >= 0 && roi < 15)
    return { label: 'Vigilar', bg: '#fefce8', color: '#a16207', border: '#fde68a' }
  if (roi >= 15 && roi < 40)
    return { label: 'Mantener', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
  return { label: 'Escalar', bg: '#f0fdf4', color: '#15803d', border: '#86efac' }
}

function getDotColor(health: string): string {
  if (health === 'positive') return '#22c55e'
  if (health === 'negative') return '#ef4444'
  return '#eab308'
}

function getDaysActive(startDate: string): number {
  const start = new Date(startDate)
  const now = new Date()
  return Math.ceil(Math.abs(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

function formatTimeSince(days: number): string {
  if (days < 30) return `${days} días`
  const months = Math.floor(days / 30)
  return `${months} ${months === 1 ? 'mes' : 'meses'}`
}

export function VentureStatusList({ ventures }: VentureStatusListProps) {
  const relevantVentures = ventures.filter(
    (v) => v.status === 'active' || v.status === 'paused'
  )

  const redCount = relevantVentures.filter((v) => {
    const roi = calculateROI(v.invested, v.returned)
    return roi < 0 && v.status === 'active'
  }).length

  const ventureData = relevantVentures
    .map((v) => {
      const roi = calculateROI(v.invested, v.returned)
      const health = ventureHealth(roi)
      const days = getDaysActive(v.start_date)
      const badge = getActionBadge(roi, days, v.status)
      return { venture: v, roi, health, days, badge }
    })
    .sort((a, b) => b.roi - a.roi)

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
        {ventureData.map(({ venture, roi, health, days, badge }, idx) => (
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

            {/* ROI */}
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
              {formatROI(roi)}
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
