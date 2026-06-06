import { useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import type { GlosarioGrupo } from '../lib/glosarioDietasTratamientos'
import { OtrosField } from './OtrosField'
import { Button, Field, inputClass } from './ui'

interface GlosarioSelectorProps {
  grupos: GlosarioGrupo[]
  value: string[]
  onChange: (value: string[]) => void
  searchId: string
  emptyLabel?: string
  selectedLabel?: string
  defaultOpen?: boolean
  otro?: string
  onOtroChange?: (value: string) => void
}

export function GlosarioSelector({
  grupos,
  value,
  onChange,
  searchId,
  emptyLabel = 'Ninguno seleccionado todavía.',
  selectedLabel = 'Seleccionados',
  defaultOpen = false,
  otro = '',
  onOtroChange,
}: GlosarioSelectorProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const valueRef = useRef(value)
  valueRef.current = value

  const filteredGroups = useMemo(() => {
    if (!q) return grupos
    return grupos
      .map((grupo) => ({
        ...grupo,
        items: grupo.items.filter((item) => item.nombre.toLowerCase().startsWith(q)),
      }))
      .filter((grupo) => grupo.items.length > 0)
  }, [grupos, q])

  function toggle(nombre: string) {
    const current = valueRef.current
    if (current.includes(nombre)) {
      onChange(current.filter((v) => v !== nombre))
    } else {
      onChange([...current, nombre])
    }
  }

  function remove(nombre: string) {
    onChange(valueRef.current.filter((v) => v !== nombre))
  }

  function closePanel() {
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-50/80 to-brand-100/40 px-4 py-3.5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-800">
              {selectedLabel} ({value.length})
            </p>
            {value.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {value.map((nombre) => (
                  <button
                    key={nombre}
                    type="button"
                    onClick={() => remove(nombre)}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-900 shadow-sm ring-1 ring-brand-200/80 transition-all duration-200 hover:bg-red-50 hover:text-red-700 hover:ring-red-200"
                    title="Quitar"
                  >
                    {nombre}
                    <X size={12} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-1.5 text-sm text-slate-500">{emptyLabel}</p>
            )}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="shrink-0"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <>
                Cerrar
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                Elegir
                <ChevronDown size={14} />
              </>
            )}
          </Button>
        </div>
      </div>

      {open && (
        <>
          <Field label="Buscar" htmlFor={searchId}>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id={searchId}
                className={`${inputClass} pl-9`}
                placeholder="Escribe el inicio del nombre…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </Field>

          <div className="max-h-72 space-y-4 overflow-y-auto rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-inner">
            {filteredGroups.map((grupo) => (
              <section key={grupo.categoria}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {grupo.categoria}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {grupo.items.map((item) => {
                    const checked = value.includes(item.nombre)
                    return (
                      <label
                        key={item.nombre}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 ${
                          checked
                            ? 'border-brand-400 bg-white shadow-sm ring-2 ring-brand-100'
                            : 'border-slate-200/80 bg-white hover:border-brand-300 hover:shadow-sm'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                          checked={checked}
                          onChange={() => toggle(item.nombre)}
                        />
                        <span>
                          <span className="font-medium text-slate-800">{item.nombre}</span>
                          {item.significado && (
                            <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                              {item.significado}
                            </span>
                          )}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </section>
            ))}

            {!filteredGroups.length && (
              <p className="py-6 text-center text-sm text-slate-500">No hay coincidencias.</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onMouseDown={(e) => e.preventDefault()}
              onClick={closePanel}
            >
              Listo — ocultar listado
            </Button>
          </div>
        </>
      )}

      {onOtroChange && (
        <OtrosField value={otro} onChange={onOtroChange} />
      )}
    </div>
  )
}
