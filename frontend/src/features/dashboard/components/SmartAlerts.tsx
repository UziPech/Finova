// features/dashboard/components/SmartAlerts.tsx — Tarjetas horizontales de alerta
import type { Venture, Transaction } from '@backend/_shared/types'
import { calculateROI } from '@/features/ventures/utils'
import { formatROI, formatCurrency } from '@/shared/lib/formatters'

interface SmartAlertsProps {
  ventures: Venture[]
  transactions: Transaction[]
}

interface AlertData {
  id: string
  title: string
  description: string
  actionLabel: string
  borderColor: string
  bgColor: string
  titleColor: string
  actionColor: string
}

export function SmartAlerts({ ventures, transactions }: SmartAlertsProps) {
  const alerts: AlertData[] = []
  const activeVentures = ventures.filter((v) => v.status === 'active')
  const now = new Date()

  // 1. Alerta Roja: Venture negativo por más de 60 días
  activeVentures.forEach((v) => {
    const roi = calculateROI(v.invested, v.returned)
    const startDate = new Date(v.start_date)
    const diffDays = Math.ceil(
      Math.abs(now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const months = Math.floor(diffDays / 30)

    if (roi < 0 && diffDays > 60) {
      const lost = v.invested - v.returned
      alerts.push({
        id: `red_${v.id}`,
        title: `${v.name} lleva ${months > 0 ? `${months} ${months === 1 ? 'mes' : 'meses'}` : `${diffDays} días`} en rojo`,
        description: `Has perdido ${formatCurrency(lost)} sin recuperación. Considera cerrarla.`,
        actionLabel: 'Analizar ↗',
        borderColor: '#ef4444',
        bgColor: '#FCEBEB',
        titleColor: '#991b1b',
        actionColor: '#b91c1c',
      })
    }
  })

  // 2. Alerta Verde: Mejor venture (ROI positivo)
  if (activeVentures.length > 0) {
    let bestVenture = activeVentures[0]
    let bestROI = calculateROI(bestVenture.invested, bestVenture.returned)

    for (let i = 1; i < activeVentures.length; i++) {
      const currentROI = calculateROI(activeVentures[i].invested, activeVentures[i].returned)
      if (currentROI > bestROI) {
        bestROI = currentROI
        bestVenture = activeVentures[i]
      }
    }

    if (bestROI > 0) {
      alerts.push({
        id: 'green_best',
        title: `${bestVenture.name} tiene el mayor ROI (${formatROI(bestROI)})`,
        description: `Es tu mejor venture. ¿Estás invirtiendo suficiente en él?`,
        actionLabel: 'Escalar ↗',
        borderColor: '#22c55e',
        bgColor: '#EAF3DE',
        titleColor: '#14532d',
        actionColor: '#15803d',
      })
    }
  }

  // 3. Alerta Amarilla: Gastos mensuales elevados
  const expensesByMonth: Record<string, number> = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const key = t.date.substring(0, 7)
      expensesByMonth[key] = (expensesByMonth[key] || 0) + t.amount
    })

  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const currentExpenses = expensesByMonth[currentMonthKey] || 0

  let past3Sum = 0
  let past3Count = 0
  for (let i = 1; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (expensesByMonth[k] !== undefined) {
      past3Sum += expensesByMonth[k]
      past3Count++
    }
  }

  if (past3Count > 0) {
    const avg = past3Sum / past3Count
    if (avg > 0 && currentExpenses > avg * 1.15) {
      const pctOver = (((currentExpenses - avg) / avg) * 100).toFixed(0)
      alerts.push({
        id: 'yellow_expense',
        title: `Gasto subió ${pctOver}% este mes`,
        description: `${formatCurrency(currentExpenses)} vs promedio de ${formatCurrency(avg)}. Revisa categorías.`,
        actionLabel: 'Revisar ↗',
        borderColor: '#eab308',
        bgColor: '#FAEEDA',
        titleColor: '#713f12',
        actionColor: '#a16207',
      })
    }
  }

  // 5. Alerta Gris/Azul: Proyectos en fase de IDEA o CERRADO
  const ideaCount = ventures.filter((v) => v.status === 'idea').length
  const closedCount = ventures.filter((v) => v.status === 'closed').length

  if (ideaCount > 0) {
    alerts.push({
      id: 'info_idea',
      title: `${ideaCount} proyecto${ideaCount > 1 ? 's' : ''} en fase de idea`,
      description: 'No aparecen en ROI aún. Cámbialos a "Activo" para ver sus métricas.',
      actionLabel: 'Ver proyectos ↗',
      borderColor: '#a3a3a3',
      bgColor: '#fafafa',
      titleColor: '#525252',
      actionColor: '#737373',
    })
  }

  if (closedCount > 0) {
    alerts.push({
      id: 'info_closed',
      title: `${closedCount} proyecto${closedCount > 1 ? 's' : ''} cerrado${closedCount > 1 ? 's' : ''}`,
      description: 'Histórico guardado pero excluido de métricas actuales.',
      actionLabel: 'Ver archivo ↗',
      borderColor: '#a3a3a3',
      bgColor: '#f5f5f5',
      titleColor: '#737373',
      actionColor: '#a3a3a3',
    })
  }

  const displayAlerts = alerts.slice(0, 4)

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
