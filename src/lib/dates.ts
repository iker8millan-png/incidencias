import type { Incidencia } from '../types'

/** Fecha local en formato YYYY-MM-DD (sin desfase UTC). */
export function localDateISO(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function localDateDaysAgo(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return localDateISO(d)
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

/**
 * Comprueba si una incidencia entra en el rango de fechas del listado.
 * Sin filtros de fecha, siempre devuelve true.
 */
export function matchesIncidenciaFechaFilter(
  item: Incidencia,
  fechaDesde: string,
  fechaHasta: string,
  options?: { periodoTratamiento?: boolean },
): boolean {
  if (!fechaDesde && !fechaHasta) return true

  const desde = fechaDesde || '0000-01-01'
  const hasta = fechaHasta || '9999-12-31'

  const puntos = new Set<string>()
  if (isIsoDate(item.fecha)) puntos.add(item.fecha)
  if (options?.periodoTratamiento) {
    if (isIsoDate(item.desde)) puntos.add(item.desde)
    if (isIsoDate(item.hasta)) puntos.add(item.hasta)
  }
  if (item.createdAt) puntos.add(item.createdAt.slice(0, 10))

  for (const punto of puntos) {
    if (punto >= desde && punto <= hasta) return true
  }

  if (options?.periodoTratamiento && isIsoDate(item.desde)) {
    const fin = isIsoDate(item.hasta) ? item.hasta : item.desde
    if (item.desde <= hasta && fin >= desde) return true
  }

  return puntos.size === 0
}
