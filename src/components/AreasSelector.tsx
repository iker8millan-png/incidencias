import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, X } from 'lucide-react'
import type { AreaCode } from '../types'
import { AREAS, areaLabel } from '../lib/constants'
import { formatAreasCodes } from '../lib/areas'
import { selectClass } from './ui'

interface AreasSelectorProps {
  value: AreaCode[]
  onChange: (value: AreaCode[]) => void
  placeholder?: string
}

interface MenuPosition {
  top: number
  left: number
  width: number
}

export function AreasSelector({
  value,
  onChange,
  placeholder = 'Seleccionar áreas…',
}: AreasSelectorProps) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  function updateMenuPosition() {
    const trigger = rootRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    setMenuPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    })
  }

  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null)
      return
    }
    updateMenuPosition()
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)
    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  function toggle(code: AreaCode) {
    if (value.includes(code)) {
      onChange(value.filter((v) => v !== code))
    } else {
      onChange([...value, code])
    }
  }

  function remove(code: AreaCode, event: React.MouseEvent) {
    event.stopPropagation()
    onChange(value.filter((v) => v !== code))
  }

  const summary = value.length ? formatAreasCodes(value) : placeholder

  const menu =
    open && menuPos
      ? createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-multiselectable="true"
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              zIndex: 9999,
            }}
            className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
          >
            {AREAS.map((area) => {
              const checked = value.includes(area.code)
              return (
                <label
                  key={area.code}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
                    checked ? 'bg-brand-50 text-brand-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                    checked={checked}
                    onChange={() => toggle(area.code)}
                  />
                  <span className="min-w-0 truncate">
                    <span className="font-medium">{area.code}</span>
                    <span className="text-slate-500"> · {area.label}</span>
                  </span>
                </label>
              )
            })}
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`${selectClass} flex w-full items-center justify-between gap-2 text-left`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`min-w-0 truncate ${value.length ? 'text-slate-800' : 'text-slate-400'}`}>
          {summary}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {value.map((code) => (
            <button
              key={code}
              type="button"
              onClick={(event) => remove(code, event)}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-900 ring-1 ring-brand-200 transition hover:bg-red-50 hover:text-red-700 hover:ring-red-200"
              title={`Quitar ${areaLabel(code)}`}
            >
              {code}
              <X size={11} />
            </button>
          ))}
        </div>
      )}

      {menu}
    </div>
  )
}
