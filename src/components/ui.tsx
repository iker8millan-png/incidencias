import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Check, Inbox } from 'lucide-react'

const variants = {
  primary:
    'bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-sm shadow-brand-700/25 hover:from-brand-500 hover:to-brand-600 hover:shadow-md hover:shadow-brand-600/30 active:scale-[0.98]',
  secondary:
    'border border-slate-200/90 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]',
  ghost: 'text-brand-700 hover:bg-brand-50/80 active:scale-[0.98]',
  danger:
    'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-sm shadow-red-600/20 hover:from-red-400 hover:to-red-500 active:scale-[0.98]',
} as const

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-5 py-3 text-base rounded-2xl',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

interface FieldProps {
  label: string
  htmlFor?: string
  hint?: string
  children: ReactNode
  required?: boolean
}

export function Field({ label, htmlFor, hint, children, required }: FieldProps) {
  const labelText = (
    <>
      {label}
      {required && <span className="text-red-500"> *</span>}
    </>
  )

  return (
    <div className="block space-y-2">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700">
          {labelText}
        </label>
      ) : (
        <span className="block text-sm font-semibold text-slate-700">{labelText}</span>
      )}
      {children}
      {hint && <p className="text-xs leading-relaxed text-slate-500">{hint}</p>}
    </div>
  )
}

export const inputClass =
  'w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'

export const selectClass = inputClass

export function Card({
  children,
  className = '',
  padding = true,
}: {
  children: ReactNode
  className?: string
  padding?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white shadow-[var(--shadow-card)] ${padding ? 'p-5 sm:p-6' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="animate-fade-up">
        <h1 className="font-serif text-2xl font-semibold tracking-wide text-brand-900 sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0 animate-fade-up">{action}</div>}
    </div>
  )
}

export function Badge({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'brand' | 'warn' | 'success'
}) {
  const tones = {
    default: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/60',
    brand: 'bg-brand-50 text-brand-800 ring-1 ring-brand-200/80',
    warn: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80',
    success: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Inbox size={24} />
      </div>
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  )
}

export function Callout({
  title,
  children,
  tone = 'info',
  className = '',
}: {
  title: string
  children: ReactNode
  tone?: 'info' | 'warn'
  className?: string
}) {
  const styles =
    tone === 'warn'
      ? 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 text-amber-950'
      : 'border-brand-200/60 bg-gradient-to-br from-brand-50/80 to-brand-100/40 text-brand-950'

  return (
    <div className={`rounded-2xl border px-4 py-3.5 text-sm shadow-sm ${styles} ${className}`}>
      <p className="font-semibold">{title}</p>
      <div className="mt-1 leading-relaxed opacity-90">{children}</div>
    </div>
  )
}

export function WizardSteps({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <div className="mb-8 animate-fade-up">
      <div className="hidden items-center sm:flex">
        {steps.map((label, i) => {
          const done = i < current
          const active = i === current
          return (
            <div key={label} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    active
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-4 ring-brand-100'
                      : done
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white text-slate-400 ring-1 ring-slate-200'
                  }`}
                >
                  {done ? <Check size={16} strokeWidth={2.5} /> : i + 1}
                </div>
                <span
                  className={`max-w-[5.5rem] text-center text-[11px] font-semibold leading-tight ${
                    active ? 'text-brand-800' : done ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 mb-6 h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                    i < current ? 'bg-brand-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Paso {current + 1} de {steps.length}
          </span>
          <span className="text-brand-700">{Math.round(((current + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 ease-out"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-800">{steps[current]}</p>
      </div>
    </div>
  )
}

export function TabGroup<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  className?: string
}) {
  return (
    <div
      className={`inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-sm ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            value === opt.id
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">{children}</h2>
  )
}
