import {
  GLOSARIO_DIETAS,
  GLOSARIO_PROCESOS,
  GLOSARIO_TRATAMIENTOS,
} from './glosarioDietasTratamientos'

export type ListadoTipo = 'general' | 'dietas' | 'tratamientos' | 'procesos'

export type ListadoConceptoCampo = 'dieta' | 'tratamiento' | 'proceso'

export const LISTADO_TIPOS: {
  id: ListadoTipo
  label: string
  title: string
  hint: string
  campo?: ListadoConceptoCampo
}[] = [
  {
    id: 'general',
    label: 'General',
    title: 'Listado general',
    hint: 'Todos los registros con filtros completos.',
  },
  {
    id: 'tratamientos',
    label: 'Tratamientos',
    title: 'Listado por tratamientos',
    hint: 'Incidencias con tratamiento indicado. Filtra por tipo concreto si quieres.',
    campo: 'tratamiento',
  },
  {
    id: 'dietas',
    label: 'Dietas',
    title: 'Listado por dietas',
    hint: 'Incidencias con dieta indicada. Filtra por tipo concreto si quieres.',
    campo: 'dieta',
  },
  {
    id: 'procesos',
    label: 'Procesos',
    title: 'Listado por procesos',
    hint: 'Incidencias con proceso indicado. Filtra por tipo concreto si quieres.',
    campo: 'proceso',
  },
]

export function parseListadoTipo(value: string | null): ListadoTipo {
  if (value && LISTADO_TIPOS.some((t) => t.id === value)) {
    return value as ListadoTipo
  }
  return 'general'
}

export function listadoTipoMeta(tipo: ListadoTipo) {
  return LISTADO_TIPOS.find((t) => t.id === tipo) ?? LISTADO_TIPOS[0]
}

export function conceptosParaTipo(tipo: ListadoTipo): string[] {
  const grupos =
    tipo === 'dietas'
      ? GLOSARIO_DIETAS
      : tipo === 'tratamientos'
        ? GLOSARIO_TRATAMIENTOS
        : tipo === 'procesos'
          ? GLOSARIO_PROCESOS
          : []

  return grupos.flatMap((g) => g.items.map((i) => i.nombre))
}
