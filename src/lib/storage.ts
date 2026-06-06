import type { Incidencia, IncidenciaFilters, Persona } from '../types'
import { normalizeEstados } from './estados'
import { normalizePersona } from './habitaciones'
import { formatListaConOtros, normalizeLista } from './listas'
import { matchesIncidenciaFechaFilter } from './dates'
import { formatTratamientos, normalizeTratamientos } from './tratamientos'

const KEYS = {
  personas: 'appincidencias_personas',
  incidencias: 'appincidencias_incidencias',
  session: 'appincidencias_session',
  seeded: 'appincidencias_seeded',
} as const

const CLEAN_VERSION_KEY = 'appincidencias_clean_v4'

function migrateFromDemoIfNeeded(): void {
  if (read(CLEAN_VERSION_KEY, false)) return

  localStorage.removeItem('appincidencias_demo_incidencias_v3')
  localStorage.removeItem('appincidencias_tratamiento_prueba_mes')
  localStorage.removeItem('appincidencias_workers')
  write(KEYS.personas, [])
  write(KEYS.incidencias, [])
  write(CLEAN_VERSION_KEY, true)
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function uid(): string {
  return crypto.randomUUID()
}

export function seedIfNeeded(): void {
  migrateFromDemoIfNeeded()
  if (read(KEYS.seeded, false)) return

  write(KEYS.personas, [])
  write(KEYS.incidencias, [])
  write(KEYS.seeded, true)
}

export function getPersonas(): Persona[] {
  seedIfNeeded()
  return read<Persona[]>(KEYS.personas, [])
    .map(normalizePersona)
    .sort((a, b) => a.ala.localeCompare(b.ala) || a.codigo.localeCompare(b.codigo))
}

export function savePersona(input: Omit<Persona, 'id' | 'createdAt'> & { id?: string }): Persona {
  const list = getPersonas()
  const now = new Date().toISOString()

  if (input.id) {
    const idx = list.findIndex((p) => p.id === input.id)
    if (idx === -1) throw new Error('Persona no encontrada')
    const updated: Persona = { ...list[idx], ...input, id: input.id, createdAt: list[idx].createdAt }
    list[idx] = updated
    write(KEYS.personas, list)
    return updated
  }

  const codigoExists = list.some(
    (p) => p.codigo.toLowerCase() === input.codigo.trim().toLowerCase(),
  )
  if (codigoExists) throw new Error('Ya existe una persona con ese código')

  const created: Persona = {
    id: uid(),
    codigo: input.codigo.trim().toUpperCase(),
    nombre: input.nombre.trim(),
    ala: input.ala,
    habitacion: input.habitacion.trim(),
    createdAt: now,
  }
  write(KEYS.personas, [...list, created])
  return created
}

export function deletePersona(id: string): void {
  const list = getPersonas().filter((p) => p.id !== id)
  write(KEYS.personas, list)
}

export function getIncidencias(): Incidencia[] {
  seedIfNeeded()
  return read<Incidencia[]>(KEYS.incidencias, [])
    .map((item) => ({
      ...item,
      estado: normalizeEstados(item.estado as string | string[]),
      estadoOtros: item.estadoOtros ?? '',
      ctesGlucemia: item.ctesGlucemia ?? '',
      ctesPeso: item.ctesPeso ?? '',
      prioridad: item.prioridad ?? '',
      dieta: normalizeLista(item.dieta as string | string[]),
      dietaOtros: item.dietaOtros ?? '',
      tratamiento: normalizeTratamientos(item.tratamiento),
      tratamientoOtros: item.tratamientoOtros ?? '',
      tratamientoOtrosHora: item.tratamientoOtrosHora ?? '',
      tratamientoOtrosForma: item.tratamientoOtrosForma ?? '',
      tratamientoOtrosFormaOtros: item.tratamientoOtrosFormaOtros ?? '',
      proceso: normalizeLista(item.proceso as string | string[]),
      procesoOtros: item.procesoOtros ?? '',
      firmaDibujo: item.firmaDibujo ?? '',
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function createIncidencia(
  data: Omit<Incidencia, 'id' | 'createdAt'>,
): Incidencia {
  seedIfNeeded()
  const item: Incidencia = {
    ...data,
    tratamiento: normalizeTratamientos(data.tratamiento),
    tratamientoOtros: data.tratamientoOtros ?? '',
    tratamientoOtrosHora: data.tratamientoOtrosHora ?? '',
    tratamientoOtrosForma: data.tratamientoOtrosForma ?? '',
    tratamientoOtrosFormaOtros: data.tratamientoOtrosFormaOtros ?? '',
    firmaDibujo: data.firmaDibujo ?? '',
    id: uid(),
    createdAt: new Date().toISOString(),
  }
  const existing = read<Incidencia[]>(KEYS.incidencias, [])
  write(KEYS.incidencias, [...existing, item])
  return item
}

export function filterIncidencias(
  items: Incidencia[],
  filters: IncidenciaFilters,
  personas: Persona[] = [],
  options?: { periodoTratamiento?: boolean },
): Incidencia[] {
  const q = filters.q.trim().toLowerCase()
  const personaIdsAla = filters.ala
    ? new Set(personas.filter((p) => p.ala === filters.ala).map((p) => p.id))
    : null

  return items.filter((item) => {
    if (filters.personaId && item.personaId !== filters.personaId) return false
    if (personaIdsAla && !personaIdsAla.has(item.personaId)) return false
    if (filters.turno && item.turno !== filters.turno) return false
    if (filters.de && item.de !== filters.de) return false
    if (filters.a && item.a !== filters.a) return false
    if (
      !matchesIncidenciaFechaFilter(item, filters.fechaDesde, filters.fechaHasta, {
        periodoTratamiento: options?.periodoTratamiento,
      })
    ) {
      return false
    }
    if (!q) return true

    const blob = [
      formatListaConOtros(item.estado, item.estadoOtros),
      item.incidencia,
      item.lesiones,
      formatListaConOtros(item.dieta, item.dietaOtros),
      formatTratamientos(
        item.tratamiento,
        item.tratamientoOtros,
        item.tratamientoOtrosHora,
        item.tratamientoOtrosForma,
        item.tratamientoOtrosFormaOtros,
      ),
      formatListaConOtros(item.proceso, item.procesoOtros),
      item.observaciones,
      item.firma,
    ]
      .join(' ')
      .toLowerCase()

    return blob.includes(q)
  })
}
