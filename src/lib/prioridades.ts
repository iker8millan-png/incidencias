import type { Prioridad } from '../types'

export type { Prioridad }

export const PRIORIDADES: {
  value: Exclude<Prioridad, ''>
  label: string
  short: string
  selectedClass: string
  badgeClass: string
}[] = [
  {
    value: 'baja',
    label: 'Baja',
    short: 'Baja',
    selectedClass: 'border-slate-300 bg-slate-100 text-slate-800 ring-2 ring-slate-300',
    badgeClass: 'bg-slate-100 text-slate-700',
  },
  {
    value: 'normal',
    label: 'Normal',
    short: 'Normal',
    selectedClass: 'border-brand-400 bg-brand-50 text-brand-900 ring-2 ring-brand-300',
    badgeClass: 'bg-brand-100 text-brand-800',
  },
  {
    value: 'alta',
    label: 'Alta',
    short: 'Alta',
    selectedClass: 'border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-300',
    badgeClass: 'bg-amber-100 text-amber-900',
  },
  {
    value: 'urgente',
    label: 'Urgente',
    short: 'Urgente',
    selectedClass: 'border-red-400 bg-red-50 text-red-900 ring-2 ring-red-300',
    badgeClass: 'bg-red-100 text-red-800',
  },
]

export function prioridadLabel(value: Prioridad): string {
  if (!value) return '—'
  return PRIORIDADES.find((p) => p.value === value)?.label ?? value
}

export function prioridadBadgeClass(value: Prioridad): string {
  if (!value) return 'bg-slate-100 text-slate-600'
  return PRIORIDADES.find((p) => p.value === value)?.badgeClass ?? 'bg-slate-100 text-slate-700'
}
