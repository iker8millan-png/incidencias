import type { Prioridad } from '../lib/prioridades'
import { PRIORIDADES } from '../lib/prioridades'

interface PrioridadTagsProps {
  value: Prioridad
  onChange: (value: Prioridad) => void
}

export function PrioridadTags({ value, onChange }: PrioridadTagsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">Prioridad</p>
      <div className="flex flex-wrap gap-2">
        {PRIORIDADES.map((p) => {
          const selected = value === p.value
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(selected ? '' : p.value)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                selected
                  ? p.selectedClass
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-slate-500">Opcional. Toca otra vez para quitar la etiqueta.</p>
    </div>
  )
}

export function PrioridadBadge({ value }: { value: Prioridad }) {
  if (!value) return null
  const p = PRIORIDADES.find((item) => item.value === value)
  if (!p) return null
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${p.badgeClass}`}
    >
      {p.label}
    </span>
  )
}
