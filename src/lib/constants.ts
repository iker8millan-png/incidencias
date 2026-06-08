import type { AreaCode, Turno } from '../types'

export const COMPANY_NAME = 'O Lecer Senior Care'
export const APP_TITLE = 'Registro de incidencias'

export const AREAS: { code: AreaCode; label: string }[] = [
  { code: 'A.D', label: 'Atención Directa' },
  { code: 'A.S', label: 'Área Sanitaria' },
  { code: 'A.T', label: 'Área Terapéutica' },
  { code: 'P.R', label: 'Profesional de Referencia' },
  { code: 'EQ', label: 'Equipo' },
  { code: 'A.C', label: 'Cocina' },
  { code: 'A.L', label: 'Limpieza' },
  { code: 'A.R', label: 'Refuerzo' },
  { code: 'A.CO', label: 'Coordinación' },
  { code: 'A.M', label: 'Mantenimiento' },
]

export const TURNOS: { code: Turno; label: string }[] = [
  { code: 'M', label: 'Mañana' },
  { code: 'T', label: 'Tarde' },
  { code: 'N', label: 'Noche' },
]

export { GLOSARIO_ESTADOS, GLOSARIO_ESTADOS_GRUPOS, findEstado } from './glosarioEstados'
export { formatEstados, normalizeEstados } from './estados'

export function areaLabel(code: AreaCode): string {
  return AREAS.find((a) => a.code === code)?.label ?? code
}

export function turnoLabel(code: Turno): string {
  return TURNOS.find((t) => t.code === code)?.label ?? code
}

export function formatDate(iso: string): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export { localDateISO as todayISO } from './dates'
