// apps/web/src/shared/lib/constants.ts

export const DEFAULT_CURRENCY = 'MXN'
export const LOCALE = 'es-MX'

export const VENTURE_TYPE_LABELS: Record<string, string> = {
  software: 'Software',
  physical: 'Físico',
  investment: 'Inversión',
  mixed: 'Mixto',
}

export const VENTURE_STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  paused: 'Pausado',
  closed: 'Cerrado',
  idea: 'Idea',
}

export const VENTURE_MODE_LABELS: Record<string, string> = {
  business: 'Negocio',
  personal: 'Personal / Hogar',
}

export const VENTURE_MODE_METRICS: Record<string, { invested: string; returned: string; roi: string }> = {
  business: { invested: 'Invertido', returned: 'Retornado', roi: 'ROI' },
  personal: { invested: 'Presupuesto', returned: 'Gastado', roi: 'Salud' },
}
