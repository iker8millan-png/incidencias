import { formatDate } from './constants'

export function formatApartadoPeriodo(desde: string, hasta: string): string {
  if (desde && hasta) return `${formatDate(desde)} → ${formatDate(hasta)}`
  if (desde) return `Desde ${formatDate(desde)}`
  if (hasta) return `Hasta ${formatDate(hasta)}`
  return ''
}
