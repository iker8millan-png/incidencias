import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart3, ClipboardList, FilePlus2, LogOut, Menu, Users, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { isUsingLocalMode } from '../lib/auth'
import { APP_TITLE, COMPANY_NAME } from '../lib/constants'
import { Logo } from './Logo'
import { PwaInstallHint } from './PwaInstallHint'
import { Button } from './ui'

const nav = [
  { to: '/nueva', label: 'Nueva', icon: FilePlus2, short: 'Nueva incidencia' },
  { to: '/listado', label: 'Listado', icon: ClipboardList, short: 'Listado' },
  { to: '/estadisticas', label: 'Estadísticas', icon: BarChart3, short: 'Estadísticas' },
  { to: '/personas', label: 'Personas', icon: Users, short: 'Personas' },
]

export function Layout() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const initials = session?.displayName
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="app-bg min-h-dvh">
      <header className="glass-panel sticky top-0 z-40 border-b border-brand-100/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl p-2 text-brand-800 transition hover:bg-brand-50 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menú"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            <NavLink to="/nueva" className="flex items-center gap-3">
              <Logo height={36} className="hidden sm:block" />
              <Logo height={32} className="sm:hidden" />
              <div className="hidden md:block">
                <p className="font-serif text-sm font-semibold tracking-wide text-brand-800">
                  {COMPANY_NAME}
                </p>
                <p className="text-[11px] font-medium text-brand-500">
                  {APP_TITLE}
                  {isUsingLocalMode() && ' · local'}
                </p>
              </div>
            </NavLink>
          </div>

          <nav className="hidden items-center gap-1 rounded-2xl border border-brand-100 bg-white/70 p-1 lg:flex">
            {nav.map(({ to, label, icon: Icon, short }) => (
              <NavLink
                key={to}
                to={to}
                title={short}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-700 text-white shadow-md shadow-brand-700/25'
                      : 'text-brand-800/70 hover:bg-brand-50 hover:text-brand-900'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-brand-100 bg-white/90 px-2.5 py-1.5 sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-xs font-bold text-brand-800">
                {initials || '?'}
              </span>
              <span className="max-w-[8rem] truncate text-xs font-semibold text-brand-900/80">
                {session?.displayName}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-xl">
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-brand-50 px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {nav.map(({ to, label, icon: Icon, short }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'text-brand-900/80 hover:bg-brand-50'
                    }`
                  }
                >
                  <Icon size={18} />
                  {short || label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-brand-100/60 py-6 text-center">
        <Logo height={28} className="mx-auto mb-2 opacity-80" />
        <p className="text-xs font-medium text-brand-400">
          {COMPANY_NAME} · registro permanente
        </p>
      </footer>

      <PwaInstallHint />
    </div>
  )
}
