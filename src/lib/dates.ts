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

function periodoIntersectaRango(
  inicio: string,
  fin: string,
  filtroDesde: string,
  filtroHasta: string,
): boolean {
  return inicio <= filtroHasta && fin >= filtroDesde
}

type LegacyIncidencia = Incidencia & {
  dietaFecha?: string
  tratamientoFecha?: string
  procesoFecha?: string
  desde?: string
  hasta?: string
}

function periodosApartados(item: LegacyIncidencia): Array<[string, string]> {
  const legacy = item
  return [
    [item.dietaDesde || legacy.dietaFecha || '', item.dietaHasta || ''],
    [
      item.tratamientoDesde || legacy.tratamientoFecha || legacy.desde || '',
      item.tratamientoHasta || legacy.hasta || '',
    ],
    [item.procesoDesde || legacy.procesoFecha || '', item.procesoHasta || ''],
  ]
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
  if (item.createdAt) puntos.add(item.createdAt.slice(0, 10))

  for (const punto of puntos) {
    if (punto >= desde && punto <= hasta) return true
  }

  if (options?.periodoTratamiento) {
    for (const [inicio, fin] of periodosApartados(item as LegacyIncidencia)) {
      if (!isIsoDate(inicio)) continue
      const finPeriodo = isIsoDate(fin) ? fin : inicio
      if (periodoIntersectaRango(inicio, finPeriodo, desde, hasta)) return true
    }
  }

  return puntos.size === 0
}
