// features/dashboard/components/TypeDistributionChart.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { Venture } from '@backend/_shared/types'
import { VENTURE_TYPE_LABELS } from '@/shared/lib/constants'
import { formatCurrency } from '@/shared/lib/formatters'

interface TypeDistributionChartProps {
  ventures: Venture[]
}

const TYPE_COLORS: Record<string, string> = {
  software: '#7F77DD',
  physical: '#1D9E75',
  investment: '#378ADD',
  mixed: '#EF9F27',
}

export function TypeDistributionChart({ ventures }: TypeDistributionChartProps) {
  const totalInvested = ventures.reduce((sum, v) => sum + v.invested, 0)

  if (totalInvested === 0) {
    return (
      <div 
        className="animate-fade-in"
        style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #e5e5e5', 
          borderRadius: '14px', 
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '315px',
          animationDelay: '300ms'
        }}
      >
        <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>Sin capital registrado aún</p>
      </div>
    )
  }

  // Agrupar por type
  const typeMap = ventures.reduce((acc, v) => {
    if (!acc[v.type]) acc[v.type] = 0
    acc[v.type] += v.invested
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(typeMap)
    .map(([type, value]) => ({
      type,
      name: VENTURE_TYPE_LABELS[type] || type,
      value,
      percentage: (value / totalInvested) * 100
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)

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
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 16px' }}>
        Distribución por tipo
      </h3>
      
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ height: '180px', width: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.type] || '#a3a3a3'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '10px',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), 'Capital']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: TYPE_COLORS[item.type] || '#a3a3a3' }} />
                <span style={{ color: '#525252' }}>{item.name}</span>
                <span style={{ color: '#a3a3a3', fontSize: '11px' }}>{item.percentage.toFixed(1)}%</span>
              </div>
              <span style={{ fontWeight: 500, color: '#171717' }}>{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
