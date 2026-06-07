import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { GLOSARIO_ESTADOS_GRUPOS, findEstado } from '../lib/constants'
import { OtrosField } from './OtrosField'
import { Button, Field, inputClass } from './ui'

interface EstadosSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  otro?: string
  onOtroChange?: (value: string) => void
}

export function EstadosSelector({ value, onChange, otro = '', onOtroChange }: EstadosSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const filteredGroups = useMemo(() => {
    if (!q) return GLOSARIO_ESTADOS_GRUPOS
    return GLOSARIO_ESTADOS_GRUPOS.map((grupo) => ({
      ...grupo,
      estados: grupo.estados.filter((e) => e.nombre.toLowerCase().startsWith(q)),
    })).filter((grupo) => grupo.estados.length > 0)
  }, [q])

  function toggle(nombre: string) {
    if (value.includes(nombre)) {
      onChange(value.filter((v) => v !== nombre))
    } else {
      onChange([...value, nombre])
    }
  }

  function remove(nombre: string) {
    onChange(value.filter((v) => v !== nombre))
  }

  function closePanel() {
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-brand-200 bg-brand-50/50 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-800">
              Seleccionados ({value.length})
            </p>
            {value.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {value.map((nombre) => (
                  <button
                    key={nombre}
                    type="button"
                    onClick={() => remove(nombre)}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-brand-900 shadow-sm ring-1 ring-brand-200 transition hover:bg-red-50 hover:text-red-700 hover:ring-red-200"
                    title="Quitar"
                  >
                    {nombre}
                    <X size={12} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Ningún estado marcado todavía.</p>
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
          <Field label="Buscar en el glosario" htmlFor="estado-search">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="estado-search"
                className={`${inputClass} pl-9`}
                placeholder="Escribe el inicio del nombre (ej. po → POLIDIPSIA)…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </Field>

          <div className="max-h-[420px] space-y-4 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/40 p-3">
            {filteredGroups.map((grupo) => (
              <section key={grupo.categoria}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {grupo.categoria}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {grupo.estados.map((estado) => {
                    const checked = value.includes(estado.nombre)
                    return (
                      <label
                        key={estado.nombre}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition ${
                          checked
                            ? 'border-brand-400 bg-white shadow-sm ring-1 ring-brand-200'
                            : 'border-slate-200 bg-white hover:border-brand-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                          checked={checked}
                          onChange={() => toggle(estado.nombre)}
                        />
                        <span>
                          <span className="font-medium text-slate-800">{estado.nombre}</span>
                          {estado.significado && (
                            <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                              {estado.significado}
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
              <p className="py-6 text-center text-sm text-slate-500">No hay estados que coincidan.</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="secondary" size="sm" onClick={closePanel}>
              Listo — ocultar glosario
            </Button>
          </div>

          {value.length === 1 && findEstado(value[0])?.ejemplos && (
            <p className="text-xs text-slate-500">
              <span className="font-medium">Ejemplos: </span>
              {findEstado(value[0])?.ejemplos}
            </p>
          )}
        </>
      )}

      {onOtroChange && <OtrosField value={otro} onChange={onOtroChange} />}
    </div>
  )
}
