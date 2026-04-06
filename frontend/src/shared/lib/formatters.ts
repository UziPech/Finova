// apps/web/src/shared/lib/formatters.ts

export function formatCurrency(
  amount: number,
  currency = 'MXN',
  locale = 'es-MX'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string, locale = 'es-MX'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatROI(roi: number): string {
  const sign = roi > 0 ? '+' : ''
  return `${sign}${roi.toFixed(2)}%`
}
