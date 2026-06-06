import { useState, type FormEvent } from 'react'
import { ClipboardList, Lock, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { isLocalAuthConfigured, isUsingLocalMode } from '../lib/auth'
import { APP_TITLE, COMPANY_NAME } from '../lib/constants'
import { Logo } from '../components/Logo'
import { Button, Card, Field, inputClass } from '../components/ui'

export function LoginPage() {
  const { login } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="brand-panel relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

        <div className="relative flex flex-1 flex-col items-center justify-center px-12 py-16 text-white">
          <Logo height={120} className="mb-10 drop-shadow-lg" />
          <p className="font-serif text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            {COMPANY_NAME}
          </p>
          <h1 className="font-serif mt-5 max-w-md text-center text-4xl font-semibold leading-[1.15] tracking-wide">
            {APP_TITLE}
          </h1>
          <p className="mt-5 max-w-sm text-center text-base leading-relaxed text-white/75">
            Protocolo digital con formulario por pasos, filtros y exportación. Cada registro es
            permanente.
          </p>
        </div>

        <div className="relative mx-12 mb-12 space-y-4 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
          <p className="flex items-center gap-2 text-sm font-medium text-white/90">
            <ClipboardList size={16} />
            Turnos M · T · N · áreas DE → A
          </p>
          <p className="text-sm leading-relaxed text-white/65">
            Estado · incidencia · lesiones · caídas · hospital · tratamientos · constantes
          </p>
        </div>
      </div>

      <div className="app-bg relative flex items-center justify-center px-4 py-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -right-16 top-0 h-48 w-48 rounded-full bg-brand-200/50 blur-3xl" />
          <div className="absolute bottom-20 -left-16 h-40 w-40 rounded-full bg-brand-300/30 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md animate-fade-up">
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <Logo height={72} className="mb-4" />
            <p className="font-serif text-sm font-semibold tracking-wide text-brand-900">
              {COMPANY_NAME}
            </p>
            <h1 className="font-serif mt-2 text-xl font-semibold tracking-wide text-brand-800">
              {APP_TITLE}
            </h1>
            <p className="mt-1 text-sm text-brand-700/60">Acceso para personal del centro</p>
          </div>

          <Card className="border-brand-100/80 shadow-[var(--shadow-float)]">
            <div className="mb-6 hidden lg:block">
              <h2 className="font-serif text-xl font-semibold text-brand-900">Iniciar sesión</h2>
              <p className="mt-1 text-sm text-brand-700/60">
                Introduce la contraseña compartida del centro
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Contraseña" htmlFor="password" required>
                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-300"
                  />
                  <input
                    id="password"
                    type="password"
                    className={`${inputClass} pl-10`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Contraseña del centro"
                    required
                  />
                </div>
              </Field>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Entrando…' : 'Entrar'}
              </Button>
            </form>

            {isUsingLocalMode() && !isLocalAuthConfigured() && (
              <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3.5">
                <p className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles size={14} />
                  Configuración pendiente
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-amber-800/90">
                  El administrador debe definir la contraseña en el entorno de despliegue antes de
                  usar la aplicación.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
