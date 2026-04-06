// features/dashboard/components/MetricCard.tsx — Monochrome premium card
interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: string; positive: boolean }
  delay?: number
}

export function MetricCard({ title, value, subtitle, icon, trend, delay = 0 }: MetricCardProps) {
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#525252',
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            fontSize: '12px',
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: trend.positive ? '#f0fdf4' : '#fef2f2',
            color: trend.positive ? '#16a34a' : '#dc2626',
          }}>
            <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d={trend.positive ? 'M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25' : 'M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25'} />
            </svg>
            {trend.value}
          </span>
        )}
      </div>
      <p style={{ fontSize: '24px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>{value}</p>
      <p style={{ fontSize: '13px', color: '#737373', margin: '2px 0 0' }}>{title}</p>
      {subtitle && <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '4px 0 0' }}>{subtitle}</p>}
    </div>
  )
}
