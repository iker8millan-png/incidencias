import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthSession } from '../types'
import { getSession, login as authLogin, loginAsAdmin as authLoginAsAdmin, logout as authLogout } from '../lib/auth'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

const SESSION_KEY = 'appincidencias_session'

interface AuthContextValue {
  session: AuthSession | null
  loading: boolean
  isAdmin: boolean
  login: (password: string) => Promise<void>
  loginAsAdmin: (centerPassword: string, adminPassword: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function sessionFromSupabaseUser(
  user: {
    id: string
    user_metadata?: Record<string, unknown>
  },
  role: AuthSession['role'] = 'staff',
): AuthSession {
  return {
    workerId: user.id,
    displayName:
      role === 'admin'
        ? 'Administrador'
        : (user.user_metadata?.displayName as string | undefined) || 'Personal del centro',
    role,
  }
}

function persistSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSession(getSession())
      setLoading(false)
      return
    }

    const supabaseClient = getSupabase()
    if (!supabaseClient) {
      setSession(getSession())
      setLoading(false)
      return
    }

    const db: SupabaseClient = supabaseClient
    let cancelled = false

    async function initSupabaseAuth() {
      const { data, error } = await db.auth.getSession()
      if (cancelled) return

      if (error || !data.session?.user) {
        persistSession(null)
        setSession(null)
        setLoading(false)
        return
      }

      const stored = getSession()
      const role = stored?.role === 'admin' ? 'admin' : 'staff'
      const next = sessionFromSupabaseUser(data.session.user, role)
      persistSession(next)
      setSession(next)
      setLoading(false)
    }

    void initSupabaseAuth()

    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, authSession) => {
      if (cancelled) return

      if (authSession?.user) {
        const stored = getSession()
        const role = stored?.role === 'admin' ? 'admin' : 'staff'
        const next = sessionFromSupabaseUser(authSession.user, role)
        persistSession(next)
        setSession(next)
      } else {
        persistSession(null)
        setSession(null)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (password: string) => {
    const next = await authLogin(password)
    setSession(next)
  }, [])

  const loginAsAdmin = useCallback(async (centerPassword: string, adminPassword: string) => {
    const next = await authLoginAsAdmin(centerPassword, adminPassword)
    setSession(next)
  }, [])

  const logout = useCallback(async () => {
    await authLogout()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      loading,
      isAdmin: session?.role === 'admin',
      login,
      loginAsAdmin,
      logout,
    }),
    [session, loading, login, loginAsAdmin, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
