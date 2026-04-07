// features/dashboard/components/MetricCard.tsx — Premium metric card
interface MetricCardProps {
  title: string
  value: string
  valueColor?: string
  subtitle?: string
  icon?: React.ReactNode
  trend?: { value: string; positive: boolean }
  delay?: number
}

export function MetricCard({ title, value, valueColor, subtitle, icon, trend, delay = 0 }: MetricCardProps) {
  return (
    <div
      className="animate-fade-in"
      style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        padding: '20px',
        border: '1px solid #e5e5e5',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        animationDelay: `${delay}ms`,
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'
        e.currentTarget.style.borderColor = '#d4d4d4'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#e5e5e5'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#737373',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          {title}
        </p>
        {icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#525252',
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>

      <p style={{
        fontSize: '28px',
        fontWeight: 700,
        color: valueColor || '#0a0a0a',
        letterSpacing: '-0.03em',
        margin: 0,
        lineHeight: 1.1,
      }}>
        {value}
      </p>

      {subtitle && (
        <p style={{ fontSize: '12px', color: '#a3a3a3', margin: 0 }}>{subtitle}</p>
      )}

      {trend && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: '4px',
          fontSize: '12px',
          fontWeight: 500,
          padding: '3px 10px',
          borderRadius: '999px',
          backgroundColor: trend.positive ? '#f0fdf4' : '#fef2f2',
          color: trend.positive ? '#16a34a' : '#dc2626',
          marginTop: '2px',
        }}>
          {trend.value}
        </span>
      )}
    </div>
  )
}
