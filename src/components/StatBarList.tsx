import type { ConteoItem } from '../lib/estadisticas'

export function StatKpi({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string | number
  hint?: string
  tone?: 'default' | 'brand' | 'warn' | 'danger'
}) {
  const tones = {
    default: 'border-slate-200/70 bg-white',
    brand: 'border-brand-200/60 bg-gradient-to-br from-brand-50/80 to-white',
    warn: 'border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-white',
    danger: 'border-red-200/60 bg-gradient-to-br from-red-50/80 to-white',
  }

  return (
    <div className={`rounded-2xl border p-4 shadow-[var(--shadow-card)] ${tones[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600/80">{label}</p>
      <p className="font-serif mt-1 text-3xl font-semibold tabular-nums text-brand-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function StatBarList({
  items,
  empty = 'Sin datos en este periodo.',
  maxPct,
}: {
  items: { label: string; count: number; pct: number }[]
  empty?: string
  maxPct?: number
}) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">{empty}</p>
  }

  const peak = maxPct ?? Math.max(...items.map((i) => i.pct), 1)

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
            <span className="min-w-0 truncate font-medium text-slate-800" title={item.label}>
              {item.label}
            </span>
            <span className="shrink-0 tabular-nums text-slate-500">
              {item.count}
              <span className="ml-1 text-xs text-brand-600">({item.pct}%)</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-brand-100/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-500"
              style={{ width: `${Math.max(4, (item.pct / peak) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function StatGrid({
  items,
}: {
  items: ConteoItem[]
}) {
  if (!items.length) return null

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-brand-100/80 bg-brand-50/40 px-3 py-2.5 text-center"
        >
          <p className="truncate text-xs font-medium text-brand-800" title={item.label}>
            {item.label}
          </p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-brand-900">{item.count}</p>
          <p className="text-[10px] font-semibold text-brand-600">{item.pct}%</p>
        </div>
      ))}
    </div>
  )
}
