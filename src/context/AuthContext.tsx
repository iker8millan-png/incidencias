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
import { getSession, login as authLogin, logout as authLogout } from '../lib/auth'

interface AuthContextValue {
  session: AuthSession | null
  loading: boolean
  login: (password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSession(getSession())
    setLoading(false)
  }, [])

  const login = useCallback(async (password: string) => {
    const next = await authLogin(password)
    setSession(next)
  }, [])

  const logout = useCallback(async () => {
    await authLogout()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, loading, login, logout }),
    [session, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
