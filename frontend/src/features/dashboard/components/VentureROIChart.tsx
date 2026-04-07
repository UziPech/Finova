// features/dashboard/components/VentureROIChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Venture } from '@backend/_shared/types'
import { calculateROI, ventureHealth } from '@/features/ventures/utils'
import { formatROI } from '@/shared/lib/formatters'

interface VentureROIChartProps {
  ventures: Venture[]
}

export function VentureROIChart({ ventures }: VentureROIChartProps) {
  const activeBusinessVentures = ventures.filter(
    (v) => (v.status === 'active' || v.status === 'paused') && v.mode !== 'personal'
  )
  
  if (activeBusinessVentures.length === 0) {
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
          minHeight: '200px',
          animationDelay: '250ms'
        }}
      >
        <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>No hay negocios activos para medir el ROI</p>
      </div>
    )
  }

  const data = activeBusinessVentures.map(v => {
    const roi = calculateROI(v.invested, v.returned)
    return {
      name: v.name,
      roi,
      health: ventureHealth(roi)
    }
  }).sort((a, b) => b.roi - a.roi)

  const minHeight = Math.max((data.length * 44) + 80, 200)

  return (
    <div
      className="animate-fade-in"
      style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        padding: '20px',
        border: '1px solid #e5e5e5',
        animationDelay: '250ms',
      }}
    >
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 16px' }}>
        ¿A cuál meterle más? — ranking por ROI
      </h3>
      <div style={{ height: `${minHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={true} vertical={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#171717', fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '10px',
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
              formatter={(value: any) => [formatROI(Number(value)), 'ROI']}
              cursor={{ fill: '#f5f5f5' }}
            />
            <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => {
                let color = '#a3a3a3' // neutral
                if (entry.health === 'positive') color = '#22c55e'
                if (entry.health === 'negative') color = '#ef4444'
                
                return <Cell key={`cell-${index}`} fill={color} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
