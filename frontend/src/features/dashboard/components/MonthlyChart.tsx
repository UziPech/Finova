// features/dashboard/components/MonthlyChart.tsx — Monochrome bar chart
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { Transaction } from '@backend/_shared/types'

interface MonthlyChartProps {
  transactions: Transaction[]
}

interface MonthData {
  month: string
  income: number
  expense: number
}

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function aggregateByMonth(transactions: Transaction[]): MonthData[] {
  const now = new Date()
  const months: MonthData[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const month = MONTH_NAMES[d.getMonth()]

    const income = transactions
      .filter((t) => t.type === 'income' && t.date.startsWith(key))
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(key))
      .reduce((sum, t) => sum + t.amount, 0)

    months.push({ month, income, expense })
  }

  return months
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const data = aggregateByMonth(transactions)

  return (
    <div
      className="animate-fade-in"
      style={{
        backgroundColor: '#fff',
        borderRadius: '14px',
        padding: '20px',
        border: '1px solid #e5e5e5',
        animationDelay: '200ms',
      }}
    >
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 16px' }}>
        Flujo mensual — Últimos 6 meses
      </h3>
      <div style={{ height: '256px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: '#737373' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val: number) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : String(val)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '10px',
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
              formatter={(value, name) => [
                `$${Number(value).toLocaleString('es-MX')}`,
                name === 'income' ? 'Ingresos' : 'Gastos',
              ]}
            />
            <Legend
              formatter={(value: string) => (value === 'income' ? 'Ingresos' : 'Gastos')}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Bar dataKey="income" fill="#171717" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#d4d4d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
